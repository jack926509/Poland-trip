import { dayDining } from '../data/day-dining.js';

const selections = {
  warsaw: ['MEI', 'QQ Warsaw | Matcha & Korean Toasts', 'Yache Korea', 'Arirang Restaurant', 'Pyzy Flaki Gorące', 'WYRAJ', 'NUTA', 'Café Bristol', 'Specjały Regionalne', 'Pijalnia Czekolady E.Wedel'],
  krakow: ['Hankki', 'NOAH', 'Pod Aniołami', 'Endzior', 'FOLGA'],
  wroclaw: ['Restauracja Wrocławska', 'IDA kuchnia i wino', 'Samarqand', 'Konspira', 'El Gato Specialty Coffee Roasters', 'Dessert Boutique'],
  poznan: ['Hyćka', 'Pyra Bar', 'ROGAL Świętomarciński'],
};
const aliases = {
  'e wedel pijalnia': 'wedel', 'pijalnia czekolady e wedel': 'wedel',
  'rogal swietomarcinski': 'rogal', 'endzior plac nowy 圓亭': 'endzior',
};
function key(name) {
  const normalized = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/ł/g, 'l').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  return aliases[normalized] || normalized;
}

/**
 * 把四個來源併成單一份「行程餐廳推薦」清單：
 * 城市餐飲情報（cityDining）、行程餐廳與備案（cityFood 的 role）、
 * 小吃 · 牛奶吧 · 咖啡廳（snacksAndCafes）、你的候選（day-dining.js）。
 * 同一家店只留一列，排序為 候選 → 主推 → 備案 → 小吃 · 咖啡。
 */
export function mergeCityDining(cityKey, dining = [], primary = [], snacks = []) {
  const entries = new Map();
  function add(item) {
    const id = key(item.name);
    const previous = entries.get(id) || { name: item.name, notes: [] };
    const notes = [...new Set([...previous.notes, ...[item.note, item.highlight].filter(Boolean)])];
    entries.set(id, { ...previous, ...item, notes, map: item.map || item.mapUrl || previous.map });
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
  for (const name of selections[cityKey] || []) {
    const match = Object.entries(dayDining).flatMap(([day, items]) => items.map(item => ({ ...item, day }))).filter(item => key(item.name) === key(name));
    const item = match[0];
    add({ name, selected: true, ...(item ? { address: item.address, map: item.map, plan: match.map(m => `Day ${m.day} · ${m.role}：${m.note}`).join('；') } : {}) });
  }
  const order = { backup: 2, snack: 3 };
  const rank = item => (item.selected ? 0 : order[item.role] ?? 1);
  return [...entries.values()].sort((a, b) => rank(a) - rank(b));
}
