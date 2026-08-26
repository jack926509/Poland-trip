export function normalizeSearchValue(value) {
  return String(value || '')
    .normalize('NFKC')
    .toLocaleLowerCase('zh-Hant')
    .replace(/\s+/g, ' ')
    .trim();
}

function recordScore(record, query) {
  if (!query) return 5;
  const title = normalizeSearchValue(record.title);
  const meta = normalizeSearchValue(record.meta);
  const bag = normalizeSearchValue(record.searchText);
  const tokens = query.split(' ').filter(Boolean);
  if (!tokens.every(token => bag.includes(token))) return Number.POSITIVE_INFINITY;
  if (title === query) return 0;
  if (title.startsWith(query)) return 1;
  if (title.includes(query)) return 2;
  if (meta.includes(query)) return 3;
  return 4;
}

export function selectSearchRecords(records, { query = '', category = '', limit = 8 } = {}) {
  const normalizedQuery = normalizeSearchValue(query);
  return records
    .filter(record => !category || record.type === category)
    .map((record, index) => ({ record, index, score: recordScore(record, normalizedQuery) }))
    .filter(item => Number.isFinite(item.score))
    .sort((a, b) => a.score - b.score || a.index - b.index)
    .slice(0, limit)
    .map(item => item.record);
}

function createTextElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    element.textContent = text || '';
    return element;
  }

function initialize(root) {
    const input = root.querySelector('input[type="search"]');
    const indexElement = root.querySelector('[data-site-search-index]');
    const resultsElement = root.querySelector('[data-search-results]');
    const summaryElement = root.querySelector('[data-search-summary]');
    const emptyElement = root.querySelector('[data-search-empty]');
    const clearButton = root.querySelector('[data-search-clear]');
    const resetButton = root.querySelector('[data-search-reset]');
    const categoryButtons = Array.from(root.querySelectorAll('[data-search-category]'));
    if (!input || !indexElement || !resultsElement || !summaryElement || !emptyElement) return;

    let records = [];
    try {
      const parsed = JSON.parse(indexElement.textContent || '[]');
      records = Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      summaryElement.textContent = '搜尋資料無法載入。';
      return;
    }

    const pathPrefix = root.dataset.searchPathPrefix || '';
    let activeCategory = '';

    function localHref(href) {
      if (/^(?:[a-z]+:|\/\/|#)/i.test(href)) return href;
      return `${pathPrefix}${href}`;
    }

    function renderResult(record) {
      const item = document.createElement('li');
      item.className = 'site-search-result';

      const mainLink = document.createElement('a');
      mainLink.className = 'site-search-result-main';
      mainLink.href = localHref(record.href || 'index.html');
      mainLink.append(createTextElement('span', 'site-search-result-type', record.typeLabel));

      const copy = document.createElement('span');
      copy.className = 'site-search-result-copy';
      copy.append(createTextElement('strong', '', record.title));
      if (record.meta) copy.append(createTextElement('small', '', record.meta));
      if (record.summary) copy.append(createTextElement('span', '', record.summary));
      mainLink.append(copy);
      item.append(mainLink);

      if (record.mapUrl) {
        const mapLink = document.createElement('a');
        mapLink.className = 'site-search-map-link';
        mapLink.href = record.mapUrl;
        mapLink.target = '_blank';
        mapLink.rel = 'noopener';
        mapLink.setAttribute('aria-label', `在 Google Maps 開啟 ${record.title}`);
        mapLink.textContent = '開啟地圖 ↗';
        item.append(mapLink);
      }
      return item;
    }

    function render() {
      const query = normalizeSearchValue(input.value);
      const isActive = Boolean(query || activeCategory);
      clearButton.hidden = !isActive;
      input.setAttribute('aria-expanded', String(isActive));
      categoryButtons.forEach(button => {
        button.setAttribute('aria-pressed', String(button.dataset.searchCategory === activeCategory));
      });

      resultsElement.replaceChildren();
      if (!isActive) {
        resultsElement.hidden = true;
        emptyElement.hidden = true;
        summaryElement.textContent = '';
        return;
      }

      const results = selectSearchRecords(records, {
        query,
        category: activeCategory,
        limit: 8,
      });
      resultsElement.hidden = results.length === 0;
      emptyElement.hidden = results.length !== 0;
      summaryElement.textContent = results.length
        ? `顯示 ${results.length} 筆相符資料`
        : '找不到相符資料';
      resultsElement.append(...results.map(renderResult));
    }

    function reset() {
      input.value = '';
      activeCategory = '';
      render();
    }

    input.addEventListener('input', render);
    input.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      reset();
      input.blur();
    });
    clearButton?.addEventListener('click', () => {
      reset();
      input.focus();
    });
    resetButton?.addEventListener('click', () => {
      reset();
      input.focus();
    });
    categoryButtons.forEach(button => {
      button.addEventListener('click', () => {
        const category = button.dataset.searchCategory || '';
        activeCategory = activeCategory === category ? '' : category;
        render();
      });
    });
  }

if (typeof document !== 'undefined') {
  Array.from(document.querySelectorAll('[data-site-search]')).forEach(initialize);
}
