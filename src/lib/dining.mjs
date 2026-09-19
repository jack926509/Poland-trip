import { escapeHtml, safeHttpsUrl } from './html.mjs';

export function mealTiming(item, day) {
  if (item.planStatus === 'unavailable') return '本日不採用；保留作其他時段參考';
  if (!item.stepId) return /早餐|午餐|晚餐/.test(item.role) ? '候選未排時段，須先調整行程' : '彈性候選，未排定時段';
  const step = day.steps.find(step => step.id === item.stepId);
  if (!step) throw new Error(`Day ${day.n} 找不到用餐步驟 ${item.stepId}`);
  return `行程預留 ${step.t} · ${step.label}（不代表已訂位）`;
}

export function renderDiningFacts(item) {
  const status = {verified:'已核實所列資料',partial:'部分核實，仍有缺項',pending:'資料待確認'}[item.verificationStatus] || '資料待確認';
  const source = safeHttpsUrl(item.sourceUrl);
  return `<p class="food-map-note">營業時間：${escapeHtml(item.hours || '待確認')}</p>
    <p class="source-meta">${status}${item.checkedAt ? ` · ${escapeHtml(item.checkedAt)}` : ''}${source ? ` · <a href="${source}" target="_blank" rel="noopener noreferrer">查核來源 ↗</a>` : ''}</p>
    ${item.verificationNote ? `<p class="food-map-note">${escapeHtml(item.verificationNote)}</p>` : ''}`;
}
