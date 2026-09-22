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

export function warsawTodayLocal(now) {
  return todayIn('Europe/Warsaw', now);
}

export function dayGap(fromIso, toIso) {
  return Math.round((Date.parse(`${toIso}T00:00:00Z`) - Date.parse(`${fromIso}T00:00:00Z`)) / 86400000);
}

export function selectToday(dates, today) {
  if (!dates.length) return { mode: 'empty' };
  const index = dates.indexOf(today);
  if (index !== -1) return { mode: 'during', index, date: today };
  if (today < dates[0]) return { mode: 'before', daysUntil: dayGap(today, dates[0]), date: dates[0] };
  return { mode: 'after', daysSince: dayGap(dates[dates.length - 1], today) };
}

export function statusText(selection, total) {
  if (selection.mode === 'during') return `今天是旅程第 ${selection.index + 1} 天（共 ${total} 天）· 華沙時間 ${selection.date}`;
  if (selection.mode === 'before') return `距離出發還有 ${selection.daysUntil} 天，下方預覽 Day 1。`;
  if (selection.mode === 'after') return `旅程已於 ${selection.daysSince} 天前結束，下方顯示最後一天；完整 ${total} 天請看每日行程頁。`;
  return '沒有可顯示的行程。';
}

export function warsawMinutes(now) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone:'Europe/Warsaw', hour:'2-digit', minute:'2-digit', hourCycle:'h23' }).formatToParts(now);
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

export function initializeToday(root, now = () => new Date()) {
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
  let manualDate = null;
  let manualStep = null;
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

  function refresh() {
    const clock = now();
    const today = warsawTodayLocal(clock);
    const selection = selectToday(dates, today);
    shown = manualDate !== null ? dates.indexOf(manualDate) : selection.mode === 'during' ? selection.index
      : selection.mode === 'after' ? cards.length - 1 : 0;
    const preview = dates[shown] !== today;
    cards.forEach((card,index) => { card.hidden = index !== shown; });
    if (picker) picker.value = dates[shown];
    if (prev) prev.disabled = shown === 0;
    if (next) next.disabled = shown === cards.length - 1;
    if (status) status.textContent = preview ? `預覽 Day ${shown+1} · ${dates[shown]}（非今天）· 華沙日期 ${today}` : statusText(selection,cards.length);
    if (outside) outside.hidden = selection.mode === 'during';
    if (outsideNote && selection.mode !== 'during') outsideNote.textContent = statusText(selection,cards.length);
    const card = cards[shown];
    // 舊版靜態 DOM 與無行程卡片也可正常選日。
    const steps = Array.from(card.querySelectorAll?.('[data-next-step]') || []);
    const minute = preview ? -1 : warsawMinutes(clock);
    const selected = manualStep?.date === dates[shown] ? manualStep.index : nextPlanIndex(steps.map(item => Number(item.getAttribute('data-plan-minute'))),minute);
    steps.forEach((step,index) => { step.hidden = index !== selected; });
    const stepPicker = card.querySelector?.('[data-step-picker]');
    if (stepPicker) stepPicker.value = selected < 0 ? '' : String(selected);
    const ended = card.querySelector?.('[data-next-ended]');
    if (ended) ended.hidden = selected !== -1;
    // 只有顯示中的那一站算倒數；其餘一律傳 -1 清空，
    // 否則手動切站或換日之後，被藏起來的節點會留著上一次算出的舊數字。
    steps.forEach((step,index) => applyEta(step.querySelector?.('[data-next-eta]'),
      Number(step.getAttribute('data-plan-minute')), index === selected ? minute : -1));
    // 「第幾站／共幾站」讓人知道今天還剩多少，而不是只看到孤立的一站。
    const progress = card.querySelector?.('[data-next-progress]');
    if (progress) {
      progress.hidden = !steps.length || selected < 0;
      progress.textContent = steps.length && selected >= 0 ? `第 ${selected + 1}／${steps.length} 站` : '';
    }
    const mode = card.querySelector?.('[data-next-mode]');
    if (mode) mode.textContent = `${manualStep?.date === dates[shown] ? '手動查看此站' : preview ? '預覽當日第一個時間點' : '依波蘭時間顯示下一個預定時間點'}；不代表目前位置或上一站已完成。`;
    const deadlines = Array.from(card.querySelectorAll?.('[data-hard-time]') || []);
    const deadlineIndex = nextPlanIndex(deadlines.map(item => Number(item.getAttribute('data-plan-minute'))),minute);
    deadlines.forEach((item,index) => { item.hidden = index !== deadlineIndex; });
    // 逼近的期限才升級成紅色；離得遠或在預覽別天時維持琥珀色的提示，
    // 紅色留給真的快來不及，才不會每天都紅、看久了就當背景。
    deadlines.forEach((item,index) => {
      const planMinute = Number(item.getAttribute('data-plan-minute'));
      const at = index === deadlineIndex ? minute : -1;
      item.setAttribute?.('data-eta-level', planEta(planMinute, at)?.level || 'none');
      applyEta(item.querySelector?.('[data-hard-eta]'), planMinute, at);
    });
    const hardEnded = card.querySelector?.('[data-hard-ended]');
    if (hardEnded) hardEnded.hidden = deadlineIndex !== -1;
    // 已經是自動模式（看今天）時「回到今天」沒有作用，停用它才看得出目前狀態。
    if (reset) reset.disabled = manualDate === null && manualStep === null;
  }

  function choose(index) {
    manualDate = dates[Math.max(0,Math.min(cards.length-1,index))];
    manualStep = null;
    refresh();
  }
  picker?.addEventListener('change', () => choose(dates.indexOf(picker.value)));
  prev?.addEventListener('click', () => choose(shown-1));
  next?.addEventListener('click', () => choose(shown+1));
  reset?.addEventListener('click', () => { manualDate=null; manualStep=null; refresh(); });
  function revealTarget(card, key) {
    const target = card?.querySelector(`[data-${key}]`);
    if (!target) return null;
    if (target.tagName === 'DETAILS') target.open = true;
    target.scrollIntoView({block:'start',behavior:'smooth'});
    target.setAttribute('tabindex','-1');
    target.focus({preventScroll:true});
    return target;
  }
  cards.forEach(card => {
    card.classList?.add('today-enhanced');
    card.querySelector?.('[data-step-picker]')?.addEventListener('change', event => {
      manualStep = {date:card.getAttribute('data-today-date'), index:Number(event.target.value)};
      refresh();
    });
    card.querySelectorAll?.('[data-today-action]').forEach(button => button.addEventListener('click', () => {
      const action = button.getAttribute('data-today-action');
      if (action === 'next') { manualStep=null; refresh(); }
      revealTarget(card, `today-${action}`);
    }));
  });
  if (picker) picker.closest('nav')?.classList.add('today-enhanced');
  // 手機底部快捷列的「時間表」「吃哪」用網址片段（#today-schedule／#today-food）
  // 指到目前顯示的那張卡，而不是寫死 id——八張卡是同時渲染、只用 hidden 切換，
  // 寫死 id 會重複八次。
  function focusHash() {
    // 內嵌／測試環境不一定有 location（例如單元測試用純物件模擬 DOM），
    // 沒有就當作沒有片段導覽，不影響其餘初始化流程。
    const hash = typeof location === 'undefined' ? '' : location.hash;
    const key = hash.replace(/^#/, '');
    if (key !== 'today-schedule' && key !== 'today-food') return;
    revealTarget(cards[shown], key);
  }
  refresh();
  focusHash();
  window.addEventListener('hashchange', focusHash);
  setInterval(refresh,60000);
  window.addEventListener('pageshow',refresh);
  window.addEventListener('focus',refresh);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
}
