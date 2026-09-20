import { venues } from '../data/venues.js';

/** id（如 'warsaw-royal-castle'）→ 完整景點主檔；找不到就是資料本身兜不起來，直接丟錯。 */
export function resolveVenue(id) {
  const venue = venues[id];
  if (!venue) throw new Error(`resolveVenue 找不到景點：${id}`);
  return venue;
}

/**
 * 給地址卡／圖釘用的精簡形狀：{name, address, url, officialUrl, entranceNote, coords}。
 * address／entranceNote／coords 不是每筆都有；沒有來源就是 null，呼叫端要自行
 * 處理，不在這裡假造。
 */
export function venueAddress(id) {
  const venue = resolveVenue(id);
  return {
    name: venue.name,
    address: venue.address,
    url: venue.map,
    officialUrl: venue.officialUrl,
    entranceNote: venue.entranceNote ?? null,
    coords: venue.coords ?? null,
  };
}

/** 依 cityKey（WAW／KRK／WRO／POZ）取出該城市的景點清單，維持 venues.js 的原始順序。 */
export function venuesByCity(cityKey) {
  return Object.values(venues).filter(venue => venue.cityKey === cityKey);
}

/**
 * 給 day-maps.js 補充圖釘用：座標／導航連結從 venues.js 取，當日情境的
 * label、圖釘分類、座標查證來源仍由呼叫端傳入（同一地點在不同天的補充圖釘
 * 敘述本來就不同，不是可以收斂進主檔的事實）。displayName 允許覆寫，因為
 * 部分圖釘沿用的顯示字樣（如「Auschwitz II–Birkenau 主入口」）比 venues.js
 * 的正式名稱多帶一點現場說明，不能直接改掉頁面上原本的文字。
 * 回傳形狀與既有 daySupplementaryPins 的原始 tuple 完全一致：
 * [lat, lng, name, label, mapUrl, category, coordinateSource]。
 */
export function venuePin(id, { label, category, coordinateSource, displayName, mapUrl } = {}) {
  const venue = resolveVenue(id);
  if (!venue.coords) throw new Error(`venuePin：${id} 沒有座標（venues.js 的 coords 是 null）`);
  return [venue.coords[0], venue.coords[1], displayName ?? venue.name, label, mapUrl ?? venue.map, category, coordinateSource];
}
