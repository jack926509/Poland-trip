# 電影感捲動參考頁 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `reference/cinematic-scroll/` 建出一個與正式站完全隔離的電影感捲動參考頁，引擎逐值照抄來源規格，內容層換成波蘭行程資料，供使用者親眼判斷是否值得移植手法到正式站。

**Architecture:** 原生三檔（`index.html` / `styles.css` / `script.js`），無框架、無建置步驟。捲動靠 `position:sticky` 舞台 + 3700px 捲動軌，所有動畫由單一 `requestAnimationFrame` 迴圈寫入 CSS 自訂屬性驅動。**先用 Mostar 原文建到完全跑通，最後才置換波蘭內容**——如此若中文長字串撐破版面，問題會被隔離在最後一個 task，不會混進引擎除錯。

**Tech Stack:** 原生 HTML/CSS/JS ES2020；`node --test`（專案既有，無 package.json）；Playwright 1.62.1 僅供手動視覺驗證，裝在 repo 外的獨立目錄。

## 前置環境（一次性，已於 2026-08-01 實測成立）

專案**沒有** `package.json` 也沒有 `node_modules`，所以 `import 'playwright'` **會失敗**
（實測 `ERR_MODULE_NOT_FOUND`）。npx 快取中的版本要求 chromium-1232/1234，
與機器上既有的 chromium-1228 不相容，也不能依賴——npx 快取是雜湊命名的暫存目錄，隨時會被清掉。

因此驗證環境裝在 **repo 外**，不污染專案、不新增 `package.json`：

```bash
PW_DIR="$HOME/.cache/polska-verify"
mkdir -p "$PW_DIR"
(cd "$PW_DIR" && npm install --silent --no-fund --no-audit playwright@1.62.1)
PLAYWRIGHT_BROWSERS_PATH="$PW_DIR/browsers" "$PW_DIR/node_modules/.bin/playwright" install chromium
```

**已於 2026-08-01 實跑驗證**：安裝成功，chromium-1234 下載完成，
啟動與 `getComputedStyle` 讀取 CSS 變數皆正常。若目錄已存在可跳過。

爾後所有 Playwright 腳本一律以此環境執行：

```bash
PLAYWRIGHT_BROWSERS_PATH="$HOME/.cache/polska-verify/browsers" node <腳本>
```

## Global Constraints

以下每一條套用於**每一個** task，不再逐項重述：

- **權威來源**：所有數值以 `docs/superpowers/specs/2026-08-01-mostar-source-spec.md` 為準（以下簡稱「來源規格」）。範圍與波蘭置換規則以 `docs/superpowers/specs/2026-08-01-cinematic-scroll-reference-design.md` 為準（以下簡稱「設計文件」）。
- **逐值照抄**：數值、`.toFixed` 位數、z-index、DOM 來源順序、媒體查詢斷點一律照抄。照抄後視覺若怪，**保留結果並寫進回報**，不得自行修正。唯一允許偏離見設計文件 §3.5。
- **不得修改正式站檔案**：`index.html`、`mobile.html`、`desktop.html`、`styles.css`、`main.js`、`sw.js`、`manifest.json`、`sitemap.xml`、`robots.txt`、`prepare-site.sh`、`build.sh`、`redesign/**`、`desktop/**`。（`tests/deploy-contract.test.mjs` 是唯一例外，僅 Task 1 允許加一行。）
- **不得改 Service Worker 快取版本號。**
- **網路相依的驗證不得進 `verify.sh`**：`verify.sh` 在 CI 部署前執行（見 `tests/deploy-contract.test.mjs:10-13`），加入 25 MB 遠端資產下載會讓部署不穩。視覺驗證一律走獨立手動腳本。
- **中文規範**：一律繁體中文，**絕對禁止簡體字**；中文與英文／數字之間加半形空格（例：`8 天 4 城`）。
- **不得提交 secrets。**
- 分支：`feat/cinematic-scroll-reference`（已建立，spec 已提交）。每個 task 結束提交一次。

---

### Task 1: 骨架與部署隔離守門

先立護欄再蓋東西。這個 task 結束後，即使後續任何一步失手，正式站也不可能被污染。

**Files:**
- Create: `reference/cinematic-scroll/index.html`
- Create: `reference/cinematic-scroll/styles.css`
- Create: `reference/cinematic-scroll/script.js`
- Create: `reference/cinematic-scroll/screenshots/.gitignore`
- Create: `tests/reference-page.test.mjs`
- Modify: `tests/deploy-contract.test.mjs:43-47`（僅在 forbidden 陣列加 `'reference'`）

**Interfaces:**
- Consumes: 無（第一個 task）
- Produces: 三個空殼檔案的路徑，供 Task 2–5 填入；`tests/reference-page.test.mjs` 作為後續 task 追加離線契約測試的落腳處。

- [ ] **Step 1: 寫失敗測試**

建立 `tests/reference-page.test.mjs`：

```js
import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const BASE = 'reference/cinematic-scroll';

test('參考頁三個檔案存在', () => {
  for (const f of ['index.html', 'styles.css', 'script.js']) {
    assert.equal(fs.existsSync(`${BASE}/${f}`), true, `缺少 ${BASE}/${f}`);
  }
});

test('參考頁不引用正式站任何檔案', () => {
  const html = fs.readFileSync(`${BASE}/index.html`, 'utf8');
  for (const forbidden of [
    'redesign/', 'desktop/', 'pwa-register.js', 'sw.js', 'main.js', 'vendor/',
  ]) {
    assert.ok(!html.includes(forbidden), `參考頁不應引用 ${forbidden}`);
  }
});

test('參考頁全檔無簡體字（抽驗高頻字）', () => {
  for (const f of ['index.html', 'styles.css', 'script.js']) {
    const src = fs.readFileSync(`${BASE}/${f}`, 'utf8');
    for (const ch of ['单', '双', '这', '欢', '关', '开', '实', '语', '页', '边']) {
      assert.ok(!src.includes(ch), `${f} 含簡體字「${ch}」`);
    }
  }
});
```

- [ ] **Step 2: 執行測試確認失敗**

```bash
cd /Users/xieh/Desktop/技術開發/Poland-trip
node --test tests/reference-page.test.mjs
```

預期：FAIL，訊息為 `缺少 reference/cinematic-scroll/index.html`。

- [ ] **Step 3: 建立最小骨架**

```bash
mkdir -p reference/cinematic-scroll/screenshots
printf '*.png\n' > reference/cinematic-scroll/screenshots/.gitignore
```

`reference/cinematic-scroll/index.html`：

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Mostar city</title>
<meta name="description" content="A cinematic three-screen scroll story for Mostar city." />
<link rel="icon" href="data:," />
<link rel="stylesheet" href="styles.css" />
<script src="script.js" defer></script>
</head>
<body>
<main class="site-shell"></main>
</body>
</html>
```

`reference/cinematic-scroll/styles.css`：

```css
/* 電影感捲動參考頁 — 樣式
   數值權威來源：docs/superpowers/specs/2026-08-01-mostar-source-spec.md
   照抄規則：不得自行調整數值。 */
```

`reference/cinematic-scroll/script.js`：

```js
/* 電影感捲動參考頁 — 動畫引擎
   數值權威來源：docs/superpowers/specs/2026-08-01-mostar-source-spec.md §7 §8
   照抄規則：不得自行調整公式。 */
```

- [ ] **Step 4: 在部署禁令清單加入 reference**

修改 `tests/deploy-contract.test.mjs` 第 44 行的 forbidden 陣列，把 `'reference'` 加在 `'archive'` 之後：

```js
    for (const forbidden of [
      'archive', 'reference', 'tests', 'docs', '.github', '.superpowers', 'prepare-site.sh',
      'redesign/A-magazine.jsx', 'redesign/C-app.jsx', 'redesign/ios-frame.jsx',
      'redesign/dist/A-magazine.js', 'redesign/dist/C-app.js', 'redesign/dist/ios-frame.js',
    ]) assert.equal(fs.existsSync(path.join(output, forbidden)), false, `不應公開 ${forbidden}`);
```

- [ ] **Step 5: 執行完整驗收確認全綠**

```bash
./verify.sh
```

預期：最後一行輸出 `✅ POLSKA 單一 PWA 自動驗收完成`，且測試無 fail。
若 `git diff --check` 報空白字元錯誤，修掉再跑。

- [ ] **Step 6: 確認正式站零改動**

```bash
git status --short -- index.html mobile.html desktop.html styles.css main.js sw.js manifest.json prepare-site.sh
```

預期：**無任何輸出**（空）。有輸出即代表誤改，必須還原。

- [ ] **Step 7: 提交**

```bash
git add reference/ tests/reference-page.test.mjs tests/deploy-contract.test.mjs
git commit -m "feat(reference): 電影感捲動參考頁骨架與部署隔離守門

reference/ 加入 prepare-site 禁令清單，確保不進 Pages/Cloudflare 輸出。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: HTML DOM 結構（Mostar 原文）

**Files:**
- Modify: `reference/cinematic-scroll/index.html`
- Modify: `tests/reference-page.test.mjs`（追加結構契約測試）

**Interfaces:**
- Consumes: Task 1 建立的 `index.html` 骨架。
- Produces: 完整 DOM，供 Task 3 選取樣式、Task 4–5 選取節點。後續 task 依賴的 class 名稱：`.cinema-scroll`、`.stage`、`.world`、`.sky-img`、`.site-header`、`.site-logo`、`.site-nav`、`.language-switcher`、`.back-stack`、`.back-four`、`.back-bazaar`、`.sights-slider`、`.sights-track`、`.sight-card`、`.sight-kicker`、`.sight-pin`、`.sights-controls`、`.sight-nav`、`.sight-prev`、`.sight-next`、`.hero-title`、`.splitframe-left`、`.splitframe-right`、`.bridge-img`、`.frame-two-img`、`.shade`、`.intro-copy`、`.hero-tags`、`.story-panel`、`.story-panel-bridge`、`.story-panel-bazaar`、`.facts`、`.note-button`。

- [ ] **Step 1: 寫失敗測試**

在 `tests/reference-page.test.mjs` 末尾追加：

```js
test('DOM 來源順序與來源規格 §3 一致', () => {
  const html = fs.readFileSync(`${BASE}/index.html`, 'utf8');
  const order = [
    'class="scene-img sky-img"',
    'class="site-header"',
    'class="back-stack"',
    'class="scene-img back-img back-four"',
    'class="sights-slider"',
    'class="scene-img back-img back-bazaar"',
    'class="sights-controls"',
    'class="hero-title"',
    'class="scene-img splitframe-img splitframe-left"',
    'class="scene-img splitframe-img splitframe-right"',
    'class="scene-img bridge-img"',
    'class="scene-img frame-two-img"',
    'class="shade"',
    'class="intro-copy"',
    'story-panel-bridge',
    'story-panel-bazaar',
  ];
  let cursor = -1;
  for (const marker of order) {
    const at = html.indexOf(marker);
    assert.ok(at > cursor, `來源順序錯誤：${marker} 應在前一項之後`);
    cursor = at;
  }
});

test('五張景點卡，卡內元素順序為 kicker → pin → h3 → p', () => {
  const html = fs.readFileSync(`${BASE}/index.html`, 'utf8');
  const cards = [...html.matchAll(/<article class="sight-card"[\s\S]*?<\/article>/g)];
  assert.equal(cards.length, 5, '應有 5 張 .sight-card');
  for (const [card] of cards) {
    const k = card.indexOf('sight-kicker');
    const pin = card.indexOf('sight-pin');
    const h3 = card.indexOf('<h3');
    const p = card.indexOf('<p');
    assert.ok(k < pin && pin < h3 && h3 < p, `卡片內元素順序錯誤：${card.slice(0, 80)}`);
    assert.match(card, /tabindex="0"/);
    assert.match(card, /role="button"/);
  }
});

test('所有場景圖 alt 為空字串', () => {
  const html = fs.readFileSync(`${BASE}/index.html`, 'utf8');
  const imgs = [...html.matchAll(/<img class="scene-img[^>]*>/g)].map((m) => m[0]);
  assert.equal(imgs.length, 7, '應有 7 張 .scene-img');
  for (const img of imgs) assert.match(img, /alt=""/, `場景圖缺 alt=""：${img}`);
});

test('捲動軌與 sticky 舞台結構存在', () => {
  const html = fs.readFileSync(`${BASE}/index.html`, 'utf8');
  assert.match(html, /<section class="cinema-scroll" id="cinema"/);
  assert.match(html, /<div class="stage">/);
  assert.match(html, /<div class="world">/);
});
```

- [ ] **Step 2: 執行測試確認失敗**

```bash
node --test tests/reference-page.test.mjs
```

預期：FAIL，`來源順序錯誤：class="scene-img sky-img" 應在前一項之後`。

- [ ] **Step 3: 依來源規格 §3 寫出完整 DOM**

開啟 `docs/superpowers/specs/2026-08-01-mostar-source-spec.md`，依 §3 的樹狀圖與表格逐項寫入 `index.html` 的 `<main class="site-shell">` 內。

必須完全依照該節：
- 樹狀圖的**巢狀關係與來源順序**
- 七個場景圖各自對應 §1 表格的遠端 URL，全部 `alt=""`
- 五張 `.sight-card` 的 `aria-label` / kicker / h3 / p / pin 依 §3 表格
- `.intro-copy`、`.story-panel-bridge`、`.story-panel-bazaar` 三段文字依 §3 段落敘述
- 所有 `aria-label` 照抄

本 task **維持 Mostar 英文原文**，波蘭置換在 Task 7。

- [ ] **Step 4: 執行測試確認通過**

```bash
node --test tests/reference-page.test.mjs
```

預期：全部 PASS。

- [ ] **Step 5: 全套驗收與提交**

```bash
./verify.sh
git add reference/cinematic-scroll/index.html tests/reference-page.test.mjs
git commit -m "feat(reference): DOM 結構照抄來源規格 §3

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: CSS 全部樣式

**Files:**
- Modify: `reference/cinematic-scroll/styles.css`
- Modify: `tests/reference-page.test.mjs`（追加樣式契約測試）

**Interfaces:**
- Consumes: Task 2 的 class 名稱清單。
- Produces: 全部 CSS 自訂屬性（供 Task 4 的 JS 寫入）；`.is-jumping`、`.is-active`、`.is-ready` 三個狀態 class（供 Task 5 切換）。

- [ ] **Step 1: 寫失敗測試**

在 `tests/reference-page.test.mjs` 末尾追加：

```js
test(':root 自訂屬性初始值與來源規格 §4 一致', () => {
  const css = fs.readFileSync(`${BASE}/styles.css`, 'utf8');
  const expected = {
    '--back-scale': '0.76',
    '--four-y': '10vh',
    '--four-scale': '0.78',
    '--bazaar-y': '20vh',
    '--blur-tint': '74, 181, 224',
    '--bridge-bottom': '5vh',
    '--bridge-width': '67.2vw',
    '--bridge-scale': '1.02',
    '--frame2-scale': '1.06',
    '--sights-enter-x': '420vw',
    '--sights-visibility': 'hidden',
    '--ink': '#111411',
    '--paper': '#fdf1e1',
  };
  for (const [prop, value] of Object.entries(expected)) {
    const re = new RegExp(`${prop.replace(/-/g, '\\-')}\\s*:\\s*${value.replace(/[.()#]/g, '\\$&')}\\s*;`);
    assert.match(css, re, `${prop} 應為 ${value}`);
  }
});

test('捲動軌高度與 sticky 舞台照抄', () => {
  const css = fs.readFileSync(`${BASE}/styles.css`, 'utf8');
  assert.match(css, /height:\s*calc\(100vh \+ 3700px\)/, '捲動軌應為 100vh + 3700px');
  assert.match(css, /position:\s*sticky/);
  assert.match(css, /isolation:\s*isolate/);
});

test('輪播軌轉場曲線照抄', () => {
  const css = fs.readFileSync(`${BASE}/styles.css`, 'utf8');
  assert.match(css, /transform 640ms cubic-bezier\(0\.22,\s*1,\s*0\.36,\s*1\)/);
  assert.match(css, /\.is-jumping\s*\{[^}]*transition:\s*none/);
});

test('三個媒體查詢斷點齊備', () => {
  const css = fs.readFileSync(`${BASE}/styles.css`, 'utf8');
  for (const q of ['max-width: 1500px', 'max-width: 1100px', 'max-width: 640px']) {
    assert.ok(css.includes(`@media (${q})`), `缺少 @media (${q})`);
  }
  assert.ok(css.includes('prefers-reduced-motion: reduce'), '缺少 prefers-reduced-motion 區塊');
});
```

- [ ] **Step 2: 執行測試確認失敗**

```bash
node --test tests/reference-page.test.mjs
```

預期：FAIL，`--back-scale 應為 0.76`。

- [ ] **Step 3: 依來源規格 §4 §5 §6 寫出全部 CSS**

依序寫入 `styles.css`：

1. `@font-face` — family 名稱**必須**是 `"Ogg Medium"`，`src` 指向 §1 的 woff2 URL，加 `font-display: swap`：

```css
@font-face {
  font-family: "Ogg Medium";
  src: url("https://dcym8fthxf5uu.cloudfront.net/fonts/247a073c-29f5-4a89-aa3a-741020f346fc/OggText-Medium.woff2") format("woff2");
  font-weight: 500;
  font-display: swap;
}
```

2. `:root` — 照抄 §4 整個區塊，一字不改。
3. 全域規則 — 照抄 §4 末段（`*`、`html`、`body`、`button`、`.site-shell`）。
4. §5 全部定位規則 — 依 §5 各小節逐一寫出，含每個 z-index。
5. §6 三個媒體查詢與 `prefers-reduced-motion` — 整段照抄。

**注意**：§5 明列 `.sights-slider` 的 `opacity` 是**字面值 1**，不是 `var(--sights-opacity)`。照抄，勿「修正」。

- [ ] **Step 4: 執行測試確認通過**

```bash
node --test tests/reference-page.test.mjs
```

預期：全部 PASS。

- [ ] **Step 5: 靜態渲染目視確認**

```bash
python3 -m http.server 8765 >/dev/null 2>&1 &
sleep 2
PLAYWRIGHT_BROWSERS_PATH="$HOME/.cache/polska-verify/browsers" \
node --input-type=module -e "
const {chromium} = await import(process.env.HOME + '/.cache/polska-verify/node_modules/playwright/index.mjs');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:8765/reference/cinematic-scroll/', { waitUntil: 'networkidle', timeout: 120000 });
await p.screenshot({ path: 'reference/cinematic-scroll/screenshots/task3-static.png' });
await b.close();
"
kill %1
```

預期：截圖中可見天空、橋、`MOSTAR` 大標、intro 段落與三顆奶油色藥丸。
若整片空白，先查主控台與資產 404，不要往下做。

- [ ] **Step 6: 全套驗收與提交**

```bash
./verify.sh
git add reference/cinematic-scroll/styles.css tests/reference-page.test.mjs
git commit -m "feat(reference): 樣式照抄來源規格 §4 §5 §6

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: JS 動畫引擎

**Files:**
- Modify: `reference/cinematic-scroll/script.js`

**Interfaces:**
- Consumes: Task 2 的節點 class、Task 3 的 CSS 自訂屬性名稱。
- Produces: 供 Task 5 呼叫的 `requestTick()`（無參數、無回傳）；模組層變數 `sightCards`（`HTMLElement[]`）、`originalSightCount`（`number`）、`activeSight`（`number`）；Task 5 需在本檔內定義 `setupSightSlider()` 與 `updateSightSlider()`，本 task 先留呼叫點。

- [ ] **Step 1: 依來源規格 §7 寫出引擎**

`script.js` 全文結構如下（公式一律照 §7 抄）：

```js
/* 電影感捲動參考頁 — 動畫引擎
   數值權威來源：docs/superpowers/specs/2026-08-01-mostar-source-spec.md §7 §8
   照抄規則：不得自行調整公式。 */

const section = document.querySelector(".cinema-scroll");
const root = document.documentElement;
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
const track = document.querySelector(".sights-track");
const sightsControls = document.querySelector(".sights-controls");
const prevButton = document.querySelector(".sight-prev");
const nextButton = document.querySelector(".sight-next");

let targetMouseX = 0, targetMouseY = 0, mouseX = 0, mouseY = 0;
let targetScroll = 0, smoothScroll = 0;
let initialized = false, rafPending = false;
let sightCards = [...document.querySelectorAll(".sight-card")];
const originalSightCount = sightCards.length;
let activeSight = originalSightCount;

const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const smoothstep = (e0, e1, v) => {
  const x = clamp((v - e0) / (e1 - e0));
  return x * x * (3 - 2 * x);
};
const lerp = (a, b, t) => a + (b - a) * t;
const segmentInOut = (s, a, b, c, d) => {
  const enter = smoothstep(a, b, s);
  const exit = smoothstep(c, d, s);
  return { enter, exit, active: enter * (1 - exit) };
};
const getScrollDistance = () => clamp(
  -section.getBoundingClientRect().top,
  0,
  section.offsetHeight - window.innerHeight,
);
```

接著 `update()`：把 §7「Per-frame `update()`」整段中間變數照抄，再把「Variable writes」表格逐行寫成 `root.style.setProperty(...)`。

`--mx` / `--my` 依規格為 4 位小數：

```js
  root.style.setProperty("--mx", (reduceMotion.matches ? 0 : mouseX).toFixed(4));
  root.style.setProperty("--my", (reduceMotion.matches ? 0 : mouseY).toFixed(4));
```

其餘變數依表格原樣寫入（表格未標小數位者不加 `.toFixed`）。例如：

```js
  root.style.setProperty("--back-opacity", (1 - frame2.active * 0.06));
  root.style.setProperty("--back-x", `${mouseX * -12}px`);
  root.style.setProperty("--bridge-width", `${67.2 + frame2.enter * 37.8}vw`);
  root.style.setProperty("--sights-scale", 1 / backScale);
```

`update()` 結尾的續幀判斷：

```js
  rafPending = false;
  if (
    Math.abs(smoothScroll - targetScroll) > 0.08
    || Math.abs(mouseX - targetMouseX) > 0.001
    || Math.abs(mouseY - targetMouseY) > 0.001
  ) requestTick();
}

function requestTick() {
  if (rafPending) return;
  rafPending = true;
  requestAnimationFrame(update);
}
```

監聽器依 §7「Listeners」：

```js
window.addEventListener("scroll", requestTick, { passive: true });
window.addEventListener("resize", () => { updateSightSlider(); requestTick(); });
window.addEventListener("pointermove", (e) => {
  targetMouseX = e.clientX / window.innerWidth - 0.5;
  targetMouseY = e.clientY / window.innerHeight - 0.5;
  requestTick();
}, { passive: true });
prevButton.addEventListener("click", () => moveSightSlider(-1));
nextButton.addEventListener("click", () => moveSightSlider(1));

setupSightSlider();
requestTick();
```

`setupSightSlider` / `updateSightSlider` / `moveSightSlider` 於 Task 5 實作；本 task 先放最小可執行版本避免 ReferenceError：

```js
function setupSightSlider() {}
function updateSightSlider() {}
function moveSightSlider() {}
```

- [ ] **Step 2: 語法檢查**

```bash
node --check reference/cinematic-scroll/script.js
```

預期：無輸出（通過）。

- [ ] **Step 3: 實跑驗證公式（關鍵步驟）**

建立 `reference/cinematic-scroll/verify-visual.mjs`：

```js
// 手動視覺／公式驗證腳本。刻意不納入 verify.sh：
// 需下載約 25MB 遠端資產，放進 CI 會讓部署不穩。
//
// 用法（見計劃「前置環境」節）：
//   python3 -m http.server 8765 &
//   PLAYWRIGHT_BROWSERS_PATH="$HOME/.cache/polska-verify/browsers" \
//     node reference/cinematic-scroll/verify-visual.mjs
//
// playwright 裝在 repo 外，因為本專案無 package.json，裸 import 'playwright' 解析不到。
const PW = process.env.PLAYWRIGHT_PKG
  || `${process.env.HOME}/.cache/polska-verify/node_modules/playwright/index.mjs`;
const { chromium } = await import(PW);

const URL = 'http://localhost:8765/reference/cinematic-scroll/';
const OUT = 'reference/cinematic-scroll/screenshots';

const browser = await chromium.launch();
// reducedMotion 讓 smoothScroll 直接吸附到 targetScroll，值才可預測。
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'reduce',
});

const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

await page.goto(URL, { waitUntil: 'networkidle', timeout: 120000 });

const readVar = (name) => page.evaluate(
  (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim(),
  name,
);

const scrollTo = async (y) => {
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await page.waitForTimeout(400);
};

let failed = 0;
const check = (label, actual, expected) => {
  const ok = actual === expected;
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}  實得=${actual}  應為=${expected}`);
};

await scrollTo(0);
check('scrollY=0 --back-scale', await readVar('--back-scale'), '0.76');

await scrollTo(1620);
check('scrollY=1620 --bridge-width', await readVar('--bridge-width'), '105vw');

await scrollTo(3700);
check('scrollY=3700 --sights-visibility', await readVar('--sights-visibility'), 'visible');

check('reducedMotion --mx', await readVar('--mx'), '0.0000');
check('reducedMotion --my', await readVar('--my'), '0.0000');

for (const y of [0, 650, 1100, 1620, 2200, 2700, 3200, 3700]) {
  await scrollTo(y);
  await page.screenshot({ path: `${OUT}/scroll-${String(y).padStart(4, '0')}.png` });
}

const assets = await page.evaluate(() => performance
  .getEntriesByType('resource')
  .filter((r) => /\.(png|webp|woff2)$/.test(r.name))
  .map((r) => ({ name: r.name.split('/').pop(), size: r.transferSize + r.decodedBodySize })));
const empty = assets.filter((a) => a.size === 0);
console.log(`資產載入 ${assets.length} 項，零位元組 ${empty.length} 項`);
for (const a of empty) console.log(`FAIL  資產空白：${a.name}`);
failed += empty.length;

console.log(errors.length ? `FAIL  主控台 error ${errors.length} 則：${errors.join(' | ')}` : 'PASS  主控台無 error');
failed += errors.length ? 1 : 0;

await browser.close();
console.log(failed ? `\n❌ 失敗 ${failed} 項` : '\n✅ 全數通過');
process.exit(failed ? 1 : 0);
```

執行：

```bash
cd /Users/xieh/Desktop/技術開發/Poland-trip
python3 -m http.server 8765 >/dev/null 2>&1 &
sleep 2
PLAYWRIGHT_BROWSERS_PATH="$HOME/.cache/polska-verify/browsers" \
  node reference/cinematic-scroll/verify-visual.mjs; rc=$?
kill %1
exit $rc
```

預期：最後一行 `✅ 全數通過`。**貼出完整輸出。**
若 `--bridge-width` 不是 `105vw`，代表 §7 公式抄錯，回頭比對來源規格，不要調整期望值。

- [ ] **Step 4: 全套驗收與提交**

```bash
./verify.sh
git add reference/cinematic-scroll/script.js reference/cinematic-scroll/verify-visual.mjs
git commit -m "feat(reference): 動畫引擎照抄來源規格 §7

verify-visual.mjs 為手動驗證腳本，刻意不納入 verify.sh。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: 無限輪播

**Files:**
- Modify: `reference/cinematic-scroll/script.js`
- Modify: `reference/cinematic-scroll/verify-visual.mjs`（追加輪播互動驗證）

**Interfaces:**
- Consumes: Task 4 的 `sightCards`、`originalSightCount`、`activeSight`、`track`、`requestTick()`。
- Produces: `setupSightSlider()`、`updateSightSlider()`、`moveSightSlider(dir: number)`、`selectSightCard(card: HTMLElement)`、`jumpSightSlider(i: number)`、`normalizeSightSlider()`，全部無回傳值。

- [ ] **Step 1: 依來源規格 §8 取代 Task 4 的空函式**

```js
function setupSightSlider() {
  const originals = [...track.querySelectorAll(".sight-card")];
  const clones = [];
  for (let setIndex = 0; setIndex < 3; setIndex += 1) {
    originals.forEach((card, cardIndex) => {
      const clone = card.cloneNode(true);
      clone.dataset.sightIndex = String(setIndex * originalSightCount + cardIndex);
      clones.push(clone);
    });
  }
  track.replaceChildren(...clones);
  sightCards = clones;
  activeSight = originalSightCount;

  for (const card of sightCards) {
    card.addEventListener("click", () => selectSightCard(card));
    card.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      selectSightCard(card);
    });
  }
  track.addEventListener("transitionend", normalizeSightSlider);
  updateSightSlider();
}

function updateSightSlider() {
  if (!sightCards.length) return;
  const cardWidth = sightCards[0].offsetWidth;
  const gap = parseFloat(getComputedStyle(track).columnGap || "0");
  root.style.setProperty("--sights-shift", `${-(cardWidth + gap) * activeSight}px`);
  sightCards.forEach((card, i) => card.classList.toggle("is-active", i === activeSight));
}

function moveSightSlider(dir) {
  activeSight += dir;
  updateSightSlider();
}

function selectSightCard(card) {
  const i = Number(card.dataset.sightIndex);
  if (Number.isFinite(i)) activeSight = i;
  updateSightSlider();
}

function jumpSightSlider(i) {
  track.classList.add("is-jumping");
  activeSight = i;
  updateSightSlider();
  requestAnimationFrame(() => requestAnimationFrame(() => {
    track.classList.remove("is-jumping");
  }));
}

function normalizeSightSlider() {
  if (activeSight >= originalSightCount * 2) jumpSightSlider(activeSight - originalSightCount);
  else if (activeSight < originalSightCount) jumpSightSlider(activeSight + originalSightCount);
}
```

**注意**：`setupSightSlider` 內重新查詢 `track` 底下的原始卡片（而非沿用 Task 4 的 `sightCards`），因為 Task 4 的 `sightCards` 是 `document` 層級查詢，語意上等價但以 `track` 為界更安全。`originalSightCount` 在 Task 4 已於 clone 前計算完成，值為 5。

- [ ] **Step 2: 語法檢查**

```bash
node --check reference/cinematic-scroll/script.js
```

預期：無輸出。

- [ ] **Step 3: 追加輪播驗證**

在 `verify-visual.mjs` 的 `await browser.close();` 之前插入：

```js
await scrollTo(3700);
await page.waitForTimeout(600);

const cardCount = await page.locator('.sight-card').count();
check('clone 後卡片總數', String(cardCount), '15');

const shiftBefore = await readVar('--sights-shift');
for (let i = 0; i < 8; i += 1) {
  await page.locator('.sight-next').click({ force: true });
  await page.waitForTimeout(750);
}
const shiftAfterNext = await readVar('--sights-shift');
console.log(`按 → 8 次後 --sights-shift：${shiftBefore} → ${shiftAfterNext}`);

const idxAfterNext = await page.evaluate(() => {
  const el = document.querySelector('.sight-card.is-active');
  return el ? el.dataset.sightIndex : 'none';
});
const inMiddle = Number(idxAfterNext) >= 5 && Number(idxAfterNext) < 10;
console.log(`${inMiddle ? 'PASS' : 'FAIL'}  正規化後 activeSight 應回到中段 [5,10)，實得 ${idxAfterNext}`);
if (!inMiddle) failed++;

for (let i = 0; i < 8; i += 1) {
  await page.locator('.sight-prev').click({ force: true });
  await page.waitForTimeout(750);
}
const idxAfterPrev = await page.evaluate(() => {
  const el = document.querySelector('.sight-card.is-active');
  return el ? el.dataset.sightIndex : 'none';
});
const backInMiddle = Number(idxAfterPrev) >= 5 && Number(idxAfterPrev) < 10;
console.log(`${backInMiddle ? 'PASS' : 'FAIL'}  按 ← 8 次後仍在中段，實得 ${idxAfterPrev}`);
if (!backInMiddle) failed++;

await page.screenshot({ path: `${OUT}/slider-after-loop.png` });
```

- [ ] **Step 4: 執行驗證**

```bash
python3 -m http.server 8765 >/dev/null 2>&1 &
sleep 2
PLAYWRIGHT_BROWSERS_PATH="$HOME/.cache/polska-verify/browsers" \
  node reference/cinematic-scroll/verify-visual.mjs; rc=$?
kill %1
exit $rc
```

預期：`✅ 全數通過`，且 `clone 後卡片總數 實得=15`。**貼出完整輸出。**

- [ ] **Step 5: 目視確認無空白**

開啟 `reference/cinematic-scroll/screenshots/slider-after-loop.png`，確認畫面中卡片連續、無空白缺口。

- [ ] **Step 6: 全套驗收與提交**

```bash
./verify.sh
git add reference/cinematic-scroll/script.js reference/cinematic-scroll/verify-visual.mjs
git commit -m "feat(reference): 無限輪播照抄來源規格 §8

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 6: 波蘭內容層置換

引擎此時已完全跑通。本 task 只動文字與圖片來源，不動任何座標或公式。

**Files:**
- Modify: `reference/cinematic-scroll/index.html`
- Modify: `reference/cinematic-scroll/styles.css`（僅 `.sight-pin` 一條，設計文件 §3.5 允許的唯一偏離）
- Modify: `tests/reference-page.test.mjs`（追加內容契約測試）
- Read-only: `redesign/data.js`

**Interfaces:**
- Consumes: Task 2 的 DOM 結構、Task 3 的樣式。
- Produces: 最終內容。不新增任何函式或 class。

- [ ] **Step 1: 讀取行程資料，選定五個景點**

```bash
node -e "
const fs=require('fs');
global.window={};
eval(fs.readFileSync('redesign/data.js','utf8'));
const t=window.TRIP;
console.log('meta:', JSON.stringify(t.meta,null,1));
for(const d of t.days){
  console.log('Day'+d.n, d.city, '|', d.title);
  for(const s of (d.steps||[])) console.log('   ', s.label, '::', s.sub||'');
}
"
```

從輸出中挑五個**實際出現在行程裡**的景點。不得自行發明地名。
若某地點名稱過長（h3 為單行 `text-overflow:ellipsis`，`max-width: calc(100% - 76px)`），改用該地點的通用簡稱，仍須是行程中出現過的地方。

- [ ] **Step 2: 事實查核（強制）**

`story-panel-bridge` 的 `dl.facts` 有兩組 `dt`/`dd`（原為 `1566` / `2005`）。

**兩個選項，擇一：**

- **選項 A（安全，預設）**：改用 `redesign/data.js` 內 `meta` 已確定的數字，例如
  `dt 8` / `dd 天四城完整走完`、`dt 7` / `dd 晚住宿`。這些數字來自專案資料，無需外部查證。
- **選項 B**：若要用歷史年份（如 UNESCO 登錄年），**必須先用 WebSearch 查證並在提交訊息附上來源**。查不到就退回選項 A。

**禁止憑印象填年份。**

- [ ] **Step 3: 依設計文件 §3.3 表格逐項置換**

開啟 `docs/superpowers/specs/2026-08-01-cinematic-scroll-reference-design.md`，依 §3.3 表格的 12 項逐一置換，並遵守 §3.4 的文案撰寫規則：

- 地名只能取自 `data.js`
- kicker 2–4 字、h3 單行不超出、p 兩行內
- 語氣平實，不用行銷腔、不用驚嘆號
- 中英數字間半形空格

`frame-two-img` 的 `src` 改為相對路徑：

```html
<img class="scene-img frame-two-img" src="../../assets/photos/krakow-hero.webp" alt="" />
```

三個 `.sight-pin` 的 `src` 改為：

```
../../assets/photos/warszawa-thumb.webp
../../assets/photos/krakow-thumb.webp
../../assets/photos/wroclaw-thumb.webp
```

`<html lang>` 改為 `zh-Hant`（內容已是中文，維持 `en` 會讓螢幕閱讀器讀錯）。

- [ ] **Step 4: 加入唯一允許的樣式偏離**

在 `styles.css` 的 `.sight-pin` 規則末尾追加兩行並註記理由：

```css
.sight-pin {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 67.2px;
  height: 67.2px;
  pointer-events: none;
  /* 唯一允許偏離（設計文件 §3.5）：來源規格假設 pin 為正方去背圖，
     本專案 thumb 為矩形 webp，不加 object-fit 會被壓扁。 */
  object-fit: cover;
  border-radius: 12px;
}
```

- [ ] **Step 5: 寫內容契約測試**

在 `tests/reference-page.test.mjs` 末尾追加：

```js
test('內容層已換成波蘭，無波士尼亞殘留', () => {
  const html = fs.readFileSync(`${BASE}/index.html`, 'utf8');
  for (const term of [
    'Mostar', 'Stari Most', 'Kujundziluk', 'Neretva', 'Bosnia',
    'Koski', 'Kajtaz', 'Bazaar Street', 'Old Bridge',
  ]) {
    assert.ok(!html.includes(term), `不應殘留波士尼亞名詞「${term}」`);
  }
  assert.match(html, /POLSKA/, '大標應為 POLSKA');
  assert.match(html, /lang="zh-Hant"/, 'lang 應為 zh-Hant');
});

test('波蘭本地照片路徑正確且檔案存在', () => {
  const html = fs.readFileSync(`${BASE}/index.html`, 'utf8');
  const refs = [...html.matchAll(/\.\.\/\.\.\/assets\/photos\/[a-z-]+\.webp/g)].map((m) => m[0]);
  assert.equal(refs.length, 4, '應有 4 處本地照片引用（1 frame-two + 3 pin）');
  for (const r of refs) {
    const real = r.replace('../../', '');
    assert.ok(fs.existsSync(real), `缺檔案 ${real}`);
  }
});

test('中文與英文／數字之間有半形空格', () => {
  const html = fs.readFileSync(`${BASE}/index.html`, 'utf8');
  const text = html.replace(/<[^>]+>/g, ' ');
  const bad = [...text.matchAll(/[一-鿿][A-Za-z0-9]|[A-Za-z0-9][一-鿿]/g)];
  assert.equal(bad.length, 0, `中英文間缺半形空格：${bad.map((m) => m[0]).join('、')}`);
});

test('sight-pin 含必要的 object-fit 偏離', () => {
  const css = fs.readFileSync(`${BASE}/styles.css`, 'utf8');
  const rule = css.slice(css.indexOf('.sight-pin'), css.indexOf('.sight-pin') + 400);
  assert.match(rule, /object-fit:\s*cover/);
  assert.match(rule, /設計文件 §3\.5/, '偏離處須有理由註記');
});
```

- [ ] **Step 6: 執行測試確認通過**

```bash
node --test tests/reference-page.test.mjs
```

預期：全部 PASS。若「中英文間缺半形空格」失敗，修文案不要改測試。

- [ ] **Step 7: 實跑視覺驗證**

```bash
python3 -m http.server 8765 >/dev/null 2>&1 &
sleep 2
PLAYWRIGHT_BROWSERS_PATH="$HOME/.cache/polska-verify/browsers" \
  node reference/cinematic-scroll/verify-visual.mjs; rc=$?
kill %1
exit $rc
```

預期：`✅ 全數通過`。**貼出完整輸出。**

- [ ] **Step 8: 逐張檢查 8 點截圖**

開啟 `reference/cinematic-scroll/screenshots/scroll-*.png` 八張，對照設計文件 §5.2 表格逐項確認。
**特別檢查**：`scroll-3200.png` 與 `scroll-3700.png` 的卡片標題是否被 ellipsis 截斷。若被截斷，縮短該地名（不得改 CSS）。

- [ ] **Step 9: 全套驗收與提交**

```bash
./verify.sh
git add reference/cinematic-scroll/index.html reference/cinematic-scroll/styles.css tests/reference-page.test.mjs
git commit -m "feat(reference): 內容層置換為波蘭行程資料

地名取自 redesign/data.js 實際行程。frame-two 與 pin 改用本地 webp。
.sight-pin 加 object-fit:cover（設計文件 §3.5 允許的唯一偏離）。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 7: README 與最終交叉驗收

**Files:**
- Create: `reference/cinematic-scroll/README.md`

**Interfaces:**
- Consumes: 前六個 task 的全部產出。
- Produces: 使用者可讀的操作說明。無程式介面。

- [ ] **Step 1: 寫 README**

`reference/cinematic-scroll/README.md`：

```markdown
# 電影感捲動參考頁

這**不是**正式網站的一部分，是給你看效果、做決定用的參考素材。

## 怎麼開

在專案根目錄執行：

    python3 -m http.server 8765

然後瀏覽器開 http://localhost:8765/reference/cinematic-scroll/

慢慢往下捲，整段編排約 3700px。

## 這頁在幹嘛

- **內容**是你的波蘭行程（取自 `redesign/data.js`）。
- **場景圖**仍是波士尼亞 Mostar 的橋與市集。原因：那些是透明去背的分層插畫，
  整套視差深度靠透明邊緣疊出來；專案裡的旅遊照是矩形 webp，換進去會露出硬邊方框。

所以你在看的是**編排手法**，不是成品長相。

## 已知限制

1. **約 25–30 MB**，全走外部 CDN，第一次載入很慢。
2. **斷網即空白**。與正式站的離線能力相反——這正是不該把整套原樣搬上正式站的理由。
3. **遠端資產不受控**。場景圖來自第三方網站，對方改版即失效。
   2026-08-01 實測全部可用，但不保證未來。

## 驗證

第一次要先裝驗證環境（裝在專案外，不影響專案）：

    PW_DIR="$HOME/.cache/polska-verify"
    mkdir -p "$PW_DIR"
    (cd "$PW_DIR" && npm install playwright@1.62.1)
    PLAYWRIGHT_BROWSERS_PATH="$PW_DIR/browsers" "$PW_DIR/node_modules/.bin/playwright" install chromium

之後每次驗證：

    python3 -m http.server 8765 &
    PLAYWRIGHT_BROWSERS_PATH="$HOME/.cache/polska-verify/browsers" \
      node reference/cinematic-scroll/verify-visual.mjs
    kill %1

會輸出公式抽驗結果，並在 `screenshots/` 產出 8 張捲動截圖。
此腳本**刻意不納入** `verify.sh`——它需要下載遠端資產，放進 CI 會讓部署不穩。

## 與正式站的隔離

`prepare-site.sh` 採逐檔白名單複製，`reference/` 不在清單內。
`tests/deploy-contract.test.mjs` 有一條測試確保 `reference/` 不會出現在部署輸出中。
```

- [ ] **Step 2: 確認正式站零改動**

```bash
git diff --stat main -- index.html mobile.html desktop.html styles.css main.js sw.js manifest.json sitemap.xml robots.txt prepare-site.sh build.sh redesign/ desktop/
```

預期：**無任何輸出**。有輸出即為違規，必須還原。

- [ ] **Step 3: 確認部署隔離實際成立**

```bash
rm -rf /tmp/polska-deploy-check && mkdir -p /tmp/polska-deploy-check
./prepare-site.sh /tmp/polska-deploy-check
test ! -e /tmp/polska-deploy-check/reference && echo "PASS：reference 未進部署輸出" || echo "FAIL：reference 洩漏到部署輸出"
rm -rf /tmp/polska-deploy-check
```

預期：`PASS：reference 未進部署輸出`。

- [ ] **Step 4: 全套驗收**

```bash
./verify.sh
```

預期：`✅ POLSKA 單一 PWA 自動驗收完成`。**貼出完整輸出末段。**

- [ ] **Step 5: 提交**

```bash
git add reference/cinematic-scroll/README.md
git commit -m "docs(reference): 參考頁使用說明與已知限制

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

- [ ] **Step 6: 派 fresh-context agent 交叉驗收（不得自驗）**

依全域規則「驗證不自驗」，派一個全新 context 的 agent 執行設計文件 §5 的**全部**驗收條件（§5.1 到 §5.7），並回報每一項「通過／不通過」與證據行號。

委派 prompt 要點：
- 目標：獨立驗收 `reference/cinematic-scroll/` 是否符合 `docs/superpowers/specs/2026-08-01-cinematic-scroll-reference-design.md` §5 全部條件。
- 動機：這份產出要交給非工程師使用者做決策，實作者不得驗自己。
- 驗收：§5.1–§5.7 逐條回報，附 `檔案:行號`；截圖須實際開啟檢視，不得憑檔名推斷。
- 回報格式：結論 ≤10 行；不通過項目列具體問題與修法。

---

## Self-Review

**1. 規格覆蓋檢查**

| 設計文件章節 | 對應 task |
|---|---|
| §2.1 部署隔離 | Task 1 Step 4/6、Task 7 Step 2/3 |
| §3.1 逐值照抄引擎 | Task 2（DOM）、Task 3（CSS）、Task 4（JS 引擎）、Task 5（輪播） |
| §3.2 場景圖維持 Mostar | Task 2 Step 3（用來源 URL）、Task 6 僅換 frame-two |
| §3.3 波蘭內容 12 項 | Task 6 Step 3 |
| §3.4 文案規則 | Task 6 Step 1/3 |
| §3.5 唯一偏離 | Task 6 Step 4 |
| §3.6 配色不動 | 全案無任何 task 改配色 |
| §4 檔案結構 | Task 1 Step 3、Task 7 Step 1 |
| §5.1 部署隔離驗收 | Task 7 Step 2/3 |
| §5.2 八點截圖 | Task 4 Step 3（腳本）、Task 6 Step 8（檢視） |
| §5.3 公式抽驗 | Task 4 Step 3 |
| §5.4 資產載入 | Task 4 Step 3（腳本內 assets 檢查） |
| §5.5 輪播 | Task 5 Step 3/4 |
| §5.6 內容正確性 | Task 1 Step 1（簡體字）、Task 6 Step 5（無殘留、半形空格） |
| §5.7 事實查核 | Task 6 Step 2 |
| §6 已知限制 | Task 7 Step 1（寫進 README） |

無遺漏。

**2. 佔位符掃描**

已檢查：無 TBD／TODO／「稍後補上」／「類似 Task N」。所有測試皆附完整可執行程式碼。Task 6 Step 1/3 的文案內容刻意不預先寫死——因為地名必須從 `data.js` 實際讀取後才能決定，且已給出可機械檢查的約束（不得發明地名、長度限制、§5.6 測試把關），非佔位符。

**3. 型別／名稱一致性**

- `updateSightSlider()`：Task 4 在 resize 監聽器與 Task 5 定義處名稱一致。
- `requestTick()`：Task 4 定義，Task 4 監聽器與 `update()` 續幀處呼叫，名稱一致。
- `originalSightCount`：Task 4 宣告為 `const`（clone 前計算，值 5），Task 5 只讀不寫，一致。
- `sightCards`：Task 4 宣告為 `let`，Task 5 於 `setupSightSlider` 重新指派，一致。
- `activeSight`：Task 4 宣告為 `let` 初值 `originalSightCount`，Task 5 讀寫，一致。
- `failed` / `check()` / `readVar()` / `scrollTo()` / `OUT`：Task 4 Step 3 定義，Task 5 Step 3 追加程式碼沿用，名稱一致。
- CSS 狀態 class `.is-jumping` / `.is-active` / `.is-ready`：Task 3 定義樣式，Task 4（`is-ready`）與 Task 5（其餘兩個）切換，一致。
