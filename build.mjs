import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as trip from './src/data/trip.js';
import * as cities from './src/data/cities.js';
import * as dining from './src/data/dining.js';
import * as tickets from './src/data/tickets.js';
import * as transit from './src/data/transit.js';
import * as shopping from './src/data/shopping.js';
import * as essentials from './src/data/essentials.js';
import * as travelDatabase from './src/data/travel-database.js';

import { renderHome } from './src/templates/home.mjs';
import { renderDay } from './src/templates/day.mjs';
import { renderCity } from './src/templates/city.mjs';
import {
  renderBooking,
  renderTodos,
  renderDining,
  renderTickets,
  renderTransit,
  renderShopping,
  renderEssentials,
  renderNotes,
  renderOpsDashboard,
} from './src/templates/practical.mjs';
import { renderDatabase } from './src/templates/database.mjs';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(projectRoot, 'dist');
const standalonePath = path.join(projectRoot, 'poland-travel-guide-2026.html');
const standalonePages = [
  ['index.html', '旅程首頁'],
  ...Array.from({ length: 8 }, (_, index) => [
    `day-${String(index + 1).padStart(2, '0')}.html`,
    `Day ${index + 1}`,
  ]),
  ['city-warszawa.html', '華沙'],
  ['city-krakow.html', '克拉科夫'],
  ['city-wroclaw.html', '樂斯拉夫'],
  ['city-poznan.html', '波茲南'],
  ['practical/todos.html', '待辦事項'],
  ['practical/booking.html', '訂票與交通'],
  ['practical/dining.html', '餐廳'],
  ['practical/tickets.html', '門票'],
  ['practical/transit.html', '市內交通'],
  ['practical/shopping.html', '購物'],
  ['practical/essentials.html', '安全須知'],
  ['practical/notes.html', '行前提醒'],
  ['practical/ops-dashboard.html', '資料更新儀表板'],
  ['practical/database.html', '自由行資料庫'],
];
const standaloneNavGroups = [
  { key: 'days', label: '每日行程', pages: standalonePages.slice(1, 9) },
  { key: 'cities', label: '城市指南', pages: standalonePages.slice(9, 13) },
  { key: 'practical', label: '實用資訊', pages: standalonePages.slice(13) },
];
const cityMap = {
  warszawa: { key: 'WAW', mapKey: 'warsaw' },
  krakow: { key: 'KRK', mapKey: 'krakow' },
  wroclaw: { key: 'WRO', mapKey: 'wroclaw' },
  poznan: { key: 'POZ', mapKey: 'poznan' },
};

function resetOutput() {
  fs.rmSync(distDir, { recursive: true, force: true });
  fs.mkdirSync(path.join(distDir, 'practical'), { recursive: true });
  fs.mkdirSync(path.join(distDir, 'assets'), { recursive: true });
  fs.mkdirSync(path.join(distDir, 'assets', 'photos'), { recursive: true });
}

function writeHtml(relativePath, html) {
  fs.writeFileSync(path.join(distDir, relativePath), html, 'utf8');
}

function standalonePageId(relativePath) {
  return `page-${relativePath.replace(/\.html$/, '').replace(/[^a-z0-9]+/gi, '-')}`;
}

function bundlePage(relativePath, label, pageIndex) {
  const html = fs.readFileSync(path.join(distDir, relativePath), 'utf8');
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  if (!main) throw new Error(`無法從 ${relativePath} 取得主要內容`);

  const currentPageId = standalonePageId(relativePath);
  const knownPages = new Set(standalonePages.map(([page]) => page));
  const rewriteHref = (_, href) => {
    if (/^(?:[a-z]+:|\/\/)/i.test(href)) return `href="${href}"`;
    if (href.startsWith('#')) return `href="#${currentPageId}--${href.slice(1)}"`;

    const [targetPath, fragment] = href.split('#');
    const resolvedPath = path.posix.normalize(path.posix.join(path.posix.dirname(relativePath), targetPath));
    if (!knownPages.has(resolvedPath)) return `href="${href}"`;
    const targetPageId = standalonePageId(resolvedPath);
    return `href="#${targetPageId}${fragment ? `--${fragment}` : ''}"`;
  };

  const content = main[1]
    .replace(/\s*<script src="https:\/\/unpkg\.com\/leaflet@1\.9\.4\/dist\/leaflet\.js"><\/script>/g, '')
    .replace(/\s*<script src="\.\.\/assets\/database-filter\.js" defer><\/script>/g, '')
    .replace(/href="([^"]+)"/g, rewriteHref)
    .replace(/\bid="([^"]+)"/g, (_, id) => `id="${currentPageId}--${id}"`)
    .replace(/\bfor="([^"]+)"/g, (_, id) => `for="${currentPageId}--${id}"`)
    .replace(/\baria-labelledby="([^"]+)"/g, (_, ids) => (
      `aria-labelledby="${ids.split(/\s+/).map(id => `${currentPageId}--${id}`).join(' ')}"`
    ))
    .replace(/\baria-describedby="([^"]+)"/g, (_, ids) => (
      `aria-describedby="${ids.split(/\s+/).map(id => `${currentPageId}--${id}`).join(' ')}"`
    )).trim();

  const previous = standalonePages[pageIndex - 1];
  const next = standalonePages[pageIndex + 1];
  const controls = `<nav class="standalone-page-controls" aria-label="${label} 章節切換">
    ${previous ? `<a href="#${standalonePageId(previous[0])}">← ${previous[1]}</a>` : '<span aria-hidden="true"></span>'}
    <span>第 ${pageIndex + 1} / ${standalonePages.length} 頁</span>
    ${next ? `<a href="#${standalonePageId(next[0])}">${next[1]} →</a>` : '<span aria-hidden="true"></span>'}
  </nav>`;

  return `<section class="standalone-page" id="${currentPageId}" data-source="${relativePath}">
  <header class="standalone-page-ribbon"><span>POLSKA PAPER TRAVEL JOURNAL</span><strong>${label}</strong></header>
${content}
${controls}
</section>`;
}

function buildStandalone() {
  const mainCss = fs.readFileSync(path.join(distDir, 'assets/main.css'), 'utf8');
  const databaseFilterJs = fs.readFileSync(path.join(distDir, 'assets/database-filter.js'), 'utf8');
  const navMenus = standaloneNavGroups.map(group => {
    const links = group.pages
      .map(([relativePath, label]) => `<a href="#${standalonePageId(relativePath)}">${label}</a>`)
      .join('\n          ');
    return `<details class="standalone-menu" name="standalone-primary-nav" data-group="${group.key}">
        <summary>${group.label}</summary>
        <div class="standalone-menu-panel">
          ${links}
        </div>
      </details>`;
  }).join('\n      ');
  const bundledPages = standalonePages
    .map(([relativePath, label], pageIndex) => bundlePage(relativePath, label, pageIndex))
    .join('\n');
  const html = `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="2026 波蘭四城 8 天旅遊規劃單檔版：逐日行程、城市、交通、門票、餐廳與自由行資料庫。">
  <title>POLSKA 波蘭行 · 2026 單檔完整版</title>
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='8' fill='%232b2723'/%3E%3Ctext x='32' y='44' text-anchor='middle' font-size='38' font-family='serif' font-weight='700' fill='%23f6f1e8'%3EP%3C/text%3E%3C/svg%3E">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&amp;family=Noto+Sans+TC:wght@400;500;700&amp;family=Inter:wght@400;500;700&amp;display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
  <style data-bundled="main.css">
${mainCss}
  </style>
  <style>
    html { scroll-behavior: smooth; }
    body { overflow-x: clip; }
    .standalone-nav {
      position: sticky;
      top: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      gap: .5rem;
      padding: .75rem max(1rem, calc((100vw - 1180px) / 2));
      background: rgba(43, 39, 35, .97);
      border-bottom: 1px solid rgba(255, 255, 255, .15);
    }
    .standalone-home,
    .standalone-menu > summary {
      padding: .45rem .7rem;
      color: #f6f1e8;
      border: 1px solid rgba(255, 255, 255, .22);
      border-radius: 999px;
      font-size: .82rem;
      font-weight: 700;
      line-height: 1.4;
      text-decoration: none;
      white-space: nowrap;
    }
    .standalone-home:hover,
    .standalone-home:focus-visible,
    .standalone-menu > summary:hover,
    .standalone-menu > summary:focus-visible,
    .standalone-menu[open] > summary { background: #f6f1e8; color: #2b2723; }
    .standalone-menu { position: relative; }
    .standalone-menu > summary { cursor: pointer; list-style: none; }
    .standalone-menu > summary::-webkit-details-marker { display: none; }
    .standalone-menu > summary::after { margin-left: .45rem; content: '▾'; }
    .standalone-menu[open] > summary::after { content: '▴'; }
    .standalone-menu-panel {
      position: absolute;
      top: calc(100% + .65rem);
      left: 0;
      z-index: 100;
      display: grid;
      grid-template-columns: repeat(2, minmax(8.5rem, 1fr));
      gap: .35rem;
      width: max-content;
      min-width: 18rem;
      max-width: min(32rem, calc(100vw - 2rem));
      padding: .65rem;
      background: #2b2723;
      border: 1px solid rgba(255, 255, 255, .22);
      border-radius: .75rem;
      box-shadow: 0 .75rem 1.5rem rgba(0, 0, 0, .2);
    }
    .standalone-menu:last-child .standalone-menu-panel { right: 0; left: auto; }
    .standalone-menu-panel a {
      padding: .6rem .7rem;
      color: #f6f1e8;
      border-radius: .45rem;
      font-size: .86rem;
      text-decoration: none;
      white-space: nowrap;
    }
    .standalone-menu-panel a:hover,
    .standalone-menu-panel a:focus-visible { background: #f6f1e8; color: #2b2723; }
    .standalone-page {
      display: block;
      min-height: calc(100dvh - 5rem);
      padding-block: 1rem 3rem;
      scroll-margin-top: 5rem;
      border-bottom: 1px solid rgba(43, 39, 35, .25);
    }
    .standalone-page-ribbon {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 1rem;
      width: min(1180px, calc(100% - 2rem));
      margin: 0 auto 1.5rem;
      padding: .75rem 0;
      color: #7e2c1a;
      border-block: 2px solid #2b2723;
      font-size: .75rem;
      font-weight: 700;
    }
    .standalone-page-ribbon span { letter-spacing: .08em; }
    .standalone-page-ribbon strong { color: #2b2723; font-family: "Playfair Display", serif; font-size: 1.1rem; }
    .standalone-page-controls {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 1rem;
      width: min(1180px, calc(100% - 2rem));
      margin: 3rem auto 0;
      padding-top: 1.25rem;
      border-top: 1px solid rgba(43, 39, 35, .25);
      font-size: .9rem;
    }
    .standalone-page-controls a { color: #7e2c1a; font-weight: 700; text-decoration: none; }
    .standalone-page-controls a:last-child { text-align: right; }
    .standalone-page-controls a:hover,
    .standalone-page-controls a:focus-visible { text-decoration: underline; }
    .standalone-page-controls span { color: #6a625b; font-size: .78rem; }
    .standalone-page-controls span:last-child { text-align: right; }
    .standalone-page[hidden] { display: none; }
    .standalone-page:not([hidden]) {
      animation: none;
    }
    .standalone-page > .hero,
    .standalone-page > .journal-cover,
    .standalone-page > .journal-day-header,
    .standalone-page > .journal-city-cover,
    .standalone-page > .journal-appendix-header,
    .standalone-page > .journal-database,
    .standalone-page > .journal-status-strip,
    .standalone-page > .section,
    .standalone-page > .route-strip,
    .standalone-page > .grid-wide,
    .standalone-page > .callout-good,
    .standalone-page > nav.section-heading { width: min(1180px, calc(100% - 2rem)); margin-inline: auto; }
    .standalone-page > .hero { padding-top: 4rem; }
    .standalone-page > nav.section-heading { padding-bottom: 3rem; }
    @media (max-width: 640px) {
      .standalone-nav {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        padding-inline: .75rem;
      }
      .standalone-home,
      .standalone-menu > summary { display: block; text-align: center; }
      .standalone-menu { position: static; min-width: 0; }
      .standalone-menu-panel {
        top: calc(100% - .15rem);
        right: .75rem;
        left: .75rem;
        width: auto;
        min-width: 0;
        max-width: none;
        max-height: 65dvh;
        overflow-y: auto;
      }
      .standalone-menu:last-child .standalone-menu-panel { right: .75rem; left: .75rem; }
      .standalone-page { scroll-margin-top: 7.5rem; }
      .standalone-page-ribbon { align-items: flex-start; flex-direction: column; gap: .25rem; }
      .standalone-page-controls { grid-template-columns: 1fr 1fr; }
      .standalone-page-controls > span { display: none; }
    }
    @media print {
      .standalone-nav { display: none; }
      .standalone-page,
      .standalone-page[hidden] { display: block !important; break-before: page; border: 0; }
      .standalone-page:first-of-type { break-before: auto; }
      .standalone-page-controls { display: none; }
    }
  </style>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
</head>
<body class="journal-site journal-standalone">
  <a class="skip-link" href="#page-index">跳至旅程首頁</a>
  <nav class="standalone-nav journal-masthead" aria-label="單檔版目錄">
      <a class="standalone-home" href="#page-index">POLSKA PAPER TRAVEL JOURNAL</a>
      ${navMenus}
  </nav>
  <main id="standalone-content">
${bundledPages}
  </main>
  <footer class="footer">
    <div class="footer-inner">
      <p>POLSKA 波蘭行 · 2026/10/24–10/31 · 單檔完整版</p>
      <p>票價、開放時間與交通資料查證於 2026-08-09；尚未開賣或會變動的項目已明確標示，實際以官網與已購票券為準。</p>
    </div>
  </footer>
  <script>
    (function () {
      var pages = Array.from(document.querySelectorAll('.standalone-page'));
      var defaultPageId = 'page-index';

      function showStandalonePage(targetId) {
        var target = document.getElementById(targetId);
        var activePage = target ? target.closest('.standalone-page') : document.getElementById(defaultPageId);
        var activePageId = activePage ? activePage.id : defaultPageId;
        pages.forEach(function (page) {
          page.hidden = page.id !== activePageId;
        });
        window.requestAnimationFrame(function () {
          var activeTarget = document.getElementById(targetId) || document.getElementById(activePageId);
          if (activeTarget) activeTarget.scrollIntoView({ block: 'start' });
          window.dispatchEvent(new Event('resize'));
        });
      }

      function activateStandaloneHash() {
        showStandalonePage(decodeURIComponent(window.location.hash.slice(1)) || defaultPageId);
      }

      document.querySelector('.standalone-nav').addEventListener('click', function (event) {
        if (!event.target.closest('a[href^="#"]')) return;
        document.querySelectorAll('.standalone-menu[open]').forEach(function (menu) {
          menu.removeAttribute('open');
        });
      });
      window.addEventListener('hashchange', activateStandaloneHash);
      activateStandaloneHash();
    }());
${databaseFilterJs}
  </script>
</body>
</html>`;

  fs.writeFileSync(standalonePath, html, 'utf8');
}

function build() {
  resetOutput();
  fs.copyFileSync(path.join(projectRoot, 'src/styles/main.css'), path.join(distDir, 'assets/main.css'));
  fs.copyFileSync(path.join(projectRoot, 'src/scripts/nav.js'), path.join(distDir, 'assets/nav.js'));
  fs.copyFileSync(path.join(projectRoot, 'src/scripts/database-filter.js'), path.join(distDir, 'assets/database-filter.js'));
  fs.cpSync(path.join(projectRoot, 'assets', 'photos'), path.join(distDir, 'assets', 'photos'), { recursive: true });

  writeHtml('index.html', renderHome({
    meta: trip.meta,
    days: trip.days,
    flights: trip.flights,
    cities: cities.cities,
    todoGroups: trip.todoGroups,
    databaseEntries: travelDatabase.databaseEntries,
  }));

  for (const day of trip.days) {
    const photoSpotsForDay = cities.photoSpots.filter(spot => spot.day === day.n);
    const namedCities = cities.cities.filter(city => day.city.includes(city.name));
    const journalCity = namedCities.at(-1) || cities.cities[0];
    writeHtml(
      `day-${String(day.n).padStart(2, '0')}.html`,
      renderDay(day, photoSpotsForDay, travelDatabase.dayOperations[day.n], journalCity),
    );
  }

  for (const [fileKey, { key, mapKey }] of Object.entries(cityMap)) {
    const city = cities.cities.find(item => item.key === key);
    writeHtml(`city-${fileKey}.html`, renderCity({
      city,
      cityKey: mapKey,
      mapData: cities.mapPins[mapKey],
      legend: cities.pinCategoryLegend,
      attractionsForCity: cities.attractions[mapKey],
      dining: dining.cityDining[mapKey],
      cityFoodForCity: dining.cityFood.find(group => group.city === city.name),
      foodBackupForCity: dining.foodBackup.find(group => group.city === city.name),
      photoSpotsForCity: cities.photoSpots.filter(spot => spot.cityKey === key),
      story: cities.cityStories.find(item => item.city === city.name),
      notices: cities.cityNotices[mapKey],
    }));
  }

  writeHtml('practical/booking.html', renderBooking({
    flights: trip.flights,
    trains: trip.trains,
    stay: trip.stay,
    bookingTiers: trip.bookingTiers,
    reservations: trip.reservations,
    railOfficialLinks: trip.railOfficialLinks,
    railPurchaseSteps: trip.railPurchaseSteps,
  }));
  writeHtml('practical/todos.html', renderTodos({
    todoGroups: trip.todoGroups,
  }));
  writeHtml('practical/dining.html', renderDining({
    michelinSummary: dining.michelinSummary,
    michelinReservations: dining.michelinReservations,
    verifiedRestaurantHours: dining.verifiedRestaurantHours,
  }));
  writeHtml('practical/tickets.html', renderTickets({
    fares: tickets.fares,
    ticketsByCity: tickets.ticketsByCity,
    notices: tickets.ticketNotices,
  }));
  writeHtml('practical/transit.html', renderTransit({
    transitFares: transit.transitFares,
    airportTransit: transit.airportTransit,
    recommendedApps: transit.recommendedApps,
    passChecklist: transit.passChecklist,
    usefulRoutes: transit.usefulRoutes,
    practical: transit.practical,
  }));
  writeHtml('practical/shopping.html', renderShopping({
    souvenirCards: shopping.souvenirCards,
    luxuryShopping: shopping.luxuryShopping,
    souvenirShops: shopping.souvenirShops,
    shopping: shopping.shopping,
    zabkaCards: shopping.zabkaCards,
  }));
  writeHtml('practical/essentials.html', renderEssentials({
    phrases: essentials.phrases,
    packingDefault: essentials.packingDefault,
    about: essentials.about,
    safety: essentials.safety,
  }));
  writeHtml('practical/notes.html', renderNotes({
    preDepartureNotes: essentials.preDepartureNotes,
  }));
  writeHtml('practical/ops-dashboard.html', renderOpsDashboard({
    entries: travelDatabase.databaseEntries,
    statusLabels: travelDatabase.statusLabels,
    syncRows: travelDatabase.syncRows,
    todoGroups: trip.todoGroups,
  }));
  writeHtml('practical/database.html', renderDatabase({
    entries: travelDatabase.databaseEntries,
    sections: travelDatabase.databaseSections,
    statusLabels: travelDatabase.statusLabels,
  }));

  buildStandalone();

  const htmlCount = fs.readdirSync(distDir).filter(name => name.endsWith('.html')).length
    + fs.readdirSync(path.join(distDir, 'practical')).filter(name => name.endsWith('.html')).length;
  if (htmlCount !== 23) throw new Error(`預期產生 23 頁，實際為 ${htmlCount} 頁`);
  console.log(`build 完成：${htmlCount} 頁已產生至 dist/，另產生 poland-travel-guide-2026.html 單檔版`);
}

build();
