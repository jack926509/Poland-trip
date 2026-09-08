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
import { renderSiteSearch, searchIndexPlaceholder } from './src/templates/layout.mjs';
import {
  buildPageSearchRecords,
  buildTravelSearchRecords,
  serializeSearchIndex,
} from './src/search/site-search-index.mjs';

const dayPinNames = {
  1: { warsaw: ['皇家城堡', 'ibis budget Warszawa Reduta'] },
  2: { warsaw: ['ibis budget Warszawa Reduta'], krakow: ['Wawel 皇家城堡', '中央市集廣場', 'Kazimierz 猶太區', '辛德勒工廠博物館', 'Plac Nowy (zapiekanka)', 'ibis budget Krakow Stare Miasto'] },
  3: { krakow: ['ibis budget Krakow Stare Miasto'] },
  4: { krakow: ['Kazimierz 猶太區', 'Sukiennice 布廊（伴手禮攤位）', 'ibis budget Krakow Stare Miasto'], wroclaw: ['Piast'] },
  5: { wroclaw: ['中央市集廣場', '大教堂島 Ostrów Tumski', '百年廳 Hala Stulecia', 'Piast'], poznan: ['Poznan Apartments Towarowa'] },
  6: { poznan: ['舊市集廣場 Stary Rynek', '大教堂島 Ostrów Tumski', '可頌博物館', 'Poznan Apartments Towarowa'], warsaw: ['Hotel Metropol'] },
  7: { warsaw: ['皇家城堡', 'POLIN 猶太史博物館', '華沙起義博物館', 'Hotel Metropol'] },
  8: { warsaw: ['Hotel Metropol'] },
};

const daySupplementaryPins = {
  1: [[52.1697086, 20.975785, 'Warszawa Lotnisko Chopina 機場鐵路站', 'PKP PLK 車站目錄座標 · 非航廈報到入口 · 2026/09/08 查核', 'https://www.google.com/maps/search/?api=1&query=Warszawa%20Lotnisko%20Chopina%20railway%20station%2C%20Warszawa%2C%20Poland', 'sight', 'https://portalpasazera.pl/en/KatalogStacji?stacja=Warszawa+Lotnisko+Chopina']],
  3: [[50.029763, 19.204816, 'Auschwitz I 訪客服務中心／入口', '官方確認入口 · Więźniów Oświęcimia 55 · 2026/09/08 查核', 'https://www.google.com/maps/search/?api=1&query=Auschwitz%20Memorial%20Visitor%20Services%20Center%2C%2055%20Wi%C4%99%C5%BAni%C3%B3w%20O%C5%9Bwi%C4%99cimia%2C%20O%C5%9Bwi%C4%99cim%2C%20Poland', 'sight', 'https://www.auschwitz.org/en/museum/news/new-visitor-services-center-at-the-auschwitz-memorial-change-of-the-place-of-arrival-and-entrance-from-15-june%2C1614.html']],
  4: [[49.98348, 20.05477, '維利奇卡鹽礦 Daniłowicz Shaft', '官方確認 Tourist Route 集合入口 · 2026/09/08 查核', 'https://www.google.com/maps/search/?api=1&query=Dani%C5%82owicz%20Shaft%2C%20Wieliczka%20Salt%20Mine%2C%20Poland', 'sight', 'https://www.wieliczka-saltmine.com/events/important-information/map-and-access']],
  8: [[52.1697086, 20.975785, 'Warszawa Lotnisko Chopina 機場鐵路站', 'PKP PLK 車站目錄座標 · 非航廈報到入口 · 2026/09/08 查核', 'https://www.google.com/maps/search/?api=1&query=Warszawa%20Lotnisko%20Chopina%20railway%20station%2C%20Warszawa%2C%20Poland', 'sight', 'https://portalpasazera.pl/en/KatalogStacji?stacja=Warszawa+Lotnisko+Chopina']],
};

function makeDayMap(day, operation) {
  const selections = dayPinNames[day.n];
  const points = [];
  const checks = {};
  for (const [cityKey, names] of Object.entries(selections)) {
    for (const point of cities.mapPins[cityKey].points.filter(item => names.includes(item[2]))) {
      points.push(point);
      checks[point[2]] = cities.mapPinChecks[cityKey][point[2]];
    }
  }
  points.push(...(daySupplementaryPins[day.n] || []));
  for (const point of daySupplementaryPins[day.n] || []) checks[point[2]] = { status: 'coordinate-verified', checkedAt: '2026-09-08', coordinateSource: point[6] };
  const normalized = value => value.toLocaleLowerCase().replaceAll(/[^\p{L}\p{N}]/gu, '');
  const locatedNames = points.map(point => normalized(point[2]));
  const unlocated = (operation?.addresses || []).filter(address =>
    !locatedNames.some(name => name.includes(normalized(address.name)) || normalized(address.name).includes(name)))
    .map(address => ({ name: address.name, url: address.url }));
  const cityCount = Object.keys(selections).length;
  return {
    center: points[0]?.slice(0, 2) || [52.1, 19.4], zoom: 13, points, unlocated,
    checks,
    note: cityCount > 1
      ? '跨城區域概覽：只標示資料集中已查證的行程錨點；縮放後查看各城，圖釘位置不代表實際交通路線。'
      : `區域概覽：本日 ${points.length} 個已查證行程錨點；未定位地點列在地圖下方，請用名稱導航。`,
  };
}

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const publishedDistDir = path.join(projectRoot, 'dist');
const publishedStandalonePath = path.join(projectRoot, 'poland-travel-guide-2026.html');
let distDir;
let standalonePath;
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

const standaloneIdReferenceAttributes = new Set([
  'for',
  'form',
  'headers',
  'list',
  'aria-activedescendant',
  'aria-controls',
  'aria-describedby',
  'aria-details',
  'aria-errormessage',
  'aria-flowto',
  'aria-labelledby',
  'aria-owns',
]);

function prefixIdReferenceList(value, pageId) {
  return value.split(/(\s+)/).map(token => (
    token.trim() ? `${pageId}--${token}` : token
  )).join('');
}

export function rewriteStandaloneIdReferences(content, pageId) {
  return content.replace(
    /(\s)(id|for|form|headers|list|aria-activedescendant|aria-controls|aria-describedby|aria-details|aria-errormessage|aria-flowto|aria-labelledby|aria-owns)\s*=\s*(["'])(.*?)\3/gi,
    (match, whitespace, attribute, quote, value) => {
      if (!value.trim()) return match;
      const rewritten = attribute.toLowerCase() === 'id'
        ? `${pageId}--${value}`
        : standaloneIdReferenceAttributes.has(attribute.toLowerCase())
          ? prefixIdReferenceList(value, pageId)
          : value;
      return `${whitespace}${attribute}=${quote}${rewritten}${quote}`;
    },
  );
}

const standalonePhotoDataUris = new Map();

function inlineStandalonePhotos(content) {
  return content.replace(/src="(?:\.\.\/)?assets\/photos\/([^"/]+\.(?:webp|jpe?g|png))"/gi, (match, fileName) => {
    if (!standalonePhotoDataUris.has(fileName)) {
      const extension = path.extname(fileName).toLowerCase();
      const mime = extension === '.webp' ? 'image/webp' : extension === '.png' ? 'image/png' : 'image/jpeg';
      const photoPath = path.join(distDir, 'assets', 'photos', path.basename(fileName));
      if (!fs.existsSync(photoPath)) throw new Error(`單檔版找不到照片：${fileName}`);
      standalonePhotoDataUris.set(fileName, `data:${mime};base64,${fs.readFileSync(photoPath).toString('base64')}`);
    }
    return `src="${standalonePhotoDataUris.get(fileName)}"`;
  });
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

  const contentWithRewrittenLinks = main[1]
    .replace(/\s*<script src="https:\/\/unpkg\.com\/leaflet@1\.9\.4\/dist\/leaflet\.js"><\/script>/g, '')
    .replace(/\s*<script src="\.\.\/assets\/database-filter\.js" defer><\/script>/g, '')
    .replace(/\s*<script src="assets\/leaflet\/leaflet\.js"><\/script>/g, '')
    .replace(/\s*<link rel="stylesheet" href="assets\/leaflet\/leaflet\.css">/g, '')
    .replace(/\s*<nav class="mobile-quick-nav"[\s\S]*?<\/nav>/g, '')
    .replace(/href="([^"]+)"/g, rewriteHref);
  const content = inlineStandalonePhotos(rewriteStandaloneIdReferences(contentWithRewrittenLinks, currentPageId)).trim();

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

function standaloneSearchHref(href) {
  if (/^(?:[a-z]+:|\/\/|#)/i.test(href)) return href;
  const [relativePath, fragment] = href.split('#');
  if (!standalonePages.some(([page]) => page === relativePath)) return href;
  const pageId = standalonePageId(relativePath);
  return `#${pageId}${fragment ? `--${fragment}` : ''}`;
}

function buildStandalone(searchRecords) {
  standalonePhotoDataUris.clear();
  const mainCss = fs.readFileSync(path.join(distDir, 'assets/main.css'), 'utf8');
  const leafletCss = fs.readFileSync(path.join(distDir, 'assets', 'leaflet', 'leaflet.css'), 'utf8');
  const leafletJs = fs.readFileSync(path.join(distDir, 'assets', 'leaflet', 'leaflet.js'), 'utf8');
  const databaseFilterJs = fs.readFileSync(path.join(distDir, 'assets', 'database-filter.js'), 'utf8');
  const siteSearchJs = fs.readFileSync(path.join(distDir, 'assets/site-search.js'), 'utf8');
  const standaloneSearchRecords = searchRecords.map(record => ({
    ...record,
    href: standaloneSearchHref(record.href),
  }));
  const standaloneSearchHtml = renderSiteSearch({
    searchIndexJson: serializeSearchIndex(standaloneSearchRecords),
    databaseHref: '#page-practical-database',
  });
  const standaloneMobileQuickNav = `<nav class="mobile-quick-nav" aria-label="旅途中快速導覽">
    <a href="#page-index"><span aria-hidden="true">▣</span>行程</a>
    <a href="#page-practical-booking--rail-itinerary"><span aria-hidden="true">▤</span>火車</a>
    <a href="#page-index--cities"><span aria-hidden="true">⌖</span>地圖</a>
    <a href="#page-practical-todos"><span aria-hidden="true">✓</span>待辦</a>
  </nav>`;
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
  <meta name="color-scheme" content="light">
  <meta name="theme-color" content="#f4eddf">
  <title>POLSKA 波蘭行 · 2026 單檔完整版</title>
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='8' fill='%232b2723'/%3E%3Ctext x='32' y='44' text-anchor='middle' font-size='38' font-family='serif' font-weight='700' fill='%23f6f1e8'%3EP%3C/text%3E%3C/svg%3E">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&amp;family=Noto+Serif+TC:wght@600;700&amp;family=Noto+Sans+TC:wght@400;500;700&amp;family=Inter:wght@400;500;700&amp;display=swap" rel="stylesheet" media="print" onload="this.media='all';this.onload=null">
  <noscript><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&amp;family=Noto+Serif+TC:wght@600;700&amp;family=Noto+Sans+TC:wght@400;500;700&amp;family=Inter:wght@400;500;700&amp;display=swap" rel="stylesheet"></noscript>
  <style data-bundled="main.css">
${mainCss}
  </style>
  <style data-bundled="leaflet.css">
${leafletCss}
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
      display: inline-flex;
      align-items: center;
      min-height: 44px;
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
      display: flex;
      align-items: center;
      min-height: 44px;
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
    .standalone-page-controls a { display: flex; align-items: center; min-height: 44px; color: #7e2c1a; font-weight: 700; text-decoration: none; }
    .standalone-page-controls a:last-child { justify-content: flex-end; text-align: right; }
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
      .standalone-home {
        min-width: 0;
        padding-inline: .45rem;
        font-size: .72rem;
        line-height: 1.25;
        white-space: normal;
        overflow-wrap: anywhere;
      }
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
  <script data-bundled="leaflet.js">
${leafletJs}
  </script>
</head>
<body class="journal-site journal-standalone">
  <a class="skip-link" href="#page-index">跳至旅程首頁</a>
  <nav class="standalone-nav journal-masthead" aria-label="單檔版目錄">
      <a class="standalone-home" href="#page-index">POLSKA PAPER TRAVEL JOURNAL</a>
      ${navMenus}
  </nav>
  ${standaloneSearchHtml}
  <main id="standalone-content">
${bundledPages}
${standaloneMobileQuickNav}
  </main>
  <footer class="footer">
    <div class="footer-inner">
      <p>POLSKA 波蘭行 · 2026/10/24–10/31 · 單檔完整版</p>
      <p>各筆資料依頁面標示的查核日期與狀態管理；推薦班次不代表指定日已確認，實際以官網與已購票券為準。</p>
    </div>
  </footer>
  <script>
    (function () {
      var pages = Array.from(document.querySelectorAll('.standalone-page'));
      var defaultPageId = 'page-index';

      function showStandalonePage(targetId, shouldScroll) {
        var target = document.getElementById(targetId);
        var activePage = target ? target.closest('.standalone-page') : document.getElementById(defaultPageId);
        var activePageId = activePage ? activePage.id : defaultPageId;
        pages.forEach(function (page) {
          page.hidden = page.id !== activePageId;
        });
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(function () {
            var activeTarget = document.getElementById(targetId) || document.getElementById(activePageId);
            if (shouldScroll && activeTarget) activeTarget.scrollIntoView({ block: 'start' });
            window.dispatchEvent(new Event('resize'));
          });
        });
      }

      function activateStandaloneHash() {
        var hash = decodeURIComponent(window.location.hash.slice(1));
        showStandalonePage(hash || defaultPageId, Boolean(hash));
      }

      document.querySelector('.standalone-nav').addEventListener('click', function (event) {
        if (!event.target.closest('a[href^="#"]')) return;
        document.querySelectorAll('.standalone-menu[open]').forEach(function (menu) {
          menu.removeAttribute('open');
        });
      });
      document.querySelector('.standalone-nav').addEventListener('keydown', function (event) {
        if (event.key !== 'Escape') return;
        var openMenu = document.querySelector('.standalone-menu[open]');
        if (!openMenu) return;
        openMenu.open = false;
        openMenu.querySelector('summary').focus();
      });
      window.addEventListener('hashchange', activateStandaloneHash);
    activateStandaloneHash();
    }());
  </script>
  <script data-bundled="database-filter.js">
${databaseFilterJs}
  </script>
  <script type="module" data-bundled="site-search.js">
${siteSearchJs}
  </script>
</body>
</html>`;

  // 組合不同章節時可能帶入縮排空白；只清除行尾空白，不改動內容或換行結構。
  fs.writeFileSync(standalonePath, html.replace(/[ \t]+$/gm, ''), 'utf8');
}

function buildSearchRecords() {
  const travelRecords = buildTravelSearchRecords({
    days: trip.days,
    trains: trip.trains,
    cities: cities.cities,
    cityStories: cities.cityStories,
    mapPins: cities.mapPins,
    cityDining: dining.cityDining,
    cityFood: dining.cityFood,
    foodBackup: dining.foodBackup,
    verifiedRestaurantHours: dining.verifiedRestaurantHours,
  });
  const pageRecords = buildPageSearchRecords(standalonePages.map(([relativePath, title]) => ({
    relativePath,
    title,
    html: fs.readFileSync(path.join(distDir, relativePath), 'utf8'),
  })));
  return [...travelRecords, ...pageRecords];
}

function injectSearchIndex(searchRecords) {
  const serialized = serializeSearchIndex(searchRecords);
  for (const [relativePath] of standalonePages) {
    const outputPath = path.join(distDir, relativePath);
    const html = fs.readFileSync(outputPath, 'utf8');
    if (!html.includes(searchIndexPlaceholder)) {
      throw new Error(`${relativePath} 缺少搜尋索引佔位`);
    }
    fs.writeFileSync(outputPath, html.replace(searchIndexPlaceholder, serialized), 'utf8');
  }
}

function buildIntoStaging(stagingRoot) {
  distDir = path.join(stagingRoot, 'dist');
  standalonePath = path.join(stagingRoot, 'poland-travel-guide-2026.html');
  resetOutput();
  fs.copyFileSync(path.join(projectRoot, 'src/styles/main.css'), path.join(distDir, 'assets/main.css'));
  fs.copyFileSync(path.join(projectRoot, 'src/scripts/nav.js'), path.join(distDir, 'assets/nav.js'));
  fs.copyFileSync(path.join(projectRoot, 'src/scripts/database-filter.js'), path.join(distDir, 'assets/database-filter.js'));
  fs.copyFileSync(path.join(projectRoot, 'src/scripts/site-search.js'), path.join(distDir, 'assets/site-search.js'));
  fs.copyFileSync(path.join(projectRoot, 'sw.js'), path.join(distDir, 'sw.js'));
  fs.cpSync(path.join(projectRoot, 'vendor', 'leaflet'), path.join(distDir, 'assets', 'leaflet'), { recursive: true });
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
    const detailPhotoCity = [1, 2, 5, 6].includes(day.n)
      ? cities.cities.find(item => item.key === photoSpotsForDay[0]?.cityKey)
      : null;
    const journalCity = day.city
      .split('→')
      .reverse()
      .map(stop => cities.cities.find(city => stop.includes(city.name)))
      .find(Boolean) || cities.cities[0];
    const dayMap = makeDayMap(day, travelDatabase.dayOperations[day.n]);
    writeHtml(
      `day-${String(day.n).padStart(2, '0')}.html`,
      renderDay(day, photoSpotsForDay, travelDatabase.dayOperations[day.n], journalCity, detailPhotoCity, dayMap, dayMap.checks, cities.pinCategoryLegend, cities.cities.flatMap(city => city.gallery || []).filter(photo => photo.days?.includes(day.n))),
    );
  }

  for (const [fileKey, { key, mapKey }] of Object.entries(cityMap)) {
    const city = cities.cities.find(item => item.key === key);
    writeHtml(`city-${fileKey}.html`, renderCity({
      city,
      cityKey: mapKey,
      mapData: cities.mapPins[mapKey],
      mapChecks: cities.mapPinChecks[mapKey],
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

  const searchRecords = buildSearchRecords();
  injectSearchIndex(searchRecords);
  buildStandalone(searchRecords);
  fs.copyFileSync(standalonePath, path.join(distDir, 'poland-travel-guide-2026.html'));

  const htmlCount = fs.readdirSync(distDir)
    .filter(name => name.endsWith('.html') && name !== 'poland-travel-guide-2026.html').length
    + fs.readdirSync(path.join(distDir, 'practical')).filter(name => name.endsWith('.html')).length;
  if (htmlCount !== 23) throw new Error(`預期產生 23 頁，實際為 ${htmlCount} 頁`);
  return {
    htmlCount,
    stagedDistDir: distDir,
    stagedStandalonePath: standalonePath,
  };
}

export function replacePublishedOutputs({
  stagingRoot,
  stagedDistDir,
  stagedStandalonePath,
  targetDistDir,
  targetStandalonePath,
}, { renameSync = fs.renameSync } = {}) {
  if (!fs.statSync(stagedDistDir).isDirectory()) {
    throw new Error('staging dist 不是目錄');
  }
  if (!fs.statSync(stagedStandalonePath).isFile()) {
    throw new Error('staging 單檔版不是檔案');
  }

  const previousDistDir = path.join(stagingRoot, 'previous-dist');
  const previousStandalonePath = path.join(stagingRoot, 'previous-standalone.html');
  let previousDistMoved = false;
  let previousStandaloneMoved = false;
  let stagedDistPublished = false;
  let stagedStandalonePublished = false;

  try {
    if (fs.existsSync(targetDistDir)) {
      renameSync(targetDistDir, previousDistDir);
      previousDistMoved = true;
    }
    if (fs.existsSync(targetStandalonePath)) {
      renameSync(targetStandalonePath, previousStandalonePath);
      previousStandaloneMoved = true;
    }

    renameSync(stagedDistDir, targetDistDir);
    stagedDistPublished = true;
    renameSync(stagedStandalonePath, targetStandalonePath);
    stagedStandalonePublished = true;
  } catch (error) {
    if (stagedStandalonePublished && fs.existsSync(targetStandalonePath)) {
      fs.rmSync(targetStandalonePath, { force: true });
    }
    if (stagedDistPublished && fs.existsSync(targetDistDir)) {
      fs.rmSync(targetDistDir, { recursive: true, force: true });
    }
    if (previousStandaloneMoved && fs.existsSync(previousStandalonePath)) {
      renameSync(previousStandalonePath, targetStandalonePath);
    }
    if (previousDistMoved && fs.existsSync(previousDistDir)) {
      renameSync(previousDistDir, targetDistDir);
    }
    throw error;
  }
}

export function build() {
  const stagingRoot = fs.mkdtempSync(path.join(projectRoot, '.build-staging-'));
  try {
    const staged = buildIntoStaging(stagingRoot);
    replacePublishedOutputs({
      stagingRoot,
      stagedDistDir: staged.stagedDistDir,
      stagedStandalonePath: staged.stagedStandalonePath,
      targetDistDir: publishedDistDir,
      targetStandalonePath: publishedStandalonePath,
    });
    console.log(`build 完成：${staged.htmlCount} 頁已產生至 dist/，另產生 poland-travel-guide-2026.html 單檔版`);
  } finally {
    fs.rmSync(stagingRoot, { recursive: true, force: true });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  build();
}
