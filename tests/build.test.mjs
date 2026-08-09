import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { cities, cityStories, photoSpots, photoCredits, mapPins, attractions, cityNotices } from '../src/data/cities.js';
import { cityDining, cityFood, foodBackup, foods, michelinSummary, michelinReservations, verifiedRestaurantHours } from '../src/data/dining.js';
import { about, packingDefault, phrases, preDepartureNotes, safety } from '../src/data/essentials.js';
import { shopping, souvenirCards, souvenirShops, luxuryShopping, zabkaCards } from '../src/data/shopping.js';
import { fares, ticketsByCity } from '../src/data/tickets.js';
import { airportTransit, passChecklist, practical, recommendedApps, transitFares, usefulRoutes } from '../src/data/transit.js';
import { bookingTiers, days, flights, reservations, stay, trains } from '../src/data/trip.js';
import {
  databaseEntries,
  databaseSections,
  dayOperations,
  readinessItems,
  statusLabels,
  validateTravelDatabase,
} from '../src/data/travel-database.js';
import { renderDatabase } from '../src/templates/database.mjs';
import { renderHome } from '../src/templates/home.mjs';

const distDir = path.resolve('dist');
const standalonePath = path.resolve('poland-travel-guide-2026.html');
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

test('官方旅客權益與本次私人／待購狀態分開', () => {
  const byId = new Map(databaseEntries.map(entry => [entry.id, entry]));
  assert.equal(byId.get('aviation-baggage-rules')?.status, 'verified');
  assert.equal(byId.get('aviation-trip-baggage-confirmation')?.status, 'private-required');
  assert.equal(byId.get('rail-delay-rights')?.status, 'verified');
  assert.equal(byId.get('rail-trip-tickets')?.status, 'pending');
  assert.equal(readinessItems.find(item => item.id === 'flight-ticket')?.entryId, 'aviation-trip-baggage-confirmation');
  assert.equal(readinessItems.find(item => item.id === 'rail-tickets')?.entryId, 'rail-trip-tickets');
  assert.ok(dayOperations[8].entryIds.includes('aviation-trip-baggage-confirmation'));
  for (const day of [2, 4, 5, 6]) assert.ok(dayOperations[day].entryIds.includes('rail-trip-tickets'));
});

test('自由行資料庫的狀態、來源、日期與關聯資料符合完整性契約', () => {
  assert.doesNotThrow(() => validateTravelDatabase({
    entries: databaseEntries,
    sections: databaseSections,
    readiness: readinessItems,
    operations: dayOperations,
    labels: statusLabels,
  }));

  assert.throws(
    () => validateTravelDatabase({
      entries: [{ ...databaseEntries[0], status: '未定義狀態' }, ...databaseEntries.slice(1)],
      sections: databaseSections,
      readiness: readinessItems,
      operations: dayOperations,
      labels: statusLabels,
    }),
    /未知狀態/,
  );

  for (const [field, value, pattern] of [
    ['category', '景點', /未知 category/],
    ['cityKey', 'warsaw', /未知 cityKey/],
  ]) {
    assert.throws(
      () => validateTravelDatabase({
        entries: [{ ...databaseEntries[0], [field]: value }, ...databaseEntries.slice(1)],
        sections: databaseSections,
        readiness: readinessItems,
        operations: dayOperations,
        labels: statusLabels,
      }),
      pattern,
    );
  }

  for (const invalidDate of ['2026-02-30', '2025-02-29']) {
    assert.throws(
      () => validateTravelDatabase({
        entries: [{ ...databaseEntries[0], verifiedAt: invalidDate }, ...databaseEntries.slice(1)],
        sections: databaseSections,
        readiness: readinessItems,
        operations: dayOperations,
        labels: statusLabels,
      }),
      /真實曆日/,
      `未攔截不存在的日期 ${invalidDate}`,
    );
  }

  const invalidSlugCases = [
    {
      name: 'section 空白',
      sections: [{ ...databaseSections[0], id: 'bad id' }, ...databaseSections.slice(1)],
      entries: databaseEntries,
      readiness: readinessItems,
    },
    {
      name: 'entry 含 %20',
      sections: databaseSections,
      entries: [{ ...databaseEntries[0], id: 'bad%20id' }, ...databaseEntries.slice(1)],
      readiness: readinessItems,
    },
    {
      name: 'readiness 含 #',
      sections: databaseSections,
      entries: databaseEntries,
      readiness: [{ ...readinessItems[0], id: 'bad#id' }, ...readinessItems.slice(1)],
    },
  ];
  for (const invalid of invalidSlugCases) {
    assert.throws(
      () => validateTravelDatabase({
        entries: invalid.entries,
        sections: invalid.sections,
        readiness: invalid.readiness,
        operations: dayOperations,
        labels: statusLabels,
      }),
      /穩定 slug/,
      `未攔截 ${invalid.name}`,
    );
  }

  for (const invalidEntry of [
    { ...databaseEntries[0], title: '' },
    { ...databaseEntries[0], checkedAt: '2026-02-30' },
    { ...databaseEntries[0], private: 'false' },
  ]) {
    assert.throws(() => validateTravelDatabase({
      entries: [invalidEntry, ...databaseEntries.slice(1)], sections: databaseSections,
      readiness: readinessItems, operations: dayOperations, labels: statusLabels,
    }));
  }
  assert.throws(() => validateTravelDatabase({
    entries: databaseEntries, sections: databaseSections,
    readiness: [{ ...readinessItems[0], priority: 'P2' }, ...readinessItems.slice(1)],
    operations: dayOperations, labels: statusLabels,
  }), /未知 priority/);
});

test('每日操作資料會攔截缺欄、空字串與錯誤型別', () => {
  const invalidOperations = [
    { field: 'addresses', value: [{ name: '', address: '地址', url: 'https://example.com' }] },
    { field: 'navigation', value: [{ mode: '步行', route: 'A → B' }] },
    { field: 'dailyAlerts', value: [''] },
    { field: 'nightChecklist', value: [{}] },
    { field: 'entryIds', value: [] },
  ];

  for (const invalid of invalidOperations) {
    assert.throws(
      () => validateTravelDatabase({
        entries: databaseEntries,
        sections: databaseSections,
        readiness: readinessItems,
        operations: {
          ...dayOperations,
          1: { ...dayOperations[1], [invalid.field]: invalid.value },
        },
        labels: statusLabels,
      }),
      /Day 1/,
      `未攔截每日操作欄位 ${invalid.field}`,
    );
  }
});

test('8 天每個行程步驟都有可靠地址或明確待確認原因', () => {
  for (const day of days) {
    const operation = dayOperations[day.n];
    const covered = new Set(operation.addresses.filter(item => item.reliable).flatMap(item => item.stepLabels));
    const unresolved = new Map(operation.unresolvedSteps.map(item => [item.label, item.reason]));
    for (const step of day.steps) {
      assert.ok(covered.has(step.label) || unresolved.get(step.label), `Day ${day.n} 未覆蓋：${step.label}`);
    }
    for (const place of operation.addresses.filter(item => item.reliable)) {
      assert.ok(place.entranceNote, `Day ${day.n} ${place.name} 缺入口說明`);
      assert.match(place.officialUrl, /^https:\/\//, `Day ${day.n} ${place.name} 缺 HTTPS 官網`);
    }
  }
  assert.ok(!dayOperations[4].unresolvedSteps.some(item => item.label.includes('Sukiennice')));
  assert.ok(!dayOperations[4].unresolvedSteps.some(item => item.label === '★ Kazimierz 白天散步'));
  assert.ok(dayOperations[6].addresses.some(item => item.name === '帝王城堡' && item.stepLabels.includes('帝王城堡 / Stary Browar')));
  assert.ok(dayOperations[6].addresses.some(item => item.name === 'Stary Browar' && item.stepLabels.includes('帝王城堡 / Stary Browar')));
});

test('已排定的主要公共地點使用正確地址與官方入口資料', () => {
  const requiredPlaces = [
    [1, 'Krakowskie Przedmieście', 'Krakowskie Przedmieście, Warszawa'],
    [2, '中央廣場 Rynek Główny', 'Rynek Główny, 31-042 Kraków'],
    [2, '紡織會館 Sukiennice', 'Rynek Główny 3, 31-042 Kraków'],
    [2, 'Plac Nowy', 'Plac Nowy, 31-056 Kraków'],
    [5, '樂斯拉夫中央廣場', 'Rynek, 50-101 Wrocław'],
    [6, 'Stary Browar', 'Półwiejska 42, 61-888 Poznań'],
    [7, '華沙老城市場廣場', 'Rynek Starego Miasta, 00-272 Warszawa'],
  ];
  for (const [day, name, expectedAddress] of requiredPlaces) {
    const place = dayOperations[day].addresses.find(item => item.name === name);
    assert.equal(place?.address, expectedAddress, `Day ${day} ${name} 地址錯誤`);
    assert.equal(place?.reliable, true, `Day ${day} ${name} 應有官方來源`);
    assert.match(place?.officialUrl || '', /^https:\/\//, `Day ${day} ${name} 缺官方連結`);
    assert.ok(place?.entranceNote, `Day ${day} ${name} 缺入口說明`);
  }
  assert.ok(!JSON.stringify(dayOperations).includes('Rynek Główny, 31-422 Kraków'));
  const oldTown = dayOperations[1].addresses.find(item => item.name === '華沙老城市場廣場');
  const castle = dayOperations[1].addresses.find(item => item.name === '華沙皇家城堡');
  assert.ok(oldTown.stepLabels.includes('★ 老城廣場'));
  assert.ok(!castle.stepLabels.includes('★ 老城廣場'));
});

test('首頁準備度會跳脫資料文字', () => {
  const unsafeEntry = { ...databaseEntries[0], id: 'unsafe-entry', recheckAt: '2026-09-01' };
  const html = renderHome({
    meta: { edition: 'test', route: 'test', dateRange: 'test', days: 0, nights: 0, style: 'test' },
    days: [], flights: { out: [], back: [] }, cities: [], databaseEntries: [unsafeEntry],
    readinessItems: [{ id: 'unsafe', entryId: 'unsafe-entry', priority: 'P0', status: 'pending', statusText: '<script>x()</script>', title: '<img src=x>', detail: 'A & B', private: false }],
  });
  assert.doesNotMatch(html, /<script>|<img src=x>/);
  assert.ok(html.includes('&lt;script&gt;x()&lt;/script&gt;'));
  assert.ok(html.includes('A &amp; B'));
});

test('資料庫模板會跳脫資料文字並拒絕非 HTTPS 官方來源', () => {
  const html = renderDatabase({
    entries: [{
      id: 'unsafe-entry',
      section: 'unsafe-section',
      category: '<script>category()</script>',
      cityKey: null,
      title: '<img src=x onerror=alert(1)>',
      summary: '<script>summary()</script>',
      status: 'pending',
      sourceUrl: 'javascript:alert(1)',
      verifiedAt: null,
      recheckAt: '2026-10-01',
      offlineNote: 'A & B',
      private: false,
    }],
    sections: [{ id: 'unsafe-section', label: '<b>危險標題</b>' }],
    statusLabels,
  });

  assert.doesNotMatch(html, /<script>|<img src=x|javascript:/);
  assert.ok(html.includes('&lt;script&gt;summary()&lt;/script&gt;'));
  assert.ok(html.includes('&lt;b&gt;危險標題&lt;/b&gt;'));
  assert.ok(html.includes('A &amp; B'));
  assert.ok(html.includes('尚無安全的 HTTPS 官方來源'));
});

test('產出不含舊館址、舊 Auschwitz 入口或敏感資料欄位標籤', () => {
  const rendered = expectedFiles.map(read).join('\n');
  for (const forbidden of [
    'Al. Jerozolimskie 179',
    'Więźniów Oświęcimia 20',
    '護照號：',
    '完整卡號：',
    '保單號：',
  ]) {
    assert.ok(!rendered.includes(forbidden), `產出仍含禁止內容：${forbidden}`);
  }
});

test('駐波蘭代表處使用外交部 2026-08-08 查證的正確館址', () => {
  assert.equal(safety.embassy[0][1], '30th Floor, Ul. Emilii Plater 53, 00-113 Warsaw, Poland');
});

test('克拉科夫與樂斯拉夫飲水資訊各自保有官方來源', () => {
  const krakowWater = databaseEntries.find(item => item.id === 'daily-basics-krakow-water');
  const wroclawWater = databaseEntries.find(item => item.id === 'daily-basics-wroclaw-water');

  assert.equal(krakowWater?.cityKey, 'KRK');
  assert.equal(krakowWater?.sourceUrl, 'https://wodociagi.krakow.pl/en/water-quality/facts-and-myths-about-tap-water');
  assert.equal(wroclawWater?.cityKey, 'WRO');
  assert.equal(wroclawWater?.sourceUrl, 'https://www.mpwik.wroc.pl/csr-2/pij-kranowke/');
});

test('dist 正好產出規格要求的 21 個 HTML', () => {
  assert.deepEqual(htmlFiles(), [...expectedFiles].sort());
  assert.ok(fs.existsSync(path.join(distDir, 'assets/main.css')), '缺少 assets/main.css');
});

test('單檔旅遊指南封裝全部 21 頁且不依賴本機 CSS 或其他 HTML', () => {
  assert.ok(fs.existsSync(standalonePath), '缺少 poland-travel-guide-2026.html');
  const html = fs.readFileSync(standalonePath, 'utf8');

  for (const relativePath of expectedFiles) {
    const pageId = `page-${relativePath.replace(/\.html$/, '').replace(/[^a-z0-9]+/gi, '-')}`;
    assert.ok(html.includes(`id="${pageId}"`), `單檔版缺少 ${relativePath}`);
  }

  assert.ok(html.includes('<style data-bundled="main.css">'));
  assert.ok(!html.includes('href="assets/main.css"'));
  assert.ok(!html.includes('href="practical/database.html'));
  assert.ok(!html.includes('href="day-01.html'));
  assert.ok(html.includes('href="#page-practical-database"'));
  assert.ok(html.includes('href="#page-day-01"'));
});

test('單檔版將過長導覽收納成三組原生下拉選單', () => {
  const html = fs.readFileSync(standalonePath, 'utf8');
  const menus = [...html.matchAll(/<details class="standalone-menu"[^>]*data-group="([^"]+)"/g)]
    .map(match => match[1]);

  assert.deepEqual(menus, ['days', 'cities', 'practical']);
  for (const label of ['每日行程', '城市指南', '實用資訊']) {
    assert.ok(html.includes(`<summary>${label}</summary>`), `缺少 ${label} 下拉選單`);
  }
  assert.match(html, /data-group="days"[\s\S]*href="#page-day-01"[\s\S]*href="#page-day-08"/);
  assert.match(html, /data-group="cities"[\s\S]*href="#page-city-warszawa"[\s\S]*href="#page-city-poznan"/);
  assert.match(html, /data-group="practical"[\s\S]*href="#page-practical-booking"[\s\S]*href="#page-practical-database"/);
  assert.equal((html.match(/class="standalone-home"/g) || []).length, 1);
});

test('單檔版以章節切換取代整頁上下查找，並保留前後頁導航', () => {
  const html = fs.readFileSync(standalonePath, 'utf8');

  assert.equal((html.match(/class="standalone-page-controls"/g) || []).length, expectedFiles.length);
  assert.equal((html.match(/class="standalone-page-ribbon"/g) || []).length, expectedFiles.length);
  assert.match(html, /function showStandalonePage\(targetId\)/);
  assert.match(html, /window\.addEventListener\('hashchange', activateStandaloneHash\)/);
  assert.match(html, /page\.hidden = page\.id !== activePageId/);
  assert.match(html, /@media print[\s\S]*\.standalone-page\[hidden\][\s\S]*display: block !important;/);
});

test('2026-08-09 官方盤查會移除未能證實的場次、價格與閉館敘述', () => {
  const publicData = JSON.stringify({ days, fares, ticketsByCity, attractions, cityNotices, bookingTiers, reservations });

  for (const unsupportedClaim of ['圓頂展廳不開放', 'PLN 143 · 優待 121', '英文場 47', '多為免費', '約 3 個月前開放']) {
    assert.ok(!publicData.includes(unsupportedClaim), `不應保留未證實敘述：${unsupportedClaim}`);
  }
  assert.ok(days[1].mustBook.some(item => item.includes('可立即查／購')));
  assert.equal(days[6].steps.find(step => step.label === '★ POLIN 猶太博物館')?.cost, '依官方售票頁');
  assert.ok(cityNotices.wroclaw.some(item => item.text.includes('availability calendar')));
});

test('自由行資料庫頁提供 SOS、主題索引與緊急聯絡資訊', () => {
  assert.equal(htmlFiles().length, 21);
  const html = read('practical/database.html');
  for (const heading of ['SOS 離線急救卡', '出入境與 ETIAS', '航班與行李', '醫療與保險', '退稅 TAX FREE']) {
    assert.ok(html.includes(heading), `資料庫頁缺少 ${heading}`);
  }
  assert.ok(html.includes('tel:+48668027574'));
  assert.ok(html.includes('tel:+48222130060'));
  assert.ok(html.includes('tel:+886800085095'));
  assert.ok(html.includes('Taipei%20Representative%20Office%20in%20Poland'));
  assert.ok(html.includes('盤查日期'));
  assert.ok(html.includes('保險海外救援'));
  assert.ok(html.includes('需填私人資料'));
  for (const title of ['護照遺失', '緊急就醫', '行李未到', '轉機失接', '卡片遺失']) assert.ok(html.includes(`<h3>${title}</h3>`));
});

test('自由行資料庫有城市、類別、狀態統計與無 JS 記錄連結', () => {
  const html = read('practical/database.html');
  for (const heading of ['靜態查找與統計', '城市', '類別', '狀態']) assert.ok(html.includes(heading));
  for (const entry of databaseEntries) assert.ok(html.includes(`href="#entry-${entry.id}"`), `統計索引缺 ${entry.id}`);
  assert.match(html, /\d+ 筆/);
});

test('自由行資料庫全頁 HTML id 不重複', () => {
  const html = read('practical/database.html');
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, '資料庫頁存在重複 id');
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
  assert.ok((html.match(/href="practical\/database\.html#entry-/g) || []).length >= 8);
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

  for (const label of ['P0 未完成', '最近確認期限', '下一張要買的票', 'ETIAS 狀態', '離線包狀態', '確認期限：']) {
    assert.ok(html.includes(label), `首頁缺少動態摘要：${label}`);
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

test('Day 3 導航指向 Auschwitz I 訪客入口而非通訊地址', () => {
  const operation = JSON.stringify(dayOperations[3]);
  const html = read('day-03.html');

  for (const content of [operation, html]) {
    assert.ok(content.includes('Więźniów Oświęcimia 55'), '缺少 Auschwitz I 訪客入口門牌 55');
    assert.ok(!content.includes('Więźniów Oświęcimia 20'), '仍使用 Auschwitz I 通訊地址門牌 20');
  }
  assert.ok(html.includes('Auschwitz I 訪客服務中心／入口'));
  assert.ok(html.includes('Wiezniow%20Oswiecimia%2055'));
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

test('高風險校正：百年廳 10/28 改由官方 availability calendar 確認', () => {
  for (const file of ['day-05.html', 'city-wroclaw.html']) {
    const html = read(file);
    assert.ok(html.includes('10/28') && html.includes('availability calendar'), `${file} 缺少百年廳可售狀態確認提示`);
    assert.ok(!html.includes('圓頂展廳不開放'), `${file} 不應保留未證實閉館敘述`);
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
  assert.ok(html.includes('營業時間查證於 2026-08-09'));
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
