import { dayIsoDate } from './schedule.mjs';
import { meta, stay, flights } from '../data/trip.js';

// 依住宿日期推導過夜城市；跨城日不能拿白天城市代替住宿城市。
export function dayDate(day) {
  return dayIsoDate(day.date, meta.tripStart);
}
export function nightStay(day) {
  return stayForDate(stay, dayDate(day));
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

// 「查無住宿」有兩種可能：真的離境，或資料缺漏。兩者不能混為一談——
// 把缺漏當成離境，會讓當晚沒地方住的事實被一句「機上過夜」蓋掉。
// 依據取自回程第一段實際起飛日（QR 260 於 10/31 離開 WAW），不是住宿有無。
export function departureIso() {
  const leg = (flights?.back || []).find(item => !item.layover && /\d{1,2}\/\d{1,2}/.test(item.when || ''));
  const match = leg && /(\d{1,2})\/(\d{1,2})/.exec(leg.when);
  return match
    ? `${meta.tripStart.slice(0, 4)}-${match[1].padStart(2, '0')}-${match[2].padStart(2, '0')}`
    : meta.tripEnd;
}
export function isDepartureDay(day) {
  return dayDate(day) === departureIso();
}

/** 入住日包含、退房日不包含；查不到不推定已離境。 */
export function stayForDate(stays, iso) {
  return stays.find(item => item.checkIn <= iso && iso < item.checkOut) || null;
}
