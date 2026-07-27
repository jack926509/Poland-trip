(function (root) {
  const dateKey = (date, timeZone) => {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(date).reduce((out, part) => ({ ...out, [part.type]: part.value }), {});
    return {
      iso: `${parts.year}-${parts.month}-${parts.day}`,
      day: `${parts.month}/${parts.day}`,
      mins: Number(parts.hour) * 60 + Number(parts.minute),
    };
  };
  const dayKey = (day) => day.date.slice(0, 5);

  function projectTripMoment(days, now = new Date(), override = null, tripMeta) {
    const clock = dateKey(now, tripMeta.timeZone);
    const matched = days.find((day) => dayKey(day) === clock.day);
    const phase = clock.iso < tripMeta.tripStart ? 'before' : clock.iso > tripMeta.tripEnd ? 'after' : 'during';
    const d = override
      ? days.find((day) => day.n === override) || days[0]
      : (phase === 'during' && matched) || (phase === 'before' ? days[0] : days[days.length - 1]);
    const stepMins = d.steps.map((step) => {
      const [hour, minute] = step.t.split(':').map(Number);
      return hour * 60 + minute;
    });
    let idx = 0;
    stepMins.forEach((minutes, index) => { if (minutes <= clock.mins) idx = index; });
    return {
      d, idx, now: d.steps[idx], next: d.steps[idx + 1], mins: clock.mins, phase,
      momentDay: matched?.n ?? null,
      beforeStart: clock.mins < stepMins[0],
      afterEnd: clock.mins > stepMins[stepMins.length - 1] + 60,
    };
  }

  function selectNextHardConstraint(constraints = [], mins = 0) {
    const timed = constraints.map((text) => {
      const match = text.match(/(?:^|\s)([01]\d|2[0-3]):([0-5]\d)(?:\s|$)/);
      return match ? { text, mins: Number(match[1]) * 60 + Number(match[2]) } : null;
    }).filter(Boolean).sort((a, b) => a.mins - b.mins);
    const next = timed.find((item) => item.mins >= mins);
    if (next) return { label: '下一個硬時間', text: next.text };
    const untimed = constraints.find((text) => !/(?:^|\s)([01]\d|2[0-3]):[0-5]\d(?:\s|$)/.test(text));
    return { label: '今日硬限制', text: untimed || '今日沒有未來硬時間' };
  }

  function selectHardConstraintForMoment(constraints, phase, displayedDay, momentDay, mins) {
    const cutoff = phase === 'during' && displayedDay === momentDay ? mins : 0;
    return selectNextHardConstraint(constraints, cutoff);
  }

  function readNotes(storage) {
    try {
      const notes = JSON.parse(storage.getItem('polska-notes') || '{}');
      if (!notes || typeof notes !== 'object' || Array.isArray(notes)) {
        return { notes: {}, persistent: false };
      }
      return { notes, persistent: true };
    }
    catch (_) { return { notes: {}, persistent: false }; }
  }

  function writeNotes(storage, notes) {
    try { storage.setItem('polska-notes', JSON.stringify(notes)); return true; }
    catch (_) { return false; }
  }

  var DEFAULT_SETTINGS = { fxRate: 7.7, budgetTWD: 21600 };
  var EXPENSE_CATEGORIES = [
    { key: 'food', label: '餐飲' },
    { key: 'ticket', label: '門票' },
    { key: 'transport', label: '交通' },
    { key: 'shop', label: '購物' },
  ];

  function readJSON(storage, key, fallback) {
    var clone = JSON.parse(JSON.stringify(fallback));
    try {
      var raw = storage && storage.getItem ? storage.getItem(key) : null;
      if (raw == null) return clone;
      var parsed = JSON.parse(raw);
      if (parsed == null) return clone;
      if (Array.isArray(fallback) !== Array.isArray(parsed)) return clone;
      if (typeof parsed !== typeof fallback) return clone;
      return parsed;
    } catch (e) {
      return clone;
    }
  }

  function writeJSON(storage, key, value) {
    try {
      if (!storage || !storage.setItem) return false;
      storage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  function plnToTwd(amountPLN, fxRate) {
    var a = Number(amountPLN), r = Number(fxRate);
    if (!isFinite(a) || !isFinite(r)) return 0;
    return Math.round(a * r);
  }

  function expenseTotals(expenses) {
    var by = { food: 0, ticket: 0, transport: 0, shop: 0 };
    var totalPLN = 0, count = 0;
    (expenses || []).forEach(function (e) {
      count += 1;
      var amt = Number(e && e.amountPLN) || 0;
      if (Object.prototype.hasOwnProperty.call(by, e && e.category)) {
        by[e.category] += amt;
        totalPLN += amt;
      }
    });
    return { count: count, totalPLN: totalPLN, byCategory: by };
  }

  function budgetStatus(totalPLN, fxRate, budgetTWD) {
    var spentTWD = plnToTwd(totalPLN, fxRate);
    var budget = Number(budgetTWD) || 0;
    var ratio = budget > 0 ? spentTWD / budget : 0;
    return { spentTWD: spentTWD, budgetTWD: budget, ratio: ratio, over: budget > 0 && spentTWD > budget };
  }

  // 波蘭 TAX FREE：門檻為「單張收據、同一店家」滿 200 PLN 含稅。
  // 不同收據不可合併——這是規定，不是簡化。實拿回約 10–18%（標準稅率 23%）。
  var TAX_FREE_MIN_PLN = 200;
  var TAX_FREE_NEAR_PLN = 150;
  var TAX_FREE_LOW_RATE = 0.10;
  var TAX_FREE_HIGH_RATE = 0.18;

  function taxRefundStatus(amountPLN, category) {
    var amt = Number(amountPLN);
    if (category !== 'shop' || !isFinite(amt) || amt <= 0) {
      return { state: 'none', shortfallPLN: 0 };
    }
    if (amt >= TAX_FREE_MIN_PLN) return { state: 'eligible', shortfallPLN: 0 };
    if (amt >= TAX_FREE_NEAR_PLN) {
      return { state: 'near', shortfallPLN: Math.round((TAX_FREE_MIN_PLN - amt) * 100) / 100 };
    }
    return { state: 'none', shortfallPLN: 0 };
  }

  function taxRefundEstimate(amountPLN, fxRate) {
    var amt = Number(amountPLN);
    var rate = Number(fxRate);
    if (!isFinite(amt) || amt <= 0 || !isFinite(rate) || rate <= 0) {
      return { lowTWD: 0, highTWD: 0 };
    }
    return {
      lowTWD: Math.round(amt * TAX_FREE_LOW_RATE * rate),
      highTWD: Math.round(amt * TAX_FREE_HIGH_RATE * rate),
    };
  }

  function taxRefundSummary(expenses, fxRate) {
    var count = 0, totalPLN = 0;
    (expenses || []).forEach(function (e) {
      if (!e || taxRefundStatus(e.amountPLN, e.category).state !== 'eligible') return;
      count += 1;
      totalPLN += Number(e.amountPLN) || 0;
    });
    var est = taxRefundEstimate(totalPLN, fxRate);
    return { count: count, totalPLN: totalPLN, lowTWD: est.lowTWD, highTWD: est.highTWD };
  }

  // 2026 年歐洲夏令時間於 10/25（十月最後一個週日）結束。
  // 本趟行程 10/24–10/31：10/24 為 CEST(UTC+2)，10/25 起為 CET(UTC+1)。
  // 只服務這段日期，不引入時區函式庫。
  var DST_END_MMDD = '10/25';

  function warsawOffsetHours(mmdd) {
    var parts = String(mmdd || '').split('/');
    var m = Number(parts[0]), d = Number(parts[1]);
    if (!isFinite(m) || !isFinite(d)) return 1;
    var endParts = DST_END_MMDD.split('/');
    var em = Number(endParts[0]), ed = Number(endParts[1]);
    if (m < em || (m === em && d < ed)) return 2;
    return 1;
  }

  function trainDepartureMs(train, year) {
    if (!train || !train.date || !train.dep) return NaN;
    var dparts = String(train.date).split('/');
    var tparts = String(train.dep).split(':');
    var m = Number(dparts[0]), d = Number(dparts[1]);
    var hh = Number(tparts[0]), mm = Number(tparts[1]);
    if (![m, d, hh, mm].every(isFinite)) return NaN;
    return Date.UTC(year, m - 1, d, hh - warsawOffsetHours(train.date), mm);
  }

  function nextTrain(trains, nowMs, year) {
    var list = trains || [];
    for (var i = 0; i < list.length; i += 1) {
      var ms = trainDepartureMs(list[i], year);
      if (!isFinite(ms) || ms < nowMs) continue;
      return { index: i, train: list[i], minutesUntil: Math.round((ms - nowMs) / 60000) };
    }
    return null;
  }

  function formatCountdown(minutes) {
    var mins = Number(minutes);
    if (!isFinite(mins) || mins <= 0) return '即將出發';
    if (mins < 60) return '還有 ' + mins + ' 分';
    if (mins < 60 * 24) {
      var h = Math.floor(mins / 60);
      var rest = mins % 60;
      return rest ? '還有 ' + h + ' 小時 ' + rest + ' 分' : '還有 ' + h + ' 小時';
    }
    return Math.floor(mins / (60 * 24)) + ' 天後';
  }

  root.PolskaPwaCore = {
    projectTripMoment, selectNextHardConstraint, selectHardConstraintForMoment, readNotes, writeNotes,
    DEFAULT_SETTINGS, EXPENSE_CATEGORIES, readJSON, writeJSON, plnToTwd, expenseTotals, budgetStatus,
    TAX_FREE_MIN_PLN, taxRefundStatus, taxRefundEstimate, taxRefundSummary,
    warsawOffsetHours, trainDepartureMs, nextTrain, formatCountdown,
  };
})(typeof window === 'undefined' ? globalThis : window);
