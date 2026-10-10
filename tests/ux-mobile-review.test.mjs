// 2026-10-10 手機 UX/UI 審查 11 項的修正驗證。
// 每個 test 標註審查清單的編號，方便回溯原始問題。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { days, todoGroups } from '../src/data/trip.js';
import { verifiedRestaurantHours } from '../src/data/dining.js';
import { isOpenTodoStatus } from '../src/scripts/dashboard.js';

const distDir = path.resolve('dist');
const read = relativePath => fs.readFileSync(path.join(distDir, relativePath), 'utf8');
const css = () => fs.readFileSync(path.join(distDir, 'assets/main.css'), 'utf8');
const between = (html, start, end) => {
  const from = html.indexOf(start);
  assert.ok(from >= 0, `找不到起點：${start}`);
  const to = html.indexOf(end, from + start.length);
  return html.slice(from, to < 0 ? undefined : to);
};

test('第 1 項：手機回頂端按鈕浮在底部快捷列上方，不被 z-index 900 的快捷列蓋住', () => {
  const source = css();
  assert.match(source, /@media \(max-width: 700px\) \{[^@]*?\.to-top \{[^}]*bottom:\s*calc\(max\(0\.75rem, env\(safe-area-inset-bottom\)\) \+ 65px \+ 0\.75rem\)/s);
  assert.doesNotMatch(source, /\.to-top \{\s*right: 0\.9rem;\s*bottom: 0\.9rem;/, '舊的 bottom: .9rem 會被快捷列蓋住');
  // 快捷列高度仍是 52px 按鈕＋.35rem 內距，65px 的推算才成立
  assert.match(source, /\.mobile-quick-nav a \{[^}]*min-height: 52px/s);
});

test('第 2 項：.day-shortcuts 只剩一處定義，手機改成一行不換行', () => {
  const source = css();
  const baseBlocks = source.match(/^\.day-shortcuts \{/gm) || [];
  assert.equal(baseBlocks.length, 1, `.day-shortcuts 基本規則應只有 1 處，實際 ${baseBlocks.length}`);
  assert.doesNotMatch(source, /\.trip-day-picker,?\s*\.day-shortcuts/, '不應再與 .trip-day-picker 共用選擇器');
  assert.match(source, /@media \(max-width: 700px\) \{\s*\.day-shortcuts \{[^}]*flex-wrap: nowrap/s);
  assert.match(source, /\.day-shortcuts a \{[^}]*flex: 1 1 0;[^}]*white-space: nowrap/s);
  assert.match(read('day-05.html'), /<nav class="day-shortcuts" aria-label="當日快速導覽">/);
});

test('第 3 項：手機時間表為精簡版（不顯示欄名、時間大字左欄），長說明由 nav.js 收成兩行', () => {
  const source = css();
  assert.match(source, /\.table-editorial\.table-schedule td\[data-label\]::before \{\s*display: none;\s*content: none;/s);
  assert.match(source, /\.table-editorial\.table-schedule tr \{[^}]*display: grid;[^}]*grid-template-columns: 4\.4rem/s);
  assert.match(source, /\.table-editorial\.table-schedule td:nth-child\(1\) \{[^}]*grid-row: 1 \/ span 2/s);
  assert.match(source, /\.table-schedule \.timeline-note\.is-clamped \{[^}]*-webkit-line-clamp: 2/s);
  const nav = fs.readFileSync(path.resolve('src/scripts/nav.js'), 'utf8');
  assert.match(nav, /clampScheduleNotes/);
  assert.match(nav, /展開全文/);
  // 沒有 JS 時全文仍在 HTML 中，收合只是畫面行為
  const day5 = read('day-05.html');
  const step = days[4].steps.find(item => item.t === '14:15');
  assert.ok(day5.includes(step.sub), 'Day 5 時間表說明全文必須仍在 HTML 中');
});

test('第 4 項：餐廳營業時間依城市分組，查核狀態、日期、來源、菜單收在每家的 details 內', () => {
  const html = read('practical/dining.html');
  const section = between(html, 'id="restaurant-hours"', '<section ');
  assert.doesNotMatch(section, /<table/, '營業時間不應再是 4 欄表格');
  for (const city of new Set(verifiedRestaurantHours.map(item => item.city))) {
    assert.match(section, new RegExp(`<h3>${city}（\\d+ 家）</h3>`), `缺少城市分組：${city}`);
  }
  const items = section.split('<li class="day-food-item hours-item">').slice(1);
  assert.equal(items.length, verifiedRestaurantHours.length);
  for (const item of verifiedRestaurantHours) {
    const card = items.find(chunk => chunk.includes(`>${item.name}</a>`));
    assert.ok(card, `找不到 ${item.name}`);
    const [visible, folded = ''] = card.split('<details>');
    // 查核狀態列與來源連結只能在收合裡（店家筆記本身提到日期不算查核紀錄）
    assert.doesNotMatch(visible, /已核實所列資料|部分核實，仍有缺項|查核來源 ↗|菜單／餐點來源 ↗/, `${item.name} 查核紀錄露在外面`);
    assert.ok(visible.includes(item.hours), `${item.name} 營業時間應直接可見`);
    if (item.checkedAt) {
      assert.ok(folded.includes(item.checkedAt), `${item.name} 查核日期應在 details 內`);
    }
    if (item.verificationNote) assert.ok(folded.includes(item.verificationNote), `${item.name} 查核說明應在 details 內`);
  }
  assert.doesNotMatch(section, /。；/, '不應再出現「。；」連用');
  for (const item of verifiedRestaurantHours) assert.doesNotMatch(item.feature, /。；/);
});

test('第 5 項：待辦頁每類先列未完成（依日期），已完成收進「已完成 N 項」', () => {
  const html = read('practical/todos.html');
  for (const group of todoGroups) {
    const section = between(html, `id="todo-${group.id}"`, '</section>');
    const open = group.items.filter(item => isOpenTodoStatus(item.status));
    const done = group.items.filter(item => !isOpenTodoStatus(item.status));
    if (done.length) {
      assert.match(section, new RegExp(`<details class="todo-done"><summary>已完成 ${done.length} 項</summary>`));
      const doneBlock = section.slice(section.indexOf('class="todo-done"'));
      for (const item of done) assert.ok(doneBlock.includes(item.name), `${item.name} 應在已完成收合內`);
    }
    const openBlock = section.split('class="todo-done"')[0];
    const positions = open.map(item => openBlock.indexOf(`<b class="todo-name">${item.name}</b>`));
    assert.ok(positions.every(pos => pos >= 0), `${group.id} 有未完成項目不在前段`);
    const ordered = [...positions].sort((a, b) => a - b).map(pos => open[positions.indexOf(pos)].date);
    const asNumber = date => { const [m, d] = date.split('/').map(Number); return m * 100 + d; };
    for (let i = 1; i < ordered.length; i++) {
      assert.ok(asNumber(ordered[i - 1]) <= asNumber(ordered[i]), `${group.id} 未完成項目未依日期排序：${ordered.join(', ')}`);
    }
  }
});

test('第 6 項：行程說明不再夾帶查核筆記，資訊移到待辦；今日卡抵達時間未知只寫「發車」', () => {
  const d5 = days[4].steps.find(step => step.t === '11:30');
  assert.doesNotMatch(d5.sub, /85 個名額|2026-09-24/);
  const panorama = todoGroups.flatMap(group => group.items).find(item => item.name.startsWith('拉茨瓦維採全景畫'));
  assert.match(panorama.action, /85 個名額/);
  assert.match(panorama.action, /30 分鐘一場/);
  assert.equal(panorama.checkedAt, '2026-09-24');
  const d4 = days[3].steps.find(step => step.t === '10:00');
  assert.doesNotMatch(d4.sub, /2026-10-06/);
  const wieliczka = todoGroups.flatMap(group => group.items).find(item => item.name === 'Wieliczka 鹽礦英文團');
  assert.match(wieliczka.action, /2026-10-06 官方售票系統查詢時/);
  assert.match(wieliczka.action, /10:00 場當時有名額/);
  const today = read('today.html');
  assert.doesNotMatch(today, /– 待查票面/);
  assert.doesNotMatch(today, /· 待查票面<\/span>/);
});

test('第 7 項：收合標題有 44px 觸控高度與「＋／－」標示', () => {
  const source = css();
  assert.match(source, /\.day-food-item details > summary,[^{]*#daily-meals \.card > details > summary,[^{]*\{[^}]*min-height: 44px/s);
  assert.match(source, /details\[open\] > summary::before[^{]*\{\s*content: "－";/s);
});

test('第 8 項：窄螢幕導航膠囊固定在右上角，不換行；「條件式」改為「先確認」', () => {
  const source = css();
  assert.match(source, /@media \(max-width: 480px\) \{\s*\.day-food-head \{ flex-wrap: nowrap;/);
  const day = read('day-05.html');
  assert.doesNotMatch(day, /· 條件式<\/span>/);
});

test('第 9 項：實用頁手機刊頭縮小、資料聲明收成一行，待辦頁不再連回自己', () => {
  const source = css();
  assert.match(source, /\.journal-practical \.journal-appendix-header::before \{\s*display: none;/);
  const todos = read('practical/todos.html');
  assert.match(todos, /<details class="callout-note practical-disclaimer"><summary>訂票狀態由人工維護，未連線查詢即時庫存。<\/summary>/);
  const notice = between(todos, 'practical-disclaimer', '</details>');
  assert.doesNotMatch(notice, /href="[^"]*todos\.html"/, '待辦頁的聲明不應連回待辦頁本身');
  assert.match(read('practical/booking.html'), /practical-disclaimer[\s\S]*?href="\.\.\/practical\/todos\.html"/);
  assert.match(read('practical/dining.html'), /<details class="callout-note practical-disclaimer"><summary>資料界線/);
  assert.match(read('practical/transit.html'), /<details class="callout-note practical-disclaimer"><summary>2026\/09\/08 複核/);
});

test('第 10 項：今日卡日期切換與 SOS 電話按鈕 44px', () => {
  const source = css();
  assert.match(source, /\.today-compact \.today-date-controls button \{ min-height: 44px;/);
  assert.match(source, /\.today-compact \.today-date-controls \.today-field select \{[^}]*min-height: 44px;/);
  assert.match(source, /\.today-compact \.today-sos-list a\[href\^='tel:'\] \{[^}]*min-height: 44px;/);
  assert.doesNotMatch(source, /\.today-compact[^{]*\{[^}]*min-height: (?:32|40)px/);
});

test('第 11 項：餐飲指南每日三餐卡片之間有間距與色條分隔', () => {
  const source = css();
  assert.match(source, /#daily-meals > \.card \+ \.card,[^{]*\{\s*margin-top: 1\.25rem;/s);
  assert.match(source, /#daily-meals > \.card \{\s*border-top: 4px solid var\(--accent\);/);
});

test('回頂端按鈕：手機版放左下角、在底部快捷列上方，避開靠右的「導航」按鈕', () => {
  const source = css();
  assert.match(source, /@media \(max-width: 700px\) \{[^@]*?\.to-top \{[^}]*right: auto;[^}]*left: 0\.9rem;[^}]*bottom: calc\(max\(0\.75rem, env\(safe-area-inset-bottom\)\) \+ 65px/s);
});

test('回頂端按鈕：與「導航」按鈕重疊時會先收起來', () => {
  const nav = fs.readFileSync('src/scripts/nav.js', 'utf8');
  assert.match(nav, /toTop\.hidden = window\.scrollY < 900 \|\| overlapsNavigateLink\(\)/);
});
