(function (root) {
  const CHAPTERS = ['overview', 'itinerary', 'logistics', 'bookings', 'cities', 'practical', 'about'];

  function routeFor(chapter, day) {
    if (chapter === 'itinerary') {
      const safeDay = Math.max(1, Math.min(8, Number(day) || 1));
      return { chapter, day: safeDay, canonicalHash: `#itinerary/day-${safeDay}` };
    }
    return { chapter, day: null, canonicalHash: `#${chapter}` };
  }

  function normalizeRoute(hash) {
    const value = String(hash || '').replace(/^#/, '');
    const itinerary = /^itinerary(?:\/day-(\d+))?$/.exec(value);
    if (itinerary) return routeFor('itinerary', itinerary[1] || 1);
    if (CHAPTERS.includes(value)) return routeFor(value);
    return routeFor('overview');
  }

  function nextRoute(route, direction) {
    if (!route || route.chapter !== 'itinerary') return null;
    return routeFor('itinerary', Number(route.day) + (direction < 0 ? -1 : 1));
  }

  function buildDayModel(trip, dayNumber) {
    return trip.days.find((day) => day.n === Math.max(1, Math.min(8, Number(dayNumber) || 1)));
  }

  function buildLogisticsModel(trip) {
    return { flights: trip.flights, trains: trip.trains, stay: trip.stay };
  }

  function buildBookingsModel(trip) {
    return { tickets: trip.tickets, reservations: trip.reservations };
  }

  function hasDuplicatedCoreTripData(source) {
    return /\b(?:dep|arr|price)\s*:|2026-10-(?:2[4-9]|3[0-1])/.test(String(source));
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
  }

  function list(items, className) {
    return `<ul class="${className}">${(items || []).map((item) => `<li>${escapeHtml(typeof item === 'string' ? item : item.label)}</li>`).join('')}</ul>`;
  }

  function renderDay(trip, dayNumber) {
    const day = buildDayModel(trip, dayNumber);
    const train = day.train ? `<p class="desktop-train"><strong>${escapeHtml(day.train.type)}</strong> ${escapeHtml(day.train.from)} → ${escapeHtml(day.train.to)} · ${escapeHtml(day.train.dep)} → ${escapeHtml(day.train.arr)} · ${escapeHtml(day.train.price)}</p>` : '';
    const steps = day.steps.map((step) => `<li><time>${escapeHtml(step.t)}</time><div><strong>${escapeHtml(step.label)}</strong><span>${escapeHtml(step.sub || step.dur || '')}</span></div><em>${escapeHtml(step.cost || '')}</em></li>`).join('');
    return `<section class="desktop-section" data-section="itinerary"><p class="desktop-eyebrow">DZIEŃ ${day.n} · ${escapeHtml(day.date)}</p><h1 id="desktop-heading" tabindex="-1">${escapeHtml(day.city)} · ${escapeHtml(day.title)}</h1><p class="desktop-lead">${escapeHtml(day.headline)}</p>${train}<div class="desktop-day-grid"><div><h2>逐時路線</h2><ol class="desktop-timeline">${steps}</ol></div><aside><h2>硬限制</h2>${list(day.hardConstraints, 'desktop-notes')}<h2>餐食</h2>${list(day.eat, 'desktop-notes')}<h2>備案</h2>${list(day.backup, 'desktop-notes')}</aside></div></section>`;
  }

  function renderOverview(trip) {
    return `<section class="desktop-section" data-section="overview"><p class="desktop-eyebrow">CHAPTER 01 · FIELD OVERVIEW</p><h1 id="desktop-heading" tabindex="-1">2026 波蘭八日田野指南</h1><p class="desktop-lead">${escapeHtml(trip.meta.route)} · ${escapeHtml(trip.meta.dateRange)} · ${trip.meta.days} 日 ${trip.meta.nights} 晚</p><div class="desktop-overview-grid"><div><h2>旅行輪廓</h2><p>${escapeHtml(trip.meta.style)}</p><p><strong>航班</strong><br>${escapeHtml(trip.meta.flights)}</p></div><div><h2>高風險日</h2>${list(trip.meta.highestRiskDays, 'desktop-notes')}</div><div><h2>城市索引</h2>${trip.meta.cities.map((city, index) => `<button class="desktop-city-link" data-route="#cities" data-city="${escapeHtml(city)}">0${index + 1} · ${escapeHtml(city)}</button>`).join('')}</div></div></section>`;
  }

  function renderLogistics(trip) {
    const model = buildLogisticsModel(trip);
    return `<section class="desktop-section" data-section="logistics"><p class="desktop-eyebrow">CHAPTER 03 · LOGISTICS</p><h1 id="desktop-heading" tabindex="-1">交通與住宿</h1><div class="desktop-day-grid"><div><h2>跨城交通</h2><div class="desktop-cards">${model.trains.map((train) => `<article><strong>${escapeHtml(train.from)} → ${escapeHtml(train.to)}</strong><p>${escapeHtml(train.date || '')} · ${escapeHtml(train.dep)} → ${escapeHtml(train.arr)}</p><p>${escapeHtml(train.type)} · ${escapeHtml(train.price)}</p></article>`).join('')}</div></div><aside><h2>航班</h2><pre class="desktop-flight">${escapeHtml(JSON.stringify(model.flights, null, 2))}</pre><h2>住宿區域</h2>${list(model.stay, 'desktop-notes')}</aside></div></section>`;
  }

  function renderBookings(trip) {
    const model = buildBookingsModel(trip);
    const items = [...(model.tickets || []), ...(model.reservations || [])];
    return `<section class="desktop-section" data-section="bookings"><p class="desktop-eyebrow">CHAPTER 04 · RESERVATIONS</p><h1 id="desktop-heading" tabindex="-1">門票與預約</h1><p class="desktop-lead">以下為規劃資訊，不代表已完成跨裝置購票。</p><div class="desktop-cards">${items.map((item) => `<article><strong>${escapeHtml(item.name || item.label || item)}</strong><p>${escapeHtml(item.note || item.when || '')}</p>${item.url ? `<a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">開啟官方網站</a>` : ''}</article>`).join('')}</div></section>`;
  }

  function renderCities(trip, cityName) {
    const chapters = root.POLSKA_DESKTOP_CHAPTERS || {};
    const city = (chapters.cities || {})[cityName] || Object.values(chapters.cities || {})[0];
    const food = (trip.cityFood || []).filter((item) => item.city === cityName);
    return `<section class="desktop-section" data-section="cities"><p class="desktop-eyebrow">CHAPTER 05 · ${escapeHtml(city.eyebrow)}</p><h1 id="desktop-heading" tabindex="-1">${escapeHtml(city.title)}</h1><p class="desktop-lead">${escapeHtml(city.story)}</p><div class="desktop-day-grid"><div><h2>城市筆記</h2>${list(city.notes, 'desktop-notes')}<h2>美食</h2>${list(food.map((item) => item.name || item), 'desktop-notes')}</div><aside><h2>切換城市</h2>${trip.meta.cities.map((name) => `<button class="desktop-city-link" data-route="#cities" data-city="${escapeHtml(name)}">${escapeHtml(name)}</button>`).join('')}</aside></div></section>`;
  }

  function renderPractical() {
    const chapters = root.POLSKA_DESKTOP_CHAPTERS || {};
    return `<section class="desktop-section" data-section="practical"><p class="desktop-eyebrow">CHAPTER 06 · PRACTICAL NOTES</p><h1 id="desktop-heading" tabindex="-1">實用資訊</h1><div class="desktop-accordion">${(chapters.practical || []).map(([title, body], index) => `<details ${index === 0 ? 'open' : ''}><summary>${escapeHtml(title)}</summary><p>${escapeHtml(body)}</p></details>`).join('')}</div></section>`;
  }

  function renderAbout() {
    const about = (root.POLSKA_DESKTOP_CHAPTERS || {}).about || { title: '關於波蘭', lead: '', sections: [] };
    return `<section class="desktop-section desktop-about" data-section="about"><p class="desktop-eyebrow">CHAPTER 07 · RZECZPOSPOLITA</p><h1 id="desktop-heading" tabindex="-1">${escapeHtml(about.title)}</h1><p class="desktop-lead">${escapeHtml(about.lead)}</p>${about.sections.map(([title, body]) => `<article><h2>${escapeHtml(title)}</h2><p>${escapeHtml(body)}</p></article>`).join('')}</section>`;
  }

  function mountDesktopApp(rootElement, options) {
    const trip = options?.trip || root.TRIP;
    if (!trip || !Array.isArray(trip.days) || trip.days.length !== 8) throw new Error('TRIP data unavailable');
    let selectedCity = trip.meta.cities[0];
    function render() {
      const route = normalizeRoute(root.location?.hash || '#overview');
      if (root.location?.hash !== route.canonicalHash) root.history?.replaceState?.(null, '', route.canonicalHash);
      const labels = { overview: '總覽', itinerary: '每日行程', logistics: '交通與住宿', bookings: '門票與預約', cities: '美食與城市', practical: '實用資訊', about: '關於波蘭' };
      const content = route.chapter === 'overview' ? renderOverview(trip) : route.chapter === 'itinerary' ? renderDay(trip, route.day) : route.chapter === 'logistics' ? renderLogistics(trip) : route.chapter === 'bookings' ? renderBookings(trip) : route.chapter === 'cities' ? renderCities(trip, selectedCity) : route.chapter === 'practical' ? renderPractical() : renderAbout();
      rootElement.innerHTML = `<div class="desktop-atlas"><header class="desktop-masthead"><div class="desktop-flag" aria-hidden="true"></div><div><span>POLSKA · VOL. I</span><strong>Travel Atlas</strong></div><span>WARSZAWA · KRAKÓW · WROCŁAW · POZNAŃ</span><span class="desktop-stamp">POLSKA<br>2026</span></header><nav class="desktop-nav" aria-label="桌機章節導覽">${CHAPTERS.map((chapter, index) => `<button data-route="#${chapter === 'itinerary' ? 'itinerary/day-1' : chapter}" aria-current="${route.chapter === chapter ? 'page' : 'false'}">0${index + 1} ${labels[chapter]}</button>`).join('')}</nav><main id="desktop-main">${content}</main></div>`;
      rootElement.querySelectorAll('[data-route]').forEach((button) => button.addEventListener('click', () => { if (button.dataset.city) selectedCity = button.dataset.city; root.location.hash = button.dataset.route; }));
      if (route.chapter === 'itinerary') {
        const controls = document.createElement('nav');
        controls.className = 'desktop-day-nav';
        controls.setAttribute('aria-label', '每日行程');
        controls.innerHTML = `<button data-day="-1">← 上一天</button>${trip.days.map((day) => `<button data-day="${day.n}" aria-current="${day.n === route.day ? 'page' : 'false'}">Day ${day.n}</button>`).join('')}<button data-day="1">下一天 →</button>`;
        rootElement.querySelector('#desktop-main').prepend(controls);
        controls.addEventListener('click', (event) => { const button = event.target.closest('button'); if (!button) return; const day = Number(button.dataset.day); root.location.hash = day < 0 ? nextRoute(route, -1).canonicalHash : day === 1 && button.textContent.includes('下一天') ? nextRoute(route, 1).canonicalHash : routeFor('itinerary', day).canonicalHash; });
      }
      rootElement.querySelector('#desktop-heading')?.focus();
    }
    root.addEventListener?.('hashchange', render);
    root.addEventListener?.('keydown', (event) => { const route = normalizeRoute(root.location?.hash); if (route.chapter !== 'itinerary' || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return; event.preventDefault(); root.location.hash = nextRoute(route, event.key === 'ArrowLeft' ? -1 : 1).canonicalHash; });
    render();
  }

  root.PolskaDesktop = {
    CHAPTERS,
    normalizeRoute,
    nextRoute,
    buildDayModel,
    buildLogisticsModel,
    buildBookingsModel,
    hasDuplicatedCoreTripData,
    mountDesktopApp,
  };
}(typeof globalThis !== 'undefined' ? globalThis : window));
