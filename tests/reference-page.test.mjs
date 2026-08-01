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
