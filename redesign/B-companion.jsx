/* Direction B — iPhone reading companion (responsive web that nails mobile) */
const B_useState = React.useState;
const B_useEffect = React.useEffect;
const B_useMemo = React.useMemo;

// Map real-world clock to a synthetic trip moment so the demo feels alive.
// Strategy: take current local time-of-day; project onto Day 2 (mid-trip transit day).
// User can override by tapping a day pill — that takes priority.
function B_synthetic(days, override) {
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  // Use override day if provided, else pick day based on weekday (mod 8) for variety
  const dayNum = override ?? ((now.getDate() % 8) + 1);
  const d = days.find(x => x.n === dayNum) || days[1];

  // find current step: latest step whose time <= now
  const stepMins = d.steps.map(s => {
    const [h, m] = s.t.split(':').map(Number);
    return h * 60 + m;
  });
  let idx = 0;
  for (let i = 0; i < stepMins.length; i++) {
    if (stepMins[i] <= mins) idx = i;
  }
  // if before first step, idx=0 but mark "upcoming"
  const beforeStart = mins < stepMins[0];
  const afterEnd = mins > stepMins[stepMins.length - 1] + 60;
  return {
    d, idx, beforeStart, afterEnd,
    now: d.steps[idx],
    next: d.steps[idx + 1],
    mins,
  };
}

function B_Companion({ initialDay }) {
  const t = window.TRIP;
  const [override, setOverride] = B_useState(initialDay ?? null);
  const [openStep, setOpenStep] = B_useState(null);
  const [tick, setTick] = B_useState(0);
  const [drawerOpen, setDrawerOpen] = B_useState(false);
  const scrubRef = React.useRef(null);

  // refresh every minute so the Now widget stays accurate
  B_useEffect(() => {
    const id = setInterval(() => setTick(x => x + 1), 60000);
    return () => clearInterval(id);
  }, []);

  // Close drawer on Escape
  B_useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setDrawerOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Lock body scroll while drawer is open
  B_useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const { d, idx, now, next, beforeStart, afterEnd } = B_useMemo(
    () => B_synthetic(t.days, override),
    [t.days, override, tick]
  );
  const active = d.n;
  const setActive = (n) => { setOverride(n); setOpenStep(null); setDrawerOpen(false); };

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
        <div className="brand">POLSKA<span className="dot">.</span></div>
        <div className="meta">10/24 → 10/31</div>
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

      <section className="B-today" data-bg={`0${d.n}`}>
        <div className="kicker">Today is</div>
        <div className="day-line">
          <span className="day-num">{d.n}</span>
          <span className="day-of">/ 8 · {d.date}<br/>{d.city}</span>
        </div>
        <h1>{d.title}</h1>
        <p className="head-sub">{d.headline}</p>
        <div className="meta-row">
          <span><strong>{d.weather || '—'}</strong></span>
          <span>{d.tag}</span>
          {d.train && <span>{d.train.type} · {d.train.dur}</span>}
        </div>

        <div className="B-now">
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
        </div>
      </section>

      <div className="B-scrub" ref={scrubRef} role="tablist" aria-label="日次切換">
        {t.days.map(x => (
          <a key={x.n} href={`#B-day-${x.n}`}
             role="tab"
             aria-selected={x.n === active}
             aria-current={x.n === active ? 'true' : undefined}
             onClick={e => { e.preventDefault(); setActive(x.n); }}
             className={`pill ${x.n === active ? 'active' : ''} ${x.n < active ? 'done' : ''}`}>
            <strong>0{x.n}</strong>
            <span>{x.date.slice(0,5)}</span>
          </a>
        ))}
      </div>

      {d.train && (
        <div className="B-train">
          <div className="seg">
            <span className={`pill ${d.train.type.toLowerCase()}`}>{d.train.type}</span>
            <span>{d.train.date || d.date}</span>
            <span>· PLN {d.train.price}</span>
          </div>
          <div className="route">
            <div className="stop">
              <strong>{d.train.from}</strong>
              <small>{d.train.dep}</small>
            </div>
            <div className="arrow"><span className="dur">{d.train.dur}</span></div>
            <div className="stop right">
              <strong>{d.train.to}</strong>
              <small>{d.train.arr}</small>
            </div>
          </div>
        </div>
      )}

      <div className="B-timeline">
        {d.steps.map((s, i) => {
          const isStar = s.label.includes('★');
          const cleanLabel = s.label.replace(/^★\s*/, '');
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
                  {s.sub && <small>{s.sub}</small>}
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
                  {s.sub && (
                    <div className="row">
                      <span className="k">備註</span>
                      <span className="v">{s.sub}</span>
                    </div>
                  )}
                  <div className="row">
                    <span className="k">狀態</span>
                    <span className="v">{i < idx ? '已完成' : i === idx ? '進行中' : '尚未開始'}{isStar ? ' · ★ 重點' : ''}</span>
                  </div>
                  <div className="actions">
                    <button>📍 地圖</button>
                    <button>📒 加備註</button>
                    {isStar && <button>🎟 訂票連結</button>}
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {d.warn && <div className="B-warn"><strong>⚠ 注意</strong> · {d.warn}</div>}

      {d.eat && (
        <div className="B-card eat">
          <div className="label">🍴 今日必吃</div>
          <ul>{d.eat.map((e, i) => <li key={i}>{e}</li>)}</ul>
        </div>
      )}

      <nav className="B-tabbar" aria-label="底部切換">
        <a href="#today"
           className="active"
           aria-current="page"
           onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <svg viewBox="0 0 24 24"><path d="M3 12L12 4l9 8M5 10v10h14V10"/></svg>
          今日
        </a>
        <a href="#timeline"
           onClick={(e) => {
             e.preventDefault();
             const el = document.querySelector('.B-timeline');
             if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
           }}>
          <svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16M9 6v12"/></svg>
          行程
        </a>
        <a href="https://maps.google.com/?q=Warsaw+Poland"
           target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          地圖
        </a>
        <a href="#manual"
           onClick={(e) => { e.preventDefault(); setDrawerOpen(true); }}>
          <svg viewBox="0 0 24 24"><path d="M4 19V5a2 2 0 012-2h11l3 3v13a2 2 0 01-2 2H6a2 2 0 01-2-2z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>
          手冊
        </a>
        <a href="index.html?classic=1">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>
          桌機版
        </a>
      </nav>

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
                <span>Day 0{x.n} · {x.title}</span>
                <small>{x.date}</small>
              </a>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

window.B_Companion = B_Companion;
