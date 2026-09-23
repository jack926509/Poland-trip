import { renderProductPhoto, renderProductPhotoViewer } from './product-photos.mjs';
import { renderLayout } from './layout.mjs';
import { escapeHtml as e } from '../lib/html.mjs';
import { cityRoutes, daysInCity } from '../lib/city-guide.mjs';

const external = (url, label) => `<a href="${e(url)}" target="_blank" rel="noopener noreferrer">${e(label)} ↗</a>`;
const button = (url, label, aria) => `<a class="grocery-btn" href="${e(url)}" target="_blank" rel="noopener noreferrer"${aria ? ` aria-label="${e(aria)}"` : ''}>${e(label)} ↗</a>`;
const mapUrl = query => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

// 每一列自己說清楚核到哪一層：verified＝官方門市頁同時有地址與時間，
// partial＝地址已由官方來源確認、時間本輪拿不到。整份都寫「待核對」會讓
// 已經查過的四筆跟沒查過的混在一起，出門時反而不知道哪一筆可以信。
const statusLabel = branch => branch.verificationStatus === 'verified'
  ? `官方門市頁已核對（${branch.verifiedAt}）`
  : branch.verificationStatus === 'partial'
    ? `地址已核對（${branch.verifiedAt}）；營業時間待確認`
    : '待核對候選';

/**
 * 星期日狀態是這一頁最關鍵的判斷：波蘭多數星期日禁止一般商業，
 * 整趟又剛好卡到 10/25 這個非交易星期日。原本這件事寫在第三段小字裡，
 * 要讀完整段才知道這家到底開不開，所以抽成每張卡都有的狀態標記。
 * 三態分別對應資料的 true／false／null，沒查到就照實寫「依各店公告」。
 */
const SUNDAY_STATES = {
  open: { key: 'open', label: '星期日營業' },
  closed: { key: 'closed', label: '星期日不開' },
  unknown: { key: 'unknown', label: '星期日依店公告' },
};
const sundayState = branch => branch.sundayOpen === true ? SUNDAY_STATES.open
  : branch.sundayOpen === false ? SUNDAY_STATES.closed
    : SUNDAY_STATES.unknown;

const chainTag = chain => `<span class="grocery-chain-tag" data-chain="${e(chain.id)}">${e(chain.name)}</span>`;

function renderBranch(branch, chain) {
  const sunday = sundayState(branch);
  // 店名只在跟連鎖名不同時另外列出（例如 Żabka - Wars Sawa Junior），
  // 否則卡片會出現「Biedronka」上下連著印兩次。
  const ownName = branch.name === chain.name ? '' : `<p class="grocery-branch-name">${e(branch.name)}</p>`;
  return `<li class="grocery-branch" id="${e(branch.id)}" data-chain="${e(branch.chain)}">
      <div class="grocery-branch-head">${chainTag(chain)}<span class="grocery-sunday" data-sunday="${sunday.key}">${e(sunday.label)}</span></div>
      ${ownName}
      <p class="grocery-branch-address" lang="pl">${e(branch.address)}</p>
      <p class="grocery-branch-area">${e(branch.area)}</p>
      <p class="grocery-branch-hours"><span>營業時間</span><b>${e(branch.hours)}</b></p>
      <p class="grocery-branch-sunday-note">${e(branch.sundayNote)}</p>
      <p class="grocery-branch-use">${e(branch.note)}</p>
      <p class="grocery-branch-actions">${button(branch.sourceUrl, '官方門市資料', `在新視窗開啟 ${branch.name} ${branch.address} 的官方門市資料`)}${button(mapUrl(`${branch.name} ${branch.address}`), '地圖搜尋', `在新視窗以 Google Maps 搜尋 ${branch.name} ${branch.address}`)}</p>
      <p class="source-meta grocery-branch-status">${e(statusLabel(branch))}</p>
    </li>`;
}

/**
 * 商品卡：照片、推薦理由與來源都保留 2026-09-22 重新收錄的內容，一項商品一張卡。
 * 原本同一批商品在表格與 details 各列一次，商品名還互相連結；表格又因為
 * .grocery-table 的 min-width 在手機把整頁撐出視窗，照片欄讓它更擠。
 */
function renderProduct(product, pathPrefix) {
  const sources = product.sources.map(source =>
    `<li>${external(source.url, source.title)}<span class="grocery-source-meta">${e(source.date)} · ${e(source.kind)}</span></li>`).join('');
  // 版面（見 main.css 的 .grocery-product）：商品名跨欄置頂，縮圖在左、辨識資訊在右，
  // 照片圖說與 CC 授權收成卡片底下一行小字，細節收在一個 details 裡。
  // 原本照片滿版、圖說三行擺在名字與資訊之間，手機上一張卡平均 602px，
  // 24 項商品光這一節就 15,858px，佔整頁一半以上。
  // 圖說必須留在 <figure> 裡：放大視窗是從 link.closest('figure') 找署名複製過去的。
  return `<li class="grocery-product${product.priority ? ' is-priority' : ''}" id="product-${product.id}">
      <p class="grocery-product-head"><b lang="pl">${e(product.localName)}</b>${product.priority ? '<span class="grocery-priority">行李有限先挑</span>' : ''}</p>
      <div class="grocery-product-photo">${renderProductPhoto(product, pathPrefix)}</div>
      <div class="grocery-product-info">
        <p class="grocery-product-zh">${e(product.name)}　·　${e(product.use)}</p>
        <p class="grocery-product-pack"><span>包裝辨識</span>${e(product.packaging)}</p>
        <p class="grocery-product-reason">${e(product.reason)}</p>
      </div>
      <details class="grocery-product-more"><summary>怎麼認、什麼口味・推薦來源 ${product.sources.length} 筆</summary>
        <p>${e(product.note)}</p>
        <ul>${sources}</ul>
      </details>
    </li>`;
}

export function renderGroceries({ groceryChains, groceryBranches, groceryProducts }) {
  // 這一頁在 practical/ 底下；照片路徑與 renderLayout 用同一個值，不各寫一次。
  const pathPrefix = '../';
  const verifiedCount = groceryBranches.filter(b => b.verificationStatus === 'verified').length;
  const partialCount = groceryBranches.filter(b => b.verificationStatus === 'partial').length;

  // 只有三列三欄的對照表做成表格，在手機上會被拆成三張只有兩行字的卡片，
  // 反而比直接排三張卡更長。這裡改用卡片，連鎖的顏色 identity 也從這裡開始一致。
  const chains = `<ul class="grocery-chain-grid">${groceryChains.map(c => `<li class="grocery-chain-card" data-chain="${e(c.id)}">
      <p class="grocery-chain-head">${chainTag(c)}<span class="grocery-chain-kind">${e(c.kind)}</span></p>
      <p class="grocery-chain-buy">${e(c.buy)}</p>
      <p>${button(c.url, c.id === 'lidl' ? '官網 Sklepy Lidl' : '官方門市查詢', `在新視窗開啟 ${c.name} 的官方門市查詢`)}</p>
    </li>`).join('')}</ul>`;

  const cities = cityRoutes.map(city => {
    const branches = groceryBranches.filter(b => b.cityKey === city.mapKey);
    const rows = branches.map(b => renderBranch(b, groceryChains.find(c => c.id === b.chain))).join('');
    const days = daysInCity(city.mapKey).map(n => `<a href="../day-${String(n).padStart(2, '0')}.html">Day ${n}</a>`).join(' · ');
    const sundayOpen = branches.filter(b => b.sundayOpen === true);
    return `<section class="section" id="${city.mapKey}"><div class="section-heading"><span class="section-num">${e(city.localName)}</span><h2>${e(city.name)}${city.mapKey === 'wroclaw' ? '（弗羅茨瓦夫）' : ''}採買位置</h2></div>
      <p class="action-links"><a href="../city-${city.fileKey}.html">${e(city.name)}城市指南 →</a>${days}</p>
      <p class="grocery-city-lead">${sundayOpen.length
        ? `這三家的地址已於 2026-09-22 由品牌官方來源核對，其中 <a href="#${e(sundayOpen[0].id)}">${e(sundayOpen[0].name)} ${e(sundayOpen[0].address.split(',')[0])}</a> 星期日仍營業。`
        : '這三家的地址已於 2026-09-22 由品牌官方來源核對；星期日的營業狀態各不相同，看每張卡上的標記。'}出發前仍請重查營業時間。</p>
      <ul class="grocery-branch-list">${rows}</ul>
      <p class="source-meta grocery-city-foot">臨時要找別家：${groceryChains.map(c => external(mapUrl(`${c.name} ${city.localName}`), c.name)).join(' · ')}。以上地圖都是搜尋連結，本輪沒有取得任何一家的核實座標。</p>
    </section>`;
  }).join('');

  // 2026 年文章推薦與歷年經典補充分開，是 c378570 定下的資訊分界，保留。
  // 補到 24 項後全部攤開在手機上太長，改用城市頁餐飲分組的慣例（稽核 M4）：
  // 第一組預設展開，其餘收合並標數量；摘要列直接列出組內商品名，
  // 不打開也看得出要找的東西在不在裡面。行李有限先挑的五項有四項在第一組。
  const productGroup = (heading, note, items, open = false) => items.length ? `<details class="grocery-product-group"${open ? ' open' : ''}>
      <summary><h3 class="grocery-group-title">${e(heading)}<span class="grocery-group-count">${items.length} 項</span></h3><span class="grocery-group-names" lang="pl">${items.map(product => e(product.localName)).join('・')}</span></summary>
      <p class="source-meta">${e(note)}</p>
      <ol class="grocery-product-list">${items.map(product => renderProduct(product, pathPrefix)).join('')}</ol>
    </details>` : '';
  const is2026 = product => product.sources.some(source => source.kind === '2026 旅遊推薦');
  const products = productGroup('2026 年文章推薦', '來源為 2026 年的旅遊文章；推薦的是品牌或品類，不等於指定照片中的口味。', groceryProducts.filter(is2026), true)
    + productGroup('經典補充', '來源為歷年網友推薦或品牌商品資料，不是 2026 年新文。', groceryProducts.filter(product => !is2026(product) && !product.supplement))
    + productGroup('常溫選品補充', '依提供的採買清單補充，以品牌或零售商資料核對品項；不是人氣排行。是否可攜入台灣仍須依成分與入境規定確認。', groceryProducts.filter(product => product.supplement && !product.localOnly))
    + productGroup('當地喝・果汁飲料', '在飲料貨架或冷藏櫃找品牌；照片只代表一款口味，各分店是否供貨以現場為準。', groceryProducts.filter(product => product.drink))
    + productGroup('當地吃・冷藏甜點', '在超市冷藏櫃找品牌與品名，不保證特定連鎖或分店有貨。冷藏品依包裝保存，購買前先確認住宿冰箱。', groceryProducts.filter(product => product.localOnly && !product.drink));

  const content = `<header class="journal-appendix-header"><span class="section-num">Everyday shopping</span><h1>超市與便利商店</h1><p class="hero-dek">四城補給、零食試吃與最後一站伴手禮採買。先選城市找店，再拿波蘭文商品名對照貨架。</p></header>
    <p class="action-links"><a href="#chains">三大連鎖</a>${cityRoutes.map(c => `<a href="#${c.mapKey}">${e(c.name)}</a>`).join('')}<a href="#recommendations">採買推薦</a><a href="#quick-meals">早餐補給</a><a href="#strategy">採買路線</a><a href="#shopping-tips">採買提醒</a><a href="#sources">資料來源</a></p>
    <div class="callout-note"><b>門市地址已逐店核對（2026-09-22）：</b>12 筆候選地址全部由品牌官方來源確認，其中 ${verifiedCount} 筆（Biedronka）連逐日營業時間都取自官方門市頁，其餘 ${partialCount} 筆只核到地址，營業時間仍待確認。地圖按鈕仍是搜尋連結，不代表已核實的座標。營業時間、庫存與價格以門市當日資訊為準；Biedronka 官網也註明網頁上的時間僅供參考。</div>
    <section class="section" id="chains"><div class="section-heading"><span class="section-num">Chains</span><h2>三大連鎖怎麼選</h2></div>${chains}<h3>順路也可以逛</h3><ul class="check-list"><li><b>Carrefour：</b>有 Express、Market 與量販等不同店型，依順路門市選購；招牌名稱不能保證每家規模相同。${external('https://serwiskorporacyjny.carrefour.pl/en/about-us/our-sale-channels', '官方店型說明')} · ${external('https://www.carrefour.pl/sklepy', '門市查詢')}</li><li><b>Rossmann：</b>補日用品時也可看零食、巧克力區；各店選品不同。${external('https://www.rossmann.pl/szukaj?Search=slodycze', '官方甜食商品')}</li><li><b>Kaufland、Auchan、Netto：</b>可作附近採買的備選，先看交通距離、營業時間與當期商品，再決定是否值得繞路；本頁未新增這些品牌的逐店查核地址。</li></ul></section>
    ${cities}
    <section class="section" id="recommendations"><span id="top10" aria-hidden="true"></span><div class="section-heading"><span class="section-num">Shopping picks</span><h2>波蘭超市採買推薦</h2></div>
      <p>2026/09/22 重新收錄，2026/09/23 補充冷藏甜點、常溫選品、飲料與蜂蜜：依採買用途整理，不代表銷售或人氣排名。每項附品牌資料與查閱日期，照片下方另列影像來源。試吃評語未找到原始出處時明確標示。各店庫存與價格請以現場為準。</p>
      ${products}
      <p class="grocery-priority-foot"><b>行李有限的採買建議：</b>${groceryProducts.filter(p => p.priority).map(p => e(p.localName)).join('、')}；先試吃再決定數量。</p>
    </section>
    <section class="section" id="quick-meals"><div class="section-heading"><span class="section-num">Quick meals</span><h2>早餐與臨時補給</h2></div><ul class="check-list"><li><b>麵包區：</b>可找可頌或其他小份麵包，搭配飲品作早餐；現場品項、是否含餡及過敏原依店內標示。</li><li><b>Żabka 熱壓吐司（Tosty）與 Panini：</b>官方早餐資料列有火腿起司與雞肉培根吐司，也有不同款 Panini；趕車時可先看門市熱食櫃。${external('https://www.zabka.pl/sniadania-w-zabce-staly-sie-hitem/', 'Żabka 早餐介紹')}</li><li><b>Zapiekanka：</b>波蘭式焗烤長麵包，不等同於熱壓吐司；在提供 PROSTO z PIECA 熱食的門市確認是否有貨。${external('https://www.zabka.pl/zabka-menu/', 'Żabka 官方菜單與熱食門市查詢')}</li><li><b>咖啡（Kawa）：</b>官網列有黑咖啡、拿鐵等；是否由顧客自行操作咖啡機、實際價格及供應以現場為準，不保證每店都是自助。${external('https://www.zabka.pl/zabka-menu/', 'Żabka 咖啡菜單')}</li></ul></section>
    <section class="section" id="strategy"><div class="section-heading"><span class="section-num">Plan</span><h2>前段試吃，華沙補貨</h2></div><ol class="check-list"><li>克拉科夫與樂斯拉夫：巧克力、牛奶糖、威化餅先買小份試吃，記下喜歡的品牌與口味。</li><li>波茲南：補搭車零食與飲料，減少沿途搬運。</li><li>最後回到華沙（10/30–31）：集中買常溫伴手禮，優先找順路的 Biedronka；缺貨再看其他超市。確認行李空間與門市時間後再安排。巧克力避熱、餅乾防壓；托運額度依自己的機票確認。</li></ol><p><a href="shopping.html">更多伴手禮與購物店家 →</a></p></section>
    <section class="section" id="shopping-tips"><div class="section-heading"><span class="section-num">Before you shop</span><h2>星期日與食品採買提醒</h2></div><ul class="check-list"><li><b>Day 2（2026/10/25）是非交易星期日：</b>Biedronka 官方日曆列出 2026 年的交易星期日是 1/25、3/29、4/26、6/28、8/30、12/6、12/13、12/20，十月一天都沒有。一般門市這天不開，仍請先在前一天準備早餐與飲水。${external('https://www.biedronka.pl/pl/niedziele-handlowe', 'Biedronka 2026 官方日曆')}（2026/09/22 查閱）</li><li><b>兩家車站型 Biedronka 官方標示星期日照常營業：</b>華沙 <a href="#warsaw-1">Al. Jerozolimskie 54</a>（每日 05:00–01:00）與波茲南 <a href="#poznan-1">Dworcowa 2</a>（星期日 06:00–22:00）的官方門市頁都帶「sklep czynny w niedzielę」標記。Day 2 早上從華沙中央車站出發前仍有機會補早餐，但非交易星期日的實際開門以門市當日公告為準，不要當成唯一計畫。</li><li><b>克拉科夫與樂斯拉夫的 Biedronka 候選星期日不開：</b><a href="#krakow-1">Rynek Główny 34</a> 與 <a href="#wroclaw-1">Krawiecka 3a</a> 的官方門市頁星期日都是 Zamknięte，沒有車站型門市的例外標記。</li><li>Żabka 的星期日與夜間營業依各店公告，不能假設每家都開到深夜或 24 小時營業；本輪只核到四家 Żabka 的地址，時間一律待確認。</li><li>冷藏／冷凍 Pierogi、Żurek 與乳製品先確認保存條件；餃子、湯底不一定可以直接食用，住宿沒有加熱設備就改買可即食商品。</li><li>Kabanosy 與含肉食品安排在波蘭當地吃，不列為回台伴手禮；攜帶食品前請查閱<a href="essentials.html">安全與基本須知</a>中的官方入境資訊。</li><li>不想買含酒精甜食時，留意 Adwokat、likier 等字樣並核對成分。價牌可能附會員、多件或促銷條件，結帳前核對實際適用價格。自備購物袋，少量補給就近購買即可。</li></ul></section>
    <section class="section" id="sources"><div class="section-heading"><span class="section-num">Sources</span><h2>資料來源與查核界線</h2></div><p>門市候選沿用原採買指南；商品清單於 2026/09/22 依網路推薦重新收錄。Becca Daily 原文日期為 2026/07/02；Reddit 討論為 2025/07/29，明列為經典補充；English Wizards 頁面未標示發文日期，不據搜尋引擎收錄時間宣稱為 2026 新文。推薦理由為摘要與採買建議，並非票選結果。2026/09/23 依提供的採買清單補入 6 項常溫選品與 4 項冷藏甜點，另依指定新增 Jeżyki、Frugo、Kubuś、蜂蜜並補充 Żabka 熱食；查閱日期不代表文章發布日期，也不代表商品為波蘭原產。未找到『波蘭 Anna 推薦蜂蜜』原始內容，本站不將特定品牌歸因於她。</p><p><b>2026/09/22 逐店核對：</b>12 筆地址全部由品牌官方來源確認——4 家 Biedronka 取自官方逐店頁（含逐日營業時間）、4 家 Lidl 取自官方門市頁與官方門市清單 PDF、4 家 Żabka 取自官方門市清單 PDF 與 zabka.pl 的門市說明頁。Lidl 門市頁的營業時間由 JavaScript 載入、Żabka 不逐店公布，因此這 8 筆只核到地址。Biedronka 官網自己註明網頁上的營業時間僅供參考。</p><p><b>仍未核實的部分：</b>沒有取得任何一家的核實座標，地圖按鈕維持搜尋連結；庫存與價格一律以門市當日資訊為準。Żabka 的官方門市清單是 2024/02 版，只能證明當時該址有門市。出發前請用品牌官方查詢再確認；離線版不會即時更新。</p><p>逐筆來源與判讀記在原始碼庫的 <code>docs/research/2026-09-22-grocery-branch-verification.md</code>。</p></section>`;
  return renderLayout({ title: '超市與便利商店', activeNav: 'practical', bodyHtml: content + renderProductPhotoViewer(), pathPrefix, pageKind: 'practical', currentPage: 'practical/groceries.html',
    // 自動章節目錄在手機上是 11 列、609px 的清單，跟頁首的跳轉鈕列是同一份目的地。
    // 鈕列已補齊所有章節，目錄就不再重複放一次（今日卡頁同樣關掉）。
    chapterIndex: false });
}
