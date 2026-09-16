import { days } from '../data/trip.js';
import { dayHref } from './journey.mjs';
import { cityRoutes } from './city-guide.mjs';

export const CITY_LINKS = cityRoutes.map(city => [`city-${city.fileKey}.html`, `${city.name} ${city.localName}`]);
export const DAY_LINKS = days.map(day => [dayHref(day), `Day ${day.n}`]);

export const PRACTICAL_LINKS = [
  ['practical/todos.html', '待辦事項'],
  ['practical/booking.html', '訂票與交通'],
  ['practical/dining.html', '餐廳與速食'],
  ['practical/tickets.html', '門票速查'],
  ['practical/transit.html', '市內交通'],
  ['practical/shopping.html', '伴手禮與購物'],
  ['practical/essentials.html', '安全與基本須知'],
  ['practical/notes.html', '行前提醒'],
  ['practical/ops-dashboard.html', '資料更新儀表板'],
  ['practical/database.html', '自由行資料庫'],
];

const standaloneLabels = {"餐廳與速食": "餐廳", "門票速查": "門票", "伴手禮與購物": "購物", "安全與基本須知": "安全須知"};

export const standaloneNavGroups = [
  { key: 'today', label: '今日', pages: [['today.html', '今日卡']] },
  { key: 'days', label: '每日行程', pages: DAY_LINKS },
  { key: 'cities', label: '城市指南', pages: cityRoutes.map(city => [`city-${city.fileKey}.html`, city.name]) },
  { key: 'practical', label: '實用資訊', pages: PRACTICAL_LINKS.map(([file, label]) => [file, standaloneLabels[label] || label]) },
];
export const standalonePages = [['index.html', '旅程首頁'], ...standaloneNavGroups.flatMap(group => group.pages)];
