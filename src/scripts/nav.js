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
   * 「實用資訊」下拉分三組（出發前／旅途中／購物）。旅程期間（華沙日期落在
   * 2026-10-24～2026-10-31）把「旅途中」移到第一組；其餘時間維持原順序。
   * 總覽連結永遠在最上面，所以插在它後面。日期判斷失敗就什麼都不做。
   */
  const reorderPracticalGroups = () => {
    const list = document.querySelector('.nav-grouped-list');
    const trip = list?.querySelector('[data-nav-group="trip"]');
    if (!list || !trip) return;

    let today;
    try {
      today = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Warsaw',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date());
    } catch {
      return;
    }

    // 旅程 10/24–10/31（與 src/lib/routes.mjs 的 TRIP_DATE_RANGE 一致，build 時有測試比對）。
    if (today < '2026-10-24' || today > '2026-10-31') return;
    const firstGroup = list.querySelector('[data-nav-group]');
    if (firstGroup && firstGroup !== trip) list.insertBefore(trip, firstGroup);
  };
  reorderPracticalGroups();

  // 搜尋與城市頁可直達商品卡或城市門市；目標若位於收合分組，先展開才能正確捲動。
  const revealProductHash = () => {
    let id;
    try {
      id = decodeURIComponent(location.hash.slice(1));
    } catch {
      return;
    }
    const target = id && document.getElementById(id);
    if (!target) return;
    // 採買頁的城市、商品與牛奶果汁都收在 details 裡：目標本身或外層分組收合時先展開。
    // closest 也會比對元素本身，所以直接指向城市 details 時同樣成立。
    const fold = target.closest('.grocery-product-group, .grocery-fold, .hash-fold');
    if (!fold) return;
    fold.setAttribute('open', '');
    requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  };
  revealProductHash();
  window.addEventListener('hashchange', revealProductHash);

  /**
   * 手機時間表：說明超過 3 行先收成 3 行，按「展開全文」才看完整內容
   * （UX 審查第 3 項；2026-10-15 由 1 行放寬到 3 行並改為滿版寬，
   * 多數說明不必展開就讀得完）。沒有 JS 或桌機時照樣顯示全文，不會丟資訊。
   */
  const clampScheduleNotes = () => {
    if (typeof window.matchMedia !== 'function' || !window.matchMedia('(max-width: 700px)').matches) return;
    document.querySelectorAll('.table-schedule .timeline-note').forEach(note => {
      note.classList.add('is-clamped');
      if (note.scrollHeight <= note.clientHeight + 2) {
        note.classList.remove('is-clamped');
        return;
      }
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'note-toggle';
      toggle.textContent = '展開全文';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.addEventListener('click', () => {
        const clamped = note.classList.toggle('is-clamped');
        toggle.textContent = clamped ? '展開全文' : '收合';
        toggle.setAttribute('aria-expanded', String(!clamped));
      });
      note.after(toggle);
    });
  };
  clampScheduleNotes();

  /**
   * 手機卡片表格裡的長備註（票價查核紀錄、交通細節）一格就十幾行，
   * 先收成 4 行，按「展開全文」看完整內容；短的格子不動。沒有 JS 或桌機時照樣全文。
   */
  const clampLongCells = () => {
    if (typeof window.matchMedia !== 'function' || !window.matchMedia('(max-width: 700px)').matches) return;
    const cells = document.querySelectorAll('.table-editorial:not(.table-schedule):not(.city-dining-table):not(.countdown-table) td');
    cells.forEach(cell => {
      if (cell.textContent.trim().length < 140 || cell.querySelector('details, .cell-clamp')) return;
      const body = document.createElement('div');
      body.className = 'cell-clamp is-clamped';
      while (cell.firstChild) body.append(cell.firstChild);
      cell.append(body);
      if (body.scrollHeight <= body.clientHeight + 2) {
        body.classList.remove('is-clamped');
        return;
      }
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'note-toggle';
      toggle.textContent = '展開全文';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.addEventListener('click', () => {
        const clamped = body.classList.toggle('is-clamped');
        toggle.textContent = clamped ? '展開全文' : '收合';
        toggle.setAttribute('aria-expanded', String(!clamped));
      });
      cell.append(toggle);
    });
  };
  clampLongCells();

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

  /**
   * 長頁面（每日頁、資料庫）看不出還剩多少，刊頭下方加一條閱讀進度線。
   * 純裝飾，讀屏軟體忽略；和回頂端共用同一個 rAF。
   */
  const progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);

  /**
   * 回頂端是浮動的，捲動時可能壓在「導航」按鈕或連結上讓人點不到。
   * 只要目前畫面上有任何「導航」可點元素與它重疊，就先收起來，移開再出現。
   */
  const overlapsNavigateLink = () => {
    if (window.scrollY < 900) return false;
    const was = toTop.hidden;
    toTop.hidden = false;
    const box = toTop.getBoundingClientRect();
    toTop.hidden = was;
    return [...document.querySelectorAll('a, button')].some((el) => {
      if (el === toTop) return false;
      if (!(el.textContent + (el.getAttribute('aria-label') || '')).includes('導航')) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && !(r.right <= box.left || r.left >= box.right || r.bottom <= box.top || r.top >= box.bottom);
    });
  };

  /**
   * 手機上往下讀時回頂端會壓在內文上：只在往回捲（想回頭找東西）時才出現，
   * 往下讀就先收起。桌機版面寬，按鈕不擋字，維持原本只看捲動距離。
   */
  const compactQuery = typeof window.matchMedia === 'function' ? window.matchMedia('(max-width: 700px)') : null;
  let lastScrollY = window.scrollY;
  let readingDown = false;
  const trackScrollDirection = () => {
    const delta = window.scrollY - lastScrollY;
    if (Math.abs(delta) < 6) return;
    readingDown = Boolean(compactQuery?.matches) && delta > 0;
    lastScrollY = window.scrollY;
  };

  let toTopFrame = 0;
  const syncScrollState = () => {
    toTopFrame = 0;
    trackScrollDirection();
    toTop.hidden = window.scrollY < 900 || overlapsNavigateLink() || readingDown;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    progress.style.transform = `scaleX(${ratio})`;
  };
  window.addEventListener('scroll', () => {
    if (toTopFrame) return;
    toTopFrame = requestAnimationFrame(syncScrollState);
  }, { passive: true });
  window.addEventListener('resize', syncScrollState, { passive: true });
  syncScrollState();

  // 離線橫幅：網路不穩時要知道看到的是快取版。只用 navigator.onLine 與 online/offline 事件，
  // 不跳 alert／confirm；恢復連線自動收起。
  const offlineBanner = document.createElement('p');
  offlineBanner.className = 'offline-banner';
  offlineBanner.setAttribute('role', 'status');
  offlineBanner.setAttribute('aria-live', 'polite');
  offlineBanner.textContent = '目前離線，顯示已存的資料；地圖只有看過的區域';
  offlineBanner.hidden = navigator.onLine !== false;
  if (nav) nav.after(offlineBanner);
  else document.body.append(offlineBanner);
  // UX 1017 M2：橫幅只在頁首，捲到中段就看不到；同步在 <html> 標 data-offline，
  // 由 CSS 在固定的底部列上緣顯示一行小字（不浮在內容中間、不遮按鈕）。
  const syncOffline = () => {
    offlineBanner.hidden = navigator.onLine !== false;
    const root = document.documentElement;
    if (root && typeof root.toggleAttribute === 'function') root.toggleAttribute('data-offline', navigator.onLine === false);
  };
  syncOffline();
  window.addEventListener('offline', syncOffline);
  window.addEventListener('online', syncOffline);

  if ('serviceWorker' in navigator && selfScript) {
    navigator.serviceWorker.register(new URL('../sw.js', selfScript.src)).catch(() => {});
  }
})();
