(function () {
  const target = new URL('./', window.location.href);
  target.hash = window.location.hash;
  window.location.replace(target.href);
})();
