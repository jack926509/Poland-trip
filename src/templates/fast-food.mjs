import { escapeHtml } from '../lib/html.mjs';
import { safeHttpsUrl } from '../lib/html.mjs';
import { cityGuides } from '../lib/city-guide.mjs';

/**
 * 連鎖速食的三個出口，共用同一份資料（dining.js 的 fastFoodChains／
 * fastFoodBranches／fastFoodHubs），各自只取需要的部分：
 *
 * - 餐廳頁：只列招牌（菜單各城相同，寫一次就好）。
 * - 城市指南：不另開區塊，直接併進「行程餐廳推薦」表的最後一段。
 * - 每日行程與今日速查：收合的一段，當天所在城市有哪幾家、在哪裡。
 *
 * 營業時間保留官方來源、查核日期及待確認狀態；不自動進互動地圖——
 * 那裡的圖釘都逐一查證過座標，速食分店沒有這層查證，改用 Google Maps 連結。
 */

function chips(values) {
  return (values || []).map(value => `<span class="tag-muted">${escapeHtml(value)}</span>`).join('');
}

/** 店名 → 招牌與標籤。分店資料只有店名，靠這個接回各家的菜色。 */
function chainIndex(chains = []) {
  return new Map(chains.map(chain => [chain.name, chain]));
}

/**
 * 分店 → 行程餐廳推薦表的一列。
 *
 * 欄位對應既有的表：tier 進「類型／評選標記」、note 與 highlight 進
 * 「料理特色／推薦餐點」、positionNote 進「行程安排」。走既有欄位而不是新增欄位，
 * 是為了讓速食和其他餐廳在同一張表裡可比較——每一列讀下來都是
 * 「這家賣什麼、在哪、什麼時候去」。
 */
export function fastFoodDiningEntries({ branches = [], chains = [], hub = null } = {}) {
  const index = chainIndex(chains);
  return branches.map(branch => {
    const chain = index.get(branch.chain);
    // 同一棟還有別家時把它寫進行程欄：趕行程時「這棟一次解決」比店名本身有用。
    const alsoHere = hub?.branchIds?.includes(branch.id)
      ? hub.chains.filter(name => name !== branch.chain)
      : [];
    const positionNote = [
      branch.note,
      /待確認/.test(branch.hours || '待確認') ? '營業時間看 Google 地圖' : '',
      alsoHere.length ? `同在 ${hub.place} 的還有 ${alsoHere.join('、')}，一棟解決` : '',
    ].filter(Boolean).join('；');
    return {
      id: branch.id,
      placeId: branch.id,
      chain: branch.chain,
      name: `${branch.chain} · ${branch.address}`,
      hours: branch.hours,
      sourceUrl: branch.sourceUrl,
      checkedAt: branch.checkedAt,
      verificationStatus: branch.verificationStatus,
      address: branch.address,
      map: branch.map,
      tier: [chain?.kind, '連鎖速食'].filter(Boolean).join(' · '),
      note: chain ? `招牌：${chain.signature.join('、')}` : '',
      highlight: chain?.note || '',
      positionNote,
      book: 'walk',
      role: 'fastfood',
    };
  });
}

/** 只在營業時間未知時提醒一句。 */
function branchStatus(branch) {
  return /待確認/.test(branch.hours || '待確認') ? '營業時間看 Google 地圖' : '';
}

/**
 * 一間分店：店名就是導航連結，第二行直接寫營業時間，第三行是招牌三樣與位置提示。
 * 每日行程、今日速查與餐廳頁的分店名錄共用，三處長得一樣。
 */
function renderBranchItem(branch, chain) {
  const source = safeHttpsUrl(branch.sourceUrl);
  const picks = (chain?.signature || []).slice(0, 3);
  return `<li>
          <a href="${escapeHtml(branch.map)}" target="_blank" rel="noopener noreferrer" aria-label="在新視窗開啟 ${escapeHtml(branch.chain)} ${escapeHtml(branch.address)} 的 Google Maps 導航">${escapeHtml(branch.chain)}</a>${chain?.kind ? `<span class="fast-food-kind-inline">${escapeHtml(chain.kind)}</span>` : ''}
          <span class="fast-food-address">${escapeHtml(branch.address)}</span>
          <p class="fast-food-hours"><b>營業</b> ${escapeHtml(/待確認/.test(branch.hours || '待確認') ? '出門前看 Google 地圖' : branch.hours)}</p>
          <p class="food-map-note">${escapeHtml(branch.note)}${picks.length ? ` · 推薦：${picks.map(escapeHtml).join('、')}` : ''}</p>
          <p class="source-meta">${[branchStatus(branch), source ? `<a href="${source}" target="_blank" rel="noopener noreferrer">來源 ↗</a>` : ''].filter(Boolean).join(' · ')}</p>
        </li>`;
}

/**
 * 每日行程與今日速查的一段。
 *
 * 當日餐飲卡列的是候選餐廳，需要速食的情境正好是那張卡失效的時候——客滿、太晚、
 * 趕車。所以預設收合：平常不佔版面，真的要找落腳點時一次看到店名、類型與地址。
 * 跨城日會有兩段（依當天移動方向），與卡片裡的城市指南連結排序一致。
 */
export function renderFastFoodDayList(cityKeys = [], { branches = {}, chains = [], hubs = [], className = 'day-food-fastfood' } = {}) {
  const index = chainIndex(chains);
  const blocks = cityKeys.map(cityKey => {
    const list = branches[cityKey] || [];
    const guide = cityGuides[cityKey];
    if (!list.length || !guide) return '';
    const hub = hubs.find(item => item.cityKey === cityKey);
    const items = list.map(branch => renderBranchItem(branch, index.get(branch.chain))).join('');
    // hub.address 本身就帶括號（「Pawia 5（中央車站旁）」），外面再包一層會變成雙括號
    const hubLine = hub
      ? `<p class="fast-food-fallback-hub">一站吃到多家：${escapeHtml(hub.place)} · ${escapeHtml(hub.address)}，同一棟 ${hub.branchIds.length} 家（各店營業與最後點餐須分別確認）。</p>`
      : '';
    return `<div class="fast-food-fallback-city">
        <p class="fast-food-fallback-city-name"><b>${escapeHtml(guide.name)}</b> · ${list.length} 家</p>
        ${hubLine}
        <ul class="fast-food-fallback-list">${items}</ul>
      </div>`;
  }).filter(Boolean);

  if (!blocks.length) return '';
  const total = cityKeys.reduce((sum, cityKey) => sum + (branches[cityKey] || []).length, 0);
  return `<details class="${className}">
      <summary>連鎖速食候選（營業須確認）： ${total} 間</summary>
      ${blocks.join('')}
    </details>`;
}

/**
 * 餐廳頁的一節：只列各家招牌。
 *
 * 分店是「人在那座城才用得到」的資訊，和城市指南的動線放在一起才有意義；
 * 菜單則各城相同，適合只寫一次。所以這頁只留招牌，分店歸城市指南，兩邊不重複。
 */
export function renderFastFoodMenu({ chains = [], branches = {}, hubs = [] }) {
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

  // 分店名錄：依城市分組、預設收合，每間直接看到營業時間與招牌，不必再跳去城市頁。
  const directory = Object.entries(cityGuides)
    .filter(([cityKey]) => (branches[cityKey] || []).length)
    .map(([cityKey, guide]) => {
      const hub = hubs.find(item => item.cityKey === cityKey);
      return `<details class="fast-food-directory-city">
        <summary>${escapeHtml(guide.name)} · ${branches[cityKey].length} 間分店與營業時間</summary>
        ${hub ? `<p class="fast-food-fallback-hub">一站吃到多家：${escapeHtml(hub.place)} · ${escapeHtml(hub.address)}</p>` : ''}
        <ul class="fast-food-fallback-list">${branches[cityKey].map(branch => renderBranchItem(branch, index.get(branch.chain))).join('')}</ul>
        <p><a href="../${guide.file}#city-dining">${escapeHtml(guide.name)}城市指南的餐廳總表 →</a></p>
      </details>`;
    }).join('');

  const cityLinks = Object.entries(cityGuides)
    .filter(([cityKey]) => (branches[cityKey] || []).length)
    .map(([cityKey, guide]) => `<a href="../${guide.file}#city-dining">${escapeHtml(guide.name)} ${branches[cityKey].length} 家 →</a>`)
    .join('');

  return `
    <section class="section" id="fast-food">
      <div class="section-heading"><span class="section-num">Fast food</span><h2>連鎖速食招牌</h2></div>
      <p class="lead">行程趕、太晚或不想踩雷時的落腳點，不做評選。上面是各家招牌，下面依城市列出每間分店的地址、營業時間與導航；同一份分店資料也出現在每日行程、今日速查與城市指南。營業狀態出門前看 Google 地圖。</p>
      <div class="grid">${chainCards}</div>
      ${directory ? `<h3 id="fast-food-branches">分店與營業時間</h3><div class="fast-food-directory">${directory}</div>` : ''}
      ${cityLinks ? `<p class="action-links">${cityLinks}</p>` : ''}
    </section>`;
}
