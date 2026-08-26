(() => {
  const menus = document.querySelectorAll('.nav-dropdown');

  menus.forEach(menu => {
    menu.addEventListener('toggle', () => {
      if (!menu.open) return;
      menus.forEach(other => {
        if (other !== menu) other.open = false;
      });
    });

    menu.addEventListener('click', event => {
      if (event.target.closest('a')) menu.open = false;
    });
  });

  // 手機首屏留給內容：把常駐搜尋列收成一列入口，沒有 JS 時維持展開
  const search = document.querySelector('details.site-search-shell');
  if (search && typeof window.matchMedia === 'function') {
    const compact = window.matchMedia('(max-width: 700px)');
    const syncSearch = () => {
      if (compact.matches) search.open = false;
    };
    syncSearch();
    compact.addEventListener('change', syncSearch);
  }

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const openMenu = [...menus].find(menu => menu.open);
    if (!openMenu) return;
    openMenu.open = false;
    openMenu.querySelector('summary')?.focus();
  });
})();
