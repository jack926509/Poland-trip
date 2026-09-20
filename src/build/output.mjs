import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

/**
 * sw.js 的快取版本自動帶上 cache-first 資源的指紋。
 *
 * CSS 與 JS 走 cache-first，版本字串沒變的話既有安裝會拿到新 HTML 配舊樣式——
 * 版面直接壞掉。以前靠人工改 VERSION，2026-09-14 就漏過一次（樣式大改但版本停在 v18）。
 * 改由建置計算，樣式或腳本一動版本就變，不動則保持穩定（建置仍可重現）。
 */
export function writeServiceWorker({ projectRoot, distDir }) {
  const source = fs.readFileSync(path.join(projectRoot, 'sw.js'), 'utf8');
  const cacheFirstAssets = [
    'manifest.json', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png',
    'assets/main.css', 'assets/nav.js', 'assets/site-search.js',
    'assets/database-filter.js', 'assets/leaflet/leaflet.css', 'assets/leaflet/leaflet.js',
  ];
  const hash = crypto.createHash('sha256');
  for (const asset of cacheFirstAssets) hash.update(fs.readFileSync(path.join(distDir, asset)));
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
