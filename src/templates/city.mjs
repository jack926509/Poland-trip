import { renderCityJourney } from './journey.mjs';
import { mergeCityDining, dropDuplicateClauses, dedupeNotes, dropRestatedHours } from './city-dining.mjs';
import { renderLayout } from './layout.mjs';
import { renderPhotoGallery } from './photo-gallery.mjs';
import { renderCityFastFood } from './fast-food.mjs';

const bookingLabels = {
  must: '建議預約',
  queue: '可能排隊',
  walk: '現場前往',
};

/** 合併後的餐廳清單靠標籤區分來源：你的候選、主推、備案、小吃 · 咖啡。 */
function diningBadge(item) {
  if (item.selected) return '<span class="city-dining-choice">你的候選</span>';
  if (item.mustEat) return '<span class="city-dining-choice">順路必吃</span>';
  if (item.role === 'backup') return '<span class="city-dining-role">備案</span>';
  if (item.role === 'snack') return '<span class="city-dining-role">小吃 · 咖啡</span>';
  return '';
}

const planFallback = {
  backup: '首選訂不到或客滿時的替代',
  snack: '隨時可插進動線的歇腳與銅板價選擇',
};

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
  snacksAndCafesForCity = [],
  photoSpotsForCity,
  fastFoodForCity = [],
  fastFoodHubForCity = null,
  fastFoodChains = [],
  story,
  notices = [],
}) {
  const attractionRows = attractionsForCity.map(attraction => `
    <tr>
      <td><a href="${stableMapUrl(attraction)}" target="_blank" rel="noopener">${attraction.name}</a></td>
      <td>${stableTier(attraction.tag)}</td>
      <td>${attraction.priceNote}</td>
    </tr>`).join('');

  const mergedDining = mergeCityDining(cityKey, dining, cityFoodForCity?.items || [], snacksAndCafesForCity);
  // 店名本身就是 Google Maps 連結（底線超連結），不再另開一欄放連結。
  const renderDiningName = item => (item.map
    ? `<a class="city-dining-name" href="${item.map}" target="_blank" rel="noopener noreferrer" aria-label="在新視窗開啟 ${item.name} 的 Google Maps">${item.name}</a>`
    : `<strong>${item.name}</strong>`);
  const renderDiningRow = item => `<tr class="${item.selected ? 'city-dining-selected' : ''}">
    <th scope="row">${renderDiningName(item)}${diningBadge(item)}${item.address ? `<p class="food-map-note">${item.address}</p>` : ''}</th>
    <td>${stableTier(item.tier || item.tag || '待補充')}</td>
    <td>${item.notes.length ? dropDuplicateClauses(dedupeNotes(item.notes, item.address).join('；'), item.address) : '依店家當日菜單確認'}</td>
    <td>${item.plans?.length
      ? item.plans.map(plan => `<p class="city-dining-plan">${dropRestatedHours(dropDuplicateClauses(plan, item.notes.join('；')), item.hours)}</p>`).join('')
      : `<p>${planFallback[item.role] || '依當天動線與胃口安排'}</p>`}<p class="food-map-note">${item.hours ? `營業時間：${item.hours}` : (bookingLabels[item.book] || '營業與訂位請向店家確認')}</p></td>
  </tr>`;
  const primaryDiningHtml = mergedDining.length ? `
    <section class="section" id="city-dining">
      <div class="section-heading"><span class="section-num">Dining</span><h2>行程餐廳推薦</h2></div>
      <p class="lead" id="city-dining-description">共 ${mergedDining.length} 家，${mergedDining.filter(item => item.selected || item.mustEat).length} 家已列入每日候選。排序：你的候選與順路必吃置頂並標出日期（點 Day 回當日行程），其次主推、備案，最後是可隨時插入動線的小吃與咖啡廳。</p>
      <p class="lead"><b>點店名開啟 Google Maps。</b>評分與評論數本站不保存——那是每天在變的快照；營業時間同理，出發前與現場以官方頁為準，連鎖與同名店先對門牌。</p>
      <p class="city-dining-scroll-hint">平板可左右滑動看完整欄位，手機自動改為卡片。</p>
      <div class="table-wrap city-dining-table-wrap" role="region" aria-label="行程餐廳推薦列表" tabindex="0">
        <table class="table-editorial city-dining-table" aria-describedby="city-dining-description">
          <caption>候選、主推、備案與小吃咖啡廳合併後的行程餐廳清單</caption>
          <thead><tr><th scope="col">餐廳／地址</th><th scope="col">類型／評選標記</th><th scope="col">料理特色／推薦餐點</th><th scope="col">行程安排／訂位提醒</th></tr></thead>
          <tbody>${mergedDining.map(renderDiningRow).join('')}</tbody>
        </table>
      </div>
      <p class="action-links"><a href="practical/dining.html">米其林名單與訂位管道 →</a></p>
    </section>` : '';

  // 連鎖速食的版型與餐廳頁共用（fast-food.mjs），城市頁只傳這座城的分店。
  const fastFoodHtml = renderCityFastFood({
    branches: fastFoodForCity,
    chains: fastFoodChains,
    hub: fastFoodHubForCity,
    cityName: city.name,
  });

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
      var map = L.map(element, { scrollWheelZoom: true, touchZoom: true, doubleClickZoom: true, zoomControl: false }).setView(mapData.center, mapData.zoom);
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

    ${renderCityJourney(city)}
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
      <div class="table-wrap"><table class="table-editorial sights-table">
        <thead><tr><th>景點</th><th>類型</th><th>票價／備註</th></tr></thead>
        <tbody>${attractionRows}</tbody>
      </table></div>
      <p class="action-links"><a href="practical/tickets.html">查證過的票價與開放時間 →</a><a href="practical/transit.html">${city.name}市區交通票價 →</a></p>
    </section>

    ${primaryDiningHtml}
    ${fastFoodHtml}
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
    ogImage: city.photo.og,
    ogImageAlt: `${city.name}章節海報`,
  });
}
