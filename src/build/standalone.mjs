import fs from 'node:fs';
import path from 'node:path';
import { standalonePages, standaloneNavGroups } from '../lib/routes.mjs';
import { renderSiteSearch } from '../templates/layout.mjs';
import { serializeSearchIndex } from '../search/site-search-index.mjs';

const knownPages = new Set(standalonePages.map(([page]) => page));

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

function inlineStandalonePhotos(content, { distDir, photos }) {
  return content.replace(/(src|href)="(?:\.\.\/)?assets\/photos\/([^"/]+\.(?:webp|jpe?g|png))"/gi, (match, attribute, fileName) => {
    if (!photos.has(fileName)) {
      const extension = path.extname(fileName).toLowerCase();
      const mime = extension === '.webp' ? 'image/webp' : extension === '.png' ? 'image/png' : 'image/jpeg';
      const photoPath = path.join(distDir, 'assets', 'photos', path.basename(fileName));
      if (!fs.existsSync(photoPath)) throw new Error(`單檔版找不到照片：${fileName}`);
      photos.set(fileName, `data:${mime};base64,${fs.readFileSync(photoPath).toString('base64')}`);
    }
    return `${attribute}="${photos.get(fileName)}"`;
  });
}

function bundlePage(relativePath, label, pageIndex, context) {
  const { distDir } = context;
  const html = fs.readFileSync(path.join(distDir, relativePath), 'utf8');
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  if (!main) throw new Error(`無法從 ${relativePath} 取得主要內容`);

  const currentPageId = standalonePageId(relativePath);
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
  const content = inlineStandalonePhotos(rewriteStandaloneIdReferences(contentWithRewrittenLinks, currentPageId), context).trim();

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
  if (!knownPages.has(relativePath)) return href;
  const pageId = standalonePageId(relativePath);
  return `#${pageId}${fragment ? `--${fragment}` : ''}`;
}

export function buildStandalone({ distDir, standalonePath, searchRecords }) {
  const context = { distDir, photos: new Map() };
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
    .map(([relativePath, label], pageIndex) => bundlePage(relativePath, label, pageIndex, context))
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
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="POLSKA · Paper Travel Journal">
  <meta property="og:title" content="POLSKA 波蘭行 · 2026 單檔完整版">
  <meta property="og:description" content="2026 波蘭四城 8 天旅遊規劃單檔版：逐日行程、城市、交通、門票、餐廳與自由行資料庫。">
  <meta property="og:url" content="https://polandtrip.xiehnet.com/poland-travel-guide-2026.html">
  <meta property="og:image" content="https://polandtrip.xiehnet.com/assets/og/polska-og.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="波蘭旅程總覽海報">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="POLSKA 波蘭行 · 2026 單檔完整版">
  <meta name="twitter:description" content="2026 波蘭四城 8 天旅遊規劃單檔版：逐日行程、城市、交通、門票、餐廳與自由行資料庫。">
  <meta name="twitter:image" content="https://polandtrip.xiehnet.com/assets/og/polska-og.jpg">
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
            if (activeTarget && /--product-\d+$/.test(targetId)) {
              activeTarget.closest('.grocery-product-group')?.setAttribute('open', '');
            }
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
