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
  for (const name of selections[cityKey] || []) {
    const match = Object.entries(dayDining).flatMap(([day, items]) => items.map(item => ({ ...item, day }))).filter(item => key(item.name) === key(name));
    const item = match[0];
    add({ name, selected: true, ...(item ? { address: item.address, map: item.map, plan: match.map(m => `Day ${m.day} · ${m.role}：${m.note}`).join('；') } : {}) });
  }
  return [...entries.values()].sort((a, b) => Number(Boolean(b.selected)) - Number(Boolean(a.selected)));
}
