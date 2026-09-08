import { renderLayout } from './layout.mjs';
import { renderPhotoGallery } from './photo-gallery.mjs';

const bookingLabels = {
  must: '建議預約',
  queue: '可能排隊',
  walk: '現場前往',
};

/**
 * 餐廳卡片的地圖連結。單店用 item.map；一格寫兩家店（例如「U Fukiera / Polka」）
 * 用 item.maps 各給一條，避免一條連結指錯店。
 */
function renderFoodMapLinks(item) {
  const links = item.maps?.length
    ? item.maps.map(entry => ({ label: `${entry.name} 地圖 →`, url: entry.url }))
    : (item.map ? [{ label: 'Google Maps →', url: item.map }] : []);
  if (!links.length) return '';
  return `<p class="food-map-links">${links.map(link =>
    `<a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.label}</a>`).join('')}</p>`;
}

function renderNotice(notice) {
  return `<div class="${notice.level === 'risk' ? 'callout-risk' : 'callout-note'}">
    <span class="${notice.level === 'risk' ? 'tag-red' : 'tag-yellow'}">${notice.status}</span>
    <p>${notice.text}</p>
  </div>`;
}

function stableTier(tier) {
  // Google 星等與評論數是動態快照，不應在離線行程網站偽裝成固定事實。
  return tier.replace(/★\d(?:\.\d)?（[^）]+）\s*/g, '').trim();
}

function stableMapUrl(attraction) {
  if (attraction.name.startsWith('奧斯威辛')) {
    return 'https://www.google.com/maps/search/?api=1&query=Memorial%20and%20Museum%20Auschwitz-Birkenau%20O%C5%9Bwi%C4%99cim';
  }
  return attraction.mapUrl;
}

function stableMapDescription(description) {
  return description.replace(/★\d(?:\.\d)?(?:\s*\([^)]*\)|\s*（[^）]*）)?\s*/g, '').trim();
}

export function renderCity({
  city,
  cityKey,
  cityFile,
  mapData,
  mapChecks = {},
  legend,
  attractionsForCity,
  dining,
  cityFoodForCity,
  foodBackupForCity,
  photoSpotsForCity,
  story,
  notices = [],
}) {
  const attractionRows = attractionsForCity.map(attraction => `
    <tr>
      <td><a href="${stableMapUrl(attraction)}" target="_blank" rel="noopener">${attraction.name}</a></td>
      <td>${stableTier(attraction.tag)}</td>
      <td>${attraction.priceNote}</td>
    </tr>`).join('');

  const diningRows = dining.map(restaurant => `
    <tr>
      <td><a href="${restaurant.mapUrl}" target="_blank" rel="noopener">${restaurant.name}</a></td>
      <td>${stableTier(restaurant.tier)}</td>
      <td>${restaurant.highlight}</td>
    </tr>`).join('');

  const primaryDiningHtml = cityFoodForCity?.items.length ? `
    <section class="section">
      <div class="section-heading"><span class="section-num">Shortlist</span><h2>行程主餐廳推薦</h2></div>
      <div class="grid">${cityFoodForCity.items.map(item => `
        <article class="card">
          <span class="eyebrow">${item.tag}</span>
          <h3>${item.name}</h3>
          <p>${item.note}</p>
          <p><span class="${item.book === 'must' ? 'tag-todo' : 'tag-muted'}">${bookingLabels[item.book] || item.book}</span></p>
          ${renderFoodMapLinks(item)}
        </article>`).join('')}
      </div>
    </section>` : '';

  const backupHtml = foodBackupForCity?.items.length ? `
    <section class="section">
      <div class="section-heading"><span class="section-num">Plan B</span><h2>備案餐廳</h2></div>
      <div class="grid">${foodBackupForCity.items.map(item => `
        <article class="card">
          <span class="eyebrow">${item.tag}</span>
          <h3>${item.name}</h3>
          <p>${item.note}</p>
          <p><span class="${item.book === 'must' ? 'tag-todo' : 'tag-muted'}">${bookingLabels[item.book] || item.book}</span></p>
          ${renderFoodMapLinks(item)}
        </article>`).join('')}
      </div>
    </section>` : '';

  const storyHtml = story ? `
    <section class="section">
      <div class="section-heading"><span class="section-num">Context</span><h2>先理解這座城</h2></div>
      <div class="grid-wide">
        <article class="card"><span class="eyebrow">地理</span><p>${story.geo}</p></article>
        <article class="card"><span class="eyebrow">歷史</span><p>${story.history}</p></article>
      </div>
      <div class="grid">${story.stories.map(item => `<article class="card"><h3>${item.title}</h3><p>${item.text}</p></article>`).join('')}</div>
      <h3>到現場別漏看</h3>
      <ul class="check-list">${story.onSite.map(item => `<li>${item}</li>`).join('')}</ul>
    </section>` : '';

  const photoHtml = photoSpotsForCity.length ? `
    <section class="section">
      <div class="section-heading"><span class="section-num">Photo</span><h2>拍照建議</h2></div>
      <div class="grid">${photoSpotsForCity.map(spot => `
        <article class="card">
          <span class="eyebrow">${spot.day ? `Day ${spot.day} · ` : ''}${spot.bestTime}</span>
          <h3>${spot.name}</h3>
          <p><b>精確站位：</b>${spot.viewpoint}</p>
          <p><b>拍攝方向：</b>${spot.direction}</p>
          <p><b>光線與構圖：</b>${spot.light}</p>
          <p><a href="${spot.mapUrl}" target="_blank" rel="noopener noreferrer">開啟拍照站位 ↗</a></p>
        </article>`).join('')}
      </div>
    </section>` : '';

  const cityDetailPhoto = city.photo?.detail ? `
    <figure class="city-detail-photo">
      <img src="${city.photo.detail}" alt="${city.photo.detailAlt}" width="1280" height="${city.photo.detailHeight}" loading="lazy" decoding="async">
      <figcaption>${city.photo.detailCaption} · ${city.photo.detailAuthor} · <a href="${city.photo.detailSource}" target="_blank" rel="noopener noreferrer">圖片來源 ↗</a> · <a href="${city.photo.detailLicenseUrl}" target="_blank" rel="noopener noreferrer">${city.photo.detailLicense} 授權 ↗</a></figcaption>
    </figure>` : '';

  const legendHtml = Object.entries(legend).map(([key, item]) => `
    <div><span style="background:${item.fill};border:1.5px solid ${item.line}"></span>${item.label}</div>`).join('');
  const mapCheckSummary = Object.values(mapChecks).reduce((summary, check) => {
    if (check.status === 'coordinate-verified') summary.precise += 1;
    if (check.status === 'area-reference') summary.area += 1;
    return summary;
  }, {precise: 0, area: 0});

  const mapScript = `
    <script src="assets/leaflet/leaflet.js"></script>
    <script>
    (function () {
      var mapData = ${JSON.stringify(mapData)};
      var mapChecks = ${JSON.stringify(mapChecks)};
      var colors = ${JSON.stringify(legend)};
      var script = document.currentScript;
      var scope = script ? script.closest('.standalone-page') : null;
      var element = (scope || document).querySelector('[data-map-key="${cityKey}"]');
      if (!element || typeof L === 'undefined') return;
      element.textContent = '';
      var map = L.map(element, { scrollWheelZoom: true, touchZoom: true, doubleClickZoom: true, zoomControl: true }).setView(mapData.center, mapData.zoom);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);
      mapData.points.forEach(function (point) {
        var category = point[5] || 'sight';
        var color = colors[category] || colors.sight;
        var marker = L.circleMarker([point[0], point[1]], {
          radius: 8,
          weight: 2,
          color: color.line,
          fillColor: color.fill,
          fillOpacity: 0.92
        }).addTo(map);
        var link = point[4] ? '<br><a href="' + point[4] + '" target="_blank" rel="noopener">在 Google Maps 開啟 →</a>' : '';
        var check = mapChecks[point[2]] || {};
        var locationNote = check.status === 'area-reference' ? '<br><small>範圍代表點，請依實際目的地導航</small>' : '';
        var stableDescription = point[3].replace(/★\d(?:\.\d)?(?:\s*\([^)]*\)|\s*（[^）]*）)?\s*/g, '').trim();
        marker.bindPopup('<b>' + point[2] + '</b><br>' + stableDescription + locationNote + link);
      });
      var toolbar = element.parentElement.querySelector('.map-toolbar');
      if (toolbar) toolbar.addEventListener('click', function (event) {
        var button = event.target.closest('[data-map-action]');
        if (!button) return;
        if (button.dataset.mapAction === 'zoom-in') map.zoomIn();
        if (button.dataset.mapAction === 'zoom-out') map.zoomOut();
        if (button.dataset.mapAction === 'reset') map.setView(mapData.center, mapData.zoom);
        element.focus({ preventScroll: true });
      });
    }());
    </script>`;

  const bodyHtml = `
    <header class="journal-city-cover">
      <figure>
        <img src="${city.photo.hero}" alt="${city.name}城市風景" width="1200" height="800" decoding="async" fetchpriority="high">
        <figcaption>${city.pl} · ${city.tag}</figcaption>
      </figure>
      <div class="journal-city-cover-copy">
        <span class="section-num">${city.tag} · ${city.pl}</span>
        <h1>${city.name}</h1>
        <p class="hero-dek">${city.vibe}</p>
        <span class="eyebrow">這趟重點</span>
        <ul class="check-list">${city.highlights.map(item => `<li>${item}</li>`).join('')}</ul>
      </div>
    </header>

    ${notices.map(renderNotice).join('')}

    <div class="journal-city-story">${storyHtml}</div>

    ${cityDetailPhoto}
    ${renderPhotoGallery(city.gallery)}

    <section class="section journal-city-map">
      <div class="section-heading"><span class="section-num">Map</span><h2>互動地圖</h2></div>
      <p class="lead">拖曳、滾輪、雙擊或使用按鈕縮放；手機可用雙指縮放，點選圖釘可直接開啟 Google Maps。</p>
      <div class="callout-note"><b>座標狀態：</b>${mapCheckSummary.precise} 個門牌／場館錨點已比對${mapCheckSummary.area ? `，${mapCheckSummary.area} 個街區或島區採範圍代表點` : ''}。座標查證於 2026/08/11–15，本次發布複核於 2026/09/08；未確認分店的 Żabka 不放精確圖釘，抵達後請用即時地圖搜尋附近分店。</div>
      <div class="map-toolbar" role="group" aria-label="${city.name}地圖縮放控制">
        <button type="button" data-map-action="zoom-in">＋ 放大</button>
        <button type="button" data-map-action="zoom-out">－ 縮小</button>
        <button type="button" data-map-action="reset">重設範圍</button>
      </div>
      <div id="map-${cityKey}" class="map-container" data-map-key="${cityKey}" role="region" aria-label="${city.name}互動地圖"><p class="map-fallback">地圖需要網路連線才能載入。離線或載入失敗時，請改用下方景點清單中的 Google Maps 連結。</p></div>
      <div class="map-legend" aria-label="地圖圖例">${legendHtml}</div>
      <p class="map-caption">地圖底圖 © OpenStreetMap contributors</p>
    </section>

    <section class="section">
      <div class="section-heading"><span class="section-num">Sights</span><h2>景點清單</h2></div>
      <div class="table-wrap"><table class="table-editorial">
        <thead><tr><th>景點</th><th>類型</th><th>票價／備註</th></tr></thead>
        <tbody>${attractionRows}</tbody>
      </table></div>
    </section>

    <section class="section" id="city-dining">
      <div class="section-heading"><span class="section-num">Dining</span><h2>2026 餐廳情報</h2></div>
      <div class="callout-note"><b>資料界線：</b>使用者指定店家已標成「使用者指定」並保留原始 Google Maps 連結；其餘探索清單只保留店名、菜系特色與 2026 米其林身分。動態 Google 星等已移除，營業時間與訂位仍以店家即時頁面為準。</div>
      <div class="table-wrap"><table class="table-editorial">
        <thead><tr><th>店家</th><th>等級</th><th>重點招牌</th></tr></thead>
        <tbody>${diningRows}</tbody>
      </table></div>
    </section>

    ${primaryDiningHtml}
    ${backupHtml}
    ${photoHtml}
    ${mapScript}`;

  // Leaflet 改為自行 host：不依賴 unpkg，離線快取後地圖程式本身也能用
  const extraHead = '<link rel="stylesheet" href="assets/leaflet/leaflet.css">';
  return renderLayout({
    title: `${city.name}城市指南`,
    activeNav: 'cities',
    bodyHtml,
    extraHead,
    pageKind: 'city',
    currentPage: `city-${cityFile}.html`,
  });
}
