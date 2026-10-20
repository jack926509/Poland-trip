// 2026-10-13 UX 審查 C3（每日頁重排＋快捷列＋換日）、C4（實用資訊分組）、C6（手機時間軸）。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { days } from '../src/data/trip.js';
import { dayMeals } from '../src/data/day-dining.js';
import { PRACTICAL_NAV_GROUPS, PRACTICAL_LINKS, TRIP_DATE_RANGE } from '../src/lib/routes.mjs';

const distDir = path.resolve('dist');
const read = relativePath => fs.readFileSync(path.join(distDir, relativePath), 'utf8');
const css = () => fs.readFileSync(path.join(distDir, 'assets/main.css'), 'utf8');
const standalone = () => fs.readFileSync(path.resolve('poland-travel-guide-2026.html'), 'utf8');
const dayFile = n => `day-${String(n).padStart(2, '0')}.html`;

test('C3：快捷列為「時間表／吃哪／地址／交通／地圖」，每顆都指向頁內真實存在的錨點', () => {
  for (const day of days) {
    const html = read(dayFile(day.n));
    const nav = html.match(/<nav class="day-shortcuts"[\s\S]*?<\/nav>/)?.[0];
    assert.ok(nav, `Day ${day.n} 缺快捷列`);
    const links = [...nav.matchAll(/<a href="#([^"]+)">([^<]+)<\/a>/g)];
    assert.deepEqual(links.map(match => match[2]), ['時間表', '吃哪', '地圖', '地址', '交通'], `Day ${day.n} 快捷列文字`);
    // 2026-10-20 UX 檢視：快捷列順序跟頁面區塊順序一致（地圖與地址交通移到餐飲之後）
    const positions = links.map(([, id]) => html.indexOf(`id="${id}"`));
    assert.deepEqual(positions, [...positions].sort((a, b) => a - b), `Day ${day.n} 快捷列順序要與頁面一致`);
    for (const [, id] of links) {
      assert.ok(html.includes(`id="${id}"`), `Day ${day.n} 快捷列 #${id} 沒有對應錨點`);
    }
  }
});

test('C3：「當日餐飲」在「訂票與提醒」之前，且緊接在時間表之後', () => {
  for (const day of days) {
    const html = read(dayFile(day.n));
    const schedule = html.indexOf('id="schedule"');
    const food = html.indexOf('id="day-food"');
    const preparation = html.indexOf('id="day-preparation"');
    assert.ok(schedule > 0 && food > schedule && preparation > food, `Day ${day.n} 區塊順序不對`);
    assert.equal((html.match(/id="day-food"/g) || []).length, 1, `Day ${day.n} 的 day-food 應只出現一次`);
  }
});

test('C3：頁首換日按鈕——Day 1 只有後一天、最後一天只有前一天、中間兩邊都有', () => {
  const switchOf = n => read(dayFile(n)).match(/<nav class="day-switch"[\s\S]*?<\/nav>/)?.[0] || '';
  const hrefs = n => [...switchOf(n).matchAll(/href="([^"]+)"/g)].map(match => match[1]);
  const last = days[days.length - 1].n;
  assert.deepEqual(hrefs(1), [dayFile(2)]);
  assert.deepEqual(hrefs(last), [dayFile(last - 1)]);
  assert.deepEqual(hrefs(2), [dayFile(1), dayFile(3)]);
  // 位置：今晚住宿區（journey-context）之後、快捷列之前
  const html = read(dayFile(2));
  assert.ok(html.indexOf('class="journey-context"') < html.indexOf('class="day-switch"'));
  assert.ok(html.indexOf('class="day-switch"') < html.indexOf('class="day-shortcuts"'));
});

test('C3：時間表的餐次列連到同頁餐廳卡，連結目標都存在；沒有餐廳卡的列不加連結', () => {
  for (const day of days) {
    const html = read(dayFile(day.n));
    const mealStepIds = new Set((dayMeals[day.n] || []).map(item => item.stepId));
    const linked = [...html.matchAll(/<a class="step-meal-link" href="#(meal-[^"]+)">/g)].map(match => match[1]);
    assert.deepEqual(new Set(linked), new Set([...mealStepIds].map(id => `meal-${id}`)), `Day ${day.n} 時間表餐廳連結與三餐不一致`);
    for (const id of linked) assert.ok(html.includes(`<li class="day-food-item" id="${id}"`), `Day ${day.n} 找不到餐廳卡 #${id}`);
  }
});

test('C4：實用資訊下拉分「出發前／旅途中／購物」三組，組內頁面與順序照規格，7 頁不多不少', () => {
  const labelsOf = group => group.pages.map(([, label]) => label);
  assert.deepEqual(PRACTICAL_NAV_GROUPS.map(group => group.label), ['出發前', '旅途中', '購物']);
  assert.deepEqual(labelsOf(PRACTICAL_NAV_GROUPS[0]), ['待辦事項', '訂票與交通']);
  assert.deepEqual(labelsOf(PRACTICAL_NAV_GROUPS[1]), ['餐廳與速食', '市內交通', '安全與基本須知']);
  assert.deepEqual(labelsOf(PRACTICAL_NAV_GROUPS[2]), ['伴手禮與購物', '超市與便利商店']);
  assert.deepEqual(PRACTICAL_NAV_GROUPS.flatMap(group => group.pages.map(([file]) => file)).sort(), PRACTICAL_LINKS.map(([file]) => file).sort());

  const home = read('index.html');
  const section = home.match(/<summary[^>]*>實用資訊<\/summary>([\s\S]*?)<\/details>/)?.[1] || '';
  for (const group of PRACTICAL_NAV_GROUPS) {
    assert.match(section, new RegExp(`data-nav-group="${group.key}"><p>${group.label}</p>`), `多頁版缺小標：${group.label}`);
  }
  assert.match(section, /安全與基本須知 <small>含 SOS<\/small>/);
});

test('C4：單檔版實用資訊分三組、安全須知標「含 SOS」，旅程期間由 inline script 把旅途中排第一', () => {
  const html = standalone();
  const panel = html.match(/data-group="practical">[\s\S]*?<\/details>/)?.[0] || '';
  for (const label of ['出發前', '旅途中', '購物']) assert.ok(panel.includes(`standalone-menu-group-label">${label}<`), `單檔版缺小標：${label}`);
  assert.match(panel, /安全須知 <small>含 SOS<\/small>/);
  assert.ok(html.includes('reorderPracticalGroups'));
  assert.ok(html.includes(JSON.stringify(TRIP_DATE_RANGE)));
});

test('C4：nav.js 的旅程日期區間與 routes.mjs 的 TRIP_DATE_RANGE 一致，並以 Europe/Warsaw 判斷', () => {
  const nav = fs.readFileSync(path.resolve('src/scripts/nav.js'), 'utf8');
  assert.ok(nav.includes(`today < '${TRIP_DATE_RANGE.start}' || today > '${TRIP_DATE_RANGE.end}'`));
  assert.ok(nav.includes(`timeZone: '${TRIP_DATE_RANGE.timeZone}'`));
  assert.match(nav, /list\.insertBefore\(trip, firstGroup\)/);
});

test('C6：手機時間表為時間軸（時間左欄、導航右欄），不再用「時間／行程」標籤卡，且 44px 與回頂端避讓邏輯仍在', () => {
  const source = css();
  assert.match(source, /\.table-editorial\.table-schedule td\[data-label\]::before \{\s*display: none;\s*content: none;/s);
  assert.match(source, /\.table-editorial\.table-schedule \.step-nav \{[^}]*grid-column: 5/s);
  assert.match(source, /\.step-nav \{[^}]*min-height: 44px/s);
  const nav = fs.readFileSync(path.resolve('src/scripts/nav.js'), 'utf8');
  assert.match(nav, /toTop\.hidden = window\.scrollY < 900 \|\| overlapsNavigateLink\(\)/);
  // 2026-10-20 今日卡不再放全天時間表（改連每日頁 #schedule），不再驗今日卡內的時間表版式。
  assert.doesNotMatch(read('today.html'), /<table class="table-editorial table-today-steps">/);
});
