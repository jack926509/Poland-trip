import { venues } from '../data/venues.js';

/** id（如 'warsaw-royal-castle'）→ 完整景點主檔；找不到就是資料本身兜不起來，直接丟錯。 */
export function resolveVenue(id) {
  const venue = venues[id];
  if (!venue) throw new Error(`resolveVenue 找不到景點：${id}`);
  return venue;
}

/**
 * 給地址卡／圖釘用的精簡形狀：{name, address, url, officialUrl}。
 * address 目前多數景點仍是 null（切片 4b 才從 travel-database.js 併入街道地址），
 * 呼叫端要自行處理 address 為 null 的情況，不在這裡假造。
 */
export function venueAddress(id) {
  const venue = resolveVenue(id);
  return {
    name: venue.name,
    address: venue.address,
    url: venue.map,
    officialUrl: venue.officialUrl,
  };
}

/** 依 cityKey（WAW／KRK／WRO／POZ）取出該城市的景點清單，維持 venues.js 的原始順序。 */
export function venuesByCity(cityKey) {
  return Object.values(venues).filter(venue => venue.cityKey === cityKey);
}
