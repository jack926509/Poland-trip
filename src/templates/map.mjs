import { escapeHtml } from '../lib/html.mjs';
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
      <button type="button" data-map-action="reset" aria-label="${escapeHtml(mapData.focusBounds ? `回到主要步行區：${mapData.focus || title}` : '重設地圖範圍')}">${mapData.focusBounds ? '步行區' : '重設範圍'}</button>
      ${mapData.focusBounds ? '<button type="button" data-map-action="all" aria-label="把全部地點框進畫面">全部地點</button>' : ''}
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
    var map = L.map(container, { scrollWheelZoom: true, touchZoom: true, doubleClickZoom: true, zoomControl: false, zoomSnap: 0.5 }).setView(data.center, data.zoom || 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
    var bounds = [];
    var pins = [];
    data.points.forEach(function (point) {
      var category = config.legend[point[5]] || config.legend.sight;
      var check = config.mapChecks[point[2]] || {};
      var area = check.status === 'area-reference';
      // UX 1017 H2：圖釘改成 26px 數字圓標，數字＝時間表第幾列（point[8]，建置時算好）；
      // 對不上時間表的圖釘是較小的無字圓點，不搶編號圖釘的位置。
      // point[9] 是顯示標籤：同一列有好幾顆圖釘時為 7a／7b，其餘同編號。
      var number = point[8], tag = point[9] || number;
      var icon = L.divIcon({ className: 'trip-pin' + (number ? '' : ' trip-pin-plain') + (tag && String(tag).length > 2 ? ' trip-pin-tag' : ''), html: '<i class="trip-leader"></i><span style="background:' + category.fill + ';border-color:' + category.line + '">' + (tag || '') + '</span>', iconSize: number ? [26, 26] : [18, 18] });
      var marker = L.marker([point[0], point[1]], { icon: icon, title: (number ? tag + '. ' : '') + point[2], alt: point[2], zIndexOffset: number ? (100 - number) * 100000 : 0 }).addTo(map);
      pins.push({ marker: marker, number: number || 0, radius: number ? 13 : 9 });
      var label = area ? '<br><small>範圍代表點，請依實際目的地導航</small>' : '<br><small>已查證場館／門牌錨點</small>';
      var popup = document.createElement('div');
      var heading = document.createElement('b'); heading.textContent = (number ? tag + '. ' : '') + point[2]; popup.appendChild(heading);
      popup.appendChild(document.createElement('br')); popup.appendChild(document.createTextNode(point[3]));
      popup.insertAdjacentHTML('beforeend', label);
      var url = safeUrl(point[4]);
      if (url) { var br = document.createElement('br'); var link = document.createElement('a'); link.href = url; link.target = '_blank'; link.rel = 'noopener'; link.textContent = '在 Google Maps 開啟 →'; popup.append(br, link); }
      var sourceUrl = safeUrl(point[6]);
      // 座標來源獨立一行、字級降一階，不再和導航鈕並排（UX 1017 H3）。
      if (sourceUrl) { var source = document.createElement('a'); source.className = 'map-popup-source'; source.href = sourceUrl; source.target = '_blank'; source.rel = 'noopener'; source.textContent = '座標來源 ↗'; popup.append(source); }
      // 驗收 F1：彈窗寬度跟著「打開當下」的地圖寬度走（單檔版初始隱藏時寬度是 0），
      // 手機上右上角的關閉鈕才不會被地圖邊緣切掉。
      marker.bindPopup(popup, { maxWidth: 300, autoPanPadding: [12, 12] });
      marker.on('popupopen', function (event) {
        var limit = Math.max(180, Math.min(300, container.clientWidth - 72));
        if (event.popup.options.maxWidth !== limit) { event.popup.options.maxWidth = limit; event.popup.update(); }
      });
      bounds.push([point[0], point[1]]);
    });
    // N1：靠很近的圖釘在預設縮放下會疊住、數字被蓋。依編號（小號先、無字圓點最後）貪婪排位，
    // 和已排好的撞到（外框相碰：橫或縱向中心距都 < 兩半徑和）就以 CSS transform 把內層 span 往外挪（繞圈找第一個空位），
    // 真實座標不動，原位留一個小黑點（.is-nudged::after）；放大到不撞時偏移自動歸零。
    function declutter() {
      var placed = [], size = map.getSize();
      pins.slice().sort(function (a, b) { return (a.number || 1e6) - (b.number || 1e6); }).forEach(function (pin) {
        var base = map.latLngToContainerPoint(pin.marker.getLatLng());
        var best = null;
        function free(x, y) { return placed.every(function (o) { return Math.max(Math.abs(o.x - x), Math.abs(o.y - y)) >= o.r + pin.radius; }); }
        if (free(base.x, base.y)) best = { x: base.x, y: base.y, dx: 0, dy: 0 };
        for (var ring = 1; !best && ring <= 6; ring++) {
          for (var k = 0; !best && k < 12; k++) {
            var angle = (k / 12) * 2 * Math.PI - Math.PI / 2, dist = 14 + ring * 14 + pin.radius;
            var dx = Math.round(Math.cos(angle) * dist), dy = Math.round(Math.sin(angle) * dist);
            // 驗收：挪開後的位置不可超出地圖邊界（地圖隱藏、寬度 0 時不檢查）。
            var x = base.x + dx, y = base.y + dy;
            if (size.x > 0 && (x < pin.radius || y < pin.radius || x > size.x - pin.radius || y > size.y - pin.radius)) continue;
            if (free(x, y)) best = { x: base.x + dx, y: base.y + dy, dx: dx, dy: dy };
          }
        }
        if (!best) best = { x: base.x, y: base.y, dx: 0, dy: 0 };
        placed.push({ x: best.x, y: best.y, r: pin.radius });
        var el = pin.marker.getElement();
        var face = el && el.querySelector('span');
        if (!face) return;
        var moved = !!(best.dx || best.dy);
        face.style.transform = moved ? 'translate(' + best.dx + 'px,' + best.dy + 'px)' : '';
        // 引線：從原位（錨點）畫到挪開後的圓標中心，讓使用者分得出哪顆小黑點是哪個號碼；沒挪開時隱藏。
        var leader = el.querySelector('.trip-leader');
        if (leader) {
          leader.style.width = moved ? Math.round(Math.hypot(best.dx, best.dy)) + 'px' : '0';
          leader.style.transform = moved ? 'rotate(' + Math.atan2(best.dy, best.dx) + 'rad)' : '';
        }
        el.classList.toggle('is-nudged', !!(best.dx || best.dy));
      });
    }
    map.on('zoomend', declutter);
    // 預設框住主要步行區（data.focusBounds，建置時由當天時間表的圖釘算出）；
    // 遠處的車站、住宿與搭車才到的景點按「全部地點」才一起框進來。
    function showAll() {
      if (bounds.length > 1) map.fitBounds(bounds, { padding: [32, 32], maxZoom: 15 });
      else map.setView(data.center, data.zoom || 13);
    }
    function resetView() {
      if (data.focusBounds) map.fitBounds(data.focusBounds, { padding: [30, 30], maxZoom: 16 });
      else showAll();
    }
    resetView();
    declutter();
    var toolbar = container.parentElement.querySelector('.map-toolbar');
    if (toolbar) toolbar.addEventListener('click', function (event) {
      var button = event.target.closest('[data-map-action]');
      if (!button) return;
      if (button.dataset.mapAction === 'zoom-in') map.zoomIn();
      if (button.dataset.mapAction === 'zoom-out') map.zoomOut();
      if (button.dataset.mapAction === 'reset') resetView();
      if (button.dataset.mapAction === 'all') showAll();
      container.focus({ preventScroll: true });
    });
    function resizeWhenVisible() { if (container.offsetParent !== null) { map.invalidateSize(false); declutter(); } }
    window.addEventListener('resize', resizeWhenVisible);
    window.addEventListener('hashchange', function () { requestAnimationFrame(resizeWhenVisible); });
    var page = container.closest('.standalone-page');
    if (page && window.MutationObserver) new MutationObserver(resizeWhenVisible).observe(page, { attributes: true, attributeFilter: ['hidden'] });
  }());
  </script>`;
}
