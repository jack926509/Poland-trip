import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const read = relativePath => fs.readFileSync(path.join(distDir, relativePath), 'utf8');
const css = () => fs.readFileSync(path.join(distDir, 'assets/main.css'), 'utf8');

test('正式頁面使用紙上旅行誌外框且保留可及性入口', () => {
  const home = read('index.html');
  assert.match(home, /<body class="journal-site journal-home">/);
  assert.match(home, /class="nav journal-masthead"/);
  assert.match(home, /class="journal-edition"/);
  assert.match(home, /<a class="skip-link" href="#main-content">跳至主要內容<\/a>/);
  assert.match(home, /<details class="nav-dropdown[^>]*name="primary-navigation">/);
});

test('旅行誌視覺契約包含紙色、墨紫、觸控與 reduced motion', () => {
  const source = css();
  assert.match(source, /--paper:\s*#f4eddf/i);
  assert.match(source, /--plum:\s*#493747/i);
  assert.match(source, /\.nav-dropdown\s*>\s*summary[\s\S]*min-height:\s*44px/);
  assert.match(source, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(source, /scroll-behavior:\s*auto/);
});

test('首頁是旅行誌封面、8 日目錄與四城攝影章節', () => {
  const home = read('index.html');
  assert.match(home, /<header class="journal-cover">/);
  assert.match(home, /class="journal-cover-photo"[^>]*src="assets\/photos\/warszawa-hero\.webp"/);
  assert.match(home, /alt="華沙城市風景"/);
  assert.match(home, /<ol class="journal-itinerary"/);
  assert.equal((home.match(/class="journal-day-entry"/g) || []).length, 8);
  assert.match(home, /class="journal-city-chapters"/);
  assert.equal((home.match(/class="journal-city-card"/g) || []).length, 4);
  assert.match(home, /class="journal-toolkit"/);
});

test('每日頁有城市攝影章節且保留現場操作資訊', () => {
  const day = read('day-02.html');
  assert.match(day, /<body class="journal-site journal-day">/);
  assert.match(day, /class="journal-day-cover"/);
  assert.match(day, /src="assets\/photos\/krakow-hero\.webp"/);
  assert.match(day, /class="journal-day-facts"/);
  assert.match(day, /class="table-editorial table-schedule"/);
  assert.match(day, /class="section operation-section"/);
});

test('城市頁以授權照片開章且保留 Leaflet 地圖接口', () => {
  const city = read('city-wroclaw.html');
  assert.match(city, /<body class="journal-site journal-city">/);
  assert.match(city, /class="journal-city-cover"/);
  assert.match(city, /src="assets\/photos\/wroclaw-hero\.webp"/);
  assert.match(city, /alt="樂斯拉夫城市風景"/);
  assert.match(city, /data-map-key="wroclaw"/);
  assert.match(city, /class="map-container"/);
});
