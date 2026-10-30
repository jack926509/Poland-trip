import test from 'node:test';
import assert from 'node:assert/strict';
import * as dining from '../src/data/dining.js';
import * as cities from '../src/data/cities.js';
import * as trip from '../src/data/trip.js';
import { groceryProducts } from '../src/data/groceries.js';
import { dayDining } from '../src/data/day-dining.js';
import { buildTravelSearchRecords } from '../src/search/site-search-index.mjs';
import { mergeCityDining } from '../src/templates/city-dining.mjs';

test('每日門市可在餐廳分類搜尋，使用相同地址導航', () => {
  const records = buildTravelSearchRecords({...dining, ...cities, ...trip});
  for (const [day, items] of Object.entries(dayDining)) for (const meal of items) {
    const match = records.find(x => x.type === 'restaurant' && x.placeId === meal.placeId);
    assert.ok(meal.placeId && match, `Day ${day} ${meal.name} 缺少門市搜尋`);
    assert.equal(match.mapUrl, meal.map);
  }
});

test('商品搜尋從波蘭品名直達單筆商品，單檔版也保留相同錨點', () => {
  const records = buildTravelSearchRecords({ ...trip, groceryProducts });
  const jezyki = records.find(record => record.title.includes('Jeżyki Classic'));
  assert.ok(jezyki);
  assert.equal(jezyki.href, 'practical/groceries.html#product-24');
  assert.ok(jezyki.searchText.includes('jezyki'));
  const standalone = fs.readFileSync('poland-travel-guide-2026.html', 'utf8');
  assert.ok(standalone.includes('href":"#page-practical-groceries--product-24"'));
});

test('華沙 Wedel 兩個門市的識別及導航不混用', () => {
  const rows = mergeCityDining('warsaw', dining.cityDining.warsaw, dining.cityFood[0].items, dining.snacksAndCafes.warsaw);
  const stores = rows.filter(x => /Wedel/.test(x.name));
  assert.equal(stores.length, 2);
  assert.equal(new Set(stores.map(x => x.placeId)).size, 2);
  assert.ok(stores.some(x => x.address.includes('Szpitalna 8') && x.map.includes('Szpitalna')));
  assert.ok(stores.some(x => x.address.includes('45')));
});

import fs from 'node:fs';
import { diningPlaces } from '../src/data/dining-places.js';
import { dayDiningPlans } from '../src/data/day-dining.js';
import { renderFastFoodDayList, fastFoodDiningEntries } from '../src/templates/fast-food.mjs';
import { mealTiming } from '../src/lib/dining.mjs';
import { auditDiningPinCoverage } from '../tools/audit-map-pins.mjs';

test('每個門市及每日引用均有查核狀態，事實不在每日重複維護', () => {
  for (const place of Object.values(diningPlaces)) {
    assert.ok(place.id && place.cityKey && place.name && place.address && place.hours);
    assert.ok(['verified','partial','pending'].includes(place.verificationStatus));
    if (place.verificationStatus !== 'pending') assert.ok(place.sourceUrl && place.checkedAt, place.id);
  }
  for (const items of Object.values(dayDiningPlans)) for (const item of items) {
    assert.ok(diningPlaces[item.placeId]);
    for (const field of ['address','map','hours','name']) assert.equal(item[field], undefined);
  }
});

test('拆分後每間速食都有單一地址、ID、導航和可見提醒', () => {
  const branches=Object.values(dining.fastFoodBranches).flat();
  assert.equal(branches.length,34); // 2026-10-12 移除查無門市的 Salad Story Avenida；同日新增 Pasibus Nowy Świat（10/29 宵夜備案）
  assert.equal(new Set(branches.map(x=>x.id)).size,branches.length);
  for (const [city,items] of Object.entries(dining.fastFoodBranches)) {
    const html=renderFastFoodDayList([city],{branches:dining.fastFoodBranches,chains:dining.fastFoodChains,hubs:dining.fastFoodHubs});
    for(const item of items){
      assert.ok(!item.address.includes('／'),item.id);
      if(/\/maps\/place\//.test(item.map)){ // 精準 place 連結不含地址字串：改驗店名主要字詞 + 座標落在該城市框內
        const norm=t=>t.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ł/g,'l').toLowerCase();
        const mainWord=norm(item.chain.split(/\s+/)[0]);
        assert.ok(norm(decodeURIComponent(item.map).replace(/\+/g,' ')).includes(mainWord),`${item.id}: place 連結不含店名「${mainWord}」`);
        const m=item.map.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)||item.map.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
        assert.ok(m,`${item.id}: place 連結缺座標`);
        const centers={warsaw:[52.23,21.01],krakow:[50.06,19.94],wroclaw:[51.11,17.03],poznan:[52.41,16.93]};
        const c=centers[item.cityKey];
        assert.ok(c,`${item.id}: 未知 cityKey`);
        assert.ok(Math.abs(+m[1]-c[0])<=0.2&&Math.abs(+m[2]-c[1])<=0.2,`${item.id}: place 座標不在 ${item.cityKey} 範圍`);
      } else assert.ok(decodeURIComponent(item.map).includes(item.address),item.id);
      assert.ok(html.includes(item.note.replaceAll('&','&amp;')),item.id);
      // 2026-10-22 起沒查到的營業時間顯示「出門前看 Google 地圖」，不再顯示「待確認」。
      const shownHours=/待確認/.test(item.hours)?'出門前看 Google 地圖':item.hours;
      assert.ok(html.includes(shownHours.replaceAll('&','&amp;')),item.id);
    }
    const rows=mergeCityDining(city,dining.cityDining[city],dining.cityFood.find(x=>x.city===({warsaw:'華沙',krakow:'克拉科夫',wroclaw:'樂斯拉夫',poznan:'波茲南'})[city]).items,dining.snacksAndCafes[city],fastFoodDiningEntries({branches:items,chains:dining.fastFoodChains}));
    for(const branch of items)assert.equal(rows.filter(x=>x.placeId===branch.id).length,1);
  }
  for(const hub of dining.fastFoodHubs) for(const id of hub.branchIds){
    const branch=branches.find(x=>x.id===id);
    assert.ok(branch && branch.cityKey===hub.cityKey);
    assert.ok(hub.address.startsWith(branch.address.split(',')[0]),`${hub.place}: ${id}`);
  }
});

test('餐段引用必須存在；未安排餐段必須明說，不自動假設有空檔', () => {
  for (const day of trip.days) for(const item of dayDining[day.n] || []) {
    const timing=mealTiming(item,day);
    if(item.stepId)assert.ok(day.steps.some(x=>x.id===item.stepId));
    else assert.match(timing,/未排|不採用/);
  }
  assert.match(mealTiming(dayDining[5].find(x=>x.placeId==='wroclaw-restauracja-wroclawska'),trip.days[4]),/行程預留 12:00/);
  assert.match(mealTiming(dayDining[2].find(x=>x.placeId==='krakow-pimiento-shop-bistro'),trip.days[1]),/未排|不採用/);
  assert.match(mealTiming(dayDining[6].find(x=>x.placeId==='poznan-stary-browar-food-hall'),trip.days[5]),/行程預留 13:00/);
  assert.match(mealTiming(dayDining[6].find(x=>x.placeId==='poznan-pyra-bar'),trip.days[5]),/未排|不採用/); // 10/29 午餐改 Stary Browar Food Hall，Pyra Bar 降為備案
  // 2026-10-20 今日卡改一屏儀表板，完整餐飲（含候選）只在每日頁，這裡改驗每日頁。
  const html=fs.readFileSync(new URL('../dist/day-02.html',import.meta.url),'utf8');
  assert.ok(html.includes('候選未排時段'));
});

test('順路點心引用與門市導航一致，Wedel 不會混到另一分店',()=>{
  for(const day of trip.days) for(const snack of day.eat || []){
    if(typeof snack==='string')continue;
    assert.ok(snack.placeId);
    assert.equal(snack.map,diningPlaces[snack.placeId].map);
  }
  // 10/24 行程去的是總統府旁的 Krakowskie Przedmieście 45 分店（已在 day-dining），Day 1 不再掛 Szpitalna 8 本店。
  assert.ok(!(trip.days[0].eat || []).some(item => item.placeId === 'warsaw-wedel-szpitalna-8'));
});

test('圖釘覆蓋分母包含每間速食，不漏算新增餐廳',()=>{
  const report=auditDiningPinCoverage();
  const count=Object.keys(dining.cityDining).reduce((sum,city,i)=>sum+mergeCityDining(city,dining.cityDining[city],dining.cityFood[i].items,dining.snacksAndCafes[city],fastFoodDiningEntries({branches:dining.fastFoodBranches[city],chains:dining.fastFoodChains})).length,0);
  assert.equal(report.listed,count);
});

test('資料遷移保留每日獨有餐廳的料理資訊與點心查核狀態', () => {
  assert.match(diningPlaces['krakow-hankki'].notes.join(''),/韓日料理/);
  assert.match(diningPlaces['wroclaw-samarqand'].notes.join(''),/烏茲別克／喬治亞料理/);
  const rows=mergeCityDining('wroclaw',dining.cityDining.wroclaw,dining.cityFood[2].items,dining.snacksAndCafes.wroclaw);
  assert.match(rows.find(x=>x.placeId==='wroclaw-samarqand').notes.join(''),/烏茲別克／喬治亞料理/);
  const html=fs.readFileSync(new URL('../dist/day-05.html',import.meta.url),'utf8');
  // 2026-10-20 起不顯示查核狀態
  assert.doesNotMatch(html, /部分核實|已核實所列資料|資料待確認/);
});

test('餐飲類圖釘（star1/star2/bib/food）都帶 placeId，且導航連結與門市主檔一致', () => {
  const diningCategories = new Set(['star1', 'star2', 'bib', 'food']);
  let checked = 0;
  for (const [city, data] of Object.entries(cities.mapPins)) {
    for (const point of data.points) {
      const [, , name, , url, category, , placeId] = point;
      if (!diningCategories.has(category)) continue;
      checked += 1;
      assert.ok(placeId, `${city}／${name} 缺少 placeId`);
      assert.ok(diningPlaces[placeId], `${city}／${name} 的 placeId 找不到門市：${placeId}`);
      assert.equal(url, diningPlaces[placeId].map, `${city}／${name} 的圖釘導航連結與門市主檔不一致`);
    }
  }
  assert.equal(checked, 34);
});

test('「行程餐廳營業時間」表 = 每日餐位中已核實／部分核實的門市集合', () => {
  const expected = new Set();
  for (const items of Object.values(dayDining)) for (const item of items) {
    if (['verified', 'partial'].includes(item.verificationStatus)) expected.add(item.placeId);
  }
  const actual = new Set(dining.verifiedRestaurantHours.map(item => item.placeId));
  assert.deepEqual(actual, expected);
  assert.ok(actual.has('krakow-noah') && actual.has('krakow-pod-aniolami') && actual.has('poznan-pyra-bar') && actual.has('wroclaw-samarqand'));
  assert.ok(actual.has('warsaw-gospoda-pod-zygmuntem'), 'Gospoda 為新版午餐，部分核實時段應列入');
  assert.ok(!actual.has('wieliczka-karczma-gornicza'), 'Karczma Górnicza 仍是 pending，不該出現在已核實表');
});

test('米其林星級名單（star1／star2）每個店名都能對到門市主檔（允許大小寫差異）', () => {
  const names = Object.values(diningPlaces).map(place => place.name.toLowerCase());
  const resolvable = text => names.some(name => name.includes(text.toLowerCase()) || text.toLowerCase().includes(name));
  for (const group of dining.michelinSummary) {
    for (const name of [...group.star2List, ...group.star1List]) {
      assert.ok(resolvable(name), `${group.city} 星級餐廳「${name}」在門市主檔找不到對應`);
    }
  }
});

test('Lajkonik 巴士搜尋摘要逐段配對去回程時刻', () => {
  const records = buildTravelSearchRecords({ ...trip });
  const bus = records.find(record => record.type === 'bus');
  assert.ok(bus);
  assert.match(bus.meta, /08:25（D9） → 09:50／回程 15:30 → 16:55/);
  assert.ok(!bus.meta.includes('15:30 → 09:50'));
});
