import { renderLayout } from './layout.mjs';

function renderList(items, renderItem) {
  return items?.length ? `<ul class="check-list">${items.map(renderItem).join('')}</ul>` : '';
}

export function renderDay(day, photoSpotsForDay = []) {
  const stepsHtml = day.steps.map(step => `
    <tr>
      <td class="number"><b>${step.t}</b></td>
      <td><b>${step.label}</b>${step.sub ? `<br><span class="timeline-note">${step.sub}</span>` : ''}</td>
      <td class="number">${step.cost || '—'}</td>
      <td class="number">${step.dur || '—'}</td>
    </tr>`).join('');

  const trainHtml = day.train ? `
    <section class="section">
      <div class="section-heading"><span class="section-num">Transport</span><h2>當天交通</h2></div>
      <article class="card card-accent">
        <span class="eyebrow">${day.train.type}${day.train.leg ? ` · ${day.train.leg}` : ''}</span>
        <h3>${day.train.from || ''}${day.train.to ? ` → ${day.train.to}` : ''}</h3>
        <p><b>${day.train.dep} → ${day.train.arr}</b> · ${day.train.dur} · ${day.train.price.startsWith('PLN') ? day.train.price : `PLN ${day.train.price}`}</p>
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
    </div>`;

  const eatHtml = day.eat?.length ? `
    <section class="section">
      <div class="section-heading"><span class="section-num">Food</span><h2>順路必吃</h2></div>
      <div class="grid">${day.eat.map(item => `<div class="card"><p>${item}</p></div>`).join('')}</div>
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
      <div class="grid">${photoSpotsForDay.map(spot => `
        <article class="card">
          <span class="eyebrow">${spot.bestTime}</span>
          <h3>${spot.name}</h3>
          <p>${spot.light}</p>
        </article>`).join('')}
      </div>
    </section>` : '';

  const previous = day.n > 1 ? `<a href="day-${String(day.n - 1).padStart(2, '0')}.html">← Day ${day.n - 1}</a>` : '<span></span>';
  const next = day.n < 8 ? `<a href="day-${String(day.n + 1).padStart(2, '0')}.html">Day ${day.n + 1} →</a>` : '<a href="index.html">回到總覽 →</a>';

  const bodyHtml = `
    <header class="hero">
      <div class="hero-copy">
        <span class="section-num">Day ${String(day.n).padStart(2, '0')} · ${day.date}</span>
        <h1>${day.title}</h1>
        <p class="hero-dek">${day.headline}</p>
      </div>
      <aside class="hero-aside">
        <dl class="meta-list">
          <div><dt>城市</dt><dd>${day.city}</dd></div>
          <div><dt>強度</dt><dd>${day.intensity}</dd></div>
          <div><dt>天氣參考</dt><dd>${day.weather}</dd></div>
          <div><dt>類型</dt><dd>${day.tag}</dd></div>
        </dl>
      </aside>
    </header>

    ${mustBookHtml}
    ${warnHtml}
    ${constraintHtml}

    <section class="section">
      <div class="section-heading"><span class="section-num">Schedule</span><h2>當日時間表</h2></div>
      <div class="table-wrap">
        <table class="table-editorial">
          <thead><tr><th>時間</th><th>行程</th><th>花費</th><th>時長</th></tr></thead>
          <tbody>${stepsHtml}</tbody>
        </table>
      </div>
    </section>

    ${trainHtml}
    ${eatHtml}
    ${extendHtml}
    ${backupHtml}
    ${practicalHtml}
    ${photoHtml}

    <nav class="section-heading" aria-label="每日行程翻頁">${previous}${next}</nav>`;

  return renderLayout({ title: `Day ${day.n} ${day.title}`, activeNav: 'days', bodyHtml });
}
