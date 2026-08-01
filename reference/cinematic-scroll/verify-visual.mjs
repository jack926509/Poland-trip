// 手動視覺／公式驗證腳本。刻意不納入 verify.sh：
// 需下載約 25 MB 遠端資產，放進 CI 會讓部署不穩。
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

// 預期資產＝目前 DOM 上實際渲染出的 <img src>（涵蓋 7 張遠端場景圖與 3 顆遠端
// pin icon；未來 Task 6 加入本地 webp 一樣會被 <img>/<source> 掃到，不用改本檔）
// 加上規格指定的遠端字型 URL。
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

console.log(errors.length ? `FAIL  主控台 error ${errors.length} 則：${errors.join(" | ")}` : "PASS  主控台無 error");
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
if (errors.length && !nonFontErrors.length) {
  console.log("PASS  主控台 error 僅為白名單字型 CORS 訊息，不計入失敗");
}

await browser.close();
console.log(failed ? `\n❌ 失敗 ${failed} 項` : "\n✅ 全數通過");
process.exit(failed ? 1 : 0);
