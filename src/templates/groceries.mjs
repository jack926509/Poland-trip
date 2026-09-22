import { renderProductPhoto, renderProductPhotoViewer } from './product-photos.mjs';
import { renderLayout } from './layout.mjs';
import { escapeHtml as e } from '../lib/html.mjs';
import { cityRoutes, daysInCity } from '../lib/city-guide.mjs';

const external = (url, label) => `<a href="${e(url)}" target="_blank" rel="noopener noreferrer">${e(label)} ↗</a>`;
const mapUrl = query => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
// 每一列自己說清楚核到哪一層：verified＝官方門市頁同時有地址與時間，
// partial＝地址已由官方來源確認、時間本輪拿不到。整份都寫「待核對」會讓
// 已經查過的四筆跟沒查過的混在一起，出門時反而不知道哪一筆可以信。
const statusLabel = branch => branch.verificationStatus === 'verified'
  ? `官方門市頁已核對（${branch.verifiedAt}）`
  : branch.verificationStatus === 'partial'
    ? `地址已核對（${branch.verifiedAt}）；營業時間待確認`
    : '待核對候選';
const table = (caption, headers, rows) => `<div class="table-wrap" role="region" aria-label="${e(caption)}" tabindex="0"><table class="table-editorial grocery-table"><caption>${e(caption)}</caption><thead><tr>${headers.map(h => `<th scope="col">${e(h)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`;

export function renderGroceries({ groceryChains, groceryBranches, groceryProducts }) {
  const verifiedCount = groceryBranches.filter(b => b.verificationStatus === 'verified').length;
  const partialCount = groceryBranches.filter(b => b.verificationStatus === 'partial').length;
  const chains = table('依採買目的選連鎖', ['連鎖／類型', '適合採買', '官方查詢'], groceryChains.map(c => `<tr><th scope="row">${e(c.name)}<br>${e(c.kind)}</th><td>${e(c.buy)}</td><td>${external(c.url, c.id === 'lidl' ? '官網 → Sklepy Lidl' : '門市查詢')}</td></tr>`).join(''));
  const cities = cityRoutes.map(city => {
    const rows = groceryBranches.filter(b => b.cityKey === city.mapKey).map(b => {
      const chain = groceryChains.find(c => c.id === b.chain);
      return `<tr id="${e(b.id)}"><th scope="row">${e(b.name)}<p class="source-meta">${e(statusLabel(b))}</p></th>
        <td>${e(b.address)}<p>${e(b.area)}</p></td>
        <td>${e(b.note)}<p class="source-meta"><b>營業時間：</b>${e(b.hours)}</p><p class="source-meta">${e(b.sundayNote)}</p></td>
        <td>${external(b.sourceUrl, '官方門市資料')}<br>${external(mapUrl(`${b.name} ${b.address}`), '搜尋此地址')}<br>${external(chain.url, '出發前重查')}<p class="source-meta">地圖仍是搜尋連結，未取得核實座標。</p></td></tr>`;
    }).join('');
    const days = daysInCity(city.mapKey).map(n => `<a href="../day-${String(n).padStart(2, '0')}.html">Day ${n}</a>`).join(' · ');
    return `<section class="section" id="${city.mapKey}"><div class="section-heading"><span class="section-num">${e(city.localName)}</span><h2>${e(city.name)}${city.mapKey === 'wroclaw' ? '（弗羅茨瓦夫）' : ''}採買位置</h2></div><p class="action-links"><a href="../city-${city.fileKey}.html">${e(city.name)}城市指南 →</a>${days}</p><p>先找當下順路的門市：${groceryChains.map(c => external(mapUrl(`${c.name} ${city.localName}`), c.name)).join(' · ')}。以下三家的地址已於 2026-09-22 由品牌官方來源核對，出發前仍請重查營業時間。</p>${table(`${city.name}三家門市`, ['連鎖／核對狀態', '地址／區域', '採買用途與營業時間', '官方來源／地圖'], rows)}</section>`;
  }).join('');
  const sourceLinks = p => p.sources.map(s => external(s.url, s.title) + ' · ' + e(s.date) + ' · ' + e(s.kind)).join('<br>');
  const productTable = (caption, items) => table(caption, ['商品／用途', '包裝照片與辨識', '推薦理由／來源'], items.map(p => `<tr><th scope="row"><a href="#product-${p.rank}">${e(p.localName)}</a><p>${e(p.name)} · ${e(p.use)}</p></th><td>${renderProductPhoto(p)}<p>${e(p.packaging)}</p></td><td><p>${e(p.reason)}</p><p class="source-meta">${sourceLinks(p)}</p></td></tr>`).join(''));
  const products = productTable('2026 年文章推薦', groceryProducts.filter(p => p.sources.some(s => s.kind === '2026 旅遊推薦')))
    + productTable('經典補充｜來源為歷年推薦', groceryProducts.filter(p => !p.sources.some(s => s.kind === '2026 旅遊推薦')));
  const details = groceryProducts.map(p => `<details class="grocery-product" id="product-${p.rank}"><summary>${e(p.localName)}｜${e(p.name)}</summary><p>${e(p.note)}</p></details>`).join('');
  const content = `<header class="journal-appendix-header"><span class="section-num">Everyday shopping</span><h1>超市與便利商店</h1><p class="hero-dek">四城補給、零食試吃與最後一站伴手禮採買。先選城市找店，再拿波蘭文商品名對照貨架。</p></header>
    <p class="action-links">${cityRoutes.map(c => `<a href="#${c.mapKey}">${e(c.name)}</a>`).join('')}<a href="#recommendations">採買推薦</a><a href="#shopping-tips">採買提醒</a></p>
    <div class="callout-note"><b>門市地址已逐店核對（2026-09-22）：</b>12 筆候選地址全部由品牌官方來源確認，其中 ${verifiedCount} 筆（Biedronka）連逐日營業時間都取自官方門市頁，其餘 ${partialCount} 筆只核到地址，營業時間仍待確認。地圖按鈕仍是搜尋連結，不代表已核實的座標。營業時間、庫存與價格以門市當日資訊為準；Biedronka 官網也註明網頁上的時間僅供參考。</div>
    <section class="section" id="chains"><div class="section-heading"><span class="section-num">Chains</span><h2>三大連鎖怎麼選</h2></div>${chains}</section>
    ${cities}
    <section class="section" id="recommendations"><span id="top10" aria-hidden="true"></span><div class="section-heading"><span class="section-num">Shopping picks</span><h2>波蘭超市採買推薦</h2></div><p>2026/09/22 重新收錄：先看 2026 年文章推薦，再看歷年經典補充；按採買用途整理，不代表銷售或人氣排名。每項都附推薦來源及原文日期，照片下方另列影像來源。2026 年文章推薦品牌或品類，不等於指定照片中的口味。各店庫存與價格請以現場為準。</p>${products}<h3>商品辨識與口味</h3>${details}<p><b>行李有限的採買建議：</b>${groceryProducts.filter(p => p.priority).map(p => e(p.localName)).join('、')}；先試吃再決定數量。</p></section>
    <section class="section" id="strategy"><div class="section-heading"><span class="section-num">Plan</span><h2>前段試吃，華沙補貨</h2></div><ol class="check-list"><li>克拉科夫與樂斯拉夫：巧克力、牛奶糖、威化餅先買小份試吃，記下喜歡的品牌與口味。</li><li>波茲南：補搭車零食與飲料，減少沿途搬運。</li><li>最後回到華沙：集中買常溫伴手禮，優先找順路的 Biedronka；缺貨再看其他超市。確認行李空間與門市時間後再安排。</li></ol><p><a href="shopping.html">更多伴手禮與購物店家 →</a></p></section>
    <section class="section" id="shopping-tips"><div class="section-heading"><span class="section-num">Before you shop</span><h2>星期日與食品採買提醒</h2></div><ul class="check-list"><li><b>Day 2（2026/10/25）是非交易星期日：</b>Biedronka 官方日曆列出 2026 年的交易星期日是 1/25、3/29、4/26、6/28、8/30、12/6、12/13、12/20，十月一天都沒有。一般門市這天不開，仍請先在前一天準備早餐與飲水。${external('https://www.biedronka.pl/pl/niedziele-handlowe', 'Biedronka 2026 官方日曆')}（2026/09/22 查閱）</li><li><b>兩家車站型 Biedronka 官方標示星期日照常營業：</b>華沙 <a href="#warsaw-1">Al. Jerozolimskie 54</a>（每日 05:00–01:00）與波茲南 <a href="#poznan-1">Dworcowa 2</a>（星期日 06:00–22:00）的官方門市頁都帶「sklep czynny w niedzielę」標記。Day 2 早上從華沙中央車站出發前仍有機會補早餐，但非交易星期日的實際開門以門市當日公告為準，不要當成唯一計畫。</li><li><b>克拉科夫與樂斯拉夫的 Biedronka 候選星期日不開：</b><a href="#krakow-1">Rynek Główny 34</a> 與 <a href="#wroclaw-1">Krawiecka 3a</a> 的官方門市頁星期日都是 Zamknięte，沒有車站型門市的例外標記。</li><li>Żabka 的星期日與夜間營業依各店公告，不能假設每家都開到深夜或 24 小時營業；本輪只核到四家 Żabka 的地址，時間一律待確認。</li><li>冷藏／冷凍 Pierogi、Żurek 與乳製品先確認保存條件；餃子、湯底不一定可以直接食用，住宿沒有加熱設備就改買可即食商品。</li><li>Kabanosy 與含肉食品安排在波蘭當地吃，不列為回台伴手禮；攜帶食品前請查閱<a href="essentials.html">安全與基本須知</a>中的官方入境資訊。</li><li>價牌可能附會員、多件或促銷條件，結帳前核對實際適用價格。自備購物袋，少量補給就近購買即可。</li></ul></section>
    <section class="section" id="sources"><div class="section-heading"><span class="section-num">Sources</span><h2>資料來源與查核界線</h2></div><p>門市候選沿用原採買指南；商品清單於 2026/09/22 依網路推薦重新收錄。Becca Daily 原文日期為 2026/07/02；Reddit 討論為 2025/07/29，明列為經典補充；English Wizards 頁面未標示發文日期，不據搜尋引擎收錄時間宣稱為 2026 新文。推薦理由為摘要與採買建議，並非票選結果。</p><p><b>2026/09/22 逐店核對：</b>12 筆地址全部由品牌官方來源確認——4 家 Biedronka 取自官方逐店頁（含逐日營業時間）、4 家 Lidl 取自官方門市頁與官方門市清單 PDF、4 家 Żabka 取自官方門市清單 PDF 與 zabka.pl 的門市說明頁。Lidl 門市頁的營業時間由 JavaScript 載入、Żabka 不逐店公布，因此這 8 筆只核到地址。Biedronka 官網自己註明網頁上的營業時間僅供參考。</p><p><b>仍未核實的部分：</b>沒有取得任何一家的核實座標，地圖按鈕維持搜尋連結；庫存與價格一律以門市當日資訊為準。Żabka 的官方門市清單是 2024/02 版，只能證明當時該址有門市。出發前請用品牌官方查詢再確認；離線版不會即時更新。</p><p>逐筆來源與判讀記在原始碼庫的 <code>docs/research/2026-09-22-grocery-branch-verification.md</code>。</p></section>`;
  return renderLayout({ title: '超市與便利商店', activeNav: 'practical', bodyHtml: content + renderProductPhotoViewer(), pathPrefix: '../', pageKind: 'practical', currentPage: 'practical/groceries.html' });
}


