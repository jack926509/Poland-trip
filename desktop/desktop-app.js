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

  function renderDetailedItems(items, className) {
    return `<ul class="${className}">${(items || []).map((item) => `<li><strong>${escapeHtml(item.label || item.tag)}</strong>${item.where || item.name ? `<span>${escapeHtml(item.where || item.name)}</span>` : ''}${item.why || item.note ? `<small>${escapeHtml(item.why || item.note)}</small>` : ''}</li>`).join('')}</ul>`;
  }

  function renderDay(trip, dayNumber) {
    const day = buildDayModel(trip, dayNumber);
    const train = day.train ? `<p class="desktop-train"><strong>${escapeHtml(day.train.type)}</strong> ${escapeHtml(day.train.from)} → ${escapeHtml(day.train.to)} · ${escapeHtml(day.train.dep)} → ${escapeHtml(day.train.arr)} · ${escapeHtml(day.train.price)}</p>` : '';
    const steps = day.steps.map((step) => `<li><time>${escapeHtml(step.t)}</time><div><strong>${escapeHtml(step.label)}</strong><span>${escapeHtml(step.sub || step.dur || '')}</span></div><em>${escapeHtml(step.cost || '')}</em></li>`).join('');
    const warning = day.warn ? `<div class="desktop-warning"><strong>注意</strong><p>${escapeHtml(day.warn)}</p></div>` : '';
    return `<section class="desktop-section" data-section="itinerary"><p class="desktop-eyebrow">DZIEŃ ${day.n} · ${escapeHtml(day.date)}</p><h1 id="desktop-heading" tabindex="-1">${escapeHtml(day.city)} · ${escapeHtml(day.title)}</h1><p class="desktop-lead">${escapeHtml(day.headline)}</p>${train}${warning}<div class="desktop-day-grid"><div><h2>逐時路線</h2><ol class="desktop-timeline">${steps}</ol><h2>備案</h2>${renderDetailedItems(day.backup, 'desktop-detail-list')}<h2>實務節點</h2>${renderDetailedItems(day.practical, 'desktop-detail-list')}</div><aside><h2>硬限制</h2>${list(day.hardConstraints, 'desktop-notes')}<h2>必須預訂</h2>${list(day.mustBook, 'desktop-notes')}<h2>可壓縮項目</h2>${list(day.compressible, 'desktop-notes')}<h2>餐食</h2>${list(day.eat, 'desktop-notes')}</aside></div></section>`;
  }

  function renderOverview(trip) {
    return `<section class="desktop-section" data-section="overview"><p class="desktop-eyebrow">CHAPTER 01 · FIELD OVERVIEW</p><h1 id="desktop-heading" tabindex="-1">2026 波蘭八日田野指南</h1><p class="desktop-lead">${escapeHtml(trip.meta.route)} · ${escapeHtml(trip.meta.dateRange)} · ${trip.meta.days} 日 ${trip.meta.nights} 晚</p><div class="desktop-overview-grid"><div><h2>旅行輪廓</h2><p>${escapeHtml(trip.meta.style)}</p><p><strong>航班</strong><br>${escapeHtml(trip.meta.flights)}</p></div><div><h2>高風險日</h2>${list(trip.meta.highestRiskDays, 'desktop-notes')}</div><div><h2>城市索引</h2>${trip.meta.cities.map((city, index) => `<button class="desktop-city-link" data-route="#cities" data-city="${escapeHtml(city)}">0${index + 1} · ${escapeHtml(city)}</button>`).join('')}</div></div></section>`;
  }

  function renderLogistics(trip) {
    const model = buildLogisticsModel(trip);
    const flights = [...(model.flights?.out || []), ...(model.flights?.back || [])];
    return `<section class="desktop-section" data-section="logistics"><p class="desktop-eyebrow">CHAPTER 03 · LOGISTICS</p><h1 id="desktop-heading" tabindex="-1">交通與住宿</h1><div class="desktop-day-grid"><div><h2>跨城交通</h2><div class="desktop-cards">${model.trains.map((train) => `<article><strong>${escapeHtml(train.seg || [train.from, train.to].filter(Boolean).join(' → '))}</strong><p>${escapeHtml(train.date || '')} · ${escapeHtml(train.dep)} → ${escapeHtml(train.arr)}</p><p>${escapeHtml(train.type)} · PLN ${escapeHtml(train.price)}</p></article>`).join('')}</div><h2>住宿區域</h2><div class="desktop-cards">${model.stay.map((stay) => `<article><strong>${escapeHtml(stay.city)} · ${escapeHtml(stay.pick)}</strong><p>${escapeHtml(stay.note)}</p><small>${escapeHtml(stay.tip)}</small></article>`).join('')}</div></div><aside><h2>航班</h2><ul class="desktop-flight-list">${flights.map((flight) => `<li><strong>${escapeHtml(flight.code)} · ${escapeHtml(flight.leg)}</strong><span>${escapeHtml(flight.when)}</span>${flight.dur ? `<small>${escapeHtml(flight.dur)}</small>` : ''}</li>`).join('')}</ul></aside></div></section>`;
  }

  function renderBookings(trip) {
    const model = buildBookingsModel(trip);
    const priorities = (trip.bookingTiers || []).map((tier) => `<article><p class="desktop-eyebrow">${escapeHtml(tier.tier)}</p><strong>${escapeHtml(tier.note)}</strong><ul class="desktop-booking-links">${tier.items.map((item) => `<li><a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.name)} ↗</a></li>`).join('')}</ul></article>`).join('');
    const ticketReference = (model.tickets || []).map((group) => `<article><strong>${escapeHtml(group.city)}</strong><ul class="desktop-notes">${group.items.map(([name, note]) => `<li><span>${escapeHtml(name)}</span><small>${escapeHtml(note)}</small></li>`).join('')}</ul></article>`).join('');
    const schedule = (model.reservations || []).map((item) => `<li><strong>${escapeHtml(item.when)}</strong><span>${escapeHtml(item.what)}</span></li>`).join('');
    return `<section class="desktop-section" data-section="bookings"><p class="desktop-eyebrow">CHAPTER 04 · RESERVATIONS</p><h1 id="desktop-heading" tabindex="-1">門票與預約</h1><p class="desktop-lead">以下為規劃資訊，不代表已完成跨裝置購票。</p><h2>預訂優先順序與官方網站</h2><div class="desktop-cards">${priorities}</div><h2>各城票價參考</h2><div class="desktop-cards">${ticketReference}</div><h2>確認時程</h2><ol class="desktop-booking-schedule">${schedule}</ol></section>`;
  }

  function getCityFood(trip, cityName) {
    return (trip.cityFood || []).find((item) => item.en === cityName || item.city === cityName)?.items || [];
  }

  function shouldRenderImmediately(currentHash, nextHash) {
    return currentHash === nextHash;
  }

  function renderCities(trip, cityName) {
    const chapters = root.POLSKA_DESKTOP_CHAPTERS || {};
    const city = (chapters.cities || {})[cityName] || Object.values(chapters.cities || {})[0];
    const food = getCityFood(trip, cityName);
    return `<section class="desktop-section" data-section="cities"><p class="desktop-eyebrow">CHAPTER 05 · ${escapeHtml(city.eyebrow)}</p><h1 id="desktop-heading" tabindex="-1">${escapeHtml(city.title)}</h1><p class="desktop-lead">${escapeHtml(city.story)}</p><div class="desktop-day-grid"><div><h2>城市筆記</h2>${list(city.notes, 'desktop-notes')}<h2>美食</h2>${renderDetailedItems(food.map((item) => ({ label: item.tag, name: item.name, note: item.note })), 'desktop-detail-list')}</div><aside><h2>切換城市</h2>${trip.meta.cities.map((name) => `<button class="desktop-city-link" data-route="#cities" data-city="${escapeHtml(name)}">${escapeHtml(name)}</button>`).join('')}</aside></div></section>`;
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
      rootElement.querySelectorAll('[data-route]').forEach((button) => button.addEventListener('click', () => {
        if (button.dataset.city) selectedCity = button.dataset.city;
        if (shouldRenderImmediately(root.location.hash, button.dataset.route)) render();
        else root.location.hash = button.dataset.route;
      }));
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
    renderDay,
    renderLogistics,
    renderBookings,
    getCityFood,
    shouldRenderImmediately,
    mountDesktopApp,
  };
}(typeof globalThis !== 'undefined' ? globalThis : window));
