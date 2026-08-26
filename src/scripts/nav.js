(() => {
  // 先抓自己的位置：nav.js 固定在 <站台根>/assets/nav.js，
  // 由它推出 sw.js 路徑，首頁與 practical/ 子目錄都適用
  const selfScript = document.currentScript;

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

  // 離線可用：註冊 service worker，行程、城市頁與地圖程式都會被快取
  if ('serviceWorker' in navigator && selfScript && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      const swUrl = new URL('../sw.js', selfScript.src);
      navigator.serviceWorker.register(swUrl, { scope: new URL('./', swUrl) })
        .catch(() => { /* 註冊失敗不影響一般瀏覽 */ });
    });
  }
})();
