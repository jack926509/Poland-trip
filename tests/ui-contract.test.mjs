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

test('Drawer、交通 sheet、子頁與工具選單共用 modal 焦點循環', () => {
  assert.match(jsx, /function B_useModalFocus\(/);
  assert.match(jsx, /e\.key !== 'Tab'/);
  assert.match(jsx, /e\.shiftKey/);
  assert.match(jsx, /e\.preventDefault\(\)/);
  assert.match(jsx, /last\.focus\(\)/);
  assert.match(jsx, /first\.focus\(\)/);
  assert.doesNotMatch(jsx, /offsetParent/, '固定定位 modal 不可用 offsetParent 判斷可對焦項目');
  const uses = jsx.match(/B_useModalFocus\(/g) || [];
  assert.equal(uses.length, 5, '應定義一次並分別套用於 Drawer、交通 sheet、子頁與工具選單');
  assert.match(jsx, /ref={drawerRef}/);
  assert.match(jsx, /ref={trainSheetRef}/);
  assert.match(jsx, /B_useModalFocus\(toolsOpen,\s*toolsMenuRef,\s*toolsMenuCloseRef,\s*toolsBtnRef\)/);
});

test('子頁沿用既有 modal 焦點契約，Escape 可關且鎖背景滾動', () => {
  assert.match(jsx, /subpageReturnFocusRef/);
  assert.match(jsx, /B_useModalFocus\(\s*!!subpage/);
  assert.match(jsx, /e\.key === 'Escape' && subpage/);
  assert.match(jsx, /drawerOpen \|\| trainSheet \|\| subpage \|\| toolsOpen \? 'hidden' : ''/);
});

test('工具選單沿用既有 modal 焦點契約，Escape 可關且鎖背景滾動', () => {
  assert.match(jsx, /e\.key === 'Escape' && toolsOpen/);
  assert.match(jsx, /B_useModalFocus\(toolsOpen,\s*toolsMenuRef,\s*toolsMenuCloseRef,\s*toolsBtnRef\)/);
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

test('首頁 hero 依當天所在城市顯示對應照片，四城輪播已依規格裁定移除', () => {
  // 2026-07-26 規格衝突裁決：specs:73 原寫「四城輪播」，但輪播每 3.2 秒
  // 換城市牴觸規格自述的痛點「辨識不出今天在哪座城」，使用者裁定維持
  // 「依當天所在城市顯示對應照片」的現況，specs:73 的輪播描述作廢。
  // 這條測試把裁決後的行為釘死，取代舊版「四城輪播」測試。
  assert.match(jsx, /function B_Hero/);

  // hero 的城市由 B_focusCity(d.city) 在 t.cities 裡找出來（轉場日取目的地），
  // 不是寫死或輪播 index 挑出來的。
  assert.match(jsx, /const heroCityName = B_focusCity\(d\.city\);/);
  assert.match(jsx, /const heroCity = t\.cities\.find\(\(c\) => c\.name === heroCityName\) \|\| t\.cities\[0\];/);
  assert.match(jsx, /<B_Hero city=\{heroCity\} day=\{d\}\s*\/>/);
  assert.match(jsx, /<img src=\{city\.photo\.hero\}/);
  assert.match(jsx, /<h2 className="B-num">\{city\.name\}<\/h2>/);
  assert.match(jsx, /<p className="B-hero-sub">\{city\.pl\}/);

  // 舊版四城漸層輪播（Task 3）與其 setInterval／index state／
  // prefers-reduced-motion 判斷已整段移除，CSS 孤兒規則也一併清掉，
  // 不可死灰復燃。手機端唯一的自動播放動畫（.B-now 的 B-pulse）改由
  // redesign/tokens.css 的全域 reduced-motion 規則守住（見該檔測試）。
  assert.doesNotMatch(jsx, /hs-waw|hs-krk|hs-wro|hs-poz/);
  // 精準鎖定「已移除的那個 matchMedia 呼叫」，不是禁止提到這個詞——
  // 程式碼裡的說明註解可以講為什麼移除，PWA standalone 偵測也合法用
  // window.matchMedia，這裡只釘死 reduced-motion 那個呼叫式不能死灰復燃。
  assert.doesNotMatch(jsx, /matchMedia\([^)]*prefers-reduced-motion/);
  // 找「真的有這條規則」（class 名後面接 `{`），不是禁止在說明註解裡提到
  // 這幾個舊 class 名——移除說明本身就需要點名被刪的 class。
  assert.doesNotMatch(css, /\.B-hero-slide\s*\{/);
  assert.doesNotMatch(css, /\.B-hero-dots\s*\{/);
  assert.doesNotMatch(css, /\.B-hero-cap\s*\{/);
});

test('首頁選單有六個工具卡與可返回的子頁容器', () => {
  assert.match(jsx, /subpage/);
  assert.match(jsx, /setSubpage/);
  assert.match(jsx, /function B_Subpage/);
  for (const label of ['拍照清單', '匯率換算', '打包清單', 'SOS', '實用資訊', '行前指南']) {
    assert.match(jsx, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  assert.match(css, /\.B-tools-menu/);
  assert.match(css, /\.B-subpage/);
});

test('方案 A token 從根節點 cascade，避免只定義沒掛載', () => {
  // .B-companion（redesign/B-companion.css）是 --A-* token 的唯一定義處；
  // 沒有元素掛這個 class，token 全部解析成空字串，css 裡寫 var(--A-*) 只是文字，不會生效。
  assert.match(jsx, /<div className="B-frame paper-tex B-companion">/);
});

test('.B-frame 不再自設底色／文字色／字型，避免蓋掉同節點 .B-companion 的 A token', () => {
  // .B-frame 與 .B-companion 現在掛在同一個根節點，兩者都是單一 class 選擇器、
  // specificity 相同——CSS 平局時比檔案順序，寫在後面的 .B-frame 會贏，即使
  // .B-companion 的 --A-ground／--A-ink／--A-body 有正確 cascade，底色、文字色、
  // 字型也不會真的換成新值。三者統一交給 .B-companion 負責，.B-frame 規則區塊
  // 內不可再自設同名屬性。
  const start = css.indexOf('.B-frame{');
  assert.notEqual(start, -1, '.B-frame 規則區塊不存在');
  const end = css.indexOf('}', start);
  const block = css.slice(start, end);
  assert.doesNotMatch(block, /background:\s*var\(--paper\)/);
  assert.doesNotMatch(block, /color:\s*var\(--ink\)/);
  assert.doesNotMatch(block, /font-family:\s*var\(--body\)/);
  assert.match(css, /\.B-companion\s*\{[\s\S]*?background:\s*var\(--A-ground\)/);
  assert.match(css, /\.B-companion\s*\{[\s\S]*?color:\s*var\(--A-ink\);/);
  assert.match(css, /\.B-companion\s*\{[\s\S]*?font-family:\s*var\(--A-body\)/);
});

test('記帳子頁含總額、預算條、分類統計、新增與列表', () => {
  assert.match(jsx, /function B_Expense/);
  assert.match(jsx, /polska\.expenses\.v1/);
  assert.match(jsx, /新增記帳/);
  assert.match(jsx, /core\.expenseTotals|expenseTotals\(/);
  assert.match(jsx, /core\.budgetStatus|budgetStatus\(/);
  assert.match(css, /\.B-expense-hero/);
  assert.match(css, /\.B-expense-bar/);
  assert.match(css, /\.B-fab/);
});

test('記帳金額格式統一兩位小數且台幣加千分位', () => {
  assert.match(jsx, /toFixed\(2\)/);
  assert.match(jsx, /toLocaleString\('zh-TW'\)/);
});

// 下面每一則都釘住「真的 render 出來的 JSX 結構」，不是只釘中文字串——
// 字串出現在註解裡也會讓 regex 命中，這是前一位實作者兩次絆倒自己測試的原因。
// 每一則對應一個獨立交付物，並各自做過突變驗證（刪掉該段 render → 該則單獨 FAIL，
// 其餘不受影響），數字記錄在 task-11-report.md。

test('深咖啡主卡：總花費／進度條／預算列五個節點在同一個 .B-expense-hero 內真的 render', () => {
  assert.match(
    jsx,
    /<div className="B-expense-hero">[\s\S]*?<p className="B-expense-hero-kicker">總花費<\/p>[\s\S]*?<p className="B-expense-hero-amt B-num">\{totals\.totalPLN\.toFixed\(2\)\} <small>PLN<\/small><\/p>[\s\S]*?<p className="B-expense-hero-twd B-num">[\s\S]*?<div className="B-expense-bar">[\s\S]*?<p className="B-expense-hero-budget B-num">[\s\S]*?<\/div>/
  );
});

test('分類四宮格：.B-card-a.B-quad 內每格真的用 core.plnToTwd 換算並標示 NT$ 幣別', () => {
  assert.match(
    jsx,
    /<div className="B-card-a B-quad">[\s\S]*?core\.EXPENSE_CATEGORIES\.map[\s\S]*?<b>\{core\.plnToTwd\(totals\.byCategory\[c\.key\], settings\.fxRate\)\.toLocaleString\('zh-TW'\)\}<\/b>[\s\S]*?<span>\{c\.label\} NT\$<\/span>/
  );
});

test('退稅提示真的 render 到畫面（不是只活在 setHint 的字串常數裡）', () => {
  assert.match(jsx, /\{hint && <p className="B-expense-hint" role="status">\{hint\}<\/p>\}/);
  assert.match(jsx, /setHint\(`這筆可辦退稅[^`]*同一張收據[^`]*`\)/);
  assert.match(jsx, /setHint\(`距離退稅門檻還差[^`]*同一張收據[^`]*不同店家不能合併[^`]*`\)/);
});

test('可退稅彙總按鈕在篩選開啟時即使清單清空也留在畫面上可關閉（C1：不會篩選卡死）', () => {
  assert.match(jsx, /\{\(refund\.count > 0 \|\| onlyRefund\) && \(/);
  assert.doesNotMatch(jsx, /\{refund\.count > 0 && \(\s*\n\s*<button/); // 舊的卡死守衛不可再出現
  assert.match(jsx, /className=\{'B-pill-a' \+ \(onlyRefund \? ' is-active' : ''\)\}/);
  assert.match(jsx, /aria-pressed=\{onlyRefund\}/);
});

test('退稅彙總附近有常駐可見的「同一張收據」說明，不只是暫態提示', () => {
  assert.match(jsx, /<p className="B-expense-refund-note">[^<]*同一張收據[^<]*不可合併[^<]*<\/p>/);
});

test('明細列的可退稅標籤依每筆狀態真的 render', () => {
  assert.match(
    jsx,
    /core\.taxRefundStatus\(e\.amountPLN, e\.category\)\.state === 'eligible' && <em className="B-tag-refund">可退稅<\/em>/
  );
});

test('可退稅篩選套用在 Day 篩選結果之上，不會蓋掉 Day 篩選（I4）', () => {
  assert.match(
    jsx,
    /const visible = onlyRefund\s*\n\s*\? dayFiltered\.filter\(\(e\) => core\.taxRefundStatus\(e\.amountPLN, e\.category\)\.state === 'eligible'\)\s*\n\s*: dayFiltered;/
  );
  assert.doesNotMatch(jsx, /\? expenses\.filter\(\(e\) => core\.taxRefundStatus/);
});

test('超支狀態有非顏色的文字指示，不是只靠變色（I5）', () => {
  assert.match(jsx, /\{budget\.over && <p className="B-expense-over-tag">⚠ 已超支<\/p>\}/);
  assert.match(css, /\.B-expense-over-tag\s*\{[^}]*color:\s*var\(--A-signal-bright\)/);
  assert.match(css, /\.B-expense-bar i\.is-over\s*\{\s*background:\s*var\(--A-signal-bright\);?\s*\}/);
});

test('可退稅彙總按鈕不是全寬區塊，寬度自適應內容（I7）', () => {
  assert.match(css, /\.B-pill-a\s*\{[^}]*align-self:\s*flex-start/);
});

test('匯率換算與打包清單子頁存在且持久化', () => {
  assert.match(jsx, /function B_FxTool/);
  assert.match(jsx, /function B_Packing/);
  assert.match(jsx, /polska\.settings\.v1/);
  assert.match(jsx, /polska\.packing\.v1/);
  assert.match(css, /\.B-fx/);
  assert.match(css, /\.B-packing/);
});

test('首頁統計四宮格接記帳累計，舊版三格儀表已移除不留孤兒樣式', () => {
  // Task 10 收斂：新的 .B-quad 四宮格取代 Task 8 的舊版 .B-dash 三格，
  // 避免使用者在首頁同時看到兩組不同來源的統計數字。
  assert.match(jsx, /expenseTotals\(/);
  assert.match(jsx, /core\.budgetStatus\(/);
  assert.doesNotMatch(jsx, /B-dash/);
  assert.doesNotMatch(css, /\.B-dash/);
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

test('底部四分頁為 首頁/行程/交通/記帳，記帳在第一層', () => {
  assert.match(jsx, /\['home', ?'首頁'\]/);
  assert.match(jsx, /\['trip', ?'行程'\]/);
  assert.match(jsx, /\['move', ?'交通'\]/);
  assert.match(jsx, /\['money', ?'記帳'\]/);
  assert.doesNotMatch(jsx, /\['more', ?'更多'\]/);
  assert.match(jsx, /data-tabsection="money"/);
});

test('六個工具改由首頁右上選單進入，記帳不在選單內', () => {
  assert.match(jsx, /toolsOpen/);
  assert.match(jsx, /aria-label="更多工具"/);
  for (const label of ['拍照清單', '匯率換算', '打包清單', 'SOS 緊急卡', '實用資訊', '行前指南']) {
    assert.match(jsx, new RegExp(label));
  }
  assert.doesNotMatch(jsx, /\['expense', ?'旅行記帳'\]/);
  assert.match(css, /\.B-tools-menu/);
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

test('首頁 hero 用真實城市照，且四宮格與倒數就位', () => {
  assert.match(jsx, /photo\.hero/);
  assert.match(jsx, /loading="lazy"/);
  assert.match(jsx, /alt=\{/);
  assert.match(jsx, /core\.nextTrain\(/);
  assert.match(jsx, /core\.formatCountdown\(/);
  assert.match(css, /\.B-hero-photo/);
  assert.match(css, /linear-gradient\([^)]*rgba\(27, 25, 23/);
});

test('首頁統計四宮格與下一段交通卡真的 render，不是只算了值沒吐出來', () => {
  // 審查 F3：上一版測試只驗證 core.nextTrain(／core.formatCountdown( 等字串
  // 存在於檔案（B_Hero 或 nt 的 useMemo 本身就會命中），從沒斷言過 .B-quad
  // 或 .B-nextmove 真的被 render 出來——突變測試把整個四宮格 JSX 刪掉，
  // 124 個測試仍全線。這裡改成直接釘住四宮格與交通卡的實際 render 結構。

  // 四宮格：class 與四格內容（今天／白天／已花 NT$／預算）都要真的出現在 JSX 裡。
  assert.match(jsx, /className="B-card-a B-quad"/);
  assert.match(jsx, /\{momentDay \?\? d\.n\}\/8<\/b><span>今天<\/span>/);
  assert.match(jsx, /<span>白天<\/span>/);
  assert.match(jsx, /homeBudget\.spentTWD\.toLocaleString\('zh-TW'\)/);
  assert.match(jsx, /<span>已花 NT\$<\/span>/);
  assert.match(jsx, /Math\.round\(homeBudget\.ratio \* 100\)\}%<\/b><span>預算<\/span>/);
  assert.match(css, /\.B-quad\s*\{/);

  // 下一段交通卡：有車／沒車兩種分支都要真的 render，且沒車文案不能誤稱「今天」
  // （F1：nt 為 null 代表整趟行程已無下一段車，不是當天沒車，當天車可能剛開走）。
  assert.match(jsx, /\{nt && \(/);
  assert.match(jsx, /className="B-card-a B-nextmove"/);
  assert.match(jsx, /\{nt\.train\.seg\}/);
  assert.match(jsx, /core\.formatCountdown\(nt\.minutesUntil\)/);
  assert.match(jsx, /\{!nt && \(/);
  assert.match(jsx, /行程中已無下一段長途車/);
  assert.doesNotMatch(jsx, /今天沒有長途車/);
  assert.match(css, /\.B-nextmove-seg/);
});

// ============================================================
// Task 12：行程與交通分頁改版（Day 藥丸列、帶縮圖的時間軸列、長途車倒數）
// 每一則對應一個獨立交付物，各自做過突變驗證（刪掉該段 render → 該則單獨
// FAIL，其餘不受影響），數字記錄在 task-12-report.md。
// ============================================================

test('行程頁 Day 藥丸列改用 .B-scroll-x + .B-pill-a，且保留 tablist/tab 無障礙語意', () => {
  // brief 原本指錯頁面（誤把記帳頁的 .B-day-filter 當成行程頁的日次切換器）；
  // 行程頁真正的日次切換器是 .B-scrub（role="tablist"，內含 role="tab" 的 <a>）。
  assert.match(jsx, /<div className="B-scrub B-scroll-x" ref=\{scrubRef\} role="tablist" aria-label="日次切換" data-tabsection="trip">/);
  assert.match(jsx, /role="tab"/);
  assert.match(jsx, /aria-selected=\{x\.n === active\}/);
  assert.match(jsx, /aria-current=\{x\.n === active \? 'true' : undefined\}/);
  assert.match(jsx, /className=\{`B-pill-a \$\{x\.n === active \? 'is-active' : ''\} \$\{x\.n < active \? 'is-done' : ''\}`\}/);
  // 舊版 pill/active/done 三個裸字 class 不可再被 .B-scrub 的規則引用（新規則改掛在 .B-pill-a 上）。
  assert.doesNotMatch(css, /\.B-scrub \.pill\{/);
  assert.match(css, /\.B-scrub \.B-pill-a\{/);
  assert.match(css, /\.B-scrub \.B-pill-a\.is-done\{opacity:\.5\}/);
  // 自動捲動目前作用中 pill 的 querySelector 要跟著新 class 走，否則切換 Day 時捲動會失效。
  assert.match(jsx, /el\.querySelector\('\.B-pill-a\.is-active'\)/);
});

test('C2 修正：.B-scrub 內的 Day 藥丸必須 flex:none，否則 8 顆會被壓到 min-width 地板換行溢出', () => {
  // 舊規則 .B-scrub .pill 有 flex:none，改用 .B-pill-a 後漏補，導致 flex-shrink
  // 預設 1，藥丸被壓成 52px（「Day 1」的「1」擠到第二行、日期文字溢出內距）。
  // 對照組：記帳頁同一顆 .B-pill-a 在 .B-day-filter 底下已有 flex:none（見下一則測試）。
  const start = css.indexOf('.B-scrub .B-pill-a{');
  assert.notEqual(start, -1, '.B-scrub .B-pill-a 規則區塊不存在');
  const block = css.slice(start, css.indexOf('}', start) + 1);
  assert.match(block, /flex:\s*none/, '.B-scrub .B-pill-a 必須有 flex:none，否則會被壓扁到 min-width 地板');
});

test('I2 修正：.B-scrub 的 display:flex 必須有蓋過分頁 display:block 的 specificity 修法', () => {
  // 這是本 task 最有價值的發現（第 4 次 specificity 陷阱）：.B-scrub 同時是
  // role="tablist" 容器又掛 data-tabsection="trip"，會被既有的
  // .B-tabview[data-tab="trip"] [data-tabsection="trip"]{display:block}
  // （attribute+attribute，specificity 比單一 class 的 .B-scrub 高）蓋掉
  // flex 版面，導致 Day 藥丸整段換行、無法橫向捲動。build 綠燈、既有 regex
  // 測試都測不出來（只有 computed display 抓得到），刪掉這行不該讓測試還是全綠。
  assert.match(css, /\.B-tabview\[data-tab="trip"\]\s*\[data-tabsection="trip"\]\.B-scrub\{\s*display:\s*flex;?\s*\}/);
});

test('記帳頁 .B-day-filter 改用 B-pill-a token 化樣式，不再借用 --crimson 當選中態裝飾色', () => {
  assert.match(jsx, /className=\{`B-pill-a\$\{filterDay === 'all' \? ' is-active' : ''\}`\}/);
  assert.match(jsx, /className=\{`B-pill-a\$\{filterDay === d\.n \? ' is-active' : ''\}`\}/);
  const start = css.indexOf('.B-day-filter{');
  assert.notEqual(start, -1, '.B-day-filter 規則區塊不存在');
  const end = css.indexOf('.B-expense-list{');
  const block = css.slice(start, end);
  assert.doesNotMatch(block, /crimson/, '.B-day-filter 區塊不可再出現 --crimson（紅色只作訊號，不當選中態裝飾色）');
  assert.doesNotMatch(block, /var\(--paper\)/, '.B-day-filter 區塊不可再用舊版 --paper token');
  assert.match(block, /\.B-day-filter \.B-pill-a\{/);
  // 真正釘住的行為（取代 brief 原本的空斷言）：容器只能橫向捲動，不可縱向捲動。
  assert.match(block, /overflow-x:\s*auto/);
  assert.doesNotMatch(block, /overflow-y:\s*auto/);
});

test('時間軸列帶城市縮圖，既有展開/收合、筆記、訂票連結結構不變', () => {
  assert.match(jsx, /<img className="B-tl-thumb" src=\{thumbCity\.photo\.thumb\} alt="" loading="lazy" \/>/);
  // 縮圖不可寫死與檔案不符的 intrinsic 尺寸（四張縮圖實際比例 2.06:1～3.92:1
  // 各不相同，brief 原本的 width="200" height="150" 是假數字）。
  assert.doesNotMatch(jsx, /className="B-tl-thumb"[^>]*width=/);
  assert.doesNotMatch(jsx, /className="B-tl-thumb"[^>]*height=/);
  assert.match(css, /\.B-tl-thumb\{/);
  assert.match(css, /\.B-tl-thumb\{[^}]*aspect-ratio:\s*2\/1/);
  assert.match(css, /\.B-tl-thumb\{[^}]*object-fit:\s*cover/);
  // 縮圖必須加在既有 .B-step 結構裡（time/dot/thumb/label 同一個 grid row），
  // 不是整段換掉：openStep 展開收合、★ 重點、筆記 note-dot、訂票按鈕都要還在。
  const stepBlock = jsx.slice(jsx.indexOf('{d.steps.map((s, i) => {'), jsx.indexOf('{d.warn &&'));
  assert.match(stepBlock, /<span className="t">\{s\.t\}<\/span>/);
  assert.match(stepBlock, /<span className="dot"><\/span>/);
  assert.match(stepBlock, /<img className="B-tl-thumb"/);
  assert.match(stepBlock, /<span className="lab">/);
  assert.match(stepBlock, /setOpenStep\(open \? null : i\)/);
  assert.match(stepBlock, /myNote && <span className="note-dot"/);
  assert.match(stepBlock, /🎟 訂票 \/ 官網/);
  assert.match(stepBlock, /📍 地圖/);
});

test('C1/I4 修正輪：縮圖只在城市變換的那一列出現，不是整天貼同一張目的地照片', () => {
  // 每天第一列固定用「起始城市」（split('→')[0]，非轉場日等於 d.city 本身）。
  assert.match(jsx, /const dayStartCityName = \(d\.city \|\| ''\)\.split\('→'\)\[0\]\.trim\(\);/);
  assert.match(jsx, /const dayStartCity = t\.cities\.find\(\(c\) => c\.name === dayStartCityName\) \|\| null;/);
  // 城市變換的那一列 = 出發那一步（step.t 與 d.train.dep 字串相等）之後的下一步；
  // 找不到出發列、或當天沒有城市變換（無 d.train 或 city 不含「→」）時回 -1，
  // 不猜測。
  assert.match(jsx, /if \(!d\.train \|\| !d\.city\.includes\('→'\)\) return -1;/);
  assert.match(jsx, /const depIdx = d\.steps\.findIndex\(\(s\) => s\.t === d\.train\.dep\);/);
  assert.match(jsx, /if \(depIdx === -1\) return -1;/);
  assert.match(jsx, /return depIdx \+ 1 < d\.steps\.length \? depIdx \+ 1 : -1;/);
  // 每一列的縮圖城市 = 第一列用 dayStartCity，城市變換列用 cityChangeCity，其餘列 null（不顯示）。
  assert.match(jsx, /const thumbCity = i === 0 \? dayStartCity : \(i === cityChangeIdx \? cityChangeCity : null\);/);
  // 縮圖改成有條件才 render，不是每列都無條件輸出。
  assert.match(jsx, /\{thumbCity\?\.photo\?\.thumb && \(/);
  // 舊版「整天都用 heroCity（轉場日的目的地）當縮圖」的寫法不可再出現。
  assert.doesNotMatch(jsx, /src=\{heroCity\.photo\.thumb\}/);
});

test('交通頁列出全部五段長途車並各自帶倒數，已出發的段落不騙人', () => {
  assert.match(jsx, /const moveLegs = B_useMemo\(/);
  assert.match(jsx, /core\.trainCountdownState\(tr, Date\.now\(\), 2026\)/);
  // M2 修正：aria-label 掛在無 role 的 div 上，無障礙樹讀不到；改用 <section>
  // 讓它天生帶 role="region" 並被 aria-label 命名。
  assert.match(jsx, /<section className="B-move-list" data-tabsection="move" aria-label="長途交通總覽">/);
  assert.doesNotMatch(jsx, /<div className="B-move-list"/);
  assert.match(jsx, /\{moveLegs\.map\(\(\{ train: tr, state \}, i\) => \(/);
  assert.match(jsx, /<li className="B-move-row" key=\{i\}>/);
  assert.match(jsx, /\{state\.text\}/);
  assert.match(css, /\.B-move-row\{/);
  assert.match(css, /\.B-move-list ul\{/);
  // trainDepartureMs 只該在 pwa-core.js 的 trainCountdownState 內算一次；
  // JSX 端不可重蹈 brief 原稿的覆轍——同一運算式呼叫兩次、且把已開走的車
  // 傳 0 給 formatCountdown（會顯示騙人的「即將出發」）。
  assert.doesNotMatch(jsx, /core\.trainDepartureMs\(tr, 2026\) > Date\.now\(\)/);
  assert.doesNotMatch(jsx, /formatCountdown\(Math\.round\(\(core\.trainDepartureMs/);
});

test('長途車倒數紅字只在即將出發時觸發，預設中性色，首頁與交通頁共用同一套規則', () => {
  assert.match(css, /\.B-nextmove-count \{ margin: 6px 0 0; font-size: 12\.5px; color: var\(--A-ink-2\); \}/);
  assert.match(css, /\.B-nextmove-count\.is-soon \{ color: var\(--A-signal\); font-weight: 600; \}/);
  assert.match(css, /\.B-nextmove-count\.is-departed \{ color: var\(--A-ink-2\); \}/);
  assert.match(jsx, /className=\{`B-nextmove-count\$\{nt\.minutesUntil <= 60 \? ' is-soon' : ''\}`\}/);
  assert.match(jsx, /is-departed/);
});

test('--A-signal-bright 註解涵蓋文字與非文字用途，不再與 .B-expense-over-tag 的實際用法矛盾', () => {
  assert.match(css, /文字與非文字元素皆可用[\s\S]{0,300}--A-signal-bright:\s*#FF8C66/);
});
