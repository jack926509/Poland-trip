// UX 稽核中嚴重度 M1–M11 修正驗證。
// 每個 test 對應稽核報告一個編號，方便回溯改動與原始問題。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const read = relativePath => fs.readFileSync(path.join(distDir, relativePath), 'utf8');
const css = () => fs.readFileSync(path.join(distDir, 'assets/main.css'), 'utf8');

test('M10：全程動線「無待訂項目」改為純文字，不再是可點連結', () => {
  const home = read('index.html');
  assert.match(home, /<span class="source-meta">無待訂項目<\/span>/);
  assert.doesNotMatch(home, /<a[^>]*>無待訂項目<\/a>/);
  // 仍要保留待處理項目的可點連結
  assert.match(home, /<a href="day-\d\d\.html#day-preparation">待處理 \d+ 項<\/a>/);
});

test('M11：今日頁標題上方顯示 TODAY 而非 APPENDIX，資料庫頁維持原樣', () => {
  const source = css();
  assert.match(source, /\.journal-today \.journal-appendix-header::before \{\s*content:\s*'TODAY';\s*\}/);
  // 今日頁 body class 是 journal-today，資料庫頁是 journal-practical，
  // CSS 用 class 範圍區分，不需要各自模板改動。
  const today = read('today.html');
  const database = read('practical/database.html');
  assert.match(today, /<body class="journal-site journal-today">/);
  assert.match(database, /<body class="journal-site journal-practical">/);
});

test('M1：今日頁手機 sticky 動作列貼齊頂端且改成單行，不再懸空留縫', () => {
  const source = css();
  const rule = source.match(/\.journal-today \.today-actions \{([^}]*)\}/)?.[1];
  assert.ok(rule, '找不到 .journal-today .today-actions 手機覆寫規則');
  assert.match(rule, /top:\s*0/);
  assert.match(rule, /flex-wrap:\s*nowrap/);
});

test('M4：城市頁餐飲區分組收合，候選預設展開、其餘收合並標數量', () => {
  const html = read('city-krakow.html');
  const section = html.slice(html.indexOf('id="city-dining"'), html.indexOf('</section>', html.indexOf('id="city-dining"')));
  const groups = Array.from(section.matchAll(/<details class="city-dining-group"( open)?>\s*<summary>([^<]*)<\/summary>/g));
  assert.ok(groups.length >= 3, `克拉科夫餐飲分組數異常：${groups.length}`);
  // 第一組（你的候選與順路必吃）預設展開
  assert.match(groups[0][2], /你的候選與順路必吃/);
  assert.ok(groups[0][1], '「你的候選與順路必吃」該預設展開（open）');
  // 其餘分組不展開，且 summary 要標出家數
  for (const [, openAttr, label] of groups.slice(1)) {
    assert.equal(openAttr, undefined, `分組「${label}」不該預設展開`);
    assert.match(label, /（\d+ 家）/, `分組「${label}」缺少家數標示`);
  }
  // 資料本身不減少：全部分組的總列數應等於原本合併餐廳數
  const rowCount = (section.match(/<tr class="/g) || []).length;
  assert.ok(rowCount >= 8, `餐廳總列數異常：${rowCount}`);
});

test('M3：日頁停用自動章節目錄、去除今日主軸重複句、時間表空欄位在手機不佔行', () => {
  const day = read('day-02.html');
  // 自動章節目錄已停用，保留 sticky 當日捷徑
  assert.doesNotMatch(day, /class="chapter-index"/);
  assert.match(day, /class="day-shortcuts"/);
  // 「今日主軸」標籤本身已移除（hero-dek 已顯示過同一句 headline）
  assert.doesNotMatch(day, /<b>今日主軸：<\/b>/);
  // 時間表花費／時長缺資料時帶 data-empty，CSS 在手機把該行隱藏
  assert.match(day, /data-label="花費" data-empty>—<\/td>/);
  const css = fs.readFileSync(path.join(distDir, 'assets/main.css'), 'utf8');
  assert.match(css, /\.table-schedule td\[data-empty\]\s*\{\s*display:\s*none;?\s*\}/);
});

test('M5：地圖圖釘放大到 radius 12（原 16×16px 太小，難精準點擊）', () => {
  const day = read('day-02.html');
  assert.match(day, /L\.circleMarker\(\[point\[0\], point\[1\]\], \{ radius: 12,/, '日頁地圖圖釘未放大');
  const city = read('city-krakow.html');
  assert.match(city, /radius:\s*12,/, '城市頁地圖圖釘未放大');
  assert.doesNotMatch(day + city, /radius:\s*8,/, '仍殘留舊的 radius: 8');
});

test('M9：首頁待辦分類只留計數＋連結，逐項名稱不再與待辦頁重複；nav-today 手機字級提高', () => {
  const home = read('index.html');
  // 5 個分類都改成 <a class="card card-link"> 摘要卡，不再逐項列出
  const todosSection = home.slice(home.indexOf('id="todos"'), home.indexOf('</section>', home.indexOf('id="todos"')));
  assert.equal((todosSection.match(/class="card card-link"/g) || []).length, 5, '待辦分類卡片數不對');
  assert.match(todosSection, /項待處理|已全部完成/);
  // 逐項的「日期 · 狀態」小標不再輸出到首頁
  assert.doesNotMatch(todosSection, /<span class="eyebrow">\d{1,2}\/\d{1,2} ·/);

  const css = fs.readFileSync(path.join(distDir, 'assets/main.css'), 'utf8');
  assert.match(css, /\.nav-today\s*\{\s*font-size:\s*\.95rem;?\s*\}/, '手機導覽「今日」字級未提高到 .95rem');
});

test('M6：搜尋索引改成外部檔案，多頁版不再內嵌 526KB、單頁 HTML 明顯變小', () => {
  const indexPath = path.join(distDir, 'assets/search-index.json');
  assert.ok(fs.existsSync(indexPath), '缺少 dist/assets/search-index.json');
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  assert.ok(Array.isArray(index) && index.length > 100, '外部索引內容異常');

  for (const file of ['index.html', 'city-krakow.html', 'practical/database.html']) {
    const html = read(file);
    // 內嵌 script 應該是空的，索引改成外部 URL
    assert.match(html, /<script type="application\/json" data-site-search-index><\/script>/, `${file} 仍內嵌搜尋索引`);
    assert.match(html, /data-search-index-url="[^"]*assets\/search-index\.json"/, `${file} 缺少外部索引 URL`);
    const sizeKb = Buffer.byteLength(html) / 1024;
    assert.ok(sizeKb < 100, `${file} 仍有 ${sizeKb.toFixed(1)}KB，未明顯縮小`);
  }

  // 單檔版是唯一例外：本來就要整份下載後離線自足，仍內嵌完整索引
  const standalone = fs.readFileSync(path.resolve('poland-travel-guide-2026.html'), 'utf8');
  assert.match(standalone, /<script type="application\/json" data-site-search-index>\[/, '單檔版應保留內嵌索引');

  // sw.js 要預快取外部索引才能離線搜尋
  const worker = fs.readFileSync(path.join(distDir, 'sw.js'), 'utf8');
  assert.match(worker, /\.\/assets\/search-index\.json/, 'sw.js 未預快取搜尋索引');
});

test('M7：門票速查有城市篩選 chip 與分組，價格欄位標明 PLN', () => {
  const html = read('practical/tickets.html');
  const chips = html.match(/<nav class="day-shortcuts"[\s\S]*?<\/nav>/)?.[0];
  assert.ok(chips, '門票頁缺少城市篩選 chip');
  for (const city of ['warszawa', 'krakow', 'wroclaw', 'poznan']) {
    assert.match(chips, new RegExp(`href="#tickets-${city}"`), `城市 chip 缺少 ${city}`);
  }
  const groups = Array.from(html.matchAll(/<details class="ticket-city-group" id="tickets-([a-z]+)" open>\s*<summary>([^<]*（\d+ 項）)<\/summary>/g));
  assert.equal(groups.length, 4, `門票分組數應為 4，實際 ${groups.length}`);
  assert.match(html, /<th>全票（PLN）<\/th>/);
  assert.match(html, /<th>優待（PLN）<\/th>/);
});

test('M2：手機底部快捷列在各類頁面都輸出，且連結依頁面類型指向對的錨點', () => {
  // 首頁（非日／城市頁）：時間表與吃哪都導回今日頁對應區塊
  const home = read('index.html');
  const homeNav = home.match(/<nav class="mobile-quick-nav"[\s\S]*?<\/nav>/)?.[0];
  assert.ok(homeNav, '首頁缺少手機快捷列');
  assert.match(homeNav, /href="today\.html"/);
  assert.match(homeNav, /href="today\.html#today-schedule"/);
  assert.match(homeNav, /href="today\.html#today-food"/);
  assert.match(homeNav, /href="practical\/database\.html#sos-contacts"/);

  // 日頁：時間表／吃哪改成同頁錨點，不必先跳今日頁
  const day = read('day-02.html');
  const dayNav = day.match(/<nav class="mobile-quick-nav"[\s\S]*?<\/nav>/)?.[0];
  assert.match(dayNav, /href="#schedule"/);
  assert.match(dayNav, /href="#day-food"/);

  // 城市頁：吃哪指到城市頁自己的餐飲章節
  const city = read('city-krakow.html');
  const cityNav = city.match(/<nav class="mobile-quick-nav"[\s\S]*?<\/nav>/)?.[0];
  assert.match(cityNav, /href="#city-dining"/);

  // 快捷列在 </main> 之後、頁尾之前，不會被單檔版的 <main> 擷取邏輯收進去
  assert.match(home, /<\/main>\s*<nav class="mobile-quick-nav"/);

  // 今日頁本身要有可被快捷列指到的錨點目標
  const today = read('today.html');
  assert.match(today, /<details class="today-block" data-today-schedule>/);
  assert.match(today, /data-today-food/);

  // 手機底部固定列會蓋住頁尾，統一留出底部留白
  const source = css();
  assert.match(source, /\.journal-site\s*\{\s*padding-bottom:\s*calc\(4\.25rem \+ env\(safe-area-inset-bottom\)\);?\s*\}/);
});

test('M8：「資料更新儀表板」從主導覽「實用資訊」下拉移除，但頁面仍存在可連結', () => {
  const home = read('index.html');
  const navSection = home.match(/<details class="nav-dropdown[^>]*>\s*<summary[^>]*>實用資訊<\/summary>([\s\S]*?)<\/details>/)?.[1];
  assert.ok(navSection, '找不到實用資訊下拉區塊');
  assert.doesNotMatch(navSection, /資料更新儀表板/);
  // 頁面本身仍要 build 出來，只是不進主導覽
  assert.equal(fs.existsSync(path.join(distDir, 'practical/ops-dashboard.html')), true);
});
