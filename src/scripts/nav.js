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

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const openMenu = [...menus].find(menu => menu.open);
    if (!openMenu) return;
    openMenu.open = false;
    openMenu.querySelector('summary')?.focus();
  });
})();
