import { renderLayout } from './layout.mjs';
import { escapeHtml as e } from '../lib/html.mjs';
import { cityRoutes, daysInCity } from '../lib/city-guide.mjs';

const external = (url, label) => `<a href="${e(url)}" target="_blank" rel="noopener noreferrer">${e(label)} ↗</a>`;
const mapUrl = query => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
const table = (caption, headers, rows) => `<div class="table-wrap" role="region" aria-label="${e(caption)}" tabindex="0"><table class="table-editorial grocery-table"><caption>${e(caption)}</caption><thead><tr>${headers.map(h => `<th scope="col">${e(h)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`;

export function renderGroceries({ groceryChains, groceryBranches, groceryProducts }) {
  const chains = table('依採買目的選連鎖', ['連鎖／類型', '適合採買', '官方查詢'], groceryChains.map(c => `<tr><th scope="row">${e(c.name)}<br>${e(c.kind)}</th><td>${e(c.buy)}</td><td>${external(c.url, c.id === 'lidl' ? '官網 → Sklepy Lidl' : '門市查詢')}</td></tr>`).join(''));
  const cities = cityRoutes.map(city => {
    const rows = groceryBranches.filter(b => b.cityKey === city.mapKey).map(b => {
      const chain = groceryChains.find(c => c.id === b.chain);
      return `<tr id="${e(b.id)}"><th scope="row">${e(b.name)}<p class="source-meta">待核對候選</p></th><td>${e(b.address)}<p>${e(b.area)}</p></td><td>${e(b.note)}</td><td>${external(mapUrl(`${b.name} ${b.address}`), '搜尋此地址')}<br>${external(chain.url, '官方核對')}<p class="source-meta">地址與營業時間尚未核實</p></td></tr>`;
    }).join('');
    const days = daysInCity(city.mapKey).map(n => `<a href="../day-${String(n).padStart(2, '0')}.html">Day ${n}</a>`).join(' · ');
    return `<section class="section" id="${city.mapKey}"><div class="section-heading"><span class="section-num">${e(city.localName)}</span><h2>${e(city.name)}${city.mapKey === 'wroclaw' ? '（弗羅茨瓦夫）' : ''}採買位置</h2></div><p class="action-links"><a href="../city-${city.fileKey}.html">${e(city.name)}城市指南 →</a>${days}</p><p>先找當下順路的門市：${groceryChains.map(c => external(mapUrl(`${c.name} ${city.localName}`), c.name)).join(' · ')}。以下保留原指南候選地址，出發前請先核對。</p>${table(`${city.name}三家候選門市`, ['連鎖／狀態', '候選地址／區域', '採買用途', '地圖／營業查詢'], rows)}</section>`;
  }).join('');
  const products = table('Top 10 採買速查（原指南推薦順序）', ['商品／用途', '包裝辨識', 'Biedronka', 'Lidl', 'Żabka'], groceryProducts.map(p => `<tr><th scope="row"><a href="#product-${p.rank}">${p.rank}. ${e(p.localName)}</a><p>${e(p.name)} · ${e(p.use)}</p></th><td>${e(p.packaging)}</td>${p.availability.map(a => `<td>${e(a)}</td>`).join('')}</tr>`).join(''));
  const details = groceryProducts.map(p => `<details class="grocery-product" id="product-${p.rank}"><summary>${p.rank}. ${e(p.localName)}｜${e(p.name)}</summary><p>${e(p.note)}</p></details>`).join('');
  const content = `<header class="journal-appendix-header"><span class="section-num">Everyday shopping</span><h1>超市與便利商店</h1><p class="hero-dek">四城補給、零食試吃與最後一站伴手禮採買。先選城市找店，再拿波蘭文商品名對照貨架。</p></header>
    <p class="action-links">${cityRoutes.map(c => `<a href="#${c.mapKey}">${e(c.name)}</a>`).join('')}<a href="#top10">Top 10 必買</a><a href="#shopping-tips">採買提醒</a></p>
    <div class="callout-note"><b>門市候選待核對：</b>12 筆地址來自你提供的指南，尚未取得逐店官方確認；地圖按鈕是搜尋連結，不代表已核實的店址或座標。營業時間、庫存與價格以門市當日資訊為準。</div>
    <section class="section" id="chains"><div class="section-heading"><span class="section-num">Chains</span><h2>三大連鎖怎麼選</h2></div>${chains}</section>
    ${cities}
    <section class="section" id="top10"><div class="section-heading"><span class="section-num">Top 10</span><h2>波蘭超市必買 Top 10</h2></div><p>推薦順序與通路符號沿用原指南，屬採買參考，並非銷售排名或即時庫存。◎ 原指南優先找此通路；○ 可嘗試尋找；△ 品項可能較少。包裝會改版，辨識時優先看商品名。</p>${products}<h3>商品辨識與口味</h3>${details}<p><b>行李有限先挑五樣：</b>${groceryProducts.filter(p => p.priority).map(p => e(p.localName)).join('、')}。</p></section>
    <section class="section" id="strategy"><div class="section-heading"><span class="section-num">Plan</span><h2>前段試吃，華沙補貨</h2></div><ol class="check-list"><li>克拉科夫與樂斯拉夫：巧克力、牛奶糖、威化餅先買小份試吃，記下喜歡的品牌與口味。</li><li>波茲南：補搭車零食與飲料，減少沿途搬運。</li><li>最後回到華沙：集中買常溫伴手禮，優先找順路的 Biedronka；缺貨再看其他超市。確認行李空間與門市時間後再安排。</li></ol><p><a href="shopping.html">更多伴手禮與購物店家 →</a></p></section>
    <section class="section" id="shopping-tips"><div class="section-heading"><span class="section-num">Before you shop</span><h2>星期日與食品採買提醒</h2></div><ul class="check-list"><li><b>Day 2（2026/10/25）是非交易星期日：</b>先在前一天準備早餐與飲水；不要預設大型超市會開，車站或便利商店也請逐店確認。${external('https://www.biedronka.pl/pl/niedziele-handlowe', 'Biedronka 2026 官方日曆')}（2026/09/22 查閱）</li><li>Żabka 的星期日與夜間營業依各店公告，不能假設每家都開到深夜或 24 小時營業。</li><li>冷藏／冷凍 Pierogi、Żurek 與乳製品先確認保存條件；餃子、湯底不一定可以直接食用，住宿沒有加熱設備就改買可即食商品。</li><li>Kabanosy 與含肉食品安排在波蘭當地吃，不列為回台伴手禮；攜帶食品前請查閱<a href="essentials.html">安全與基本須知</a>中的官方入境資訊。</li><li>價牌可能附會員、多件或促銷條件，結帳前核對實際適用價格。自備購物袋，少量補給就近購買即可。</li></ul></section>
    <section class="section" id="sources"><div class="section-heading"><span class="section-num">Sources</span><h2>資料來源與查核界線</h2></div><p>候選清單與商品偏好：2026/09/22 提供的《波蘭超市便利商店＿四城分店與Top10必買》。品牌查詢入口與星期日官方日曆於 2026/09/22 查閱；這不代表 12 家候選門市已查證。出發前再確認地址、營業與庫存；離線版不會即時更新。</p></section>`;
  return renderLayout({ title: '超市與便利商店', activeNav: 'practical', bodyHtml: content, pathPrefix: '../', pageKind: 'practical', currentPage: 'practical/groceries.html' });
}
