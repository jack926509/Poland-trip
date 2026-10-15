// 2026-10-15 城市地圖補點：行程餐廳、咖啡甜點與採點景點都要能在城市地圖上找到，
// 新點標明是約略位置，圖例可以篩選分類。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { mapPins, mapPinChecks, pinCategoryLegend } from '../src/data/cities.js';
import { dayDining } from '../src/data/day-dining.js';
import { cafeGuide } from '../src/data/dining.js';
import { diningPlaces } from '../src/data/dining-places.js';

const read = file => fs.readFileSync(path.resolve('dist', file), 'utf8');
const cityFiles = { warsaw: 'city-warszawa.html', krakow: 'city-krakow.html', wroclaw: 'city-wroclaw.html', poznan: 'city-poznan.html' };
const bounds = {
  warsaw: [52.1, 52.35, 20.85, 21.15],
  krakow: [49.95, 50.12, 19.8, 20.1],
  wroclaw: [51.04, 51.18, 16.9, 17.15],
  poznan: [52.33, 52.5, 16.8, 17.05],
};
const pinnedIds = city => new Set(mapPins[city].points.map(point => point[7]).filter(Boolean));

test('每日時間表已排入的餐廳都在所屬城市地圖上（機場與鹽礦小鎮除外）', () => {
  let checked = 0;
  for (const items of Object.values(dayDining)) {
    for (const item of items) {
      if (item.planStatus !== 'scheduled') continue;
      const city = diningPlaces[item.placeId].cityKey;
      if (!mapPins[city]) continue;
      checked += 1;
      assert.ok(pinnedIds(city).has(item.placeId), `${city} 地圖缺少已排入的 ${item.placeId}`);
    }
  }
  assert.ok(checked >= 17, `只檢查到 ${checked} 家，資料可能沒載入`);
});

test('咖啡與甜點一節的每家店都在城市地圖上', () => {
  for (const group of cafeGuide) {
    for (const item of group.items) {
      assert.ok(pinnedIds(group.cityKey).has(item.placeId), `${group.city} 地圖缺少 ${item.placeId}`);
    }
  }
});

test('2026-10-15 新增的點：座標在城市範圍內、標為未逐點比對並留下來源', () => {
  let added = 0;
  for (const [city, data] of Object.entries(mapPins)) {
    const [latMin, latMax, lngMin, lngMax] = bounds[city];
    for (const point of data.points) {
      const check = mapPinChecks[city][point[2]];
      if (check.checkedAt !== '2026-10-15') continue;
      added += 1;
      assert.equal(check.status, 'unverified', `${point[2]} 不能標成已驗證`);
      assert.ok(check.coordinateSource?.length > 5, `${point[2]} 缺座標來源`);
      assert.ok(point[0] > latMin && point[0] < latMax && point[1] > lngMin && point[1] < lngMax, `${point[2]} 座標落在城市外`);
      assert.match(point[4], /^https:\/\//);
    }
  }
  assert.ok(added >= 70, `新增點數 ${added} 太少`);
});

test('同一城市沒有兩個圖釘疊在完全相同的位置', () => {
  for (const [city, data] of Object.entries(mapPins)) {
    const seen = new Map();
    for (const point of data.points) {
      const key = `${point[0]},${point[1]}`;
      assert.ok(!seen.has(key), `${city}：${point[2]} 與 ${seen.get(key)} 座標完全相同`);
      seen.set(key, point[2]);
    }
  }
});

test('城市頁圖例兼篩選鈕：只列本城有的分類並附數量，地圖腳本依分類分圖層', () => {
  assert.ok(pinCategoryLegend.cafe, '缺少咖啡／甜點分類');
  for (const [city, file] of Object.entries(cityFiles)) {
    const html = read(file);
    const legend = html.match(/<div class="map-legend"[^>]*>([\s\S]*?)<\/div>/)[1];
    const buttons = [...legend.matchAll(/data-pin-category="(\w+)" aria-pressed="true">[\s\S]*?<small>(\d+)<\/small>/g)];
    const counts = {};
    for (const point of mapPins[city].points) counts[point[5]] = (counts[point[5]] || 0) + 1;
    assert.deepEqual(Object.fromEntries(buttons.map(([, key, count]) => [key, Number(count)])), counts, `${file} 圖例數量不符`);
    assert.match(html, /layers\[category\] = L\.layerGroup\(\)\.addTo\(map\)/);
    assert.match(html, /map\.removeLayer\(layers\[button\.dataset\.pinCategory\]\)/);
    assert.match(html, /約略位置：座標取自公開地圖資料/);
  }
  assert.match(read('assets/main.css'), /\.map-legend-toggle\[aria-pressed="false"\]/);
});

test('有圖釘的行程餐廳不再重複列在「其他行程餐廳的導航連結」', () => {
  const html = read('city-krakow.html');
  const unpinned = html.match(/<details class="city-map-unpinned">[\s\S]*?<\/details>/)?.[0] || '';
  for (const name of ['Hankki', 'Mr. Jerry', 'Pimiento Shop and Bistro']) {
    assert.ok(!unpinned.includes(`>${name}<`), `${name} 已有圖釘卻仍列在無圖釘清單`);
  }
});
