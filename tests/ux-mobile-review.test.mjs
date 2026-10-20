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

test('第 3 項：手機時間表為精簡版（不顯示欄名、時間大字左欄），長說明由 nav.js 收成 3 行（C6，2026-10-15 放寬）', () => {
  const source = css();
  assert.match(source, /\.table-editorial\.table-schedule td\[data-label\]::before \{\s*display: none;\s*content: none;/s);
  // C6（2026-10-13）：時間欄寬 4.4rem → 3.6rem，並新增第三欄放「導航 ↗」；時間格改 display: contents，
  // 讓 <b>時間</b> 與 .step-nav 直接成為 tr 的 grid 項目（時間仍在最左欄、跨兩列）。
  assert.match(source, /\.table-editorial\.table-schedule tr \{[^}]*display: grid;[^}]*grid-template-columns: 3\.6rem auto auto minmax\(0, 1fr\) auto/s);
  assert.match(source, /\.table-editorial\.table-schedule td:nth-child\(1\) \{[^}]*display: contents/s);
  assert.match(source, /\.table-editorial\.table-schedule td:nth-child\(1\) > b \{[^}]*grid-column: 1;[^}]*grid-row: 1 \/ span 2/s);
  assert.match(source, /\.table-editorial\.table-schedule \.step-nav \{[^}]*grid-column: 5;[^}]*grid-row: 2/s);
  // 2026-10-15 手機閱讀加強：C6 的 1 行收合在約 200px 窄欄只看得到十來個字，等於沒有說明。
  // 說明改為橫跨到最右欄、收合放寬到 3 行（多數說明不必展開），「導航」移到下一列與花費、時長並排。
  assert.match(source, /\.table-editorial\.table-schedule td:nth-child\(2\) \{[^}]*grid-column: 2 \/ -1/s);
  assert.match(source, /\.table-schedule \.timeline-note\.is-clamped \{[^}]*-webkit-line-clamp: 3/s);
  const nav = fs.readFileSync(path.resolve('src/scripts/nav.js'), 'utf8');
  assert.match(nav, /clampScheduleNotes/);
  assert.match(nav, /展開全文/);
  // 沒有 JS 時全文仍在 HTML 中，收合只是畫面行為
  const day5 = read('day-05.html');
  const step = days[4].steps.find(item => item.t === '13:55'); // 2026-10-14 新行程：百年廳外觀（長說明）
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
    const [visible] = card.split('<details>');
    // 2026-10-20 起不顯示查核狀態、日期與查核說明
    assert.doesNotMatch(card, /已核實所列資料|部分核實，仍有缺項|查核來源 ↗|查核紀錄/, `${item.name} 不應顯示查核紀錄`);
    assert.ok(visible.includes(item.hours), `${item.name} 營業時間應直接可見`);
    if (item.checkedAt) assert.ok(!card.includes(`· ${item.checkedAt}`), `${item.name} 不應顯示查核日期`);
  }
  assert.doesNotMatch(section, /。；/, '不應再出現「。；」連用');
  for (const item of verifiedRestaurantHours) assert.doesNotMatch(item.feature, /。；/);
});

test('第 5 項：待辦頁每類先列未完成（依日期），已完成收進「已完成 N 項」', () => {
  const html = read('practical/todos.html');
  for (const group of todoGroups) {
    const section = between(html, `id="todo-${group.id}"`, '</section>');
    const open = group.items.filter(item => !item.skip && isOpenTodoStatus(item.status));
    const done = group.items.filter(item => !item.skip && !isOpenTodoStatus(item.status));
    const skipped = group.items.filter(item => item.skip);
    if (skipped.length) {
      assert.match(section, new RegExp(`線上訂不到、不再提醒 ${skipped.length} 項`));
      const skippedBlock = section.slice(section.indexOf('data-todo-skipped'));
      for (const item of skipped) assert.ok(skippedBlock.includes(item.name), `${item.name} 應在不再提醒收合內`);
    }
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
  // 2026-10-14 新行程不進全景畫，原本以全景畫為例；改用 10/29 公寓寄放行李：
  // 行程步驟只寫要做什麼，官網查核日期與內容放在待辦。
  const d6 = days[5].steps.find(step => step.t === '07:00');
  assert.doesNotMatch(d6.sub, /2026-10-14|官網聯絡頁/);
  assert.match(d6.sub, /出發前傳訊息/);
  assert.doesNotMatch(d6.sub, /打電話/, '外國旅客不打電話確認，改用訊息');
  const apartment = todoGroups.flatMap(group => group.items).find(item => item.name.startsWith('傳訊息給 Poznan Apartments'));
  assert.match(apartment.action, /官網聯絡頁沒寫接待時間和行李寄放/);
  assert.doesNotMatch(apartment.action, /20\d\d-\d\d-\d\d/);
  assert.match(apartment.action, /07:00/);
  // 2026-10-13 鹽礦已購 09:00 英文場；查核筆記不放行程說明，購票紀錄在待辦。
  const d4 = days[3].steps.find(step => step.t === '09:00' && step.label.includes('Wieliczka'));
  assert.doesNotMatch(d4.sub, /2026-10-06/);
  const wieliczka = todoGroups.flatMap(group => group.items).find(item => item.name === 'Wieliczka 鹽礦英文團 09:00');
  assert.equal(wieliczka.status, '已購票');
  assert.match(wieliczka.action, /已付款/);
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
  assert.match(todos, /<details class="callout-note practical-disclaimer"><summary>訂票狀態不是即時庫存<\/summary>/);
  const notice = between(todos, 'practical-disclaimer', '</details>');
  assert.doesNotMatch(notice, /href="[^"]*todos\.html"/, '待辦頁的聲明不應連回待辦頁本身');
  // 2026-10-20 起訂票、餐飲、交通頁不再放查核聲明框，第一屏直接是內容
  assert.doesNotMatch(read('practical/booking.html'), /practical-disclaimer/);
  assert.doesNotMatch(read('practical/dining.html'), /practical-disclaimer/);
  assert.doesNotMatch(read('practical/transit.html'), /practical-disclaimer|複核/);
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

test('外國旅客不打電話：行程、餐飲、待辦與 README 不出現打電話或電話訂位的指示，店家卡不放電話鈕', async () => {
  // 2026-10-20 決定：訂位與確認一律走線上、Email、訂房平台訊息或請飯店櫃檯代訂；緊急與住宿電話不在此限。
  const { diningPlaces } = await import('../src/data/dining-places.js');
  const { dayDining } = await import('../src/data/day-dining.js');
  const { cafeGuide } = await import('../src/data/dining.js');
  const texts = [JSON.stringify(days), JSON.stringify(todoGroups), JSON.stringify(dayDining), JSON.stringify(cafeGuide),
    JSON.stringify(Object.values(diningPlaces).map(({ phone, ...rest }) => rest)), fs.readFileSync(new URL('../README.md', import.meta.url), 'utf8')];
  for (const text of texts) assert.doesNotMatch(text, /打電話|電話確認|電話訂|訂位電話|先電話|電話 \+48|打 ?\+48|[（(]\+48|打 ?\d{2} ?\d{3}|打給/);
  for (const file of ['day-02.html', 'day-03.html', 'day-08.html', 'city-krakow.html']) {
    assert.doesNotMatch(read(file), /class="store-action" href="tel:/, `${file} 的店家卡不應有電話鈕`);
  }
});
