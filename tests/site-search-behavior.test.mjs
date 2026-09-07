import assert from 'node:assert/strict';
import { test } from 'node:test';

import { initializeSiteSearch, selectSearchRecords } from '../src/scripts/site-search.js';

class FakeElement {
  constructor(tagName = 'div') {
    this.tagName = tagName;
    this.attributes = new Map();
    this.children = [];
    this.dataset = {};
    this.focusCount = 0;
    this.hidden = false;
    this.listeners = new Map();
    this.textContent = '';
    this.value = '';
  }

  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) || [];
    listeners.push(listener);
    this.listeners.set(type, listeners);
  }

  append(...children) {
    this.children.push(...children);
  }

  dispatch(type, overrides = {}) {
    const event = {
      altKey: false,
      button: 0,
      ctrlKey: false,
      defaultPrevented: false,
      metaKey: false,
      shiftKey: false,
      preventDefault() {
        this.defaultPrevented = true;
      },
      ...overrides,
    };
    for (const listener of this.listeners.get(type) || []) listener(event);
    return event;
  }

  focus() {
    this.focusCount += 1;
  }

  replaceChildren(...children) {
    this.children = children;
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }
}

function withSearchFixture(records, callback) {
  const previousDocument = globalThis.document;
  globalThis.document = {
    createElement: tagName => new FakeElement(tagName),
  };

  try {
    const root = new FakeElement();
    const input = new FakeElement('input');
    const index = new FakeElement('script');
    const results = new FakeElement('ul');
    const summary = new FakeElement('p');
    const empty = new FakeElement('p');
    const clear = new FakeElement('button');
    const reset = new FakeElement('button');
    const category = new FakeElement('button');
    category.dataset.searchCategory = 'page';
    index.textContent = JSON.stringify(records);

    const selectors = new Map([
      ['input[type="search"]', input],
      ['[data-site-search-index]', index],
      ['[data-search-results]', results],
      ['[data-search-summary]', summary],
      ['[data-search-empty]', empty],
      ['[data-search-clear]', clear],
      ['[data-search-reset]', reset],
    ]);
    root.querySelector = selector => selectors.get(selector) || null;
    root.querySelectorAll = selector => selector === '[data-search-category]' ? [category] : [];

    initializeSiteSearch(root);
    callback({ input, results, summary, clear, category });
  } finally {
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
  }
}

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

test('多詞標題命中排在只命中一般關鍵詞的結果前', () => {
  const selected = selectSearchRecords([
    { id: 'generic', type: 'page', title: '交通總覽', meta: '', searchText: '華沙 克拉科夫 火車' },
    { id: 'route', type: 'train', title: '華沙 → 克拉科夫', meta: '', searchText: '華沙 克拉科夫 火車' },
  ], { query: '華沙 克拉科夫' });

  assert.deepEqual(selected.map(record => record.id), ['route', 'generic']);
});

test('沒有輸入波蘭文變音符號仍能找到城市', () => {
  const selected = selectSearchRecords(records, { query: 'Wroclaw' });
  assert.deepEqual(selected.map(record => record.id), ['city']);
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

test('同頁 hash 搜尋結果點擊後清空 query、快捷分類與結果且不移動焦點', () => {
  withSearchFixture([
    {
      id: 'etias-overview',
      type: 'page',
      typeLabel: '實用資料',
      title: 'ETIAS 入境提醒',
      meta: '行前準備',
      searchText: 'etias 入境提醒',
      href: '#page-practical-essentials',
    },
    {
      id: 'etias-checklist',
      type: 'page',
      typeLabel: '實用資料',
      title: 'ETIAS 檢查清單',
      meta: '行前準備',
      searchText: 'etias 檢查清單',
      href: '#page-practical-essentials--etias',
    },
  ], ({ input, results, summary, clear, category }) => {
    input.value = 'ETIAS';
    input.dispatch('input');
    category.dispatch('click');

    assert.equal(results.children.length, 2);
    assert.equal(category.getAttribute('aria-pressed'), 'true');
    const resultLink = results.children[0].children[0];
    assert.equal(resultLink.href, '#page-practical-essentials');

    resultLink.dispatch('click');

    assert.equal(input.value, '');
    assert.equal(input.focusCount, 0);
    assert.equal(category.getAttribute('aria-pressed'), 'false');
    assert.equal(results.hidden, true);
    assert.equal(results.children.length, 0);
    assert.equal(summary.textContent, '');
    assert.equal(clear.hidden, true);
  });
});

test('一般跨頁搜尋結果點擊仍保留目前搜尋狀態交由瀏覽器導覽', () => {
  withSearchFixture([{
    id: 'etias-page',
    type: 'page',
    typeLabel: '實用資料',
    title: 'ETIAS 入境提醒',
    meta: '行前準備',
    searchText: 'etias 入境提醒',
    href: 'practical/essentials.html#etias',
  }], ({ input, results, summary, category }) => {
    input.value = 'ETIAS';
    input.dispatch('input');
    category.dispatch('click');

    const resultLink = results.children[0].children[0];
    assert.equal(resultLink.href, 'practical/essentials.html#etias');
    resultLink.dispatch('click');

    assert.equal(input.value, 'ETIAS');
    assert.equal(input.focusCount, 0);
    assert.equal(category.getAttribute('aria-pressed'), 'true');
    assert.equal(results.hidden, false);
    assert.equal(results.children.length, 1);
    assert.equal(summary.textContent, '顯示 1 筆相符資料');
  });
});
