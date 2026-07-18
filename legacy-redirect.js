(function () {
  const filename = window.location.pathname.split('/').pop();
  const desktop = filename === 'desktop.html';
  const target = new URL(desktop ? './' : './mobile.html', window.location.href);
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set('view', desktop ? 'desktop' : 'mobile');
  target.search = searchParams.toString();
  target.hash = window.location.hash;
  window.location.replace(target.href);
})();
