import { dayDining } from '../data/day-dining.js';
import { userPicks } from '../data/dining.js';

const aliases = {
  'e wedel pijalnia': 'wedel', 'pijalnia czekolady e wedel': 'wedel',
  'pijalnia czekolady e wedel szpitalna 8': 'wedel',
  'rogal swietomarcinski': 'rogal', 'endzior plac nowy 圓亭': 'endzior',
};
export function key(name) {
  const normalized = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/ł/g, 'l').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  return aliases[normalized] || normalized;
}

const allUserPicks = Object.values(userPicks).flat();

/**
 * 兩個正規化 key 是否代表同一家店：完全相同，或其中一邊只是多了分店／描述字
 * 的字首相符（例如「folga 現代料理」對「folga」、「el gato specialty coffee
 * odrzanska 8」對「el gato specialty coffee」）。
 */
function sameStore(keyA, keyB) {
  return keyA === keyB || keyA.startsWith(`${keyB} `) || keyB.startsWith(`${keyA} `);
}

/**
 * 判斷店名是否為使用者自選：以 key() 正規化比對 userPicks。
 */
export function isUserPick(name) {
  if (!name) return false;
  const normalized = key(name);
  return allUserPicks.some((pick) => sameStore(normalized, key(pick)));
}

export function mergeCityDining(cityKey, dining = [], primary = []) {
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
  for (const name of userPicks[cityKey] || []) {
    const pickKey = key(name);
    const dayMatch = Object.entries(dayDining).flatMap(([day, items]) => items.map(item => ({ ...item, day }))).filter(item => key(item.name) === pickKey);
    const dayItem = dayMatch[0];
    const planInfo = dayItem ? { address: dayItem.address, map: dayItem.map, plan: dayMatch.map(m => `Day ${m.day} · ${m.role}：${m.note}`).join('；') } : {};
    // 先找已由 cityDining／cityFood 收錄、名稱只差分店或描述字的既有列，補上「自選」與行程資訊；
    // 找不到才新增一列，避免同一家店因命名長短不同被拆成兩列（也才拿得到既有列上的地圖連結）。
    const existingId = [...entries.keys()].find(id => sameStore(id, pickKey));
    if (existingId) {
      const existing = entries.get(existingId);
      entries.set(existingId, { ...existing, ...planInfo, selected: true, map: planInfo.map || existing.map });
    } else {
      add({ name, selected: true, ...planInfo });
    }
  }
  return [...entries.values()].sort((a, b) => Number(Boolean(b.selected)) - Number(Boolean(a.selected)));
}
