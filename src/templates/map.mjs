function escapeHtml(value) {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

export function renderInteractiveMap({ id, title, mapData, mapChecks = {}, legend, note = '' }) {
  const legendHtml = Object.entries(legend).map(([, item]) =>
    `<div><span style="background:${item.fill};border:1.5px solid ${item.line}"></span>${escapeHtml(item.label)}</div>`).join('');
  const scriptData = JSON.stringify({ mapData, mapChecks, legend }).replaceAll('<', '\\u003c');
  const unlocated = mapData.unlocated?.length ? `<div class="map-unlocated"><b>未放精確圖釘：</b><ul>${mapData.unlocated.map(item => `<li>${escapeHtml(item.name)}${item.url ? ` · <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">Google Maps 搜尋 ↗</a>` : ''}</li>`).join('')}</ul><p>這些地點沒有沿用資料集中的已查證座標，因此只提供名稱導航。</p></div>` : '';
  return `<section class="section journal-city-map day-map-section" aria-labelledby="${id}-heading">
    <div class="section-heading"><span class="section-num">Map</span><h2 id="${id}-heading">${escapeHtml(title)}</h2></div>
    <p class="lead">${escapeHtml(note || '點選圖釘查看地點與導航；圖釘之間不代表步行路線，請依當下交通與 Google Maps 導航。')}</p>
    <div class="map-toolbar" role="group" aria-label="${escapeHtml(title)}縮放控制">
      <button type="button" data-map-action="zoom-in" aria-label="放大地圖">＋ 放大</button>
      <button type="button" data-map-action="zoom-out" aria-label="縮小地圖">－ 縮小</button>
      <button type="button" data-map-action="reset" aria-label="重設地圖範圍">重設範圍</button>
    </div>
    <div id="${id}" class="map-container" data-trip-map="${id}" role="region" aria-label="${escapeHtml(title)}"><p class="map-fallback">地圖需要網路連線才能載入。離線或載入失敗時，請使用下方導航連結。</p></div>
    <div class="map-legend" aria-label="地圖圖例">${legendHtml}</div>
    ${unlocated}
    <p class="map-caption">地圖底圖 © OpenStreetMap contributors · 「範圍代表點」不是入口或門牌</p>
    <script type="application/json" data-map-config>${scriptData}</script>
  </section>
  <script src="assets/leaflet/leaflet.js"></script>
  <script>
  (function () {
    var scope = document.currentScript.closest('.standalone-page') || document;
    var container = scope.querySelector('[data-trip-map=${JSON.stringify(id)}]');
    if (!container || container.dataset.mapReady) return;
    var configNode = container.parentElement.querySelector('[data-map-config]');
    var config = JSON.parse(configNode.textContent);
    if (!window.L) { container.classList.add('is-map-unavailable'); return; }
    container.dataset.mapReady = 'true';
    container.textContent = '';
    var data = config.mapData;
    function safeUrl(value) { try { var url = new URL(value); return url.protocol === 'https:' ? url.href : ''; } catch (_) { return ''; } }
    var map = L.map(container, { scrollWheelZoom: true, touchZoom: true, doubleClickZoom: true, zoomControl: true }).setView(data.center, data.zoom || 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
    var bounds = [];
    data.points.forEach(function (point) {
      var category = config.legend[point[5]] || config.legend.sight;
      var check = config.mapChecks[point[2]] || {};
      var area = check.status === 'area-reference';
      var marker = L.circleMarker([point[0], point[1]], { radius: 8, color: category.line, fillColor: category.fill, weight: 2, fillOpacity: .92 }).addTo(map);
      var label = area ? '<br><small>範圍代表點，請依實際目的地導航</small>' : '<br><small>已查證場館／門牌錨點</small>';
      var popup = document.createElement('div');
      var heading = document.createElement('b'); heading.textContent = point[2]; popup.appendChild(heading);
      popup.appendChild(document.createElement('br')); popup.appendChild(document.createTextNode(point[3]));
      popup.insertAdjacentHTML('beforeend', label);
      var url = safeUrl(point[4]);
      if (url) { var br = document.createElement('br'); var link = document.createElement('a'); link.href = url; link.target = '_blank'; link.rel = 'noopener'; link.textContent = '在 Google Maps 開啟 →'; popup.append(br, link); }
      var sourceUrl = safeUrl(point[6]);
      if (sourceUrl) { var separator = document.createTextNode(' · '); var source = document.createElement('a'); source.href = sourceUrl; source.target = '_blank'; source.rel = 'noopener'; source.textContent = '座標來源 ↗'; popup.append(separator, source); }
      marker.bindPopup(popup);
      bounds.push([point[0], point[1]]);
    });
    function resetView() {
      if (bounds.length > 1) map.fitBounds(bounds, { padding: [32, 32], maxZoom: 15 });
      else map.setView(data.center, data.zoom || 13);
    }
    resetView();
    var toolbar = container.parentElement.querySelector('.map-toolbar');
    if (toolbar) toolbar.addEventListener('click', function (event) {
      var button = event.target.closest('[data-map-action]');
      if (!button) return;
      if (button.dataset.mapAction === 'zoom-in') map.zoomIn();
      if (button.dataset.mapAction === 'zoom-out') map.zoomOut();
      if (button.dataset.mapAction === 'reset') resetView();
      container.focus({ preventScroll: true });
    });
    function resizeWhenVisible() { if (container.offsetParent !== null) map.invalidateSize(false); }
    window.addEventListener('resize', resizeWhenVisible);
    window.addEventListener('hashchange', function () { requestAnimationFrame(resizeWhenVisible); });
    var page = container.closest('.standalone-page');
    if (page && window.MutationObserver) new MutationObserver(resizeWhenVisible).observe(page, { attributes: true, attributeFilter: ['hidden'] });
  }());
  </script>`;
}
