import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';

import { cities, cityStories, mapPins } from '../src/data/cities.js';
import { cityDining, cityFood, foodBackup, verifiedRestaurantHours } from '../src/data/dining.js';
import { days, trains } from '../src/data/trip.js';
import { databaseEntries } from '../src/data/travel-database.js';
import {
  buildPageSearchRecords,
  buildTravelSearchRecords,
  serializeSearchIndex,
} from '../src/search/site-search-index.mjs';

const distDir = path.resolve('dist');
const standalonePath = path.resolve('poland-travel-guide-2026.html');

function actualRecords() {
  return buildTravelSearchRecords({
    days,
    trains,
    cities,
    cityStories,
    mapPins,
    cityDining,
    cityFood,
    foodBackup,
    verifiedRestaurantHours,
  });
}

test('旅遊索引包含火車、餐廳、地圖、城市與行程記錄', () => {
  const records = actualRecords();
  const byType = records.reduce((groups, record) => {
    (groups[record.type] ||= []).push(record);
    return groups;
  }, {});

  assert.equal(byType.train.length, 5);
  assert.equal(byType.city.length, 4);
  assert.equal(byType.map.length, 56);
  assert.equal(byType.itinerary.length, 8);
  assert.ok(byType.restaurant.length >= 50);
  assert.ok(byType.train.some(record => record.searchText.includes('華沙') && record.searchText.includes('krk')));
  assert.ok(byType.restaurant.some(record => record.title === 'U Fukiera' && record.mapUrl.includes('google.com/maps')));
  assert.ok(byType.city.some(record => record.title.includes('樂斯拉夫') && record.searchText.includes('小矮人')));
});

test('同城同名餐廳只產生一筆並合併可搜尋說明', () => {
  const records = buildTravelSearchRecords({
    days: [],
    trains: [],
    cities: [{ key: 'WAW', name: '華沙', pl: 'Warszawa', vibe: '', highlights: [] }],
    cityStories: [],
    mapPins: { warsaw: { points: [] } },
    cityDining: { warsaw: [{ name: '測試餐廳', tier: '必比登', highlight: '烤鴨', mapUrl: 'https://maps.example/restaurant' }] },
    cityFood: [{ city: '華沙', items: [{ name: '測試餐廳', tag: '波蘭菜', note: '紅菜湯', book: 'walk' }] }],
    foodBackup: [],
    verifiedRestaurantHours: [],
  });
  const restaurants = records.filter(record => record.type === 'restaurant');

  assert.equal(restaurants.length, 1);
  assert.equal(restaurants[0].mapUrl, 'https://maps.example/restaurant');
  assert.match(restaurants[0].searchText, /烤鴨/);
  assert.match(restaurants[0].searchText, /紅菜湯/);
});

test('餐廳標點差異會合併且整份索引 ID 唯一', () => {
  const records = buildTravelSearchRecords({
    days: [],
    trains: [],
    cities: [{ key: 'WAW', name: '華沙', pl: 'Warszawa', vibe: '', highlights: [] }],
    cityStories: [],
    mapPins: { warsaw: { points: [] } },
    cityDining: { warsaw: [{ name: 'E. Wedel Pijalnia', tier: '探索', highlight: '巧克力' }] },
    cityFood: [{ city: '華沙', items: [{ name: 'E.Wedel Pijalnia', tag: '甜點', note: '熱巧克力' }] }],
    foodBackup: [],
    verifiedRestaurantHours: [],
  });
  const restaurants = records.filter(record => record.type === 'restaurant');

  assert.equal(restaurants.length, 1);
  assert.equal(new Set(records.map(record => record.id)).size, records.length);
  assert.match(restaurants[0].searchText, /巧克力/);
  assert.match(restaurants[0].searchText, /熱巧克力/);
});

test('行程索引只讀取公開欄位，不接受未知私人欄位', () => {
  const [record] = buildTravelSearchRecords({
    days: [{
      n: 1,
      title: '公開行程',
      date: '10/24',
      city: '華沙',
      headline: '公開摘要',
      tag: '抵達',
      hiddenBookingCode: 'SECRET-DAY-123',
      train: { type: 'EIP', from: '華沙', to: '克拉科夫', hiddenTicketCode: 'SECRET-TRAIN-123' },
      steps: [{ t: '09:00', label: '公開景點', hiddenPassport: 'SECRET-PASSPORT-123' }],
      practical: [{ tag: '公開', name: '公開提醒', note: '公開說明', insuranceNumber: 'SECRET-INSURANCE-123' }],
    }],
    trains: [], cities: [], cityStories: [], mapPins: {}, cityDining: {}, cityFood: [], foodBackup: [], verifiedRestaurantHours: [],
  });

  assert.match(record.searchText, /公開行程|公開景點|公開提醒/);
  assert.doesNotMatch(record.searchText, /secret|booking|passport|insurance/i);
});

test('頁級索引只擷取 main 公開文字並安全序列化', () => {
  const records = buildPageSearchRecords([{
    relativePath: 'practical/example.html',
    title: '範例頁',
    html: '<nav>導覽秘密</nav><main><h1>火車指南</h1><p>查詢 EIP</p><script>alert(1)</script></main><footer>頁尾</footer>',
  }]);

  assert.equal(records.length, 1);
  assert.match(records[0].searchText, /火車指南/);
  assert.doesNotMatch(records[0].searchText, /導覽秘密|頁尾|alert/);
  const serialized = serializeSearchIndex([{ ...records[0], title: '</script><script>alert(1)</script>' }]);
  assert.doesNotMatch(serialized, /<\/script>/i);
  assert.match(serialized, /\\u003c\/script>/i);
});

test('頁級索引排除標記為 private 的資料卡', () => {
  const [record] = buildPageSearchRecords([{
    relativePath: 'practical/example.html',
    title: '範例頁',
    html: '<main><p>公開護照遺失指引</p><article data-privacy="private"><h3>私人項目</h3><p>SECRET-PRIVATE-123</p></article></main>',
  }]);

  assert.match(record.searchText, /公開護照遺失指引/);
  assert.doesNotMatch(record.searchText, /secret|私人項目/i);
});

test('正式建置索引不包含 private 資料條目的標題', () => {
  const html = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
  const json = html.match(/<script type="application\/json" data-site-search-index>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(json, '首頁缺少搜尋索引 JSON');
  const pageText = JSON.parse(json)
    .filter(record => record.type === 'page')
    .map(record => record.searchText)
    .join(' ');

  for (const entry of databaseEntries.filter(item => item.private)) {
    assert.ok(!pageText.includes(entry.title.toLocaleLowerCase('zh-Hant')), `索引仍含私人條目：${entry.title}`);
  }
});

test('建置輸出的每頁都有全站搜尋入口', () => {
  const files = [
    'index.html',
    ...Array.from({ length: 8 }, (_, index) => `day-${String(index + 1).padStart(2, '0')}.html`),
    'city-warszawa.html', 'city-krakow.html', 'city-wroclaw.html', 'city-poznan.html',
    ...['todos', 'booking', 'dining', 'tickets', 'transit', 'shopping', 'essentials', 'notes', 'ops-dashboard', 'database']
      .map(name => `practical/${name}.html`),
  ];

  for (const file of files) {
    const html = fs.readFileSync(path.join(distDir, file), 'utf8');
    assert.match(html, /data-site-search/);
    assert.match(html, /<label[^>]*>\s*搜尋整個旅遊網站\s*<\/label>/);
    assert.match(html, /type="search"/);
    assert.equal((html.match(/data-search-category=/g) || []).length, 4);
    assert.match(html, /aria-live="polite"/);
    assert.match(html, /role="group" aria-label="快捷分類"/);
    assert.doesNotMatch(html, /aria-expanded=/);
    const expectedScript = file.startsWith('practical/') ? '../assets/site-search.js' : 'assets/site-search.js';
    assert.ok(html.includes(`src="${expectedScript}"`), `${file} 搜尋程式路徑錯誤`);
  }
  assert.ok(fs.existsSync(path.join(distDir, 'assets/site-search.js')));
  const searchScript = fs.readFileSync(path.join(distDir, 'assets/site-search.js'), 'utf8');
  assert.match(searchScript, /root\.addEventListener\('keydown'/);
});

test('單檔版內嵌搜尋並只用章節 anchor', () => {
  const html = fs.readFileSync(standalonePath, 'utf8');
  assert.equal((html.match(/class="site-search-shell" data-site-search/g) || []).length, 1);
  assert.doesNotMatch(html, /src="assets\/site-search\.js"/);
  assert.match(html, /data-bundled="site-search\.js"/);
  assert.match(html, /"href":"#page-practical-booking--rail-itinerary"/);
  assert.doesNotMatch(html, /"href":"(?:\.\.\/)?(?:day|city|practical\/)[^"]+\.html/);
});
