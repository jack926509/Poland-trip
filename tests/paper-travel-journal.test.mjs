import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const read = relativePath => fs.readFileSync(path.join(distDir, relativePath), 'utf8');
const css = () => fs.readFileSync(path.join(distDir, 'assets/main.css'), 'utf8');

test('正式頁面使用紙上旅行誌外框且保留可及性入口', () => {
  const home = read('index.html');
  assert.match(home, /<body class="journal-site journal-home">/);
  assert.match(home, /class="nav journal-masthead"/);
  assert.match(home, /class="journal-edition"/);
  assert.match(home, /<a class="skip-link" href="#main-content">跳至主要內容<\/a>/);
  assert.match(home, /<details class="nav-dropdown[^>]*name="primary-navigation">/);
});

test('旅行誌視覺契約包含紙色、墨紫、觸控與 reduced motion', () => {
  const source = css();
  assert.match(source, /--paper:\s*#f4eddf/i);
  assert.match(source, /--plum:\s*#493747/i);
  assert.match(source, /\.nav-dropdown\s*>\s*summary[\s\S]*min-height:\s*44px/);
  assert.match(source, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(source, /scroll-behavior:\s*auto/);
});
