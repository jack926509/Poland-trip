// 2026-10-15 手機閱讀加強（PWA）：字級切換、手機時間表說明滿版、小字下限、
// 底部快捷列目前所在與 manifest 捷徑。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const distDir = path.resolve('dist');
const read = relativePath => fs.readFileSync(path.join(distDir, relativePath), 'utf8');
const css = () => read('assets/main.css');

test('字級切換：<head> 先套用已存的字級，CSS 以 <html> 基準字級放大', () => {
  for (const file of ['index.html', 'today.html', 'day-02.html', 'practical/todos.html']) {
    const html = read(file);
    const head = html.slice(0, html.indexOf('</head>'));
    const init = head.match(/<script data-ts>([\s\S]*?)<\/script>/)?.[1];
    assert.ok(init, `${file} 缺少字級預先套用腳本`);
    // 必須在主樣式表之前或同時生效，且讀寫失敗不能拋錯中斷頁面
    assert.match(init, /^try\{[\s\S]*\}catch\(e\)\{\}$/);
  }
  const source = css();
  assert.match(source, /html\[data-text-size="lg"\] \{ font-size: 112\.5%; \}/);
  assert.match(source, /html\[data-text-size="xl"\] \{ font-size: 125%; \}/);
  // body 改用 rem，基準字級改變時內文才會跟著放大
  assert.match(source, /^body \{[^}]*font-size: 1rem;/m);
  assert.match(source, /-webkit-text-size-adjust: 100%/);
});

test('字級預先套用腳本：有存值就寫進 data-text-size，localStorage 拋錯時不中斷', () => {
  const init = read('today.html').match(/<script data-ts>([\s\S]*?)<\/script>/)[1];
  const run = storage => {
    const documentElement = { dataset: {} };
    vm.runInNewContext(init, { localStorage: storage, document: { documentElement } });
    return documentElement.dataset.textSize;
  };
  assert.equal(run({ 'polska-text-size': 'xl' }), 'xl');
  assert.equal(run({}), undefined);
  const throwing = new Proxy({}, { get() { throw new Error('SecurityError'); } });
  assert.equal(run(throwing), undefined);
});

test('字級切換鈕由 nav.js 產生，依序 標準 → 大 → 特大，並記在 localStorage', () => {
  const nav = read('assets/nav.js');
  assert.match(nav, /const setupTextSize = \(\) =>/);
  assert.match(nav, /className = 'nav-text-size'/);
  assert.match(nav, /key: '', label: '標準'[\s\S]*key: 'lg', label: '大'[\s\S]*key: 'xl', label: '特大'/);
  assert.match(nav, /localStorage\.setItem\('polska-text-size', next\.key\)/);
  assert.match(nav, /aria-label', `字級：\$\{level\.label\}，按一下改為\$\{next\.label\}`/);
  // 沒有 JS 時不輸出一顆按不動的按鈕
  assert.doesNotMatch(read('day-02.html'), /class="nav-text-size"/);
  // 手機上刊頭與底部快捷列不跟著放大，避免擠成兩行或撐出右緣
  const source = css();
  assert.match(source, /\.nav > a\.nav-today \{ font-size: 15\.2px; \}/);
  assert.match(source, /\.mobile-quick-nav a \{ min-width: 0; font-size: 14px; \}/);
});

test('手機時間表：說明橫跨到最右欄、收成 3 行，導航鈕移到第 2 列', () => {
  const source = css();
  assert.match(source, /\.table-editorial\.table-schedule td:nth-child\(2\) \{[^}]*display: block;[^}]*grid-column: 2 \/ -1/s);
  assert.match(source, /\.table-schedule \.timeline-note \{[^}]*font-size: 0\.9rem;[^}]*line-height: 1\.55/s);
  assert.match(source, /\.table-schedule \.timeline-note\.is-clamped \{[^}]*line-clamp: 3/s);
  assert.match(source, /\.table-editorial\.table-schedule \.step-nav \{[^}]*grid-row: 2;/s);
  assert.match(read('assets/nav.js'), /說明超過 3 行先收成 3 行/);
});

test('手機小字下限：實測 11–13px 的標籤與動作改為 13.6px／14px', () => {
  const source = css();
  const block = source.slice(source.indexOf('/* --- 2. 手機小字下限'));
  for (const selector of ['.store-fact dt', '.grocery-sunday', '.today-sos-tag', '.status-verified', '.booking-item-group']) {
    assert.ok(block.includes(`.journal-site ${selector}`), `小字下限缺少 ${selector}`);
  }
  for (const selector of ['.operation-address-actions a', '.store-action', '.cross-link', '.day-food-map', '.today-action']) {
    assert.ok(block.includes(`.journal-site ${selector}`), `動作字級缺少 ${selector}`);
  }
  // 不能用 max(…, 1em)：font-size 的 1em 是父層字級，會把小標籤一起撐成 16px
  const rules = block.slice(0, block.indexOf('/* --- 3.')).replace(/\/\*[\s\S]*?\*\//g, '');
  assert.doesNotMatch(rules, /max\([^)]*1em\)/);
});

test('放大字級時的自動欄寬：auto-fit／auto-fill 欄位最小寬度不超過容器', () => {
  const source = css();
  assert.doesNotMatch(source, /repeat\(auto-(?:fit|fill), minmax\(\d+(?:\.\d+)?rem, 1fr\)\)/,
    '仍有以 rem 固定最小寬度的自動欄，放大字級後單欄會比手機螢幕寬');
  assert.match(source, /\.store-fact \{ display: grid; grid-template-columns: 2\.6rem minmax\(0, 1fr\);/);
});

test('本頁章節膠囊在窄螢幕垂直置中', () => {
  assert.match(css(), /@media \(max-width: 480px\) \{\s*\.chapter-index ol a \{\s*align-items: center;/);
});

test('底部快捷列：今日卡標出目前所在，其他頁不標', () => {
  const quickNav = file => read(file).match(/<nav class="mobile-quick-nav"[\s\S]*?<\/nav>/)[0];
  assert.match(quickNav('today.html'), /<a href="today\.html" aria-current="page">/);
  assert.doesNotMatch(quickNav('index.html'), /aria-current/);
  assert.doesNotMatch(quickNav('day-02.html'), /aria-current/);
  assert.match(css(), /\.mobile-quick-nav a\[aria-current="page"\] \{/);
});

test('manifest：說明、分類與主畫面長按捷徑都指到實際存在的頁面', () => {
  const manifest = JSON.parse(read('manifest.json'));
  assert.ok(manifest.description && manifest.description.length > 10);
  assert.ok(manifest.categories.includes('travel'));
  assert.ok(manifest.shortcuts.length >= 3);
  for (const shortcut of manifest.shortcuts) {
    assert.ok(shortcut.name && shortcut.url, '捷徑缺少名稱或網址');
    const target = path.join(distDir, shortcut.url.replace(/^\.\//, ''));
    assert.ok(fs.existsSync(target), `捷徑指向不存在的頁面：${shortcut.url}`);
  }
});

test('回頂端：手機往下讀時收起，往回捲才出現（仍保留 900px 與「導航」避讓）', () => {
  const nav = read('assets/nav.js');
  assert.match(nav, /window\.matchMedia\('\(max-width: 700px\)'\) : null/);
  assert.match(nav, /readingDown = Boolean\(compactQuery\?\.matches\) && delta > 0/);
  assert.match(nav, /toTop\.hidden = window\.scrollY < 900 \|\| overlapsNavigateLink\(\) \|\| readingDown/);
});
