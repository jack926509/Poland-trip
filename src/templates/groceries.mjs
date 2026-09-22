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

function renderProduct(product, chains) {
  const marks = product.availability.map((mark, index) => {
    const chain = chains[index];
    return `<li data-chain="${e(chain.id)}"><span>${e(chain.name)}</span><b data-mark="${e(mark)}">${e(mark)}</b></li>`;
  }).join('');
  return `<li class="grocery-product${product.priority ? ' is-priority' : ''}" id="product-${product.rank}">
      <p class="grocery-product-head"><span class="grocery-rank">${product.rank}</span><b lang="pl">${e(product.localName)}</b>${product.priority ? '<span class="grocery-priority">行李有限先挑</span>' : ''}</p>
      <p class="grocery-product-zh">${e(product.name)}　·　${e(product.use)}</p>
      <p class="grocery-product-pack"><span>包裝辨識</span>${e(product.packaging)}</p>
      <ul class="grocery-availability">${marks}</ul>
      <details class="grocery-product-note"><summary>怎麼認、什麼口味</summary><p>${e(product.note)}</p></details>
    </li>`;
}

export function renderGroceries({ groceryChains, groceryBranches, groceryProducts }) {
  const verifiedCount = groceryBranches.filter(b => b.verificationStatus === 'verified').length;
  const partialCount = groceryBranches.filter(b => b.verificationStatus === 'partial').length;

  // 只有三列三欄的對照表做成表格，在手機上會被拆成三張只有兩行字的卡片，
  // 反而比直接排三張卡更長。這裡改用卡片，順便讓連鎖的顏色identity從這裡開始一致。
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

  // 原本同一批商品出現兩次：上面一張 5 欄表格、下面再一份 details 清單，
  // 手機上光這一節就 4,490px。合併成一張卡一項商品，通路符號排成一行。
  const products = `<ol class="grocery-product-list">${groceryProducts.map(p => renderProduct(p, groceryChains)).join('')}</ol>`;

  const content = `<header class="journal-appendix-header"><span class="section-num">Everyday shopping</span><h1>超市與便利商店</h1><p class="hero-dek">四城補給、零食試吃與最後一站伴手禮採買。先選城市找店，再拿波蘭文商品名對照貨架。</p></header>
    <p class="action-links">${cityRoutes.map(c => `<a href="#${c.mapKey}">${e(c.name)}</a>`).join('')}<a href="#top10">Top 10 必買</a><a href="#shopping-tips">採買提醒</a></p>
    <div class="callout-note"><b>門市地址已逐店核對（2026-09-22）：</b>12 筆候選地址全部由品牌官方來源確認，其中 ${verifiedCount} 筆（Biedronka）連逐日營業時間都取自官方門市頁，其餘 ${partialCount} 筆只核到地址，營業時間仍待確認。地圖按鈕仍是搜尋連結，不代表已核實的座標。營業時間、庫存與價格以門市當日資訊為準；Biedronka 官網也註明網頁上的時間僅供參考。</div>
    <section class="section" id="chains"><div class="section-heading"><span class="section-num">Chains</span><h2>三大連鎖怎麼選</h2></div>${chains}</section>
    ${cities}
    <section class="section" id="top10"><div class="section-heading"><span class="section-num">Top 10</span><h2>波蘭超市必買 Top 10</h2></div>
      <p>推薦順序與通路符號沿用原指南，屬採買參考，並非銷售排名或即時庫存。包裝會改版，辨識時優先看商品名。</p>
      <p class="grocery-legend"><b>通路符號：</b><span><b data-mark="◎">◎</b>原指南優先找此通路</span><span><b data-mark="○">○</b>可嘗試尋找</span><span><b data-mark="△">△</b>品項可能較少</span></p>
      ${products}
      <p class="grocery-priority-foot"><b>行李有限先挑五樣：</b>${groceryProducts.filter(p => p.priority).map(p => e(p.localName)).join('、')}。</p>
    </section>
    <section class="section" id="strategy"><div class="section-heading"><span class="section-num">Plan</span><h2>前段試吃，華沙補貨</h2></div><ol class="check-list"><li>克拉科夫與樂斯拉夫：巧克力、牛奶糖、威化餅先買小份試吃，記下喜歡的品牌與口味。</li><li>波茲南：補搭車零食與飲料，減少沿途搬運。</li><li>最後回到華沙：集中買常溫伴手禮，優先找順路的 Biedronka；缺貨再看其他超市。確認行李空間與門市時間後再安排。</li></ol><p><a href="shopping.html">更多伴手禮與購物店家 →</a></p></section>
    <section class="section" id="shopping-tips"><div class="section-heading"><span class="section-num">Before you shop</span><h2>星期日與食品採買提醒</h2></div><ul class="check-list"><li><b>Day 2（2026/10/25）是非交易星期日：</b>Biedronka 官方日曆列出 2026 年的交易星期日是 1/25、3/29、4/26、6/28、8/30、12/6、12/13、12/20，十月一天都沒有。一般門市這天不開，仍請先在前一天準備早餐與飲水。${external('https://www.biedronka.pl/pl/niedziele-handlowe', 'Biedronka 2026 官方日曆')}（2026/09/22 查閱）</li><li><b>兩家車站型 Biedronka 官方標示星期日照常營業：</b>華沙 <a href="#warsaw-1">Al. Jerozolimskie 54</a>（每日 05:00–01:00）與波茲南 <a href="#poznan-1">Dworcowa 2</a>（星期日 06:00–22:00）的官方門市頁都帶「sklep czynny w niedzielę」標記。Day 2 早上從華沙中央車站出發前仍有機會補早餐，但非交易星期日的實際開門以門市當日公告為準，不要當成唯一計畫。</li><li><b>克拉科夫與樂斯拉夫的 Biedronka 候選星期日不開：</b><a href="#krakow-1">Rynek Główny 34</a> 與 <a href="#wroclaw-1">Krawiecka 3a</a> 的官方門市頁星期日都是 Zamknięte，沒有車站型門市的例外標記。</li><li>Żabka 的星期日與夜間營業依各店公告，不能假設每家都開到深夜或 24 小時營業；本輪只核到四家 Żabka 的地址，時間一律待確認。</li><li>冷藏／冷凍 Pierogi、Żurek 與乳製品先確認保存條件；餃子、湯底不一定可以直接食用，住宿沒有加熱設備就改買可即食商品。</li><li>Kabanosy 與含肉食品安排在波蘭當地吃，不列為回台伴手禮；攜帶食品前請查閱<a href="essentials.html">安全與基本須知</a>中的官方入境資訊。</li><li>價牌可能附會員、多件或促銷條件，結帳前核對實際適用價格。自備購物袋，少量補給就近購買即可。</li></ul></section>
    <section class="section" id="sources"><div class="section-heading"><span class="section-num">Sources</span><h2>資料來源與查核界線</h2></div><p>候選清單與商品偏好：2026/09/22 提供的《波蘭超市便利商店＿四城分店與Top10必買》。</p><p><b>2026/09/22 逐店核對：</b>12 筆地址全部由品牌官方來源確認——4 家 Biedronka 取自官方逐店頁（含逐日營業時間）、4 家 Lidl 取自官方門市頁與官方門市清單 PDF、4 家 Żabka 取自官方門市清單 PDF 與 zabka.pl 的門市說明頁。Lidl 門市頁的營業時間由 JavaScript 載入、Żabka 不逐店公布，因此這 8 筆只核到地址。Biedronka 官網自己註明網頁上的營業時間僅供參考。</p><p><b>仍未核實的部分：</b>沒有取得任何一家的核實座標，地圖按鈕維持搜尋連結；庫存與價格一律以門市當日資訊為準。Żabka 的官方門市清單是 2024/02 版，只能證明當時該址有門市。出發前請用品牌官方查詢再確認；離線版不會即時更新。</p><p>逐筆來源與判讀記在原始碼庫的 <code>docs/research/2026-09-22-grocery-branch-verification.md</code>。</p></section>`;
  return renderLayout({ title: '超市與便利商店', activeNav: 'practical', bodyHtml: content, pathPrefix: '../', pageKind: 'practical', currentPage: 'practical/groceries.html' });
}
