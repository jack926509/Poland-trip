import test from 'node:test';
import assert from 'node:assert/strict';
import * as dining from '../src/data/dining.js';
import * as cities from '../src/data/cities.js';
import * as trip from '../src/data/trip.js';
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
  assert.equal(branches.length,33);
  assert.equal(new Set(branches.map(x=>x.id)).size,branches.length);
  for (const [city,items] of Object.entries(dining.fastFoodBranches)) {
    const html=renderFastFoodDayList([city],{branches:dining.fastFoodBranches,chains:dining.fastFoodChains,hubs:dining.fastFoodHubs});
    for(const item of items){
      assert.ok(!item.address.includes('／'),item.id);
      assert.ok(decodeURIComponent(item.map).includes(item.address),item.id);
      assert.ok(html.includes(item.note.replaceAll('&','&amp;')),item.id);
      assert.ok(html.includes(item.hours.replaceAll('&','&amp;')),item.id);
    }
    const rows=mergeCityDining(city,dining.cityDining[city],dining.cityFood.find(x=>x.city===({warsaw:'華沙',krakow:'克拉科夫',wroclaw:'樂斯拉夫',poznan:'波茲南'})[city]).items,dining.snacksAndCafes[city],fastFoodDiningEntries({branches:items,chains:dining.fastFoodChains}));
    for(const branch of items)assert.equal(rows.filter(x=>x.placeId===branch.id).length,1);
  }
  for(const hub of dining.fastFoodHubs) for(const id of hub.branchIds){
    const branch=branches.find(x=>x.id===id);
    assert.ok(branch && branch.cityKey===hub.cityKey);
    assert.ok(hub.address.startsWith(branch.address),`${hub.place}: ${id}`);
  }
});

test('餐段引用必須存在；未安排餐段必須明說，不自動假設有空檔', () => {
  for (const day of trip.days) for(const item of dayDining[day.n] || []) {
    const timing=mealTiming(item,day);
    if(item.stepId)assert.ok(day.steps.some(x=>x.id===item.stepId));
    else assert.match(timing,/未排|不採用/);
  }
  for (const meal of dayDining[5].filter(x=>/首選/.test(x.role)))assert.match(mealTiming(meal,trip.days[4]),/候選未排時段/);
  const html=fs.readFileSync(new URL('../dist/today.html',import.meta.url),'utf8');
  assert.ok(html.includes('候選未排時段'));
});

test('順路點心引用與門市導航一致，Wedel 不會混到另一分店',()=>{
  for(const day of trip.days) for(const snack of day.eat || []){
    if(typeof snack==='string')continue;
    assert.ok(snack.placeId);
    assert.equal(snack.map,diningPlaces[snack.placeId].map);
  }
  assert.equal(trip.days[0].eat[0].placeId,'warsaw-wedel-szpitalna-8');
});

test('圖釘覆蓋分母包含每間速食，不漏算新增餐廳',()=>{
  const report=auditDiningPinCoverage();
  const count=Object.keys(dining.cityDining).reduce((sum,city,i)=>sum+mergeCityDining(city,dining.cityDining[city],dining.cityFood[i].items,dining.snacksAndCafes[city],fastFoodDiningEntries({branches:dining.fastFoodBranches[city],chains:dining.fastFoodChains})).length,0);
  assert.equal(report.listed,count);
});
