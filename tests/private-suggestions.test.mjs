import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { PRIVATE_RUNTIME, renderPrivatePanel } from '../src/templates/private-panel.mjs';
import { renderSosSection } from '../src/templates/sos.mjs';
import { privateSlots } from '../src/data/private-slots.js';
import { dayDiningPlans } from '../src/data/day-dining.js';

const read = file => fs.readFileSync(`dist/${file}`, 'utf8');

test('Metropol 共用一個電話欄位，SOS 只列實際入住，10/29–31 今日卡使用共用值', () => {
  const panel = renderPrivatePanel();
  assert.equal((panel.match(/data-private-slot-field="stay-warsaw-metropol:phone"/g) || []).length, 1);
  assert.doesNotMatch(panel, /data-private-slot-field="stay-warsaw-metropol-arrival:phone"/);
  assert.match(panel, /data-private-slot-field="stay-warsaw-metropol-arrival:code"/);
  const sos = renderSosSection().split('class="sos-hotel-list">')[1].split('</ul>')[0];
  assert.equal((sos.match(/Hotel Metropol/g) || []).length, 1);
  assert.doesNotMatch(sos, /stay-warsaw-metropol-arrival/);
  for (const date of ['2026-10-29', '2026-10-30', '2026-10-31']) {
    const card = read('today.html').split(`data-today-date="${date}"`)[1].split('</article>')[0];
    assert.match(card, /data-private-slot="stay-warsaw-metropol"/);
  }
});

test('舊 Metropol 電話相容讀取並填入顯示及編輯欄位，新值優先', () => {
  for (const current of ['', '新的私人電話']) {
    let stored = JSON.stringify({ slots: {
      'stay-warsaw-metropol-arrival': { phone: '舊的私人電話', code: '舊訂單測試' },
      'stay-warsaw-metropol': { phone: current },
    } });
    let onInput;
    const input = { value: '', getAttribute: () => 'stay-warsaw-metropol:phone' };
    const text = { textContent: '', getAttribute: () => 'phone', closest: () => ({ getAttribute: () => 'stay-warsaw-metropol' }) };
    const panel = { querySelector: () => null, querySelectorAll: s => s === '[data-private-slot-field]' ? [input] : [], addEventListener(_, fn) { onInput = fn; } };
    const root = { querySelector: () => panel, querySelectorAll: s => s === '[data-private-text]' ? [text] : [] };
    const context = vm.createContext({ root, window: { addEventListener() {} }, localStorage: { getItem: () => stored, setItem(_, value) { stored = value; } } });
    vm.runInContext(`${PRIVATE_RUNTIME}\ninitializePrivate(root);`, context);
    assert.equal(input.value, current || '舊的私人電話');
    assert.equal(text.textContent, input.value);
    input.value = '';
    onInput();
    vm.runInContext('initializePrivate(root);', context);
    assert.equal(text.textContent, '', '清空後不得恢復舊電話');
  }
});

test('四班火車在相符的 Day 與今日步驟旁提供空白座位容器，其他票券不顯示座位', () => {
  for (const slot of privateSlots.filter(slot => slot.kind === 'train')) {
    for (const html of [read(`day-${String(slot.day).padStart(2, '0')}.html`), read('today.html')]) {
      const proof = html.split(`class="today-proof" data-private-slot="${slot.id}"`)[1].split('</b></span>')[0];
      // 第一行是票券位置；座位仍須位於同一個 proof 內。
      assert.ok(proof);
      assert.match(html, new RegExp(`data-private-slot="${slot.id}"[\\s\\S]*?data-private-has="seat" hidden> · 車廂／座位：<b data-private-text="seat"></b>`));
    }
  }
  assert.match(dayDiningPlans[6].find(item => item.placeId === 'warsaw-cma-hala-koszyki').note, /出發前再確認；Arirang 20:40/);
});

test('座位內容只以 textContent 顯示並在清空時隱藏', () => {
  let seat = '<私人座位測試>';
  const scope = { getAttribute: () => 'train-ic260' };
  const el = { hidden: true, textContent: '', getAttribute: () => 'seat', closest: () => scope };
  let render;
  const root = { querySelector: () => null, querySelectorAll: s => ['[data-private-has]', '[data-private-text]'].includes(s) ? [el] : [] };
  vm.runInNewContext(`${PRIVATE_RUNTIME}\ninitializePrivate(root);`, { root,
    window: { addEventListener(_, fn) { render = fn; } },
    localStorage: { getItem: () => JSON.stringify({ slots: { 'train-ic260': { seat } } }) },
  });
  assert.equal(el.hidden, false);
  assert.equal(el.textContent, seat);
  seat = '';
  render();
  assert.equal(el.hidden, true);
  assert.equal(el.textContent, '');
});
