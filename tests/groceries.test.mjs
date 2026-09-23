import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { groceryBranches, groceryProducts } from '../src/data/groceries.js';
import { cityRoutes } from '../src/lib/city-guide.mjs';
import { normalizeText } from '../src/search/site-search-index.mjs';

test('採買指南保留四城 12 個門市與二十四項商品，每筆都標出核到哪一層', () => {
  assert.equal(groceryBranches.length, 12);
  assert.equal(new Set(groceryBranches.map(b => b.id)).size, 12);
  assert.equal(groceryProducts.length, 24);
  for (const city of cityRoutes) assert.equal(groceryBranches.filter(b => b.cityKey === city.mapKey).length, 3);
  // 2026-09-22 逐店核對：Biedronka 四筆有官方逐日時間（verified），
  // Lidl 與 Żabka 八筆只核到地址（partial）。沒有任何一筆可以無來源地宣稱已核實。
  for (const b of groceryBranches) {
    assert.ok(['verified', 'partial'].includes(b.verificationStatus), `${b.id}: ${b.verificationStatus}`);
    assert.equal(b.verifiedAt, '2026-09-22', b.id);
    assert.match(b.sourceUrl, /^https:\/\/(www\.biedronka\.pl|www\.lidl\.pl|www\.zabka\.pl|cdn\.zabka\.pl)\//, `${b.id} 的來源必須是品牌官方網域`);
    if (b.verificationStatus === 'partial') assert.equal(b.hours, '待確認', `${b.id} 只核到地址就不能列出營業時間`);
  }
  assert.equal(groceryBranches.filter(b => b.chain === 'biedronka' && b.verificationStatus === 'verified').length, 4);
  assert.equal(groceryBranches.filter(b => b.verificationStatus === 'partial').length, 8);

  const html = fs.readFileSync('dist/practical/groceries.html', 'utf8');
  // 每一列都要帶自己的官方來源與核對狀態，不能整頁一句話帶過
  for (const b of groceryBranches) {
    assert.ok(html.includes(b.sourceUrl.replace(/&/g, '&amp;')), `${b.id} 缺官方來源連結`);
    assert.ok(html.includes(encodeURIComponent(`${b.name} ${b.address}`)));
  }
  assert.equal((html.match(/營業時間待確認/g) || []).length, 8);
  assert.equal((html.match(/官方門市頁已核對/g) || []).length, 4);
  // 座標仍未核實：地圖維持搜尋連結。改版後這句話從每列重複 12 次收成
  // 四個城市各一次，加上「資料來源與查核界線」一次，共 5 次；不能再少。
  assert.equal((html.match(/沒有取得任何一家的核實座標/g) || []).length, 5);
  assert.match(html, /2026\/10\/25/);
});

test('星期日判斷依官方日曆，且車站型門市的例外不被寫成保證', () => {
  const html = fs.readFileSync('dist/practical/groceries.html', 'utf8');
  // 2026 年十月沒有交易星期日，官方日曆列出的八天都不在十月
  assert.match(html, /1\/25、3\/29、4\/26、6\/28、8\/30、12\/6、12\/13、12\/20/);
  assert.doesNotMatch(html, /10\/25 是交易星期日/);
  // 華沙與波茲南車站型門市由官方標記星期日營業；語氣是「有機會」不是保證
  assert.match(html, /sklep czynny w niedzielę/);
  assert.match(html, /以門市當日公告為準/);
  const warsaw = groceryBranches.find(b => b.id === 'warsaw-1');
  const poznan = groceryBranches.find(b => b.id === 'poznan-1');
  assert.equal(warsaw.sundayOpen, true);
  assert.equal(poznan.sundayOpen, true);
  // 克拉科夫與樂斯拉夫的 Biedronka 官方頁星期日關門，不可標成營業
  assert.equal(groceryBranches.find(b => b.id === 'krakow-1').sundayOpen, false);
  assert.equal(groceryBranches.find(b => b.id === 'wroclaw-1').sundayOpen, false);
  // Żabka 依各店公告，不給 true/false
  for (const b of groceryBranches.filter(x => x.chain === 'zabka')) assert.equal(b.sundayOpen, null, b.id);
});

test('採買頁與四城雙向串接，商品與地址可透過共用搜尋索引找到', () => {
  const html = fs.readFileSync('dist/practical/groceries.html', 'utf8');
  for (const city of cityRoutes) {
    const cityHtml = fs.readFileSync(`dist/city-${city.fileKey}.html`, 'utf8');
    assert.ok(cityHtml.includes(`practical/groceries.html#${city.mapKey}`));
    assert.ok(html.includes(`id="${city.mapKey}"`));
    assert.ok(html.includes(`../city-${city.fileKey}.html`));
  }
  const records = JSON.parse(fs.readFileSync('dist/assets/search-index.json', 'utf8'));
  const record = records.find(r => r.href === 'practical/groceries.html');
  assert.ok(record);
  for (const word of [...groceryProducts.map(p => p.localName), ...groceryBranches.map(b => b.address)]) {
    assert.ok(record.searchText.includes(normalizeText(word)), word);
  }
});

test('離線單檔保留採買內容並正確改寫跨頁城市錨點', () => {
  const html = fs.readFileSync('poland-travel-guide-2026.html', 'utf8');
  assert.ok(html.includes('id="page-practical-groceries"'));
  assert.ok(html.includes('id="page-practical-groceries--warsaw"'));
  assert.ok(html.includes('href="#page-practical-groceries--warsaw"'));
  assert.ok(fs.readFileSync('dist/sw.js', 'utf8').includes('./practical/groceries.html'));
});

test('採買頁在手機不得橫向溢出，門市與商品都用卡片而不是被撐寬的表格', () => {
  const html = fs.readFileSync('dist/practical/groceries.html', 'utf8');
  // 這一頁曾因 .grocery-table 的 min-width: 42rem 在卡片模式沒解除，
  // 於 390px 視窗被撐到 696px，地址被切掉、整頁可左右拉。
  assert.doesNotMatch(html, /grocery-table/, '門市與商品不該再走會被撐寬的表格版面');
  assert.match(html, /class="grocery-branch-list"/);
  assert.match(html, /class="grocery-product-list"/);

  const css = fs.readFileSync('dist/assets/main.css', 'utf8');
  const cardMode = css.slice(css.indexOf('@media (max-width: 700px)'));
  assert.match(cardMode, /\.table-editorial \{\s*min-width: 0;?\s*\}/, '卡片模式必須解除桌機的 min-width');
  assert.match(cardMode, /\.table-editorial caption \{[^}]*display: block/, '卡片模式的 caption 必須 display:block，否則中文逐字直排');
});

test('星期日狀態每家店都標出來，三態各自對應資料而不是猜的', () => {
  const html = fs.readFileSync('dist/practical/groceries.html', 'utf8');
  assert.equal((html.match(/class="grocery-sunday"/g) || []).length, 12, '12 家都要有星期日標記');
  assert.equal((html.match(/data-sunday="open"/g) || []).length, 2, '只有兩家車站型 Biedronka 官方標示星期日營業');
  assert.equal((html.match(/data-sunday="closed"/g) || []).length, 6);
  // Żabka 四家沒查到，只能寫「依店公告」，不可以猜成營業或不營業
  assert.equal((html.match(/data-sunday="unknown"/g) || []).length, 4);
  assert.match(html, /星期日依店公告/);
});

test('採買推薦一項商品只出現一次，照片、理由與來源都留在同一張卡', () => {
  const html = fs.readFileSync('dist/practical/groceries.html', 'utf8');
  for (const product of groceryProducts) {
    assert.equal((html.match(new RegExp(`id="product-${product.rank}"`, 'g')) || []).length, 1, `product-${product.rank} 錨點重複`);
  }
  assert.equal((html.match(/class="grocery-product(?: is-priority)?" id="product-/g) || []).length, groceryProducts.length);
  // c378570 加入的照片、推薦理由與來源都必須還在，改版只換版面不砍內容
  assert.equal((html.match(/class="grocery-product-photo"/g) || []).length, groceryProducts.length);
  assert.equal((html.match(/class="grocery-product-reason"/g) || []).length, groceryProducts.length);
  assert.equal((html.match(/class="grocery-product-sources"/g) || []).length, groceryProducts.length);
  for (const product of groceryProducts) {
    for (const source of product.sources) assert.ok(html.includes(source.url), `缺來源連結 ${source.url}`);
    if (product.photo) assert.ok(html.includes(product.photo.src), `缺照片 ${product.photo.src}`);
  }
  // 2026 年文章推薦與歷年經典補充仍分成兩組
  assert.equal((html.match(/class="grocery-product-group"/g) || []).length, 5);
  assert.match(html, /2026 年文章推薦/);
  assert.match(html, /經典補充/);
  // 行李有限先挑的幾樣在卡片上就標出來
  assert.equal((html.match(/class="grocery-priority"/g) || []).length, groceryProducts.filter(p => p.priority).length);
});
