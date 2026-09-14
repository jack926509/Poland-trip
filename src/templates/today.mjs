import { renderLayout } from './layout.mjs';
import { dayIsoDate } from '../lib/schedule.mjs';
import { dayGap, warsawTodayLocal, selectToday, statusText, initializeToday } from '../scripts/today.js';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function safeHttpsUrl(value) {
  const raw = String(value ?? '').trim();
  return /^https:\/\//.test(raw) ? raw : null;
}

/** 當晚落腳處：入住日當天到退房日前一天都算這一筆。 */
function stayForDate(stay, iso) {
  return stay.find(item => item.checkIn <= iso && iso < item.checkOut) || null;
}

function renderSteps(day) {
  const rows = day.steps.map(step => `<tr>
      <td class="number" data-label="時間"><b>${escapeHtml(step.t || '—')}</b></td>
      <td data-label="行程">${escapeHtml(step.label)}${step.sub ? `<br><span class="source-meta">${escapeHtml(step.sub)}</span>` : ''}</td>
    </tr>`).join('');
  return `<div class="table-wrap"><table class="table-editorial"><thead><tr><th>時間</th><th>行程</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function renderDayCard(day, { iso, stay, dining, sun, dayHref }) {
  const bed = stayForDate(stay, iso);
  const meals = (dining || []).map(item => `<li><b>${escapeHtml(item.role)}</b>：${escapeHtml(item.name)}${safeHttpsUrl(item.map) ? ` <a href="${escapeHtml(safeHttpsUrl(item.map))}" target="_blank" rel="noopener noreferrer">地圖 ↗</a>` : ''}<br><span class="source-meta">${escapeHtml(item.address)}</span></li>`).join('');
  const backups = (day.backup || []).map(item => `<li><b>${escapeHtml(item.label)}</b>：${escapeHtml(item.where)}</li>`).join('');
  const mustBook = (day.mustBook || []).map(item => `<li>${escapeHtml(item)}</li>`).join('');

  // 硬性時間是這張卡最該先看到的東西，放在最上面。
  const hard = (day.hardConstraints || []).map(item => `<li>${escapeHtml(item)}</li>`).join('');

  // 不在 HTML 裡預先 hidden：沒有 JavaScript 時八張卡全部顯示（與 noscript 的
  // 說明一致），有 JavaScript 才由 initializeToday 收成當天那一張。
  return `<article class="today-card" data-today-card data-today-date="${escapeHtml(iso)}">
    <header class="today-head">
      <span class="eyebrow">Day ${day.n} · ${escapeHtml(day.date)}</span>
      <h2>${escapeHtml(day.title)}</h2>
      <p>${escapeHtml(day.headline)}</p>
      <p><a class="journal-text-link" href="${escapeHtml(dayHref)}">開啟完整 Day ${day.n} 頁面 →</a></p>
    </header>

    ${hard ? `<section class="today-block today-block-alert">
      <h3>今天不能延誤</h3>
      <ul>${hard}</ul>
    </section>` : ''}

    ${bed ? `<section class="today-block">
      <h3>今晚落腳</h3>
      <p><b>${escapeHtml(bed.name)}</b></p>
      <p class="today-address" lang="pl">${escapeHtml(bed.address)}</p>
      <p class="source-meta">入住 ${escapeHtml(bed.checkInTime || '依訂房確認')}／退房 ${escapeHtml(bed.checkOutTime || '依訂房確認')}。地址為波蘭文原文，可直接出示給司機或櫃檯。</p>
    </section>` : ''}

    ${day.train ? `<section class="today-block">
      <h3>今天的城際移動</h3>
      <p><b>${escapeHtml(day.train.type || '')}</b>　${escapeHtml(day.train.from || '')} → ${escapeHtml(day.train.to || '')}</p>
      <p>${escapeHtml(day.train.dep || '')} – ${escapeHtml(day.train.arr || '')}（${escapeHtml(day.train.dur || '')}）</p>
      <p class="source-meta">${escapeHtml(day.train.leg || '')}</p>
    </section>` : ''}

    <section class="today-block">
      <h3>時間表</h3>
      ${renderSteps(day)}
    </section>

    ${sun ? `<section class="today-block">
      <h3>日照</h3>
      <p>日出 <b>${escapeHtml(sun.sunrise)}</b>／日落 <b>${escapeHtml(sun.sunset)}</b>／藍調至 <b>${escapeHtml(sun.blueHourEnd)}</b>（${escapeHtml(sun.tz)}）</p>
      <p class="source-meta">${escapeHtml(sun.note)}</p>
    </section>` : ''}

    ${meals ? `<section class="today-block">
      <h3>今天吃哪</h3>
      <ul class="today-list">${meals}</ul>
    </section>` : ''}

    ${mustBook ? `<section class="today-block today-block-alert">
      <h3>仍未訂妥</h3>
      <ul>${mustBook}</ul>
    </section>` : ''}

    ${backups ? `<section class="today-block">
      <h3>備案</h3>
      <ul class="today-list">${backups}</ul>
    </section>` : ''}
  </article>`;
}

/**
 * 今日卡：旅途中唯一真正會開的一頁。
 *
 * 八天全部在建置時靜態渲染，前端只決定顯示哪一張——靜態站不知道「今天」是
 * 哪天，而把內容留到前端組裝會讓離線與無 JavaScript 情境同時失效。
 * 日期以華沙當地時間判斷（行前倒數看台北，人在當地時看當地），
 * 跨越 10/25 冬令時轉換仍正確。
 *
 * 所有選取器一律用 data-*，不用 id：單檔版會替每頁的 id 加前綴，
 * 寫死 id 的腳本在單檔版會失效。
 */
export function renderToday({ meta, days, stay, dayDining = {}, daylight = [], safety, pathPrefix = '' }) {
  const daylightByDay = new Map(daylight.map(item => [item.day, item]));
  const cards = days.map(day => renderDayCard(day, {
    iso: dayIsoDate(day.date, meta.tripStart),
    stay,
    dining: dayDining[String(day.n)],
    sun: daylightByDay.get(day.n),
    dayHref: `${pathPrefix}day-${String(day.n).padStart(2, '0')}.html`,
  })).join('');

  // 內嵌時沒有 import，相依函式要全部列進來（dayGap 支撐 selectToday）。
  const todayRuntime = [dayGap, warsawTodayLocal, selectToday, statusText, initializeToday]
    .map(fn => fn.toString()).join('\n');

  const emergency = (safety?.emergency || [])
    .map(([label, number]) => `<li><b>${escapeHtml(number)}</b>　${escapeHtml(label)}</li>`).join('');

  const bodyHtml = `
    <header class="journal-appendix-header">
      <span class="section-num">Today</span>
      <h1>今日卡</h1>
      <p class="hero-dek">今天該做什麼、住哪、幾點出發、天黑前要收哪一段，集中在這一頁。日期以華沙當地時間判斷。</p>
    </header>

    <p class="today-status" data-today-status>正在判斷今天是旅程的第幾天…</p>
    <noscript><p class="today-status">JavaScript 未啟用時無法自動選日，以下列出全部八天。</p></noscript>

    <div data-today-cards>${cards}</div>

    <section class="section" data-today-outside hidden>
      <div class="section-heading"><span class="section-num">Off-trip</span><h2>不在旅程期間</h2></div>
      <p data-today-outside-note></p>
      <p><a class="journal-text-link" href="${pathPrefix}practical/booking.html#countdown">看訂票與查核倒數 →</a>　<a class="journal-text-link" href="${pathPrefix}index.html#days">開啟八日行程目錄 →</a></p>
    </section>

    <section class="section">
      <div class="section-heading"><span class="section-num">SOS</span><h2>緊急電話</h2></div>
      <ul class="today-list">${emergency}</ul>
      <p class="source-meta">歐洲通用緊急號碼 112 可直接撥打，不需解鎖或有 SIM 卡餘額。</p>
    </section>

    <script>
      (function() {
        ${todayRuntime}
        const root = document.currentScript.closest('.standalone-page') || document;
        initializeToday(root);
      }());
    </script>`;

  return renderLayout({
    title: '今日卡',
    activeNav: 'today',
    bodyHtml: bodyHtml.trim(),
    pathPrefix,
    pageKind: 'today',
    currentPage: 'today.html',
    description: '旅途中的單頁速查：今天的硬時間點、住宿地址、交通、餐飲、日照與備案。',
  });
}
