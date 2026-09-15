// 今日卡的選日邏輯。
//
// 八張卡在建置時就已渲染好，這裡只決定顯示哪一張——不組裝內容，
// 因此離線、無網路、由返回快取還原都一樣正確。
// 一律以 data-* 選取：單檔版會替每頁的 id 加前綴，寫死 id 會失效。
//
// ⚠ 本檔的函式由 templates/today.mjs 以 fn.toString() 內嵌進頁面（單檔版只
// 打包 <main> 內容，外部 script 會被丟掉）。內嵌時沒有 import，相依函式必須
// 全部具名匯出並一起列入該檔的 runtime 陣列。

export function warsawTodayLocal(now) {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: 'Europe/Warsaw', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now);
  const part = type => parts.find(value => value.type === type).value;
  return `${part('year')}-${part('month')}-${part('day')}`;
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
  let manualDate = null;
  let manualStep = null;
  let shown = 0;

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
    const mode = card.querySelector?.('[data-next-mode]');
    if (mode) mode.textContent = `${manualStep?.date === dates[shown] ? '手動查看此站' : preview ? '預覽當日第一個時間點' : '依波蘭時間顯示下一個預定時間點'}；不代表目前位置或上一站已完成。`;
    const deadlines = Array.from(card.querySelectorAll?.('[data-hard-time]') || []);
    const deadlineIndex = nextPlanIndex(deadlines.map(item => Number(item.getAttribute('data-plan-minute'))),minute);
    deadlines.forEach((item,index) => { item.hidden = index !== deadlineIndex; });
    const hardEnded = card.querySelector?.('[data-hard-ended]');
    if (hardEnded) hardEnded.hidden = deadlineIndex !== -1;
  }

  function choose(index) {
    manualDate = dates[Math.max(0,Math.min(cards.length-1,index))];
    manualStep = null;
    refresh();
  }
  picker?.addEventListener('change', () => choose(dates.indexOf(picker.value)));
  prev?.addEventListener('click', () => choose(shown-1));
  next?.addEventListener('click', () => choose(shown+1));
  root.querySelector('[data-date-reset]')?.addEventListener('click', () => { manualDate=null; manualStep=null; refresh(); });
  cards.forEach(card => {
    card.classList?.add('today-enhanced');
    card.querySelector?.('[data-step-picker]')?.addEventListener('change', event => {
      manualStep = {date:card.getAttribute('data-today-date'), index:Number(event.target.value)};
      refresh();
    });
    card.querySelectorAll?.('[data-today-action]').forEach(button => button.addEventListener('click', () => {
      const action = button.getAttribute('data-today-action');
      if (action === 'next') { manualStep=null; refresh(); }
      const target = card.querySelector(`[data-today-${action}]`);
      target?.scrollIntoView({block:'start',behavior:'smooth'});
      if (target) { target.setAttribute('tabindex','-1'); target.focus({preventScroll:true}); }
    }));
  });
  if (picker) picker.closest('nav')?.classList.add('today-enhanced');
  refresh();
  setInterval(refresh,60000);
  window.addEventListener('pageshow',refresh);
  window.addEventListener('focus',refresh);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
}
