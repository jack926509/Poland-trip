import { pathToFileURL } from 'node:url';
import { mapPins, mapPinChecks, pinCategoryLegend } from '../src/data/cities.js';
import { cityDining, cityFood, snacksAndCafes } from '../src/data/dining.js';
import { mergeCityDining } from '../src/templates/city-dining.mjs';

const supportedStatuses = new Set(['coordinate-verified', 'area-reference', 'unverified']);

export function auditMapPins(pins, checks, legend) {
  const issues = [];
  const pending = [];
  const invalid = [];
  let total = 0;
  let verified = 0;
  let areaReferences = 0;

  for (const [city, data] of Object.entries(pins)) {
    const names = new Set();
    for (const [latitude, longitude, name, , url, category] of data.points) {
      total += 1;
      const tag = `${city}/${name}`;
      const check = checks[city]?.[name];

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) issues.push(`${tag} 的座標不是有限數字`);
      if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) issues.push(`${tag} 的座標超出有效範圍`);
      if (names.has(name)) issues.push(`${tag} 在同一城市重複命名`);
      names.add(name);
      if (!legend[category]) issues.push(`${tag} 使用未定義圖例分類 ${category}`);
      if (typeof url !== 'string' || !url.startsWith('https://')) issues.push(`${tag} 不是 HTTPS 導航連結`);

      if (!check || !supportedStatuses.has(check.status)) {
        issues.push(`${tag} 缺少有效查證狀態`);
        invalid.push(tag);
      } else if (check.status === 'coordinate-verified') {
        if (!check.checkedAt || !check.coordinateSource || !Number.isFinite(check.distanceMeters)) {
          issues.push(`${tag} 的已驗證紀錄缺日期、來源或距離`);
          invalid.push(tag);
        } else {
          verified += 1;
        }
      } else if (check.status === 'area-reference') {
        if (!check.checkedAt || !check.coordinateSource || !check.note) {
          issues.push(`${tag} 的範圍代表點紀錄缺日期、來源或說明`);
          invalid.push(tag);
        } else {
          areaReferences += 1;
        }
      } else {
        pending.push(tag);
      }
    }
  }

  return {total, verified, areaReferences, pending, invalid, issues};
}

const CITY_NAMES = { warsaw: '華沙', krakow: '克拉科夫', wroclaw: '樂斯拉夫', poznan: '波茲南' };

function storeKey(name) {
  return name
    .replace(/[（(][^）)]*[)）]/g, ' ')
    .replace(/,.*$/, ' ')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/ł/g, 'l').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

/** 圖釘與餐廳表的寫法常差一個修飾詞（Zagoździński ↔ Cukiernia Zagoździński），
 *  因此比對整詞包含，而不是只看開頭。 */
function sameStore(a, b) {
  if (!a || !b) return false;
  if (a === b) return true;
  const [short, long] = a.length < b.length ? [a, b] : [b, a];
  if (short.length < 4) return false;
  return long === short || long.startsWith(`${short} `) || long.endsWith(` ${short}`) || long.includes(` ${short} `);
}

/**
 * 餐廳表裡的店有多少放進了地圖圖釘。
 *
 * 兩份資料是各自維護的：圖釘要求座標經查證（Nominatim 比對、記錄誤差），
 * 餐廳表只要求有 Google Maps 連結。精煉餐廳清單後兩邊就會漂移——
 * 表上有 70 家、圖釘只涵蓋其中一小部分，且有些圖釘的店已經不在表上。
 * 這裡把落差印出來，才不會是看不見的。
 */
export function auditDiningPinCoverage() {
  const byCity = {};
  let covered = 0;
  let listed = 0;
  const orphanPins = [];
  for (const [city, label] of Object.entries(CITY_NAMES)) {
    const rows = mergeCityDining(
      city, cityDining[city],
      cityFood.find(group => group.city === label)?.items || [],
      snacksAndCafes[city] || [],
    );
    // 餐廳也可能被歸在 sight／shopping 類（Hala Targowa、Stary Browar），
    // 只要地圖上找得到就算有涵蓋，因此比對全部圖釘而非只有 food 類。
    const allPins = mapPins[city]?.points || [];
    const pins = allPins.filter(point => point[5] === 'food');
    const pinKeys = allPins.map(point => storeKey(point[2]));
    const rowKeys = rows.map(row => storeKey(row.name));
    const missing = rows.filter((row, i) => !pinKeys.some(pin => sameStore(pin, rowKeys[i]))).map(row => row.name);
    for (const point of pins) {
      if (!rowKeys.some(row => sameStore(row, storeKey(point[2])))) orphanPins.push(`${label}／${point[2]}`);
    }
    listed += rows.length;
    covered += rows.length - missing.length;
    byCity[label] = { listed: rows.length, pins: pins.length, missing };
  }
  return { listed, covered, byCity, orphanPins };
}

function runCli() {
  const requireAll = process.argv.includes('--require-all');
  const result = auditMapPins(mapPins, mapPinChecks, pinCategoryLegend);

  console.log(`圖釘總數：${result.total}`);
  console.log(`已驗證：${result.verified}`);
  console.log(`範圍代表點：${result.areaReferences}`);
  console.log(`未驗證：${result.pending.length}`);
  console.log(`無效紀錄：${result.invalid.length}`);
  if (result.pending.length) console.log(`未驗證清單：${result.pending.join('、')}`);
  if (result.invalid.length) console.log(`無效紀錄清單：${result.invalid.join('、')}`);

  const coverage = auditDiningPinCoverage();
  console.log('');
  console.log(`餐廳圖釘覆蓋：${coverage.covered}/${coverage.listed}（${Math.round(coverage.covered / coverage.listed * 100)}%）`);
  for (const [city, info] of Object.entries(coverage.byCity)) {
    console.log(`  ${city}：餐廳表 ${info.listed} 家、餐飲圖釘 ${info.pins} 個、無圖釘 ${info.missing.length} 家`);
  }
  if (coverage.orphanPins.length) {
    console.log(`  圖釘有、餐廳表已無此店：${coverage.orphanPins.join('、')}`);
  }
  console.log('  （圖釘需要查證過的座標，不能由 Google Maps 搜尋連結推得；補齊要另行查核。）');

  if (result.issues.length) {
    console.error(`資料錯誤：\n- ${result.issues.join('\n- ')}`);
    process.exitCode = 1;
  } else if (requireAll && result.pending.length) {
    console.error('完整座標驗收尚未通過：仍有未驗證圖釘。');
    process.exitCode = 1;
  } else {
    console.log('資料結構檢查通過。');
  }
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectRun) runCli();
