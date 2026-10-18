import { mapPins, mapPinChecks } from '../data/cities.js';
import { dayMapPlans, daySupplementaryPins } from '../data/day-maps.js';

// UX 1017 H2：圖釘編號對回時間表。
// 編號就是時間表的列序（第 N 列 → N），一顆圖釘取「最能對上它名稱」的那一列：
// 先比步驟標題，標題都對不上才比說明文字；緊接門牌號碼的名稱是地址（「Krakowskie Przedmieście 45」），不算。
// 對不上的圖釘不編號（不猜），時間表也只在有圖釘的列標出同一個數字。
// 名稱裡的城市名、「廣場」「教堂」這類通稱單獨出現時不拿來比，避免一個字眼對到好幾列。
const GENERIC_KEYS = new Set([
  '廣場', '教堂', '車站', '公園', '外觀', '入口', '主入口', '博物館', '大教堂', '市場', '紀念碑', '美術館', '市政廳', '購物中心', '伴手禮攤位', '巧克力',
  'hotel', 'cafe', 'caffe', 'coffee', 'restauracja', 'warszawa', 'warsaw', 'wrocław', 'kraków', 'krakow', 'poznań', 'poznan',
  'wrocławski', 'wrocławska', 'krakowski', 'krakowskie', 'warszawski', 'warszawska', 'poznański',
  'stare', 'miasto', 'główny', 'specialty', 'apartments', 'budget', 'rynek', 'plac', 'hala', 'stary', 'most', 'auschwitz', 'gallery', 'centralna',
]);
const CJK = /[㐀-鿿]/;
// 移動列：搭車、轉乘、走回去這類「人在路上」的列（UX 1017 驗收 F3）。
// 景點圖釘不對到移動列；車站與住宿圖釘的標題可以對到（「抵 Kraków Główny」「回 Piast 取行李」本來就是去那裡），
// 但說明文字一律不比移動列——說明裡順口提到的地名（「剩餘空檔可在 Kazimierz 短停」）不是當天的停留點。
// 同分時，先選標了 ★ 的重點列，再選非移動列，最後取較早的一列。
const MOVEMENT = /前往|搭車|搭電車|電車|地鐵|候車|火車|巴士|SKM|\bIC\b|EIP|EIC|走回|^回|回 |返回|叫 Bolt|Uber|轉乘/;
const rank = label => (/★/.test(label) ? 2 : 0) + (MOVEMENT.test(label) ? 0 : 1);
const DESTINATION_CATEGORIES = new Set(['transport', 'hotel']);

// 圖釘名稱的比對別名（UX 1017 驗收 F5）：時間表用的是較短的通稱（「★ 老城廣場」「★ 中央廣場」），
// 圖釘名稱是正式名稱，字面對不上。這裡只補比對用的別名，不改任何圖釘名稱或座標。
const PIN_ALIASES = {
  '華沙老城市場廣場': ['老城廣場'],
  '中央市集廣場': ['中央廣場'],
  '大教堂島 Ostrów Tumski': ['座堂島', '教堂島'],
  'ibis budget Krakow Stare Miasto': ['ibis'],
  '舊市集廣場 Stary Rynek': ['廣場卡正面'],
};

export function pinNameKeys(name) {
  return [...baseKeys(name), ...(PIN_ALIASES[name] || [])];
}

function baseKeys(name) {
  const segments = String(name)
    .replace(/([㐀-鿿])\s*(?=[A-Za-zÀ-ž0-9])/g, '$1|')
    .replace(/([A-Za-zÀ-ž0-9.])\s*(?=[㐀-鿿])/g, '$1|')
    .split(/[・·（）()「」,，/／|+＋→]+/).map(part => part.trim()).filter(Boolean);
  const keys = [];
  for (const segment of segments) {
    if (CJK.test(segment)) { if (segment.length >= 2 && !GENERIC_KEYS.has(segment)) keys.push(segment); continue; }
    if (segment.length >= 4 && !GENERIC_KEYS.has(segment.toLowerCase())) keys.push(segment);
    for (const word of segment.split(/[\s–-]+/)) {
      if (word !== segment && word.length >= 5 && !GENERIC_KEYS.has(word.toLowerCase())) keys.push(word);
    }
  }
  return keys;
}

// 回傳名稱在文字中最長的可信對應長度；0 代表對不上。
// 中文名稱允許取 3 字以上的連續片段（「辛德勒工廠博物館」對「★ 辛德勒工廠」），通稱片段不算。
function matchLength(keys, text, { skipAddress = false } = {}) {
  const haystack = String(text || '').toLowerCase();
  let best = 0;
  const found = needle => {
    let from = 0;
    for (;;) {
      const at = haystack.indexOf(needle, from);
      if (at === -1) return false;
      if (!skipAddress || !/^\s*\d/.test(haystack.slice(at + needle.length))) return true;
      from = at + 1;
    }
  };
  for (const key of keys) {
    const lower = key.toLowerCase();
    if (found(lower)) { best = Math.max(best, key.length); continue; }
    if (!CJK.test(key)) continue;
    for (let len = key.length - 1; len >= 3 && len > best; len -= 1) {
      let hit = false;
      for (let i = 0; i + len <= key.length; i += 1) {
        const piece = key.slice(i, i + len);
        if (GENERIC_KEYS.has(piece) || [...GENERIC_KEYS].some(word => word.includes(piece))) continue;
        if (found(piece)) { hit = true; break; }
      }
      if (hit) { best = Math.max(best, len); break; }
    }
  }
  return best;
}

// 回傳 { number, strength }：strength 用來在同一列被好幾顆圖釘搶時決定誰留下（標題對上 > 說明對上，再比對上長度）。
function matchPin(name, steps, category) {
  const none = { number: null, strength: 0 };
  const keys = pinNameKeys(name);
  if (!keys.length) return none;
  const allowMovementLabel = DESTINATION_CATEGORIES.has(category);
  const pick = scores => {
    let bestIndex = -1;
    for (let i = 0; i < scores.length; i += 1) {
      if (!scores[i]) continue;
      if (bestIndex === -1 || scores[i] > scores[bestIndex]
        || (scores[i] === scores[bestIndex] && rank(steps[i].label) > rank(steps[bestIndex].label))) bestIndex = i;
    }
    return bestIndex;
  };
  const labelScores = steps.map(step => (!allowMovementLabel && MOVEMENT.test(step.label) ? 0 : matchLength(keys, step.label, { skipAddress: true })));
  let index = pick(labelScores);
  if (index !== -1) return { number: index + 1, strength: 1000 + labelScores[index] };
  const subScores = steps.map(step => (MOVEMENT.test(step.label) ? 0 : matchLength(keys, step.sub, { skipAddress: true })));
  index = pick(subScores);
  return index === -1 ? none : { number: index + 1, strength: subScores[index] };
}

export function stepNumberForPin(name, steps, category = 'sight') {
  return matchPin(name, steps, category).number;
}

// 同一個序號只給同一個停留點：好幾顆圖釘對到同一列時，以對得最準的那顆為準，
// 相距 400 m 內的（同一列寫的「屠夫巷 → 糖果屋 → 聖伊莉莎白教堂」、座堂島上的主教座堂）共用序號，
// 更遠的就不編號，免得把兩個不同地點標成同一站。
const SAME_STOP_KM = 0.4;
const distanceKm = (a, b) => Math.hypot((a[0] - b[0]) * 111.32, (a[1] - b[1]) * 111.32 * Math.cos(a[0] * Math.PI / 180));
export function numberPins(points, steps) {
  const matches = points.map(point => matchPin(point[2], steps, point[5]));
  const anchors = new Map();
  matches.forEach((match, i) => {
    if (match.number === null) return;
    const current = anchors.get(match.number);
    if (current === undefined || match.strength > matches[current].strength) anchors.set(match.number, i);
  });
  return matches.map((match, i) => {
    if (match.number === null) return null;
    const anchor = anchors.get(match.number);
    return anchor === i || distanceKm(points[i], points[anchor]) <= SAME_STOP_KM ? match.number : null;
  });
}

// 主要步行區：以有編號（真的排進時間表）的圖釘取中位數為中心，
// 1.5 km 內的點框成預設視野；遠處的車站、住宿與搭車才到的景點仍在地圖上，按「全部地點」才一起框進來。
// 只用既有座標計算，不改任何座標資料。
const FOCUS_RADIUS_KM = 1.5;
function focusBoundsFor(points) {
  const numbered = points.filter(point => point[8]);
  if (numbered.length < 3) return null;
  const median = values => { const sorted = [...values].sort((a, b) => a - b); return sorted[Math.floor(sorted.length / 2)]; };
  const lat0 = median(numbered.map(point => point[0]));
  const lon0 = median(numbered.map(point => point[1]));
  const km = point => Math.hypot((point[0] - lat0) * 111.32, (point[1] - lon0) * 111.32 * Math.cos(lat0 * Math.PI / 180));
  const inside = numbered.filter(point => km(point) <= FOCUS_RADIUS_KM);
  if (inside.length < 3 || inside.length === points.length) return null;
  const lats = inside.map(point => point[0]);
  const lons = inside.map(point => point[1]);
  return [[Math.min(...lats), Math.min(...lons)], [Math.max(...lats), Math.max(...lons)]];
}

export function makeDayMap(day) {
  const plan = dayMapPlans[day.n];
  const selections = plan.selections;
  const points = [];
  const checks = {};
  for (const [cityKey, names] of Object.entries(selections)) {
    for (const point of mapPins[cityKey].points.filter(item => names.includes(item[2]))) {
      points.push(point);
      checks[point[2]] = mapPinChecks[cityKey][point[2]];
    }
  }
  points.push(...(daySupplementaryPins[day.n] || []));
  for (const point of daySupplementaryPins[day.n] || []) checks[point[2]] = { status: 'coordinate-verified', checkedAt: '2026-09-08', coordinateSource: point[6] };
  // point[7] 已被部分圖釘拿來放門市 ID，時間表序號放在 point[8]；複製陣列，不改到共用的城市圖釘資料。
  const numbers = numberPins(points, day.steps);
  const numberedPoints = points.map((point, i) => {
    const copy = point.slice(0, 8);
    while (copy.length < 8) copy.push(null);
    copy.push(numbers[i]);
    return copy;
  });
  return {
    center: plan.center, zoom: plan.zoom, points: numberedPoints, unlocated: [], focus: plan.focus,
    focusBounds: focusBoundsFor(numberedPoints),
    checks,
    note: `白天主地圖：${plan.focus}。共 ${points.length} 個當日景點／操作錨點；圖釘上的數字是時間表第幾列。預設框住主要步行區，按「全部地點」看全部；晚間抵達城市不納入本圖，使用 ＋／－、滾輪或雙擊縮放。`,
  };
}
