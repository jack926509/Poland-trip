// 2026-10-15 手機閱讀加強（PWA）：手機時間表說明滿版、小字下限、
// 底部快捷列目前所在與 manifest 捷徑。（字級切換已於 2026-10-16 移除。）
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const read = relativePath => fs.readFileSync(path.join(distDir, relativePath), 'utf8');
const css = () => read('assets/main.css');

test('刊頭「Aa」字級切換已移除（2026-10-16）：沒有按鈕、預先套用腳本與放大規則', () => {
  for (const file of ['index.html', 'today.html', 'day-02.html', 'practical/todos.html']) {
    const html = read(file);
    assert.doesNotMatch(html, /<script data-ts>/, `${file} 仍有字級預先套用腳本`);
    assert.doesNotMatch(html, /polska-text-size/);
  }
  const nav = read('assets/nav.js');
  assert.doesNotMatch(nav, /setupTextSize|nav-text-size|polska-text-size/);
  const source = css();
  assert.doesNotMatch(source, /data-text-size|\.nav-text-size/);
  // body 仍用 rem；iOS 轉向不自動放大字級
  assert.match(source, /^body \{[^}]*font-size: 1rem;/m);
  assert.match(source, /-webkit-text-size-adjust: 100%/);
  // 手機上刊頭與底部快捷列維持 px，不擠成兩行或撐出右緣
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
  for (const selector of ['.operation-address-actions a', '.store-action', '.cross-link', '.day-food-map', '.today-glance-nav']) {
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
