import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const sw = fs.readFileSync('sw.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const jsx = fs.readFileSync('redesign/B-companion.jsx', 'utf8');

test('只預快取單一正式應用', () => {
  assert.match(sw, /'\.\/'/);
  assert.doesNotMatch(sw, /mobile\.html|desktop\.html|app-preview\.html|A-magazine|ios-frame|C-app/);
});

test('核心資源使用完整 addAll，不吞掉安裝錯誤', () => {
  assert.match(sw, /cache\.addAll\(PRECACHE_URLS\)/);
  assert.doesNotMatch(sw, /cache\.add\(url\)\.catch/);
});

test('離線導覽回到根應用殼', () => {
  assert.match(sw, /caches\.match\('\.\/'\)/);
});

test('核心快取與根入口統一使用 polska-v13', () => {
  assert.match(sw, /const CACHE_VERSION = 'polska-v13'/);
  for (const asset of [
    './manifest.json', './pwa-register.js', './redesign/pwa-core.js',
    './redesign/data.js?v=polska-v13', './redesign/tokens.css?v=polska-v13',
    './redesign/B-companion.css?v=polska-v13',
    './redesign/dist/B-companion.js?v=polska-v13',
  ]) assert.match(sw, new RegExp(asset.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.doesNotMatch(sw, /polska-v12/);
});

test('Service Worker 註冊抽離為三種 PWA 事件', () => {
  const register = fs.readFileSync('pwa-register.js', 'utf8');
  assert.match(html, /<script src="pwa-register\.js"><\/script>/);
  assert.doesNotMatch(html, /navigator\.serviceWorker\.register/);
  for (const eventName of ['pwa-ready', 'pwa-update-ready', 'pwa-error']) {
    assert.match(register, new RegExp(eventName));
  }
});

test('更新只由使用者按鈕觸發，controllerchange 才重載一次', () => {
  assert.match(jsx, /waitingWorker\.postMessage\(\{ type: 'SKIP_WAITING' \}\)/);
  assert.match(jsx, /controllerchange/);
  assert.match(jsx, /window\.location\.reload\(\)/);
  assert.match(jsx, /updateApprovedRef/);
});

test('顯示安裝、離線、更新與儲存降級狀態', () => {
  for (const label of [
    '已連線', '離線模式', '可安裝', '已安裝', '更新可用',
    '備註只保留到這次關閉前', '加到 iPhone 主畫面',
    '目前離線；站名與地址仍可在本頁查看',
  ]) assert.match(jsx, new RegExp(label));
  assert.match(jsx, /B_isIOSSafari/);
  assert.match(jsx, /onClickCapture/);
});
