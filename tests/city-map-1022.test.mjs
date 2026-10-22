import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { mapPins, mapPinChecks, pinCategoryLegend } from '../src/data/cities.js';
import { dayDining } from '../src/data/day-dining.js';
import { cafeGuide, snacksAndCafes } from '../src/data/dining.js';
import { diningPlaces } from '../src/data/dining-places.js';
import { diningPinMatches } from '../tools/audit-map-pins.mjs';

const read = file => fs.readFileSync(new URL(`../dist/${file}`, import.meta.url), 'utf8');
const research = fs.readFileSync(new URL('../docs/research/2026-10-22-city-map-additions.md', import.meta.url), 'utf8');
const omittedDining = research.split('## 未放圖釘：餐飲')[1].split('## 未放圖釘：景點')[0];
const files = { warsaw: 'city-warszawa.html', krakow: 'city-krakow.html', wroclaw: 'city-wroclaw.html', poznan: 'city-poznan.html' };
const bounds = { warsaw: [52.1, 52.35, 20.85, 21.15], krakow: [49.95, 50.12, 19.8, 20.1], wroclaw: [51.04, 51.18, 16.9, 17.15], poznan: [52.33, 52.5, 16.8, 17.05] };
const unpinned = city => read(files[city]).match(/<details class="city-map-unpinned">[\s\S]*?<\/details>/)?.[0] || '';
function coveredOrOmitted(placeId) {
  const place = diningPlaces[placeId];
  if (!mapPins[place.cityKey]) return;
  if (mapPins[place.cityKey].points.some(point => diningPinMatches(place, point))) return;
  assert.ok(unpinned(place.cityKey).includes(`>${place.name}<`) || omittedDining.includes(`\`${placeId}\``), `${placeId} 無圖釘且缺未放清單`);
}

test('scheduled 四城餐廳與 cafeGuide 每家皆有圖釘或明確列出未放原因', () => {
  const scheduled = Object.values(dayDining).flat().filter(item => item.planStatus === 'scheduled' && mapPins[diningPlaces[item.placeId].cityKey]);
  assert.ok(scheduled.length >= 13);
  for (const item of [...scheduled, ...cafeGuide.flatMap(group => group.items)]) coveredOrOmitted(item.placeId);
});

test('新增點日期、OSM 來源、狀態、距離與城市範圍正確，研究表逐點對應', () => {
  let count = 0;
  for (const [city, data] of Object.entries(mapPins)) {
    const [minLat, maxLat, minLon, maxLon] = bounds[city];
    for (const point of data.points) {
      const check = mapPinChecks[city][point[2]];
      if (check.checkedAt !== '2026-10-22') continue;
      count++;
      assert.ok(['coordinate-verified', 'area-reference'].includes(check.status), point[2]);
      const osm = check.coordinateSource.match(/Nominatim \/ OpenStreetMap（((?:node|way|relation)\/\d+)）/);
      assert.ok(osm, `${point[2]} 缺具體 OSM ID`);
      const row = research.split('\n').find(line => line.startsWith(`| ${city} | ${point[2].replaceAll('|', '\\|')}`));
      assert.ok(row?.includes(osm[1]) && row.includes(`${point[0]}, ${point[1]}`) && row.includes(check.status), point[2]);
      assert.ok(point[0] > minLat && point[0] < maxLat && point[1] > minLon && point[1] < maxLon, point[2]);
      if (check.status === 'coordinate-verified') assert.equal(check.distanceMeters, 0);
      else assert.ok(check.note?.length > 5);
      if (point[7]) {
        assert.equal(diningPlaces[point[7]].cityKey, city);
        assert.equal(point[4], diningPlaces[point[7]].map);
      }
    }
  }
  assert.equal(count, 97);
});

test('同城不重名、不重複完全相同座標，也不重複同一餐飲 placeId', () => {
  for (const data of Object.values(mapPins)) {
    for (const key of [p => p[2], p => `${p[0]},${p[1]}`, p => p[7]]) {
      const values = data.points.map(key).filter(Boolean);
      assert.equal(new Set(values).size, values.length);
    }
  }
});

test('圖例只列實際分類，按鈕含正確計數、aria-pressed、可讀群組名稱與分類圖層', () => {
  assert.ok(pinCategoryLegend.cafe);
  for (const [city, file] of Object.entries(files)) {
    const html = read(file);
    const legend = html.match(/<div class="map-legend"[^>]*>([\s\S]*?)<\/div>/);
    assert.match(legend[0], /role="group" aria-label="[^"]*隱藏[^"]*顯示/);
    const buttons = [...legend[1].matchAll(/<button type="button"[^>]*data-pin-category="(\w+)" aria-pressed="true">[\s\S]*?<small>(\d+)<\/small><\/button>/g)];
    const counts = {};
    for (const p of mapPins[city].points) counts[p[5]] = (counts[p[5]] || 0) + 1;
    assert.deepEqual(Object.fromEntries(buttons.map(([, k, n]) => [k, +n])), counts);
    assert.match(html, /L\.layerGroup\(\)\.addTo\(map\)/);
    assert.match(html, /map\.removeLayer\(layer\)/);
    assert.match(html, /個街道、廣場、園區或建物群的圖釘是範圍代表點/);
  }
  const css = read('assets/main.css');
  assert.match(css, /\.map-legend-toggle\s*\{[^}]*min-height: 44px/);
  assert.match(css, /\.map-legend-toggle\s*\{[^}]*white-space: normal/);
  assert.match(css, /\.map-legend-toggle\[aria-pressed="false"\][^}]*text-decoration: line-through/);
  assert.match(css, /\.map-legend-toggle:focus-visible[^}]*outline: 3px/);
});

function setupMap(city, leaflet = true) {
  const listeners = {}, layers = [];
  const filters = { addEventListener(type, callback) { listeners[type] = callback; } };
  const element = { parentElement: { querySelector(selector) { return selector === '.map-legend' ? filters : null; } }, focus() {} };
  const map = { active: new Set(), setView() { return this; }, removeLayer(layer) { this.active.delete(layer); } };
  const L = {
    map() { return map; },
    // 模擬圖磚失敗：不送出任何成功載入事件，篩選仍須正常。
    tileLayer() { return { addTo() {} }; },
    layerGroup() { const layer = { count: 0, addTo(m) { m.active.add(this); return this; } }; layers.push(layer); return layer; },
    circleMarker() { return { addTo(layer) { layer.count++; return this; }, bindPopup() {} }; },
  };
  const source = [...read(files[city]).matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).find(s => s.includes('var mapData ='));
  const context = { document: { currentScript: null, querySelector() { return element; } } };
  if (leaflet) context.L = L;
  vm.runInNewContext(source, context);
  return { map, layers, filters, listeners, click(button) { listeners.click({ target: { closest() { return button; } } }); } };
}
const buttonFor = category => ({ dataset: { pinCategory: category }, pressed: 'true', getAttribute() { return this.pressed; }, setAttribute(_, value) { this.pressed = value; } });

test('各城實際執行內嵌腳本，反覆切換只隱藏對應分類（圖磚無載入亦可）', () => {
  for (const city of Object.keys(files)) {
    const { map, layers, filters, click } = setupMap(city);
    assert.notEqual(filters.hidden, true);
    const categories = [...new Set(mapPins[city].points.map(p => p[5]))];
    assert.equal(layers.reduce((sum, layer) => sum + layer.count, 0), mapPins[city].points.length);
    for (let i = 0; i < categories.length; i++) {
      const button = buttonFor(categories[i]);
      click(button);
      assert.equal(button.pressed, 'false');
      assert.equal(map.active.has(layers[i]), false);
      assert.equal(map.active.size, layers.length - 1);
      click(button);
      assert.equal(button.pressed, 'true');
      assert.equal(map.active.size, layers.length);
    }
  }
});

test('離線沒有 Leaflet 時隱藏每城圖例，不註冊無作用的按鈕事件', () => {
  for (const city of Object.keys(files)) {
    const { filters, listeners, layers } = setupMap(city, false);
    assert.equal(filters.hidden, true);
    assert.equal(listeners.click, undefined);
    assert.equal(layers.length, 0);
  }
});

test('已釘餐飲不重複列於無圖釘清單；未釘 cafeGuide 全部保留導航連結', () => {
  for (const [city, data] of Object.entries(mapPins)) {
    const html = unpinned(city);
    for (const point of data.points.filter(p => p[7])) assert.ok(!html.includes(diningPlaces[point[7]].map), point[2]);
    for (const item of cafeGuide.find(g => g.cityKey === city).items) {
      if (!data.points.some(p => p[7] === item.placeId)) assert.ok(html.includes(`>${item.name}<`), item.placeId);
    }
  }
});

test('Massolit 主檔、咖啡指南、小吃、圖釘均串接，官方時間與當前行程措辭正確', () => {
  const id = 'krakow-massolit-books-cafe', place = diningPlaces[id];
  assert.ok(snacksAndCafes.krakow.some(p => p.placeId === id));
  const cafe = cafeGuide.find(g => g.cityKey === 'krakow').items.find(p => p.placeId === id);
  assert.equal(cafe.when, 'Day 4 · 回城後有餘裕才繞去（Wawel 西北側；Day 2 行程無空檔）');
  assert.equal(place.checkedAt, '2026-10-22');
  assert.equal(place.verificationStatus, 'verified');
  assert.match(place.address, /Felicjanek 4/);
  assert.match(place.hours, /每日 10:00–20:00/);
  assert.equal(place.sourceUrl, 'https://massolit.pl/cafe');
  assert.doesNotMatch(JSON.stringify(place), /\+48|電話|tel:/);
  assert.ok(mapPins.krakow.points.some(p => p[7] === id));
});
