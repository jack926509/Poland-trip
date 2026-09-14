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
  if (selection.mode === 'after') return `旅程已於 ${selection.daysSince} 天前結束，下方顯示最後一天；完整八天請看每日行程頁。`;
  return '沒有可顯示的行程。';
}

export function initializeToday(root, now = () => new Date()) {
  const cards = Array.from(root.querySelectorAll('[data-today-card]'));
  if (!cards.length) return;
  const dates = cards.map(card => card.getAttribute('data-today-date'));
  const status = root.querySelector('[data-today-status]');
  const outside = root.querySelector('[data-today-outside]');
  const outsideNote = root.querySelector('[data-today-outside-note]');

  function refresh() {
    const selection = selectToday(dates, warsawTodayLocal(now()));
    // 旅程外一樣要看得到東西：出發前顯示 Day 1 預覽，結束後顯示最後一天。
    const shown = selection.mode === 'during' ? selection.index
      : selection.mode === 'after' ? cards.length - 1 : 0;
    cards.forEach((card, index) => { card.hidden = index !== shown; });
    if (status) status.textContent = statusText(selection, cards.length);
    if (outside) outside.hidden = selection.mode === 'during';
    if (outsideNote && selection.mode !== 'during') outsideNote.textContent = statusText(selection, cards.length);
  }

  refresh();
  // 分頁開著跨過午夜、或由返回快取還原時要跟著換日。
  setInterval(refresh, 60000);
  window.addEventListener('pageshow', refresh);
  window.addEventListener('focus', refresh);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) refresh();
  });
}
