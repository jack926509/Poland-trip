import { meta, stay } from '../data/trip.js';

// 依住宿日期推導過夜城市；跨城日不能拿白天城市代替住宿城市。
export function dayDate(day) {
  const [month, date] = day.date.split(' ')[0].split('/');
  return `${meta.tripStart.slice(0, 4)}-${month.padStart(2, '0')}-${date.padStart(2, '0')}`;
}
export function nightStay(day) {
  const date = dayDate(day);
  return stay.find(item => item.checkIn <= date && date < item.checkOut) || null;
}
export function checkoutStay(day) {
  return stay.find(item => item.checkOut === dayDate(day)) || null;
}
export function bookingProgress(day) {
  const confirmed = [], pending = [];
  for (const item of day.mustBook || []) {
    (/已訂妥|已完成|已購票/.test(item) && !/尚未|未完成|未購票/.test(item) ? confirmed : pending).push(item);
  }
  return { confirmed, pending };
}
export const dayHref = day => `day-${String(day.n).padStart(2, '0')}.html`;
