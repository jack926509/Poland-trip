import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { groceryProducts } from '../src/data/groceries.js';
import { initializeProductPhotos, renderProductPhoto } from '../src/templates/product-photos.mjs';
import { writeServiceWorker } from '../src/build/output.mjs';

test('十項商品皆有本機真實照片、代表包裝說明與授權，單檔照片連結也可離線開啟', () => {
  const page = fs.readFileSync('dist/practical/groceries.html', 'utf8');
  const standalone = fs.readFileSync('poland-travel-guide-2026.html', 'utf8');
  const sw = fs.readFileSync('dist/sw.js', 'utf8');
  assert.equal((page.match(/data-product-photo aria-label=/g) || []).length, 10);
  for (const product of groceryProducts) {
    const photo = product.photo;
    assert.ok(photo.width > 0 && photo.height > 0);
    assert.equal(photo.license, 'CC BY-SA 3.0');
    assert.match(photo.sourceUrl, /^https:\/\/world\.openfoodfacts\.org\/product\/\d+$/);
    const data = fs.readFileSync(photo.src);
    assert.equal(data.subarray(8, 12).toString(), 'WEBP');
    assert.ok(page.includes(`src="../${photo.src}"`));
    assert.ok(sw.includes(`./${photo.src}`));
    const inline = `data:image/webp;base64,${data.toString('base64')}`;
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
