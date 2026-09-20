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

const isoToShortDate = iso => iso.slice(5).replace('-', '/');

/**
 * 給城市地圖用的住宿圖釘：直接從 stay 推導，不再由 cities.js 另存一份座標與地址。
 * 同一間飯店在同城市分兩段入住（例如華沙 Hotel Metropol 抵達／回程各一段）時，
 * 傳入這幾筆 id，圖釘標籤會把入住區間合併成一列，座標與導航仍以第一筆為準。
 * 導航連結是否帶完整門牌，直接跟著 stay[].addressVerified 走——
 * 門牌未核對時只用旅館名稱＋城市查詢，避免導去一個沒人核對過的地址。
 */
export function stayPin(ids) {
  const list = (Array.isArray(ids) ? ids : [ids]).map(id => {
    const booking = stay.find(item => item.id === id);
    if (!booking) throw new Error(`stayPin 找不到住宿資料：${id}`);
    return booking;
  });
  const [first] = list;
  const dateLabel = list.map(item => `${isoToShortDate(item.checkIn)}–${isoToShortDate(item.checkOut)}`).join('、');
  const query = first.addressVerified ? `${first.name}, ${first.address}` : `${first.name}, ${first.city}`;
  const addressLabel = first.addressVerified ? first.address : '門牌待確認';
  return [
    first.coordinates.lat, first.coordinates.lng, first.name,
    `已確認住宿 · ${dateLabel} · ${addressLabel}`,
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
    'hotel',
  ];
}
