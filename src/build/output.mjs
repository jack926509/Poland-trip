import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { groceryProducts } from '../data/groceries.js';

/**
 * sw.js 的商品照片預快取清單改由資料推導，不再靠人維護。
 *
 * install 用 cache.addAll：清單裡只要有一個檔案不存在，整個 Service Worker
 * 就裝不起來，離線功能整份失效。反方向的漂移一樣有代價——2026-09 的採買推薦
 * 換掉三項商品後，三張沒有任何頁面引用的照片仍留在清單裡，每個安裝都照樣
 * 下載、快取，還算進快取指紋。這裡只列 groceryProducts 真的引用的照片，
 * 副檔名（.webp／.jpg）也跟著資料走，兩種漂移都不可能發生。
 */
export function precachedGroceryPhotos() {
  return [...new Set(groceryProducts.map(product => product.photo?.src).filter(Boolean))].sort();
}

function injectGroceryPhotos(source, photos) {
  const start = '  // GROCERY-PHOTOS:START';
  const end = '  // GROCERY-PHOTOS:END';
  const from = source.indexOf(start);
  const to = source.indexOf(end);
  if (from === -1 || to === -1) throw new Error('sw.js 找不到 GROCERY-PHOTOS 標記，商品照片預快取清單無法產生');
  const lines = photos.map(src => `  './${src}',`).join('\n');
  return `${source.slice(0, from + start.length)}\n${lines}\n${source.slice(to)}`;
}

/**
 * sw.js 的快取版本自動帶上 cache-first 資源的指紋。
 *
 * CSS 與 JS 走 cache-first，版本字串沒變的話既有安裝會拿到新 HTML 配舊樣式——
 * 版面直接壞掉。以前靠人工改 VERSION，2026-09-14 就漏過一次（樣式大改但版本停在 v18）。
 * 改由建置計算，樣式或腳本一動版本就變，不動則保持穩定（建置仍可重現）。
 */
export function writeServiceWorker({ projectRoot, distDir }) {
  const groceryPhotos = precachedGroceryPhotos();
  const source = injectGroceryPhotos(fs.readFileSync(path.join(projectRoot, 'sw.js'), 'utf8'), groceryPhotos);
  const cacheFirstAssets = [
    'manifest.json', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png',
    'assets/main.css', 'assets/nav.js', 'assets/site-search.js',
    'assets/database-filter.js', 'assets/leaflet/leaflet.css', 'assets/leaflet/leaflet.js',
    // 搜尋索引也是 cache-first 資源（sw.js 的 ASSETS）：沒有它，改了資料但
    // CSS/JS 都沒動時 VERSION 指紋不變，已安裝的 PWA 搜尋結果會永遠停在安裝當天。
    'assets/search-index.json',
  ];
  const hash = crypto.createHash('sha256');
  for (const asset of cacheFirstAssets) hash.update(fs.readFileSync(path.join(distDir, asset)));
  // 商品圖也預快取；只換照片時同樣需要淘汰舊版本。只算真的會被預快取的那幾張，
  // 跟上面注入 sw.js 的是同一份清單。
  for (const src of groceryPhotos) hash.update(fs.readFileSync(path.join(distDir, src)));
  const fingerprint = hash.digest('hex').slice(0, 8);
  const versioned = source.replace(/const VERSION = '([^']+)';/,
    (match, version) => `const VERSION = '${version}-${fingerprint}';`);
  if (versioned === source) throw new Error('sw.js 找不到 VERSION，快取版本無法帶上資源指紋');
  fs.writeFileSync(path.join(distDir, 'sw.js'), versioned);
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
