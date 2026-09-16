import { mapPins, mapPinChecks } from '../data/cities.js';
import { dayMapPlans, daySupplementaryPins } from '../data/day-maps.js';

export function makeDayMap(day) {
  const plan = dayMapPlans[day.n];
  const selections = plan.selections;
  const points = [];
  const checks = {};
  for (const [cityKey, names] of Object.entries(selections)) {
    for (const point of mapPins[cityKey].points.filter(item => names.includes(item[2]))) {
      points.push(point);
      checks[point[2]] = mapPinChecks[cityKey][point[2]];
    }
  }
  points.push(...(daySupplementaryPins[day.n] || []));
  for (const point of daySupplementaryPins[day.n] || []) checks[point[2]] = { status: 'coordinate-verified', checkedAt: '2026-09-08', coordinateSource: point[6] };
  return {
    center: plan.center, zoom: plan.zoom, points, unlocated: [], focus: plan.focus,
    checks,
    note: `白天主地圖：${plan.focus}。共 ${points.length} 個當日景點／操作錨點；晚間抵達城市不納入本圖，使用 ＋／－、滾輪或雙擊縮放。`,
  };
}
