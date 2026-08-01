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
