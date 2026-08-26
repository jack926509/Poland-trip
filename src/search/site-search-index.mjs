const cityDefinitions = {
  WAW: { mapKey: 'warsaw', file: 'city-warszawa.html' },
  KRK: { mapKey: 'krakow', file: 'city-krakow.html' },
  WRO: { mapKey: 'wroclaw', file: 'city-wroclaw.html' },
  POZ: { mapKey: 'poznan', file: 'city-poznan.html' },
};

const typeLabels = {
  train: '火車',
  restaurant: '餐廳',
  map: '地圖',
  city: '城市',
  itinerary: '行程',
  page: '頁面',
};

export function normalizeText(value) {
  return String(value || '')
    .normalize('NFKC')
    .toLocaleLowerCase('zh-Hant')
    .replace(/\s+/g, ' ')
    .trim();
}

function slug(value) {
  return normalizeText(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\u3400-\u9fff]+/g, '-')
    .replace(/^-|-$/g, '') || 'item';
}

function compact(parts) {
  return parts.filter(Boolean).join(' · ');
}

function searchBag(parts) {
  return normalizeText(parts.flat(Infinity).filter(Boolean).join(' '));
}

function cityLookup(cities) {
  const lookup = new Map();
  for (const city of cities) {
    const definition = cityDefinitions[city.key];
    if (!definition) continue;
    const info = { ...city, ...definition };
    lookup.set(city.key, info);
    lookup.set(city.name, info);
    lookup.set(city.pl, info);
    lookup.set(definition.mapKey, info);
  }
  return lookup;
}

function googleMapsSearch(name, city) {
  const query = encodeURIComponent(`${name} ${city}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function createRecord({ id, type, title, meta = '', summary = '', href, mapUrl = '', keywords = [] }) {
  return {
    id,
    type,
    typeLabel: typeLabels[type] || type,
    title,
    meta,
    summary,
    href,
    mapUrl,
    searchText: searchBag([typeLabels[type], title, meta, summary, keywords]),
  };
}

function restaurantRecords(data, lookup) {
  const restaurants = new Map();

  function add({ cityRef, name, detail, mapUrl = '', keywords = [] }) {
    const city = lookup.get(cityRef);
    if (!city || !name) return;
    const key = `${city.key}|${normalizeText(name)}`;
    const existing = restaurants.get(key);
    if (existing) {
      const details = new Set([existing.summary, detail].filter(Boolean));
      existing.summary = [...details].join(' · ');
      existing.mapUrl ||= mapUrl || googleMapsSearch(name, city.name);
      existing.searchText = searchBag([existing.searchText, detail, keywords]);
      return;
    }
    restaurants.set(key, createRecord({
      id: `restaurant-${city.mapKey}-${slug(name)}`,
      type: 'restaurant',
      title: name,
      meta: city.name,
      summary: detail,
      href: `${city.file}#city-dining`,
      mapUrl: mapUrl || googleMapsSearch(name, city.name),
      keywords: [city.pl, keywords],
    }));
  }

  for (const [mapKey, items] of Object.entries(data.cityDining || {})) {
    for (const item of items) {
      add({
        cityRef: mapKey,
        name: item.name,
        detail: compact([item.tier, item.highlight]),
        mapUrl: item.mapUrl,
      });
    }
  }

  for (const group of data.cityFood || []) {
    for (const item of group.items || []) {
      add({
        cityRef: group.city,
        name: item.name,
        detail: compact([item.tag, item.note]),
        mapUrl: item.map,
        keywords: [item.book],
      });
    }
  }

  for (const group of data.foodBackup || []) {
    for (const item of group.items || []) {
      add({
        cityRef: group.city,
        name: item.name,
        detail: compact([item.tag, item.note]),
        mapUrl: item.map,
        keywords: [item.book, '備案'],
      });
    }
  }

  for (const item of data.verifiedRestaurantHours || []) {
    add({
      cityRef: item.city,
      name: item.name,
      detail: compact([item.address, item.hours, item.feature]),
      keywords: [item.url, '已查營業時間'],
    });
  }

  return [...restaurants.values()];
}

export function buildTravelSearchRecords(data) {
  const lookup = cityLookup(data.cities || []);
  const records = [];

  for (const [index, train] of (data.trains || []).entries()) {
    records.push(createRecord({
      id: `train-${index + 1}-${slug(train.seg)}`,
      type: 'train',
      title: train.seg.replace(/WAW/g, '華沙').replace(/KRK/g, '克拉科夫').replace(/WRO/g, '樂斯拉夫').replace(/POZ/g, '波茲南'),
      meta: compact([train.date, `${train.dep} → ${train.arr}`]),
      summary: compact([train.type, train.dur, train.status, train.price]),
      href: 'practical/booking.html#rail-itinerary',
      keywords: [train.seg, '時刻表', '城際交通', 'PKP Intercity'],
    }));
  }

  const stories = new Map((data.cityStories || []).map(story => [story.city, story]));
  for (const city of data.cities || []) {
    const definition = cityDefinitions[city.key];
    if (!definition) continue;
    const story = stories.get(city.name);
    records.push(createRecord({
      id: `city-${definition.mapKey}`,
      type: 'city',
      title: `${city.name} ${city.pl}｜城市特色`,
      meta: city.vibe,
      summary: (city.highlights || []).join('、'),
      href: definition.file,
      keywords: [
        city.tag,
        story?.geo,
        story?.history,
        story?.stories?.flatMap(item => [item.title, item.text]),
        story?.onSite,
      ],
    }));
  }

  for (const [mapKey, mapData] of Object.entries(data.mapPins || {})) {
    const city = lookup.get(mapKey);
    if (!city) continue;
    for (const [index, point] of (mapData.points || []).entries()) {
      records.push(createRecord({
        id: `map-${mapKey}-${index + 1}-${slug(point[2])}`,
        type: 'map',
        title: point[2],
        meta: compact([city.name, point[3]]),
        summary: `${city.name}互動地圖圖釘`,
        href: `${city.file}#map-${mapKey}`,
        mapUrl: point[4] || '',
        keywords: [city.pl, point[5], '位置', '景點'],
      }));
    }
  }

  records.push(...restaurantRecords(data, lookup));

  for (const day of data.days || []) {
    records.push(createRecord({
      id: `itinerary-day-${day.n}`,
      type: 'itinerary',
      title: `Day ${day.n}｜${day.title}`,
      meta: compact([day.date, day.city]),
      summary: day.headline,
      href: `day-${String(day.n).padStart(2, '0')}.html`,
      keywords: [
        day.tag,
        day.train && Object.values(day.train),
        day.steps?.flatMap(step => Object.values(step)),
        day.eat,
        day.practical?.flatMap(item => Object.values(item)),
      ],
    }));
  }

  return records;
}

function decodeEntities(value) {
  const entities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&nbsp;': ' ',
  };
  return value.replace(/&(amp|lt|gt|quot|#39|nbsp);/g, match => entities[match] || match);
}

function mainText(html) {
  const main = String(html || '').match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  if (!main) return '';
  return normalizeText(decodeEntities(main[1]
    .replace(/<(script|style|template)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')));
}

export function buildPageSearchRecords(pages) {
  return pages.map((page, index) => createRecord({
    id: `page-${index + 1}-${slug(page.relativePath)}`,
    type: 'page',
    title: page.title,
    meta: page.meta || '全站資料',
    summary: page.summary || '前往頁面查看完整內容',
    href: page.relativePath,
    keywords: [mainText(page.html)],
  }));
}

export function serializeSearchIndex(records) {
  return JSON.stringify(records)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
