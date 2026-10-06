import { mergeCityDining } from '../templates/city-dining.mjs';
import { fastFoodDiningEntries } from '../templates/fast-food.mjs';
import { dayDining } from '../data/day-dining.js';
import { segmentForDay } from '../lib/rail.mjs';
const cityDefinitions = {
  WAW: { mapKey: 'warsaw', file: 'city-warszawa.html' },
  KRK: { mapKey: 'krakow', file: 'city-krakow.html' },
  WRO: { mapKey: 'wroclaw', file: 'city-wroclaw.html' },
  POZ: { mapKey: 'poznan', file: 'city-poznan.html' },
};

const typeLabels = {
  train: '火車',
  bus: '巴士',
  restaurant: '餐廳',
  map: '地圖',
  city: '城市',
  itinerary: '行程',
  page: '頁面',
};

export function normalizeText(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/gi, 'l')
    .toLocaleLowerCase('zh-Hant')
    .replace(/\s+/g, ' ')
    .trim();
}

function canonicalName(value) {
  return normalizeText(value).replace(/[^a-z0-9\u3400-\u9fff]+/g, '');
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
  const records = new Map();
  for (const [cityKey, items] of Object.entries(data.cityDining || {})) {
    const city = lookup.get(cityKey);
    if (!city) continue;
    const rows = mergeCityDining(cityKey, items,
      (data.cityFood || []).find(group => group.city === city.name)?.items || [],
      data.snacksAndCafes?.[cityKey] || [],
      fastFoodDiningEntries({branches:data.fastFoodBranches?.[cityKey] || [], chains:data.fastFoodChains || [], hub:data.fastFoodHubs?.find(h => h.cityKey === cityKey)}));
    for (const row of rows) {
      const placeId = row.placeId || row.id || `${cityKey}-${slug(row.name)}`;
      const record = createRecord({id:`restaurant-${placeId}`, type:'restaurant', title:row.name,
        meta:compact([city.name, row.address]), summary:compact([row.tier, row.verificationStatus === 'verified' ? '已核實所列資料' : row.verificationStatus === 'partial' ? '部分核實' : '資料待確認', row.checkedAt, row.hours, ...(row.notes || []), ...(row.plans || []).map(text => text.replace(/<[^>]*>/g, ''))]),
        href:`${city.file}#city-dining`, mapUrl:row.map || '', keywords:[row.chain, '餐廳', row.role === 'fastfood' ? '速食 連鎖' : '', row.verificationStatus]});
      records.set(placeId, {...record, placeId});
    }
  }
  // 四座城市以外或店家待選的用餐，也可從餐廳分類回到原定日期。
  for (const [day, items] of Object.entries(dayDining)) for (const item of items) {
    if (records.has(item.placeId)) continue;
    records.set(item.placeId, {...createRecord({id:`restaurant-${item.placeId}`, type:'restaurant', title:item.name,
      meta:item.address, summary:compact([item.role, item.note, item.hours]), href:`day-${String(day).padStart(2,'0')}.html#day-food`, mapUrl:item.map}), placeId:item.placeId});
  }
  return [...records.values()];
}

export function buildTravelSearchRecords(data) {
  const lookup = cityLookup(data.cities || []);
  const records = [];

  for (const [index, train] of (data.trains || []).entries()) {
    const isBus = /\bBUS\b/i.test(train.type || '');
    const transportType = isBus ? 'bus' : 'train';
    records.push(createRecord({
      id: `${transportType}-${index + 1}-${slug(train.seg)}`,
      type: transportType,
      title: train.seg.replace(/WAW/g, '華沙').replace(/KRK/g, '克拉科夫').replace(/WRO/g, '樂斯拉夫').replace(/POZ/g, '波茲南'),
      meta: compact([train.date, `${train.dep} → ${train.arr}`]),
      summary: compact([train.trainNo, train.name, train.type, train.dur, train.status, train.price]),
      href: 'practical/booking.html#rail-itinerary',
      keywords: isBus
        ? [train.seg, '巴士 班次', '公車 客運', 'Lajkonik']
        : [train.seg, '時刻表', '城際交通', 'PKP Intercity'],
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

  for (const product of data.groceryProducts || []) {
    records.push(createRecord({
      id: `product-${product.id}`,
      type: 'page',
      title: `${product.localName}｜${product.name}`,
      meta: '波蘭超市採買推薦',
      summary: product.use || product.reason || '',
      href: `practical/groceries.html#product-${product.id}`,
      keywords: [product.packaging, product.reason, '商品 超市'],
    }));
  }

  for (const day of data.days || []) {
    const daySegment = segmentForDay(day);
    const publicTrain = daySegment && [
      daySegment.type,
      daySegment.leg,
      daySegment.from,
      daySegment.to,
      daySegment.dep,
      daySegment.arr,
      daySegment.dur,
      daySegment.price,
    ];
    const publicSteps = day.steps?.map(step => [step.t, step.label, step.sub, step.cost, step.dur]);
    const publicPractical = day.practical?.map(item => (
      typeof item === 'string' ? item : [item.tag, item.name, item.note]
    ));
    records.push(createRecord({
      id: `itinerary-day-${day.n}`,
      type: 'itinerary',
      title: `Day ${day.n}｜${day.title}`,
      meta: compact([day.date, day.city]),
      summary: day.headline,
      href: `day-${String(day.n).padStart(2, '0')}.html`,
      keywords: [
        day.tag,
        publicTrain,
        publicSteps,
        day.eat?.map(item => (typeof item === 'string' ? item : [item.text, item.place].filter(Boolean).join(' '))),
        publicPractical,
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
    .replace(/<article\b[^>]*\bdata-privacy=["']private["'][^>]*>[\s\S]*?<\/article>/gi, ' ')
    .replace(/<([a-z][a-z0-9]*)\b[^>]*\bdata-search-private(?:=["'][^"']*["'])?[^>]*>[\s\S]*?<\/\1>/gi, ' ')
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
