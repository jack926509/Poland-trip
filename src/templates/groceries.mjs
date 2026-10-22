import { renderProductPhoto, renderProductPhotoViewer } from './product-photos.mjs';
import { renderLayout } from './layout.mjs';
import { escapeHtml as e, renderDataNote, splitVerification } from '../lib/html.mjs';
import { cityRoutes, daysInCity } from '../lib/city-guide.mjs';

const external = (url, label) => `<a href="${e(url)}" target="_blank" rel="noopener noreferrer">${e(label)} ↗</a>`;
const button = (url, label, aria) => `<a class="grocery-btn" href="${e(url)}" target="_blank" rel="noopener noreferrer"${aria ? ` aria-label="${e(aria)}"` : ''}>${e(label)} ↗</a>`;
// 2026-10-20 UX F6：資料欄位裡的查核句收進「資料說明」，主畫面只留怎麼買、去哪買。
const plain = value => {
  const { main, notes } = splitVerification(value);
  return { html: e(main), notes: notes.map(e) };
};
const mapUrl = query => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;


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
      <p class="grocery-branch-hours"><span>營業時間</span><b>${e(/^待確認$/.test(String(branch.hours).trim()) ? '出門前看 Google 地圖' : branch.hours)}</b></p>
      ${(() => {
        const use = plain(branch.note);
        const sunday = plain(branch.sundayNote);
        return `${use.html ? `<p class="grocery-branch-use">${use.html}</p>` : ''}
      <p class="grocery-branch-actions">${button(branch.sourceUrl, '門市資料', `在新視窗開啟 ${branch.name} ${branch.address} 的官方門市資料`)}${button(mapUrl(`${branch.name} ${branch.address}`), '地圖搜尋', `在新視窗以 Google Maps 搜尋 ${branch.name} ${branch.address}`)}</p>
      ${sunday.html ? `<p class="source-meta grocery-branch-status">${sunday.html}</p>` : ''}${renderDataNote([...use.notes, ...sunday.notes])}`;
      })()}
    </li>`;
}

/**
 * 商品卡：一項商品一張卡，推薦理由與官方商品事實分開標示。
 * 原本同一批商品在表格與 details 各列一次，商品名還互相連結；表格又因為
 * .grocery-table 的 min-width 在手機把整頁撐出視窗，照片欄讓它更擠。
 */
function renderProduct(product, pathPrefix) {
  const sources = product.sources.map(source =>
    `<li>${external(source.url, source.title)}<span class="grocery-source-meta">${e(source.kind)}</span></li>`).join('');
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
        ${(() => { const reason = plain(product.reason); return `<p class="grocery-product-reason">${reason.html}</p>${renderDataNote(reason.notes)}`; })()}
      </div>
      <details class="grocery-product-more"><summary>怎麼認、什麼口味・推薦來源 ${product.sources.length} 筆</summary>
        <p>${e(product.note)}</p>
        <p class="source-meta">照片為代表包裝，庫存與價格依現場。</p>
        <ul>${sources}</ul>
      </details>
    </li>`;
}

/**
 * 牛奶、果汁與 Żabka 即食卡：縮圖在左、「哪裡買／怎麼認」在右，跟商品卡同一套讀法。
 */
function renderDrinkPick(pick, pathPrefix) {
  const sources = pick.sources.map(source => `<li>${external(source.url, source.title)}<span class="grocery-source-meta">${e(source.kind)}</span></li>`).join('');
  return `<li class="grocery-drink" id="${e(pick.id)}">
      <p class="grocery-drink-head"><b lang="pl">${e(pick.localName)}</b><span>${e(pick.name)}</span>${pick.when ? `<em class="grocery-drink-when">${e(pick.when)}</em>` : ''}</p>
      <div class="grocery-drink-photo">${renderProductPhoto(pick, pathPrefix)}</div>
      <div class="grocery-drink-info">
        ${(() => {
          const [where, look, why] = [pick.where, pick.look, pick.why].map(plain);
          return `<p class="grocery-drink-where"><span>哪裡買</span>${where.html}</p>
        <p class="grocery-drink-look"><span>怎麼認</span>${look.html}</p>
        ${why.html ? `<p class="grocery-drink-why">${why.html}</p>` : ''}${renderDataNote([...where.notes, ...look.notes, ...why.notes])}`;
        })()}
      </div>
      <details class="grocery-drink-more grocery-product-more"><summary>小提醒・來源 ${pick.sources.length} 筆</summary>
        <p>${e(pick.tip)}</p>
        <ul>${sources}</ul>
      </details>
    </li>`;
}

// 牛奶與果汁併進「買什麼」；個別卡片區分已核對商品與待確認候選。
// 卡片之後附一小段盒上波蘭文對照，站在貨架前可以一次對完。
function milkJuiceGroup(guide, pathPrefix) {
  const picks = [...guide.milk, ...guide.juice];
  const labels = guide.labels.map(([pl, zh]) => `<div><dt lang="pl">${e(pl)}</dt><dd>${e(zh)}</dd></div>`).join('');
  return `<details class="grocery-drink-group grocery-fold" id="milk-juice">
      <summary><h3 class="grocery-group-title">牛奶與果汁<span class="grocery-group-count">${picks.length} 項</span></h3><span class="grocery-group-names" lang="pl">${picks.map(pick => e(pick.localName)).join('・')}</span></summary>
      <p class="source-meta">門市現貨與價格以現場為準。沒冰箱時選小份、未開封可常溫保存的商品；開封後依包裝冷藏。</p>
      <ul class="grocery-drink-list">${picks.map(pick => renderDrinkPick(pick, pathPrefix)).join('')}</ul>
      <p class="grocery-label-title">盒子上的字怎麼讀</p>
      <dl class="grocery-label-list">${labels}</dl>
    </details>`;
}

export function renderGroceries({ groceryChains, groceryBranches, groceryProducts, groceryDrinkGuide }) {
  // 這一頁在 practical/ 底下；照片路徑與 renderLayout 用同一個值，不各寫一次。
  const pathPrefix = '../';
  const verifiedCount = groceryBranches.filter(b => b.verificationStatus === 'verified').length;
  const partialCount = groceryBranches.filter(b => b.verificationStatus === 'partial').length;
  const guide = groceryDrinkGuide;

  /*
   * 2026-10-13 重新整理：原本 13 節、手機約 20,600px，同一件事散在好幾處——
   * 星期日公休在開頭提醒、城市段落與最底下各講一次，Tymbark 在推薦與牛奶果汁各一張，
   * Żabka 分在連鎖卡、早餐清單與即食卡三處。改成照採買時的問題排五節：
   * 先知道什麼 → 去哪買 → 買什麼（含 2026 牛奶果汁）→ 即食，最後才是提醒與來源。
   * 四城門市與每組商品都收成 details，摘要列寫出關鍵資訊，不展開也能判斷要不要點。
   */
  const chains = `<ul class="grocery-chain-grid">${groceryChains.map(c => `<li class="grocery-chain-card" data-chain="${e(c.id)}">
      <p class="grocery-chain-head">${chainTag(c)}<span class="grocery-chain-kind">${e(c.kind)}</span></p>
      <p class="grocery-chain-buy">${e(c.buy)}</p>
      <p>${button(c.url, c.id === 'lidl' ? '官網 Sklepy Lidl' : '門市查詢', `在新視窗開啟 ${c.name} 的官方門市查詢`)}</p>
    </li>`).join('')}</ul>`;

  const cities = cityRoutes.map(city => {
    const branches = groceryBranches.filter(b => b.cityKey === city.mapKey);
    const rows = branches.map(b => renderBranch(b, groceryChains.find(c => c.id === b.chain))).join('');
    const dayNumbers = daysInCity(city.mapKey);
    const days = dayNumbers.map(n => `<a href="../day-${String(n).padStart(2, '0')}.html">Day ${n}</a>`).join(' · ');
    const sundayOpen = branches.filter(b => b.sundayOpen === true);
    const sundayHint = sundayOpen.length
      ? `星期日有開：${sundayOpen.map(b => `${b.name} ${b.address.split(',')[0]}`).join('、')}`
      : '星期日：Biedronka、Lidl 不開，Żabka 依店';
    return `<details class="grocery-city grocery-fold" id="${city.mapKey}">
      <summary><h3 class="grocery-group-title">${e(city.name)}${city.mapKey === 'wroclaw' ? '（弗羅茨瓦夫）' : ''}<span class="grocery-group-count">Day ${dayNumbers.join('・')}</span></h3><span class="grocery-group-names">${e(sundayHint)}</span></summary>
      <ul class="grocery-branch-list">${rows}</ul>
      <p class="action-links"><a href="../city-${city.fileKey}.html">${e(city.name)}城市指南 →</a>${days}</p>
      <p class="source-meta grocery-city-foot">臨時要找別家：${groceryChains.map(c => external(mapUrl(`${c.name} ${city.localName}`), c.name)).join(' · ')}</p>
    </details>`;
  }).join('');

  // 保留既有分組與錨點；試吃建議以採買用途呈現，歷史旅遊文章留在來源裡。
  // 第一組預設展開，其餘收合並標數量；摘要列直接列出組內商品名。
  // 牛奶果汁與果汁飲料都是「買什麼」底下的一組，不另開一節。
  const productGroup = (heading, note, items, open = false) => items.length ? `<details class="grocery-product-group"${open ? ' open' : ''}>
      <summary><h3 class="grocery-group-title">${e(heading)}<span class="grocery-group-count">${items.length} 項</span></h3><span class="grocery-group-names" lang="pl">${items.map(product => e(product.localName)).join('・')}</span></summary>
      ${(() => { const split = plain(note); return `${split.html ? `<p class="source-meta">${split.html}</p>` : ''}${renderDataNote(split.notes)}`; })()}
      <ol class="grocery-product-list">${items.map(product => renderProduct(product, pathPrefix)).join('')}</ol>
    </details>` : '';
  const is2026 = product => product.sources.some(source => source.kind === '2026 旅遊推薦');
  const products = productGroup('先買小份試吃', '先試口味，再決定伴手禮數量。推薦理由是旅行採買建議，商品事實另附官方／零售商來源；不代表人氣排行。', groceryProducts.filter(is2026), true)
    + milkJuiceGroup(guide, pathPrefix)
    + productGroup('經典補充', '經典零食附品牌或零售商資料；網友推薦僅供參考，不代表當期銷量或現貨。', groceryProducts.filter(product => !is2026(product) && !product.supplement && !product.drink && !product.drugstore))
    + productGroup('常溫選品補充', '依旅行用途挑選常溫零食。是否可攜入台灣仍須依成分與入境規定確認。', groceryProducts.filter(product => product.supplement && !product.localOnly))
    + productGroup('當地吃・冷藏乳品', '在超市冷藏櫃找品牌與品名，不保證特定連鎖或分店有貨。冷藏品依包裝保存，購買前先確認住宿冰箱。', groceryProducts.filter(product => product.localOnly && !product.drink))
    + productGroup('藥妝伴手禮（Rossmann）', '波蘭本地品牌的唇部保養，在 Rossmann 藥妝店找；色號與款式依門市現貨。', groceryProducts.filter(product => product.drugstore))
    + productGroup('當地喝・果汁飲料', '在飲料貨架或冷藏櫃找品牌；照片只代表一款口味，各分店是否供貨以現場為準。', groceryProducts.filter(product => product.drink));

  const sections = [
    ['essentials', '先知道', 'Before you go'],
    ['stores', '去哪買', 'Where'],
    ['recommendations', '買什麼', 'Picks'],
    ['quick-meals', 'Żabka 即食', 'Quick meals'],
    ['shopping-tips', '提醒與來源', 'Notes'],
  ];
  const heading = (id, title) => {
    const [, short, num] = sections.find(section => section[0] === id);
    return `<div class="section-heading"><span class="section-num">${e(num)}</span><h2>${e(title || short)}</h2></div>`;
  };

  const content = `<header class="journal-appendix-header"><span class="section-num">Everyday shopping</span><h1>超市與便利商店</h1><p class="hero-dek">四城補給、零食試吃與最後一站伴手禮。先看星期日誰有開，再選城市找店，拿波蘭文品名對照貨架。</p></header>
    <p class="action-links">${sections.map(([id, short]) => `<a href="#${id}">${e(short)}</a>`).join('')}</p>
    <section class="section" id="essentials">${heading('essentials', '出發前先知道四件事')}
      <ol class="grocery-essentials">
        <li><b>2026/10/25（Day 2）是非交易星期日，一般超市不開。</b>十月沒有交易星期日；請在抵達克拉科夫前，於杜哈機場、華沙蕭邦機場或西站先買好 10/26 導覽早餐、午餐及飲水；克拉科夫晚上採買只當備案（週日營業時間未查證）。${external('https://www.biedronka.pl/pl/niedziele-handlowe', 'Biedronka 2026 日曆')}${renderDataNote(['Biedronka 官方日曆列出 2026 年的交易星期日是 1/25、3/29、4/26、6/28、8/30、12/6、12/13、12/20，十月一天都沒有。'])}</li>
        <li><b>星期日還有機會買的只有兩家車站型 Biedronka：</b>華沙 <a href="#warsaw-1">Al. Jerozolimskie 54</a>（每日 05:00–01:00）與波茲南 <a href="#poznan-1">Dworcowa 2</a>（星期日 06:00–22:00），別當成唯一計畫。克拉科夫與樂斯拉夫的 Biedronka 星期日不開，Żabka 依各店公告。${renderDataNote(['這兩家的官方門市頁都標「sklep czynny w niedzielę」。非交易星期日的實際開門仍以門市當日公告為準。'])}</li>
        <li><b>營業時間：</b>Biedronka 的 ${verifiedCount} 家有逐日時間；其餘 ${partialCount} 家（Lidl、Żabka）不逐店公布，出門前看 Google 地圖。${renderDataNote(['Biedronka 的逐日時間取自官方門市頁；Lidl、Żabka 官方不逐店公布營業時間。'])}</li>
        <li><b>結帳前看清價牌。</b>「przy zakupie 6 szt.」是買 6 件才有的單價，另有會員（App）價；自備購物袋。</li>
      </ol>
    </section>
    <section class="section" id="stores">${heading('stores', '去哪買：三大連鎖與四城門市')}
      ${chains}
      <p class="grocery-store-lead">每城列三家順路候選。點城市展開；地圖按鈕是搜尋連結。</p>${renderDataNote(['地址取自品牌官方門市資料。'])}
      <div class="grocery-city-list">${cities}</div>
      <p class="source-meta">順路也可以逛：Carrefour（Express、Market 等店型規模不同，${external('https://www.carrefour.pl/sklepy', '門市查詢')}）、Rossmann（零食巧克力區，${external('https://www.rossmann.pl/szukaj?Search=slodycze', '甜食商品')}）。</p>
    </section>
    <section class="section" id="recommendations"><span id="top10" aria-hidden="true"></span>${heading('recommendations', '買什麼：零食與伴手禮')}
      <p>商品資料更新至 2026/10/13；依用途整理，不代表銷售或人氣排名。未確認的品項另有標示，價格與庫存看門市當日資訊。<b>建議路線：</b>克拉科夫、樂斯拉夫先買小份試吃，最後回華沙（10/30–31）再集中買常溫伴手禮；巧克力避熱、餅乾防壓。</p>
      ${products}
      <p class="grocery-priority-foot"><b>行李有限先挑：</b>${groceryProducts.filter(p => p.priority).map(p => e(p.localName)).join('、')}。更多伴手禮店家見<a href="shopping.html">購物頁</a>。</p>
    </section>
    <section class="section" id="quick-meals">${heading('quick-meals', 'Żabka 即食與早餐')}
      <ul class="grocery-drink-list">${(guide.zabka || []).map(pick => renderDrinkPick(pick, pathPrefix)).join('')}</ul>
      <ul class="check-list grocery-quick-list">
        <li><b>Hot Dog：</b>可選香腸與醬料，供應與價格依現場；無肉版本不一定有，要先問門市。${external('https://www.zabka.pl/nowy-gracz-w-druzynie-zabki-hot-dog-amerykanski-debiutuje-obok-kultowych-zapiekanek/', 'Żabka 2026 公告')}${renderDataNote(['2026 年 4 月官方宣布美式熱狗擴至全國門市；無肉版本目前供應未確認。'])}</li>
        <li><b>熱壓吐司（Tosty）、Panini、Zapiekanka：</b>有火腿起司、雞肉培根吐司等；Zapiekanka 是波蘭式焗烤長麵包，口味依當日供應。${external('https://www.zabka.pl/street-food-dostepny-w-kazdej-zabce/', 'Żabka 烤爐公告')} · ${external('https://www.zabka.pl/zabka-menu/', '現行菜單')}${renderDataNote(['品項取自官方菜單；官方已於 2025 年宣布完成全門市烤爐配置。'])}</li>
        <li><b>咖啡（Kawa）：</b>官網列有黑咖啡、Latte、Cappuccino 與 Espresso；價格與操作方式看現場。${external('https://www.zabka.pl/zabka-menu/', 'Żabka 菜單')}</li>
        <li><b>麵包與飲品：</b>超市麵包區找可頌或小份麵包，配 Łaciate 小盒牛奶或 Tymbark 小盒果汁（見<a href="#milk-juice">牛奶與果汁</a>）。</li>
      </ul>
    </section>
    <section class="section" id="shopping-tips">${heading('shopping-tips', '其他提醒與資料來源')}
      <ul class="check-list">
        <li>冷藏／冷凍 Pierogi、Żurek 與乳製品先確認保存條件；餃子、湯底不一定能直接吃，住宿沒有加熱設備就改買即食商品。</li>
        <li>Kabanosy 與含肉食品只在波蘭當地吃，不帶回台灣；攜帶食品前看<a href="essentials.html">安全與基本須知</a>的入境資訊。</li>
        <li>不想買含酒精甜食時，留意 Adwokat、likier 等字樣並核對成分。</li>
      </ul>
      <details class="grocery-sources grocery-fold" id="sources">
        <summary><h3 class="grocery-group-title">資料來源</h3><span class="grocery-group-names">品牌、零售商與門市資料</span></summary>
        <p>商品依品牌、製造商與零售商商品資料整理；推薦理由依小份試吃、早餐補給、保存與攜帶方便性挑選，不是銷售排行。商品頁有列不代表各分店都有貨，庫存與價格以門市當日為準。</p>
        <p>標籤判讀參考 ${external('https://www.gov.pl/web/wijhars-bydgoszcz/sok-czy-nektar', '波蘭官方果汁說明')}；NFC／壓榨不等於未殺菌鮮榨，是否冷藏仍看包裝。</p>
        <p>門市地址取自品牌官方門市頁與門市清單；Lidl、Żabka 不逐店公布營業時間，出門前看 Google 地圖。地圖按鈕是搜尋連結。</p>
        <p>商品照片取自 Open Food Facts 貢獻者（CC BY-SA 3.0）、使用者自行拍攝或網友截圖，僅代表包裝，現場版本可能不同。</p>
      </details>
    </section>`;
  return renderLayout({ title: '超市與便利商店', activeNav: 'practical', bodyHtml: content + renderProductPhotoViewer(), pathPrefix, pageKind: 'practical', currentPage: 'practical/groceries.html',
    // 自動章節目錄在手機上是長清單，跟頁首的跳轉鈕列是同一份目的地；鈕列已涵蓋所有章節，目錄不再重複。
    chapterIndex: false });
}
