import { days } from '../data/trip.js';
import { dayHref } from './journey.mjs';
import { cityRoutes } from './city-guide.mjs';

export const CITY_LINKS = cityRoutes.map(city => [`city-${city.fileKey}.html`, `${city.name} ${city.localName}`]);
export const DAY_LINKS = days.map(day => [dayHref(day), `Day ${day.n}`]);

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

const standaloneLabels = {"餐廳與速食": "餐廳", "門票速查": "門票", "伴手禮與購物": "購物", "安全與基本須知": "安全須知"};
const withStandaloneLabel = ([file, label]) => [file, standaloneLabels[label] || label];

export const standaloneNavGroups = [
  { key: 'today', label: '今日', pages: [['today.html', '今日卡']] },
  { key: 'days', label: '每日行程', pages: DAY_LINKS },
  { key: 'cities', label: '城市指南', pages: cityRoutes.map(city => [`city-${city.fileKey}.html`, city.name]) },
  { key: 'practical', label: '實用資訊', pages: PRACTICAL_LINKS.map(withStandaloneLabel) },
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
