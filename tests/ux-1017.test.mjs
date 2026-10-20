// UX 審查第二輪（2026-10-17）H1–H3、M1–M6 修正驗證。
// 每個 test 對應審查清單一個編號。版面位置（第一屏、44px）另以 Playwright 實測，這裡鎖住結構與樣式規則。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { makeDayMap, stepNumberForPin, pinLabels } from '../src/lib/day-map.mjs';
import { days } from '../src/data/trip.js';
import { mapPins } from '../src/data/cities.js';
import { daySupplementaryPins, pinCoordinateCheckedAt } from '../src/data/day-maps.js';

const distDir = path.resolve('dist');
const read = relativePath => fs.readFileSync(path.join(distDir, relativePath), 'utf8');
const css = () => fs.readFileSync(path.join(distDir, 'assets/main.css'), 'utf8');

test('H1：今日卡「導航到這一站」緊接站名，排在說明與地址之前', () => {
  const html = read('today.html');
  const steps = html.split('data-next-step ').slice(1);
  assert.ok(steps.length > 50, '今日卡應輸出八天的接下來去哪步驟');
  for (const step of steps) {
    const block = step.slice(0, step.indexOf('</div>'));
    const title = block.indexOf('class="today-next-title"');
    const nav = block.indexOf('class="today-next-nav"');
    assert.ok(title !== -1 && nav > title, '導航鈕應在站名之後');
    for (const later of ['class="today-next-sub"', 'class="today-address"', 'class="today-next-entrance"', 'class="today-next-ticket"']) {
      const at = block.indexOf(later);
      if (at !== -1) assert.ok(at > nav, `${later} 應排在導航鈕之後`);
    }
  }
});

test('H1：旅途中精簡版 SOS 改成一列 3 欄，說明只對讀屏軟體保留，號碼仍是 44px tel: 連結', () => {
  const source = css();
  assert.match(source, /\.today-compact \.today-sos-list \{[^}]*grid-template-columns: auto auto minmax\(0, 1fr\);/);
  assert.match(source, /\.today-compact \.today-sos-list li > span \{\s*position: absolute; width: 1px; height: 1px;/);
  assert.match(source, /\.today-compact \.today-sos-list a\[href\^='tel:'\] \{[^}]*min-height: 44px;/);
  // 後面的 .journal-site 小字下限規則不能把精簡版的「緊急電話」標題撐回來
  assert.match(source, /\.journal-site \.today-compact \.today-sos-title, \.today-compact \.today-sos-title \{ font-size: 0; \}/);
  const html = read('today.html');
  assert.match(html, /<li><a href="tel:112">112<\/a><span>歐洲通用緊急<\/span><\/li>/);
});

test('H2：每日地圖圖釘編號就是時間表列序，時間表只在有圖釘的列標出同一個數字', () => {
  for (const day of days) {
    const map = makeDayMap(day);
    const numbers = new Set();
    for (const point of map.points) {
      const n = point[8];
      if (n === null) continue;
      assert.ok(Number.isInteger(n) && n >= 1 && n <= day.steps.length, `Day ${day.n} ${point[2]} 編號超出時間表`);
      numbers.add(n);
    }
    const html = read(`day-${String(day.n).padStart(2, '0')}.html`);
    const rows = html.slice(html.indexOf('<tbody>', html.indexOf('id="schedule"')), html.indexOf('</tbody>', html.indexOf('id="schedule"'))).split('<tr>').slice(1);
    assert.equal(rows.length, day.steps.length);
    rows.forEach((row, index) => {
      const badge = row.match(/<span class="step-pin"[^>]*><span class="visually-hidden">地圖圖釘 <\/span>(\d+)<\/span>/);
      if (numbers.has(index + 1)) assert.equal(Number(badge?.[1]), index + 1, `Day ${day.n} 第 ${index + 1} 列缺少圖釘序號`);
      else assert.equal(badge, null, `Day ${day.n} 第 ${index + 1} 列沒有圖釘卻標了序號`);
    });
  }
});

test('H2：圖釘對到正確的時間表列；說明裡的門牌、移動列與通稱不會搶走編號', () => {
  const day5 = days.find(day => day.n === 5);
  const label = name => day5.steps[stepNumberForPin(name, day5.steps) - 1].label;
  assert.match(label('Central Cafe'), /Central Cafe/);
  assert.match(label('百年廳 Hala Stulecia'), /★ 百年廳/, '同分時應選真正停留的列，不是「電車往百年廳」');
  assert.match(label('Hala Targowa 市場大廳'), /Hala Targowa/);
  assert.match(label('大學主樓 Uniwersytet Wrocławski'), /大學區/, '「Bigos Wrocławski」不能讓大學主樓對到午餐');
  const day6 = days.find(day => day.n === 6);
  // 「Stary Rynek 11/17」是牛角麵包店的門牌，不算對上；別名表讓它對到廣場那一列。
  assert.notEqual(stepNumberForPin('舊市集廣場 Stary Rynek', day6.steps), 13);
  assert.match(day6.steps[stepNumberForPin('舊市集廣場 Stary Rynek', day6.steps) - 1].label, /廣場卡正面/);
  assert.match(day6.steps[stepNumberForPin('帝王城堡 Zamek Cesarski（外觀）', day6.steps) - 1].label, /帝王區/);
});

// 驗收 F3／F5／F6：序號不可指到移動列（搭車、轉乘、走回去），說明文字也不比移動列。
const pinNumber = (dayN, name) => makeDayMap(days.find(day => day.n === dayN)).points.find(point => point[2] === name)[8];
const stepLabel = (dayN, n) => days.find(day => day.n === dayN).steps[n - 1].label;
const MOVEMENT_LABEL = /前往|搭車|電車|地鐵|火車|巴士|SKM|\bIC\b|EIP|EIC|走回|^回|回 |返回|轉乘/;

test('F3：Day 2 的 Kazimierz 與 Podgórze 不共用序號，也不指到移動列', () => {
  const kazimierz = pinNumber(2, 'Kazimierz 猶太區');
  const podgorze = pinNumber(2, 'Podgórze・猶太英雄廣場');
  assert.ok(!(kazimierz === 13 && podgorze === 13), '兩顆不可都是 13');
  for (const n of [kazimierz, podgorze]) if (n) assert.doesNotMatch(stepLabel(2, n), MOVEMENT_LABEL);
});

test('F3：Day 1 的 Warszawa Centralna 不指到 SKM 那一列；Day 4 Kraków Główny 指到「抵 Kraków Główny」', () => {
  const centralna = pinNumber(1, 'Warszawa Centralna');
  if (centralna) assert.doesNotMatch(stepLabel(1, centralna), /SKM/);
  assert.match(stepLabel(4, pinNumber(4, 'Kraków Główny')), /^抵 Kraków Główny/);
});

test('F3：景點與餐廳圖釘一律不指到移動列（車站與住宿可以指到「抵／回 某地」）', () => {
  for (const day of days) {
    for (const point of makeDayMap(day).points) {
      if (!point[8] || ['transport', 'hotel'].includes(point[5])) continue;
      assert.doesNotMatch(day.steps[point[8] - 1].label, MOVEMENT_LABEL, `Day ${day.n} ${point[2]} 指到移動列 ${point[8]}`);
    }
  }
});

test('F3：同一天內不同地點不共用序號（同一列寫到、相距 400 m 內的同一停留點除外）', () => {
  const km = (a, b) => Math.hypot((a[0] - b[0]) * 111.32, (a[1] - b[1]) * 111.32 * Math.cos(a[0] * Math.PI / 180));
  for (const day of days) {
    const groups = new Map();
    for (const point of makeDayMap(day).points) if (point[8]) groups.set(point[8], [...(groups.get(point[8]) || []), point]);
    for (const [n, group] of groups) {
      for (const a of group) for (const b of group) {
        if (a !== b) assert.ok(km(a, b) <= 0.4, `Day ${day.n} 序號 ${n}：${a[2]} 與 ${b[2]} 相距 ${km(a, b).toFixed(2)} km，不是同一個地點`);
      }
    }
  }
});

test('F3：同一列共用序號的圖釘在地圖上標 7a／7b，同一頁不會有兩顆同標籤（Day 6 教堂島與主教座堂）', () => {
  assert.deepEqual(pinLabels([1, 7, null, 7, 3, 7]), ['1', '7a', null, '7b', '3', '7c']);
  for (const day of days) {
    const labels = makeDayMap(day).points.map(point => point[9]).filter(Boolean);
    assert.equal(new Set(labels).size, labels.length, `Day ${day.n} 有重複的圖釘標籤：${labels.join(',')}`);
  }
  const day6 = makeDayMap(days.find(day => day.n === 6)).points;
  const sevens = day6.filter(point => point[8] === 7);
  assert.deepEqual(sevens.map(point => point[9]).sort(), ['7a', '7b']);
  assert.deepEqual(sevens.map(point => point[2]).sort(), ['大教堂島 Ostrów Tumski', '波茲南主教座堂'].sort());
});

test('N1：錯開的圖釘有引線元素，只在 is-nudged 顯示、不攔截點擊', () => {
  const css = fs.readFileSync(path.resolve('src/styles/main.css'), 'utf8');
  assert.match(css, /\.trip-pin \.trip-leader\s*\{[^}]*display:\s*none[^}]*pointer-events:\s*none/);
  assert.match(css, /\.trip-pin\.is-nudged \.trip-leader\s*\{\s*display:\s*block/);
  const tpl = fs.readFileSync(path.resolve('src/templates/map.mjs'), 'utf8');
  assert.match(tpl, /class="trip-leader"/);
  assert.match(tpl, /Math\.atan2\(best\.dy, best\.dx\)/);
});

test('F5／F6：別名讓主要停留點有序號；皇家大道對到第一次經過的那一列', () => {
  assert.match(stepLabel(7, pinNumber(7, '華沙老城市場廣場')), /★ 老城廣場/);
  assert.match(stepLabel(5, pinNumber(5, '中央市集廣場')), /★ 中央廣場/);
  assert.match(stepLabel(5, pinNumber(5, '大教堂島 Ostrów Tumski')), /座堂島/);
  assert.match(stepLabel(2, pinNumber(2, '中央市集廣場')), /★ 中央廣場/);
  assert.match(stepLabel(4, pinNumber(4, 'ibis budget Krakow Stare Miasto')), /ibis/);
  assert.match(stepLabel(6, pinNumber(6, '舊市集廣場 Stary Rynek')), /廣場卡正面/);
  // 2026-10-19：原「皇家大道」圖釘座標改到聖十字教堂並改名，對到「★ 聖十字教堂」那列；哥白尼紀念碑另有圖釘，仍是第 10 列。
  assert.match(stepLabel(1, pinNumber(1, '聖十字教堂 Kościół św. Krzyża')), /聖十字教堂/);
  assert.equal(pinNumber(1, '哥白尼紀念碑 Pomnik Kopernika'), 10);
  assert.match(stepLabel(1, 10), /哥白尼紀念碑/);
});

test('H2：預設框住主要步行區、提供「全部地點」，座標資料不變', () => {
  const day5 = makeDayMap(days.find(day => day.n === 5));
  assert.ok(day5.focusBounds, 'Day 5 應有主要步行區範圍');
  const [[south, west], [north, east]] = day5.focusBounds;
  const hala = day5.points.find(point => point[2] === '百年廳 Hala Stulecia');
  assert.ok(hala[1] > east, '搭電車才到的百年廳不在預設步行區');
  assert.ok(day5.points.some(point => point[0] >= south && point[0] <= north && point[1] >= west && point[1] <= east && point[2] === '中央市集廣場'));
  // 座標與原始資料逐筆相同
  for (const day of days) {
    const map = makeDayMap(day);
    const sources = [...Object.values(mapPins).flatMap(city => city.points), ...(daySupplementaryPins[day.n] || [])];
    for (const point of map.points) {
      assert.ok(sources.some(source => source[2] === point[2] && source[0] === point[0] && source[1] === point[1]), `${point[2]} 座標被改動`);
    }
  }
  const html = read('day-05.html');
  assert.match(html, /data-map-action="all"[^>]*>全部地點<\/button>/);
  assert.match(html, /data-map-action="reset" aria-label="回到主要步行區：樂斯拉夫 Wrocław">步行區<\/button>/);
  assert.match(html, /L\.divIcon\(\{ className: 'trip-pin'/);
  assert.match(css(), /\.trip-pin span \{/);
});

test('H3：地圖彈窗的 Google Maps 連結 44px、座標來源獨立一行，關閉鈕 44px（只改 CSS 與日頁腳本）', () => {
  const source = css();
  assert.match(source, /\.leaflet-container \.leaflet-popup-content a:not\(\.map-popup-source\) \{[^}]*min-height: 44px;/);
  assert.match(source, /\.leaflet-container \.leaflet-popup-content a\.map-popup-source \{[^}]*display: block;[^}]*margin-top: 8px;/);
  assert.match(source, /\.map-container\.leaflet-container a\.leaflet-popup-close-button \{[^}]*width: 44px;[^}]*height: 44px;/);
  const day = read('day-07.html');
  assert.match(day, /source\.className = 'map-popup-source'/);
  assert.doesNotMatch(day, /createTextNode\(' · '\)/, '座標來源不再和導航連結並排');
});

// 2026-10-20 UX F5：導言改為完整顯示（3 行截斷常把抵達時刻切掉），改驗「不再截斷」。
test('M1：每日頁手機收掉封面照片、導言完整不截斷；選擇器限定每日頁', () => {
  const source = css();
  const block = source.slice(source.indexOf('/* M1 每日頁手機第一屏'));
  assert.match(block, /\.journal-day-header \.journal-day-cover,\s*\.journal-day-header \.journal-day-cover-fallback \{ display: none; \}/);
  assert.doesNotMatch(block.slice(0, block.indexOf('}\n}') + 3), /line-clamp/);
  assert.doesNotMatch(block.slice(0, block.indexOf('}\n}') + 3), /journal-city/);
});

test('M2：離線時 nav.js 在 <html> 標 data-offline，底部列上緣顯示離線字樣', () => {
  const nav = read('assets/nav.js');
  assert.match(nav, /toggleAttribute\('data-offline', navigator\.onLine === false\)/);
  assert.match(css(), /\[data-offline\] \.mobile-quick-nav::before \{[^}]*content: "離線・顯示已存資料";[^}]*height: 18px;/);
});

test('M3：查核紀錄、速食分店、已完成預約的收合列也有「＋／－」，HTML 不加 class', () => {
  const source = css();
  for (const selector of ['.fast-food-directory-city', '.booking-done']) {
    const escaped = selector.replace(/[.]/g, '\\.');
    assert.match(source, new RegExp(`${escaped} > summary::before[\\s\\S]{0,400}content: "＋";`));
    assert.match(source, new RegExp(`${escaped}\\[open\\] > summary::before`));
  }
  // 2026-10-20 起城市頁不再有「查核紀錄與來源」摺疊區
  assert.ok(!read('city-krakow.html').includes('查核紀錄與來源'));
  assert.ok(Buffer.byteLength(read('city-krakow.html')) <= 102400);
});

test('M4：實用頁表格的 Google Maps 定位連結與桌機餐次連結有 44px 點擊高度', () => {
  const source = css();
  assert.match(source, /\.journal-practical \.table-editorial td:not\(:first-child\) a\[href\*="google\.com\/maps"\] \{[^}]*min-height: 44px;/);
  assert.match(source, /@media \(min-width: 701px\) \{\s*\.table-schedule td \.step-meal-link \{[^}]*min-height: 44px;/);
});

test('M5：待辦頁刊頭縮小、摘要緊接清單，免責說明移到清單最後', () => {
  const todos = read('practical/todos.html');
  const summary = todos.indexOf('class="callout-risk todo-summary"');
  const firstGroup = todos.indexOf('<section class="section" id="todo-');
  const disclaimer = todos.indexOf('practical-disclaimer');
  const lastGroupEnd = todos.lastIndexOf('<section class="section" id="todo-');
  assert.ok(summary !== -1 && summary < firstGroup, '摘要應在第一個分類之前');
  assert.ok(disclaimer > lastGroupEnd, '免責說明應在清單最後');
  assert.match(todos, /<header class="journal-appendix-header is-compact">/);
  assert.match(css(), /\.journal-appendix-header\.is-compact h1 \{[^}]*font-size: 1\.6rem;/);
  assert.doesNotMatch(read('practical/essentials.html'), /is-compact/, '安全須知頁刊頭不受影響');
});

test('M6：八天三餐每天都有「↑ 換一天」，日期列帶當地日期供標出今天', () => {
  const dining = read('practical/dining.html');
  assert.equal((dining.match(/<p class="meals-back"><a href="#daily-meals">↑ 換一天<\/a><\/p><\/details>/g) || []).length, 8);
  // 2026-10-20 長頁收合：每天一張可收合卡，出發前只展開 Day 1，旅途中只展開今天
  assert.equal((dining.match(/<details class="card meals-day hash-fold"/g) || []).length, 8);
  assert.equal((dining.match(/<details class="card meals-day hash-fold"[^>]*open>/g) || []).length, 1);
  assert.match(dining, /<a href="#meals-day-5" data-meal-date="2026-10-28">/);
  assert.match(dining, /setAttribute\('aria-current', 'date'\)/);
  assert.match(css(), /\.day-jump a\[aria-current='date'\]/);
});

test('F1：彈窗寬度跟著地圖寬度，城市頁另有 CSS 上限，手機上關閉鈕不被切掉', () => {
  const day = read('day-05.html');
  assert.match(day, /marker\.bindPopup\(popup, \{ maxWidth: 300, autoPanPadding: \[12, 12\] \}\)/);
  assert.match(day, /Math\.min\(300, container\.clientWidth - 72\)/);
  assert.match(css(), /\.leaflet-container \.leaflet-popup-content \{[^}]*max-width: calc\(100vw - 132px\);/);
});

test('F2／F7：矮螢幕旅途中隱藏日卡大標題；窄螢幕 SOS 卡收緊間距', () => {
  const source = css();
  assert.match(source, /@media \(max-width: 600px\) and \(max-height: 700px\) \{\s*\.today-compact \.today-head h2 \{ position: absolute;/);
  assert.match(source, /@media \(max-width: 380px\) \{\s*\.today-compact \.today-sos \{ gap: \.35rem; padding-inline: \.45rem; \}/);
});

test('N1：數字圖釘依編號疊層並在 zoomend 錯開，不再一律 zIndexOffset 100', () => {
  const day = read('day-06.html');
  assert.match(day, /map\.on\('zoomend', declutter\)/);
  assert.match(day, /function declutter\(\)/);
  assert.match(day, /face\.style\.transform = /);
  assert.match(day, /zIndexOffset: number \? \(100 - number\) \* 100000 : 0/);
  assert.doesNotMatch(day, /zIndexOffset: number \? 100 : 0/, 'zIndexOffset 不可再是固定 100');
  assert.match(css(), /\.trip-pin\.is-nudged::after \{/);
});

test('F3b：同一列的 a／b／c 依時間表文字先後標（Day 5 第 17 列 Słodowa 島 → 沙島；Day 2 城門 → 甕城）', () => {
  assert.deepEqual(pinLabels([7, 7, 7], [30, 5, Infinity]), ['7b', '7a', '7c'], '依位置排序，找不到位置的排最後');
  assert.deepEqual(pinLabels([7, 7, 7], [Infinity, Infinity, 3]), ['7b', '7c', '7a'], '同位置或都沒位置時維持原陣列順序');
  const label = (n, name) => makeDayMap(days.find(day => day.n === n)).points.find(point => point[2].startsWith(name))?.[9];
  assert.equal(label(5, 'Słodowa 島'), '17a');
  assert.equal(label(5, '沙上聖母堂'), '17b');
  assert.equal(label(2, '聖弗洛里安城門'), '8a');
  assert.equal(label(2, '甕城'), '8b');
  assert.ok(/^\d+$/.test(label(2, 'Pimiento')), 'Day 2 Pimiento 午餐要有純數字編號');
});

test('F3c：補充圖釘各自帶座標查證日期，不再一律寫死 2026-09-08', () => {
  const checkedAt = (n, name) => makeDayMap(days.find(day => day.n === n)).checks[name].checkedAt;
  assert.equal(checkedAt(2, 'Pimiento Shop and Bistro'), '2026-10-19');
  assert.equal(checkedAt(8, 'Warszawa Śródmieście'), '2026-10-19');
  const all = days.flatMap(day => Object.values(makeDayMap(day).checks).map(check => check.checkedAt));
  assert.ok(new Set(all).size > 1, '不可每顆圖釘都是同一個日期');
  for (const [n, pins] of Object.entries(daySupplementaryPins)) {
    for (const pin of pins) {
      assert.match(pinCoordinateCheckedAt[n]?.[pin[2]] || '', /^\d{4}-\d{2}-\d{2}$/, `Day ${n} ${pin[2]} 缺座標查證日期`);
    }
  }
  // 建置輸出：Day 2 頁面內嵌的 mapChecks 要帶 Pimiento 的 10-19，而不是共用的 09-08
  assert.match(read('day-02.html'), /"Pimiento Shop and Bistro":\{"status":"coordinate-verified","checkedAt":"2026-10-19"/);
  // 2026-10-20 起地圖彈窗不再顯示查證日期
  assert.doesNotMatch(read('day-02.html'), /查證'\s*:/);
  assert.ok(!read('day-02.html').includes("' 查證'"));
});

test('N4：可視高度 600 以下（iPhone SE Safari 分頁）旅途中今日卡再壓縮留白，導航鈕落在底部列之上，375×667 以上不受影響', () => {
  const source = css();
  const rule = source.match(/@media \(max-width: 600px\) and \(max-height: 600px\) \{([\s\S]*?)\n\}/);
  assert.ok(rule, '應有 max-height: 600px 的矮螢幕規則');
  for (const selector of ['.today-compact { margin-top', '.today-compact .today-sos {', '.today-compact .today-head {', '.today-compact .today-block {', '.today-compact .today-next-clock b {', '.today-compact .today-next-nav {']) {
    assert.ok(rule[1].includes(selector), `矮螢幕規則應壓縮 ${selector}`);
  }
  assert.doesNotMatch(rule[1], /display: none|visibility: hidden/, '只壓縮留白，不隱藏任何內容');
  assert.match(source, /@media \(max-width: 600px\) and \(max-height: 700px\) \{\s*\.today-compact \.today-head h2 \{ position: absolute;/, '既有 700px 規則仍在');
  // SOS 仍排在日卡之前（DOM 順序不變）
  const html = read('today.html');
  assert.ok(html.indexOf('data-today-sos') < html.indexOf('data-today-cards'));
});

test('F4：待辦頁刊頭、「本頁章節」、分類大標只在 .is-compact 的頁面縮小；其他實用頁輸出不變、文字不刪', () => {
  const source = css();
  // 2026-10-20：章節 chip 改換行，不再橫向捲動（最後一顆被切掉看不出能滑）
  assert.match(source, /\.journal-practical \.page:has\(> \.is-compact\) \.chapter-index ol \{ flex-wrap: wrap;[^}]*\}/);
  assert.doesNotMatch(source, /\.journal-practical \.page:has\(> \.is-compact\) \.chapter-index ol \{[^}]*overflow-x: auto/);
  assert.match(source, /\.journal-practical \.page:has\(> \.is-compact\) \.section-heading h2 \{ font-size: 1\.4rem; \}/);
  assert.match(source, /@media \(min-width: 1000px\) \{\s*\.journal-appendix-header\.is-compact \{ display: flex;/);
  const todos = read('practical/todos.html');
  assert.match(todos, /<header class="journal-appendix-header is-compact">/);
  assert.match(todos, /<p class="chapter-index-label"[^>]*>本頁章節<\/p>/, '「本頁章節」文字仍在');
  assert.match(todos, /class="section-heading"><span class="section-num">Rail/);
  for (const page of ['booking', 'dining', 'transit', 'shopping', 'groceries', 'essentials']) {
    assert.doesNotMatch(read(`practical/${page}.html`), /is-compact/, `${page} 頁不可帶 is-compact`);
  }
});

test('F5：待辦頁刊頭說明完整換行（不再 nowrap / ellipsis），手機再壓縮留白讓第一筆待辦標題落在底部導覽列之上；只限 .is-compact', () => {
  const source = css();
  const dek = source.match(/\.journal-appendix-header\.is-compact \.hero-dek \{([^}]*)\}/);
  assert.ok(dek, '應有 .is-compact .hero-dek 規則');
  assert.doesNotMatch(dek[1], /nowrap|ellipsis|overflow: hidden/, '說明文字不可再被截成一行');
  assert.match(dek[1], /white-space: normal;/);
  const mobile = source.match(/\/\* 手機第一屏：待辦頁刊頭[\s\S]*?@media \(max-width: 700px\) \{([\s\S]*?)\n\}\n/);
  assert.ok(mobile, '應有手機第一屏壓縮規則');
  for (const selector of ['.journal-practical .page:has(> .is-compact) { padding-top: 0.5rem; }', '.journal-appendix-header.is-compact h1 {', '.journal-appendix-header.is-compact .hero-dek {', '.todo-summary p {', '.chapter-index {', '.section .lead {', '.todo-list { margin-top: 0.4rem; }']) {
    assert.ok(mobile[1].includes(selector), `手機規則應壓縮 ${selector}`);
  }
  for (const line of mobile[1].split('\n').filter((l) => l.trim())) {
    assert.match(line, /\.is-compact/, `手機規則每條都限定在 .is-compact：${line.trim()}`);
  }
  assert.doesNotMatch(mobile[1], /display: none|visibility: hidden|nowrap/, '只壓縮留白，不隱藏任何內容');
});
