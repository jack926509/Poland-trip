// tools/sun-times.mjs — 日出、日落與民用曙暮光的天文推算。
//
// 為什麼要有這支工具：essentials.js 的 daylight 表原本是人工填入，
// 而人工填的數字沒有任何東西會發現它錯。2026-09-14 核對時就抓到 Day 1–4
// 的日落早了 26–31 分鐘——剛好是沒有從已查證來源抄過來的那幾天。
// 改由本檔推算後，tests/daylight.test.mjs 會逐筆比對，數字再也不會默默漂掉。
//
// 演算法：標準的簡化太陽位置公式（NOAA 系）。校驗基準是專案 2026-08-11
// 人工查證的四個日落值——華沙 10/26 16:19、10/31 16:10、樂斯拉夫 10/28 16:34、
// 波茲南 10/29 16:29，本實作四筆全部吻合到分鐘。
//
// 仍屬推算值：出發前若要用於關鍵決策（例如趕在日落前抵達某個拍攝點），
// 建議再以天文表或當地氣象單位公告核對。

import { pathToFileURL } from 'node:url';

const rad = degrees => degrees * Math.PI / 180;
const deg = radians => radians * 180 / Math.PI;

/** 各城市座標；與 cities.js 的圖釘同源城市，此處取市中心代表點。 */
export const CITY_COORDINATES = {
  華沙: { lat: 52.2297, lon: 21.0122 },
  克拉科夫: { lat: 50.0647, lon: 19.9450 },
  樂斯拉夫: { lat: 51.1079, lon: 17.0385 },
  波茲南: { lat: 52.4064, lon: 16.9252 },
};

/** 太陽中心的高度角門檻：日出日落含大氣折射與日面半徑，民用曙暮光為 -6°。 */
export const SUN_ANGLES = { horizon: -0.833, civil: -6 };

function julianDay(year, month, day) {
  if (month <= 2) { year -= 1; month += 12; }
  const century = Math.floor(year / 100);
  const gregorian = 2 - century + Math.floor(century / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + gregorian - 1524.5;
}

function solarEvents(year, month, day, lat, lonEast, angle) {
  // 公式以西經為正；本專案城市皆為東經。
  const lonWest = -lonEast;
  // 儒略日自中午起算，這裡必須取整——用 .5 會整整差半天。
  const n = Math.round(julianDay(year, month, day) - 2451545.0 + 0.0008);
  const meanSolarNoon = n + lonWest / 360;
  const anomaly = (357.5291 + 0.98560028 * meanSolarNoon) % 360;
  const center = 1.9148 * Math.sin(rad(anomaly))
    + 0.0200 * Math.sin(rad(2 * anomaly))
    + 0.0003 * Math.sin(rad(3 * anomaly));
  const eclipticLongitude = (anomaly + center + 180 + 102.9372) % 360;
  const transit = 2451545.0 + meanSolarNoon
    + 0.0053 * Math.sin(rad(anomaly))
    - 0.0069 * Math.sin(rad(2 * eclipticLongitude));
  const declination = Math.asin(Math.sin(rad(eclipticLongitude)) * Math.sin(rad(23.4397)));
  const cosHourAngle = (Math.sin(rad(angle)) - Math.sin(rad(lat)) * Math.sin(declination))
    / (Math.cos(rad(lat)) * Math.cos(declination));
  if (cosHourAngle < -1 || cosHourAngle > 1) return null; // 極晝／極夜，波蘭不會發生
  const hourAngle = deg(Math.acos(cosHourAngle));
  return { rise: transit - hourAngle / 360, set: transit + hourAngle / 360 };
}

function formatLocal(julian, offsetHours) {
  const date = new Date((julian - 2440587.5) * 86400000 + offsetHours * 3600000);
  return `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`;
}

/**
 * 2026 年歐盟夏令時於 10 月最後一個週日（10/25）03:00 結束。
 * 10/24 仍是 CEST（UTC+2），10/25 起為 CET（UTC+1）。
 */
export function warsawOffset(dateIso) {
  return dateIso <= '2026-10-24' ? { hours: 2, tz: 'CEST' } : { hours: 1, tz: 'CET' };
}

/** 回傳該城該日的日出、日落與民用曙暮光結束（藍調時刻下限）。 */
export function sunTimes(dateIso, city) {
  const coordinates = CITY_COORDINATES[city];
  if (!coordinates) throw new Error(`未知城市：${city}`);
  const [year, month, day] = dateIso.split('-').map(Number);
  const { hours, tz } = warsawOffset(dateIso);
  const horizon = solarEvents(year, month, day, coordinates.lat, coordinates.lon, SUN_ANGLES.horizon);
  const civil = solarEvents(year, month, day, coordinates.lat, coordinates.lon, SUN_ANGLES.civil);
  return {
    tz,
    sunrise: formatLocal(horizon.rise, hours),
    sunset: formatLocal(horizon.set, hours),
    civilDawn: formatLocal(civil.rise, hours),
    blueHourEnd: formatLocal(civil.set, hours),
  };
}

function runCli() {
  const rows = process.argv.slice(2);
  if (rows.length >= 2) {
    console.log(JSON.stringify(sunTimes(rows[0], rows[1]), null, 2));
    return;
  }
  console.log('日期         城市      時區   日出    日落    藍調結束（民用曙暮光）');
  for (const [date, city] of [
    ['2026-10-24', '華沙'], ['2026-10-25', '克拉科夫'], ['2026-10-26', '克拉科夫'],
    ['2026-10-27', '克拉科夫'], ['2026-10-28', '樂斯拉夫'], ['2026-10-29', '波茲南'],
    ['2026-10-30', '華沙'], ['2026-10-31', '華沙'],
  ]) {
    const t = sunTimes(date, city);
    console.log(`${date}  ${city.padEnd(5)} ${t.tz.padEnd(5)} ${t.sunrise}  ${t.sunset}  ${t.blueHourEnd}`);
  }
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectRun) runCli();
