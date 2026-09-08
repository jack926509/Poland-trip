import { renderLayout } from './layout.mjs';
import { renderInteractiveMap } from './map.mjs';
import { renderPhotoGallery } from './photo-gallery.mjs';

function renderList(items, renderItem) {
  return items?.length ? `<ul class="check-list">${items.map(renderItem).join('')}</ul>` : '';
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function safeHttpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? escapeHtml(url.href) : null;
  } catch {
    return null;
  }
}

/**
 * 順路必吃可以是字串（沒有指定店家）或 {text, place, map, note}。
 * 有指定店家就附 Google Maps 連結；沒有固定店址的品項只留說明，不硬給連結。
 */
function renderEatCard(item) {
  if (typeof item === 'string') return `<div class="card"><p>${item}</p></div>`;
  const link = safeHttpsUrl(item.map)
    ? `<p class="food-map-links"><a href="${safeHttpsUrl(item.map)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.place || item.text)} 地圖 →</a></p>`
    : '';
  const note = item.note ? `<p class="food-map-note">${escapeHtml(item.note)}</p>` : '';
  return `<div class="card"><p>${escapeHtml(item.text)}</p>${note}${link}</div>`;
}

function renderOperation(operation) {
  if (!operation) return '';

  const addresses = operation.addresses?.map(item => {
    const safeUrl = safeHttpsUrl(item.url);
    return `
      <li class="operation-address">
        <div><b>${escapeHtml(item.name)}</b><span>${escapeHtml(item.address)}</span></div>
        ${item.note ? `<p>${escapeHtml(item.note)}</p>` : ''}
        ${item.entranceNote ? `<p><b>入口：</b>${escapeHtml(item.entranceNote)}</p>` : ''}
        ${safeUrl ? `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" aria-label="在新視窗開啟 ${escapeHtml(item.name)} 導航">開啟導航 ↗</a>` : ''}
        ${safeHttpsUrl(item.officialUrl) ? ` · <a href="${safeHttpsUrl(item.officialUrl)}" target="_blank" rel="noopener noreferrer">官網 ↗</a>` : ''}
      </li>`;
  }).join('') || '<li>這一天尚無地址資料。</li>';

  const navigation = operation.navigation?.map(item => `
    <li>
      <span class="operation-mode">${escapeHtml(item.mode)}</span>
      <b>${escapeHtml(item.route)}</b>
      <p>${escapeHtml(item.action)}</p>
    </li>`).join('') || '<li>這一天尚無移動步驟。</li>';

  const alerts = operation.dailyAlerts?.map(item => `<li>${escapeHtml(item)}</li>`).join('') || '<li>這一天尚無特別警示。</li>';
  const unresolved = operation.unresolvedSteps?.map(item => `<li><b>${escapeHtml(item.label)}</b><p>${escapeHtml(item.reason)}</p></li>`).join('') || '<li>本日所有步驟都已有可靠地址。</li>';

  return `
    <section class="section operation-section" id="directions" aria-labelledby="operation-heading">
      <div class="section-heading"><span class="section-num">On the ground</span><h2 id="operation-heading">今天怎麼走</h2></div>
      <p class="lead">${escapeHtml(operation.note)}</p>
      <div class="grid-wide operation-grid">
        <article class="card">
          <span class="eyebrow">Address book</span>
          <h3>現場地址</h3>
          <ul class="operation-addresses">${addresses}</ul>
        </article>
        <article class="card">
          <span class="eyebrow">Route</span>
          <h3>移動步驟</h3>
          <ol class="operation-routes">${navigation}</ol>
        </article>
      </div>
      <div class="callout-risk operation-alerts">
        <span class="tag-red">今日注意</span>
        <ul class="check-list">${alerts}</ul>
      </div>
      <details class="card operation-unresolved"><summary><b>待班次／住宿／分店確認的步驟</b></summary><ul class="check-list">${unresolved}</ul></details>
    </section>`;
}

function renderNightChecklist(operation) {
  if (!operation?.nightChecklist?.length) return '';
  return `
    <section class="section night-checklist" aria-labelledby="night-checklist-heading">
      <div class="section-heading"><span class="section-num">Before sleep</span><h2 id="night-checklist-heading">晚間準備</h2></div>
      <div class="card card-accent">
        <p class="lead">現在完成，明天出門就不用在網路不穩時臨時找資料。</p>
        <ul class="night-checks">${operation.nightChecklist.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      </div>
    </section>`;
}

export function renderDay(day, photoSpotsForDay = [], operation = null, city = null, detailPhotoCity = null, dayMap = null, mapChecks = {}, legend = {}, dayGallery = []) {
  const stepsHtml = day.steps.map(step => `
    <tr>
      <td class="number" data-label="時間"><b>${step.t}</b></td>
      <td data-label="行程"><b>${step.label}</b>${step.sub ? `<br><span class="timeline-note">${step.sub}</span>` : ''}</td>
      <td class="number" data-label="花費">${step.cost || '—'}</td>
      <td class="number" data-label="時長">${step.dur || '—'}</td>
    </tr>`).join('');

  const trainPrice = day.train?.price?.startsWith('PLN') ? day.train.price : day.train?.price;
  const trainHtml = day.train ? `
    <section class="section">
      <div class="section-heading"><span class="section-num">Transport</span><h2>當天交通</h2></div>
      <article class="card card-accent">
        <span class="eyebrow">${day.train.type}${day.train.leg ? ` · ${day.train.leg}` : ''}</span>
        <h3>${day.train.from || ''}${day.train.to ? ` → ${day.train.to}` : ''}</h3>
        <p><b>${day.train.dep} → ${day.train.arr}</b> · ${day.train.dur} · ${escapeHtml(trainPrice)}</p>
      </article>
    </section>` : '';

  const mustBookHtml = day.mustBook.length ? `
    <div class="callout-risk">
      <span class="tag-todo">尚未完成 ${day.mustBook.length} 項</span>
      <h3>這一天要先處理</h3>
      ${renderList(day.mustBook, item => `<li>${item}</li>`)}
    </div>` : `
    <div class="callout-good"><b>這一天沒有待訂項目。</b></div>`;

  const warnHtml = day.warn ? `
    <div class="callout-risk">
      <span class="tag-red">重要風險</span>
      <p>${day.warn}</p>
    </div>` : '';

  const constraintHtml = `
    <section class="section">
      <div class="section-heading"><span class="section-num">Priorities</span><h2>時間彈性</h2></div>
      <div class="grid-wide">
      <article class="card">
        <span class="eyebrow">不能延誤</span>
        <h3>硬性時間</h3>
        ${renderList(day.hardConstraints, item => `<li>${item}</li>`)}
      </article>
      <article class="card">
        <span class="eyebrow">時間不夠時</span>
        <h3>可以壓縮</h3>
        ${renderList(day.compressible, item => `<li>${item}</li>`)}
      </article>
      </div>
    </section>`;

  const eatHtml = day.eat?.length ? `
    <section class="section">
      <div class="section-heading"><span class="section-num">Food</span><h2>順路必吃</h2></div>
      <div class="grid">${day.eat.map(renderEatCard).join('')}</div>
    </section>` : '';

  const extendHtml = day.extend?.length ? `
    <section class="section">
      <div class="section-heading"><span class="section-num">Optional</span><h2>可插入的延伸選項</h2></div>
      ${renderList(day.extend, item => `<li><b>${item.label}</b>${item.when ? `（${item.when}）` : ''}— ${item.why}</li>`)}
    </section>` : '';

  const backupHtml = day.backup?.length ? `
    <section class="section">
      <div class="section-heading"><span class="section-num">Plan B</span><h2>備案</h2></div>
      <div class="grid">${day.backup.map(item => `
        <article class="card">
          <span class="eyebrow">${item.label}</span>
          <h3>${item.where}</h3>
          <p>${item.why}</p>
        </article>`).join('')}
      </div>
    </section>` : '';

  const practicalHtml = day.practical?.length ? `
    <section class="section">
      <div class="section-heading"><span class="section-num">On the ground</span><h2>現場實用提醒</h2></div>
      ${renderList(day.practical, item => `<li>${typeof item === 'string' ? item : Object.values(item).filter(Boolean).join(' · ')}</li>`)}
    </section>` : '';

  const photoHtml = photoSpotsForDay.length ? `
    <section class="section">
      <div class="section-heading"><span class="section-num">Photo</span><h2>拍照建議</h2></div>
      <div class="photo-spot-grid">${photoSpotsForDay.map(spot => `
        <article class="card">
          <span class="eyebrow">${spot.bestTime}</span>
          <h3>${spot.name}</h3>
          <p><b>精確站位：</b>${spot.viewpoint}</p>
          <p><b>拍攝方向：</b>${spot.direction}</p>
          <p><b>光線與構圖：</b>${spot.light}</p>
          <p><a href="${spot.mapUrl}" target="_blank" rel="noopener noreferrer">開啟拍照站位 ↗</a></p>
        </article>`).join('')}
      </div>
    </section>` : '';

  const previous = day.n > 1 ? `<a href="day-${String(day.n - 1).padStart(2, '0')}.html">← Day ${day.n - 1}</a>` : '<span></span>';
  const next = day.n < 8 ? `<a href="day-${String(day.n + 1).padStart(2, '0')}.html">Day ${day.n + 1} →</a>` : '<a href="index.html">回到總覽 →</a>';
  const coverHtml = city?.photo?.hero ? `
      <figure class="journal-day-cover">
        <img src="${escapeHtml(city.photo.hero)}" alt="${escapeHtml(city.name)}城市風景" width="1200" height="800" decoding="async" fetchpriority="high">
        <figcaption>${escapeHtml(city.pl)} · ${escapeHtml(city.vibe)}</figcaption>
      </figure>` : '<div class="journal-day-cover-fallback" aria-hidden="true">POLSKA</div>';
  const detailPhotoHtml = detailPhotoCity?.photo?.detail ? `
    <figure class="city-detail-photo day-detail-photo">
      <img src="${escapeHtml(detailPhotoCity.photo.detail)}" alt="${escapeHtml(detailPhotoCity.photo.detailAlt)}" width="1280" height="${escapeHtml(detailPhotoCity.photo.detailHeight)}" loading="lazy" decoding="async">
      <figcaption>${escapeHtml(detailPhotoCity.photo.detailCaption)} · ${escapeHtml(detailPhotoCity.photo.detailAuthor)} · <a href="${escapeHtml(detailPhotoCity.photo.detailSource)}" target="_blank" rel="noopener noreferrer">圖片來源 ↗</a> · <a href="${escapeHtml(detailPhotoCity.photo.detailLicenseUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(detailPhotoCity.photo.detailLicense)} 授權 ↗</a></figcaption>
    </figure>` : '';

  const bodyHtml = `
    <header class="journal-day-header">
      <div class="journal-day-heading">
        <span class="section-num">Day ${String(day.n).padStart(2, '0')} · ${escapeHtml(day.date)}</span>
        <h1>${escapeHtml(day.title)}</h1>
        <p class="hero-dek">${escapeHtml(day.headline)}</p>
      </div>
${coverHtml}
    </header>

    <nav class="day-shortcuts" aria-label="當日快速導覽">
      <a href="#schedule">時間表</a><a href="#directions">地址與導航</a><a href="#day-preparation">訂票與提醒</a>
    </nav>

    <section class="section" id="schedule">
      <div class="section-heading"><span class="section-num">Schedule</span><h2>當日時間表</h2></div>
      <div class="table-wrap table-wrap-cards">
        <table class="table-editorial table-schedule">
          <thead><tr><th>時間</th><th>行程</th><th>花費</th><th>時長</th></tr></thead>
          <tbody>${stepsHtml}</tbody>
        </table>
      </div>
    </section>

    ${trainHtml}
    <section class="section" id="day-preparation">
      <div class="section-heading"><span class="section-num">Preparation</span><h2>訂票與提醒</h2></div>
      ${mustBookHtml}
      ${warnHtml}
    </section>
    ${constraintHtml}
    ${dayMap ? renderInteractiveMap({ id: `map-day-${day.n}`, title: `Day ${day.n} 行程地圖`, mapData: dayMap, mapChecks, legend, note: dayMap.note }) : ''}
    ${renderOperation(operation)}
    ${eatHtml}
    ${extendHtml}
    ${backupHtml}
    ${practicalHtml}
    ${renderNightChecklist(operation)}
    ${detailPhotoHtml}
    ${renderPhotoGallery(dayGallery.length ? dayGallery : (city?.gallery || []).filter(photo => photo.days?.includes(day.n)), '沿途風景')}
    ${photoHtml}

    <nav class="section-heading" aria-label="每日行程翻頁">${previous}${next}</nav>`;

  return renderLayout({
    title: `Day ${day.n} ${day.title}`,
    activeNav: 'days',
    bodyHtml: bodyHtml.replace(/[ \t]+$/gm, ''),
    pageKind: 'day',
    currentPage: `day-${String(day.n).padStart(2, '0')}.html`,
    extraHead: dayMap ? '<link rel="stylesheet" href="assets/leaflet/leaflet.css">' : '',
  });
}
