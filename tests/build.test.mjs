import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { cities, cityStories, photoSpots, photoCredits, mapPins, attractions } from '../src/data/cities.js';
import { cityDining, cityFood, foodBackup, foods, michelinSummary, michelinReservations, verifiedRestaurantHours } from '../src/data/dining.js';
import { about, packingDefault, phrases, preDepartureNotes, safety } from '../src/data/essentials.js';
import { shopping, souvenirCards, souvenirShops, luxuryShopping, zabkaCards } from '../src/data/shopping.js';
import { fares, ticketsByCity } from '../src/data/tickets.js';
import { airportTransit, passChecklist, practical, recommendedApps, transitFares, usefulRoutes } from '../src/data/transit.js';
import { bookingTiers, days, flights, reservations, stay, trains } from '../src/data/trip.js';
import { databaseEntries, readinessItems, dayOperations } from '../src/data/travel-database.js';

const distDir = path.resolve('dist');
const expectedFiles = [
  'index.html',
  ...Array.from({ length: 8 }, (_, index) => `day-${String(index + 1).padStart(2, '0')}.html`),
  'city-warszawa.html',
  'city-krakow.html',
  'city-wroclaw.html',
  'city-poznan.html',
  'practical/booking.html',
  'practical/dining.html',
  'practical/tickets.html',
  'practical/transit.html',
  'practical/shopping.html',
  'practical/essentials.html',
  'practical/notes.html',
  'practical/database.html',
];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}

function read(relativePath) {
  return fs.readFileSync(path.join(distDir, relativePath), 'utf8');
}

function htmlFiles() {
  return walk(distDir)
    .filter(file => file.endsWith('.html'))
    .map(file => path.relative(distDir, file).split(path.sep).join('/'))
    .sort();
}

test('自由行資料庫遵守統一資料契約且不含私人館址', () => {
  assert.ok(databaseEntries.length >= 15);
  assert.deepEqual(new Set(databaseEntries.map(item => item.status)), new Set(['verified', 'recheck', 'pending', 'private-required']));
  assert.equal(readinessItems.length, 8);
  assert.deepEqual(Object.keys(dayOperations).map(Number), [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.ok(!JSON.stringify({ databaseEntries, readinessItems, dayOperations }).includes('Al. Jerozolimskie 179'));
});

test('駐波蘭代表處使用外交部 2026-08-08 查證的正確館址', () => {
  assert.equal(safety.embassy[0][1], '30th Floor, Ul. Emilii Plater 53, 00-113 Warsaw, Poland');
});

test('克拉科夫與樂斯拉夫飲水資訊各自保有官方來源', () => {
  const krakowWater = databaseEntries.find(item => item.id === 'daily-basics-krakow-water');
  const wroclawWater = databaseEntries.find(item => item.id === 'daily-basics-wroclaw-water');

  assert.equal(krakowWater?.cityKey, 'krakow');
  assert.equal(krakowWater?.sourceUrl, 'https://wodociagi.krakow.pl/en/water-quality/facts-and-myths-about-tap-water');
  assert.equal(wroclawWater?.cityKey, 'wroclaw');
  assert.equal(wroclawWater?.sourceUrl, 'https://www.mpwik.wroc.pl/csr-2/pij-kranowke/');
});

test('dist 正好產出規格要求的 21 個 HTML', () => {
  assert.deepEqual(htmlFiles(), [...expectedFiles].sort());
  assert.ok(fs.existsSync(path.join(distDir, 'assets/main.css')), '缺少 assets/main.css');
});

test('自由行資料庫頁提供 SOS、主題索引與緊急聯絡資訊', () => {
  assert.equal(htmlFiles().length, 21);
  const html = read('practical/database.html');
  for (const heading of ['SOS 離線急救卡', '出入境與 ETIAS', '航班與行李', '醫療與保險', '退稅 TAX FREE']) {
    assert.ok(html.includes(heading), `資料庫頁缺少 ${heading}`);
  }
  assert.ok(html.includes('tel:+48668027574'));
});

test('資料盤點中的主要集合筆數完整且沒有搬遷遺漏', () => {
  assert.equal(days.length, 8);
  assert.equal(cities.length, 4);
  assert.equal(cityStories.length, 4);
  assert.equal(photoSpots.length, 10);
  assert.equal(photoCredits.length, 8);
  assert.deepEqual(Object.fromEntries(Object.entries(mapPins).map(([city, data]) => [city, data.points.length])), {
    warsaw: 14, krakow: 19, wroclaw: 9, poznan: 8,
  });
  assert.deepEqual(Object.fromEntries(Object.entries(attractions).map(([city, items]) => [city, items.length])), {
    warsaw: 12, krakow: 6, wroclaw: 8, poznan: 9,
  });

  assert.equal(trains.length, 5);
  assert.deepEqual(bookingTiers.map(tier => tier.items.length), [6, 6, 4]);
  assert.deepEqual({ out: flights.out.length, back: flights.back.length }, { out: 5, back: 5 });
  assert.equal(stay.length, 4);
  assert.equal(reservations.length, 8);

  assert.equal(michelinSummary.length, 4);
  assert.equal(michelinReservations.length, 9);
  assert.equal(verifiedRestaurantHours.length, 4);
  assert.deepEqual(Object.fromEntries(Object.entries(cityDining).map(([city, items]) => [city, items.length])), {
    warsaw: 21, krakow: 13, wroclaw: 11, poznan: 11,
  });
  assert.deepEqual(cityFood.map(group => group.items.length), [11, 10, 8, 6]);
  assert.deepEqual(foodBackup.map(group => group.items.length), [9, 10, 6, 7]);
  assert.equal(foods.length, 12);

  assert.equal(fares.length, 21);
  assert.deepEqual(ticketsByCity.map(group => group.items.length), [6, 6, 2, 3]);
  assert.deepEqual([
    transitFares.length, airportTransit.length, recommendedApps.length,
    passChecklist.length, usefulRoutes.length, practical.length,
  ], [4, 6, 4, 4, 5, 6]);
  assert.deepEqual([
    souvenirCards.length, luxuryShopping.length, souvenirShops.length,
    shopping.length, zabkaCards.length,
  ], [14, 2, 7, 7, 7]);
  assert.deepEqual([
    phrases.length, about.length, preDepartureNotes.length,
    safety.emergency.length, safety.embassy.length, safety.tips.length,
  ], [12, 8, 9, 5, 4, 4]);
  assert.deepEqual(Object.values(packingDefault).map(items => items.length), [5, 5, 5, 4]);
});

test('每頁都有完整文件外殼、導覽、主要內容與頁尾', () => {
  for (const file of expectedFiles) {
    const html = read(file);
    assert.match(html, /^<!DOCTYPE html>/, `${file} 缺少 doctype`);
    assert.match(html, /<html lang="zh-Hant">/, `${file} 語系錯誤`);
    assert.match(html, /<title>[^<]+<\/title>/, `${file} 缺少 title`);
    assert.match(html, /<nav class="nav"/, `${file} 缺少導覽`);
    assert.match(html, /<main class="page" id="main-content">/, `${file} 缺少主要內容`);
    assert.match(html, /<footer class="footer">/, `${file} 缺少頁尾`);
    assert.doesNotMatch(html, />undefined<|\$\{undefined\}/, `${file} 出現 undefined`);
  }
});

test('所有本機連結都能解析，且沒有破壞 GitHub Pages 的根路徑連結', () => {
  const missing = [];
  for (const file of expectedFiles) {
    const html = read(file);
    assert.doesNotMatch(html, /(?:href|src)="\//, `${file} 含網站根路徑，GitHub Pages 子路徑會失效`);
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const target = match[1];
      if (/^(?:[a-z][a-z0-9+.-]*:|#)/i.test(target)) continue;
      if (target.includes("' + point[")) continue;
      const withoutFragment = target.split('#')[0];
      if (!withoutFragment) continue;
      const resolved = path.resolve(distDir, path.dirname(file), withoutFragment);
      if (!fs.existsSync(resolved)) missing.push(`${file} → ${target}`);
    }
  }
  assert.deepEqual(missing, []);
});

test('首頁包含 8 天、4 城與全部實用頁入口', () => {
  const html = read('index.html');
  for (let day = 1; day <= 8; day += 1) {
    assert.ok(html.includes(`day-${String(day).padStart(2, '0')}.html`), `首頁缺少 Day ${day}`);
  }
  for (const city of ['warszawa', 'krakow', 'wroclaw', 'poznan']) {
    assert.ok(html.includes(`city-${city}.html`), `首頁缺少 ${city}`);
  }
  for (const page of ['booking', 'dining', 'tickets', 'transit', 'shopping', 'notes', 'database']) {
    assert.ok(html.includes(`practical/${page}.html`), `首頁缺少 practical/${page}`);
  }
  assert.ok(
    html.includes('<a class="card card-link" href="practical/database.html"><h3>自由行資料庫</h3>'),
    '首頁規劃工具缺少自由行資料庫卡片',
  );
});

test('首頁出發準備度顯示 8 類待辦、文字狀態與資料庫連結', () => {
  const html = read('index.html');
  const database = read('practical/database.html');
  const labels = ['住宿', '城際車票', '景點票券', '航班行李', '旅平險', '網路離線', 'ETIAS', '緊急聯絡'];

  assert.ok(html.includes('出發準備度'));
  for (const label of labels) assert.ok(html.includes(`>${label}<`), `首頁準備度缺少 ${label}`);
  for (const status of ['待確認', '需填私人資料', '出發前重查']) {
    assert.ok(html.includes(`狀態：${status}`), `首頁準備度缺少文字狀態 ${status}`);
  }
  assert.equal((html.match(/href="practical\/database\.html#entry-/g) || []).length, 8);
  for (const item of readinessItems) {
    assert.ok(
      html.includes(`href="practical/database.html#entry-${item.entryId}"`),
      `首頁缺少 ${item.title} 的資料庫連結`,
    );
    assert.ok(
      database.includes(`id="entry-${item.entryId}"`),
      `${item.title} 的資料庫錨點不存在`,
    );
  }

  const recheckPosition = html.indexOf('>ETIAS<');
  for (const label of ['住宿', '城際車票', '景點票券', '航班行李', '旅平險', '網路離線', '緊急聯絡']) {
    assert.ok(html.indexOf(`>${label}<`) < recheckPosition, `${label} 應排在出發前重查項目前`);
  }
});

test('8 個每日頁的日期與標題和資料層一致', async () => {
  const { days } = await import('../src/data/trip.js');
  for (const day of days) {
    const html = read(`day-${String(day.n).padStart(2, '0')}.html`);
    assert.ok(html.includes(day.date), `Day ${day.n} 缺少日期 ${day.date}`);
    assert.ok(html.includes(day.title), `Day ${day.n} 缺少標題 ${day.title}`);
    assert.ok(html.includes('當日時間表'), `Day ${day.n} 缺少時間表`);
    for (const booking of day.mustBook) {
      assert.ok(html.includes(booking), `Day ${day.n} 缺少待訂提醒：${booking}`);
    }
  }
});

test('Day 1–8 都有現場導航、當日警示與晚間準備', () => {
  for (let day = 1; day <= 8; day += 1) {
    const operation = dayOperations[day];
    assert.ok(operation, `Day ${day} 缺少每日操作資料`);
    assert.ok(operation.addresses.length >= 3, `Day ${day} 地址不足`);
    assert.ok(operation.navigation.length >= 2, `Day ${day} 導航步驟不足`);
    assert.ok(operation.dailyAlerts.length >= 1, `Day ${day} 缺少當日警示`);
    assert.ok(operation.nightChecklist.length >= 4, `Day ${day} 晚間準備少於 4 項`);
    for (const address of operation.addresses) {
      assert.match(address.url, /^https:\/\//, `Day ${day} 含非 HTTPS 導航連結`);
    }

    const html = read(`day-${String(day).padStart(2, '0')}.html`);
    for (const heading of ['今天怎麼走', '晚間準備']) {
      assert.ok(html.includes(heading), `Day ${day} 缺少 ${heading}`);
    }
    assert.ok(html.includes('target="_blank" rel="noopener noreferrer"'), `Day ${day} 外部連結缺少安全屬性`);
  }
  assert.ok(read('day-02.html').includes('非營業週日'));
  assert.ok(read('day-08.html').includes('離開 EU'));
  assert.ok(read('day-01.html').includes('待住宿／分店確定後填入'));
});

test('Day 8 退稅與報到已合併，不再出現獨立 11:30 時段', () => {
  const html = read('day-08.html');
  assert.ok(!html.includes('11:30'), 'Day 8 仍有舊的獨立 11:30 時段');
  assert.ok(html.includes('退稅') && html.includes('報到'), 'Day 8 缺少合併後的退稅／報到內容');
});

test('4 個城市頁含正確 Leaflet 圖釘數，合計 50', () => {
  const expected = {
    'city-warszawa.html': 14,
    'city-krakow.html': 19,
    'city-wroclaw.html': 9,
    'city-poznan.html': 8,
  };
  let total = 0;
  for (const [file, count] of Object.entries(expected)) {
    const html = read(file);
    assert.match(html, /class="map-container"/, `${file} 缺少地圖容器`);
    assert.match(html, /leaflet@1\.9\.4/, `${file} 缺少 Leaflet 1.9.4`);
    const match = html.match(/var mapData = (\{.*?\});/s);
    assert.ok(match, `${file} 缺少 mapData`);
    const points = JSON.parse(match[1]).points.length;
    assert.equal(points, count, `${file} 圖釘數錯誤`);
    total += points;
  }
  assert.equal(total, 50);
});

test('城市頁完整呈現故事、景點、主餐廳、備案與拍照資訊', () => {
  for (const file of ['city-warszawa.html', 'city-krakow.html', 'city-wroclaw.html', 'city-poznan.html']) {
    const html = read(file);
    for (const heading of ['先理解這座城', '景點清單', '2026 餐廳情報', '行程主餐廳推薦', '備案餐廳', '拍照建議']) {
      assert.ok(html.includes(heading), `${file} 缺少 ${heading}`);
    }
  }
});

test('高風險校正：霓虹博物館已搬到科學文化宮', () => {
  const html = read('practical/tickets.html') + read('day-07.html');
  assert.ok(html.includes('科學文化宮 4 樓'));
  assert.ok(!html.includes('Praga 區，共產時期霓虹招牌'));
});

test('高風險校正：波茲南古市政廳整修閉館，不再顯示可購買 PLN 10', () => {
  const html = read('practical/tickets.html');
  assert.ok(html.includes('2027 年底至 2028 年初'));
  assert.ok(html.includes('閉館中'));
  assert.doesNotMatch(html, /古市政廳博物館[\s\S]{0,160}<td class="number">10<\/td>/);
});

test('高風險校正：百年廳 10/28 圓頂關閉在 Day 5 與城市頁都看得到', () => {
  for (const file of ['day-05.html', 'city-wroclaw.html']) {
    const html = read(file);
    assert.ok(html.includes('10/28') && html.includes('圓頂展廳不開放'), `${file} 缺少百年廳警示`);
  }
});

test('高風險校正：皇家城堡與辛德勒工廠已依官方時間修正', () => {
  assert.ok(read('day-07.html').includes('皇家城堡已由官方確認'));
  assert.ok(read('city-warszawa.html').includes('已改行程'));
  assert.ok(read('city-krakow.html').includes('已查證'));
  assert.doesNotMatch(read('day-07.html'), /17:00[^<]{0,80}皇家城堡內部/);
});

test('Day 7 改為早上皇家城堡，並保留 POLIN 至起義博物館的移動時間', () => {
  const day = days.find(item => item.n === 7);
  assert.equal(day.steps[0].t, '10:00');
  assert.ok(day.steps[0].label.includes('皇家城堡'));
  assert.equal(day.steps.find(item => item.label.startsWith('★ POLIN')).dur, '2 h');
  assert.doesNotMatch(read('day-07.html'), /17:00[^<]{0,80}皇家城堡/);
});

test('尚未開賣的長途交通與天氣不假裝成已確認', () => {
  for (const train of trains) {
    assert.equal(train.status, '尚未確認班次');
    assert.match(train.price, /待/);
  }
  for (const day of days) {
    assert.equal(day.weather, '尚無可靠預報；出發前 7–10 天更新');
  }
  const allDays = Array.from({ length: 8 }, (_, index) => read(`day-${String(index + 1).padStart(2, '0')}.html`)).join('\n');
  assert.ok(!allDays.includes('22:54'));
  assert.ok(!allDays.includes('30 天無限'));
  assert.ok(!allDays.includes('價差 ≤'));
});

test('舊票價與過時場館資料已從產出頁面移除', () => {
  const html = expectedFiles.map(read).join('\n');
  for (const stale of ['199／149', 'PLN 32', '55／45', '2026 新開的 E.Wedel']) {
    assert.ok(!html.includes(stale), `仍出現舊資料：${stale}`);
  }
  assert.ok(html.includes('城堡一、二樓完整路線 95／71'));
  assert.ok(html.includes('Kolejkowo') && html.includes('50／40'));
});

test('餐廳頁只把可追到店家來源的營業時間列為已查', () => {
  const html = read('practical/dining.html');
  for (const restaurant of verifiedRestaurantHours) {
    assert.ok(html.includes(restaurant.name));
    assert.ok(html.includes(restaurant.hours));
    assert.ok(html.includes(restaurant.url));
  }
  assert.ok(html.includes('營業時間查證於 2026-08-08'));
});

test('城市頁不再將 Google 星等與評論數當成固定資料', () => {
  for (const file of ['city-warszawa.html', 'city-krakow.html', 'city-wroclaw.html', 'city-poznan.html']) {
    const html = read(file);
    assert.doesNotMatch(html, /★\d(?:\.\d)?（[^）]+）/, `${file} 仍顯示動態星等`);
    assert.ok(html.includes('動態 Google 星等已移除'));
  }
});

test('門票頁含 21 筆新資料、Panorama 優待 35 與 Auschwitz 線上票規則', async () => {
  const { fares } = await import('../src/data/tickets.js');
  assert.equal(fares.length, 21);
  const panorama = fares.find(item => item.name.includes('Panorama'));
  assert.equal(panorama.discountPrice, '35');
  const html = read('practical/tickets.html');
  assert.ok(html.includes('奧斯威辛') && html.includes('所有入場證只在線上提供'));
});

test('全站不出現把日落寫成 15:35–15:50 的錯誤敘述', () => {
  for (const file of expectedFiles) {
    const html = read(file);
    assert.doesNotMatch(html, /日落[^。<]{0,40}15:35/, `${file} 把日落寫成 15:35`);
    assert.doesNotMatch(html, /日落[^。<]{0,40}15:50/, `${file} 把日落寫成 15:50`);
  }
  const notes = read('practical/notes.html');
  assert.ok(notes.includes('日落約 16:05–16:30'), '行前提醒缺少正確日落區間');
});

test('實用頁完整包含店家地圖、安全電話、打包與最新交通資料', () => {
  assert.ok(read('practical/shopping.html').includes('World of Amber'));
  assert.ok(read('practical/shopping.html').includes('Kabanosy'));
  assert.ok(read('practical/essentials.html').includes('+48 668 027 574'));
  assert.ok(read('practical/essentials.html').includes('打包清單'));
  assert.ok(read('practical/transit.html').includes('Jakdojade'));
  assert.ok(read('practical/booking.html').includes('QR 260'));
});

test('全站沒有常見簡體專用字', () => {
  const simplifiedOnly = ['国', '学', '语', '应', '现', '实', '导', '为', '会', '这', '来', '说', '们', '产', '业', '变', '关', '开', '间', '进', '长', '门', '问', '么', '义', '儿', '车', '马', '鱼', '龙', '爱', '东', '华', '历', '经', '结', '统', '传', '让', '认', '识', '远', '运'];
  const offenders = [];
  for (const file of expectedFiles) {
    const html = read(file);
    for (const character of simplifiedOnly) {
      if (html.includes(character)) offenders.push(`${file}: ${character}`);
    }
  }
  assert.deepEqual(offenders, []);
});

test('舊 PWA 已安全退役，不再預快取被歸檔的介面', () => {
  const worker = fs.readFileSync('sw.js', 'utf8');
  assert.ok(worker.includes("key.startsWith('polska-')"), 'sw.js 未清除舊 polska 快取');
  assert.ok(worker.includes('self.registration.unregister()'), 'sw.js 未解除舊註冊');
  assert.ok(!worker.includes("addEventListener('fetch'"), '退役 worker 不應攔截新版請求');
  for (const stalePath of ['mobile.html', 'redesign/', 'desktop/']) {
    assert.ok(!worker.includes(stalePath), `sw.js 仍引用舊路徑 ${stalePath}`);
  }
});
