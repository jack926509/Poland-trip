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
  renderDining,
  renderTickets,
  renderTransit,
  renderShopping,
  renderEssentials,
  renderNotes,
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
  ['practical/booking.html', '訂票與交通'],
  ['practical/dining.html', '餐廳'],
  ['practical/tickets.html', '門票'],
  ['practical/transit.html', '市內交通'],
  ['practical/shopping.html', '購物'],
  ['practical/essentials.html', '安全須知'],
  ['practical/notes.html', '行前提醒'],
  ['practical/database.html', '自由行資料庫'],
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
}

function writeHtml(relativePath, html) {
  fs.writeFileSync(path.join(distDir, relativePath), html, 'utf8');
}

function standalonePageId(relativePath) {
  return `page-${relativePath.replace(/\.html$/, '').replace(/[^a-z0-9]+/gi, '-')}`;
}

function bundlePage(relativePath) {
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
    .replace(/href="([^"]+)"/g, rewriteHref)
    .replace(/\bid="([^"]+)"/g, (_, id) => `id="${currentPageId}--${id}"`)
    .replace(/\baria-labelledby="([^"]+)"/g, (_, ids) => (
      `aria-labelledby="${ids.split(/\s+/).map(id => `${currentPageId}--${id}`).join(' ')}"`
    ))
    .replace(/\baria-describedby="([^"]+)"/g, (_, ids) => (
      `aria-describedby="${ids.split(/\s+/).map(id => `${currentPageId}--${id}`).join(' ')}"`
    ));

  return `<section class="standalone-page" id="${currentPageId}" data-source="${relativePath}">\n${content}\n</section>`;
}

function buildStandalone() {
  const mainCss = fs.readFileSync(path.join(distDir, 'assets/main.css'), 'utf8');
  const navLinks = standalonePages
    .map(([relativePath, label]) => `<a href="#${standalonePageId(relativePath)}">${label}</a>`)
    .join('\n      ');
  const bundledPages = standalonePages.map(([relativePath]) => bundlePage(relativePath)).join('\n');
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
      gap: .5rem;
      padding: .75rem max(1rem, calc((100vw - 1180px) / 2));
      overflow-x: auto;
      background: rgba(43, 39, 35, .97);
      border-bottom: 1px solid rgba(255, 255, 255, .15);
      scrollbar-width: thin;
    }
    .standalone-nav a {
      flex: 0 0 auto;
      padding: .45rem .7rem;
      color: #f6f1e8;
      border: 1px solid rgba(255, 255, 255, .22);
      border-radius: 999px;
      font-size: .82rem;
      text-decoration: none;
    }
    .standalone-nav a:hover,
    .standalone-nav a:focus-visible { background: #f6f1e8; color: #2b2723; }
    .standalone-page {
      display: block;
      scroll-margin-top: 5rem;
      border-bottom: 4px double rgba(43, 39, 35, .2);
    }
    .standalone-page > .hero,
    .standalone-page > .section,
    .standalone-page > .route-strip,
    .standalone-page > .grid-wide,
    .standalone-page > .callout-good,
    .standalone-page > nav.section-heading { width: min(1180px, calc(100% - 2rem)); margin-inline: auto; }
    .standalone-page > .hero { padding-top: 4rem; }
    .standalone-page > nav.section-heading { padding-bottom: 3rem; }
    @media (max-width: 640px) {
      .standalone-nav { padding-inline: .75rem; }
      .standalone-page { scroll-margin-top: 4.25rem; }
    }
    @media print {
      .standalone-nav { display: none; }
      .standalone-page { break-before: page; border: 0; }
      .standalone-page:first-of-type { break-before: auto; }
    }
  </style>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
</head>
<body>
  <a class="skip-link" href="#page-index">跳至旅程首頁</a>
  <nav class="standalone-nav" aria-label="單檔版目錄">
      ${navLinks}
  </nav>
  <main id="standalone-content">
${bundledPages}
  </main>
  <footer class="footer">
    <div class="footer-inner">
      <p>POLSKA 波蘭行 · 2026/10/24–10/31 · 單檔完整版</p>
      <p>票價、開放時間與交通資料查證於 2026-08-08；尚未開賣或會變動的項目已明確標示，實際以官網與已購票券為準。</p>
    </div>
  </footer>
</body>
</html>`;

  fs.writeFileSync(standalonePath, html, 'utf8');
}

function build() {
  resetOutput();
  fs.copyFileSync(path.join(projectRoot, 'src/styles/main.css'), path.join(distDir, 'assets/main.css'));

  writeHtml('index.html', renderHome({
    meta: trip.meta,
    days: trip.days,
    flights: trip.flights,
    cities: cities.cities,
    readinessItems: travelDatabase.readinessItems.map(item => ({
      ...item,
      statusText: travelDatabase.statusLabels[item.status] || item.status,
    })),
    databaseEntries: travelDatabase.databaseEntries,
  }));

  for (const day of trip.days) {
    const photoSpotsForDay = cities.photoSpots.filter(spot => spot.day === day.n);
    writeHtml(
      `day-${String(day.n).padStart(2, '0')}.html`,
      renderDay(day, photoSpotsForDay, travelDatabase.dayOperations[day.n]),
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
  writeHtml('practical/database.html', renderDatabase({
    entries: travelDatabase.databaseEntries,
    sections: travelDatabase.databaseSections,
    statusLabels: travelDatabase.statusLabels,
  }));

  buildStandalone();

  const htmlCount = fs.readdirSync(distDir).filter(name => name.endsWith('.html')).length
    + fs.readdirSync(path.join(distDir, 'practical')).filter(name => name.endsWith('.html')).length;
  if (htmlCount !== 21) throw new Error(`預期產生 21 頁，實際為 ${htmlCount} 頁`);
  console.log(`build 完成：${htmlCount} 頁已產生至 dist/，另產生 poland-travel-guide-2026.html 單檔版`);
}

build();
