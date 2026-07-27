import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const read = (path) => fs.readFileSync(path, 'utf8');

test('根入口依 768 px 與 view query 分流桌機雜誌和既有手機 PWA', () => {
  const html = read('index.html');
  assert.match(html, /redesign\/pwa-core\.js/);
  assert.match(html, /redesign\/dist\/B-companion\.js/);
  assert.match(html, /matchMedia\('\(min-width: 768px\)'\)/);
  assert.match(html, /searchParams\.get\('view'\)/);
  assert.match(html, /desktop\/desktop\.css/);
  assert.match(html, /desktop\/chapters\.js/);
  assert.match(html, /desktop\/desktop-app\.js/);
  assert.match(html, /行程資料載入失敗，請重新整理/);
  assert.match(html, /window\.TRIP\.days\.length !== 8/);
  assert.match(html, /typeof window\.B_Companion !== 'function'/);
  assert.match(html, /redesign\/pwa-core\.js\?v=polska-v18/);
  assert.match(html, /pwa-register\.js\?v=polska-v18/);
  assert.match(html, /href="#app-main"/);
  assert.match(html, /desktop \? '#desktop-main' : '#app-main'/);
  assert.match(html, /<noscript>/);
  assert.match(html, /手機旅伴/);
});

test('手機正式入口直接載入既有旅伴並提供失敗降級', () => {
  const mobile = read('mobile.html');
  for (const asset of [
    'redesign/pwa-core.js?v=polska-v18',
    'redesign/data.js?v=polska-v18',
    'redesign/dist/B-companion.js?v=polska-v18',
    'pwa-register.js?v=polska-v18',
  ]) assert.match(mobile, new RegExp(asset.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(mobile, /ReactDOM\.createRoot/);
  assert.match(mobile, /B_Companion/);
  assert.match(mobile, /行程資料載入失敗，請重新整理/);
  assert.match(mobile, /href="#app-main"/);
  assert.match(mobile, /<noscript>/);
  assert.match(mobile, /rel="icon" href="icon-192\.png"/);
  assert.doesNotMatch(mobile, /legacy-redirect\.js/);
});

test('桌機與舊預覽入口只載入共用轉址', () => {
  for (const file of ['desktop.html', 'app-preview.html']) {
    const html = read(file);
    assert.match(html, /legacy-redirect\.js/);
    assert.doesNotMatch(html, /B_Companion|A_Magazine|IOSDevice/);
  }
});

test('舊入口依桌機與手機來源分流並保留子路徑、query 與 hash', () => {
  function redirect(file) {
    let replacedWith = '';
    const href = `https://jack926509.github.io/Poland-trip/${file}`;
    const current = new URL(href);
    vm.runInNewContext(read('legacy-redirect.js'), {
      URL,
      URLSearchParams,
      window: {
        location: {
          href,
          pathname: current.pathname,
          search: current.search,
          hash: current.hash,
          replace(target) { replacedWith = target; },
        },
      },
    });
    return replacedWith;
  }
  assert.equal(redirect('desktop.html?day=3#logistics'), 'https://jack926509.github.io/Poland-trip/?day=3&view=desktop#logistics');
  assert.equal(redirect('app-preview.html?day=3#B-tickets'), 'https://jack926509.github.io/Poland-trip/mobile.html?day=3&view=mobile#B-tickets');
});

test('manifest 固定由手機殼啟動且 sitemap 只公開根入口', () => {
  const manifest = JSON.parse(read('manifest.json'));
  assert.equal(manifest.start_url, './mobile.html');
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
  const shortcuts = JSON.parse(read('manifest.json')).shortcuts;
  const shortcut = shortcuts.find((item) => item.short_name === '今日');
  const tickets = shortcuts.find((item) => item.short_name === '訂票');
  assert.equal(shortcut.url, './mobile.html#top');
  assert.equal(tickets.url, './mobile.html#B-tickets');
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
