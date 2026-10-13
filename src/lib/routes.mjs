import { days } from '../data/trip.js';
import { dayHref } from './journey.mjs';
import { cityRoutes } from './city-guide.mjs';

export const CITY_LINKS = cityRoutes.map(city => [`city-${city.fileKey}.html`, `${city.name} ${city.localName}`]);
export const DAY_LINKS = days.map(day => [dayHref(day), `Day ${day.n}`]);
// 導覽下拉的每日項目要看得到日期與城市（只寫 Day N 得自己換算哪天）；
// 頁面標題與單檔版章節名仍沿用 DAY_LINKS 的「Day N」。
export const DAY_LINK_META = Object.fromEntries(days.map(day => [dayHref(day), {
  date: day.date.replace(/\s*\((.)\)/, '（$1）'),
  city: day.city,
}]));

// 全部實用資訊頁——決定 build 出幾頁、單檔版收錄幾個章節，順序與導覽顯示無關。
export const PRACTICAL_PAGES = [
  ['practical/tickets.html', '門票速查'],
  ['practical/dining.html', '餐廳與速食'],
  ['practical/transit.html', '市內交通'],
  ['practical/essentials.html', '安全與基本須知'],
  ['practical/todos.html', '待辦事項'],
  ['practical/notes.html', '行前提醒'],
  ['practical/booking.html', '訂票與交通'],
  ['practical/shopping.html', '伴手禮與購物'],
  ['practical/groceries.html', '超市與便利商店'],
  ['practical/ops-dashboard.html', '資料更新儀表板'],
  ['practical/database.html', '自由行資料庫'],
];

// 主導覽「實用資訊」下拉依「旅途中會用」排序，且不收「資料更新儀表板」——
// 那是給維護者看的內部頁，保留頁面本身與連結，只是不進旅客導覽（稽核 M8）。
export const PRACTICAL_LINKS = PRACTICAL_PAGES.filter(([file]) => file !== 'practical/ops-dashboard.html');

// 導覽下拉依「使用時機」分三組（UX 審查 C4）。順序即顯示順序；旅程期間由 nav.js 把「旅途中」排第一。
// 組內只列實際存在於 PRACTICAL_LINKS 的頁面，頁名一律沿用 PRACTICAL_PAGES，不另取名。
export const PRACTICAL_NAV_GROUPS = [
  { key: 'before', label: '出發前', files: ['practical/todos.html', 'practical/booking.html', 'practical/notes.html'] },
  { key: 'trip', label: '旅途中', files: ['practical/tickets.html', 'practical/dining.html', 'practical/transit.html', 'practical/database.html', 'practical/essentials.html'] },
  { key: 'shop', label: '購物', files: ['practical/shopping.html', 'practical/groceries.html'] },
].map(group => ({
  ...group,
  pages: group.files.map(file => PRACTICAL_LINKS.find(([linkFile]) => linkFile === file)).filter(Boolean),
}));
// 導覽上的補充註記：SOS 緊急聯絡藏在資料庫頁，桌機沒有底部 SOS 列，所以在名稱旁標明。
export const NAV_LINK_NOTES = { 'practical/database.html': '含 SOS' };
// 旅程期間（華沙日期）：nav.js 與單檔版導覽據此把「旅途中」排第一。
export const TRIP_DATE_RANGE = { timeZone: 'Europe/Warsaw', start: '2026-10-24', end: '2026-10-31' };

const standaloneLabels = {"餐廳與速食": "餐廳", "門票速查": "門票", "伴手禮與購物": "購物", "安全與基本須知": "安全須知"};
const withStandaloneLabel = ([file, label]) => [file, standaloneLabels[label] || label];

export const standaloneNavGroups = [
  { key: 'today', label: '今日', pages: [['today.html', '今日卡']] },
  { key: 'days', label: '每日行程', pages: DAY_LINKS },
  { key: 'cities', label: '城市指南', pages: cityRoutes.map(city => [`city-${city.fileKey}.html`, city.name]) },
  { key: 'practical', label: '實用資訊', pages: PRACTICAL_LINKS.map(withStandaloneLabel),
    subgroups: PRACTICAL_NAV_GROUPS.map(group => ({ key: group.key, label: group.label, pages: group.pages.map(withStandaloneLabel) })) },
];
// 單檔版仍要打包全部實用頁（含資料更新儀表板），只是導覽選單不顯示它；
// 內容清單因此另外以 PRACTICAL_PAGES（全部）組成，不能只看 standaloneNavGroups
// （那份只給導覽選單用，已經濾掉儀表板）。
export const standalonePages = [
  ['index.html', '旅程首頁'],
  ['today.html', '今日卡'],
  ...DAY_LINKS,
  ...cityRoutes.map(city => [`city-${city.fileKey}.html`, city.name]),
  ...PRACTICAL_PAGES.map(withStandaloneLabel),
];
