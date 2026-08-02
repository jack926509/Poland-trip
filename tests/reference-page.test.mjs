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

test(':root 自訂屬性初始值與來源規格 §4 一致', () => {
  const css = fs.readFileSync(`${BASE}/styles.css`, 'utf8');
  const expected = {
    '--back-scale': '0.76',
    '--four-y': '10vh',
    '--four-scale': '0.78',
    '--bazaar-y': '20vh',
    '--blur-tint': '74, 181, 224',
    '--bridge-bottom': '5vh',
    '--bridge-width': '67.2vw',
    '--bridge-scale': '1.02',
    '--frame2-scale': '1.06',
    '--sights-enter-x': '420vw',
    '--sights-visibility': 'hidden',
    '--ink': '#111411',
    '--paper': '#fdf1e1',
  };
  for (const [prop, value] of Object.entries(expected)) {
    const re = new RegExp(`${prop.replace(/-/g, '\\-')}\\s*:\\s*${value.replace(/[.()#]/g, '\\$&')}\\s*;`);
    assert.match(css, re, `${prop} 應為 ${value}`);
  }
});

test('捲動軌高度與 sticky 舞台照抄', () => {
  const css = fs.readFileSync(`${BASE}/styles.css`, 'utf8');
  assert.match(css, /height:\s*calc\(100vh \+ 3700px\)/, '捲動軌應為 100vh + 3700px');
  assert.match(css, /position:\s*sticky/);
  assert.match(css, /isolation:\s*isolate/);
});

test('輪播軌轉場曲線照抄', () => {
  const css = fs.readFileSync(`${BASE}/styles.css`, 'utf8');
  assert.match(css, /transform 640ms cubic-bezier\(0\.22,\s*1,\s*0\.36,\s*1\)/);
  assert.match(css, /\.is-jumping\s*\{[^}]*transition:\s*none/);
});

test('三個媒體查詢斷點齊備', () => {
  const css = fs.readFileSync(`${BASE}/styles.css`, 'utf8');
  for (const q of ['max-width: 1500px', 'max-width: 1100px', 'max-width: 640px']) {
    assert.ok(css.includes(`@media (${q})`), `缺少 @media (${q})`);
  }
  assert.ok(css.includes('prefers-reduced-motion: reduce'), '缺少 prefers-reduced-motion 區塊');
});

// ===== Task 6: 內容層置換為波蘭 =====

test('內容層已換成波蘭，無波士尼亞殘留', () => {
  const html = fs.readFileSync(`${BASE}/index.html`, 'utf8');
  for (const term of [
    'Mostar', 'Stari Most', 'Kujundziluk', 'Neretva', 'Bosnia',
    'Koski', 'Kajtaz', 'Bazaar Street', 'Old Bridge',
  ]) {
    assert.ok(!html.includes(term), `不應殘留波士尼亞名詞「${term}」`);
  }
  assert.match(html, /POLSKA/, '大標應為 POLSKA');
  assert.match(html, /lang="zh-Hant"/, 'lang 應為 zh-Hant');
});

test('波蘭本地照片路徑正確且檔案存在', () => {
  const html = fs.readFileSync(`${BASE}/index.html`, 'utf8');
  const refs = [...html.matchAll(/\.\.\/\.\.\/assets\/photos\/[a-z-]+\.webp/g)].map((m) => m[0]);
  // 5 張 .sight-pin 沿用來源規格「3 個唯一圖檔、A-B-C-A-B 重複」的既有結構
  // （Task 2/3 已建立、Task 6 不動 DOM），故總出現次數是 6（5 pin + 1 frame-two），
  // 唯一檔名只有 4 種（krakow-hero 作 frame-two + 3 張 thumb 作 pin）。
  assert.equal(refs.length, 6, '應有 6 處本地照片引用（1 frame-two + 5 個 sight-pin 元素）');
  const unique = [...new Set(refs)];
  assert.equal(unique.length, 4, '應有 4 種本地照片檔名（1 frame-two-hero + 3 種 pin 縮圖，重複沿用來源規格 A-B-C-A-B 模式）');
  for (const r of unique) {
    const real = r.replace('../../', '');
    assert.ok(fs.existsSync(real), `缺檔案 ${real}`);
  }
});

test('中文與英文／數字之間有半形空格', () => {
  const html = fs.readFileSync(`${BASE}/index.html`, 'utf8');
  const text = html.replace(/<[^>]+>/g, ' ');
  const bad = [...text.matchAll(/[一-鿿][A-Za-z0-9]|[A-Za-z0-9][一-鿿]/g)];
  assert.equal(bad.length, 0, `中英文間缺半形空格：${bad.map((m) => m[0]).join('、')}`);
});

test('sight-pin 含必要的 object-fit 偏離', () => {
  const css = fs.readFileSync(`${BASE}/styles.css`, 'utf8');
  const rule = css.slice(css.indexOf('.sight-pin'), css.indexOf('.sight-pin') + 400);
  assert.match(rule, /object-fit:\s*cover/);
  assert.match(rule, /設計文件 §3\.5/, '偏離處須有理由註記');
});

test('五張景點卡的地名皆取自 redesign/data.js 實際行程', () => {
  const html = fs.readFileSync(`${BASE}/index.html`, 'utf8');
  for (const term of ['皇家城堡', 'Wawel 城堡', 'Kazimierz 猶太區', '百年廳', '教堂島']) {
    assert.ok(html.includes(term), `景點卡應包含「${term}」`);
  }
});
