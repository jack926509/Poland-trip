import { escapeHtml, safeHttpsUrl } from './html.mjs';

export function mealTiming(item, day) {
  if (item.planStatus === 'unavailable') return '本日不採用；保留作其他時段參考';
  if (!item.stepId) return /早餐|午餐|晚餐/.test(item.role) ? '候選未排時段，須先調整行程' : '彈性候選，未排定時段';
  const step = day.steps.find(step => step.id === item.stepId);
  if (!step) throw new Error(`Day ${day.n} 找不到用餐步驟 ${item.stepId}`);
  return `行程預留 ${step.t} · ${step.label}（不代表已訂位）`;
}

const CITY_NAMES_BY_KEY = { warsaw: '華沙', krakow: '克拉科夫', wroclaw: '樂斯拉夫', poznan: '波茲南', wieliczka: 'Wieliczka' };

/**
 * 「行程餐廳營業時間」表的唯一來源：從每日餐位（day-dining.js）中挑出
 * 已核實或部分核實的門市，不再手寫一份會漂移的子集清單。
 * 同一門市在多天出現時只保留第一筆，順序依 Day 1→8、當天內原順序。
 */
export function plannedVerifiedPlaces(dayDiningByDay) {
  const seen = new Map();
  for (const items of Object.values(dayDiningByDay)) {
    for (const item of items) {
      if (!['verified', 'partial'].includes(item.verificationStatus)) continue;
      if (!seen.has(item.placeId)) seen.set(item.placeId, { ...item, city: CITY_NAMES_BY_KEY[item.cityKey] || item.cityKey });
    }
  }
  return [...seen.values()];
}

export function renderDiningFacts(item) {
  const status = {verified:'已核實所列資料',partial:'部分核實，仍有缺項',pending:'資料待確認'}[item.verificationStatus] || '資料待確認';
  const source = safeHttpsUrl(item.sourceUrl);
  return `<p class="food-map-note">營業時間：${escapeHtml(item.hours || '待確認')}</p>
    <p class="source-meta">${status}${item.checkedAt ? ` · ${escapeHtml(item.checkedAt)}` : ''}${source ? ` · <a href="${source}" target="_blank" rel="noopener noreferrer">查核來源 ↗</a>` : ''}</p>
    ${item.verificationNote ? `<p class="food-map-note">${escapeHtml(item.verificationNote)}</p>` : ''}`;
}
