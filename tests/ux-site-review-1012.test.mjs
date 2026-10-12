import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { linkifyText } from '../src/lib/html.mjs';

const read = file => fs.readFileSync(`dist/${file}`, 'utf8');
const css = () => fs.readFileSync('src/styles/main.css', 'utf8');

test('長網址改成網域短連結，不在手機上把頁面撐寬', () => {
  const html = linkifyText('先在 TheFork 訂位：https://www.thefork.com/restaurant/abc-r1，或打電話。');
  assert.match(html, /<a href="https:\/\/www\.thefork\.com\/restaurant\/abc-r1" target="_blank" rel="noopener noreferrer">thefork\.com ↗<\/a>/);
  assert.ok(html.endsWith('，或打電話。'));
  assert.equal(linkifyText('<b>x</b>'), '&lt;b&gt;x&lt;/b&gt;');
  for (const file of ['practical/booking.html', 'practical/todos.html', 'practical/ops-dashboard.html']) {
    // 匯出用的 JSON（<script> 內）保留原文，只檢查畫面上的文字
    const visible = read(file).replace(/<script[\s\S]*?<\/script>/g, '');
    assert.doesNotMatch(visible, />[^<]*https:\/\/www\.thefork\.com\/restaurant\/[^<]*</, `${file} 仍有裸露長網址`);
  }
});

test('餐飲指南：Day 1–8 跳轉列，營業時間名錄依城市收合', () => {
  const html = read('practical/dining.html');
  const jump = html.slice(html.indexOf('<nav class="day-jump"'), html.indexOf('</nav>', html.indexOf('<nav class="day-jump"')));
  for (let n = 1; n <= 8; n += 1) assert.ok(jump.includes(`href="#meals-day-${n}"`), `缺少 Day ${n} 跳轉`);
  const hours = html.slice(html.indexOf('id="restaurant-hours"'));
  assert.ok((hours.match(/<details class="card hours-city-group"><summary><h3>/g) || []).length >= 4);
});

test('城市頁：三餐主選與其他候選分組，查核紀錄收合但營業時間可見', () => {
  const html = read('city-warszawa.html');
  assert.match(html, /<details class="city-dining-group" open>\s*<summary>你的候選與順路必吃：三餐主選（\d+ 家）<\/summary>/);
  assert.match(html, /<details class="city-dining-group">\s*<summary>你的候選：備選與點心（\d+ 家）<\/summary>/);
  assert.ok(html.includes('<details class="city-dining-record"><summary>查核紀錄與來源</summary>'));
  assert.match(html, /營業時間：週一休；週二至週六 13:00–24:00/);
});

test('倒數看板手機版把倒數、日期、類別並排；本頁章節手機藏英文小標', () => {
  const source = css();
  assert.match(source, /\.countdown-table tbody tr \{\s*display: grid;/);
  assert.match(source, /@media \(max-width: 480px\) \{\s*\.chapter-index ol a > span \{ display: none; \}/);
});
