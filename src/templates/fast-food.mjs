import { cityGuides, daysInCity } from './city-dining.mjs';

/**
 * 連鎖速食的共用版型。城市指南與實用資料的餐廳頁都要顯示同一批分店，
 * 兩邊各寫一次表格，改欄位時就會有一邊漏改——所以列與卡片都只在這裡產生，
 * 兩頁的差別只有「要不要城市欄」與連結前綴。
 *
 * 這一節刻意不寫營業時間：那是動態資料，全站一律不保存。
 */

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function chips(values) {
  return (values || []).map(value => `<span class="tag-muted">${escapeHtml(value)}</span>`).join('');
}

/** 店名 → 招牌與標籤。城市頁的表格靠這個把「這家賣什麼」帶到店名旁邊。 */
export function chainIndex(chains = []) {
  return new Map(chains.map(chain => [chain.name, chain]));
}

/**
 * 分店列。城市頁看的是「這座城有哪幾家」，總表看的是「哪座城的哪一家」，
 * 差別只有城市欄與招牌欄；其餘共用，避免兩頁的欄序走鐘。
 *
 * showChain：城市頁沒有招牌卡片，所以要在店名旁帶出類型與前兩道招牌，
 * 否則只看店名不知道 Pasibus、MAX、Salad Story 各賣什麼。餐廳頁的總表上方
 * 就是六張招牌卡，同樣內容再印四次（每城一次）只是把列撐長。
 */
function branchRow(branch, chain, { cityCell = '', showChain = true, rowClass = '', nameAsRowHeader = false } = {}) {
  // 招牌只帶前兩項：城市頁要判斷的是「值不值得停」，完整菜單在餐廳頁。
  const teaser = chain?.signature?.slice(0, 2).join('、') || '';
  const chainCell = showChain
    ? `<td>${chain ? `<p class="fast-food-kind">${escapeHtml(chain.kind)}</p>${chips(chain.tags)}${teaser ? `<p class="fast-food-teaser">${escapeHtml(teaser)}</p>` : ''}` : '—'}</td>`
    : '';
  // 店名在城市頁是該列的標題（手機卡片版的卡名），所以用 th scope="row"：
  // 這樣卡片上不會多出一行「店家」欄名，也和行程餐廳推薦表的寫法一致。
  const nameTag = nameAsRowHeader ? 'th scope="row"' : 'td';
  const nameClose = nameAsRowHeader ? 'th' : 'td';
  return `<tr${rowClass ? ` class="${rowClass}"` : ''}>
      ${cityCell}
      <${nameTag}><a href="${escapeHtml(branch.map)}" target="_blank" rel="noopener noreferrer">${escapeHtml(branch.chain)}</a>${chain?.cn ? `<p class="fast-food-cn">${escapeHtml(chain.cn)}</p>` : ''}</${nameClose}>
      ${chainCell}
      <td>${escapeHtml(branch.address)}</td>
      <td>${escapeHtml(branch.note)}</td>
    </tr>`;
}

/** 一站吃到多家：同一棟樓就有好幾家，趕行程或同行人想吃的不一樣時最省時間。 */
export function renderHubCallout(hub) {
  if (!hub) return '';
  return `<div class="callout-note fast-food-hub">
      <b>一站吃到多家：</b><a href="${escapeHtml(hub.map)}" target="_blank" rel="noopener noreferrer">${escapeHtml(hub.place)}</a> · ${escapeHtml(hub.address)}，同一棟就有 ${hub.chains.length} 家——${hub.chains.map(escapeHtml).join(' · ')}。
    </div>`;
}

/** 「Day 2 · Day 3」這種回連，和行程餐廳推薦表的 Day 連結同一種寫法。 */
function dayLinks(cityKey) {
  const numbers = daysInCity(cityKey);
  if (!numbers.length) return '';
  const links = numbers.map(n => `<a href="day-${String(n).padStart(2, '0')}.html#day-food">Day ${n}</a>`).join(' · ');
  return `<p class="fast-food-days"><b>這座城的行程日：</b>${links}（點 Day 回當日的餐飲安排）</p>`;
}

/** 城市指南裡的一節：只有這座城的分店，招牌帶一行提示，完整菜單連去餐廳頁。 */
export function renderCityFastFood({ branches = [], chains = [], hub = null, cityName = '', cityKey = '' }) {
  if (!branches.length) return '';
  const index = chainIndex(chains);
  const rows = branches.map(branch => branchRow(branch, index.get(branch.chain), { nameAsRowHeader: true })).join('');
  return `
    <section class="section" id="city-fast-food">
      <div class="section-heading"><span class="section-num">Fast food</span><h2>連鎖速食</h2></div>
      <p class="lead">不做評選，只給趕行程、太晚或不想踩雷時的落腳點。地址優先挑近老城、主廣場或中央車站的分店，離動線遠的已在備註標明；點店名開啟 Google Maps。營業時間本站不保存，出發前與現場以店家頁面為準。</p>
      ${dayLinks(cityKey)}
      ${renderHubCallout(hub)}
      <div class="table-wrap"><table class="table-editorial fast-food-table">
        <caption>${escapeHtml(cityName)}的連鎖速食分店與各家招牌</caption>
        <thead><tr><th scope="col">店家</th><th scope="col">類型／招牌</th><th scope="col">分店地址</th><th scope="col">位置備註</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
      <p class="action-links"><a href="practical/dining.html#fast-food">完整招牌菜單與四城分店總表 →</a></p>
    </section>`;
}

/**
 * 餐廳頁的一節：招牌推薦（菜單各城相同，只寫一次）＋四城分店總表＋一站吃到多家。
 * 四座城市原本各開一個 h2，整頁被同樣的表頭切成四段；改成單一張帶城市欄的表，
 * 既省掉重複的說明文字，也能直接比較「哪座城有哪幾家」。
 */
export function renderPracticalFastFood({ chains = [], branches = {}, hubs = [] }) {
  if (!chains.length) return '';
  const index = chainIndex(chains);

  const chainCards = chains.map(chain => `
    <article class="card fast-food-card">
      <span class="eyebrow">${escapeHtml(chain.kind)}</span>
      <h3>${escapeHtml(chain.name)}</h3>
      <p class="fast-food-cn">${escapeHtml(chain.cn)}</p>
      <p class="fast-food-chips">${chips(chain.tags)}</p>
      <ul class="check-list">${chain.signature.map(dish => `<li>${escapeHtml(dish)}</li>`).join('')}</ul>
      <p class="source-meta">${escapeHtml(chain.note)}</p>
    </article>`).join('');

  const rows = Object.entries(branches).flatMap(([cityKey, items]) => {
    const guide = cityGuides[cityKey];
    if (!guide) return [];
    return items.map((branch, position) => branchRow(branch, index.get(branch.chain), {
      // 同一座城的六列只在第一列印城市名並連回該城指南，其餘留白，
      // 視覺上自然分組；手機版每列是獨立卡片，所以每列都要帶得出城市。
      cityCell: `<td data-label="城市">${position === 0
        ? `<a class="cross-link" href="../${guide.file}#city-fast-food">${escapeHtml(guide.name)} →</a>`
        : `<span class="fast-food-city-repeat">${escapeHtml(guide.name)}</span>`}</td>`,
      showChain: false,
      rowClass: position === 0 ? 'fast-food-city-start' : '',
    }));
  }).join('');

  const hubCards = hubs.map(hub => `
    <article class="card">
      <span class="eyebrow">${escapeHtml(hub.city)}</span>
      <h3><a href="${escapeHtml(hub.map)}" target="_blank" rel="noopener noreferrer">${escapeHtml(hub.place)} ↗</a></h3>
      <p>${escapeHtml(hub.address)}</p>
      <p class="fast-food-chips">${chips(hub.chains)}</p>
    </article>`).join('');

  return `
    <section class="section" id="fast-food">
      <div class="section-heading"><span class="section-num">Fast food</span><h2>連鎖速食</h2></div>
      <p class="lead">行程趕、太晚或不想踩雷時的落腳點，不做評選。菜單各城相同，所以招牌只列一次；分店地址優先挑近老城、主廣場或中央車站者。營業時間本站不保存，出發前與現場以店家頁面為準。</p>
      <div class="grid">${chainCards}</div>
      <h3 id="fast-food-branches">四城分店總表</h3>
      <p>共 ${Object.values(branches).flat().length} 家。各家招牌見上方卡片，這裡只列地址；點店名開啟 Google Maps，點城市回該城指南看地圖與鄰近景點。</p>
      <div class="table-wrap"><table class="table-editorial fast-food-table fast-food-table-all">
        <caption>四座城市的連鎖速食分店地址</caption>
        <thead><tr><th scope="col">城市</th><th scope="col">店家</th><th scope="col">分店地址</th><th scope="col">位置備註</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
      ${hubCards ? `
      <h3>一站吃到多家</h3>
      <p>同行人想吃的不一樣、或只剩半小時吃飯時，直接去這幾棟，不必為了選店多走一趟。</p>
      <div class="grid">${hubCards}</div>` : ''}
    </section>`;
}

/**
 * 每日行程與今日速查用的一行備援。
 *
 * 當日餐飲卡列的是候選餐廳，但真正需要速食的情境正好是那張卡失效的時候——
 * 客滿、太晚、趕車。所以這行只連到「今天所在城市」的速食區塊，不重印店名：
 * 跨城日會有兩條（依當天移動方向），與卡片裡的城市指南連結排序一致。
 */
export function renderFastFoodFallback(cityKeys = [], { branches = {}, hubs = [], prefix = '', className = 'day-food-fastfood' } = {}) {
  const parts = cityKeys.map(cityKey => {
    const list = branches[cityKey] || [];
    const guide = cityGuides[cityKey];
    if (!list.length || !guide) return '';
    const hub = hubs.find(item => item.cityKey === cityKey);
    // hub.address 本身就帶括號（「Pawia 5（中央車站旁）」），外面再包一層會變成雙括號
    const hint = hub ? `<span class="fast-food-fallback-hub">${escapeHtml(hub.place)} · ${escapeHtml(hub.address)}一棟 ${hub.chains.length} 家</span>` : '';
    // 跨城日有兩座城，連結與它的一站提示必須綁在同一行，否則會變成
    // 「克拉科夫的連結、樂斯拉夫的連結、克拉科夫的提示」這種對不起來的排列。
    return `<span class="fast-food-fallback-city"><a href="${prefix}${guide.file}#city-fast-food">${escapeHtml(guide.name)}連鎖速食 ${list.length} 家 →</a>${hint}</span>`;
  }).filter(Boolean);
  if (!parts.length) return '';
  return `<p class="${className}"><b>客滿、太晚或趕車：</b>${parts.join('')}</p>`;
}
