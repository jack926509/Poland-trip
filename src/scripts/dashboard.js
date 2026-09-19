// Shared by the static renderer and the inline, offline-capable dashboard.
//
// 日期解析與時區判斷的正本在 lib/schedule.mjs；本檔只保留舊有的匯出名稱作為別名，
// 避免同一套日期規則在兩處各自演化。
// ⚠ 這裡的函式會被 templates/practical.mjs 以 fn.toString() 內嵌進頁面，
// 內嵌時沒有 import，相依函式必須一起列入該檔的 runtime 陣列。
import { toIsoDate, taipeiToday, todayIn } from '../lib/schedule.mjs';

export { toIsoDate as toComparableDate, taipeiToday as getTaipeiToday, todayIn };

export function isOpenTodoStatus(text) {
  return /待|需|尚未|未|指定日|可查|可購/.test(String(text || ''));
}

export function isOpenEntryStatus(status) {
  return ['pending', 'recheck', 'private-required'].includes(status);
}

/**
 * 把三個來源的期限合成一張倒數表：城際火車開賣日、手動維護的 deadlines、
 * 資料庫項目的重查日。
 *
 * 三份分開維護就會變成三份互相競爭的期限——實際上已經發生過：資料庫的
 * ETIAS 重查日是 2026-09-24，手動推算的卻排到 10/10，晚了 16 天。
 * 合併後倒數看板是唯一入口，各來源的正本仍留在原處（trains[].saleOpens、
 * databaseEntries[].recheckAt），這裡只讀不抄。
 *
 * 資料庫項目與手動項目不是重複，是不同粒度：資料庫那筆「景點票券與入場時段」
 * 是所有票券的進度彙總，手動那幾筆是「10/03 前訂 Wieliczka 英語場」這種
 * 具體動作，且資料庫的日期通常更早——它們是「確認要訂什麼」的前置步驟。
 *
 * 僅於建置期呼叫，不隨頁面內嵌。
 */
export function collectDeadlines({ trains = [], deadlines = [], databaseEntries = [] } = {}) {
  const railItems = trains
    .filter(train => train.saleOpens)
    .map(train => ({
      id: `rail-${train.type.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`,
      date: train.saleOpens,
      category: '火車',
      title: `${train.type}｜${train.seg}`,
      action: `${train.date} ${train.dep}–${train.arr}（${train.dur}）。請現在於 PKP Intercity 重查指定日可售狀態、班表、票價與座位；不必等到上次記錄的預售日期。`,
      status: train.status || '尚未訂票',
      url: 'https://ebilet.intercity.pl/',
      basis: `trains[].saleOpens，官方售票系統歷次查核日 ${train.saleCheckedAt || '未記錄'}；保留當時的預售日期，現行可售狀態待複核。`,
    }));
  // 已完成（verified）的資料庫項目不進倒數——催已經做完的事只會讓看板被忽略。
  const databaseItems = databaseEntries
    .filter(entry => entry.recheckAt && isOpenEntryStatus(entry.status))
    .map(entry => ({
      id: `db-${entry.id}`,
      date: entry.recheckAt,
      category: '資料重查',
      title: entry.title,
      action: entry.summary,
      status: entry.status === 'private-required' ? '待補私人資料' : entry.status === 'recheck' ? '需重查' : '尚未完成',
      url: entry.sourceUrl || null,
      basis: `databaseEntries[].recheckAt，最近盤查 ${entry.checkedAt || '未記錄'}。`,
    }));

  return [...railItems, ...deadlines, ...databaseItems]
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.id.localeCompare(b.id)));
}

/**
 * 為每個截止項目算出剩餘天數與急迫度。
 * 已完成的項目不論日期都不再催——催已經做完的事只會讓看板被忽略。
 */
export function calculateCountdown(items, todayIso) {
  return items.map(item => {
    const date = toIsoDate(item.date);
    const daysLeft = date === null ? null : Math.round(
      (Date.parse(`${date}T00:00:00Z`) - Date.parse(`${todayIso}T00:00:00Z`)) / 86400000,
    );
    const open = isOpenTodoStatus(item.status);
    return { ...item, date, daysLeft, urgency: urgencyOf(daysLeft, open), label: labelOf(daysLeft, open), open };
  });
}

/** 下一個仍待處理的截止項目；全部完成時回 null。 */
export function nextDeadline(items, todayIso) {
  return calculateCountdown(items, todayIso)
    .filter(item => item.open && item.daysLeft !== null)
    .sort((a, b) => a.daysLeft - b.daysLeft)[0] || null;
}

/**
 * 讓已渲染的倒數表跟上今天的日期。
 *
 * 只更新標籤與急迫度樣式，不重繪列——列在建置時就連同跳脫處理產生好了，
 * 在瀏覽器再組一次 HTML 等於把同一套結構與跳脫規則維護兩遍。
 * 會被內嵌進頁面，因此保持自足，只依賴一起內嵌的 urgencyOf／labelOf。
 */
export function urgencyOf(daysLeft, open) {
  if (!open) return 'done';
  if (daysLeft === null) return 'undated';
  if (daysLeft < 0) return 'overdue';
  if (daysLeft === 0) return 'today';
  if (daysLeft <= 7) return 'soon';
  return 'planned';
}

export function labelOf(daysLeft, open) {
  if (!open) return '已完成';
  if (daysLeft === null) return '無日期';
  if (daysLeft < 0) return `逾期 ${Math.abs(daysLeft)} 天`;
  if (daysLeft === 0) return '就是今天';
  return `T-${daysLeft}`;
}

export function initializeCountdown(root, getToday) {
  function refresh() {
    const today = getToday();
    const todayNode = root.querySelector('[data-countdown-today]');
    if (todayNode) todayNode.textContent = today;
    for (const row of root.querySelectorAll('[data-countdown-row]')) {
      const date = row.getAttribute('data-countdown-date');
      const open = row.getAttribute('data-countdown-open') === 'true';
      const daysLeft = date
        ? Math.round((Date.parse(`${date}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86400000)
        : null;
      const urgency = urgencyOf(daysLeft, open);
      row.setAttribute('data-urgency', urgency);
      const label = row.querySelector('[data-countdown-label]');
      if (label) label.textContent = labelOf(daysLeft, open);
    }
  }
  refresh();
  // 分頁整夜開著、或由上一頁返回快取還原時，日期要跟著走。
  setInterval(refresh, 60000);
  window.addEventListener('pageshow', refresh);
  window.addEventListener('focus', refresh);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) refresh();
  });
}

export function calculateDashboard(input, now = new Date()) {
  const today = taipeiToday(now);
  const overdue = date => {
    const parsed = toIsoDate(date);
    return parsed !== null && parsed < today;
  };
  const alerts = input.alertCandidates.filter(item => overdue(item.date));
  const overdueTodos = alerts.filter(item => item.type === 'todo-overdue').length;
  const overdueEntries = alerts.length - overdueTodos
    + input.privateDueDates.filter(overdue).length;
  return {
    generatedAt: today,
    metrics: {
      ...input.metrics,
      todaySyncCount: input.syncDates.filter(date => date === today).length,
      overdue: overdueTodos + overdueEntries,
      overdueTodos,
      overdueEntries,
    },
    handoverAlerts: alerts,
    syncRows: input.syncRows,
  };
}

export function dashboardCsv(handover) {
  const rows = [
    ['類型', '關鍵字', '日期', '狀態', '說明'],
    ...handover.handoverAlerts.map(item => [item.type, item.name, item.date, item.status, item.action]),
    ['', '', '', '', ''],
    [`最近同步清單（${handover.metrics.latestSyncDate}）`, '', '', '', ''],
    ['id', 'status', 'checkedAt', 'summary', 'offlineNote'],
    ...handover.syncRows.map(item => [item.id, item.status, item.checkedAt, item.summary, item.offlineNote]),
  ];
  const cell = value => `"${String(value ?? '').replaceAll('"', '""')}"`;
  // BOM allows spreadsheet applications to recognize Traditional Chinese as UTF-8.
  return '\uFEFF' + rows.map(row => row.map(cell).join(',')).join('\r\n') + '\r\n';
}

export function initializeDashboard(root, input) {
  function refresh() {
    const handover = calculateDashboard(input);
    root.querySelector('[data-dashboard-today]').textContent = handover.generatedAt;
    root.querySelector('[data-dashboard-today-count]').textContent = `${handover.metrics.todaySyncCount} 筆`;
    root.querySelector('[data-dashboard-overdue]').textContent = `${handover.metrics.overdue} 筆`;
    return handover;
  }
  function download(format) {
    const handover = refresh();
    const text = format === 'csv' ? dashboardCsv(handover) : JSON.stringify(handover, null, 2);
    const type = format === 'csv' ? 'text/csv;charset=utf-8' : 'application/json;charset=utf-8';
    const url = URL.createObjectURL(new Blob([text], { type }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `handover-${handover.generatedAt}.${format}`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  root.querySelector('[data-handover-export="json"]').addEventListener('click', () => download('json'));
  root.querySelector('[data-handover-export="csv"]').addEventListener('click', () => download('csv'));
  refresh();
  // Includes tabs left open over midnight and pages restored from the back/forward cache.
  setInterval(refresh, 60000);
  window.addEventListener('pageshow', refresh);
  window.addEventListener('focus', refresh);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) refresh();
  });
}
