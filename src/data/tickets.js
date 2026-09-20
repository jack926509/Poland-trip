// tickets.js — 門票頁與稽核用的三個既有 export（fares／ticketsByCity／venueHours）
// 精煉切片 4a 之前，這三個 + cities.js 的 attractions[].priceNote 是同一批景點事實的
// 四份平行表，各自手打。現在單一來源移到 venues.js（見該檔開頭說明與矛盾修正 #5／
// #11／#12），這裡只做「從 venues.js 推導回原本形狀」——export 名稱、欄位與模板消費端
// 暫不動，好讓這次改動的 diff 侷限在資料層。
//
// 切片 4b 把 venues.js 擴大成「景點＋地點」共用主檔（車站、廣場、代表處這類純
// 地址地標也在裡面，供 travel-database.js／day-maps.js 用），fares 只取
// 有 prices 的票券景點，過濾條件是新加的，其餘邏輯不變。
import { venues, ticketsByCityExtras } from './venues.js';

// fares：Object.values 依 venues.js 的 key 插入順序回傳，與原本 fares 陣列的
// 城市分組順序（華沙→克拉科夫→樂斯拉夫→波茲南）一致；POLIN、華沙起義博物館
// 兩筆原本只存在於 ticketsByCity／venueHours、fares 表沒有，這裡補上（4a 範圍）。
export const fares = Object.values(venues).filter(venue => venue.prices).map(venue => ({
  name: venue.name,
  fullPrice: venue.prices.full,
  discountPrice: venue.prices.discount,
  note: venue.prices.note,
  officialUrl: venue.officialUrl,
  mapUrl: venue.map,
}));

// ticketsByCity：原本的「城市分組行程摘要」，多數項目對應到 venues.js 的
// shortLabel／quickNote；有 4 筆（蕭邦博物館、聖瑪利亞教堂登塔、奧斯威辛導覽
// 訂位狀態、地下市集博物館）不是票價／開放時間事實，不硬塞進景點主檔，改由
// ticketsByCityExtras 提供，插入順序與原陣列一致。
const extra = key => ticketsByCityExtras[key];
const venueItem = id => {
  const venue = venues[id];
  if (!venue?.shortLabel || !venue?.quickNote) throw new Error(`venues['${id}'] 缺 shortLabel／quickNote，無法組 ticketsByCity`);
  return [venue.shortLabel, venue.quickNote];
};

export const ticketsByCity = [
  {city:'華沙', items:[
    venueItem('warsaw-royal-castle'),
    venueItem('warsaw-polin'),
    venueItem('warsaw-rising-museum'),
    extra('chopinMuseum'),
    venueItem('warsaw-pkin-terrace'),
    venueItem('warsaw-wedel-chocolate'),
    venueItem('warsaw-msn'),
  ]},
  {city:'克拉科夫', items:[
    venueItem('krakow-wawel-castle'),
    venueItem('krakow-wawel-treasury'),
    venueItem('krakow-schindler'),
    extra('stMaryTower'),
    extra('auschwitzTour'),
    venueItem('krakow-wieliczka'),
    extra('rynekUnderground'),
  ]},
  {city:'樂斯拉夫', items:[
    venueItem('wroclaw-hala-stulecia'),
    venueItem('wroclaw-panorama'),
    venueItem('wroclaw-zoo'),
  ]},
  {city:'波茲南', items:[
    venueItem('poznan-croissant-museum'),
    venueItem('poznan-palmiarnia'),
    venueItem('poznan-archaeological-museum'),
    venueItem('poznan-ck-zamek'),
    venueItem('poznan-old-town-hall-museum'),
  ]},
];

export const ticketNotices = [
  {status:'已訂妥', level:'reminder', text:'奧斯威辛 10/26 10:30 英文個人 educator 導覽（官方標示約 3 小時 45 分，2 人）已完成訂購。入場證只在線上提供，且官方載明須搭配身分證件；請把入場證存離線並隨身帶護照。', url:'https://www.auschwitz.org/en/visiting/'},
  {status:'開賣再確認', level:'reminder', text:'博物館活動、臨時閉館與可售場次仍可能調整；本站不把「查證過」誤寫成「已訂到」，購票時請以官方日曆為準。', url:'https://visit.auschwitz.org/'},
];

// venueHours：只給有結構化開放時間的場館（venues.js 的 hours 不是 null 的那些）。
// tools/audit-schedule.mjs 用這個檢查行程步驟有沒有排在末入場之後、有沒有撞公休日。
export const venueHours = Object.fromEntries(
  Object.entries(venues)
    .filter(([, venue]) => venue.hours)
    .map(([id, venue]) => [id, {
      name: venue.name,
      closedWeekdays: venue.hours.closedWeekdays,
      opens: venue.hours.opens,
      closes: venue.hours.closes,
      lastEntry: venue.hours.lastEntry,
      checkedAt: venue.hours.checkedAt,
      sourceRef: venue.hours.sourceRef,
      officialUrl: venue.officialUrl,
      note: venue.hours.note,
    }]),
);
