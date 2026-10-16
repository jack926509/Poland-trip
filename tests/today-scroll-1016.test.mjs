// 2026-10-16 手機網頁與 PWA「今日卡滑不動」的修正驗證。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const css = () => fs.readFileSync(path.resolve('dist/assets/main.css'), 'utf8');

test('今日卡的下拉選單在手機不低於 16px，iOS 點選時不會自動放大整頁', () => {
  const source = css();
  assert.match(source, /@media \(max-width: 700px\) \{\s*\.today-date-controls select, \.today-next select \{ font-size: max\(1rem, 16px\); \}/);
  // 精簡版（旅途中）的日期選單選擇器較具體，會蓋過上面那條，也必須是 16px 以上。
  assert.match(source, /\.today-compact \.today-date-controls \.today-field select \{[^}]*font-size: max\(1rem, 16px\);/);
  assert.doesNotMatch(source, /\.today-compact \.today-date-controls \.today-field select \{[^}]*font-size: \.9rem/);
});

test('320px 窄螢幕的精簡版 SOS 換行，代表處號碼不把頁面撐寬', () => {
  assert.match(css(), /@media \(max-width: 360px\) \{\s*\.today-compact \.today-sos \{ flex-wrap: wrap; \}\s*\.today-compact \.today-sos-list \{ flex-basis: 100%; \}/);
});
