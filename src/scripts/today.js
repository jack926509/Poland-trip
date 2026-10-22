// 今日卡的選日邏輯。
//
// 八張卡在建置時就已渲染好，這裡只決定顯示哪一張——不組裝內容，
// 因此離線、無網路、由返回快取還原都一樣正確。
// 一律以 data-* 選取：單檔版會替每頁的 id 加前綴，寫死 id 會失效。
//
// ⚠ 本檔的函式由 templates/today.mjs 以 fn.toString() 內嵌進頁面（單檔版只
// 打包 <main> 內容，外部 script 會被丟掉）。內嵌時沒有 import，相依函式必須
// 全部具名匯出並一起列入該檔的 runtime 陣列。

import { todayIn } from '../lib/schedule.mjs';

export function warsawTodayLocal(now, timeZone = 'Europe/Warsaw') {
  return todayIn(timeZone, now);
}

export function dayGap(fromIso, toIso) {
  return Math.round((Date.parse(`${toIso}T00:00:00Z`) - Date.parse(`${fromIso}T00:00:00Z`)) / 86400000);
}

export function selectToday(dates, today, travelStart = dates[0]) {
  if (!dates.length) return { mode: 'empty' };
  const index = dates.indexOf(today);
  if (index !== -1) return { mode: 'during', index, date: today };
  if (today < dates[0]) return { mode: 'before', daysUntil: dayGap(today, travelStart), date: dates[0] };
  return { mode: 'after', daysSince: dayGap(dates[dates.length - 1], today) };
}

export function statusText(selection, total) {
  if (selection.mode === 'during') return `今天是旅程第 ${selection.index + 1} 天（共 ${total} 天）· 華沙時間 ${selection.date}`;
  if (selection.mode === 'before') return selection.daysUntil === 0
    ? '今天搭機出發，下方預覽 Day 1。'
    : `距離出發還有 ${selection.daysUntil} 天，下方預覽 Day 1。`;
  if (selection.mode === 'after') return `旅程已於 ${selection.daysSince} 天前結束，下方顯示最後一天（共 ${total} 天）。`;
  return '沒有可顯示的行程。';
}

export function warsawMinutes(now, timeZone = 'Europe/Warsaw') {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone, hour:'2-digit', minute:'2-digit', hourCycle:'h23' }).formatToParts(now);
  return Number(parts.find(p => p.type === 'hour').value) * 60 + Number(parts.find(p => p.type === 'minute').value);
}

export function nextPlanIndex(minutes, currentMinute) {
  return minutes.findIndex(minute => minute >= currentMinute);
}

/**
 * 「還有多久」。現場最常問的是這個，原本要自己拿手機時鐘減行程表。
 *
 * 只做時鐘減法，不猜交通與現場狀況——回傳字串刻意不寫「來得及」。
 * 預覽別的日期時 currentMinute 會是 -1，此時回傳 null，不顯示任何倒數，
 * 免得看別天的行程卻出現一個看似即時的數字。
 */
export function planEta(planMinute, currentMinute) {
  if (!Number.isFinite(planMinute) || !Number.isFinite(currentMinute) || currentMinute < 0) return null;
  const diff = planMinute - currentMinute;
  const span = Math.abs(diff);
  const hours = Math.floor(span / 60);
  const minutes = span % 60;
  const amount = hours ? `${hours} 小時${minutes ? ` ${minutes} 分` : ''}` : `${minutes} 分`;
  if (diff > 0) return { text: `還有 ${amount}`, level: diff <= 30 ? 'soon' : 'ahead' };
  if (diff === 0) return { text: '就是現在', level: 'soon' };
  return { text: `已過 ${amount}`, level: 'past' };
}

export function initializeToday(root, now = () => new Date(), travelStart = null) {
  const cards = Array.from(root.querySelectorAll('[data-today-card]'));
  if (!cards.length) return;
  const dates = cards.map(card => card.getAttribute('data-today-date'));
  const status = root.querySelector('[data-today-status]');
  const outside = root.querySelector('[data-today-outside]');
  const outsideNote = root.querySelector('[data-today-outside-note]');
  const picker = root.querySelector('[data-date-picker]');
  const prev = root.querySelector('[data-date-prev]');
  const next = root.querySelector('[data-date-next]');
  const reset = root.querySelector('[data-date-reset]');
  // 餐點開始超過這麼多分鐘就視為「已過」，「下一餐」改指下一頓；剛到的餐不會被跳過。
  // 放在函式內：本函式以 toString() 內嵌進頁面，模組層常數不會跟著進去。
  const MEAL_DONE_AFTER = 60;
  // 今天最後一步時刻過了這麼多分鐘，晚上模式（回住宿）才接手；比照「下一餐」的寬限。
  const EVENING_AFTER = 60;
  // 今日卡只放「一屏看完」的摘要；時間表與餐廳細節在每日頁。
  // 底部快捷列與其他頁連到 today.html#today-schedule／#today-food 時，改送到當天每日頁的對應段落。
  const JUMPS = { 'today-schedule': '#schedule', 'today-food': '#day-food' };
  let manualDate = null;
  let shown = 0;

  // 「還有多久」寫進指定的 span：沒有這個節點（舊版 DOM、單元測試）就跳過，
  // 選日本身不該因為少一個裝飾性節點而壞掉。
  function applyEta(host, planMinute, currentMinute) {
    if (!host) return;
    const eta = planEta(planMinute, currentMinute);
    host.textContent = eta ? eta.text : '';
    host.hidden = !eta;
    host.setAttribute?.('data-eta-level', eta ? eta.level : 'none');
  }

  function dayHref(card) {
    return (card?.querySelector?.('[data-today-full]')?.getAttribute('href') || '').split('#')[0] || null;
  }

  // 底部快捷列的「時間表」「吃哪」直接指到顯示中那一天的每日頁（用網址片段辨認，不寫死 id）。
  function retargetQuickNav(card) {
    const href = dayHref(card);
    if (!href || typeof document === 'undefined' || typeof document.querySelectorAll !== 'function') return;
    document.querySelectorAll('.mobile-quick-nav a').forEach(link => {
      const key = link.getAttribute('data-today-jump') || (link.getAttribute('href') || '').split('#')[1];
      if (!JUMPS[key]) return;
      link.setAttribute('data-today-jump', key);
      link.setAttribute('href', `${href}${JUMPS[key]}`);
    });
  }

  function refresh() {
    const clock = now();
    const firstZone = cards[0].getAttribute?.('data-time-zone');
    const firstLocal = firstZone ? warsawTodayLocal(clock, firstZone) : null;
    // 台北出發日起，台北日期還在 Day 1～Day 2 之內就以台北日期為準：
    // 香港轉機跨過台北午夜（10/25 01:25 QR 815）時，華沙仍是前一天，用華沙日期會顯示成 10/24。
    const warsawDate = warsawTodayLocal(clock);
    const useFirstZone = Boolean(firstLocal) && firstLocal <= (dates[1] || dates[0]);
    const today = useFirstZone ? firstLocal : warsawDate;
    const selection = selectToday(dates, today, travelStart || dates[0]);
    shown = manualDate !== null ? dates.indexOf(manualDate) : selection.mode === 'during' ? selection.index
      : selection.mode === 'after' ? cards.length - 1 : 0;
    const preview = dates[shown] !== today;
    cards.forEach((card,index) => { card.hidden = index !== shown; });
    if (picker) picker.value = dates[shown];
    if (prev) prev.disabled = shown === 0;
    if (next) next.disabled = shown === cards.length - 1;
    // 出發前「不在旅程期間」框已說明預覽 Day 1，狀態列不再重複；旅途中翻到別天才提示不是今天。
    if (status) {
      const text = !preview ? statusText(selection,cards.length) : selection.mode === 'during' ? `預覽 Day ${shown+1}（不是今天）` : '';
      status.textContent = firstZone === 'Asia/Taipei' && (dates[shown] === dates[0] || (useFirstZone && firstLocal !== warsawDate)) ? text.replace('華沙時間', '台北時間') : text;
      status.hidden = !text;
    }
    if (outside) outside.hidden = selection.mode === 'during';
    // 手機頁首一律改精簡版，讓儀表板一屏看完（2026-10-20 起出發前／結束後也一樣，
    // 「不在旅程期間」框本身就說明了現在看的是預覽）。today-live 另外表示「看的就是今天」，
    // 此時狀態列的「今天是旅程第 N 天」與日期選單重複，精簡版會收掉它。
    const page = root.querySelector('[data-today-page]');
    if (page && page.classList) {
      page.classList.toggle('today-compact', true);
      page.classList.toggle('today-outside-mode', selection.mode !== 'during');
      page.classList.toggle('today-live', selection.mode === 'during' && !preview);
    }
    if (outsideNote && selection.mode !== 'during') outsideNote.textContent = statusText(selection,cards.length);
    const card = cards[shown];
    retargetQuickNav(card);
    // 舊版靜態 DOM 與無行程卡片也可正常選日。
    const steps = Array.from(card.querySelectorAll?.('[data-next-step]') || []);
    const zone = card.getAttribute?.('data-time-zone') || 'Europe/Warsaw';
    const minute = preview ? -1 : warsawMinutes(clock, zone) + dayGap(dates[shown], warsawTodayLocal(clock, zone)) * 1440;
    const selected = nextPlanIndex(steps.map(item => Number(item.getAttribute('data-plan-minute'))),minute);
    steps.forEach((step,index) => { step.hidden = index !== selected; });
    const ended = card.querySelector?.('[data-next-ended]');
    if (ended) ended.hidden = selected !== -1;
    // 晚上：看的是今天、而且今天最後一步也過了，改成「回住宿＋明天第一件事」置頂。
    const live = selection.mode === 'during' && !preview;
    const lastStep = Math.max(...steps.map(item => Number(item.getAttribute('data-plan-minute'))));
    // 離境日航班起飛後（data-flight-minute）：直接進結束狀態，不再等最後一步的寬限。
    const flightAttr = card.getAttribute?.('data-flight-minute');
    const departed = live && flightAttr != null && minute >= Number(flightAttr);
    const evening = live && steps.length > 0 && (departed || (selected === -1 && minute > lastStep + EVENING_AFTER));
    card.setAttribute?.('data-trip-ended', departed ? 'true' : 'false');
    // 起飛後：離境提醒與晚間準備換成一行結束語。
    card.querySelectorAll?.('[data-leaving-pre],[data-night-link],[data-evening-full]').forEach(item => { item.hidden = departed; });
    card.querySelectorAll?.('[data-leaving-post]').forEach(item => { item.hidden = !departed; });
    card.setAttribute?.('data-today-phase', evening ? 'evening' : 'day');
    // 只有顯示中的那一站算倒數；其餘一律傳 -1 清空，
    // 否則換日之後，被藏起來的節點會留著上一次算出的舊數字。
    steps.forEach((step,index) => applyEta(step.querySelector?.('[data-next-eta]'),
      Number(step.getAttribute('data-plan-minute')), index === selected ? minute : -1));
    // 「第幾站／共幾站」讓人知道今天還剩多少，而不是只看到孤立的一站。
    const progress = card.querySelector?.('[data-next-progress]');
    if (progress) {
      progress.hidden = !steps.length || selected < 0;
      progress.textContent = steps.length && selected >= 0 ? `第 ${selected + 1}／${steps.length} 站` : '';
    }
    // 主按鈕：看的不是今天（預覽出發前／結束後／手動翻日）時，直接寫出是哪一天。
    const fullLink = card.querySelector?.('[data-today-full]');
    if (fullLink) {
      if (fullLink.getAttribute('data-full-text') == null) fullLink.setAttribute('data-full-text', fullLink.textContent);
      fullLink.textContent = preview ? `看 Day ${shown + 1} 行程 →` : fullLink.getAttribute('data-full-text');
    }
    const mode = card.querySelector?.('[data-next-mode]');
    if (mode) mode.textContent = preview ? '預覽：當日第一站' : '依行程表，非即時定位';
    const selectedMinute = selected >= 0 ? Number(steps[selected].getAttribute('data-plan-minute')) : null;
    const deadlines = Array.from(card.querySelectorAll?.('[data-hard-time]') || []);
    const deadlineIndex = nextPlanIndex(deadlines.map(item => Number(item.getAttribute('data-plan-minute'))),minute);
    deadlines.forEach((item,index) => { item.hidden = index !== deadlineIndex; });
    // 逼近的期限才升級成紅色；離得遠或在預覽別天時維持琥珀色的提示，
    // 紅色留給真的快來不及，才不會每天都紅、看久了就當背景。
    // 硬時間和下一站同一時刻時併成一行：倒數只在下一站顯示一次。
    deadlines.forEach((item,index) => {
      const planMinute = Number(item.getAttribute('data-plan-minute'));
      const same = index === deadlineIndex && planMinute === selectedMinute;
      const at = index === deadlineIndex && !same ? minute : -1;
      item.setAttribute?.('data-hard-same', same ? 'true' : 'false');
      item.setAttribute?.('data-eta-level', planEta(planMinute, at)?.level || 'none');
      applyEta(item.querySelector?.('[data-hard-eta]'), planMinute, at);
    });
    const hardEnded = card.querySelector?.('[data-hard-ended]');
    if (hardEnded) hardEnded.hidden = deadlineIndex !== -1;
    // 下一段車：只顯示還沒出發的下一段城際移動，全部過了就整列不顯示。
    const legs = Array.from(card.querySelectorAll?.('[data-today-leg]') || []);
    const legIndex = nextPlanIndex(legs.map(item => Number(item.getAttribute('data-plan-minute'))),minute);
    legs.forEach((item,index) => { item.hidden = index !== legIndex; });
    // 天氣只抓顯示中的那一天；loadWeather 只在頁面內嵌時存在（單元測試匯入本檔時略過）。
    if (typeof loadWeather === 'function' && !evening) loadWeather(card.querySelector?.('[data-today-weather]'));
    // 下一餐：看今天時依華沙時間，開始超過 MEAL_DONE_AFTER 分鐘的餐算已過；預覽別天時顯示第一餐。
    // 相對時間（出礦後…）：後面第一個有時刻的步驟到了就算已過。
    const meals = Array.from(card.querySelectorAll?.('[data-meal-label]') || []);
    const nextMeal = meals.find(item => {
      const at = item.getAttribute('data-meal-minute');
      const before = item.getAttribute('data-meal-before-minute');
      return !(at !== null ? Number(at) < minute - MEAL_DONE_AFTER : before !== null && Number(before) <= minute);
    }) || null;
    const nextMealRow = card.querySelector?.('[data-next-meal]');
    if (nextMealRow) {
      nextMealRow.hidden = !nextMeal;
      if (nextMeal) {
        const name = nextMeal.getAttribute('data-meal-name') || '';
        const map = nextMeal.getAttribute('data-meal-map');
        const text = nextMealRow.querySelector('[data-next-meal-text]');
        const link = nextMealRow.querySelector('[data-next-meal-nav]');
        if (text) text.textContent = `${nextMeal.getAttribute('data-meal-time')} ${nextMeal.getAttribute('data-meal-label')} · ${name}`;
        if (link) {
          link.hidden = !map;
          // 沒有地點可導航（機上晚餐、自備餐）就不留上一餐的網址，也不顯示按鈕。
          if (!map) link.removeAttribute?.('href');
          if (map) {
            link.setAttribute('href', map);
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
            link.setAttribute('aria-label', `在新視窗開啟 ${name} 的 Google Maps 導航`);
          }
        }
      }
    }
    // 已經是自動模式（看今天）時「回到今天」沒有作用，停用它才看得出目前狀態。
    if (reset) reset.disabled = manualDate === null;
  }

  function choose(index) {
    manualDate = dates[Math.max(0,Math.min(cards.length-1,index))];
    refresh();
  }
  picker?.addEventListener('change', () => choose(dates.indexOf(picker.value)));
  prev?.addEventListener('click', () => choose(shown-1));
  next?.addEventListener('click', () => choose(shown+1));
  reset?.addEventListener('click', () => { manualDate=null; refresh(); });
  cards.forEach(card => card.classList?.add('today-enhanced'));
  if (picker) picker.closest('nav')?.classList.add('today-enhanced');
  // 從其他頁的「時間表」「吃哪」（today.html#today-schedule／#today-food）進來時，
  // 直接換到當天每日頁的對應段落；用 replace 不留一筆多餘的上一頁。
  function focusHash() {
    // 內嵌／測試環境不一定有 location（例如單元測試用純物件模擬 DOM），
    // 沒有就當作沒有片段導覽，不影響其餘初始化流程。
    if (typeof location === 'undefined') return;
    const target = JUMPS[location.hash.replace(/^#/, '')];
    const href = dayHref(cards[shown]);
    if (target && href) location.replace(`${href}${target}`);
  }
  refresh();
  focusHash();
  window.addEventListener('hashchange', focusHash);
  setInterval(refresh,60000);
  window.addEventListener('pageshow',refresh);
  window.addEventListener('focus',refresh);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
}
