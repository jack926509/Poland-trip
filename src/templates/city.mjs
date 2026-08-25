import { renderLayout } from './layout.mjs';

const bookingLabels = {
  must: '建議預約',
  queue: '可能排隊',
  walk: '現場前往',
};

function renderNotice(notice) {
  return `<div class="${notice.level === 'risk' ? 'callout-risk' : 'callout-note'}">
    <span class="${notice.status === '待確認' ? 'tag-todo' : 'tag-red'}">${notice.status}</span>
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
  mapData,
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
          <p><span class="${item.book === 'must' ? 'tag-todo' : 'tag-muted'}">${bookingLabels[item.book] || item.book}</span>${item.map ? ` <a href="${item.map}" target="_blank" rel="noopener">Google Maps →</a>` : ''}</p>
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
          <p><span class="${item.book === 'must' ? 'tag-todo' : 'tag-muted'}">${bookingLabels[item.book] || item.book}</span>${item.map ? ` <a href="${item.map}" target="_blank" rel="noopener">Google Maps →</a>` : ''}</p>
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
          <span class="eyebrow">Day ${spot.day} · ${spot.bestTime}</span>
          <h3>${spot.name}</h3>
          <p>${spot.light}</p>
        </article>`).join('')}
      </div>
    </section>` : '';

  const legendHtml = Object.entries(legend).map(([key, item]) => `
    <div><span style="background:${item.fill};border:1.5px solid ${item.line}"></span>${item.label}</div>`).join('');

  const mapScript = `
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
    (function () {
      var mapData = ${JSON.stringify(mapData)};
      var colors = ${JSON.stringify(legend)};
      var script = document.currentScript;
      var scope = script ? script.closest('.standalone-page') : null;
      var element = (scope || document).querySelector('[data-map-key="${cityKey}"]');
      if (!element || typeof L === 'undefined') return;
      var map = L.map(element, { scrollWheelZoom: false }).setView(mapData.center, mapData.zoom);
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
        var stableDescription = point[3].replace(/★\d(?:\.\d)?(?:\s*\([^)]*\)|\s*（[^）]*）)?\s*/g, '').trim();
        marker.bindPopup('<b>' + point[2] + '</b><br>' + stableDescription + link);
      });
    }());
    </script>`;

  const bodyHtml = `
    <header class="journal-city-cover">
      <figure>
        <img src="${city.photo.hero}" alt="${city.name}城市風景" width="1200" height="800" decoding="async">
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

    <section class="section journal-city-map">
      <div class="section-heading"><span class="section-num">Map</span><h2>互動地圖</h2></div>
      <p class="lead">拖曳、縮放並點選圖釘查看說明；手機上下滑動會優先捲動頁面，圖釘連結可直接開啟 Google Maps。</p>
      <div id="map-${cityKey}" class="map-container" data-map-key="${cityKey}" aria-label="${city.name}互動地圖"></div>
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

    <section class="section">
      <div class="section-heading"><span class="section-num">Dining</span><h2>2026 餐廳情報</h2></div>
      <div class="callout-note"><b>資料界線：</b>這是新爬蟲的探索清單，頁面只保留店名、菜系特色與 2026 米其林身分；動態 Google 星等已移除。營業時間只以「餐廳」實用頁中的已查分店為準。</div>
      <div class="table-wrap"><table class="table-editorial">
        <thead><tr><th>店家</th><th>等級</th><th>重點招牌</th></tr></thead>
        <tbody>${diningRows}</tbody>
      </table></div>
    </section>

    ${primaryDiningHtml}
    ${backupHtml}
    ${photoHtml}
    ${mapScript}`;

  const extraHead = '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">';
  return renderLayout({ title: `${city.name}城市指南`, activeNav: 'cities', bodyHtml, extraHead, pageKind: 'city' });
}
