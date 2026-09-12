(() => {
  const root = document.querySelector('[data-journey]');
  if (!root) return;
  const cards = [...root.querySelectorAll('[data-journey-chapter]')];
  const links = [...root.querySelectorAll('[data-journey-jump]')];
  const path = root.querySelector('[data-journey-path]');
  const train = root.querySelector('[data-journey-train]');
  const toggle = root.querySelector('[data-journey-motion]');
  const shell = root.closest('[data-journey-shell]');
  const mobile = matchMedia('(max-width: 700px), (max-height: 500px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const cityNames = ['華沙 Warszawa', '克拉科夫 Kraków', '弗羅茨瓦夫 Wrocław', '波茲南 Poznań'];
  const points = [[355, 115], [302, 355], [105, 285], [115, 105], [355, 115]];
  const lengths = [0];
  for (let i = 1; i < points.length; i++) lengths.push(lengths[i - 1] + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]));
  const total = path.getTotalLength();
  let preference = null;
  try { preference = sessionStorage.getItem('polska-journey-paused'); } catch { /* Optional preference only. */ }
  let paused = preference === null ? mobile.matches : preference === 'true';
  let active = -1;
  let position = 0;
  let target = 0;
  let frame = 0;
  let scrollFrame = 0;
  const noMotion = () => reduced.matches || paused;
  function draw(value) {
    position = value;
    const point = path.getPointAtLength(value);
    train.setAttribute('transform', `translate(${point.x} ${point.y})`);
    path.style.strokeDasharray = `${total} ${total}`;
    path.style.strokeDashoffset = String(total - value);
  }
  function move(value, immediate) {
    cancelAnimationFrame(frame);
    target = value;
    if (immediate || noMotion() || document.hidden || (shell && !shell.open)) { draw(value); return; }
    const start = performance.now();
    const from = position;
    function tick(now) {
      const t = Math.min(1, (now - start) / 850);
      draw(from + (value - from) * (1 - Math.pow(1 - t, 3)));
      if (t < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
  }
  function select(index, immediate = false) {
    if (index === active) return;
    active = index;
    const card = cards[index];
    cards.forEach((item, i) => item.classList.toggle('is-current', i === index));
    links.forEach((link, i) => { if (i === index) link.setAttribute('aria-current', 'step'); else link.removeAttribute('aria-current'); });
    root.querySelector('[data-journey-current-day]').textContent = `DAY ${String(index + 1).padStart(2, '0')} / 08`;
    root.querySelector('[data-journey-current-city]').textContent = cityNames[Number(card.dataset.city)];
    root.querySelector('[data-journey-destination]').textContent = `本日終點：${cityNames[[0, 1, 2, 3, 0][Number(card.dataset.routeEnd)]]}`;
    root.querySelector('[data-journey-stamp]').textContent = card.dataset.stamp;
    root.querySelectorAll('[data-map-city]').forEach(node => node.classList.toggle('is-current', Number(node.dataset.mapCity) === [0, 1, 2, 3, 0][Number(card.dataset.routeEnd)]));
    root.classList.toggle('is-quiet', card.classList.contains('story-quiet'));
    move(lengths[Number(card.dataset.routeEnd)], immediate || card.classList.contains('story-quiet'));
  }
  function syncScroll() {
    scrollFrame = 0;
    if (document.hidden || (shell && !shell.open) || !root.getClientRects().length) return;
    const bounds = root.getBoundingClientRect();
    if (bounds.bottom < 0 || bounds.top > innerHeight) {
      cancelAnimationFrame(frame);
      draw(target);
      return;
    }
    const guide = innerHeight * (innerWidth <= 700 ? 0.6 : 0.42);
    let index = 0;
    cards.forEach((card, i) => { if (card.getBoundingClientRect().top <= guide) index = i; });
    select(index);
  }
  function scheduleScroll() { if (!scrollFrame) scrollFrame = requestAnimationFrame(syncScroll); }
  function syncPreference() {
    root.classList.toggle('motion-paused', noMotion());
    toggle.setAttribute('aria-pressed', String(noMotion()));
    toggle.textContent = reduced.matches ? '系統已減少動態' : paused ? '啟用動畫' : '暫停動畫';
    toggle.disabled = reduced.matches;
    if (noMotion()) { cancelAnimationFrame(frame); draw(target); }
  }
  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    paused = !paused;
    preference = String(paused);
    try { sessionStorage.setItem('polska-journey-paused', String(paused)); } catch { /* Storage may be unavailable. */ }
    syncPreference();
  });
  reduced.addEventListener('change', syncPreference);
  mobile.addEventListener('change', () => {
    if (preference === null) paused = mobile.matches;
    syncPreference();
  });
  function openHashChapter() {
    const hash = location.hash.slice(1);
    if (shell && (hash === shell.id || cards.some(card => card.id === hash))) shell.open = true;
  }
  document.querySelectorAll('[data-journey-open]').forEach(link => link.addEventListener('click', () => { if (shell) shell.open = true; }));
  shell?.addEventListener('toggle', () => {
    if (shell.open) scheduleScroll();
    else { cancelAnimationFrame(frame); draw(target); }
  });
  links.forEach(link => link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    const index = Number(link.dataset.journeyJump);
    const card = cards[index];
    // Use the live id: the standalone builder prefixes ids to prevent collisions.
    history.replaceState(null, '', `#${card.id}`);
    card.scrollIntoView({ behavior: 'instant', block: 'start' });
    card.focus({ preventScroll: true });
    select(index);
  }));
  addEventListener('scroll', scheduleScroll, { passive: true });
  addEventListener('resize', scheduleScroll, { passive: true });
  addEventListener('hashchange', () => { openHashChapter(); scheduleScroll(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(frame); draw(target); } else scheduleScroll(); });
  root.classList.add('journey-ready');
  openHashChapter();
  syncPreference();
  select(0, true);
  syncScroll();
})();
