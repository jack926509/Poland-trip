import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { days, stay } from '../src/data/trip.js';
import { dayDiningPlans } from '../src/data/day-dining.js';
import { diningPlaces } from '../src/data/dining-places.js';
import { privateSlots } from '../src/data/private-slots.js';
import { PRIVATE_RUNTIME, renderPrivatePanel } from '../src/templates/private-panel.mjs';

const filesUnder = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(dir, entry.name);
  return entry.isDirectory() ? filesUnder(file) : [file];
});
const standalone = 'poland-travel-guide-2026.html';
const outputs = [...filesUnder('dist'), standalone];

test('建置與單檔沒有住宿電話、車廂座位、已移除餐廳；官方緊急電話保留', () => {
  const phoneForms = ['+48 22 32 53 100', '+48 12 355 29 50', '+48 71 796 62 00', '+48 531 000 209'];
  for (const file of outputs) {
    const text = fs.readFileSync(file, 'utf8');
    for (const number of phoneForms) {
      assert.ok(!text.includes(number), `${file}: formatted stay phone`);
      assert.ok(!text.includes(number.replace(/\D/g, '')), `${file}: digits-only stay phone`);
    }
    assert.doesNotMatch(text, /24、26 號|第 1 車|第\s*\d+\s*車[，,、]\s*\d+/, file);
    assert.doesNotMatch(text, /rusiko/i, file);
  }
  for (const file of filesUnder('src/data')) {
    assert.doesNotMatch(fs.readFileSync(file, 'utf8'), /24、26 號|第 1 車|第\s*\d+\s*車[，,、]\s*\d+/, file);
  }
  for (const file of ['dist/practical/essentials.html', standalone]) {
    const text = fs.readFileSync(file, 'utf8');
    for (const number of ['112', '999', '+48222130060', '+48668027574', '+886800085095']) {
      assert.ok(text.includes(`href="tel:${number}"`), `${file}: emergency ${number}`);
    }
  }
});

test('Karma 未排入任何一天，Day 3 保留指定回程休息說明', () => {
  for (const day of days) assert.doesNotMatch(JSON.stringify(day), /karma/i);
  assert.doesNotMatch(fs.readFileSync('dist/day-03.html', 'utf8'), /karma/i);
  assert.equal(days.find(day => day.n === 3).steps.find(step => step.label === '抵 Kraków MDA · 休息').sub,
    'ul. Bosacka 18 Dworzec Autobusowy；步行回 ibis 放東西、休息。途中在 Lajkonik 麵包店（麵包店，不是巴士公司）買明早麵包，20:00 關門。約 17:35 由 ibis 出發，步行到 Jagiellońska 5 的 Mr. Jerry（18:00 已訂位），出門前用地圖確認步行時間。');
  assert.ok(diningPlaces['krakow-karma-coffee-roasters']);
});

test('私人住宿電話與座位欄位空白輸出，填寫後僅從 localStorage 顯示連結', () => {
  const panelHtml = renderPrivatePanel();
  for (const item of stay) assert.ok(panelHtml.includes(`data-private-slot-field="stay-${item.id}:phone"`));
  for (const slot of privateSlots.filter(slot => slot.kind === 'train')) {
    assert.ok(panelHtml.includes(`data-private-slot-field="${slot.id}:seat"`));
  }
  assert.doesNotMatch(panelHtml, /\bvalue=/);
  const slotId = `stay-${stay[1].id}`;
  let stored = '{}';
  const scope = { getAttribute: () => slotId };
  const element = key => ({ hidden: true, textContent: '', attrs: {},
    getAttribute: () => key, closest: () => scope,
    setAttribute(k, v) { this.attrs[k] = v; }, removeAttribute(k) { delete this.attrs[k]; } });
  const phone = element('phone');
  const missing = element('phone');
  const input = { value: '', getAttribute: () => `${slotId}:phone` };
  const seatInput = { value: '', getAttribute: () => 'train-eip5300:seat' };
  let onInput;
  const panel = { querySelector: () => null,
    querySelectorAll: selector => selector === '[data-private-slot-field]' ? [input, seatInput] : [],
    addEventListener(_, fn) { onInput = fn; } };
  const root = { querySelector: () => panel, querySelectorAll: selector => ({
    '[data-private-has]': [phone], '[data-private-missing]': [missing], '[data-private-tel]': [phone],
  })[selector] || [] };
  const context = vm.createContext({ root,
    window: { addEventListener() {}, dispatchEvent() {} },
    localStorage: { getItem: () => stored, setItem(_, value) { stored = value; } } });
  vm.runInContext(`${PRIVATE_RUNTIME}\ninitializePrivate(root);`, context);
  assert.equal(phone.hidden, true);
  assert.equal(phone.attrs.href, undefined);
  input.value = '+48 000 000 000';
  seatInput.value = '私人測試座位';
  onInput();
  assert.equal(phone.hidden, false);
  assert.equal(missing.hidden, true);
  assert.equal(phone.attrs.href, 'tel:+48000000000');
  assert.equal(JSON.parse(stored).slots['train-eip5300'].seat, '私人測試座位');
  assert.ok(!panelHtml.includes(input.value));
});

test('Arirang 的 20:40 為行程切換點，Pasibus 自己的 21:30 到店提醒保留', () => {
  const arirang = diningPlaces['warsaw-arirang-restaurant'];
  assert.equal(arirang.sourceUrl, 'https://gdziezjescwarszawa.com/miejsca/arirang-nowogrodzka-38/');
  assert.equal(arirang.checkedAt, '2026-10-23');
  assert.equal(arirang.verificationNote, 'Google 地圖資料轉載目錄（gdziezjescwarszawa、menuradar，2026-10-23 查）列週四 12:00–22:00、週二公休；無店家官網，最後點餐時間查不到，出發前再確認。');
  const plan = dayDiningPlans[6].find(item => item.placeId === arirang.id);
  for (const text of [plan.note, plan.condition]) {
    assert.match(text, /出發前再確認/);
    assert.match(text, /20:40 前還沒能入座就改 Złote Tarasy 或 Ćma/);
  }
  assert.match(dayDiningPlans[6].find(item => item.placeId === 'warsaw-cma-hala-koszyki').note, /Arirang 20:40 前不能入座/);
  assert.match(dayDiningPlans[6].find(item => /pasibus/.test(item.placeId) && /Złote Tarasy/.test(item.note)).note, /最晚 21:30 前要到店/);
  assert.doesNotMatch(JSON.stringify(arirang), /電話確認|致電|請飯店|櫃檯確認/);
});
