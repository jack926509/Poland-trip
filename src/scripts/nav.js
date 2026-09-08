(() => {
  const selfScript = document.currentScript;
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

  /**
   * 旅途中最常問的是「今天是第幾天」。日期捷徑用波蘭當地日期標出今天，
   * 並把它捲進可視範圍；不在旅程區間內就什麼都不做。
   */
  const markToday = () => {
    const picker = document.querySelector('.trip-day-picker[data-trip-timezone]');
    if (!picker) return;

    let today;
    try {
      today = new Intl.DateTimeFormat('en-CA', {
        timeZone: picker.dataset.tripTimezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date());
    } catch {
      return;
    }

    const current = picker.querySelector(`a[data-trip-date="${today}"]`);
    if (!current) return;

    current.classList.add('is-today');
    current.setAttribute('aria-current', 'date');
    const badge = document.createElement('em');
    badge.className = 'trip-day-today';
    badge.textContent = '今天';
    current.append(badge);
    current.scrollIntoView({ block: 'nearest', inline: 'center' });
  };

  markToday();

  /**
   * 資料庫等頁面超過 19000px，捲到底沒有回頭路。
   */
  const toTop = document.createElement('button');
  toTop.type = 'button';
  toTop.className = 'to-top';
  toTop.hidden = true;
  toTop.innerHTML = '<span aria-hidden="true">↑</span>回頂端';
  toTop.addEventListener('click', () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    document.querySelector('.skip-link')?.focus({ preventScroll: true });
  });
  document.body.append(toTop);

  let toTopFrame = 0;
  const syncToTop = () => {
    toTopFrame = 0;
    toTop.hidden = window.scrollY < 900;
  };
  window.addEventListener('scroll', () => {
    if (toTopFrame) return;
    toTopFrame = requestAnimationFrame(syncToTop);
  }, { passive: true });
  syncToTop();

  if ('serviceWorker' in navigator && selfScript) {
    navigator.serviceWorker.register(new URL('../sw.js', selfScript.src)).catch(() => {});
  }
})();
