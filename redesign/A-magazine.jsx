/* Direction A — Refined Magazine
   Renders into the #A-root mount. Uses window.TRIP. */
const { useState, useMemo, useEffect, useRef } = React;

// Map city → English name for Maps queries (mirrors B-companion's B_CITY_EN).
const A_CITY_EN = {
  '華沙': 'Warsaw',
  '克拉科夫': 'Kraków',
  '樂斯拉夫': 'Wrocław',
  '波茲南': 'Poznań',
  '多哈': 'Doha',
};
// In transit days like "華沙 → 克拉科夫", anchor the search to the destination.
function A_focusCity(city) {
  if (!city) return 'Poland';
  const last = city.split('→').pop().trim();
  return A_CITY_EN[last] || last;
}
// Strip leading ★, ⭐, brackets, "@ Venue" splits, etc., so the search hits the place.
function A_cleanPlace(name) {
  if (!name) return '';
  let s = String(name).replace(/^★\s*/, '').replace(/⭐/g, '').trim();
  // Eat string "Pierogi @ Zapiecek" → use venue after @
  if (s.includes('@')) s = s.split('@').pop().trim();
  // Pick first venue when separated by /
  if (s.includes('/')) s = s.split('/')[0].trim();
  // Strip trailing parentheses notes (PGI), (UNESCO), (Marszałkowska)
  s = s.replace(/[（(].*?[）)]/g, '').trim();
  return s;
}
function A_mapsURL(name, city) {
  const venue = A_cleanPlace(name);
  const ctx = A_focusCity(city);
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue} ${ctx}`)}`;
}
// Permissive: link unless the label is clearly an admin / transit action.
function A_stepIsPlace(label) {
  if (!label) return false;
  const skip = /(SKM|EIP|^IC\b|巴士|抵\s?\S|入境|提行李|Check-in|退房|報到|安檢|退稅|早睡|沉澱|起飛|導覽結束|休息$|出發$|出發[\s·]|S2\/S3)/;
  return !skip.test(label);
}

function A_Hero() {
  const t = window.TRIP;
  const risk = t.meta.highestRiskDays || [];
  return (
    <section className="A-hero">
      <div className="A-hero-grid">
        <div>
          <div className="A-hero-issue">Trip Control · 實際旅行控制台</div>
          <h1>波蘭 8 天 7 晚<span className="accent">.</span></h1>
          <p className="A-hero-sub">
            {t.meta.dateRange}，{t.meta.route}。{t.meta.style}，以火車順時針完成四城重點收集。
          </p>
          <div className="A-hero-stats">
            <div><strong>{t.meta.days}</strong>days</div>
            <div><strong>{t.meta.nights}</strong>nights</div>
            <div><strong>4</strong>cities</div>
            <div><strong>5</strong>train legs</div>
          </div>
        </div>
        <div>
          <div className="A-hero-control">
            <div className="A-control-title">行前判讀</div>
            <div className="A-control-row"><span>路線</span><strong>{t.meta.route}</strong></div>
            <div className="A-control-row"><span>晚數</span><strong>華沙 1+2 · 克拉科夫 2 · 樂斯拉夫 1 · 波茲南 1</strong></div>
            <div className="A-control-row"><span>硬日</span><strong>{risk.join(' / ')}</strong></div>
            <div className="A-control-note">先處理 Auschwitz、鹽礦與 4 段城際火車，整趟行程就穩。</div>
          </div>
        </div>
      </div>
    </section>);

}

function A_DayRail({ activeDay, onPick }) {
  const t = window.TRIP;
  const handleClick = (e, n) => {
    e.preventDefault();
    onPick(n);
    const el = document.getElementById(`A-day-${n}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <div className="A-day-rail" role="tablist" aria-label="日次導覽">
      {t.days.map((d) =>
      <a key={d.n} href={`#A-day-${d.n}`}
      role="tab"
      aria-selected={activeDay === d.n}
      aria-current={activeDay === d.n ? 'true' : undefined}
      className={`A-chip ${activeDay === d.n ? 'active' : ''}`}
      onClick={(e) => handleClick(e, d.n)}>
          <span className="dot" aria-hidden="true"></span>
          <strong>Day {d.n}</strong>
          <span>{d.date}</span>
        </a>
      )}
    </div>);

}

function A_Day({ d, scoped }) {
  return (
    <article className="A-day" id={`A-day-${d.n}`}>
      <div className="A-day-num">
        <span className="num-label">Day {d.n}</span>
        <small>
          <span className="day-meta">
            <span>{d.date}</span>
            {d.weather && <>
              <span className="sep" aria-hidden="true">·</span>
              <span>{d.weather}</span>
            </>}
          </span>
          <span className="day-city">{d.city}</span>
        </small>
        <span className="A-day-tag">{d.tag}</span>
      </div>
      <div className="A-day-body">
        <h4>{d.title}</h4>
        <p className="lead">{d.headline}</p>
        {d.train &&
        <div className="A-train">
            <span className={`pill ${d.train.type.toLowerCase()}`}>{d.train.type}</span>
            <span className="stops">{d.train.from} → {d.train.to}</span>
            <span className="times">{d.train.dep} → {d.train.arr}</span>
            <span className="dur">{d.train.dur}</span>
          </div>
        }
        <div className="A-day-readout" aria-label={`Day ${d.n} 快速判讀`}>
          <div><span>體力</span><strong>{d.intensity || '—'}</strong></div>
          <div><span>硬時間</span><strong>{(d.hardConstraints || []).slice(0, 2).join(' · ') || '彈性日'}</strong></div>
          <div><span>必訂票</span><strong>{(d.mustBook || []).join(' · ') || '無'}</strong></div>
        </div>
        <div className="A-schedule">
          <span className="sched-label">逐時行程</span>
          <ul className="A-steps">
            {d.steps.map((s, i) => {
              const linkable = A_stepIsPlace(s.label);
              const Inner = (
                <>
                  {s.label}{s.sub && <small>（{s.sub}）</small>}
                  {(s.cost || s.dur) && (
                    <span className="meta">
                      {s.dur && <span className="m-dur">⏱ {s.dur}</span>}
                      {s.cost && <span className="m-cost">💰 {s.cost}</span>}
                    </span>
                  )}
                </>
              );
              return (
                <li key={i}>
                  <span className="t">{s.t}</span>
                  {linkable ? (
                    <a className="lab is-link"
                       href={A_mapsURL(s.label, d.city)}
                       target="_blank" rel="noopener noreferrer"
                       aria-label={`Google 地圖：${A_cleanPlace(s.label)}`}>
                      {Inner}
                    </a>
                  ) : (
                    <span className="lab">{Inner}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        {d.eat &&
        <div className="A-day-eats">
            <span className="e-label">🍴 {d.n === 1 ? '抵達日必吃' : '今日必吃'}</span>
            <ul>{d.eat.map((e, i) =>
              <li key={i}>
                <a href={A_mapsURL(e, d.city)}
                   target="_blank" rel="noopener noreferrer"
                   aria-label={`Google 地圖：${A_cleanPlace(e)}`}>
                  {e}
                </a>
              </li>
            )}</ul>
          </div>
        }
        {d.backup && d.backup.length > 0 &&
        <div className="A-day-backup">
            <span className="b-label">☂ 備案 / Plan B</span>
            <ul>{d.backup.map((b, i) =>
              <li key={i}>
                <a href={A_mapsURL(b.where, d.city)}
                   target="_blank" rel="noopener noreferrer"
                   aria-label={`Google 地圖：${A_cleanPlace(b.where)}`}>
                  <strong>{b.label}</strong>
                  <em>{b.where}</em>
                  <span>{b.why}</span>
                </a>
              </li>
            )}</ul>
          </div>
        }
        {(d.hardConstraints?.length || d.compressible?.length) &&
        <div className="A-day-constraints">
            {d.hardConstraints?.length > 0 &&
              <div>
                <span className="c-label">硬限制</span>
                <ul>{d.hardConstraints.map((x, i) => <li key={i}>{x}</li>)}</ul>
              </div>
            }
            {d.compressible?.length > 0 &&
              <div>
                <span className="c-label">可壓縮</span>
                <ul>{d.compressible.map((x, i) => <li key={i}>{x}</li>)}</ul>
              </div>
            }
          </div>
        }
        {d.practical && d.practical.length > 0 &&
        <div className="A-day-practical">
            <span className="p-label">🛠 實務節點</span>
            <ul>{d.practical.map((p, i) =>
              <li key={i}>
                <a href={A_mapsURL(p.name, d.city)}
                   target="_blank" rel="noopener noreferrer"
                   aria-label={`Google 地圖：${A_cleanPlace(p.name)}`}>
                  <span className="t">{p.tag}</span>
                  <strong>{p.name}</strong>
                  <small>{p.note}</small>
                </a>
              </li>
            )}</ul>
          </div>
        }
        {d.warn && <div className="A-warn">⚠ {d.warn}</div>}
      </div>
    </article>);

}

function A_RouteMap() {
  return (
    <div className="A-route">
      <div className="A-route-kicker">Geographic Route</div>
      <svg className="A-route-svg" viewBox="0 0 880 460" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="波蘭四城路線">
        <rect x="40" y="30" width="800" height="400" rx="24" fill="none" stroke="#1a1612" strokeOpacity="0.2" strokeWidth="0.8" strokeDasharray="5 5"/>
        <text x="58" y="56" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#3d362e" letterSpacing="2">POLAND · POLSKA</text>
        <defs>
          <marker id="A-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </marker>
        </defs>
        <line x1="700" y1="125" x2="600" y2="335" stroke="#a8231d" strokeWidth="2.2" strokeLinecap="round" markerEnd="url(#A-arrow)"/>
        <line x1="540" y1="345" x2="290" y2="335" stroke="#a8231d" strokeWidth="2.2" strokeLinecap="round" markerEnd="url(#A-arrow)"/>
        <line x1="240" y1="305" x2="220" y2="160" stroke="#a8231d" strokeWidth="2.2" strokeLinecap="round" markerEnd="url(#A-arrow)"/>
        <line x1="280" y1="135" x2="640" y2="120" stroke="#a8231d" strokeWidth="2.2" strokeLinecap="round" markerEnd="url(#A-arrow)"/>
        <g><rect x="624" y="220" width="68" height="22" rx="11" fill="#f4ecd8" stroke="#a8231d" strokeWidth="1"/><text x="658" y="235" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="11" fontWeight="600" fill="#7a1812">2h25 EIP</text></g>
        <g><rect x="385" y="328" width="68" height="22" rx="11" fill="#f4ecd8" stroke="#a8231d" strokeWidth="1"/><text x="419" y="343" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="11" fontWeight="600" fill="#7a1812">3h30 IC</text></g>
        <g><rect x="172" y="222" width="68" height="22" rx="11" fill="#f4ecd8" stroke="#a8231d" strokeWidth="1"/><text x="206" y="237" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="11" fontWeight="600" fill="#7a1812">2h20 IC</text></g>
        <g><rect x="430" y="115" width="68" height="22" rx="11" fill="#f4ecd8" stroke="#a8231d" strokeWidth="1"/><text x="464" y="130" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="11" fontWeight="600" fill="#7a1812">2h20 EIP</text></g>
        <g>
          <circle cx="700" cy="100" r="22" fill="none" stroke="#a8231d" strokeWidth="1" strokeDasharray="3 3" opacity="0.6"/>
          <circle cx="700" cy="100" r="13" fill="#a8231d" stroke="#1a1612" strokeWidth="1.5"/>
          <text x="700" y="105" textAnchor="middle" fontFamily="Bodoni Moda, Noto Serif TC, serif" fontSize="14" fontWeight="700" fill="#fff">1</text>
          <text x="730" y="92" fontFamily="Bodoni Moda, Noto Serif TC, serif" fontSize="20" fontWeight="700" fill="#1a1612">華沙 Warszawa</text>
          <text x="730" y="110" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="1.5" fill="#3d362e">DAY 1 · ENTRY</text>
          <text x="730" y="135" fontFamily="JetBrains Mono" fontSize="9" letterSpacing="1.2" fill="#a8231d" fontWeight="600">↻ DAY 7-8 · EXIT</text>
        </g>
        <g>
          <circle cx="585" cy="350" r="13" fill="#a8231d" stroke="#1a1612" strokeWidth="1.5"/>
          <text x="585" y="355" textAnchor="middle" fontFamily="Bodoni Moda, Noto Serif TC, serif" fontSize="14" fontWeight="700" fill="#fff">2</text>
          <text x="615" y="342" fontFamily="Bodoni Moda, Noto Serif TC, serif" fontSize="20" fontWeight="700" fill="#1a1612">克拉科夫 Kraków</text>
          <text x="615" y="360" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="1.5" fill="#3d362e">DAY 2-4 · 2 NIGHTS</text>
        </g>
        <g>
          <circle cx="265" cy="335" r="13" fill="#c4892b" stroke="#1a1612" strokeWidth="1.5"/>
          <text x="265" y="340" textAnchor="middle" fontFamily="Bodoni Moda, Noto Serif TC, serif" fontSize="14" fontWeight="700" fill="#fff">3</text>
          <text x="105" y="325" fontFamily="Bodoni Moda, Noto Serif TC, serif" fontSize="18" fontWeight="700" fill="#1a1612">樂斯拉夫</text>
          <text x="105" y="345" fontFamily="Bodoni Moda, Noto Serif TC, serif" fontSize="13" fontStyle="italic" fill="#3d362e">Wrocław</text>
          <text x="105" y="362" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="1.5" fill="#3d362e">DAY 5</text>
        </g>
        <g>
          <circle cx="245" cy="140" r="13" fill="#c4892b" stroke="#1a1612" strokeWidth="1.5"/>
          <text x="245" y="145" textAnchor="middle" fontFamily="Bodoni Moda, Noto Serif TC, serif" fontSize="14" fontWeight="700" fill="#fff">4</text>
          <text x="80" y="135" fontFamily="Bodoni Moda, Noto Serif TC, serif" fontSize="18" fontWeight="700" fill="#1a1612">波茲南</text>
          <text x="80" y="155" fontFamily="Bodoni Moda, Noto Serif TC, serif" fontSize="13" fontStyle="italic" fill="#3d362e">Poznań</text>
          <text x="80" y="172" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="1.5" fill="#3d362e">DAY 6</text>
        </g>
      </svg>
    </div>);
}

function A_Cities() {
  return (
    <div className="A-cities">
      {window.TRIP.cities.map((c, i) =>
      <div className="A-city" key={c.key}>
          <span className="num">No. 0{i + 1}</span>
          <span className="tag">{c.tag}</span>
          <h3>{c.name}</h3>
          <div className="pl">{c.pl}</div>
          <p className="vibe">{c.vibe}</p>
          <div className="nights">住 <strong>{c.nights}</strong> 晚 · {c.stayNote || `${c.highlights.length} 大景點`}</div>
          <ul className="A-city-highlights">
            {c.highlights.map((h, j) => (
              <li key={j}>
                <a href={A_mapsURL(h, c.name)}
                   target="_blank" rel="noopener noreferrer"
                   aria-label={`Google 地圖：${A_cleanPlace(h)}（${c.name}）`}>
                  {h}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>);

}

function A_Trains() {
  const mustBook = new Set(['WAW → KRK', 'KRK → WRO', 'WRO → POZ', 'POZ → WAW']);
  const riskCopy = {
    'WAW → KRK': '早班南下，抵達後接景點',
    'KRK ⇄ Auschwitz': '配合導覽時間',
    'KRK → WRO': '鹽礦回程後轉場',
    'WRO → POZ': '樂斯拉夫全日後晚轉場',
    'POZ → WAW': '山羊秀後回華沙',
  };
  return (
    <div className="A-table-wrap" role="region" aria-label="跨城火車一覽" tabIndex={0}>
      <table className="A-train-table">
        <thead>
          <tr><th>路段</th><th>日期</th><th>類型</th><th>發車</th><th>抵達</th><th>車程</th><th>票價 PLN</th><th>預訂</th><th>轉場風險</th></tr>
        </thead>
        <tbody>
          {window.TRIP.trains.map((tr, i) =>
          <tr key={i}>
              <td>{tr.seg}</td><td>{tr.date}</td><td>{tr.type}</td><td>{tr.dep}</td><td>{tr.arr}</td><td>{tr.dur}</td><td>{tr.price}</td>
              <td><span className={mustBook.has(tr.seg) ? 'A-booking must' : 'A-booking'}>{mustBook.has(tr.seg) ? '必買' : '配合導覽'}</span></td>
              <td>{riskCopy[tr.seg] || '—'}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>);

}

function A_BookingTiers() {
  return (
    <div className="A-booking-grid">
      {window.TRIP.bookingTiers.map((tier) => (
        <div className="A-booking-card" key={tier.tier}>
          <header>
            <span>{tier.tier}</span>
            <small>{tier.note}</small>
          </header>
          <ul>
            {tier.items.map((item) => (
              <li key={item.name}>
                <a href={item.url} target="_blank" rel="noopener noreferrer">{item.name}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ───────── New sections ───────── */

function A_Flights() {
  const t = window.TRIP;
  const Block = ({ title, rows }) => (
    <div className="A-flight-block">
      <div className="A-flight-title">{title}</div>
      <ul className="A-flight-list">
        {rows.map((r, i) => (
          <li key={i} className={r.layover ? 'lay' : ''}>
            <span className="code">{r.code}</span>
            <span className="leg">{r.leg}</span>
            <span className="when">{r.when}</span>
            {r.dur && <span className="dur">{r.dur}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <div className="A-flights">
      <Block title="去程 · Outbound" rows={t.flights.out} />
      <Block title="回程 · Return" rows={t.flights.back} />
    </div>
  );
}

function A_Stay() {
  return (
    <div className="A-stay-grid">
      {window.TRIP.stay.map((s, i) => (
        <div className="A-stay-cell" key={s.city}>
          <span className="num">No. 0{i + 1}</span>
          <h4>{s.city}<small>{s.en}</small></h4>
          <div className="A-stay-pick">推薦 · {s.pick}</div>
          <p>{s.note}</p>
          <div className="A-stay-tip">★ {s.tip}</div>
        </div>
      ))}
    </div>
  );
}

function A_Tickets() {
  return (
    <div className="A-ticket-grid">
      {window.TRIP.tickets.map((c) => (
        <div className="A-ticket-card" key={c.city}>
          <h4>{c.city}</h4>
          <div className="A-ticket-rows">
            {c.items.map(([k, v], i) => (
              <div className="A-ticket-row" key={i}>
                <a href={A_mapsURL(k, c.city)}
                   target="_blank" rel="noopener noreferrer"
                   aria-label={`Google 地圖：${A_cleanPlace(k)}（${c.city}）`}>
                  <span>{k}</span>
                  <strong>{v}</strong>
                </a>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function A_Foods() {
  return (
    <>
      <p className="A-lead">
        波蘭料理融合立陶宛、烏克蘭、德國、俄羅斯與猶太風味——重口味、馬鈴薯、發酵酸味、長時間燉煮的肉類，是它的核心。
      </p>
      <div className="A-food-grid">
        {window.TRIP.foods.map((f) => (
          <div className="A-food-cell" key={f.n}>
            <span className="num">{f.n}</span>
            <h5>{f.cn}</h5>
            <div className="pl">{f.pl}</div>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
      <div className="A-tip">
        <strong>★ Bar Mleczny · 牛奶吧</strong> &nbsp;|&nbsp;
        最道地、最便宜的家常菜在共產時期遺留的國營廉價餐廳，套餐 PLN 25–35（NTD 215–300）。
      </div>
      <h3 className="A-sub-h">四城專屬料理 · City Specialties</h3>
      <div className="A-cityfood-legend" aria-hidden="true">
        <span className="bk must">必訂位</span>
        <span className="bk queue">排隊熱點</span>
        <span className="bk walk">走進去就好</span>
      </div>
      <div className="A-cityfood-grid">
        {window.TRIP.cityFood.map((c) => (
          <div className="A-cityfood-cell" key={c.city}>
            <header><strong>{c.city}</strong><em>{c.en}</em></header>
            <ul>
              {c.items.map((it, i) => (
                <li key={i}>
                  <span className="t">{it.tag}</span>
                  <a className="n"
                     href={A_mapsURL(it.name, c.city)}
                     target="_blank" rel="noopener noreferrer"
                     aria-label={`Google 地圖：${A_cleanPlace(it.name)}（${c.city}）`}>
                    <span>{it.name}</span>
                    {it.book && <span className={`bk ${it.book}`} title={
                      it.book === 'must' ? '建議提前訂位' :
                      it.book === 'queue' ? '排隊熱點，建議離峰前往' : '走進去就好'
                    }>
                      {it.book === 'must' ? '訂' : it.book === 'queue' ? '排' : '走'}
                    </span>}
                  </a>
                  <small>{it.note}</small>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

function A_Practical() {
  const t = window.TRIP;
  return (
    <>
      <div className="A-practical-grid">
        {t.practical.map((p, i) => (
          <div className="A-practical-cell" key={i}>
            <span className="tag">{p.tag}</span>
            <h5>{p.name}</h5>
            <p>{p.note}</p>
          </div>
        ))}
      </div>
      <h3 className="A-sub-h">行前預約時間軸 · Reservation Timeline</h3>
      <div className="A-resv-list">
        {t.reservations.map((r, i) => (
          <div className="A-resv-row" key={i}>
            <span className="when">{r.when}</span>
            <span className="what">{r.what}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function A_Safety() {
  const s = window.TRIP.safety;
  return (
    <div className="A-safety-grid">
      <div className="A-safety-card emergency">
        <h4>緊急電話 · Emergency</h4>
        <div className="rows">
          {s.emergency.map(([k, v], i) => (
            <div key={i}><span>{k}</span><strong>{v}</strong></div>
          ))}
        </div>
      </div>
      <div className="A-safety-card embassy">
        <h4>駐波蘭代表處 · Embassy</h4>
        <div className="rows">
          {s.embassy.map(([k, v], i) => (
            <div key={i}><span>{k}</span><strong>{v}</strong></div>
          ))}
        </div>
      </div>
      {s.tips.map((t, i) => (
        <div className="A-safety-card tip" key={i}>
          <span className="tag">{t.label}</span>
          <p>{t.text}</p>
        </div>
      ))}
    </div>
  );
}

function A_Shopping() {
  return (
    <>
      <div className="A-shop-grid">
        {window.TRIP.shopping.map((s, i) => (
          <div className="A-shop-cell" key={i}>
            <span className="tag">{s.tag}</span>
            <h5>{s.name}</h5>
            <p>{s.note}</p>
          </div>
        ))}
      </div>
      <div className="A-tip">
        <strong>★ Tax Free 退稅</strong> &nbsp;|&nbsp;
        單筆消費 PLN 200 以上、貼有 Tax Free（Global Blue / Planet）標誌的商店可退 8–18% VAT。離境前在華沙 / 克拉科夫機場海關蓋章。
      </div>
    </>
  );
}

function A_Phrases() {
  return (
    <div className="A-phrase-grid">
      {window.TRIP.phrases.map(([cn, pl, ipa], i) => (
        <div className="A-phrase-cell" key={i}>
          <div className="cn">{cn}</div>
          <div className="pl">{pl}</div>
          {ipa && <div className="ipa">{ipa}</div>}
        </div>
      ))}
    </div>
  );
}

function A_About() {
  return (
    <div className="A-about-grid">
      <div className="A-about-lead">
        <p>這份網站現在以 2026/10/24–10/31 的實際旅行為核心：華沙進出，先南下克拉科夫，再往西到樂斯拉夫，接著到波茲南，最後回華沙。重點不是把波蘭全部看完，而是把四座城市的核心景點、交通轉場與訂票風險排到可執行。</p>
        <p>整體節奏偏積極，Day 4、Day 5、Day 7 是壓力最高的三天。網站版的閱讀重點因此放在硬時間、必訂票、可壓縮項目與 Plan B，讓出發前檢查和旅途中查閱都更直接。</p>
      </div>
      <div className="A-fact-card">
        <h5>速覽</h5>
        {window.TRIP.about.map(([k, v], i) => (
          <div className="A-fact-row" key={i}><span>{k}</span><strong>{v}</strong></div>
        ))}
      </div>
    </div>
  );
}

/* ───────── Main ───────── */

const A_NAV = [
  { id: 'A-about',     n: '01', label: '前言' },
  { id: 'A-itin',      n: '02', label: '行程' },
  { id: 'A-flights',   n: '03', label: '航班' },
  { id: 'A-cities',    n: '04', label: '城市' },
  { id: 'A-trains',    n: '05', label: '火車' },
  { id: 'A-stay',      n: '06', label: '住宿' },
  { id: 'A-tickets',   n: '07', label: '門票' },
  { id: 'A-food',      n: '08', label: '美食' },
  { id: 'A-practical', n: '09', label: '實務' },
  { id: 'A-shopping',  n: '10', label: '購物' },
  { id: 'A-phrases',   n: '11', label: '波語' },
  { id: 'A-safety',    n: '12', label: '安全' },
];

function A_Section({ id, num, kicker, title, meta, children }) {
  return (
    <section className="A-section" id={id}>
      <div className="A-section-inner">
        <header className="A-shead">
          <span className="num">{num}</span>
          <div>
            <div className="kicker">{kicker}</div>
            <h2>{title}</h2>
          </div>
          {meta && <div className="meta">{meta}</div>}
        </header>
        {children}
      </div>
    </section>
  );
}

function A_Magazine() {
  const [activeDay, setActiveDay] = useState(1);
  const [activeNavId, setActiveNavId] = useState(A_NAV[0].id);
  const [navOpen, setNavOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const opts = { rootMargin: '-15% 0px -75% 0px', threshold: 0 };
    const dayObs = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          const n = parseInt(e.target.id.replace('A-day-', ''), 10);
          if (!Number.isNaN(n)) setActiveDay(n);
        }
      }
    }, opts);
    document.querySelectorAll('[id^="A-day-"]').forEach((el) => dayObs.observe(el));

    const sectObs = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) setActiveNavId(e.target.id);
      }
    }, opts);
    document.querySelectorAll('section.A-section').forEach((el) => sectObs.observe(el));

    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const onKey = (e) => { if (e.key === 'Escape') setNavOpen(false); };
    window.addEventListener('keydown', onKey);

    return () => {
      dayObs.disconnect(); sectObs.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveNavId(id);
    setNavOpen(false);
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="A-frame paper-tex">
      <header className="A-masthead">
        <span>2026/10/24–10/31</span>
        <span className="flag">Warszawa · Kraków · Wrocław · Poznań</span>
        <span>8 天 7 晚</span>
      </header>
      <nav className="A-nav" aria-label="主導覽">
        <span className="A-nav-brand">POLSKA — Trip Control</span>
        <button
          type="button"
          className="A-nav-toggle"
          aria-expanded={navOpen}
          aria-controls="A-nav-links"
          onClick={() => setNavOpen((v) => !v)}>
          {navOpen ? '關閉' : '目錄'}
        </button>
        <div id="A-nav-links" className={`A-nav-links ${navOpen ? 'open' : ''}`}>
          {A_NAV.map((item) => (
            <a key={item.id} href={`#${item.id}`}
               className={activeNavId === item.id ? 'active' : ''}
               aria-current={activeNavId === item.id ? 'true' : undefined}
               onClick={(e) => handleNavClick(e, item.id)}>{item.label}</a>
          ))}
        </div>
        <a href="index.html?classic=1" className="A-nav-cta">經典版</a>
      </nav>
      <A_Hero />

      <A_Section id="A-about" num="01" kicker="Prologue · 前言"
        title="這趟旅行的操作邏輯"
        meta="以四城路線為主，不是泛用國家指南">
        <A_About />
      </A_Section>

      <A_Section id="A-itin" num="02" kicker="8 日四城深度路線 · Itinerary"
        title="四城深度路線（10/24 – 10/31）"
        meta="Day-by-day · 八日完整時間軸">
        <A_RouteMap />
        <A_DayRail activeDay={activeDay} onPick={setActiveDay} />
        {window.TRIP.days.map((d) => <A_Day key={d.n} d={d} />)}
      </A_Section>

      <A_Section id="A-flights" num="03" kicker="Flights · 本次航班"
        title="台北 ⇄ 華沙（QR / CX 聯運）"
        meta="去程 23 小時 · 回程 21 小時">
        <A_Flights />
      </A_Section>

      <A_Section id="A-cities" num="04" kicker="Four Cities · 四城角色"
        title="本次造訪的四座王城"
        meta="華沙分段住宿 · 克拉科夫 2 晚">
        <A_Cities />
      </A_Section>

      <A_Section id="A-trains" num="05" kicker="Rail Schedule · 跨城火車"
        title="5 段火車一覽"
        meta="intercity.pl · 提前 30 天 Super Promo">
        <A_Trains />
      </A_Section>

      <A_Section id="A-stay" num="06" kicker="Where to Stay · 住宿區域"
        title="每個城市該住在哪一區"
        meta="Booking 主流 · Airbnb 合法">
        <A_Stay />
      </A_Section>

      <A_Section id="A-tickets" num="07" kicker="Admission · 門票價格"
        title="訂票優先級與主要門票"
        meta="先鎖硬限制，再處理餐廳">
        <A_BookingTiers />
        <A_Tickets />
      </A_Section>

      <A_Section id="A-food" num="08" kicker="Polish Cuisine · 波蘭美食"
        title="餃子、酸湯、與一杯野牛草伏特加"
        meta="12 道國民料理 + 四城招牌">
        <A_Foods />
      </A_Section>

      <A_Section id="A-practical" num="09" kicker="Practical · 實務節點"
        title="寄物 · 換錢 · SIM · 退稅"
        meta="行前預約時間軸 + 抵達後關鍵動作">
        <A_Practical />
      </A_Section>

      <A_Section id="A-shopping" num="10" kicker="Souvenirs · 帶什麼回家"
        title="七件值得帶回的波蘭物產"
        meta="Tax Free 8–18% VAT 可退">
        <A_Shopping />
      </A_Section>

      <A_Section id="A-phrases" num="11" kicker="Phrasebook · 波蘭語生存包"
        title="說幾句波蘭語"
        meta="ł 發英文 w · ą/ę 為鼻化音">
        <A_Phrases />
      </A_Section>

      <A_Section id="A-safety" num="12" kicker="Safety · 安全與緊急"
        title="遇到狀況時，這些電話救命"
        meta="全球安全指數前 30">
        <A_Safety />
      </A_Section>

      <footer className="A-foot">
        <span>POLSKA · 波蘭 8 天 7 晚旅行控制台</span>
        <span>2026/10/24–10/31</span>
      </footer>

      <button
        type="button"
        className={`A-totop ${showTop ? 'show' : ''}`}
        onClick={scrollTop}
        aria-label="回到最上方"
        title="回到最上方">↑</button>
    </div>);

}

window.A_Magazine = A_Magazine;
