(() => {
  const root = document.querySelector('.journal-database');
  if (!root) return;

  const filterCity = root.querySelector('[data-db-filter-select="city"]');
  const filterCategory = root.querySelector('[data-db-filter-select="category"]');
  const filterStatus = root.querySelector('[data-db-filter-select="status"]');
  const filterPrivacy = root.querySelector('[data-db-filter-select="privacy"]');
  const queryInput = root.querySelector('[data-db-filter-input="query"]');
  const clearButton = root.querySelector('[data-db-clear="filters"]');
  const summary = root.querySelector('[data-db-summary="results"]');
  const quicks = root.querySelectorAll('[data-db-quick]');
  const emptyMessage = root.querySelector('[data-db-empty]');
  const cards = Array.from(root.querySelectorAll('[data-db-card]'));
  const sections = Array.from(root.querySelectorAll('[data-db-section]'));

  if (!cards.length) return;

  function normalize(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/ł/g, 'l')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function hasText(card, needle) {
    if (!needle) return true;
    const bag = card.getAttribute('data-db-query') || '';
    return bag.includes(needle);
  }

  function matchesFilter(card, filters) {
    if (filters.city !== 'all' && card.dataset.dbCity !== filters.city) return false;
    if (filters.category !== 'all' && card.dataset.dbCategory !== filters.category) return false;
    if (filters.status !== 'all' && card.dataset.dbStatus !== filters.status) return false;
    if (filters.privacy !== 'all' && card.dataset.dbPrivacy !== filters.privacy) return false;
    return hasText(card, filters.query);
  }

  function applyFilters() {
    const filters = {
      city: filterCity ? filterCity.value : 'all',
      category: filterCategory ? filterCategory.value : 'all',
      status: filterStatus ? filterStatus.value : 'all',
      privacy: filterPrivacy ? filterPrivacy.value : 'all',
      query: normalize(queryInput ? queryInput.value : ''),
    };
    const filterKeys = ['city', 'category', 'status', 'privacy'];
    let visibleCount = 0;

    cards.forEach(card => {
      const visible = matchesFilter(card, filters);
      card.hidden = !visible;
      card.classList.toggle('database-card-hidden', !visible);
      if (visible) visibleCount += 1;
    });

    sections.forEach(section => {
      const sectionCards = Array.from(section.querySelectorAll('[data-db-card]'));
      const sectionContainer = section.closest('section');
      if (sectionContainer) sectionContainer.hidden = !sectionCards.some(card => !card.hidden);
    });

    if (summary) summary.textContent = `目前 ${visibleCount} / ${cards.length} 筆`;
    if (emptyMessage) emptyMessage.hidden = visibleCount > 0;
    quicks.forEach(quick => {
      const [filterKey, filterValue] = (quick.getAttribute('data-db-quick') || '').split(':');
      const active = !filters.query
        && filters[filterKey] === filterValue
        && filterKeys.every(key => key === filterKey || filters[key] === 'all');
      quick.classList.toggle('is-active', active);
      quick.setAttribute('aria-pressed', String(active));
    });
  }

  function resetFilters() {
    if (filterCity) filterCity.value = 'all';
    if (filterCategory) filterCategory.value = 'all';
    if (filterStatus) filterStatus.value = 'all';
    if (filterPrivacy) filterPrivacy.value = 'all';
    if (queryInput) queryInput.value = '';
  }

  [filterCity, filterCategory, filterStatus, filterPrivacy].forEach(filter => {
    if (filter) filter.addEventListener('change', applyFilters);
  });
  if (queryInput) queryInput.addEventListener('input', applyFilters);
  if (clearButton) {
    clearButton.addEventListener('click', () => {
      resetFilters();
      applyFilters();
    });
  }

  quicks.forEach(quick => {
    quick.addEventListener('click', () => {
      const [filterKey, filterValue] = (quick.getAttribute('data-db-quick') || '').split(':');
      resetFilters();
      if (filterCity && filterKey === 'city') filterCity.value = filterValue || 'all';
      if (filterCategory && filterKey === 'category') filterCategory.value = filterValue || 'all';
      if (filterStatus && filterKey === 'status') filterStatus.value = filterValue || 'all';
      if (filterPrivacy && filterKey === 'privacy') filterPrivacy.value = filterValue || 'all';
      applyFilters();
    });
  });

  applyFilters();
})();
