import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { groceryProducts } from '../src/data/groceries.js';
import { initializeProductPhotos, renderProductPhoto } from '../src/templates/product-photos.mjs';
import { precachedGroceryPhotos, writeServiceWorker } from '../src/build/output.mjs';
import { groceryPhotos } from '../src/data/grocery-photos.js';

test('商品皆有本機真實照片、代表包裝說明與授權，單檔照片連結也可離線開啟', () => {
  const page = fs.readFileSync('dist/practical/groceries.html', 'utf8');
  const standalone = fs.readFileSync('poland-travel-guide-2026.html', 'utf8');
  const sw = fs.readFileSync('dist/sw.js', 'utf8');
  assert.equal((page.match(/data-product-photo aria-label=/g) || []).length, 24);
  for (const product of groceryProducts) {
    const photo = product.photo;
    assert.ok(photo.width > 0 && photo.height > 0);
    assert.equal(photo.license, 'CC BY-SA 3.0');
    assert.match(photo.sourceUrl, /^https:\/\/world\.openfoodfacts\.org\/product\/\d+$/);
    const data = fs.readFileSync(photo.src);
    const isWebP = photo.src.endsWith('.webp');
    if (isWebP) assert.equal(data.subarray(8, 12).toString(), 'WEBP');
    else assert.equal(data.subarray(0, 3).toString('hex'), 'ffd8ff');
    assert.ok(page.includes(`src="../${photo.src}"`));
    assert.ok(sw.includes(`./${photo.src}`));
    const inline = `data:image/${isWebP ? 'webp' : 'jpeg'};base64,${data.toString('base64')}`;
    assert.ok(standalone.includes(`src="${inline}"`));
    assert.ok(standalone.includes(`href="${inline}"`));
  }
  assert.ok(renderProductPhoto({}).includes('照片待補'));
});

test('放大沿用已內嵌的照片、複製署名，關閉按鈕與背景操作可關閉視窗', () => {
  const handlers = {};
  const image = {};
  const title = {};
  let opened = 0, closed = 0, prevented = 0, copied = false;
  const close = { addEventListener: (type, fn) => { handlers.close = fn; } };
  const credit = { replaceChildren: node => { copied = node === 'credit'; } };
  const dialog = {
    querySelector: selector => ({ img: image, '[data-photo-title]': title, '[data-photo-credit]': credit, '[data-photo-close]': close })[selector],
    showModal: () => opened++, close: () => closed++,
    addEventListener: (type, fn) => { handlers.backdrop = fn; },
    getBoundingClientRect: () => ({ left: 10, right: 100, top: 10, bottom: 100 }),
  };
  const thumbnail = { src: 'data:image/webp;base64,test', alt: '代表包裝' };
  const link = { querySelector: () => thumbnail, closest: () => ({ querySelector: () => ({ cloneNode: () => 'credit' }) }) };
  const root = { querySelector: () => dialog, contains: node => node === link, addEventListener: (type, fn) => { handlers.open = fn; } };
  initializeProductPhotos(root);
  handlers.open({ target: { closest: () => link }, preventDefault: () => prevented++ });
  assert.equal(opened, 1); assert.equal(prevented, 1);
  assert.equal(image.src, thumbnail.src); assert.equal(title.textContent, thumbnail.alt); assert.ok(copied);
  handlers.close(); assert.equal(closed, 1);
  handlers.backdrop({ target: dialog, clientX: 0, clientY: 0 }); assert.equal(closed, 2);
  handlers.backdrop({ target: dialog, clientX: 50, clientY: 50 }); assert.equal(closed, 2);
  // 未支援 dialog 時不攔截普通圖片連結。
  initializeProductPhotos({ querySelector: () => ({}), addEventListener: () => assert.fail('不應攔截') });
});

test('只更新商品照片也會變更 PWA 快取版本', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'grocery-cache-'));
  try {
    fs.cpSync('dist', tmp, { recursive: true });
    writeServiceWorker({ projectRoot: process.cwd(), distDir: tmp });
    const before = fs.readFileSync(path.join(tmp, 'sw.js'), 'utf8');
    fs.appendFileSync(path.join(tmp, groceryProducts[0].photo.src), 'changed-image');
    writeServiceWorker({ projectRoot: process.cwd(), distDir: tmp });
    assert.notEqual(fs.readFileSync(path.join(tmp, 'sw.js'), 'utf8'), before);
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
});

test('商品照片沒有孤兒：sw 只預快取引用到的、資料與檔案互相對得上、每張都有署名', () => {
  const referenced = [...new Set(groceryProducts.map(product => product.photo.src))].sort();

  // sw.js 的清單由建置推導，必須剛好等於引用清單。上面的測試只檢查
  // 「引用到的都在 sw 裡」；這裡擋反方向——多列的照片每個安裝都會白白下載、
  // 永久快取，還算進快取指紋（2026-09 曾經多掛了三張）。
  const sw = fs.readFileSync('dist/sw.js', 'utf8');
  const precached = [...sw.matchAll(/'\.\/(assets\/photos\/grocery-[^']+)'/g)].map(match => match[1]).sort();
  assert.deepEqual(precached, referenced, 'dist/sw.js 預快取的商品照片與資料引用的不一致');
  assert.deepEqual(precachedGroceryPhotos(), referenced);

  // grocery-photos.js 的每一筆都要有商品使用，assets/photos 的每個 grocery-* 檔案
  // 也要有對應的一筆；否則就是沒人引用、卻跟著 dist 發布的檔案。
  const defined = Object.values(groceryPhotos).map(photo => photo.src).sort();
  assert.deepEqual(defined, referenced, 'grocery-photos.js 有沒被任何商品使用的照片');
  const onDisk = fs.readdirSync('assets/photos').filter(name => /^grocery-/.test(name) && !name.endsWith('.md'))
    .map(name => `assets/photos/${name}`).sort();
  assert.deepEqual(onDisk, referenced, 'assets/photos 有沒被任何商品使用的 grocery-* 檔案');

  // CC BY-SA 要求署名：每張發布出去的照片都要在 GROCERY-CREDITS.md 裡，
  // 已不發布的照片也不該還掛著署名，讓人以為它仍在站上。
  const credits = fs.readFileSync('assets/photos/GROCERY-CREDITS.md', 'utf8');
  const credited = [...new Set([...credits.matchAll(/grocery-\d+\.(?:webp|jpe?g)/g)].map(match => `assets/photos/${match[0]}`))].sort();
  assert.deepEqual(credited, referenced, 'GROCERY-CREDITS.md 的照片清單與實際發布的不一致');
});
