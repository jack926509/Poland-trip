import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as trip from './src/data/trip.js';
import * as cities from './src/data/cities.js';
import * as dining from './src/data/dining.js';
import { renderPages } from './src/build/pages.mjs';
import { buildStandalone } from './src/build/standalone.mjs';
import { writeServiceWorker, replacePublishedOutputs } from './src/build/output.mjs';
import { standalonePages } from './src/lib/routes.mjs';
import { searchIndexPlaceholder } from './src/templates/layout.mjs';
import { buildPageSearchRecords, buildTravelSearchRecords, serializeSearchIndex } from './src/search/site-search-index.mjs';

// 保留既有匯入介面；實作分別由打包與發布模組負責。
export { replacePublishedOutputs } from './src/build/output.mjs';
export { rewriteStandaloneIdReferences } from './src/build/standalone.mjs';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const publishedDistDir = path.join(projectRoot, 'dist');
const publishedStandalonePath = path.join(projectRoot, 'poland-travel-guide-2026.html');
function resetOutput(distDir) {
  fs.rmSync(distDir, { recursive: true, force: true });
  fs.mkdirSync(path.join(distDir, 'practical'), { recursive: true });
  fs.mkdirSync(path.join(distDir, 'assets'), { recursive: true });
  fs.mkdirSync(path.join(distDir, 'assets', 'photos'), { recursive: true });
}

function buildSearchRecords(distDir) {
  const travelRecords = buildTravelSearchRecords({
    days: trip.days,
    trains: trip.trains,
    cities: cities.cities,
    cityStories: cities.cityStories,
    mapPins: cities.mapPins,
    cityDining: dining.cityDining,
    cityFood: dining.cityFood,
    verifiedRestaurantHours: dining.verifiedRestaurantHours,
    snacksAndCafes: dining.snacksAndCafes,
    fastFoodBranches: dining.fastFoodBranches,
  });
  const pageRecords = buildPageSearchRecords(standalonePages.map(([relativePath, title]) => ({
    relativePath,
    title,
    html: fs.readFileSync(path.join(distDir, relativePath), 'utf8'),
  })));
  return [...travelRecords, ...pageRecords];
}

function injectSearchIndex(distDir, searchRecords) {
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
  const distDir = path.join(stagingRoot, 'dist');
  const standalonePath = path.join(stagingRoot, 'poland-travel-guide-2026.html');
  resetOutput(distDir);
  fs.copyFileSync(path.join(projectRoot, 'src/styles/main.css'), path.join(distDir, 'assets/main.css'));
  fs.copyFileSync(path.join(projectRoot, 'src/scripts/nav.js'), path.join(distDir, 'assets/nav.js'));
  fs.copyFileSync(path.join(projectRoot, 'src/scripts/database-filter.js'), path.join(distDir, 'assets/database-filter.js'));
  fs.copyFileSync(path.join(projectRoot, 'src/scripts/site-search.js'), path.join(distDir, 'assets/site-search.js'));
  fs.cpSync(path.join(projectRoot, 'vendor', 'leaflet'), path.join(distDir, 'assets', 'leaflet'), { recursive: true });
  fs.cpSync(path.join(projectRoot, 'assets', 'photos'), path.join(distDir, 'assets', 'photos'), { recursive: true });
  fs.cpSync(path.join(projectRoot, 'assets', 'og'), path.join(distDir, 'assets', 'og'), { recursive: true });
  // 資源全部就位後才算指紋
  writeServiceWorker({ projectRoot, distDir });

  renderPages(distDir);

  const searchRecords = buildSearchRecords(distDir);
  injectSearchIndex(distDir, searchRecords);
  buildStandalone({ distDir, standalonePath, searchRecords });
  fs.copyFileSync(standalonePath, path.join(distDir, 'poland-travel-guide-2026.html'));

  const htmlCount = fs.readdirSync(distDir)
    .filter(name => name.endsWith('.html') && name !== 'poland-travel-guide-2026.html').length
    + fs.readdirSync(path.join(distDir, 'practical')).filter(name => name.endsWith('.html')).length;
  if (htmlCount !== standalonePages.length) throw new Error(`預期產生 ${standalonePages.length} 頁，實際為 ${htmlCount} 頁`);
  return {
    htmlCount,
    stagedDistDir: distDir,
    stagedStandalonePath: standalonePath,
  };
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
