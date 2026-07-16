/* Direction B — iPhone reading companion (responsive web that nails mobile) */
const B_useState = React.useState;
const B_useEffect = React.useEffect;
const B_useMemo = React.useMemo;

/* ── External-link helpers ───────────────────────────────────────── */

// Map Chinese city name → English Latin form for map queries.
const B_CITY_EN = {
  '華沙': 'Warsaw',
  '克拉科夫': 'Kraków',
  '樂斯拉夫': 'Wrocław',
  '波茲南': 'Poznań',
};

// Train station code / shorthand → full station name for map lookup.
const B_STATIONS = {
  'WAW':       'Warszawa Centralna',
  'KRK':       'Kraków Główny',
  'WRO':       'Wrocław Główny',
  'POZ':       'Poznań Główny',
  'Oświęcim':  'Oświęcim Dworzec PKS',
};

// Curated booking / official URLs keyed by Chinese / English fragments
// found in step labels. First match wins.
const B_BOOKING_LINKS = [
  ['Auschwitz',   'https://visit.auschwitz.org/'],
  ['奧斯威辛',     'https://visit.auschwitz.org/'],
  ['瓦維爾',       'https://wawel.krakow.pl/en'],
  ['Wawel',       'https://wawel.krakow.pl/en'],
  ['辛德勒',       'https://mhk.pl/branches/oskar-schindlers-enamel-factory'],
  ['Schindler',   'https://mhk.pl/branches/oskar-schindlers-enamel-factory'],
  ['皇家城堡',     'https://www.zamek-krolewski.pl/en'],
  ['紡織會館',     'https://mnk.pl/en/branches/the-cloth-hall-gallery-of-19th-century-polish-art'],
  ['聖瑪利亞',     'https://mariacki.com/en/'],
  ['老城廣場',     'https://warsawtour.pl/en/'],
  ['美人魚',       'https://warsawtour.pl/en/syrenka-warsawska-en/'],
  ['Pierogi',     'https://www.zapiecek.eu/'],
  ['Zapiecek',    'https://www.zapiecek.eu/'],
  ['Wedel',       'https://www.wedelpijalnie.pl/'],
  ['EIP',         'https://www.intercity.pl/en/'],
  ['IC',          'https://www.intercity.pl/en/'],
  ['Pendolino',   'https://www.intercity.pl/en/'],
  ['SKM',         'https://www.skm.warszawa.pl/en/'],
  ['Lajkonik',    'https://www.lajkonikbus.pl/'],
];

// Detect iOS / iPadOS — used to prefer Apple Maps URL scheme so
// taps deep-link straight into the native Maps app.
const B_isIOS = (() => {
  if (typeof navigator === 'undefined') return false;
  const p = navigator.platform || '';
  if (/iPad|iPhone|iPod/.test(p)) return true;
  // iPadOS 13+ reports as MacIntel + multi-touch
  return p === 'MacIntel' && navigator.maxTouchPoints > 1;
})();

function B_focusCity(city) {
  // Transit days look like "華沙 → 克拉科夫"; pick the destination.
  return (city || '').split('→').pop().trim();
}

function B_mapsURL(label, city) {
  const cleanLabel = (label || '').replace(/^★\s*/, '').replace(/^@\s*/, '').trim();
  const cityKey = B_focusCity(city);
  const cityEn = B_CITY_EN[cityKey] || cityKey;
  // If label already includes the city (or a station code), don't double up.
  const parts = cleanLabel ? [cleanLabel] : [];
  if (cityEn && !cleanLabel.includes(cityEn) && !cleanLabel.includes(cityKey)) parts.push(cityEn);
  parts.push('Poland');
  const q = encodeURIComponent(parts.join(' '));
  return B_isIOS
    ? `https://maps.apple.com/?q=${q}`
    : `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function B_stationMapsURL(code) {
  const full = B_STATIONS[code] || code;
  const q = encodeURIComponent(`${full} train station Poland`);
  return B_isIOS
    ? `https://maps.apple.com/?q=${q}`
    : `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function B_bookingURL(label) {
  const clean = (label || '').replace(/^★\s*/, '');
  const hit = B_BOOKING_LINKS.find(([k]) => clean.includes(k));
  if (hit) return hit[1];
  return `https://www.google.com/search?q=${encodeURIComponent(clean + ' Poland tickets booking')}`;
}

function B_findBookingItem(trip, label) {
  const clean = (label || '').replace(/^★\s*/, '').trim();
  if (!clean) return null;
  const tiers = trip?.bookingTiers || [];
  for (const tier of tiers) {
    const hit = tier.items?.find((item) => clean.includes(item.name) || item.name.includes(clean));
    if (hit) return { ...hit, tier: tier.tier };
  }
  return { name: clean, url: B_bookingURL(clean), tier: '今日項目' };
}

function B_hasBooking(label) {
  const clean = (label || '').replace(/^★\s*/, '');
  return B_BOOKING_LINKS.some(([k]) => clean.includes(k));
}

function B_isStandaloneMode() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

// Pull venue name out of "Dish @ Venue" format. Falls back to whole string.
function B_eatVenue(item) {
  if (!item) return '';
  const at = item.indexOf('@');
  if (at >= 0) return item.slice(at + 1).trim();
  return item;
}

function B_PrimaryNav({ placement, onToday, onItinerary, onTransport, onTickets }) {
  const items = [
    ['今日', onToday], ['行程', onItinerary], ['交通', onTransport], ['訂票', onTickets],
  ];
  const placementClass = placement === 'mobile' ? 'B-mobile-nav' : 'B-desktop-nav';
  return (
    <nav
      className={`B-primary-nav ${placementClass}`}
      aria-label={placement === 'mobile' ? '手機主要導覽' : '網頁主要導覽'}>
      {items.map(([label, action]) => (
        <button type="button" key={label} onClick={action}>{label}</button>
      ))}
    </nav>
  );
}

function B_PreTripGuide({ trip }) {
  const sections = [
    ['航班', [...trip.flights.out, ...trip.flights.back].map((flight) => `${flight.code} · ${flight.leg} · ${flight.when}`)],
    ['住宿區域', trip.stay.map((item) => `${item.city} · ${item.pick} · ${item.note}`)],
    ['安全與緊急資訊', [
      ...trip.safety.emergency.map(([label, value]) => `${label} · ${value}`),
      ...trip.safety.tips.map((item) => `${item.label} · ${item.text}`),
    ]],
    ['實用資訊', trip.practical.map((item) => `${item.tag} · ${item.name} · ${item.note}`)],
    ['常用波蘭語', trip.phrases.map(([zh, pl]) => `${zh} · ${pl}`)],
  ];
  return (
    <section id="B-guide" className="B-pretrip-guide" aria-labelledby="B-guide-title">
      <h2 id="B-guide-title">行前指南</h2>
      {sections.map(([title, rows]) => (
        <details key={title}>
          <summary>{title}</summary>
          <ul>{rows.map((row) => <li key={row}>{row}</li>)}</ul>
        </details>
      ))}
    </section>
  );
}

function B_Companion({ initialDay }) {
  const t = window.TRIP;
  const core = window.PolskaPwaCore;
  const initialNotes = B_useMemo(() => core.readNotes(window.localStorage), [core]);
  const [override, setOverride] = B_useState(initialDay ?? null);
  const [openStep, setOpenStep] = B_useState(null);
  const [tick, setTick] = B_useState(0);
  const [drawerOpen, setDrawerOpen] = B_useState(false);
  const [trainSheet, setTrainSheet] = B_useState(false);
  const [online, setOnline] = B_useState(() => typeof navigator === 'undefined' ? true : navigator.onLine);
  const [standalone, setStandalone] = B_useState(B_isStandaloneMode);
  const [notes, setNotes] = B_useState(initialNotes.notes);
  const [notesPersistent, setNotesPersistent] = B_useState(initialNotes.persistent);
  const scrubRef = React.useRef(null);

  const noteKey = (dn, si) => `${dn}-${si}`;
  const editNote = (dn, si) => {
    const k = noteKey(dn, si);
    const prev = notes[k] || '';
    const v = window.prompt('在這個行程加上備註：', prev);
    if (v === null) return;
    const next = { ...notes };
    const trimmed = v.trim();
    if (trimmed) next[k] = trimmed; else delete next[k];
    setNotes(next);
    setNotesPersistent(core.writeNotes(window.localStorage, next));
  };
  const openExt = (url) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // refresh every minute so the Now widget stays accurate
  B_useEffect(() => {
    const id = setInterval(() => setTick(x => x + 1), 60000);
    return () => clearInterval(id);
  }, []);

  B_useEffect(() => {
    const updateOnline = () => setOnline(navigator.onLine);
    const updateStandalone = () => setStandalone(B_isStandaloneMode());
    window.addEventListener('online', updateOnline);
    window.addEventListener('offline', updateOnline);
    window.matchMedia?.('(display-mode: standalone)').addEventListener?.('change', updateStandalone);
    return () => {
      window.removeEventListener('online', updateOnline);
      window.removeEventListener('offline', updateOnline);
      window.matchMedia?.('(display-mode: standalone)').removeEventListener?.('change', updateStandalone);
    };
  }, []);

  // Close modal surfaces on Escape
  B_useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false);
        setTrainSheet(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Lock body scroll while modal surfaces are open.
  B_useEffect(() => {
    document.body.style.overflow = drawerOpen || trainSheet ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen, trainSheet]);

  const { d, idx, now, next, beforeStart, afterEnd } = B_useMemo(
    () => core.projectTripMoment(t.days, new Date(), override, t.meta),
    [core, t.days, t.meta, override, tick]
  );
  const active = d.n;
  const setActive = (n) => { setOverride(n); setOpenStep(null); setDrawerOpen(false); };
  const hardNow = d.hardConstraints?.[0] || '今日沒有固定硬時間';
  const bookNow = d.mustBook?.length ? d.mustBook.join(' / ') : '無需預先訂票';
  const compressNow = d.compressible?.[0] || '保留彈性休息';
  const backupNow = d.backup?.[0]?.label ? `${d.backup[0].label} · ${d.backup[0].where}` : '無指定備案';
  const ticketItems = B_useMemo(
    () => (d.mustBook || []).map((name) => B_findBookingItem(t, name)).filter(Boolean),
    [d.mustBook, t]
  );
  const nextBookingItems = B_useMemo(() => {
    const current = new Set(d.mustBook || []);
    return (t.bookingTiers || [])
      .flatMap((tier) => (tier.items || []).map((item) => ({ ...item, tier: tier.tier })))
      .filter((item) => !current.has(item.name))
      .slice(0, 3);
  }, [d.mustBook, t.bookingTiers]);

  // Auto-scroll active scrub pill into view when active changes
  B_useEffect(() => {
    const el = scrubRef.current;
    if (!el) return;
    const activePill = el.querySelector('.pill.active');
    if (activePill && activePill.scrollIntoView) {
      activePill.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [active]);

  const liveClock = (() => {
    const n = new Date();
    return `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`;
  })();
  const navActions = {
    onToday: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    onItinerary: () => document.querySelector('.B-timeline')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    onTransport: () => d.train
      ? setTrainSheet(true)
      : document.querySelector('.B-timeline')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    onTickets: () => document.getElementById('B-tickets')?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
  };

  return (
    <div className="B-frame paper-tex">
      <div className="B-status-bar">
        <span>{liveClock}</span>
        <span style={{display:'flex', gap:6, alignItems:'center'}}>
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
            <rect x="0" y="2" width="2" height="6" fill="currentColor"/>
            <rect x="4" y="0" width="2" height="8" fill="currentColor"/>
            <rect x="8" y="-1" width="2" height="9" fill="currentColor"/>
            <rect x="12" y="-2" width="2" height="10" fill="currentColor"/>
          </svg>
          <span style={{fontSize:'.62rem', letterSpacing:'.05em'}}>5G</span>
          <svg width="22" height="10" viewBox="0 0 22 10" fill="none">
            <rect x="0.5" y="0.5" width="18" height="9" rx="2" stroke="currentColor"/>
            <rect x="2" y="2" width="14" height="6" fill="currentColor"/>
            <rect x="19.5" y="3.5" width="1.5" height="3" fill="currentColor"/>
          </svg>
        </span>
      </div>
      <header className="B-head">
        <a className="brand"
           href="#top"
           aria-label="回到頁首"
           onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          POLSKA<span className="dot">.</span>
        </a>
        <button
          type="button"
          className="meta"
          aria-label="顯示完整 8 日行程"
          onClick={() => setDrawerOpen(true)}>
          10/24 → 10/31
        </button>
        <button
          type="button"
          className="menu"
          aria-label="開啟選單"
          aria-expanded={drawerOpen}
          aria-controls="B-drawer"
          onClick={() => setDrawerOpen(true)}>
          <span/><span/><span/>
        </button>
      </header>

      <B_PrimaryNav placement="desktop" {...navActions} />
      <main id="app-main" className="B-web-grid">
        <section className="B-primary-column" aria-label="今日行程">

      <section className="B-today" data-bg={`0${d.n}`} id="top">
        <div className="kicker">Today is</div>
        <div className="day-line">
          <button
            type="button"
            className="day-num"
            aria-label="開啟 8 日行程選單"
            onClick={() => setDrawerOpen(true)}>{d.n}</button>
          <span className="day-of">/ 8 · {d.date}<br/>{d.city}</span>
        </div>
        <h1>{d.title}</h1>
        <p className="head-sub">{d.headline}</p>
        <div className="meta-row">
          <span><strong>{d.weather || '—'}</strong></span>
          <span>{d.tag}</span>
          {d.intensity && <span>強度 · {d.intensity}</span>}
          {d.train && <span>{d.train.type} · {d.train.dur}</span>}
        </div>

        <div className="B-mobile-brief" aria-label="今日快速判讀">
          <div className="brief-card urgent">
            <span className="brief-k">硬時間</span>
            <strong>{hardNow}</strong>
          </div>
          <div className="brief-card">
            <span className="brief-k">必訂票</span>
            <strong>{bookNow}</strong>
          </div>
          <div className="brief-card">
            <span className="brief-k">可壓縮</span>
            <strong>{compressNow}</strong>
          </div>
        </div>

        <div className={`B-pwa-state ${online ? 'online' : 'offline'}`} aria-live="polite">
          <span>{online ? '已連線' : '離線模式'}</span>
          <strong>{standalone ? '主畫面 App' : '可加到主畫面'}</strong>
          <em>{!notesPersistent ? '備註僅保留於本次開啟' : online ? '新版會自動背景快取' : '已快取核心行程與交通資料'}</em>
        </div>

        <button
          type="button"
          className="B-now"
          aria-label="跳到目前進行中的行程"
          onClick={() => {
            setOpenStep(idx);
            const els = document.querySelectorAll('.B-step');
            if (els[idx] && els[idx].scrollIntoView) {
              els[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }}>
          <div className="now-label">
            {beforeStart ? '今日尚未開始' : afterEnd ? '今日已結束' : 'Now · 現在該做什麼'}
          </div>
          <span className="now-time">{now.t}</span>
          <div className="now-task">{now.label.replace(/^★\s*/, '')}</div>
          {now.sub && <div className="now-sub">{now.sub}</div>}
          <div className="now-progress">
            <div className="now-progress-fill" style={{width: `${((idx+1)/d.steps.length)*100}%`}}/>
          </div>
          <div className="now-progress-meta">
            <span>{idx+1} / {d.steps.length}</span>
            <span>今日已完成 {Math.round(((idx)/(d.steps.length-1))*100)}%</span>
          </div>
          {next && (() => {
            const [nh, nm] = next.t.split(':').map(Number);
            const cur = new Date();
            const diff = (nh * 60 + nm) - (cur.getHours() * 60 + cur.getMinutes());
            const inLabel = diff > 0 && diff < 600 ? ` · ${diff} min` : '';
            return (
              <div className="next-up">Next · <strong>{next.t}{inLabel}</strong> {next.label.replace(/^★\s*/, '')}</div>
            );
          })()}
        </button>
      </section>

      <div className="B-scrub" ref={scrubRef} role="tablist" aria-label="日次切換">
        {t.days.map(x => (
          <a key={x.n} href={`#B-day-${x.n}`}
             role="tab"
             aria-selected={x.n === active}
             aria-current={x.n === active ? 'true' : undefined}
             onClick={e => { e.preventDefault(); setActive(x.n); }}
             className={`pill ${x.n === active ? 'active' : ''} ${x.n < active ? 'done' : ''}`}>
            <strong>Day {x.n}</strong>
            <span>{x.date.slice(0,5)}</span>
          </a>
        ))}
      </div>

      {d.train && (() => {
        const isBus = d.train.type === 'BUS';
        const bookHref = isBus ? 'https://www.lajkonikbus.pl/' : 'https://www.intercity.pl/en/';
        return (
          <div
            className="B-train"
            role="button"
            tabIndex={0}
            aria-label={`${isBus ? '巴士' : '火車'}詳情：${d.train.from} 到 ${d.train.to}`}
            onClick={() => setTrainSheet(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setTrainSheet(true);
              }
            }}>
            <div className="seg">
              <span className={`pill ${d.train.type.toLowerCase()}`}>{d.train.type}</span>
              <span>{d.train.date || d.date}</span>
              <span>· {d.train.price}</span>
              <a className="book-cta"
                 href={bookHref}
                 target="_blank" rel="noopener noreferrer"
                 onClick={(e) => e.stopPropagation()}
                 aria-label={`${isBus ? 'Lajkonik 巴士' : 'Intercity 火車'}訂票`}>
                訂票 →
              </a>
            </div>
            <div className="route">
              <a className="stop"
                 href={B_stationMapsURL(d.train.from)}
                 target="_blank" rel="noopener noreferrer"
                 aria-label={`地圖：${B_STATIONS[d.train.from] || d.train.from}`}>
                <strong>{d.train.from}</strong>
                <small>{d.train.dep}</small>
              </a>
              <div className="arrow"><span className="dur">{d.train.dur}</span></div>
              <a className="stop right"
                 href={B_stationMapsURL(d.train.to)}
                 target="_blank" rel="noopener noreferrer"
                 aria-label={`地圖：${B_STATIONS[d.train.to] || d.train.to}`}>
                <strong>{d.train.to}</strong>
                <small>{d.train.arr}</small>
              </a>
            </div>
          </div>
        );
      })()}

      {trainSheet && d.train && (() => {
        const isBus = d.train.type === 'BUS';
        const bookHref = isBus ? 'https://www.lajkonikbus.pl/' : 'https://www.intercity.pl/en/';
        return (
          <div
            className="B-sheet-mask open"
            role="presentation"
            onClick={() => setTrainSheet(false)}>
            <section
              className="B-train-sheet"
              role="dialog"
              aria-modal="true"
              aria-label={`${isBus ? '巴士' : '火車'}詳情`}
              onClick={(e) => e.stopPropagation()}>
              <div className="sheet-grab" />
              <div className="sheet-head">
                <div>
                  <span>{isBus ? 'Bus transfer' : 'Rail transfer'}</span>
                  <h2>{d.train.from} → {d.train.to}</h2>
                </div>
                <button type="button" aria-label="關閉火車詳情" onClick={() => setTrainSheet(false)}>×</button>
              </div>
              <div className="sheet-route">
                <span className={`pill ${d.train.type.toLowerCase()}`}>{d.train.type}</span>
                <strong>{d.train.dep}</strong>
                <span>{d.train.dur}</span>
                <strong>{d.train.arr}</strong>
              </div>
              <dl className="sheet-list">
                <div><dt>日期</dt><dd>{d.train.date || d.date}</dd></div>
                <div><dt>出發</dt><dd>{B_STATIONS[d.train.from] || d.train.from}</dd></div>
                <div><dt>抵達</dt><dd>{B_STATIONS[d.train.to] || d.train.to}</dd></div>
                <div><dt>票價</dt><dd>{d.train.price}</dd></div>
                <div><dt>預訂</dt><dd>{isBus ? 'Lajkonik 官方網站' : 'PKP Intercity 官方網站'}</dd></div>
              </dl>
              <div className="sheet-actions">
                <a href={bookHref} target="_blank" rel="noopener noreferrer">前往訂票</a>
                <a href={B_stationMapsURL(d.train.from)} target="_blank" rel="noopener noreferrer">出發站地圖</a>
              </div>
            </section>
          </div>
        );
      })()}

      <div className="B-timeline">
        {d.steps.map((s, i) => {
          const isStar = s.label.includes('★');
          const cleanLabel = s.label.replace(/^★\s*/, '');
          const myNote = notes[noteKey(d.n, i)];
          const showBooking = isStar || B_hasBooking(s.label);
          let cls = '';
          if (i < idx) cls = 'done';
          else if (i === idx) cls = 'now';
          if (isStar) cls += ' star';
          const open = openStep === i;
          if (open) cls += ' open';
          return (
            <React.Fragment key={i}>
              <div className={`B-step ${cls}`}
                onClick={() => setOpenStep(open ? null : i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setOpenStep(open ? null : i);
                  }
                }}
                role="button" tabIndex={0}
                aria-expanded={open}>
                <span className="t">{s.t}</span>
                <span className="dot"></span>
                <span className="lab">
                  {cleanLabel}
                  {myNote && <span className="note-dot" title="已有備註" aria-label="已有備註">📒</span>}
                  {s.sub && <small>{s.sub}</small>}
                  {(s.cost || s.dur) && (
                    <span className="step-meta">
                      {s.dur && <span className="m-dur">⏱ {s.dur}</span>}
                      {s.cost && <span className="m-cost">💰 {s.cost}</span>}
                    </span>
                  )}
                  <span className="chev">{open ? '−' : '+'}</span>
                </span>
              </div>
              {open && (
                <div className="B-step-detail">
                  <div className="row">
                    <span className="k">時間</span>
                    <span className="v">{s.t}{i > 0 && (() => {
                      const [h1,m1] = d.steps[i-1].t.split(':').map(Number);
                      const [h2,m2] = s.t.split(':').map(Number);
                      const dm = (h2*60+m2)-(h1*60+m1);
                      return dm > 0 ? ` · 距上一站 ${dm} 分` : '';
                    })()}</span>
                  </div>
                  {s.dur && (
                    <div className="row">
                      <span className="k">停留</span>
                      <span className="v">⏱ {s.dur}</span>
                    </div>
                  )}
                  {s.cost && (
                    <div className="row">
                      <span className="k">花費</span>
                      <span className="v">💰 {s.cost}</span>
                    </div>
                  )}
                  {s.sub && (
                    <div className="row">
                      <span className="k">提示</span>
                      <span className="v">{s.sub}</span>
                    </div>
                  )}
                  {myNote && (
                    <div className="row">
                      <span className="k">備註</span>
                      <span className="v" style={{whiteSpace:'pre-wrap'}}>📒 {myNote}</span>
                    </div>
                  )}
                  <div className="row">
                    <span className="k">狀態</span>
                    <span className="v">{i < idx ? '已完成' : i === idx ? '進行中' : '尚未開始'}{isStar ? ' · ★ 重點' : ''}</span>
                  </div>
                  <div className="actions">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); openExt(B_mapsURL(s.label, d.city)); }}>
                      📍 地圖
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); editNote(d.n, i); }}>
                      📒 {myNote ? '編輯備註' : '加備註'}
                    </button>
                    {showBooking && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); openExt(B_bookingURL(s.label)); }}>
                        🎟 訂票 / 官網
                      </button>
                    )}
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {d.warn && <div className="B-warn"><strong>⚠ 注意</strong> · {d.warn}</div>}

        </section>
        <aside className="B-secondary-column" aria-label="行程補充資訊">

      <div className="B-card field-note">
        <div className="label">今日提醒</div>
        <ul>
          <li><span className="field-tag">Plan B</span><strong>{backupNow}</strong></li>
          <li><span className="field-tag">節奏</span><strong>{d.intensity ? `今日強度 ${d.intensity}` : '按體力調整'}</strong></li>
        </ul>
      </div>

      <div className="B-card tickets" id="B-tickets">
        <div className="label">今日訂票</div>
        {ticketItems.length > 0 ? (
          <ul>
            {ticketItems.map((item, i) => (
              <li key={`${item.name}-${i}`}>
                <a href={item.url}
                   target="_blank" rel="noopener noreferrer"
                   aria-label={`訂票或官網：${item.name}`}>
                  <span className="ticket-tier">{item.tier}</span>
                  <strong>{item.name}</strong>
                  <span className="eat-arr" aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="B-empty-card">
            <strong>今日無需預先訂票</strong>
            <span>保留手機電量與離線行程，跨城票和博物館票依總表確認。</span>
          </div>
        )}
        {nextBookingItems.length > 0 && (
          <div className="B-ticket-next">
            <span>下一批要確認</span>
            <div>
              {nextBookingItems.map((item, i) => (
                <a key={`${item.name}-${i}`}
                   href={item.url}
                   target="_blank" rel="noopener noreferrer">
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {d.eat && (
        <div className="B-card eat">
          <div className="label">🍴 今日必吃</div>
          <ul>
            {d.eat.map((e, i) => (
              <li key={i}>
                <a href={B_mapsURL(B_eatVenue(e), d.city)}
                   target="_blank" rel="noopener noreferrer"
                   aria-label={`地圖：${B_eatVenue(e)}`}>
                  {e}
                  <span className="eat-arr" aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {d.backup && d.backup.length > 0 && (
        <div className="B-card backup">
          <div className="label">☂ 備案 / Plan B</div>
          <ul>
            {d.backup.map((b, i) => (
              <li key={i}>
                <a href={B_mapsURL(b.where, d.city)}
                   target="_blank" rel="noopener noreferrer"
                   aria-label={`地圖：${b.where}`}>
                  <strong>{b.label}</strong>
                  <em>{b.where}</em>
                  <span>{b.why}</span>
                  <span className="eat-arr" aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {d.practical && d.practical.length > 0 && (
        <div className="B-card practical">
          <div className="label">🛠 實務節點</div>
          <ul>
            {d.practical.map((p, i) => (
              <li key={i}>
                <a href={B_mapsURL(p.name, d.city)}
                   target="_blank" rel="noopener noreferrer"
                   aria-label={`地圖：${p.name}`}>
                  <span className="t">{p.tag}</span>
                  <strong>{p.name}</strong>
                  <small>{p.note}</small>
                  <span className="eat-arr" aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(() => {
        const focusCityName = B_focusCity(d.city);
        const cs = (t.cityStories || []).find(s => s.city === focusCityName || s.en === focusCityName);
        if (!cs) return null;
        return (
          <details className="B-card B-citystory-detail">
            <summary>
              <strong>{cs.city} · {cs.en}</strong>
              <span className="eat-arr" aria-hidden="true">歷史與現場筆記</span>
            </summary>
            <div className="B-cs-body">
              <ul className="B-cs-onsites">
                {cs.onSite.map((o, i) => <li key={i}>{o}</li>)}
              </ul>
              <p className="B-cs-geo">{cs.geo}</p>
              {cs.stories.map((st, i) => (
                <div className="B-cs-story" key={i}>
                  <strong>{st.title}</strong>
                  <p>{st.text}</p>
                </div>
              ))}
            </div>
          </details>
        );
      })()}

      {(() => {
        const focusCityName = B_focusCity(d.city);
        const cityBackup = (t.foodBackup || []).find(c => c.city === focusCityName);
        if (!cityBackup || !cityBackup.items.length) return null;
        return (
          <details className="B-card B-foodbackup-detail">
            <summary>
              <strong>備援餐廳 · {cityBackup.city}</strong>
              <span className="eat-arr" aria-hidden="true">{cityBackup.items.length} 間</span>
            </summary>
            <ul>
              {cityBackup.items.map((it, i) => (
                <li key={i}>
                  <a href={it.map || B_mapsURL(it.name, d.city)}
                     target="_blank" rel="noopener noreferrer"
                     aria-label={`地圖：${it.name}`}>
                    <span className="ticket-tier">{it.tag}</span>
                    <strong>{it.name}</strong>
                    <small>{it.note}</small>
                    <span className="eat-arr" aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </details>
        );
      })()}

      <B_PreTripGuide trip={t} />
        </aside>
      </main>

      <B_PrimaryNav placement="mobile" {...navActions} />

      <div
        className={`B-drawer-mask ${drawerOpen ? 'open' : ''}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />
      <aside
        id="B-drawer"
        className={`B-drawer ${drawerOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="日次選單">
        <div className="B-drawer-head">
          <span>POLSKA · 8 日</span>
          <button
            type="button"
            className="B-drawer-close"
            aria-label="關閉選單"
            onClick={() => setDrawerOpen(false)}>×</button>
        </div>
        <ul>
          {t.days.map(x => (
            <li key={x.n}>
              <a
                href={`#B-day-${x.n}`}
                className={x.n === active ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setActive(x.n); }}>
                <span>Day {x.n} · {x.title}</span>
                <small>{x.date}</small>
              </a>
            </li>
          ))}
          <li>
            <a href="#B-guide" onClick={() => setDrawerOpen(false)}>
              <span>行前指南</span>
              <small>航班 · 住宿 · 安全</small>
            </a>
          </li>
        </ul>
      </aside>
    </div>
  );
}

window.B_Companion = B_Companion;
