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
})();
