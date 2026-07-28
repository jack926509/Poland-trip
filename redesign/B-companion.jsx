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

function B_isIOSSafari() {
  if (!B_isIOS || typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /AppleWebKit/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
}

// Pull venue name out of "Dish @ Venue" format. Falls back to whole string.
function B_eatVenue(item) {
  if (!item) return '';
  const at = item.indexOf('@');
  if (at >= 0) return item.slice(at + 1).trim();
  return item;
}

function B_getStorage() {
  try { return window.localStorage; }
  catch (_) { return null; }
}

function B_formatMinutes(mins) {
  const normalized = ((mins % 1440) + 1440) % 1440;
  return `${String(Math.floor(normalized / 60)).padStart(2, '0')}:${String(normalized % 60).padStart(2, '0')}`;
}

function B_useModalFocus(open, containerRef, initialFocusRef, returnFocusRef) {
  const wasOpenRef = React.useRef(false);

  B_useEffect(() => {
    if (open) {
      wasOpenRef.current = true;
      initialFocusRef.current?.focus();
      return;
    }
    if (wasOpenRef.current) {
      wasOpenRef.current = false;
      returnFocusRef.current?.focus();
    }
  }, [open, initialFocusRef, returnFocusRef]);

  B_useEffect(() => {
    if (!open) return undefined;
    const container = containerRef.current;
    if (!container) return undefined;
    const onKeyDown = (e) => {
      if (e.key !== 'Tab') return;
      const focusable = Array.from(container.querySelectorAll(
        'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])'
      )).filter((item) => item.getAttribute('aria-hidden') !== 'true');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && (document.activeElement === first || !container.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      }
      else if (!e.shiftKey && (document.activeElement === last || !container.contains(document.activeElement))) {
        e.preventDefault();
        first.focus();
      }
    };
    container.addEventListener('keydown', onKeyDown);
    return () => container.removeEventListener('keydown', onKeyDown);
  }, [open, containerRef]);
}

function B_PrimaryNav({ placement, active, onChange, onToday, onItinerary, onTransport, onTickets }) {
  const placementClass = placement === 'mobile' ? 'B-mobile-nav' : 'B-desktop-nav';
  if (placement === 'mobile') {
    const tabs = [['home', '首頁'], ['trip', '行程'], ['move', '交通'], ['money', '記帳']];
    return (
      <nav className={`B-primary-nav ${placementClass}`} aria-label="手機主要導覽">
        {tabs.map(([key, label]) => (
          <button
            type="button"
            key={key}
            className={active === key ? 'active' : ''}
            aria-current={active === key ? 'page' : undefined}
            onClick={() => onChange(key)}>
            {label}
          </button>
        ))}
      </nav>
    );
  }
  const items = [
    ['今日', onToday], ['行程', onItinerary], ['交通', onTransport], ['訂票', onTickets],
  ];
  return (
    <nav className={`B-primary-nav ${placementClass}`} aria-label="網頁主要導覽">
      {items.map(([label, action]) => (
        <button type="button" key={label} onClick={action}>{label}</button>
      ))}
    </nav>
  );
}

function B_Hero(props) {
  // 方案 A：照片 hero 取代漸層佔位。輪播 index state 與
  // prefers-reduced-motion 判斷現行行為正確、不動判斷邏輯，只換視覺層
  // （下方 return 從多張漸層 slide 換成單張真實城市照）。
  var cities = ['華沙', '克拉科夫', '樂斯拉夫', '波茲南'];
  var slides = ['hs-waw', 'hs-krk', 'hs-wro', 'hs-poz'];
  var reduce = false;
  try { reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var idxState = React.useState(0);
  var idx = idxState[0], setIdx = idxState[1];
  React.useEffect(function () {
    if (reduce) return undefined;
    var id = setInterval(function () { setIdx(function (i) { return (i + 1) % slides.length; }); }, 3200);
    return function () { clearInterval(id); };
  }, [reduce]);
  var city = props.city;
  var day = props.day;
  return (
    <div className="B-hero-photo">
      <img src={city.photo.hero} alt={`${city.name} ${city.pl}`} loading="lazy" width="1200" height="800" />
      <div className="B-hero-veil" />
      <div className="B-hero-text">
        <p className="B-hero-kicker B-num">DAY {day.n} · {day.date}</p>
        <h2 className="B-num">{city.name}</h2>
        <p className="B-hero-sub">{city.pl} · {day.tag}</p>
      </div>
    </div>
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
    <section className="B-pretrip-guide">
      {sections.map(([title, rows]) => (
        <details key={title}>
          <summary>{title}</summary>
          <ul>{rows.map((row) => <li key={row}>{row}</li>)}</ul>
        </details>
      ))}
    </section>
  );
}

/* Task 9: 首頁右上「⋯」選單裡的六個工具，與可返回子頁容器共用 */
const B_TOOLS = [
  ['photomap', '拍照清單', 'PHOTO'],
  ['fx', '匯率換算', 'FX RATE'],
  ['packing', '打包清單', 'PACKING'],
  ['sos', 'SOS 緊急卡', 'EMERGENCY'],
  ['info', '實用資訊', 'INFO'],
  ['guide', '行前指南', 'GUIDE'],
];

const SUBPAGE_TITLES = {
  photomap: '拍照清單',
  fx: '匯率換算',
  packing: '打包清單',
  sos: 'SOS 緊急卡',
  info: '實用資訊',
  guide: '行前指南',
};

function B_Subpage({ title, onBack, panelRef, closeRef, children }) {
  return (
    <div className="B-subpage-mask" role="dialog" aria-modal="true" aria-label={title} ref={panelRef}>
      <div className="B-subpage">
        <header className="B-subpage-head">
          <button type="button" className="B-subpage-back" ref={closeRef} onClick={onBack} aria-label="返回更多">‹ 返回</button>
          <h2>{title}</h2>
        </header>
        <div className="B-subpage-body">{children}</div>
      </div>
    </div>
  );
}

/* Task 9: 首頁右上「⋯」開啟的工具選單（取代原「更多」分頁的工具方格） */
function B_ToolGrid({ onOpen, onClose, panelRef, closeRef }) {
  return (
    <div className="B-tools-menu" role="dialog" aria-modal="true" aria-label="更多工具" ref={panelRef}>
      <div className="B-tools-menu-panel">
        <div className="B-tools-menu-head">
          <h3>更多工具</h3>
          <button type="button" ref={closeRef} onClick={onClose} aria-label="關閉">×</button>
        </div>
        <ul>
          {B_TOOLS.map(([key, label, kicker]) => (
            <li key={key}>
              <button type="button" onClick={(ev) => onOpen(key, ev)}>
                <span className="B-tools-menu-label">{label}</span>
                <span className="B-tools-menu-kicker">{kicker}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* Task 5: 記帳子頁（完整功能） */
function B_Expense({ storage }) {
  const core = window.PolskaPwaCore;
  const days = (window.TRIP && window.TRIP.days) || [];
  const [expenses, setExpenses] = B_useState(() => core.readJSON(storage, 'polska.expenses.v1', []));
  const [settings] = B_useState(() => core.readJSON(storage, 'polska.settings.v1', core.DEFAULT_SETTINGS));
  const [filterDay, setFilterDay] = B_useState('all');
  const [formOpen, setFormOpen] = B_useState(false);
  const [persistOk, setPersistOk] = B_useState(true);
  const [formError, setFormError] = B_useState('');
  const [form, setForm] = B_useState(() => ({
    item: '', amountPLN: '', category: core.EXPENSE_CATEGORIES[0].key,
    day: days[0] ? days[0].n : 1, method: '現金',
  }));

  const totals = B_useMemo(() => core.expenseTotals(expenses), [core, expenses]);
  const budget = B_useMemo(
    () => core.budgetStatus(totals.totalPLN, settings.fxRate, settings.budgetTWD),
    [core, totals.totalPLN, settings.fxRate, settings.budgetTWD]
  );
  const totalTWD = core.plnToTwd(totals.totalPLN, settings.fxRate);
  const filtered = filterDay === 'all' ? expenses : expenses.filter((e) => e.day === filterDay);
  const catLabel = (key) => (core.EXPENSE_CATEGORIES.find((c) => c.key === key) || {}).label || key;

  const persist = (next) => {
    setExpenses(next);
    setPersistOk(core.writeJSON(storage, 'polska.expenses.v1', next));
  };

  const submitForm = (e) => {
    e.preventDefault();
    const amount = Number(form.amountPLN);
    if (!form.item.trim()) { setFormError('請填品項名稱'); return; }
    if (!isFinite(amount) || amount <= 0) { setFormError('金額請填大於 0 的數字'); return; }
    setFormError('');
    const entry = {
      id: Date.now() + Math.random(),
      day: Number(form.day),
      category: form.category,
      item: form.item.trim(),
      amountPLN: amount,
      method: form.method,
      ts: Date.now(),
    };
    persist([entry, ...expenses]);
    setForm({ item: '', amountPLN: '', category: form.category, day: Number(form.day), method: form.method });
    setFormOpen(false);
  };

  const removeExpense = (id) => persist(expenses.filter((e) => e.id !== id));

  return (
    <div className="B-expense">
      {!persistOk && <p className="B-expense-storage-warn">目前無法儲存，本次紀錄僅暫存</p>}

      <div className="B-expense-total">
        <span className="total-pln">{totals.totalPLN.toFixed(2)} PLN</span>
        <span className="total-twd">≈ NT${totalTWD}</span>
        <span className="total-rate">1 PLN ≈ NT${settings.fxRate}</span>
        <div className="B-budget-bar">
          <div
            className={`fill${budget.over ? ' is-over' : ''}`}
            style={{ width: `${Math.min(budget.ratio, 1) * 100}%` }}
          />
        </div>
        <span className="B-budget-label">已花 NT${budget.spentTWD} / 預算 NT${budget.budgetTWD}</span>
      </div>

      <div className="B-cat-grid">
        {core.EXPENSE_CATEGORIES.map((c) => (
          <div className="B-cat-tile" key={c.key}>
            <span className="label">{c.label}</span>
            <span className="amt">NT${core.plnToTwd(totals.byCategory[c.key], settings.fxRate)}</span>
          </div>
        ))}
      </div>

      <div className="B-day-filter" role="group" aria-label="依日期篩選記帳列表">
        <button type="button" className={`pill${filterDay === 'all' ? ' active' : ''}`} onClick={() => setFilterDay('all')}>全部</button>
        {days.map((d) => (
          <button
            type="button" key={d.n}
            className={`pill${filterDay === d.n ? ' active' : ''}`}
            onClick={() => setFilterDay(d.n)}>
            Day{d.n}
          </button>
        ))}
      </div>

      <div className="B-expense-list">
        {filtered.length === 0 && <p className="B-expense-empty">尚無記帳紀錄</p>}
        {filtered.map((e) => (
          <div className="B-expense-row" key={e.id}>
            <div className="item">
              <span className="name">{e.item}</span>
              <span className="meta">
                <span className="cat">{catLabel(e.category)}</span>
                {' · '}
                <span className="method">{e.method}</span>
                {' · '}
                <span className="day">Day{e.day}</span>
              </span>
            </div>
            <div className="amounts">
              <span className="amt">{e.amountPLN} PLN</span>
              <span className="twd">≈NT${core.plnToTwd(e.amountPLN, settings.fxRate)}</span>
            </div>
            <button type="button" className="del" aria-label={`刪除記帳：${e.item}`} onClick={() => removeExpense(e.id)}>✕</button>
          </div>
        ))}
      </div>

      {formOpen && (
        <form className="B-expense-form" onSubmit={submitForm} aria-label="新增記帳">
          <label>
            品項
            <input type="text" value={form.item} onChange={(ev) => setForm({ ...form, item: ev.target.value })} required />
          </label>
          <div className="row">
            <label>
              金額（PLN）
              <input
                type="number" min="0" step="0.01" inputMode="decimal"
                value={form.amountPLN}
                onChange={(ev) => setForm({ ...form, amountPLN: ev.target.value })}
                required />
            </label>
            <label>
              分類
              <select value={form.category} onChange={(ev) => setForm({ ...form, category: ev.target.value })}>
                {core.EXPENSE_CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </label>
          </div>
          <div className="row">
            <label>
              Day
              <select value={form.day} onChange={(ev) => setForm({ ...form, day: Number(ev.target.value) })}>
                {days.map((d) => <option key={d.n} value={d.n}>{`Day${d.n}（${d.date}）`}</option>)}
              </select>
            </label>
            <label>
              付款方式
              <select value={form.method} onChange={(ev) => setForm({ ...form, method: ev.target.value })}>
                <option value="現金">現金</option>
                <option value="信用卡">信用卡</option>
                <option value="行動支付">行動支付</option>
              </select>
            </label>
          </div>
          {formError && <p className="B-form-error" role="alert">{formError}</p>}
          <div className="actions">
            <button type="button" className="cancel" onClick={() => { setFormOpen(false); setFormError(''); }}>取消</button>
            <button type="submit" className="submit">儲存</button>
          </div>
        </form>
      )}

      <button type="button" className="B-fab" onClick={() => { setFormOpen((v) => !v); setFormError(''); }}>＋新增記帳</button>
    </div>
  );
}
/* Task 7: Photo Map 城市打卡（本機持久化） */
function B_PhotoMap({ storage }) {
  const core = window.PolskaPwaCore;
  const cities = Object.keys(B_CITY_EN);
  const [checkins, setCheckins] = B_useState(() => core.readJSON(storage, 'polska.photomap.v1', {}));
  const [storeOk, setStoreOk] = B_useState(true);

  const doneCount = cities.filter((city) => checkins[city]).length;

  const toggle = (city) => {
    const next = { ...checkins, [city]: !checkins[city] };
    setCheckins(next);
    setStoreOk(core.writeJSON(storage, 'polska.photomap.v1', next));
  };

  return (
    <div className="B-photomap">
      {!storeOk && <p className="B-store-warn">目前無法儲存，這次的變更只在這個畫面有效</p>}
      <p className="B-photomap-head">已打卡 {doneCount}/{cities.length}</p>
      {cities.map((city) => {
        const done = Boolean(checkins[city]);
        return (
          <div className={`B-photomap-city${done ? ' is-done' : ''}`} key={city}>
            <div className="B-photomap-name">
              <strong>{city}</strong>
              <span className="en">{B_CITY_EN[city]}</span>
            </div>
            <button
              type="button"
              className="B-photomap-toggle"
              aria-pressed={done}
              onClick={() => toggle(city)}>
              {done ? '已打卡 ✓' : '打卡'}
            </button>
          </div>
        );
      })}
    </div>
  );
}

/* Task 6: 匯率換算子頁（與記帳共用 polska.settings.v1） */
function B_FxTool({ storage }) {
  const core = window.PolskaPwaCore;
  const [settings, setSettings] = B_useState(() => core.readJSON(storage, 'polska.settings.v1', core.DEFAULT_SETTINGS));
  const [pln, setPln] = B_useState('100');
  const [twd, setTwd] = B_useState(() => String(core.plnToTwd(100, settings.fxRate)));
  const [storeOk, setStoreOk] = B_useState(true);

  // 匯率為空或非正數視為「尚未設定」，換算欄不可靜默顯示 0——見 Task 6 審查問題 1。
  const rateNum = Number(settings.fxRate);
  const rateValid = settings.fxRate !== '' && isFinite(rateNum) && rateNum > 0;

  const onPlnChange = (ev) => {
    const v = ev.target.value;
    setPln(v);
    const n = Number(v);
    setTwd(rateValid && isFinite(n) && v !== '' ? String(core.plnToTwd(n, rateNum)) : '');
  };

  const onTwdChange = (ev) => {
    const v = ev.target.value;
    setTwd(v);
    const n = Number(v);
    setPln(rateValid && isFinite(n) && v !== '' ? (n / rateNum).toFixed(2) : '');
  };

  const onRateChange = (ev) => {
    const v = ev.target.value;
    const rate = Number(v);
    const nextSettings = { ...settings, fxRate: v === '' ? '' : rate };
    setSettings(nextSettings);
    const nextRateValid = v !== '' && isFinite(rate) && rate > 0;
    if (!nextRateValid) { setTwd(''); return; }
    setStoreOk(core.writeJSON(storage, 'polska.settings.v1', nextSettings));
    const p = Number(pln);
    if (isFinite(p) && pln !== '') setTwd(String(core.plnToTwd(p, rate)));
  };

  return (
    <div className="B-fx">
      {!storeOk && <p className="B-store-warn">目前無法儲存，這次的變更只在這個畫面有效</p>}
      <label className="B-fx-input">
        PLN
        <input
          type="number" inputMode="decimal" min="0" step="0.01"
          value={pln} onChange={onPlnChange} aria-label="茲羅提金額" />
      </label>
      <label className="B-fx-input">
        TWD
        <input
          type="number" inputMode="decimal" min="0" step="1"
          value={twd} onChange={onTwdChange}
          placeholder={rateValid ? undefined : '—'}
          aria-label="台幣金額" />
      </label>
      <label className="B-fx-rate">
        1 PLN =
        <input
          type="number" inputMode="decimal" min="0" step="0.01"
          value={settings.fxRate} onChange={onRateChange} aria-label="可調匯率" />
        TWD
      </label>
      {!rateValid && (
        <p className="B-fx-hint" role="status">請先設定有效匯率（大於 0），換算結果暫不顯示</p>
      )}
    </div>
  );
}

/* Task 6: 打包清單子頁（分類 checkbox，本機持久化） */
function B_Packing({ storage }) {
  const core = window.PolskaPwaCore;
  const packingDefault = (window.TRIP && window.TRIP.packingDefault) || {};
  const [checked, setChecked] = B_useState(() => core.readJSON(storage, 'polska.packing.v1', {}));
  const [storeOk, setStoreOk] = B_useState(true);

  // key 用「分類::項目」而非純項目文字，避免不同分類的同名項目互相污染勾選狀態
  // （見 Task 6 審查問題 2）。
  const packKey = (group, item) => `${group}::${item}`;

  const toggle = (group, item) => {
    const key = packKey(group, item);
    const next = { ...checked, [key]: !checked[key] };
    setChecked(next);
    setStoreOk(core.writeJSON(storage, 'polska.packing.v1', next));
  };

  return (
    <div className="B-packing">
      {!storeOk && <p className="B-store-warn">目前無法儲存，這次的變更只在這個畫面有效</p>}
      {Object.entries(packingDefault).map(([group, items]) => {
        const packedCount = items.filter((item) => checked[packKey(group, item)]).length;
        return (
          <div className="B-packing-group" key={group}>
            <h3>
              <span>{group}</span>
              <span>已打包 {packedCount}/{items.length}</span>
            </h3>
            {items.map((item) => (
              <label key={item}>
                <input
                  type="checkbox"
                  checked={Boolean(checked[packKey(group, item)])}
                  onChange={() => toggle(group, item)} />
                {item}
              </label>
            ))}
          </div>
        );
      })}
    </div>
  );
}

/* Task 7: SOS 緊急卡 — 讀 trip.safety，缺欄位不渲染、不報錯 */
function B_Sos({ trip }) {
  const safety = (trip && trip.safety) || {};
  const emergency = Array.isArray(safety.emergency) ? safety.emergency : [];
  const embassy = Array.isArray(safety.embassy) ? safety.embassy : [];
  const tips = Array.isArray(safety.tips) ? safety.tips : [];
  const empty = emergency.length === 0 && embassy.length === 0 && tips.length === 0;

  return (
    <div className="B-sos">
      {emergency.length > 0 && (
        <section className="B-sos-section">
          <h3>緊急電話</h3>
          {emergency.map(([label, number]) => (
            <a
              key={label}
              className="B-sos-call"
              href={`tel:${String(number).replace(/\s+/g, '')}`}>
              <span>{label}</span>
              <span>{number}</span>
            </a>
          ))}
        </section>
      )}
      {embassy.length > 0 && (
        <section className="B-sos-section">
          <h3>駐波蘭代表處</h3>
          {embassy.map(([label, value]) => (
            <div className="B-sos-tip" key={label}>
              <strong>{label}</strong>：{value}
            </div>
          ))}
        </section>
      )}
      {tips.length > 0 && (
        <section className="B-sos-section">
          <h3>安全提醒</h3>
          {tips.map((tip) => (
            <div className="B-sos-tip" key={tip.label}>
              <strong>{tip.label}</strong>：{tip.text}
            </div>
          ))}
        </section>
      )}
      {empty && <p className="B-sos-empty">尚無安全資料</p>}
    </div>
  );
}

/* Task 7: 實用資訊 — trip.practical（頂層）＋ trip.about（電壓/小費等）＋ trip.phrases（波蘭語） */
function B_Info({ trip }) {
  const practical = Array.isArray(trip && trip.practical) ? trip.practical : [];
  const about = Array.isArray(trip && trip.about) ? trip.about : [];
  const phrases = Array.isArray(trip && trip.phrases) ? trip.phrases : [];
  const empty = practical.length === 0 && about.length === 0 && phrases.length === 0;

  return (
    <div className="B-info">
      {about.length > 0 && (
        <section className="B-info-section">
          <h3>旅行小抄</h3>
          {about.map(([label, value]) => (
            <div className="B-info-about" key={label}>
              <span className="label">{label}</span>
              <span className="value">{value}</span>
            </div>
          ))}
        </section>
      )}
      {practical.length > 0 && (
        <section className="B-info-section">
          <h3>實用資訊</h3>
          {practical.map((item) => (
            <div className="B-info-practical" key={item.name || item.tag}>
              <span className="tag">{item.tag}</span>
              <strong>{item.name}</strong>
              {item.note && <p>{item.note}</p>}
            </div>
          ))}
        </section>
      )}
      {phrases.length > 0 && (
        <section className="B-info-section">
          <h3>波蘭語小抄</h3>
          {phrases.map(([zh, pl, pron]) => (
            <div className="B-info-phrase" key={zh}>
              <span className="zh">{zh}</span>
              <span className="pl">{pl}{pron ? `（${pron}）` : ''}</span>
            </div>
          ))}
        </section>
      )}
      {empty && <p className="B-info-empty">尚無實用資訊</p>}
    </div>
  );
}

function B_Companion({ initialDay }) {
  const t = window.TRIP;
  const core = window.PolskaPwaCore;
  const storage = B_useMemo(B_getStorage, []);
  const initialNotes = B_useMemo(() => core.readNotes(storage), [core, storage]);
  const [override, setOverride] = B_useState(initialDay ?? null);
  const [activeTab, setActiveTab] = B_useState('home');
  const [openStep, setOpenStep] = B_useState(null);
  const [tick, setTick] = B_useState(0);
  const [drawerOpen, setDrawerOpen] = B_useState(false);
  const [trainSheet, setTrainSheet] = B_useState(false);
  const [subpage, setSubpage] = B_useState(null);
  const [toolsOpen, setToolsOpen] = B_useState(false);
  const [online, setOnline] = B_useState(() => typeof navigator === 'undefined' ? true : navigator.onLine);
  const [standalone, setStandalone] = B_useState(B_isStandaloneMode);
  const [pwaStatus, setPwaStatus] = B_useState(() => window.PolskaPwaState?.status || ('serviceWorker' in navigator ? 'loading' : 'unsupported'));
  const [waitingWorker, setWaitingWorker] = B_useState(() => window.PolskaPwaState?.waitingWorker || null);
  const [updateFailed, setUpdateFailed] = B_useState(() => Boolean(window.PolskaPwaState?.updateError));
  const [installStatus, setInstallStatus] = B_useState(() => B_isStandaloneMode() ? 'installed' : 'browser');
  const [toast, setToast] = B_useState(null);
  const [showInstallHint, setShowInstallHint] = B_useState(() => B_isIOSSafari() && !B_isStandaloneMode());
  const [notes, setNotes] = B_useState(initialNotes.notes);
  const [notesPersistent, setNotesPersistent] = B_useState(initialNotes.persistent);
  const [expenses, setExpenses] = B_useState(() => core.readJSON(storage, 'polska.expenses.v1', []));
  const [expSettings, setExpSettings] = B_useState(() => core.readJSON(storage, 'polska.settings.v1', core.DEFAULT_SETTINGS));
  const scrubRef = React.useRef(null);
  const drawerRef = React.useRef(null);
  const drawerCloseRef = React.useRef(null);
  const drawerReturnFocusRef = React.useRef(null);
  const trainSheetRef = React.useRef(null);
  const trainCloseRef = React.useRef(null);
  const trainReturnFocusRef = React.useRef(null);
  const installPromptRef = React.useRef(null);
  const subpageRef = React.useRef(null);
  const subpageCloseRef = React.useRef(null);
  const subpageReturnFocusRef = React.useRef(null);
  const toolsMenuRef = React.useRef(null);
  const toolsMenuCloseRef = React.useRef(null);
  const toolsBtnRef = React.useRef(null);

  B_useModalFocus(drawerOpen, drawerRef, drawerCloseRef, drawerReturnFocusRef);
  B_useModalFocus(trainSheet, trainSheetRef, trainCloseRef, trainReturnFocusRef);
  // toolsOpen 的焦點契約要在 subpage 之前呼叫：從工具選單直接點開子頁時，
  // 兩個 state 在同一次 commit 內先關後開，effect 依宣告順序執行，
  // 讓子頁的「初次對焦」效果最後跑，焦點才會停在子頁而不是被選單搶回。
  B_useModalFocus(toolsOpen, toolsMenuRef, toolsMenuCloseRef, toolsBtnRef);
  B_useModalFocus(!!subpage, subpageRef, subpageCloseRef, subpageReturnFocusRef);

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
    setNotesPersistent(core.writeNotes(storage, next));
  };
  const openDrawer = (e) => {
    drawerReturnFocusRef.current = e.currentTarget;
    setDrawerOpen(true);
  };
  const openTrainSheet = (e) => {
    trainReturnFocusRef.current = e.currentTarget;
    setTrainSheet(true);
  };
  const openExt = (url) => {
    if (!url) return;
    if (!online) {
      setToast('目前離線；站名與地址仍可在本頁查看');
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  const dismissInstallHint = () => setShowInstallHint(false);
  const applyUpdate = () => {
    if (!waitingWorker) return;
    window.PolskaPwaState?.applyUpdate?.();
  };
  const installApp = async () => {
    const promptEvent = installPromptRef.current;
    if (!promptEvent) {
      setInstallStatus('browser');
      return;
    }
    try {
      await promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      setInstallStatus(outcome === 'accepted' ? 'installing' : 'browser');
    }
    catch (_) {
      setInstallStatus('browser');
    }
    finally {
      if (installPromptRef.current === promptEvent) installPromptRef.current = null;
    }
  };
  const interceptOfflineLink = (e) => {
    if (online) return;
    const link = e.target.closest?.('a[target="_blank"]');
    if (!link) return;
    e.preventDefault();
    e.stopPropagation();
    setToast('目前離線；站名與地址仍可在本頁查看');
  };

  // refresh every minute so the Now widget stays accurate
  B_useEffect(() => {
    const id = setInterval(() => setTick(x => x + 1), 60000);
    return () => clearInterval(id);
  }, []);

  B_useEffect(() => {
    const onReady = () => setPwaStatus('ready');
    const onUpdateReady = (event) => {
      setWaitingWorker(event.detail?.worker || null);
      setUpdateFailed(false);
    };
    const onUpdateError = () => {
      setPwaStatus('ready');
      setWaitingWorker(null);
      setUpdateFailed(true);
    };
    const onError = () => setPwaStatus('error');
    window.addEventListener('pwa-ready', onReady);
    window.addEventListener('pwa-update-ready', onUpdateReady);
    window.addEventListener('pwa-update-error', onUpdateError);
    window.addEventListener('pwa-error', onError);
    const current = window.PolskaPwaState;
    if (current) {
      setPwaStatus(current.status);
      setWaitingWorker(current.waitingWorker || null);
      setUpdateFailed(Boolean(current.updateError));
    }
    return () => {
      window.removeEventListener('pwa-ready', onReady);
      window.removeEventListener('pwa-update-ready', onUpdateReady);
      window.removeEventListener('pwa-update-error', onUpdateError);
      window.removeEventListener('pwa-error', onError);
    };
  }, []);

  B_useEffect(() => {
    const onBeforeInstallPrompt = (event) => {
      event.preventDefault();
      installPromptRef.current = event;
      setInstallStatus('installable');
    };
    const onAppInstalled = () => {
      installPromptRef.current = null;
      setInstallStatus('installed');
      setStandalone(true);
      setShowInstallHint(false);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  B_useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(id);
  }, [toast]);

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
      if (e.key === 'Escape' && subpage) { setSubpage(null); return; }
      if (e.key === 'Escape' && toolsOpen) { setToolsOpen(false); return; }
      if (e.key === 'Escape' && trainSheet) { setTrainSheet(false); return; }
      if (e.key === 'Escape' && drawerOpen) setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen, trainSheet, subpage, toolsOpen]);

  // Lock body scroll while modal surfaces are open.
  B_useEffect(() => {
    document.body.style.overflow = drawerOpen || trainSheet || subpage || toolsOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen, trainSheet, subpage, toolsOpen]);

  // 記帳/預算會在「記帳」分頁被新增或修改；切換分頁或子頁時
  // 從 storage 重新讀入，讓首頁三格儀表反映最新累計。
  B_useEffect(() => {
    setExpenses(core.readJSON(storage, 'polska.expenses.v1', []));
    setExpSettings(core.readJSON(storage, 'polska.settings.v1', core.DEFAULT_SETTINGS));
  }, [core, storage, subpage, activeTab]);

  const { d, phase, mins, momentDay, beforeStart, afterEnd, idx: projectedIdx } = B_useMemo(
    () => core.projectTripMoment(t.days, new Date(), override, t.meta),
    [core, t.days, t.meta, override, tick]
  );
  const idx = phase === 'before' ? 0 : phase === 'after' ? d.steps.length - 1 : projectedIdx;
  const now = d.steps[idx];
  const next = d.steps[idx + 1];
  const active = d.n;
  const setActive = (n) => { setOverride(n); setOpenStep(null); setDrawerOpen(false); };
  // 首頁統計四宮格共用的記帳累計（Task 8 建、Task 10 改接四宮格，取代已移除的舊版三格今日儀表）。
  const dashTotals = B_useMemo(() => core.expenseTotals(expenses), [core, expenses]);
  // Task 10：首頁照片 hero 用當前顯示日的目的城市；轉場日 d.city 形如
  // 「華沙 → 克拉科夫」，B_focusCity 已處理過取目的地。
  const heroCityName = B_focusCity(d.city);
  const heroCity = t.cities.find((c) => c.name === heroCityName) || t.cities[0];
  // 首頁統計四宮格的預算格，與記帳分頁共用同一套 budgetStatus 計算。
  const homeBudget = B_useMemo(
    () => core.budgetStatus(dashTotals.totalPLN, expSettings.fxRate, expSettings.budgetTWD),
    [core, dashTotals.totalPLN, expSettings.fxRate, expSettings.budgetTWD]
  );
  // 下一段長途車：跨全行程找最近一班尚未出發的車，非僅當日 d.train。
  const nt = B_useMemo(
    () => core.nextTrain(t.trains, Date.now(), 2026),
    [core, t.trains, tick]
  );
  const hardNow = core.selectHardConstraintForMoment(d.hardConstraints, phase, d.n, momentDay, mins);
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

  const liveClock = B_formatMinutes(mins);
  const installLabel = standalone || installStatus === 'installed'
    ? '已安裝'
    : installStatus === 'installing'
      ? '安裝中'
    : installStatus === 'installable'
      ? '可安裝'
      : B_isIOSSafari()
        ? '可加入主畫面'
        : '瀏覽器模式';
  const readinessLabel = pwaStatus === 'loading'
    ? '正在準備離線資料'
    : pwaStatus === 'ready'
      ? '離線資料已準備'
      : pwaStatus === 'error'
        ? '離線資料準備失敗'
        : '此瀏覽器不支援離線安裝';
  const navActions = {
    onToday: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    onItinerary: () => document.querySelector('.B-timeline')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    onTransport: (e) => d.train
      ? openTrainSheet(e)
      : document.querySelector('.B-timeline')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    onTickets: () => document.getElementById('B-tickets')?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
  };

  return (
    <div className="B-frame paper-tex B-companion">
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
          onClick={openDrawer}>
          10/24 → 10/31
        </button>
        <button
          type="button"
          className="menu"
          aria-label="開啟選單"
          aria-expanded={drawerOpen}
          aria-controls="B-drawer"
          onClick={openDrawer}>
          <span/><span/><span/>
        </button>
      </header>

      <B_PrimaryNav placement="desktop" {...navActions} />
      <main id="app-main" className="B-web-grid B-tabview" data-tab={activeTab} onClickCapture={interceptOfflineLink}>
        <section className="B-primary-column" aria-label="今日行程">

      <div data-tabsection="home">
        <B_Hero city={heroCity} day={d} />
        <div className="B-card-a B-quad">
          <div><b>{momentDay ?? d.n}/8</b><span>今天</span></div>
          <div><b>{d.weather ? d.weather.split('/')[0].trim() : '—'}</b><span>白天</span></div>
          <div><b>{homeBudget.spentTWD.toLocaleString('zh-TW')}</b><span>已花 NT$</span></div>
          <div><b>{Math.round(homeBudget.ratio * 100)}%</b><span>預算</span></div>
        </div>
        {nt && (
          <div className="B-card-a B-nextmove">
            <p className="B-kicker-a">下一段長途車</p>
            <p className="B-nextmove-seg B-num">{nt.train.seg}</p>
            <p className="B-nextmove-time B-num">{nt.train.date} {nt.train.dep} → {nt.train.arr}</p>
            <p className="B-nextmove-count">{core.formatCountdown(nt.minutesUntil)} · {nt.train.type} · PLN {nt.train.price}</p>
          </div>
        )}
        {/* nt 為 null 代表整趟行程往後已無長途車（core.nextTrain 找不到任何尚未出發的班次），
            不是「今天沒有車」——今天的車可能才剛開走，這句話不能對使用者說謊。
            沒有下一班車也不是警訊，不可套用 --A-signal 紅字，改用中性的 ink-2 樣式。 */}
        {!nt && (
          <div className="B-card-a">
            <p className="B-kicker-a">下一段長途車</p>
            <p className="B-nextmove-time">行程中已無下一段長途車</p>
          </div>
        )}
      </div>

      <section className="B-today" data-bg={`0${d.n}`} id="top" data-tabsection="home">
        <button
          type="button"
          className="B-tools-btn"
          aria-label="更多工具"
          aria-expanded={toolsOpen}
          ref={toolsBtnRef}
          onClick={() => setToolsOpen(true)}
        >⋯</button>
        <div className="kicker">Today is</div>
        <div className="day-line">
          <button
            type="button"
            className="day-num"
            aria-label="開啟 8 日行程選單"
            onClick={openDrawer}>{d.n}</button>
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
            <span className="brief-k">{hardNow.label}</span>
            <strong>{hardNow.text}</strong>
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

        <div className={`B-pwa-state ${online ? 'online' : 'offline'}`} data-pwa-status={pwaStatus} aria-live="polite">
          <span>{online ? '已連線' : '離線模式'}</span>
          <strong>{installLabel}</strong>
          <em>{updateFailed ? '更新失敗，仍使用目前版本' : waitingWorker ? '更新可用' : readinessLabel}</em>
          {installStatus === 'installable' && (
            <button type="button" className="B-install-action" onClick={installApp}>安裝 App</button>
          )}
          {!notesPersistent && <small>備註只保留到這次關閉前</small>}
        </div>

        {showInstallHint && !standalone && (
          <aside className="B-install-hint" role="note">
            <strong>加到 iPhone 主畫面</strong>
            <span>點 Safari 分享按鈕，再選「加入主畫面」，即可離線開啟。</span>
            <button type="button" onClick={dismissInstallHint}>知道了</button>
          </aside>
        )}

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
            {phase === 'before' ? '行程尚未開始 · 預覽' : phase === 'after' ? '行程已結束 · 回顧' : beforeStart ? '今日尚未開始' : afterEnd ? '今日已結束' : 'Now · 現在該做什麼'}
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
            const diff = (nh * 60 + nm) - mins;
            const inLabel = phase === 'during' && diff > 0 && diff < 600 ? ` · ${diff} min` : '';
            return (
              <div className="next-up">Next · <strong>{next.t}{inLabel}</strong> {next.label.replace(/^★\s*/, '')}</div>
            );
          })()}
        </button>
      </section>

      <div className="B-scrub" ref={scrubRef} role="tablist" aria-label="日次切換" data-tabsection="trip">
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
          <div className="B-train" data-tabsection="move">
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
            <button type="button" className="train-details" onClick={openTrainSheet}>
              開啟{isBus ? '巴士' : '火車'}交通詳情
            </button>
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
              ref={trainSheetRef}
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
                <button ref={trainCloseRef} type="button" aria-label={`關閉${isBus ? '巴士' : '火車'}詳情`} onClick={() => setTrainSheet(false)}>×</button>
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

      <div className="B-timeline" data-tabsection="trip">
        {d.steps.map((s, i) => {
          const isStar = s.label.includes('★');
          const cleanLabel = s.label.replace(/^★\s*/, '');
          const myNote = notes[noteKey(d.n, i)];
          const showBooking = isStar || B_hasBooking(s.label);
          let cls = '';
          if (phase === 'after' || (phase === 'during' && i < idx)) cls = 'done';
          else if (phase === 'during' && i === idx) cls = 'now';
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
                    <span className="v">{phase === 'after' || (phase === 'during' && i < idx) ? '已完成' : phase === 'during' && i === idx ? '進行中' : '尚未開始'}{isStar ? ' · ★ 重點' : ''}</span>
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

      {d.warn && <div className="B-warn" data-tabsection="trip"><strong>⚠ 注意</strong> · {d.warn}</div>}

        </section>
        <aside className="B-secondary-column" aria-label="行程補充資訊">

      <div className="B-card field-note" data-tabsection="trip">
        <div className="label">今日提醒</div>
        <ul>
          <li><span className="field-tag">Plan B</span><strong>{backupNow}</strong></li>
          <li><span className="field-tag">節奏</span><strong>{d.intensity ? `今日強度 ${d.intensity}` : '按體力調整'}</strong></li>
        </ul>
      </div>

      <div className="B-card tickets" id="B-tickets" data-tabsection="move">
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
        <div className="B-card eat" data-tabsection="trip">
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
        <div className="B-card backup" data-tabsection="trip">
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
        <div className="B-card practical" data-tabsection="trip">
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
          <details className="B-card B-citystory-detail" data-tabsection="trip">
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
          <details className="B-card B-foodbackup-detail" data-tabsection="trip">
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

      <section data-tabsection="money">
        <B_Expense storage={storage} />
      </section>

        </aside>
      </main>

      {waitingWorker && !updateFailed && (
        <aside className="B-update-ready" role="status" aria-live="polite">
          <span><strong>更新可用</strong>新版離線資料已準備好</span>
          <button type="button" onClick={applyUpdate}>立即更新</button>
        </aside>
      )}

      {toast && <div className="B-toast" role="status" aria-live="assertive">{toast}</div>}

      <B_PrimaryNav placement="mobile" active={activeTab} onChange={setActiveTab} />

      {drawerOpen && (
        <React.Fragment>
          <div
            className="B-drawer-mask open"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <aside
            ref={drawerRef}
            id="B-drawer"
            className="B-drawer open"
            role="dialog"
            aria-modal="true"
            aria-label="日次選單">
            <div className="B-drawer-head">
              <span>POLSKA · 8 日</span>
              <button
                ref={drawerCloseRef}
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
                <a
                  href="#B-guide"
                  onClick={(e) => {
                    e.preventDefault();
                    subpageReturnFocusRef.current = drawerReturnFocusRef.current;
                    setDrawerOpen(false);
                    setSubpage('guide');
                  }}>
                  <span>行前指南</span>
                  <small>航班 · 住宿 · 安全</small>
                </a>
              </li>
            </ul>
          </aside>
        </React.Fragment>
      )}

      {toolsOpen && (
        <B_ToolGrid
          panelRef={toolsMenuRef}
          closeRef={toolsMenuCloseRef}
          onClose={() => setToolsOpen(false)}
          onOpen={(key) => {
            // 不可用 ev.currentTarget：那是選單裡的工具按鈕，選單一關（toolsOpen
            // 變 false）整塊 .B-tools-menu 就會 unmount，子頁關閉時再對它 focus()
            // 會是操作一個已經不在 DOM 上的節點、悄悄失敗，焦點會掉到 <body>。
            // 唯一在子頁關閉當下還存在的，是開選單的那顆「⋯」鈕本身。
            subpageReturnFocusRef.current = toolsBtnRef.current;
            setToolsOpen(false);
            setSubpage(key);
          }}
        />
      )}

      {subpage && (
        <B_Subpage title={SUBPAGE_TITLES[subpage]} onBack={() => setSubpage(null)} panelRef={subpageRef} closeRef={subpageCloseRef}>
          {subpage === 'fx' && <B_FxTool storage={storage} />}
          {subpage === 'packing' && <B_Packing storage={storage} />}
          {subpage === 'sos' && <B_Sos trip={t} />}
          {subpage === 'info' && <B_Info trip={t} />}
          {subpage === 'photomap' && <B_PhotoMap trip={t} storage={storage} />}
          {subpage === 'guide' && <B_PreTripGuide trip={t} />}
        </B_Subpage>
      )}
    </div>
  );
}

window.B_Companion = B_Companion;
