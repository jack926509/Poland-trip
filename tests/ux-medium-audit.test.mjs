// UX 稽核中嚴重度 M1–M11 修正驗證。
// 每個 test 對應稽核報告一個編號，方便回溯改動與原始問題。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const read = relativePath => fs.readFileSync(path.join(distDir, relativePath), 'utf8');
const css = () => fs.readFileSync(path.join(distDir, 'assets/main.css'), 'utf8');

test('M10：全程動線「無待訂項目」改為純文字，不再是可點連結', () => {
  const home = read('index.html');
  assert.match(home, /<span class="source-meta">無待訂項目<\/span>/);
  assert.doesNotMatch(home, /<a[^>]*>無待訂項目<\/a>/);
  // 仍要保留待處理項目的可點連結
  assert.match(home, /<a href="day-\d\d\.html#day-preparation">待處理 \d+ 項<\/a>/);
});

test('M11：今日頁標題上方顯示 TODAY 而非 APPENDIX，資料庫頁維持原樣', () => {
  const source = css();
  assert.match(source, /\.journal-today \.journal-appendix-header::before \{\s*content:\s*'TODAY';\s*\}/);
  // 今日頁 body class 是 journal-today，資料庫頁是 journal-practical，
  // CSS 用 class 範圍區分，不需要各自模板改動。
  const today = read('today.html');
  const database = read('practical/database.html');
  assert.match(today, /<body class="journal-site journal-today">/);
  assert.match(database, /<body class="journal-site journal-practical">/);
});

test('M1：今日頁手機 sticky 動作列貼齊頂端且改成單行，不再懸空留縫', () => {
  const source = css();
  const rule = source.match(/\.journal-today \.today-actions \{([^}]*)\}/)?.[1];
  assert.ok(rule, '找不到 .journal-today .today-actions 手機覆寫規則');
  assert.match(rule, /top:\s*0/);
  assert.match(rule, /flex-wrap:\s*nowrap/);
});

test('M8：「資料更新儀表板」從主導覽「實用資訊」下拉移除，但頁面仍存在可連結', () => {
  const home = read('index.html');
  const navSection = home.match(/<details class="nav-dropdown[^>]*>\s*<summary[^>]*>實用資訊<\/summary>([\s\S]*?)<\/details>/)?.[1];
  assert.ok(navSection, '找不到實用資訊下拉區塊');
  assert.doesNotMatch(navSection, /資料更新儀表板/);
  // 頁面本身仍要 build 出來，只是不進主導覽
  assert.equal(fs.existsSync(path.join(distDir, 'practical/ops-dashboard.html')), true);
});
