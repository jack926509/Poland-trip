import { days } from '../data/trip.js';
import { dayHref } from './journey.mjs';

// mapKey（資料）、key（城市代碼）、fileKey（網址）在此統一對照。
export const cityRoutes = [
  { mapKey: 'warsaw', key: 'WAW', fileKey: 'warszawa', name: '華沙', localName: 'Warszawa' },
  { mapKey: 'krakow', key: 'KRK', fileKey: 'krakow', name: '克拉科夫', localName: 'Kraków' },
  { mapKey: 'wroclaw', key: 'WRO', fileKey: 'wroclaw', name: '樂斯拉夫', localName: 'Wrocław' },
  { mapKey: 'poznan', key: 'POZ', fileKey: 'poznan', name: '波茲南', localName: 'Poznań' },
];
export const cityGuides = Object.fromEntries(cityRoutes.map(city => [
  city.mapKey, { file: `city-${city.fileKey}.html`, name: city.name },
]));

/** 中文城市名 → 城市指南頁。實用資料的欄位常帶城市（「華沙 · 皇家城堡」「⭐⭐ Bottiglieria 1881（克拉科夫）」），
 *  用這個把實用資料接回城市指南。找不到就回 null，不硬給連結。 */
export function cityGuideByName(text, prefix = '') {
  if (!text) return null;
  const match = Object.values(cityGuides).find(guide => text.includes(guide.name));
  return match ? { ...match, href: `${prefix}${match.file}` } : null;
}

/** 「10/25」→ 該日的每日行程頁。日期取自 trip.js 的 days，對不上就回 null。 */
export function dayPageForDate(date, prefix = '') {
  if (!date) return null;
  const day = days.find(item => item.date.startsWith(date));
  return day ? { n: day.n, href: `${prefix}${dayHref(day)}` } : null;
}

/**
 * 這座城在行程裡的哪幾天。day.city 寫成「克拉科夫 → 樂斯拉夫」這種跨城字串，
 * 含城市名就算，所以跨城日會同時屬於兩座城——和 day.mjs 既有的判斷方式一致。
 */
export function daysInCity(cityKey) {
  const name = cityGuides[cityKey]?.name;
  if (!name) return [];
  return days.filter(day => day.city.includes(name)).map(day => day.n);
}

/** 這一天會待在哪幾座城，依當天的移動方向排（day.city 的字面順序）。 */
export function cityKeysForDay(day) {
  return Object.keys(cityGuides)
    .filter(key => day.city.includes(cityGuides[key].name))
    .sort((a, b) => day.city.indexOf(cityGuides[a].name) - day.city.indexOf(cityGuides[b].name));
}

/**
 * 從門牌或 Google Maps 連結判斷城市。字尾的 negative lookahead 是必要的：
 * Café Bristol 的門牌是華沙的「Krakowskie Przedmieście」，不加就會同時命中克拉科夫。
 */
const cityPatterns = {
  warsaw: /warszaw[aąęy]|warsaw(?![a-ząćęłńóśźż])/i,
  krakow: /krak[oó]w(?![a-ząćęłńóśźż])/i,
  wroclaw: /wroc[lł]aw(?![a-ząćęłńóśźż])/i,
  poznan: /pozna[nń](?![a-ząćęłńóśźż])/i,
};

export function detectCity(...values) {
  const text = values.filter(Boolean).map(value => {
    try { return decodeURIComponent(value); } catch { return value; }
  }).join(' ');
  const hits = Object.keys(cityPatterns).filter(city => cityPatterns[city].test(text));
  // 同時命中兩座城市就當作判斷不出來，寧可少標也不要標錯。
  return hits.length === 1 ? hits[0] : null;
}
