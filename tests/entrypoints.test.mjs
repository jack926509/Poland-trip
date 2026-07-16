import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

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

test('manifest 與 sitemap 只公開根入口', () => {
  const manifest = JSON.parse(read('manifest.json'));
  assert.equal(manifest.start_url, './');
  assert.equal(manifest.id, './');
  assert.doesNotMatch(read('sitemap.xml'), /mobile\.html|desktop\.html|app-preview\.html/);
});
