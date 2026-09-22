import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { groceryBranches, groceryProducts } from '../src/data/groceries.js';
import { cityRoutes } from '../src/lib/city-guide.mjs';
import { normalizeText } from '../src/search/site-search-index.mjs';

test('採買指南保留四城 12 個待確認候選與十項商品，不把候選當作已驗證門市', () => {
  assert.equal(groceryBranches.length, 12);
  assert.equal(new Set(groceryBranches.map(b => b.id)).size, 12);
  assert.equal(groceryProducts.length, 10);
  for (const city of cityRoutes) assert.equal(groceryBranches.filter(b => b.cityKey === city.mapKey).length, 3);
  for (const b of groceryBranches) {
    assert.equal(b.verificationStatus, 'pending');
    assert.equal(b.verifiedAt, null);
  }
  const html = fs.readFileSync('dist/practical/groceries.html', 'utf8');
  assert.equal((html.match(/地址與營業時間尚未核實/g) || []).length, 12);
  for (const b of groceryBranches) assert.ok(html.includes(encodeURIComponent(`${b.name} ${b.address}`)));
  assert.match(html, /2026\/10\/25/);
});

test('採買頁與四城雙向串接，商品與地址可透過共用搜尋索引找到', () => {
  const html = fs.readFileSync('dist/practical/groceries.html', 'utf8');
  for (const city of cityRoutes) {
    const cityHtml = fs.readFileSync(`dist/city-${city.fileKey}.html`, 'utf8');
    assert.ok(cityHtml.includes(`practical/groceries.html#${city.mapKey}`));
    assert.ok(html.includes(`id="${city.mapKey}"`));
    assert.ok(html.includes(`../city-${city.fileKey}.html`));
  }
  const records = JSON.parse(fs.readFileSync('dist/assets/search-index.json', 'utf8'));
  const record = records.find(r => r.href === 'practical/groceries.html');
  assert.ok(record);
  for (const word of [...groceryProducts.map(p => p.localName), ...groceryBranches.map(b => b.address)]) {
    assert.ok(record.searchText.includes(normalizeText(word)), word);
  }
});

test('離線單檔保留採買內容並正確改寫跨頁城市錨點', () => {
  const html = fs.readFileSync('poland-travel-guide-2026.html', 'utf8');
  assert.ok(html.includes('id="page-practical-groceries"'));
  assert.ok(html.includes('id="page-practical-groceries--warsaw"'));
  assert.ok(html.includes('href="#page-practical-groceries--warsaw"'));
  assert.ok(fs.readFileSync('dist/sw.js', 'utf8').includes('./practical/groceries.html'));
});
