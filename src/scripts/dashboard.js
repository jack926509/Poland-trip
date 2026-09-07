// Shared by the static renderer and the inline, offline-capable dashboard.
export function getTaipeiToday(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now);
  const part = type => parts.find(value => value.type === type).value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

export function toComparableDate(value) {
  const raw = String(value || '').trim();
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    || raw.match(/^(\d{1,2})\/(\d{1,2})$/);
  if (!match) return null;
  const [year, month, day] = match.length === 4
    ? match.slice(1).map(Number) : [2026, ...match.slice(1).map(Number)];
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function isOpenTodoStatus(text) {
  return /待|需|尚未|未|指定日|可查|可購/.test(String(text || ''));
}

export function isOpenEntryStatus(status) {
  return ['pending', 'recheck', 'private-required'].includes(status);
}

export function calculateDashboard(input, now = new Date()) {
  const today = getTaipeiToday(now);
  const overdue = date => {
    const parsed = toComparableDate(date);
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
