import { mealTiming, renderDiningFacts } from '../lib/dining.mjs';
import { escapeHtml, safeHttpsUrl } from '../lib/html.mjs';
import { bookingProgress } from '../lib/journey.mjs';
import { renderDayContext } from './journey.mjs';
import { dayDining } from '../data/day-dining.js';
import { cityGuides, cityKeysForDay, detectCity } from '../lib/city-guide.mjs';
import { renderFastFoodDayList } from './fast-food.mjs';
import { fastFoodBranches, fastFoodChains, fastFoodHubs } from '../data/dining.js';
import { renderLayout } from './layout.mjs';
import { renderInteractiveMap } from './map.mjs';
import { renderPhotoGallery } from './photo-gallery.mjs';

function renderList(items, renderItem) {
  return items?.length ? `<ul class="check-list">${items.map(renderItem).join('')}</ul>` : '';
}

/**
 * 順路必吃可以是字串（沒有指定店家）或 {text, place, map, note}。
 * text 多半寫成「菜色 @ 店名」，拆開後菜色進小標、店名當標題，讀起來才是一家店而不是一句話。
 * 沒有固定店址的品項（obwarzanek、rogal）只留說明，不硬給連結。
 */
function eatEntry(item) {
  if (typeof item === 'string') return { role: '順路必吃', name: item, eat: true };
  const separator = item.text.includes(' @ ') ? ' @ ' : null;
  const [dish, shop] = separator ? item.text.split(separator) : [null, null];
  const name = dish ? (item.place || shop) : item.text;
  const sameAsName = item.place && (item.text.includes(item.place) || item.place.includes(item.text));
  return {
    role: dish ? `順路必吃 · ${dish}` : '順路必吃',
    name,
    meta: dish ? '' : (sameAsName ? '' : item.place),
    note: item.note,
    map: item.map,
    eat: true,
    facts: item.placeId ? renderDiningFacts(item) : '',
  };
}

function diningEntry(item, day) {
  return { ...item, meta: item.address, timing:mealTiming(item, day), facts:renderDiningFacts(item) };
}

/**
 * 每一列的導航連結放在標題右上角，而不是另起一行的膠囊——
 * 一天最多 8 列，原本每列都多一行連結，光連結就佔掉大半個卡片。
 * 連結可見文字只有「導航」，因此用 aria-label 帶上店名，螢幕閱讀器才知道是哪一家。
 */
function renderDayFoodItem(entry) {
  const url = safeHttpsUrl(entry.map);
  const link = url
    ? `<a class="day-food-map" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="在新視窗開啟 ${escapeHtml(entry.name)} 的 Google Maps 導航">導航 ↗</a>`
    : '';
  return `<li class="day-food-item${entry.eat ? ' day-food-item-eat' : ''}">
      <div class="day-food-head">
        <div class="day-food-title"><span class="eyebrow">${escapeHtml(entry.role)}</span><h4>${escapeHtml(entry.name)}</h4></div>
        ${link}
      </div>
      ${entry.meta ? `<p class="food-map-note">${escapeHtml(entry.meta)}</p>` : ''}
      ${entry.note ? `<p>${escapeHtml(entry.note)}</p>` : ''}
      ${entry.timing ? `<p class="food-map-note">${escapeHtml(entry.timing)}</p>` : ''}${entry.facts || ''}
    </li>`;
}

/**
 * 「當日餐廳候選」與「順路必吃」原本是同一張卡片裡的兩個清單，版式不同、
 * 連結寫法也不同。現在融合成一份「當日餐飲」：候選在前、必吃在後，共用同一種列版式，
 * 必吃以不同色的小標區分。
 */
function renderDayFood(day) {
  const entries = [
    ...(dayDining[day.n] || []).map(item => diningEntry(item, day)),
    ...(day.eat || []).map(eatEntry),
  ];
  if (!entries.length) return '';
  const eatCount = entries.filter(entry => entry.eat).length;
  const summary = [
    entries.length - eatCount ? `${entries.length - eatCount} 家候選` : '',
    eatCount ? `${eatCount} 項順路必吃` : '',
  ].filter(Boolean).join(' · ');

  // 這一天的餐位落在哪幾座城市，就連到哪幾份城市指南（跨城日會有兩條）。
  // 城市頁的同一家店也會標出是哪一天並連回來，兩邊互相對得上。
  const guideCities = [...new Set(entries
    .map(entry => detectCity(entry.meta, entry.map))
    .filter(Boolean))]
    // 跨城日依當天的移動方向排（day.city 寫成「克拉科夫 → 樂斯拉夫」），而不是資料出現順序
    .sort((a, b) => day.city.indexOf(cityGuides[a].name) - day.city.indexOf(cityGuides[b].name));
  const guides = guideCities.length ? `<p class="day-food-guides">${guideCities.map(city =>
    `<a href="${cityGuides[city].file}#city-dining">${cityGuides[city].name}城市指南的完整餐廳清單 →</a>`).join('')}</p>` : '';

  // 候選客滿或太晚時的退路：當天所在城市的連鎖速食，預設收合不佔版面。
  const fastFood = renderFastFoodDayList(cityKeysForDay(day), { branches: fastFoodBranches, chains: fastFoodChains, hubs: fastFoodHubs });

  return `<article class="card day-dining" id="day-food" aria-labelledby="day-food-heading">
    <span class="eyebrow">Dining</span><h3 id="day-food-heading">當日餐飲</h3>
    <p class="food-map-note">${summary}。依當天動線擇一用餐；候選尚未訂位，出發前確認營業與最後點餐時間。</p>
    <ul class="day-food-list">${entries.map(renderDayFoodItem).join('')}</ul>
    ${guides}
    ${fastFood}
  </article>`;
}

function renderOperation(operation, day) {
  if (!operation) return renderDayFood(day);

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
        <div class="operation-route-column">
        <article class="card">
          <span class="eyebrow">Route</span>
          <h3>移動步驟</h3>
          <ol class="operation-routes">${navigation}</ol>
        </article>
        ${renderDayFood(day)}
        </div>
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

export function renderDay(day, photoSpotsForDay = [], operation = null, city = null, detailPhotoCity = null, dayMap = null, mapChecks = {}, legend = {}, dayGallery = [], daylightForDay = null) {
  // 花費／時長常常沒有資料；手機把每欄拆成一行卡片，「—」照樣佔一整行
  // （稽核 M3：Day 2 20+ 步，每步多兩行約 60px）。桌機仍顯示「—」保留欄位
  // 對齊，手機用 data-empty 讓 CSS 直接不渲染那一行，不留空白。
  const stepsHtml = day.steps.map(step => `
    <tr>
      <td class="number" data-label="時間"><b>${step.t}</b></td>
      <td data-label="行程"><b>${step.label}</b>${step.sub ? `<br><span class="timeline-note">${step.sub}</span>` : ''}</td>
      <td class="number" data-label="花費"${step.cost ? '' : ' data-empty'}>${step.cost || '—'}</td>
      <td class="number" data-label="時長"${step.dur ? '' : ' data-empty'}>${step.dur || '—'}</td>
    </tr>`).join('');

  const trainPrice = day.train?.price?.startsWith('PLN') ? day.train.price : day.train?.price;
  const trainHtml = day.train ? `
    <section class="section">
      <div class="section-heading"><span class="section-num">Transport</span><h2>當天交通</h2></div>
      <article class="card card-accent">
        <span class="eyebrow">${day.train.type}${day.train.leg ? ` · ${day.train.leg}` : ''}</span>
        <h3>${day.train.from || ''}${day.train.to ? ` → ${day.train.to}` : ''}</h3>
        <p><b>${day.train.dep} → ${day.train.arr}</b> · ${day.train.dur} · ${escapeHtml(trainPrice)}</p>
        ${day.train.saleOpens ? `<p><b>上次查得 ${escapeHtml(day.train.saleOpens)} 起預售（待複核）</b> · PKP Intercity 官方售票系統查核：${escapeHtml(day.train.saleCheckedAt)}</p>` : ''}
        <p class="action-links"><a href="practical/booking.html#rail-itinerary">訂票與交通頁的完整班次表 →</a></p>
      </article>
    </section>` : '';

  const { pending, confirmed } = bookingProgress(day);
  const mustBookHtml = pending.length ? `
    <div class="callout-risk">
      <span class="tag-todo">尚未完成 ${pending.length} 項</span>
      <h3>這一天要先處理</h3>
      ${renderList(pending, item => `<li>${item}</li>`)}
    </div>` : `
    <div class="callout-good"><b>這一天沒有待訂項目。</b></div>`;

  const warnHtml = day.warn ? `
    <div class="callout-risk">
      <span class="tag-red">重要風險</span>
      <p>${day.warn}</p>
    </div>` : '';

  // 10 月底的波蘭日落在 16:00 上下，戶外行程排不排得下由這張卡決定；
  // 數值取自 essentials.js 的 daylight，逐日頁不自行寫死時間。
  const daylightHtml = daylightForDay ? `
      <article class="card">
        <span class="eyebrow">${escapeHtml(daylightForDay.tz)} · 戶外可用時間</span>
        <h3>日照</h3>
        <ul>
          <li>日出 <b>${escapeHtml(daylightForDay.sunrise)}</b>／日落 <b>${escapeHtml(daylightForDay.sunset)}</b></li>
          <li>藍調時刻至 <b>${escapeHtml(daylightForDay.blueHourEnd)}</b></li>
        </ul>
        <p>${escapeHtml(daylightForDay.note)}</p>
        <p class="source-meta">天文推算值，出發前以天文表複核；非官方公告時刻。</p>
      </article>` : '';

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
      ${daylightHtml}
      </div>
    </section>`;

  const extendHtml = day.extend?.length ? `
    <section class="section">
      <div class="section-heading"><span class="section-num">Optional</span><h2>可插入的延伸選項</h2></div>
      ${renderList(day.extend, item => `<li><b>${item.label}</b>${item.when ? `（${item.when}）` : ''}— ${item.why}${safeHttpsUrl(item.map) ? ` <a href="${safeHttpsUrl(item.map)}" target="_blank" rel="noopener noreferrer">Google Maps 定位 →</a>` : ''}</li>`)}
    </section>` : '';

  const returnOptionsHtml = day.returnOptions?.length ? `
    <section class="section">
      <div class="section-heading"><span class="section-num">Return</span><h2>回程選項</h2></div>
      <p class="lead">導覽約 14:15 結束，以下全部以「14:15 之後發車」為門檻。第一方售票頁在查詢當下無法連線，時刻均為公開資料彙整，購票前請逐項核對。</p>
      <div class="grid-wide">${day.returnOptions.map(item => `
        <article class="card">
          <span class="eyebrow">${escapeHtml(item.rank)}</span>
          <h3>${escapeHtml(item.name)}</h3>
          <p>${escapeHtml(item.detail)}</p>
          <p class="timeline-note">${escapeHtml(item.status)}</p>
          ${safeHttpsUrl(item.url) ? `<p class="action-links"><a href="${safeHttpsUrl(item.url)}" target="_blank" rel="noopener noreferrer">查班次與購票 →</a></p>` : ''}
        </article>`).join('')}
      </div>
    </section>` : '';

  const backupHtml = day.backup?.length ? `
    <section class="section">
      <div class="section-heading"><span class="section-num">Plan B</span><h2>備案</h2></div>
      <div class="grid">${day.backup.map(item => `
        <article class="card">
          <span class="eyebrow">${item.label}</span>
          <h3>${item.where}</h3>
          <p>${item.why}</p>
          ${safeHttpsUrl(item.map) ? `<p class="food-map-links"><a href="${safeHttpsUrl(item.map)}" target="_blank" rel="noopener noreferrer">Google Maps 定位 →</a></p>` : ''}
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

    ${renderDayContext(day)}
    <nav class="day-shortcuts" aria-label="當日快速導覽">
      <a href="#schedule">時間表</a><a href="#day-food">餐飲候選</a><a href="#directions">地址與導航</a><a href="#day-preparation">訂票與提醒</a>
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
      ${confirmed.length ? `<div class="callout-good"><b>已完成預約</b>${renderList(confirmed, item => `<li>${escapeHtml(item)}</li>`)}</div>` : ''}
      ${mustBookHtml}
      ${warnHtml}
      <p class="action-links"><a href="practical/todos.html">全部待辦與查核狀態 →</a><a href="practical/tickets.html">門票價格與開放時間 →</a></p>
    </section>
    ${constraintHtml}
    ${dayMap ? renderInteractiveMap({ id: `map-day-${day.n}`, title: `Day ${day.n} 行程地圖`, mapData: dayMap, mapChecks, legend, note: dayMap.note }) : ''}
    ${renderOperation(operation, day)}
    ${extendHtml}
    ${returnOptionsHtml}
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
