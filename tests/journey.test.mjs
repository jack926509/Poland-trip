import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { days } from '../src/data/trip.js';
import { nightStay, checkoutStay, bookingProgress } from '../src/lib/journey.mjs';

test('跨城日住宿按入住區間銜接，離境日不再顯示住宿', () => {
  assert.equal(checkoutStay(days[3]).city, '克拉科夫');
  assert.equal(nightStay(days[3]).city, '樂斯拉夫');
  assert.equal(nightStay(days[4]).city, '波茲南');
  assert.equal(nightStay(days[5]).city, '華沙');
  assert.equal(nightStay(days[7]), null);
});
test('已訂導覽不算待辦，但尚未購票的巴士仍待處理', () => {
  const { confirmed, pending } = bookingProgress(days[2]);
  assert.equal(confirmed.length, 1);
  assert.equal(pending.length, 2);
  assert.ok(confirmed[0].includes('Auschwitz'));
  assert.ok(pending.every(item => item.includes('Lajkonik')));
  assert.equal(bookingProgress({mustBook:['尚未購票', '已購票', '未完成']}).pending.length, 2);
});
test('城市回鏈涵蓋晚上抵達日及白天遊覽日', () => {
  const html = fs.readFileSync('dist/city-wroclaw.html', 'utf8');
  const section = html.split('id="city-journey"')[1].split('</section>')[0];
  assert.ok(section.includes('day-04.html'));
  assert.ok(section.includes('day-05.html'));
  assert.ok(!section.includes('day-06.html'));
  assert.ok(html.includes('https://polandtrip.xiehnet.com/city-wroclaw.html'));
});
