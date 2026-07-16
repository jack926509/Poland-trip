import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const read = (path) => fs.readFileSync(path, 'utf8');

test('根入口直接載入唯一 PWA，不做裝置跳轉', () => {
  const html = read('index.html');
  assert.match(html, /redesign\/pwa-core\.js/);
  assert.match(html, /redesign\/dist\/B-companion\.js/);
  assert.doesNotMatch(html, /matchMedia\('\(max-width: 640px\)'\)/);
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
