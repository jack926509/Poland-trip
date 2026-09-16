import { cityGuides, daysInCity } from './city-dining.mjs';

/**
 * 連鎖速食的版型，兩頁分工不同但共用同一份資料：
 * 餐廳頁只列招牌（菜單各城相同，寫一次），城市指南列該城分店並接上地圖與動線。
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
function chainIndex(chains = []) {
  return new Map(chains.map(chain => [chain.name, chain]));
}

/**
 * 分店列。店名是該列的標題（手機卡片版的卡名），所以用 th scope="row"：
 * 卡片上不會多出一行「店家」欄名，也和行程餐廳推薦表的寫法一致。
 *
 * 類型與招牌要跟在店名旁：只看店名不知道 Pasibus、MAX、Salad Story 各賣什麼，
 * 而完整菜單在餐廳頁，這裡只帶前兩道當判斷依據。
 */
function branchRow(branch, chain) {
  const teaser = chain?.signature?.slice(0, 2).join('、') || '';
  return `<tr>
      <th scope="row"><a href="${escapeHtml(branch.map)}" target="_blank" rel="noopener noreferrer">${escapeHtml(branch.chain)}</a>${chain?.cn ? `<p class="fast-food-cn">${escapeHtml(chain.cn)}</p>` : ''}</th>
      <td>${chain ? `<p class="fast-food-kind">${escapeHtml(chain.kind)}</p>${chips(chain.tags)}${teaser ? `<p class="fast-food-teaser">${escapeHtml(teaser)}</p>` : ''}` : '—'}</td>
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
  const rows = branches.map(branch => branchRow(branch, index.get(branch.chain))).join('');
  return `
    <section class="section" id="city-fast-food">
      <div class="section-heading"><span class="section-num">Fast food</span><h2>連鎖速食</h2></div>
      <p class="lead">不做評選，只給趕行程、太晚或不想踩雷時的落腳點。地址優先挑近老城、主廣場或中央車站的分店，離動線遠的已在備註標明。連鎖分店不放進上方的互動地圖——那裡的圖釘都是逐一查證過座標的，速食分店沒有這層查證，改為每家直接給 Google Maps 連結（點店名開啟）。營業時間本站不保存，出發前與現場以店家頁面為準。</p>
      ${dayLinks(cityKey)}
      ${renderHubCallout(hub)}
      <div class="table-wrap"><table class="table-editorial fast-food-table">
        <caption>${escapeHtml(cityName)}的連鎖速食分店與各家招牌</caption>
        <thead><tr><th scope="col">店家</th><th scope="col">類型／招牌</th><th scope="col">分店地址</th><th scope="col">位置備註</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
      <p class="action-links"><a href="practical/dining.html#fast-food">各家完整招牌與餐點說明 →</a></p>
    </section>`;
}

/**
 * 餐廳頁的一節：只列各家招牌。
 *
 * 這裡曾經還有一張四城分店總表，但分店是「人在那座城才用得到」的資訊，
 * 和城市指南的地圖、動線放在一起才有意義；菜單則各城相同，適合只寫一次。
 * 所以這頁只留招牌，分店與一站多家的提示都歸城市指南，兩邊不重複。
 */
export function renderFastFoodMenu({ chains = [], branches = {} }) {
  if (!chains.length) return '';

  const chainCards = chains.map(chain => `
    <article class="card fast-food-card">
      <span class="eyebrow">${escapeHtml(chain.kind)}</span>
      <h3>${escapeHtml(chain.name)}</h3>
      <p class="fast-food-cn">${escapeHtml(chain.cn)}</p>
      <p class="fast-food-chips">${chips(chain.tags)}</p>
      <ul class="check-list">${chain.signature.map(dish => `<li>${escapeHtml(dish)}</li>`).join('')}</ul>
      <p class="source-meta">${escapeHtml(chain.note)}</p>
    </article>`).join('');

  const cityLinks = Object.entries(cityGuides)
    .filter(([cityKey]) => (branches[cityKey] || []).length)
    .map(([cityKey, guide]) => `<a href="../${guide.file}#city-fast-food">${escapeHtml(guide.name)} ${branches[cityKey].length} 家 →</a>`)
    .join('');

  return `
    <section class="section" id="fast-food">
      <div class="section-heading"><span class="section-num">Fast food</span><h2>連鎖速食招牌</h2></div>
      <p class="lead">行程趕、太晚或不想踩雷時的落腳點，不做評選。菜單各城相同，這裡只列招牌；分店地址在各城市指南裡，和當天動線一起看才有意義。營業時間本站不保存，出發前與現場以店家頁面為準。</p>
      <div class="grid">${chainCards}</div>
      ${cityLinks ? `<p class="action-links">${cityLinks}</p>` : ''}
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
