// 手動視覺／公式驗證腳本。刻意不納入 verify.sh：
// 需連到第三方網站下載遠端資產（瀏覽器實際約 2.27 MB；若換算成未經 WebP
// 協商的原始 PNG 檔則約 32.3 MB，一般瀏覽不會下載到，僅供對照），
// 放進 CI 會讓部署不穩。
//
// 用法（見計劃「前置環境」節）：
//   python3 -m http.server 8765 &
//   PLAYWRIGHT_BROWSERS_PATH="$HOME/.cache/polska-verify/browsers" \
//     node reference/cinematic-scroll/verify-visual.mjs
//
// playwright 裝在 repo 外，因為本專案無 package.json，裸 import 'playwright' 解析不到。
import { fileURLToPath } from "node:url";
import { mkdirSync } from "node:fs";

const PW = process.env.PLAYWRIGHT_PKG
  || `${process.env.HOME}/.cache/polska-verify/node_modules/playwright/index.mjs`;
const { chromium } = await import(PW);

const PAGE_URL = "http://localhost:8765/reference/cinematic-scroll/";
// 用 import.meta.url 解析輸出目錄，讓截圖落點與執行時的 cwd 無關（原本的相對路徑
// 只有從 repo 根目錄執行才會落對位置，改法 1 修正）。
const OUT_DIR = fileURLToPath(new URL("./screenshots", import.meta.url));
mkdirSync(OUT_DIR, { recursive: true });

// 資產檢查改法（修正輪 1）：原本用 performance.getEntriesByType('resource') 的
// transferSize + decodedBodySize 判斷「是否載入」，但跨來源資產若缺
// Timing-Allow-Origin header，瀏覽器規格規定這些欄位一律回 0——這批遠端 CDN
// 全部沒有這個 header，所以舊寫法對它們必然回報「零位元組」、腳本永遠 exit 1。
// 改用 page.on('response') 直接收集真實 HTTP 狀態碼，才是「確認全部 HTTP 200」
// 的正確做法。
const responses = [];

const browser = await chromium.launch();
// reducedMotion 讓 smoothScroll 直接吸附到 targetScroll，值才可預測。
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});

page.on("response", (r) => responses.push({ url: r.url(), status: r.status() }));
const requestFailures = [];
page.on("requestfailed", (r) => requestFailures.push({
  url: r.url(),
  reason: r.failure()?.errorText || "unknown",
}));

const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });

await page.goto(PAGE_URL, { waitUntil: "networkidle", timeout: 120000 });

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
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}  實得=${actual}  應為=${expected}`);
};

await scrollTo(0);
check("scrollY=0 --back-scale", await readVar("--back-scale"), "0.76");

await scrollTo(1620);
check("scrollY=1620 --bridge-width", await readVar("--bridge-width"), "105vw");

await scrollTo(3700);
check("scrollY=3700 --sights-visibility", await readVar("--sights-visibility"), "visible");

check("reducedMotion --mx", await readVar("--mx"), "0.0000");
check("reducedMotion --my", await readVar("--my"), "0.0000");

for (const y of [0, 650, 1100, 1620, 2200, 2700, 3200, 3700]) {
  await scrollTo(y);
  await page.screenshot({ path: `${OUT_DIR}/scroll-${String(y).padStart(4, "0")}.png` });
}

// ===== 元素數量斷言（修正輪 2）：獨立於下面的逐 URL 資產檢查 =====
// 逐 URL 檢查只認得「現在 DOM 上有的 <img src>」，若某個 <img> 元素整個被刪掉
// （例如 Task 6 換圖時改錯、漏放一顆 pin），那個 URL 根本不會進清單，逐 URL
// 檢查會靜默通過——這裡用「預期元素個數」堵住這個洞。兩道檢查各擋一種問題、
// 都要過才算通過：這道擋「元素消失」，下面那道擋「路徑錯／HTTP 失敗」。
//
// 數字實際打開 docs/superpowers/specs/2026-08-01-mostar-source-spec.md §3 §8 點過，
// 不是憑印象：
//   - .scene-img 共 7 個：sky-img／back-four／back-bazaar／splitframe-left／
//     splitframe-right／bridge-img／frame-two-img（§3 DOM tree 逐行列出）。
//     .scene-img 不在 .sights-track 底下，不受 Task 5 的輪播 clone 影響，數字
//     維持 7 不變。
//   - .sight-pin 這裡寫 15，不是 5。原始卡片確實只有 5 張（§3「5 ×
//     article.sight-card」，每張卡固定 1 個 pin），但 Task 5 的
//     `setupSightSlider()` 在 script.js 隨頁面 `defer` 載入時就會同步跑
//     （已實測：`networkidle` 之前、DOMContentLoaded 當下 DOM 上已經是 15
//     張卡），把 3 組（3×5）clone 塞回 .sights-track、取代原始的 5 張。
//     這支腳本一律在頁面載入完成後才檢查 DOM，看到的永遠是 clone 後的狀態，
//     所以斷言要配合寫 15，不能寫 5——寫 5 反而會在正常情況下恆假。注意這是
//     DOM 元素個數，不是圖示種類數——5 張原始卡的 .sight-pin 縮圖依所屬城市
//     配對（warszawa／krakow×2／wroclaw／poznan），去重後是 4 種不同的 icon
//     URL，clone 後 15 張仍只用這 4 種，下面逐 URL 檢查那邊用 Set 去重後看到
//     的是 4 種 URL，兩個數字的定義不同，不能互相套用。
const EXPECTED_ELEMENT_COUNTS = {
  ".scene-img": 7,
  ".sight-pin": 15, // clone 後的結果，原始卡片只有 5 張
};
const actualElementCounts = await page.evaluate((selectors) => Object.fromEntries(
  selectors.map((s) => [s, document.querySelectorAll(s).length]),
), Object.keys(EXPECTED_ELEMENT_COUNTS));
for (const [selector, expectedCount] of Object.entries(EXPECTED_ELEMENT_COUNTS)) {
  const actualCount = actualElementCounts[selector];
  const ok = actualCount === expectedCount;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  元素數量 ${selector}  預期 ${expectedCount} 個、實際 ${actualCount} 個`);
}

// ===== 資產檢查：page.on('response') / requestfailed，判定「全部 HTTP 200」=====
//
// 具名白名單（僅此一個 URL，不是整類跨來源資產）：
// 來源規格 §1 指定的顯示字型 URL，其 CDN（dcym8fthxf5uu.cloudfront.net）對非其
// 網域來源一律不回 Access-Control-Allow-Origin，導致 @font-face 跨來源載入被
// 瀏覽器擋下（requestfailed net::ERR_FAILED）。這是規格指定的第三方資產本身
// 的限制，與本頁程式碼無關，故降級為警告、不計入失敗。若請求成功（例如未來
// 該 CDN 補上 CORS header）也視為正常，不影響通過與否。
const CORS_WHITELIST = new Set([
  "https://dcym8fthxf5uu.cloudfront.net/fonts/247a073c-29f5-4a89-aa3a-741020f346fc/OggText-Medium.woff2",
]);

// 預期資產＝目前 DOM 上實際渲染出的 <img src>，用 Set 去重成 URL 種類（涵蓋
// 場景圖，以及 5 個 sight-pin 元素去重後的 4 種 icon URL），加上規格
// 指定的遠端字型 URL。這裡只查 <img>；若未來改用 <picture>/<source> 提供多格
// 式圖片，要同步把查詢改成同時涵蓋 <source>，否則新增的資產會漏檢。
// 注意：這段只能擋「路徑錯／HTTP 失敗」，擋不了「元素整個消失」，後者由上面
// 的元素數量斷言負責。
const expectedImageUrls = await page.evaluate(() => [
  ...new Set([...document.querySelectorAll("img")].map((img) => img.src).filter(Boolean)),
]);
const FONT_URL = "https://dcym8fthxf5uu.cloudfront.net/fonts/247a073c-29f5-4a89-aa3a-741020f346fc/OggText-Medium.woff2";
const expectedAssetUrls = [...new Set([...expectedImageUrls, FONT_URL])];

const statusByUrl = new Map();
for (const r of responses) statusByUrl.set(r.url, r.status);
const failureByUrl = new Map();
for (const f of requestFailures) failureByUrl.set(f.url, f.reason);

const warnings = [];
let assetOk = 0;
for (const url of expectedAssetUrls) {
  const isWhitelisted = CORS_WHITELIST.has(url);
  const status = statusByUrl.get(url);
  const failureReason = failureByUrl.get(url);
  const name = url.split("/").pop();

  if (failureReason !== undefined) {
    if (isWhitelisted) {
      warnings.push(`WARN  資產請求失敗（已知白名單，不計入失敗）：${name}（${failureReason}）`);
    } else {
      failed++;
      console.log(`FAIL  資產請求失敗：${name}（${failureReason}）`);
    }
    continue;
  }
  if (status === undefined) {
    // 完全沒被請求到——不論是否在白名單，都是真的異常（例如元素被誤刪），不降級。
    failed++;
    console.log(`FAIL  資產未被請求：${name}`);
    continue;
  }
  if (status >= 400) {
    if (isWhitelisted) {
      warnings.push(`WARN  資產 HTTP ${status}（已知白名單，不計入失敗）：${name}`);
    } else {
      failed++;
      console.log(`FAIL  資產 HTTP ${status}：${name}`);
    }
    continue;
  }
  assetOk++;
}
console.log(`資產請求 ${expectedAssetUrls.length} 項，HTTP 正常 ${assetOk} 項`);
for (const w of warnings) console.log(w);

// 白名單資產（字型）請求失敗時，Chromium 通常會連帶印出一則含網址的 CORS 訊息，
// 以及一則不含網址的通用「Failed to load resource: net::ERR_FAILED」訊息。
// 用「可歸因額度」把這些訊息與白名單失敗筆數對應起來，只有超出額度、或與白名單
// 網址無關的錯誤才計入失敗，避免用檔名字串硬比對造成誤判或漏判。
let genericFailureBudget = requestFailures
  .filter((f) => CORS_WHITELIST.has(f.url)).length;
const nonFontErrors = errors.filter((e) => {
  const mentionsWhitelisted = [...CORS_WHITELIST].some((u) => e.includes(u));
  if (mentionsWhitelisted) return false;
  if (e.includes("Failed to load resource") && genericFailureBudget > 0) {
    genericFailureBudget--;
    return false;
  }
  return true;
});
failed += nonFontErrors.length ? 1 : 0;

// 判定邏輯不變（白名單以外的 error 一律計入失敗），但延後到 nonFontErrors
// 算完才印，且只印一則結論——避免先印一行誤導性的 FAIL、下一行才補 PASS，
// 讓非工程師誤以為壞了。
if (nonFontErrors.length) {
  console.log(`FAIL  主控台 error ${nonFontErrors.length} 則：${nonFontErrors.join(" | ")}`);
} else if (errors.length) {
  console.log("PASS  主控台 error 僅為白名單字型 CORS 訊息，不計入失敗");
} else {
  console.log("PASS  主控台無 error");
}

// ===== 輪播互動驗證（Task 5）=====
// 逐次記錄可見卡片，而非只憑「看起來正常」判定：讀 --sights-shift 位移量、
// 讀 .is-active 卡片的 data-sight-index，確認正規化把 activeSight 收回中段
// [originalSightCount, originalSightCount*2)，也就是 [5,10)。
//
// 這裡切回「無偏好」動態效果（實測驗證，不是憑印象）：本頁 newPage() 一開始
// 用 reducedMotion:"reduce" 是為了讓前面的 --mx/--my/--back-scale 等連續動畫
// 公式數值可預測（見檔案開頭註解）。但 styles.css §6 的
// `@media (prefers-reduced-motion: reduce) { ... .sights-track { transition:
// none } }` 是來源規格 §6 原文照抄（非本頁自創），會讓 .sights-track 的
// transitionDuration 變成 0s——`normalizeSightSlider()` 掛在 .sights-track 的
// `transitionend` 事件上（§8 原文），該事件在 transition:none 時永遠不會觸發。
// 實測過：沿用 reduce 情境連按 8 次 → 不會正規化，activeSight 線性累加到 13
// （超出 [5,10)）；切成 no-preference 後 transitionDuration 變回 0.64s，同樣
// 操作正確正規化到 8。這是測試環境的取捨（要嘛測「動畫公式在減少動態下的
// 數值」、要嘛測「無限輪播的正規化邏輯」，兩者互斥於同一個 reduced-motion
// 設定），不是 script.js 或 styles.css 的邏輯錯誤，也沒有更動 clone/正規化
// 演算法本身。前面所有依賴 reduce 的檢查都已跑完，這裡切換不影響它們。
await page.emulateMedia({ reducedMotion: "no-preference" });

await scrollTo(3700);
await page.waitForTimeout(600);

const cardCount = await page.locator(".sight-card").count();
check("clone 後卡片總數", String(cardCount), "15");

const shiftBefore = await readVar("--sights-shift");
for (let i = 0; i < 8; i += 1) {
  await page.locator(".sight-next").click({ force: true });
  await page.waitForTimeout(750);
}
const shiftAfterNext = await readVar("--sights-shift");
console.log(`按 → 8 次後 --sights-shift：${shiftBefore} → ${shiftAfterNext}`);

const idxAfterNext = await page.evaluate(() => {
  const el = document.querySelector(".sight-card.is-active");
  return el ? el.dataset.sightIndex : "none";
});
const inMiddle = Number(idxAfterNext) >= 5 && Number(idxAfterNext) < 10;
console.log(`${inMiddle ? "PASS" : "FAIL"}  正規化後 activeSight 應回到中段 [5,10)，實得 ${idxAfterNext}`);
if (!inMiddle) failed++;

for (let i = 0; i < 8; i += 1) {
  await page.locator(".sight-prev").click({ force: true });
  await page.waitForTimeout(750);
}
const idxAfterPrev = await page.evaluate(() => {
  const el = document.querySelector(".sight-card.is-active");
  return el ? el.dataset.sightIndex : "none";
});
const backInMiddle = Number(idxAfterPrev) >= 5 && Number(idxAfterPrev) < 10;
console.log(`${backInMiddle ? "PASS" : "FAIL"}  按 ← 8 次後仍在中段，實得 ${idxAfterPrev}`);
if (!backInMiddle) failed++;

await page.screenshot({ path: `${OUT_DIR}/slider-after-loop.png` });

await browser.close();
console.log(failed ? `\n❌ 失敗 ${failed} 項` : "\n✅ 全數通過");
process.exit(failed ? 1 : 0);
