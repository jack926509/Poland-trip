import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { days, todoGroups } from '../src/data/trip.js';
import { isOpenTodoStatus } from '../src/scripts/dashboard.js';
import { nightStay, checkoutStay, bookingProgress, departureIso, isDepartureDay } from '../src/lib/journey.mjs';

test('跨城日住宿按入住區間銜接，離境日不再顯示住宿', () => {
  assert.equal(checkoutStay(days[3]).city, '克拉科夫');
  assert.equal(nightStay(days[3]).city, '樂斯拉夫');
  assert.equal(nightStay(days[4]).city, '波茲南');
  assert.equal(nightStay(days[5]).city, '華沙');
  assert.equal(nightStay(days[7]), null);
});
test('已訂導覽不算待辦，但尚未購票的巴士仍待處理', () => {
  const { confirmed, pending } = bookingProgress(days[2]);
  // 2026-10-13 起 Lajkonik 去程已購（rail）、Auschwitz 導覽已訂妥（attractions）。
  assert.deepEqual(confirmed.map(item => item.groupId).sort(), ['attractions', 'rail']);
  assert.ok(confirmed.some(item => item.name.includes('Auschwitz')));
  assert.ok(confirmed.some(item => item.name.includes('Lajkonik 去程')));
  // Day 3 的待辦＝待辦頁同日的 Lajkonik 回程與 Mr. Jerry 晚餐訂位，不再另抄一份。
  assert.equal(pending.length, 2);
  assert.deepEqual(pending.map(item => item.groupId), ['rail', 'dining']);
  assert.ok(pending[0].name.includes('Lajkonik 回程'));
  assert.ok(pending[1].name.includes('Mr. Jerry'));
});
test('每日待訂數與待辦頁同源：八天加總等於待辦頁未完成數，且每筆待辦都歸到某一天', () => {
  const openTotal = todoGroups.flatMap(group => group.items).filter(item => isOpenTodoStatus(item.status)).length;
  const dayTotal = days.reduce((sum, day) => sum + bookingProgress(day).pending.length, 0);
  assert.equal(dayTotal, openTotal);
  const allTotal = days.reduce((sum, day) => sum + bookingProgress(day).pending.length + bookingProgress(day).confirmed.length, 0);
  assert.equal(allTotal, todoGroups.flatMap(group => group.items).length, '有待辦項目的日期對不到任何行程日');
  // Day 1 曾經顯示「沒有待訂」，其實 Specjały 晚餐尚未訂位。
  assert.ok(bookingProgress(days[0]).pending.some(item => item.name.includes('Specjały')));
  const anchors = days.flatMap(day => [...bookingProgress(day).pending, ...bookingProgress(day).confirmed].map(item => item.anchor));
  assert.equal(new Set(anchors).size, anchors.length, '待辦錨點不可重複');
  const todos = fs.readFileSync('dist/practical/todos.html', 'utf8');
  for (const anchor of anchors) assert.ok(todos.includes(`id="${anchor}"`), `待辦頁缺少錨點 ${anchor}`);
});
test('城市回鏈涵蓋晚上抵達日及白天遊覽日', () => {
  const html = fs.readFileSync('dist/city-wroclaw.html', 'utf8');
  const section = html.split('id="city-journey"')[1].split('</section>')[0];
  assert.ok(section.includes('day-04.html'));
  assert.ok(section.includes('day-05.html'));
  assert.ok(!section.includes('day-06.html'));
  assert.ok(html.includes('https://polandtrip.xiehnet.com/city-wroclaw.html'));
});

test('離境日依回程班機判定，不是「查無住宿就當離境」', () => {
  assert.equal(departureIso(), '2026-10-31');
  assert.equal(isDepartureDay(days[7]), true);
  for (const day of days.slice(0, 7)) assert.equal(isDepartureDay(day), false, `Day ${day.n} 不是離境日`);
  // 現有資料每一天都對得上，所以總覽不該出現缺漏警告；出現就是資料真的掉了。
  const home = fs.readFileSync('dist/index.html', 'utf8');
  assert.ok(!home.includes('住宿資料缺漏'), '總覽出現住宿缺漏警告，請檢查 stay 資料');
  const today = fs.readFileSync('dist/today.html', 'utf8');
  assert.ok(!today.includes('今晚住宿：資料缺漏'));
  // 真正的離境日才顯示機場動線。
  const day8 = today.split('data-today-date="2026-10-31"')[1].split('</article>')[0];
  assert.match(day8.split('data-today-stay')[1].split('</section>')[0], /離境與行李[\s\S]*機上過夜/);
});
