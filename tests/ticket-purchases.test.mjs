import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { ticketPurchases, ticketPurchaseGroups, ticketPurchaseById, ticketPurchaseForVenue } from '../src/data/ticket-purchases.js';
import { venues } from '../src/data/venues.js';
import { todoGroups } from '../src/data/trip.js';

const html = fs.readFileSync('dist/practical/tickets.html', 'utf8');
const rowFor = id => html.match(new RegExp(`<tr id="purchase-${id}"[\\s\\S]*?<\\/tr>`))?.[0];

test('克拉科夫各館購票按鈕直達正確分館，不會誤買辛德勒工廠票', () => {
  for (const [id, location] of [
    ['krakow-schindler', '1'],
    ['krakow-rynek-underground', '20'],
    ['krakow-old-synagogue', '2'],
  ]) {
    const url = new URL(ticketPurchaseById(id).purchaseUrl);
    assert.equal(url.searchParams.get('idl'), location);
    assert.ok(rowFor(id).includes(`idl=${location}`));
  }
  const archaeology = ticketPurchaseById('poznan-archaeological-museum');
  assert.equal(archaeology.method, 'online');
  assert.match(rowFor(archaeology.id), /tobilet\.pl\/wystawy-prezentowane-w-muzeum-archeologicznym-w-poznaniu\.html/);
});

test('所有既有票價景點都能從完整購票清單找到入口或售票方式', () => {
  assert.equal(new Set(ticketPurchases.map(item => item.id)).size, ticketPurchases.length);
  assert.deepEqual(ticketPurchaseGroups.map(group => group.cityKey), ['WAW', 'KRK', 'WRO', 'POZ']);
  for (const venue of Object.values(venues).filter(venue => venue.prices)) {
    assert.ok(ticketPurchaseForVenue(venue.id), `漏列既有票價景點：${venue.name}`);
  }
  for (const item of ticketPurchases) {
    assert.equal(new URL(item.sourceUrl).protocol, 'https:');
    if (item.method === 'online') assert.equal(new URL(item.purchaseUrl).protocol, 'https:');
    else assert.equal(item.purchaseUrl, null, `${item.id} 不應偽裝成可線上購票`);
    assert.ok(rowFor(item.id), `${item.id} 未出現在建置頁面`);
  }
});

test('待辦與購票頁共用官方入口，查得售票入口不能把待購改成已訂', () => {
  const todos = todoGroups.find(group => group.id === 'attractions').items;
  assert.equal(todos.length, 7);
  assert.equal(todos.filter(item => item.status === '已訂妥').length, 1);
  for (const item of todos) {
    assert.equal(item.url, ticketPurchaseById(item.ticketPurchaseId).purchaseUrl);
    assert.ok(rowFor(item.ticketPurchaseId).includes(item.status));
  }
  assert.match(rowFor('krakow-auschwitz'), /已訂妥/);
  assert.match(rowFor('krakow-schindler'), /現可查／購/);
  assert.match(rowFor('krakow-wieliczka'), /需查／購/);
  assert.notEqual(ticketPurchaseById('krakow-wawel-cathedral').purchaseUrl, ticketPurchaseById('krakow-wawel-castle').purchaseUrl);
});

test('免費、已含、現場售票與閉館皆提供正確操作，不顯示一般購票按鈕', () => {
  for (const item of ticketPurchases.filter(item => item.method !== 'online')) {
    const row = rowFor(item.id);
    assert.doesNotMatch(row, />官方購票 ↗/);
    assert.match(row, /官方參觀資訊|閉館公告/);
  }
  assert.match(rowFor('warsaw-lazienki-palace'), /本次免費.*週五/s);
  assert.match(rowFor('wroclaw-national-museum'), /已含門票.*不必重買/s);
  assert.match(rowFor('krakow-st-mary-basilica'), /現場購票.*無法預約/s);
  const closed = ticketPurchases.filter(item => item.method === 'closed');
  assert.deepEqual(closed.map(item => item.id).sort(), ['warsaw-chopin-museum', 'poznan-old-town-hall-museum', 'poznan-palmiarnia'].sort());
  for (const item of closed) assert.match(rowFor(item.id), /閉館.*暫不購票/s);
});

test('購票清單也出現在單檔與全站搜尋，城市頁可直接跳到對應分組', () => {
  const standalone = fs.readFileSync('poland-travel-guide-2026.html', 'utf8');
  const index = fs.readFileSync('dist/assets/search-index.json', 'utf8');
  for (const name of ['瓦維爾大教堂', '聖伊莉莎白教堂塔樓', '聖若望大教堂地下墓室']) {
    assert.ok(html.includes(name));
    assert.ok(standalone.includes(name));
    assert.ok(index.includes(name));
  }
  for (const city of ['warszawa', 'krakow', 'wroclaw', 'poznan']) {
    assert.ok(fs.readFileSync(`dist/city-${city}.html`, 'utf8').includes(`practical/tickets.html#tickets-${city}`));
  }
});
