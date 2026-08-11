import { mapPins, mapPinChecks, pinCategoryLegend } from '../src/data/cities.js';

const requireAll = process.argv.includes('--require-all');
const supportedStatuses = new Set(['coordinate-verified', 'unverified']);
const issues = [];
const pending = [];
let total = 0;

for (const [city, data] of Object.entries(mapPins)) {
  const names = new Set();
  for (const [latitude, longitude, name, , url, category] of data.points) {
    total += 1;
    const tag = `${city}/${name}`;
    const check = mapPinChecks[city]?.[name];

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) issues.push(`${tag} 的座標不是有限數字`);
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) issues.push(`${tag} 的座標超出有效範圍`);
    if (names.has(name)) issues.push(`${tag} 在同一城市重複命名`);
    names.add(name);
    if (!pinCategoryLegend[category]) issues.push(`${tag} 使用未定義圖例分類 ${category}`);
    if (!url.startsWith('https://')) issues.push(`${tag} 不是 HTTPS 導航連結`);
    if (!check || !supportedStatuses.has(check.status)) issues.push(`${tag} 缺少有效查證狀態`);
    if (check?.status === 'coordinate-verified') {
      if (!check.checkedAt || !check.coordinateSource || !Number.isFinite(check.distanceMeters)) issues.push(`${tag} 的已驗證紀錄缺日期、來源或距離`);
    }
    if (check?.status === 'unverified') pending.push(tag);
  }
}

console.log(`圖釘總數：${total}`);
console.log(`已驗證：${total - pending.length}`);
console.log(`未驗證：${pending.length}`);
if (pending.length) console.log(`未驗證清單：${pending.join('、')}`);

if (issues.length) {
  console.error(`資料錯誤：\n- ${issues.join('\n- ')}`);
  process.exitCode = 1;
} else if (requireAll && pending.length) {
  console.error('完整座標驗收尚未通過：仍有未驗證圖釘。');
  process.exitCode = 1;
} else {
  console.log('資料結構檢查通過。');
}
