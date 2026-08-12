import { pathToFileURL } from 'node:url';
import { mapPins, mapPinChecks, pinCategoryLegend } from '../src/data/cities.js';

const supportedStatuses = new Set(['coordinate-verified', 'unverified']);

export function auditMapPins(pins, checks, legend) {
  const issues = [];
  const pending = [];
  const invalid = [];
  let total = 0;
  let verified = 0;

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
      } else {
        pending.push(tag);
      }
    }
  }

  return {total, verified, pending, invalid, issues};
}

function runCli() {
  const requireAll = process.argv.includes('--require-all');
  const result = auditMapPins(mapPins, mapPinChecks, pinCategoryLegend);

  console.log(`圖釘總數：${result.total}`);
  console.log(`已驗證：${result.verified}`);
  console.log(`未驗證：${result.pending.length}`);
  console.log(`無效紀錄：${result.invalid.length}`);
  if (result.pending.length) console.log(`未驗證清單：${result.pending.join('、')}`);
  if (result.invalid.length) console.log(`無效紀錄清單：${result.invalid.join('、')}`);

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
