import assert from 'node:assert/strict';
import { test } from 'node:test';

import { selectSearchRecords } from '../src/scripts/site-search.js';

const records = [
  { id: 'page', type: 'page', title: '火車與交通', meta: '實用資料', searchText: '火車 交通 時刻' },
  { id: 'train', type: 'train', title: '華沙 → 克拉科夫', meta: '10/25', searchText: '火車 華沙 克拉科夫 eip' },
  { id: 'exact', type: 'restaurant', title: 'U Fukiera', meta: '華沙', searchText: 'u fukiera 華沙 餐廳' },
  { id: 'city', type: 'city', title: '樂斯拉夫 Wrocław｜城市特色', meta: '千尊小矮人', searchText: '樂斯拉夫 wrocław 城市 小矮人' },
];

test('標題完全命中排在一般關鍵詞命中前', () => {
  const selected = selectSearchRecords(records, { query: 'U Fukiera' });
  assert.deepEqual(selected.map(record => record.id), ['exact']);
});

test('多個關鍵字必須全部命中', () => {
  const selected = selectSearchRecords(records, { query: '華沙 EIP' });
  assert.deepEqual(selected.map(record => record.id), ['train']);
});

test('快捷分類只保留對應類型並限制最多筆數', () => {
  const expanded = Array.from({ length: 12 }, (_, index) => ({
    id: `train-${index}`,
    type: 'train',
    title: `班次 ${index}`,
    meta: '',
    searchText: '火車 班次',
  }));
  const selected = selectSearchRecords([...records, ...expanded], { category: 'train', limit: 8 });

  assert.equal(selected.length, 8);
  assert.ok(selected.every(record => record.type === 'train'));
});
