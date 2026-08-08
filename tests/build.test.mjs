import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';

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

test('dist 正好產出規格要求的 20 個 HTML', () => {
  assert.deepEqual(htmlFiles(), [...expectedFiles].sort());
  assert.ok(fs.existsSync(path.join(distDir, 'assets/main.css')), '缺少 assets/main.css');
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
  for (const page of ['booking', 'dining', 'tickets', 'transit', 'shopping', 'notes']) {
    assert.ok(html.includes(`practical/${page}.html`), `首頁缺少 practical/${page}`);
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
  assert.ok(html.includes('2026/7–2027/11 整修'));
  assert.ok(html.includes('閉館中'));
  assert.doesNotMatch(html, /古市政廳博物館[\s\S]{0,160}<td class="number">10<\/td>/);
});

test('高風險校正：百年廳 10/28 圓頂關閉在 Day 5 與城市頁都看得到', () => {
  for (const file of ['day-05.html', 'city-wroclaw.html']) {
    const html = read(file);
    assert.ok(html.includes('10/28') && html.includes('圓頂展廳不開放'), `${file} 缺少百年廳警示`);
  }
});

test('高風險校正：皇家城堡與辛德勒工廠保留待確認', () => {
  assert.ok(read('day-07.html').includes('待確認'), 'Day 7 缺少皇家城堡待確認');
  assert.ok(read('city-warszawa.html').includes('待確認'), '華沙城市頁缺少皇家城堡待確認');
  assert.ok(read('city-krakow.html').includes('待確認'), '克拉科夫城市頁缺少辛德勒待確認');
});

test('門票頁含 21 筆新資料、Panorama 優待 35 與 Auschwitz 待確認', async () => {
  const { fares } = await import('../src/data/tickets.js');
  assert.equal(fares.length, 21);
  const panorama = fares.find(item => item.name.includes('Panorama'));
  assert.equal(panorama.discountPrice, '35');
  const html = read('practical/tickets.html');
  assert.ok(html.includes('Auschwitz') && html.includes('待確認'));
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
