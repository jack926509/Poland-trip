/* Direction C — iOS app preview (sits inside an ios_frame) */
const C_useState = React.useState;
const C_useEffect = React.useEffect;

// Project current wall-clock time onto a day's step list so the preview
// shows a believable "Now" marker. Falls back to middle step before/after window.
function C_projectStep(day) {
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  const stepMins = day.steps.map(s => {
    const [h, m] = s.t.split(':').map(Number);
    return h * 60 + m;
  });
  if (mins < stepMins[0] || mins > stepMins[stepMins.length - 1] + 60) {
    return Math.min(Math.floor(day.steps.length / 2), day.steps.length - 1);
  }
  let idx = 0;
  for (let i = 0; i < stepMins.length; i++) {
    if (stepMins[i] <= mins) idx = i;
  }
  return idx;
}

function C_App({ initialDay = 2 }) {
  const t = window.TRIP;
  const [active, setActive] = C_useState(initialDay);
  const [openStep, setOpenStep] = C_useState(null);
  const [trainSheet, setTrainSheet] = C_useState(false);
  const [tick, setTick] = C_useState(0);
  C_useEffect(() => {
    const id = setInterval(() => setTick(x => x + 1), 60000);
    return () => clearInterval(id);
  }, []);
  const d = t.days.find(x => x.n === active) || t.days[0];
  const idx = React.useMemo(() => C_projectStep(d), [d, tick]);
  const now = d.steps[idx];

  return (
    <div className="C-frame">
      <div className="C-nav">
        <span className="left">10 月 25 日 · 週日</span>
        <div className="right">
          <button className="icon-btn" aria-label="search">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>
          </button>
          <button className="icon-btn" aria-label="profile">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>
          </button>
        </div>
      </div>

      <div className="C-title">
        <h1>Day <em>0{d.n}</em></h1>
        <div className="stamp">
          {d.city}<br/>
          {d.date}
        </div>
      </div>

      <div className="C-today-card" data-bg={`0${d.n}`}>
        <div className="row">
          <span className="lab"><span className="dot"/>Now · 進行中</span>
          <span className="day-of">{d.tag}</span>
        </div>
        <h2>{d.title}</h2>
        <div className="sub">{d.headline}</div>
        <div className="now">
          <span className="time">{now.t}</span>
          <div className="what">
            <strong>{now.label.replace(/^★\s*/, '')}</strong>
            {now.sub && <small>{now.sub}</small>}
          </div>
          <div className="arrow">›</div>
        </div>
      </div>

      <div className="C-day-strip">
        {t.days.map(x => (
          <a key={x.n} href="#"
             onClick={e => { e.preventDefault(); setActive(x.n); }}
             className={`pill ${x.n === active ? 'active' : ''} ${x.n < active ? 'done' : ''}`}>
            <strong>0{x.n}</strong>
            <span>{x.date.slice(0,5)}</span>
          </a>
        ))}
      </div>

      {d.train && (
        <>
          <div className="C-section-h">
            <h3>下一段火車</h3>
            <a className="more" href="#" onClick={(e) => { e.preventDefault(); setTrainSheet(true); }}>所有班次 →</a>
          </div>
          <div className="C-widget" onClick={() => setTrainSheet(true)} style={{cursor:'pointer'}}>
            <div className="top">
              <span className={`pill ${d.train.type.toLowerCase()}`}>{d.train.type}</span>
              <span className="when">{d.train.date || d.date}</span>
            </div>
            <div className="route">
              <div className="stop">
                <strong>{d.train.from}</strong>
                <small>{d.train.dep}</small>
              </div>
              <div className="arr"><span className="dur">{d.train.dur}</span></div>
              <div className="stop right">
                <strong>{d.train.to}</strong>
                <small>{d.train.arr}</small>
              </div>
            </div>
            <div className="footer">
              <span>頭等艙 · 含早餐</span>
              <strong>PLN {d.train.price}</strong>
            </div>
          </div>
        </>
      )}

      <div className="C-section-h">
        <h3>今日行程</h3>
        <a className="more" href="#">展開 →</a>
      </div>
      <div className="C-steps">
        {d.steps.map((s, i) => {
          const isStar = s.label.includes('★');
          const cleanLabel = s.label.replace(/^★\s*/, '');
          let cls = '';
          if (i < idx) cls = 'done';
          else if (i === idx) cls = 'now';
          if (isStar) cls += ' star';
          const open = openStep === i;
          return (
            <React.Fragment key={i}>
              <div className={`C-row ${cls} ${open ? 'open' : ''}`}
                role="button" tabIndex={0}
                aria-expanded={open}
                onClick={() => setOpenStep(open ? null : i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setOpenStep(open ? null : i);
                  }
                }}>
                <span className="t">{s.t}</span>
                <span className="lab">{cleanLabel}{s.sub && <small>{s.sub}</small>}</span>
                <span className="act">{i < idx ? '✓' : i === idx ? '◉' : '›'}</span>
              </div>
              {open && (
                <div className="C-row-detail">
                  <div className="dr">
                    <span className="k">時間</span>
                    <span className="v">{s.t}</span>
                  </div>
                  {s.sub && <div className="dr"><span className="k">備註</span><span className="v">{s.sub}</span></div>}
                  <div className="dr">
                    <span className="k">狀態</span>
                    <span className="v">{i < idx ? '已完成' : i === idx ? '進行中' : '尚未開始'}{isStar ? ' · ★ 重點' : ''}</span>
                  </div>
                  <div className="dr-actions">
                    <button>📍 地圖</button>
                    <button>📒 加備註</button>
                    {isStar && <button>🎟 訂票</button>}
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {d.eat && (
        <>
          <div className="C-section-h">
            <h3>今日必吃</h3>
            <a className="more" href="#">完整美食 →</a>
          </div>
          <div className="C-chips">
            {d.eat.map((e, i) => <span className="C-chip" key={i}>{e}</span>)}
          </div>
        </>
      )}

      <div className="C-section-h">
        <h3>探索</h3>
        <a className="more" href="#">全部 →</a>
      </div>
      <div className="C-mini-grid">
        <div className="C-mini map">
          <div className="mini-lab">📍 附近</div>
          <div className="mini-title">{d.city} 老城</div>
          <div className="mini-sub">步行 7 分鐘</div>
        </div>
        <div className="C-mini stay">
          <div className="mini-lab">🏨 今晚住宿</div>
          <div className="mini-title">{d.city.split('·')[0].trim()} Hotel</div>
          <div className="mini-sub">15:00 入住</div>
        </div>
        <div className="C-mini food">
          <div className="mini-lab">🍴 預訂</div>
          <div className="mini-title">{d.eat ? d.eat[0].split('·')[0].split('—')[0].slice(0,8) : '晚餐'}</div>
          <div className="mini-sub">19:30 · 2 位</div>
        </div>
        <div className="C-mini wallet">
          <div className="mini-lab">💳 今日花費</div>
          <div className="mini-title">PLN 248</div>
          <div className="mini-sub">預算內 · -32</div>
        </div>
      </div>

      {d.warn && (
        <div className="B-warn" style={{margin:'.6rem 1rem', borderRadius:12}}>
          <strong>⚠ 注意</strong> · {d.warn}
        </div>
      )}

      <div style={{height:'1.5rem'}}/>

      {trainSheet && d.train && (
        <div className="C-sheet-overlay" onClick={() => setTrainSheet(false)}>
          <div className="C-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="C-sheet-grab"/>
            <div className="C-sheet-head">
              <h2>火車詳情</h2>
              <button onClick={() => setTrainSheet(false)} aria-label="close">✕</button>
            </div>
            <div className="C-sheet-route">
              <span className={`C-pill ${d.train.type.toLowerCase()}`}>{d.train.type}</span>
              <strong>{d.train.from}</strong>
              <span className="dur">{d.train.dur}</span>
              <strong>{d.train.to}</strong>
            </div>
            <div className="C-sheet-row"><span className="k">日期</span><span className="v">{d.train.date || d.date}</span></div>
            <div className="C-sheet-row"><span className="k">出發</span><span className="v">{d.train.dep} · {d.train.from}</span></div>
            <div className="C-sheet-row"><span className="k">抵達</span><span className="v">{d.train.arr} · {d.train.to}</span></div>
            <div className="C-sheet-row"><span className="k">時長</span><span className="v">{d.train.dur}</span></div>
            <div className="C-sheet-row"><span className="k">票價</span><span className="v">{d.train.price}</span></div>
            <div className="C-sheet-row"><span className="k">艙等</span><span className="v">頭等艙 · 含早餐 · Wi-Fi</span></div>
            <div className="C-sheet-row"><span className="k">訂票</span><span className="v">intercity.pl · 提前 30 天 Super Promo</span></div>
            <div className="C-sheet-actions">
              <button className="primary">前往訂票 →</button>
              <button>加入行事曆</button>
            </div>
          </div>
        </div>
      )}

      <nav className="C-tabbar">
        <a href="#" className="active">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
          今日
        </a>
        <a href="#">
          <svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 3v4M16 3v4M4 11h16"/></svg>
          行程
        </a>
        <a href="#">
          <svg viewBox="0 0 24 24"><path d="M9 19l-6-2V5l6 2 6-2 6 2v12l-6-2-6 2z"/><path d="M9 7v12M15 5v12"/></svg>
          地圖
        </a>
        <a href="#">
          <svg viewBox="0 0 24 24"><path d="M4 19V5a2 2 0 012-2h11l3 3v13a2 2 0 01-2 2H6a2 2 0 01-2-2z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>
          手冊
        </a>
        <a href="#">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>
          我
        </a>
      </nav>
    </div>
  );
}

window.C_App = C_App;
