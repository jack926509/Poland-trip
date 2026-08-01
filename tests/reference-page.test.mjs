import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const BASE = 'reference/cinematic-scroll';

test('參考頁三個檔案存在', () => {
  for (const f of ['index.html', 'styles.css', 'script.js']) {
    assert.equal(fs.existsSync(`${BASE}/${f}`), true, `缺少 ${BASE}/${f}`);
  }
});

test('參考頁不引用正式站任何檔案', () => {
  const html = fs.readFileSync(`${BASE}/index.html`, 'utf8');
  for (const forbidden of [
    'redesign/', 'desktop/', 'pwa-register.js', 'sw.js', 'main.js', 'vendor/',
  ]) {
    assert.ok(!html.includes(forbidden), `參考頁不應引用 ${forbidden}`);
  }
});

test('參考頁全檔無簡體字（抽驗高頻字）', () => {
  for (const f of ['index.html', 'styles.css', 'script.js']) {
    const src = fs.readFileSync(`${BASE}/${f}`, 'utf8');
    for (const ch of ['单', '双', '这', '欢', '关', '开', '实', '语', '页', '边']) {
      assert.ok(!src.includes(ch), `${f} 含簡體字「${ch}」`);
    }
  }
});

test('DOM 來源順序與來源規格 §3 一致', () => {
  const html = fs.readFileSync(`${BASE}/index.html`, 'utf8');
  const order = [
    'class="scene-img sky-img"',
    'class="site-header"',
    'class="back-stack"',
    'class="scene-img back-img back-four"',
    'class="sights-slider"',
    'class="scene-img back-img back-bazaar"',
    'class="sights-controls"',
    'class="hero-title"',
    'class="scene-img splitframe-img splitframe-left"',
    'class="scene-img splitframe-img splitframe-right"',
    'class="scene-img bridge-img"',
    'class="scene-img frame-two-img"',
    'class="shade"',
    'class="intro-copy"',
    'story-panel-bridge',
    'story-panel-bazaar',
  ];
  let cursor = -1;
  for (const marker of order) {
    const at = html.indexOf(marker);
    assert.ok(at > cursor, `來源順序錯誤：${marker} 應在前一項之後`);
    cursor = at;
  }
});

test('五張景點卡，卡內元素順序為 kicker → pin → h3 → p', () => {
  const html = fs.readFileSync(`${BASE}/index.html`, 'utf8');
  const cards = [...html.matchAll(/<article class="sight-card"[\s\S]*?<\/article>/g)];
  assert.equal(cards.length, 5, '應有 5 張 .sight-card');
  for (const [card] of cards) {
    const k = card.indexOf('sight-kicker');
    const pin = card.indexOf('sight-pin');
    const h3 = card.indexOf('<h3');
    const p = card.indexOf('<p');
    assert.ok(k < pin && pin < h3 && h3 < p, `卡片內元素順序錯誤：${card.slice(0, 80)}`);
    assert.match(card, /tabindex="0"/);
    assert.match(card, /role="button"/);
  }
});

test('所有場景圖 alt 為空字串', () => {
  const html = fs.readFileSync(`${BASE}/index.html`, 'utf8');
  const imgs = [...html.matchAll(/<img class="scene-img[^>]*>/g)].map((m) => m[0]);
  assert.equal(imgs.length, 7, '應有 7 張 .scene-img');
  for (const img of imgs) assert.match(img, /alt=""/, `場景圖缺 alt=""：${img}`);
});

test('捲動軌與 sticky 舞台結構存在', () => {
  const html = fs.readFileSync(`${BASE}/index.html`, 'utf8');
  assert.match(html, /<section class="cinema-scroll" id="cinema"/);
  assert.match(html, /<div class="stage">/);
  assert.match(html, /<div class="world">/);
});
