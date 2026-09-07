(() => {
  const menus = document.querySelectorAll('.nav-dropdown');
  const nav = document.querySelector('.nav');
  const backdrop = document.createElement('button');

  backdrop.type = 'button';
  backdrop.className = 'nav-backdrop';
  backdrop.setAttribute('aria-label', '關閉導覽');
  backdrop.tabIndex = -1;
  backdrop.hidden = true;
  document.body.append(backdrop);

  const getOpenMenu = () => [...menus].find(menu => menu.open);
  const syncBackdrop = () => {
    backdrop.hidden = !getOpenMenu();
  };

  const closeMenu = (menu, restoreFocus = false) => {
    if (!menu) return;
    menu.open = false;
    syncBackdrop();
    if (restoreFocus) menu.querySelector('summary')?.focus();
  };

  menus.forEach(menu => {
    menu.addEventListener('toggle', () => {
      if (menu.open) {
        menus.forEach(other => {
          if (other !== menu) other.open = false;
        });
      }
      syncBackdrop();
    });

    menu.addEventListener('click', event => {
      if (event.target.closest('a')) closeMenu(menu);
    });

    menu.addEventListener('focusout', () => {
      setTimeout(() => {
        if (menu.open && !menu.contains(document.activeElement)) closeMenu(menu);
      }, 0);
    });
  });

  backdrop.addEventListener('pointerdown', event => {
    event.preventDefault();
    closeMenu(getOpenMenu(), true);
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    closeMenu(getOpenMenu(), true);
  });

  document.querySelectorAll('figure img').forEach(image => {
    const markUnavailable = () => image.closest('figure')?.classList.add('media-unavailable');
    image.addEventListener('error', markUnavailable, { once: true });
    if (image.complete && image.naturalWidth === 0) markUnavailable();
  });

  const markUnavailableMaps = () => {
    document.querySelectorAll('.map-container').forEach(map => {
      if (map.querySelector('.leaflet-pane')) return;
      map.classList.add('is-map-unavailable');
      map.setAttribute('role', 'status');
      map.textContent = '互動地圖目前無法載入，請改用下方景點清單與 Google Maps 連結。';
    });
  };

  if (document.readyState === 'complete') {
    markUnavailableMaps();
  } else {
    window.addEventListener('load', markUnavailableMaps, { once: true });
  }
})();
