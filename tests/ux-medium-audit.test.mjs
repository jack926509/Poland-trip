// UX 稽核中嚴重度 M1–M11 修正驗證。
// 每個 test 對應稽核報告一個編號，方便回溯改動與原始問題。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const read = relativePath => fs.readFileSync(path.join(distDir, relativePath), 'utf8');
const css = () => fs.readFileSync(path.join(distDir, 'assets/main.css'), 'utf8');

test('M10：全程動線併入八日目錄，「無待訂」是標籤而非獨立連結，且每列帶今晚住宿與強度', () => {
  const home = read('index.html');
  // 2026-10-13 起首頁不再另放一張全程動線表；錨點 #journey-overview 移到八日目錄。
  assert.equal((home.match(/id="journey-overview"/g) || []).length, 1);
  assert.match(home, /<ol class="journal-itinerary" id="journey-overview">/);
  assert.match(home, /<span class="tag-muted">無待訂<\/span>/);
  assert.doesNotMatch(home, /<a[^>]*>無待訂[^<]*<\/a>/);
  assert.match(home, /<span class="tag-todo">待訂 \d+<\/span>/);
  assert.equal((home.match(/class="journal-day-stay"/g) || []).length, 8);
  assert.match(home, /今晚 華沙 · Hotel Metropol/);
  assert.match(home, /離境／機上過夜/);
});

test('M11：今日頁標題上方顯示 TODAY 而非 APPENDIX，實用頁維持原樣', () => {
  const source = css();
  assert.match(source, /\.journal-today \.journal-appendix-header::before \{\s*content:\s*'TODAY';\s*\}/);
  // 今日頁 body class 是 journal-today，實用頁是 journal-practical，
  // CSS 用 class 範圍區分，不需要各自模板改動。
  const today = read('today.html');
  const essentials = read('practical/essentials.html');
  assert.match(today, /<body class="journal-site journal-today">/);
  assert.match(essentials, /<body class="journal-site journal-practical">/);
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
  // UX 1017 H2：日頁改成 26px 數字圖釘（直徑 26px ≥ 原本 radius 12 的 24px），城市頁仍是 radius 12 圓點。
  assert.match(day, /iconSize: number \? \[26, 26\]/, '日頁地圖數字圖釘未維持 26px');
  const city = read('city-krakow.html');
  assert.match(city, /radius:\s*12,/, '城市頁地圖圖釘未放大');
  assert.doesNotMatch(day + city, /radius:\s*8,/, '仍殘留舊的 radius: 8');
});

test('M9：首頁待辦分類只留計數＋連結，逐項名稱不再與待辦頁重複；nav-today 手機字級提高', () => {
  const home = read('index.html');
  // 4 個分類（2026-10-07 取消牛角麵包博物館後剩 3 類；2026-10-14 新增「出發前準備」）都是 <a class="card card-link"> 摘要卡，不再逐項列出
  const todosSection = home.slice(home.indexOf('id="todos"'), home.indexOf('</section>', home.indexOf('id="todos"')));
  assert.equal((todosSection.match(/class="card card-link"/g) || []).length, 4, '待辦分類卡片數不對');
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

  for (const file of ['index.html', 'city-krakow.html', 'practical/essentials.html']) {
    const html = read(file);
    // 內嵌 script 應該是空的，索引改成外部 URL
    assert.match(html, /<script type="application\/json" data-site-search-index><\/script>/, `${file} 仍內嵌搜尋索引`);
    assert.match(html, /data-search-index-url="[^"]*assets\/search-index\.json"/, `${file} 缺少外部索引 URL`);
    // 預算是用來抓「又把 526KB 索引內嵌回來」；城市頁本身內容已長到 99.9KB，
    // 2026-10-15 加上字級切換的 <head> 內嵌腳本後一度放寬到 110KB；同日把城市頁地圖
    // 腳本裡的註解移出輸出，壓回 100KB（102,400 bytes）以內，預算恢復原值。
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

test('M2：手機底部快捷列在各類頁面都輸出，且連結依頁面類型指向對的錨點', () => {
  // 首頁（非日／城市頁）：時間表與吃哪都導回今日頁對應區塊
  const home = read('index.html');
  const homeNav = home.match(/<nav class="mobile-quick-nav"[\s\S]*?<\/nav>/)?.[0];
  assert.ok(homeNav, '首頁缺少手機快捷列');
  assert.match(homeNav, /href="today\.html"/);
  assert.match(homeNav, /href="today\.html#today-schedule"/);
  assert.match(homeNav, /href="today\.html#today-food"/);
  assert.match(homeNav, /href="practical\/essentials\.html#sos-contacts"/);

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
  assert.match(today, /<details class="today-block[^"]*" data-today-schedule>/);
  assert.match(today, /data-today-food/);

  // 手機底部固定列會蓋住頁尾，統一留出底部留白
  const source = css();
  assert.match(source, /\.journal-site\s*\{\s*padding-bottom:\s*calc\(4\.25rem \+ env\(safe-area-inset-bottom\)\);?\s*\}/);
});
