import { dayDining } from '../data/day-dining.js';
import { days } from '../data/trip.js';

/**
 * 城市指南與每日行程的對照表。
 *
 * 2026-09-14 之前這裡是一份手寫的 selections 名單，每新增一家每日餐位就得記得回來補一次，
 * 漏了也沒有任何徵兆（Day 2 的 Bar Mleczny Pod Temidą 就這樣漏了，城市頁看不出它排進行程）。
 * 現在改成直接由 day-dining.js 與 trip.js 的 day.eat 推導，名單不再手寫。
 */
export const cityGuides = {
  warsaw: { file: 'city-warszawa.html', name: '華沙' },
  krakow: { file: 'city-krakow.html', name: '克拉科夫' },
  wroclaw: { file: 'city-wroclaw.html', name: '樂斯拉夫' },
  poznan: { file: 'city-poznan.html', name: '波茲南' },
};

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
  return day ? { n: day.n, href: `${prefix}day-${String(day.n).padStart(2, '0')}.html` } : null;
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

const aliases = {
  'e wedel pijalnia': 'wedel', 'pijalnia czekolady e wedel': 'wedel',
  'rogal swietomarcinski': 'rogal', 'endzior plac nowy 圓亭': 'endzior',
};

export function key(name) {
  const normalized = name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/ł/g, 'l').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  return aliases[normalized] || normalized;
}

/**
 * 順路必吃的店名常帶地區或分店註記（「Zapiecek（老城多家分店）」「Okrąglak, Plac Nowy」），
 * 和城市表的寫法對不起來，因此比對前先去掉括號與逗號之後的部分。
 */
function coreKey(name) {
  return key(name.replace(/[（(][^）)]*[)）]/g, ' ').replace(/,.*$/, ' '));
}

/** 只認完全相同或「整個詞開頭」（"a blikle" ↔ "a blikle 1869"），避免短字串誤配。 */
function sameStore(a, b) {
  if (!a || !b) return false;
  if (a === b) return true;
  const [short, long] = a.length < b.length ? [a, b] : [b, a];
  return short.length >= 4 && long.startsWith(`${short} `);
}

/**
 * 必吃在城市表要補的說明。沒有 note 時退回 text 的菜色部分（「Pierogi @ Zapiecek」取前半），
 * 若那段其實就是店名本身（「Pierożki u Vincenta（Kazimierz）」），就不重複印在同名的列底下。
 */
function mustEatDetail(item, rowName) {
  if (item.note) return item.note;
  const text = (item.text.includes(' @ ') ? item.text.split(' @ ')[0] : item.text).trim();
  return sameStore(coreKey(text), coreKey(rowName)) ? '' : text;
}

function dayLink(day, label) {
  return `<a href="day-${String(day).padStart(2, '0')}.html#day-food">${label}</a>`;
}

/** 這座城市在每日行程裡排定的餐位（day-dining.js）。 */
export function plannedMealsFor(cityKey) {
  return Object.entries(dayDining).flatMap(([day, items]) => items
    .filter(item => item.cityGuide !== false && detectCity(item.address, item.map) === cityKey)
    .map(item => ({ day: Number(day), item })));
}

/** 這座城市的順路必吃（trip.js 的 day.eat）。沒有門牌，所以只用來標記既有的列。 */
export function mustEatsFor(cityKey) {
  return days.flatMap(day => (day.eat || [])
    .filter(item => typeof item !== 'string' && detectCity(item.place, item.map) === cityKey)
    .map(item => ({ day: day.n, item })));
}

/**
 * 把資料併成單一份「行程餐廳推薦」清單：
 * 城市餐飲情報（cityDining）、行程餐廳與備案（cityFood 的 role）、
 * 小吃 · 牛奶吧 · 咖啡廳（snacksAndCafes），再疊上每日行程的餐位與順路必吃。
 * 同一家店只留一列，排序為 你的候選 → 順路必吃 → 主推 → 備案 → 小吃 · 咖啡。
 */
export function mergeCityDining(cityKey, dining = [], primary = [], snacks = [], fastFood = []) {
  const entries = new Map();
  function add(item) {
    const id = key(item.name);
    const previous = entries.get(id) || { name: item.name, notes: [], plans: [] };
    const notes = [...new Set([...previous.notes, ...[item.note, item.highlight].filter(Boolean)])];
    entries.set(id, { ...previous, ...item, notes, plans: previous.plans, map: item.map || item.mapUrl || previous.map });
  }
  for (const item of primary) {
    if (item.maps?.length) {
      for (const link of item.maps) add({ ...item, name: link.name, map: link.url, maps: undefined });
    } else add(item);
  }
  dining.forEach(add);
  // 小吃、牛奶吧與咖啡廳原本是另一個區塊，現在併進同一張表；
  // 與上面重複的店（例如 Endzior、Konspira、Pyra Bar）只會補上營業時間，不另開一列。
  for (const item of snacks) {
    const previous = entries.get(key(item.name));
    // 已經是主推或備案的店不因為也出現在小吃名單而被降級，只補上營業時間與說明。
    add({ ...item, tier: previous?.tier || item.type, role: previous ? previous.role : 'snack' });
  }

  // 連鎖速食排在最後：它不是推薦，是候選都失效時的落腳點。
  // 走同一條合併路徑的好處是——哪天真的把某家速食排進 day-dining.js，
  // 它會自動升格成「你的候選」並帶出 Day 連結，不必記得回來改這裡。
  for (const item of fastFood) {
    const previous = entries.get(key(item.name));
    add({ ...item, role: previous ? previous.role : 'fastfood' });
  }

  // 每日排定的餐位：城市表沒有這家店就新增一列，並把 Day 連回該日行程。
  for (const { day, item } of plannedMealsFor(cityKey)) {
    add({ name: item.name, selected: true, address: item.address, map: item.map });
    const entry = entries.get(key(item.name));
    entry.plans = [...entry.plans, `${dayLink(day, `Day ${day}`)} · ${item.role}：${item.note}`];
  }

  // 順路必吃沒有門牌，只標記既有的列，不會憑空長出沒有地址的店。
  for (const { day, item } of mustEatsFor(cityKey)) {
    const wanted = coreKey(item.place || item.text);
    const entry = [...entries.values()].find(row => sameStore(coreKey(row.name), wanted));
    if (!entry) continue;
    entry.mustEat = true;
    const detail = mustEatDetail(item, entry.name);
    entry.plans = [...entry.plans, `${dayLink(day, `Day ${day}`)} · 順路必吃${detail ? `：${detail}` : ''}`];
  }

  const order = { backup: 3, snack: 4, fastfood: 5 };
  const rank = row => (row.selected ? 0 : row.mustEat ? 1 : order[row.role] ?? 2);
  return [...entries.values()].sort((a, b) => rank(a) - rank(b));
}

// ── 欄位去重 ─────────────────────────────────────────────────────
// 餐廳表四欄的內容有各自來源，實際渲染後常出現同一句話寫兩次：地址已在店名欄，
// 「料理特色」又抄一次；「行程安排」再把料理特色與營業時間複述一遍。
// 以「子句」為單位比對（不是字串片段），只刪掉在鄰欄已經一字不差出現過的整句，
// 避免把半句話切碎而讓事實走樣。多重保護：太短的子句不判重、第一句一律保留
// （帶 Day 與角色前綴）、全部被判重時退回原文。
const CLAUSE_SPLIT = /(?<=[；;。])/;

export function dropDuplicateClauses(text, ...seen) {
  const source = String(text ?? '').trim();
  if (!source) return source;
  const pool = seen.filter(Boolean).map(value => String(value).replace(/\s+/g, ''));
  if (!pool.length) return source;

  const parts = source.split(CLAUSE_SPLIT);
  const kept = parts.filter((part, index) => {
    if (index === 0) return true;                       // 首句帶 Day／角色前綴，一律保留
    const norm = part.replace(/\s+/g, '').replace(/[；;。]$/, '');
    if (norm.length < 8) return true;                   // 太短不判重，避免誤刪短事實
    return !pool.some(entry => entry.includes(norm));
  });
  const result = kept.join('').replace(/^[；;。\s]+/, '').trim();
  return result || source;                              // 全被判重就退回原文
}

/**
 * notes 由主推、候選、小吃三份來源合併而來，常把同一件事講好幾次
 *（例如 Bar Mleczny Pod Temidą 的「Grodzka 43」出現三次）。
 * 逐筆比對：被其他筆完整包含的、或只是重述店名欄已有地址的，就不再列。
 */
export function dedupeNotes(notes, address = '') {
  const norm = value => String(value ?? '').replace(/\s+/g, '');
  const addr = norm(address);
  // 每筆 notes 常以門牌開頭（「Grodzka 43 · ……」），而門牌就在隔壁的店名欄，
  // 三筆來源各寫一次就變成同一個地址連出現三次。開頭的門牌回聲一律剝掉。
  const street = String(address ?? '').split(/[,，]/)[0].trim();
  const echo = street.length >= 3
    ? new RegExp(`^${street.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*[·・,，:：-]?\\s*`)
    : null;
  const kept = [];
  for (const note of notes || []) {
    const text = String(note ?? '').trim().replace(echo || /(?!)/, '').trim();
    if (!text) continue;
    const key = norm(text);
    // 整筆只是在覆述地址
    if (addr && key.length >= 6 && addr.includes(key)) continue;
    // 已被其他筆完整包含
    if (kept.some(other => norm(other).includes(key))) continue;
    // 反向：這筆更完整，換掉被它包含的舊筆
    const index = kept.findIndex(other => key.includes(norm(other)));
    if (index !== -1) { kept[index] = text; continue; }
    kept.push(text);
  }
  return kept;
}

/**
 * 「行程安排」欄下方已經有專門的營業時間行，敘述裡再抄一次只是把欄位撐長。
 * 只刪掉「含時刻、且內容已出現在 hours 欄」的逗號子句——沒有時刻的句子一律保留，
 * 避免把動線說明或訂位提醒一起刪掉。
 */
export function dropRestatedHours(plan, hours) {
  const text = String(plan ?? '');
  if (!hours) return text;
  const normHours = String(hours).replace(/\s+/g, '');
  const kept = text.split(/(?<=[，,；;])/).filter((segment, index) => {
    if (index === 0) return true;
    const norm = segment.replace(/\s+/g, '').replace(/[，,；;]$/, '');
    if (norm.length < 8) return true;
    if (!/\d{1,2}:\d{2}/.test(norm)) return true;       // 沒有時刻就不是營業時間複述
    const core = norm.replace(/^(公開資料列|官網每日|公告營業至|營業時間[：:]?|每日)/, '');
    return !(core.length >= 6 && normHours.includes(core));
  }).join('');
  return kept.replace(/[，,；;]\s*$/, '').trim() || text;
}
