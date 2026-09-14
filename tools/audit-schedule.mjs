// tools/audit-schedule.mjs — 行程時間的結構稽核。
//
// 這支工具回答的是人腦記不住的問題：某天的步驟時刻有沒有倒退、某個
// 「★ 進館」步驟是不是排在該館末入場之後、轉場日離發車還剩幾分鐘。
// 檢查全部由 trip.js／tickets.js 的現有資料推得，不另建平行事實。
//
// 嚴重度分兩級，理由是誤判成本不同：
//   error   —— 純結構錯誤，不需要判斷就知道是錯的（時刻倒退、星期標錯、
//              引用指不到場館）。會讓 exitCode = 1 擋住流程。
//   warning —— 牽涉現場判斷，可能有合理例外（緩衝多寡、末入場前幾分鐘進場、
//              閉館日只排外觀）。只印出來供人複核，不擋。

import { pathToFileURL } from 'node:url';

import { days, meta } from '../src/data/trip.js';
import { venueHours } from '../src/data/tickets.js';
import {
  parseStepTime, toMinutes, dayIsoDate, weekdayOf, WEEKDAY_NAMES,
} from '../src/lib/schedule.mjs';

/** 轉場日留給「抵站、找月台、拖行李」的分鐘數下限，低於此值提醒複核。 */
const TRANSFER_BUFFER_MINUTES = 30;

function makeReport() {
  return {
    errors: [],
    warnings: [],
    error(rule, message) { this.errors.push(`[${rule}] ${message}`); },
    warn(rule, message) { this.warnings.push(`[${rule}] ${message}`); },
  };
}

function dayLabel(day) {
  return `Day ${day.n}（${day.date}）`;
}

/**
 * 規則 1：同一天的步驟時刻不得倒退。
 * 區間型（'13:30–15:00 預留'）以結束時刻作為下一步的比較基準。
 */
export function auditStepOrder(tripDays, report) {
  let checked = 0;
  for (const day of tripDays) {
    let previous = null;
    let previousStep = null;
    for (const step of day.steps) {
      const parsed = parseStepTime(step.t);
      if (!parsed) continue;
      checked += 1;
      if (previous !== null && parsed.minutes < previous) {
        report.error('步驟順序', `${dayLabel(day)}「${previousStep.t} ${previousStep.label}」之後出現較早的「${step.t} ${step.label}」`);
      }
      previous = parsed.endMinutes ?? parsed.minutes;
      previousStep = step;
    }
  }
  return { checked };
}

/**
 * 規則 2：標了 constraint.venue 的步驟不得晚於該館末入場。
 * reference／estimate 類時刻只提醒，因為它們本來就還沒定案。
 */
export function auditLastEntry(tripDays, venues, report) {
  let checked = 0;
  for (const day of tripDays) {
    for (const step of day.steps) {
      const venueKey = step.constraint?.venue;
      if (!venueKey) continue;
      const venue = venues[venueKey];
      if (!venue) continue; // 規則 5 負責回報指不到的引用
      const parsed = parseStepTime(step.t);
      if (!parsed || !venue.lastEntry) continue;
      checked += 1;
      const lastEntry = toMinutes(venue.lastEntry);
      if (parsed.minutes > lastEntry) {
        report.warn('末入場', `${dayLabel(day)}「${step.t} ${step.label}」晚於 ${venue.name} 的最後入場 ${venue.lastEntry}（查證 ${venue.checkedAt}）`);
      }
    }
  }
  return { checked };
}

/**
 * 規則 3：轉場日的最後一個行程步驟與發車之間要留得下移動時間。
 * 只看 day.train（當日城際轉場），市內移動不在此列。
 */
export function auditTransferBuffer(tripDays, report) {
  let checked = 0;
  for (const day of tripDays) {
    const departure = parseStepTime(day.train?.dep);
    if (!departure) continue;
    checked += 1;
    const timed = day.steps.map(step => ({ step, parsed: parseStepTime(step.t) })).filter(item => item.parsed);
    // 嚴格早於發車：與發車同分鐘的那一步就是上車本身，拿它當基準會恆為 0 分鐘。
    const before = timed.filter(item => (item.parsed.endMinutes ?? item.parsed.minutes) < departure.minutes);
    const last = before[before.length - 1];
    if (!last) continue;
    const lastEnd = last.parsed.endMinutes ?? last.parsed.minutes;
    const buffer = departure.minutes - lastEnd;
    if (buffer < TRANSFER_BUFFER_MINUTES) {
      report.warn('轉場緩衝', `${dayLabel(day)}「${last.step.t} ${last.step.label}」距 ${day.train.type || '列車'} ${day.train.dep} 發車只有 ${buffer} 分鐘（門檻 ${TRANSFER_BUFFER_MINUTES} 分）`);
    }
  }
  return { checked };
}

/**
 * 規則 4：行程當天若逢該館公休，標了 constraint.venue 的步驟要提醒。
 * 只警告不擋——外觀、周邊與替代安排都是合理的排法。
 */
export function auditClosedDays(tripDays, venues, tripStart, report) {
  let checked = 0;
  for (const day of tripDays) {
    const iso = dayIsoDate(day.date, tripStart);
    const weekday = weekdayOf(iso);
    if (weekday === null) continue;
    for (const step of day.steps) {
      const venue = venues[step.constraint?.venue];
      if (!venue?.closedWeekdays?.length) continue;
      checked += 1;
      if (venue.closedWeekdays.includes(weekday)) {
        report.warn('公休日', `${dayLabel(day)} 為週${WEEKDAY_NAMES[weekday]}，${venue.name} 當日公休，但仍排了「${step.t} ${step.label}」`);
      }
    }
  }
  return { checked };
}

/** 規則 5：constraint.venue 必須指得到 venueHours 的項目，防資料漂移。 */
export function auditVenueReferences(tripDays, venues, report) {
  let checked = 0;
  const used = new Set();
  for (const day of tripDays) {
    for (const step of day.steps) {
      const venueKey = step.constraint?.venue;
      if (!venueKey) continue;
      checked += 1;
      used.add(venueKey);
      if (!venues[venueKey]) {
        report.error('場館引用', `${dayLabel(day)}「${step.t} ${step.label}」引用了不存在的場館 ${venueKey}`);
      }
    }
  }
  const unused = Object.keys(venues).filter(key => !used.has(key));
  return { checked, unused };
}

/**
 * 規則 6：日期字串裡的中文星期必須與推算結果一致。
 * 純結構檢查，抄錯日期時最容易在這裡露出來。
 */
export function auditWeekdayLabels(tripDays, tripStart, report) {
  let checked = 0;
  for (const day of tripDays) {
    const written = /\(([日一二三四五六])\)/.exec(day.date)?.[1];
    if (!written) continue;
    const iso = dayIsoDate(day.date, tripStart);
    const weekday = weekdayOf(iso);
    if (weekday === null) continue;
    checked += 1;
    if (WEEKDAY_NAMES[weekday] !== written) {
      report.error('星期標示', `${dayLabel(day)} 標為週${written}，但 ${iso} 實際是週${WEEKDAY_NAMES[weekday]}`);
    }
  }
  return { checked };
}

export function auditSchedule(tripDays = days, options = {}) {
  const venues = options.venues ?? venueHours;
  const tripStart = options.tripStart ?? meta.tripStart;
  const report = makeReport();

  const order = auditStepOrder(tripDays, report);
  const weekdays = auditWeekdayLabels(tripDays, tripStart, report);
  const references = auditVenueReferences(tripDays, venues, report);
  const lastEntry = auditLastEntry(tripDays, venues, report);
  const transfers = auditTransferBuffer(tripDays, report);
  const closures = auditClosedDays(tripDays, venues, tripStart, report);

  return {
    errors: report.errors,
    warnings: report.warnings,
    stats: {
      days: tripDays.length,
      stepsChecked: order.checked,
      weekdaysChecked: weekdays.checked,
      venueRefs: references.checked,
      unusedVenues: references.unused,
      lastEntryChecked: lastEntry.checked,
      transfersChecked: transfers.checked,
      closureChecks: closures.checked,
    },
  };
}

function runCli() {
  const result = auditSchedule();
  const stats = result.stats;

  console.log(`行程時間稽核：${stats.days} 天、${stats.stepsChecked} 個有時刻的步驟`);
  console.log(`  星期標示 ${stats.weekdaysChecked} 天、場館引用 ${stats.venueRefs} 處、末入場比對 ${stats.lastEntryChecked} 處、轉場 ${stats.transfersChecked} 段、公休比對 ${stats.closureChecks} 處`);
  if (stats.unusedVenues.length) {
    console.log(`  （venueHours 有但行程未引用：${stats.unusedVenues.join('、')}——留著供門票頁使用，非錯誤）`);
  }

  if (result.warnings.length) {
    console.log('');
    console.log(`需人工複核 ${result.warnings.length} 項：`);
    for (const warning of result.warnings) console.log(`  ⚠ ${warning}`);
  }

  if (result.errors.length) {
    console.error('');
    console.error(`結構錯誤 ${result.errors.length} 項：\n- ${result.errors.join('\n- ')}`);
    process.exitCode = 1;
  } else {
    console.log('');
    console.log('結構檢查通過。');
  }
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectRun) runCli();
