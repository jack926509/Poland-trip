// 今日卡天氣：每一天抓哪裡的預報，以白天主要停留的地點為準（轉場日取白天所在城市）。
// climate 為 10 月下旬的大約平均（白天高溫／清晨低溫），只在抓不到預報時顯示，不是預報。
export const weatherPoints = {
  1: { place: '華沙', lat: 52.2297, lng: 21.0122, climate: { high: 11, low: 4 } },
  2: { place: '克拉科夫', lat: 50.0614, lng: 19.9372, climate: { high: 12, low: 3 } },
  3: { place: 'Oświęcim（奧斯威辛）', lat: 50.0274, lng: 19.2036, climate: { high: 12, low: 3 } },
  4: { place: 'Wieliczka／克拉科夫', lat: 50.0614, lng: 19.9372, climate: { high: 12, low: 3 } },
  5: { place: '樂斯拉夫', lat: 51.1079, lng: 17.0385, climate: { high: 13, low: 4 } },
  6: { place: '波茲南', lat: 52.4064, lng: 16.9252, climate: { high: 12, low: 4 } },
  7: { place: '華沙', lat: 52.2297, lng: 21.0122, climate: { high: 11, low: 4 } },
  8: { place: '華沙', lat: 52.2297, lng: 21.0122, climate: { high: 11, low: 4 } },
};
