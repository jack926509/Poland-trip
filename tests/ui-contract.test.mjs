import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const jsx = fs.readFileSync('redesign/B-companion.jsx', 'utf8');
const css = fs.readFileSync('redesign/B-companion.css', 'utf8');

test('build 只編譯正式 PWA 介面', () => {
  const build = fs.readFileSync('build.sh', 'utf8');
  assert.match(build, /redesign\/B-companion\.jsx/);
  assert.doesNotMatch(build, /A-magazine\.jsx|C-app\.jsx|ios-frame\.jsx|tweaks-panel\.jsx/);
});

test('行動版底部導覽為四個真分頁', () => {
  for (const label of ['首頁', '行程', '交通', '更多']) assert.match(jsx, new RegExp(label));
  assert.match(jsx, /B-mobile-nav/);
  assert.match(jsx, /B-desktop-nav/); // 桌機雙欄 nav 保留
  assert.match(jsx, /activeTab/);
  assert.match(jsx, /setActiveTab/);
  assert.match(css, /\.B-primary-nav button\.active/);
});

test('寬螢幕採雙欄網頁布局', () => {
  assert.match(jsx, /B-web-grid/);
  assert.match(jsx, /B-primary-column/);
  assert.match(jsx, /B-secondary-column/);
  assert.match(css, /@media \(min-width: 900px\)/);
  assert.match(css, /grid-template-columns:\s*minmax\(0,\s*1fr\)\s+minmax\(18rem,\s*24rem\)/);
});

test('不再使用隨機日期示範', () => {
  assert.doesNotMatch(jsx, /getDate\(\) % 8/);
  assert.match(jsx, /projectTripMoment/);
});

test('完整網頁資訊已整合回同一應用', () => {
  assert.match(jsx, /function B_PreTripGuide/);
  for (const key of ['trip.flights', 'trip.stay', 'trip.safety', 'trip.practical', 'trip.phrases']) {
    assert.match(jsx, new RegExp(key.replace('.', '\\.')));
  }
});

test('日期 UI 使用 Warsaw 旅程階段與核心分鐘數', () => {
  assert.match(jsx, /phase,\s*mins/);
  assert.match(jsx, /phase === 'before'\s*\?\s*'行程尚未開始 · 預覽'/);
  assert.match(jsx, /phase === 'after'\s*\?\s*'行程已結束 · 回顧'/);
  assert.match(jsx, /B_formatMinutes\(mins\)/);
  assert.match(jsx, /\- mins/);
  assert.doesNotMatch(jsx, /cur\.getHours\(\)|cur\.getMinutes\(\)|n\.getHours\(\)|n\.getMinutes\(\)/);
});

test('localStorage getter 拋出 SecurityError 時可降級', () => {
  assert.match(jsx, /function B_getStorage\(\)\s*{\s*try\s*{\s*return window\.localStorage;\s*}\s*catch/);
  assert.match(jsx, /core\.readNotes\(storage\)/);
  assert.match(jsx, /core\.writeNotes\(storage,\s*next\)/);
  assert.doesNotMatch(jsx, /core\.(?:readNotes|writeNotes)\(window\.localStorage/);
});

test('Drawer 只在開啟時可對焦並還原開啟者焦點', () => {
  assert.match(jsx, /drawerOpen\s*&&\s*\(/);
  assert.match(jsx, /drawerReturnFocusRef/);
  assert.match(jsx, /initialFocusRef\.current\?\.focus\(\)/);
  assert.match(jsx, /returnFocusRef\.current\?\.focus\(\)/);
  assert.match(jsx, /B_useModalFocus\(drawerOpen,\s*drawerRef,\s*drawerCloseRef,\s*drawerReturnFocusRef\)/);
  assert.match(jsx, /if \(e\.key === 'Escape' && drawerOpen\)/);
});

test('Drawer、交通 sheet 與子頁共用 modal 焦點循環', () => {
  assert.match(jsx, /function B_useModalFocus\(/);
  assert.match(jsx, /e\.key !== 'Tab'/);
  assert.match(jsx, /e\.shiftKey/);
  assert.match(jsx, /e\.preventDefault\(\)/);
  assert.match(jsx, /last\.focus\(\)/);
  assert.match(jsx, /first\.focus\(\)/);
  assert.doesNotMatch(jsx, /offsetParent/, '固定定位 modal 不可用 offsetParent 判斷可對焦項目');
  const uses = jsx.match(/B_useModalFocus\(/g) || [];
  assert.equal(uses.length, 4, '應定義一次並分別套用於 Drawer、交通 sheet 與子頁');
  assert.match(jsx, /ref={drawerRef}/);
  assert.match(jsx, /ref={trainSheetRef}/);
});

test('子頁沿用既有 modal 焦點契約，Escape 可關且鎖背景滾動', () => {
  assert.match(jsx, /subpageReturnFocusRef/);
  assert.match(jsx, /B_useModalFocus\(\s*!!subpage/);
  assert.match(jsx, /e\.key === 'Escape' && subpage/);
  assert.match(jsx, /drawerOpen \|\| trainSheet \|\| subpage \? 'hidden' : ''/);
});

test('交通卡使用獨立詳情按鈕且不建立巢狀互動元素', () => {
  const card = jsx.slice(jsx.indexOf('{d.train &&'), jsx.indexOf('{trainSheet &&'));
  assert.doesNotMatch(card, /role="button"|tabIndex=\{0\}|onKeyDown=/);
  assert.match(card, /<button[\s\S]*?開啟[\s\S]*?交通詳情[\s\S]*?<\/button>/);
  assert.match(card, /<a className="book-cta"/);
  assert.match(card, /<a className="stop"/);
});

test('交通 sheet 關閉按鈕依類型命名', () => {
  assert.match(jsx, /aria-label=\{`關閉\$\{isBus \? '巴士' : '火車'\}詳情`\}/);
});

test('硬時間只在旅程中查看當日時套用 Warsaw mins', () => {
  assert.match(jsx, /selectHardConstraintForMoment\(d\.hardConstraints,\s*phase,\s*d\.n,\s*momentDay,\s*mins\)/);
});

test('更新失敗會清除 React waiting worker 並隱藏更新按鈕', () => {
  assert.match(jsx, /const onUpdateError = \(\) => \{[\s\S]*?setWaitingWorker\(null\)/);
  assert.match(jsx, /waitingWorker && !updateFailed/);
});

test('卡片套用米紙底與金色點綴語彙', () => {
  assert.match(css, /--card-bg:\s*#fbf6ea|background:\s*#fbf6ea/);
  assert.match(css, /var\(--amber\)/); // 金色作為點綴出現
});

test('首頁 hero 為四城市輪播且尊重減量動畫', () => {
  assert.match(jsx, /function B_Hero/);
  assert.match(jsx, /華沙[\s\S]*克拉科夫[\s\S]*樂斯拉夫[\s\S]*波茲南/);
  assert.match(jsx, /prefers-reduced-motion/);
  assert.match(css, /\.B-hero-slide/);
  assert.match(css, /\.B-hero-dots/);
});

test('更多頁有六張工具卡與可返回的子頁容器', () => {
  assert.match(jsx, /subpage/);
  assert.match(jsx, /setSubpage/);
  assert.match(jsx, /function B_Subpage/);
  for (const label of ['旅行記帳', 'Photo Map', '匯率換算', '打包清單', 'SOS', '實用資訊']) {
    assert.match(jsx, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  assert.match(css, /\.B-tool-card/);
  assert.match(css, /\.B-subpage/);
});

test('記帳子頁含總額、預算條、分類統計、新增與列表', () => {
  assert.match(jsx, /function B_Expense/);
  assert.match(jsx, /polska\.expenses\.v1/);
  assert.match(jsx, /新增記帳/);
  assert.match(jsx, /core\.expenseTotals|expenseTotals\(/);
  assert.match(jsx, /core\.budgetStatus|budgetStatus\(/);
  assert.match(css, /\.B-expense-total/);
  assert.match(css, /\.B-budget-bar/);
  assert.match(css, /\.B-fab/);
});

test('匯率換算與打包清單子頁存在且持久化', () => {
  assert.match(jsx, /function B_FxTool/);
  assert.match(jsx, /function B_Packing/);
  assert.match(jsx, /polska\.settings\.v1/);
  assert.match(jsx, /polska\.packing\.v1/);
  assert.match(css, /\.B-fx/);
  assert.match(css, /\.B-packing/);
});

test('首頁三格儀表接記帳累計', () => {
  assert.match(jsx, /B-dash/);
  assert.match(jsx, /expenseTotals\(/);
});

test('SOS、實用資訊、Photo Map 子頁存在且接既有資料', () => {
  assert.match(jsx, /function B_Sos/);
  assert.match(jsx, /function B_Info/);
  assert.match(jsx, /function B_PhotoMap/);
  assert.match(jsx, /safety/);
  assert.match(jsx, /phrases/);
  assert.match(jsx, /polska\.photomap\.v1/);
  assert.match(css, /\.B-sos/);
  assert.match(css, /\.B-photomap/);
});

test('三個工具子頁接住 writeJSON 失敗並顯示警語', () => {
  assert.match(jsx, /const \[storeOk, setStoreOk\] = B_useState\(true\)/);
  assert.match(jsx, /setStoreOk\(core\.writeJSON\(storage, 'polska\.photomap\.v1'/);
  assert.match(jsx, /setStoreOk\(core\.writeJSON\(storage, 'polska\.settings\.v1'/);
  assert.match(jsx, /setStoreOk\(core\.writeJSON\(storage, 'polska\.packing\.v1'/);
  assert.match(css, /\.B-store-warn/);
  // 只驗 state 與 writeJSON 包裝不夠：使用者看得到的警語才是 M2 的核心，
  // 必須確認三個子頁都真的把警語 render 出來，不能只宣告 state 卻不顯示。
  const warnRenders = jsx.match(/\{!storeOk &&\s*<p className="B-store-warn">/g) || [];
  assert.equal(warnRenders.length, 3, 'B_PhotoMap／B_FxTool／B_Packing 三個子頁都要 render .B-store-warn 警語');
});

test('記帳表單驗證失敗顯示可讀錯誤而非靜默 return', () => {
  assert.match(jsx, /const \[formError, setFormError\] = B_useState\(''\)/);
  assert.match(jsx, /setFormError\('請填品項名稱'\)/);
  assert.match(jsx, /setFormError\('金額請填大於 0 的數字'\)/);
  assert.match(jsx, /role="alert"/);
  assert.match(css, /\.B-form-error/);
});

test('方案 A token 存在且不污染桌機 tokens.css', () => {
  assert.match(css, /--A-ground:\s*#F7F4EF/);
  assert.match(css, /--A-ink:\s*#1B1917/);
  assert.match(css, /--A-signal:\s*#B5502E/);
  assert.match(css, /--A-espresso:\s*#33261E/);
  assert.match(css, /font-variant-numeric:\s*lining-nums tabular-nums/);
  const tokens = fs.readFileSync('redesign/tokens.css', 'utf8');
  assert.doesNotMatch(tokens, /--A-/);
  assert.match(tokens, /--paper:\s*#f4ecd8/);  // 桌機色票未被動過
});

test('方案 A 對比度修正：ink-2／tag-book-fg 調色達 4.5:1，ink-3 改限非文字用途', () => {
  // ink-2 調深供正文使用（原 #7C736B 在 --A-ground 上僅 4.23:1，改後 4.83:1）
  assert.match(css, /--A-ink-2:\s*#736A61/);
  // tag-book-fg 調深供標籤文字使用（原 #C2653A 在 --A-tag-book-bg 上僅 3.53:1，改後 5.00:1）
  assert.match(css, /--A-tag-book-fg:\s*#9D522F/);
  // ink-3 保留原色碼，但註解須明白禁止再拿來當文字色，只能用於分隔線／hairline／邊框
  assert.match(css, /僅供非文字元素[\s\S]{0,400}--A-ink-3:\s*#8A8078/);
  // .B-quad span 不得再用 ink-3 當文字色，字級由 10.5px 提到 11px 並改用 ink-2
  assert.doesNotMatch(css, /color:\s*var\(--A-ink-3\)/);
  assert.match(css, /\.B-quad span\s*\{\s*font-size:\s*11px;\s*color:\s*var\(--A-ink-2\);/);
});
