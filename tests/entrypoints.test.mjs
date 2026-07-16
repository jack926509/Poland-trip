import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const read = (path) => fs.readFileSync(path, 'utf8');

test('根入口直接載入唯一 PWA，不做裝置跳轉', () => {
  const html = read('index.html');
  assert.match(html, /redesign\/pwa-core\.js/);
  assert.match(html, /redesign\/dist\/B-companion\.js/);
  assert.doesNotMatch(html, /matchMedia\('\(max-width: 640px\)'\)/);
  assert.match(html, /redesign\/pwa-core\.js\?v=polska-v15/);
  assert.match(html, /pwa-register\.js\?v=polska-v15/);
});

test('舊入口只載入共用轉址', () => {
  for (const file of ['mobile.html', 'desktop.html', 'app-preview.html']) {
    const html = read(file);
    assert.match(html, /legacy-redirect\.js/);
    assert.doesNotMatch(html, /B_Companion|A_Magazine|IOSDevice/);
  }
});

test('舊入口轉址保留 GitHub Pages 子路徑、query 與 hash', () => {
  let replacedWith = '';
  const href = 'https://jack926509.github.io/Poland-trip/mobile.html?day=3#B-tickets';

  vm.runInNewContext(read('legacy-redirect.js'), {
    URL,
    window: {
      location: {
        href,
        search: '?day=3',
        hash: '#B-tickets',
        replace(target) {
          replacedWith = target;
        },
      },
    },
  });

  assert.equal(
    replacedWith,
    'https://jack926509.github.io/Poland-trip/?day=3#B-tickets',
  );
});

test('manifest 與 sitemap 只公開根入口', () => {
  const manifest = JSON.parse(read('manifest.json'));
  assert.equal(manifest.start_url, './');
  assert.equal(manifest.id, './');
  assert.doesNotMatch(read('sitemap.xml'), /mobile\.html|desktop\.html|app-preview\.html/);
});

test('經典版逐位元封存且不進入公開或快取路徑', () => {
  const archived = fs.readFileSync('archive/classic-index.html');
  assert.equal(
    crypto.createHash('sha256').update(archived).digest('hex'),
    '5d1126029e882a15e285ba7e2fa107a7a55f13869b2b7a38e1ac41ac481df978',
  );
  for (const file of ['manifest.json', 'sitemap.xml', 'sw.js', 'build.sh']) {
    assert.doesNotMatch(read(file), /archive\/classic-index\.html/);
  }
  assert.match(read('README.md'), /archive\/classic-index\.html/);
});

test('manifest 今日 shortcut 對應實際存在的 JSX 錨點', () => {
  const shortcut = JSON.parse(read('manifest.json')).shortcuts.find((item) => item.short_name === '今日');
  assert.equal(shortcut.url, './#top');
  assert.match(read('redesign/B-companion.jsx'), /id="top"/);
});

test('入口 metadata 日期與唯一資料來源一致', () => {
  const html = read('index.html');
  const data = read('redesign/data.js');
  assert.match(data, /tripStart:\s*'2026-10-24'/);
  assert.match(data, /tripEnd:\s*'2026-10-31'/);
  assert.match(html, /2026\/10\/24[–-]10\/31/);
  assert.doesNotMatch(html, /2026\/10\/23[–-]11\/1|2025[–-]2026/);
});

test('合併說明只保留歷史脈絡，不再指示建立或推送三版本', () => {
  const notes = read('MERGE-NOTES.md');
  assert.match(notes, /歷史封存/);
  assert.doesNotMatch(notes, /git push|git checkout -b|unzip|cp -r/);
});
