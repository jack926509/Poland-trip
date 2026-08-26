import { renderLayout } from './layout.mjs';

const displaySectionLabels = {
  entry: '出入境與 ETIAS',
  aviation: '航班與行李',
  rail: '鐵路與轉乘',
  connectivity: '網路與離線',
  money: '付款與現金',
  medical: '醫療與保險',
  emergency: '緊急與護照',
  luggage: '行李寄放',
  calendar: '日曆與營業',
  'tax-free': '退稅 TAX FREE',
  accessibility: '無障礙與體力',
  'daily-basics': '每日基本需求',
  dining: '用餐',
  documents: '旅程文件',
  accommodation: '住宿',
};

const categoryLabels = {
  place: '景點與地點', transit: '交通與轉場', dining: '餐飲', practical: '生活實用', safety: '安全與醫療', document: '文件與資格',
};

const cityLabels = { WAW: '華沙', KRK: '克拉科夫', WRO: '樂斯拉夫', POZ: '波茲南', PL: '波蘭全國', ROUTE: '跨城／全程' };

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function safeHttpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? escapeHtml(url.href) : null;
  } catch {
    return null;
  }
}

function formatDate(value) {
  return escapeHtml(value || '未設定');
}

function normalizeSearchText(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function renderStatusPill(status, statusLabels) {
  const statusText = escapeHtml(statusLabels[status] || status);
  const statusClass = status === 'private-required'
    ? 'private'
    : ['verified', 'recheck', 'pending', 'private'].includes(status) ? status : 'pending';
  return `<span class="status-${statusClass}">狀態：${statusText}</span>`;
}

function renderCard(entry, statusLabels, { representativePhone = false } = {}) {
  const safeSourceUrl = safeHttpsUrl(entry.sourceUrl);
  const source = safeSourceUrl
    ? `<a href="${safeSourceUrl}" target="_blank" rel="noopener noreferrer">開啟官方來源 →</a>`
    : entry.sourceUrl ? '尚無安全的 HTTPS 官方來源' : '尚無官方來源';
  const actionHtml = representativePhone
    ? '<p class="database-card-action"><a href="tel:+48668027574">撥打急難救助電話 +48 668 027 574</a></p>'
    : '';
  const searchBlob = normalizeSearchText([
    entry.title,
    entry.summary,
    entry.offlineNote,
    categoryLabels[entry.category],
    cityLabels[entry.cityKey],
    statusLabels[entry.status],
    entry.status === 'private-required' ? '需填私人資料' : '',
    entry.private ? 'private' : 'public',
  ].join(' '));

  return `
    <article
      class="database-card"
      id="entry-${escapeHtml(entry.id)}"
      data-db-card="true"
      data-city="${escapeHtml(entry.cityKey)}"
      data-category="${escapeHtml(entry.category)}"
      data-status="${escapeHtml(entry.status)}"
      data-section="${escapeHtml(entry.section)}"
      data-privacy="${entry.private ? 'private' : 'public'}"
      data-search="${escapeHtml(searchBlob)}">
      <div class="database-card-header">
        <p class="eyebrow">${escapeHtml(categoryLabels[entry.category] || entry.category)} · ${escapeHtml(cityLabels[entry.cityKey] || entry.cityKey)}</p>
        ${renderStatusPill(entry.status, statusLabels)}${entry.private ? '\n        <span class="status-private">含私人欄位</span>' : ''}
      </div>
      <h3>${escapeHtml(entry.title)}</h3>
      <p>${escapeHtml(entry.summary)}</p>
      <p><b>離線備註：</b>${escapeHtml(entry.offlineNote)}</p>
      <dl class="source-meta">
        <div><dt>盤查日期</dt><dd>${formatDate(entry.checkedAt)}</dd></div>
        <div><dt>查證日期</dt><dd>${formatDate(entry.verifiedAt)}</dd></div>
        <div><dt>重查日期</dt><dd>${formatDate(entry.recheckAt)}</dd></div>
        <div><dt>官方來源</dt><dd>${source}</dd></div>
      </dl>
      ${actionHtml}
    </article>`;
}

function renderSos(entries, statusLabels) {
  const medical = entries.find(entry => entry.id === 'medical-insurance-and-emergency');
  const medicalStatus = statusLabels[medical?.status] || '需填私人資料';
  const flows = [
    ['passport', '護照遺失', ['立即報警取得報案證明。', '聯絡駐波蘭台北代表處。', '攜護照影本與證件照辦理補發；急於返台時詢問入國證明書。']],
    ['medical', '緊急就醫', ['危及生命先撥 112 或 999。', '告知姓名、位置、症狀與回撥電話。', '聯絡保險救援，保留診斷、處方、收據與付款證明。']],
    ['baggage', '行李未到', ['不要離開行李提領區。', '向最後承運航空的 baggage service 申報並取得 PIR。', '保留行李牌、PIR、生活必需品收據與配送聯絡資料。']],
    ['connection', '轉機失接', ['在管制區內先找承運航空轉機櫃檯。', '出示所有登機牌與行李牌，要求確認改簽、行李去向與餐宿安排。', '若無櫃檯，使用官方 App／電話，並保留延誤及支出證明。']],
    ['card', '卡片遺失', ['立即在發卡銀行 App 暫停卡片，或撥打卡片背面的海外報失電話。', '查看未授權交易並向銀行申報。', '改用分開收納的備用卡；完整卡號不放在公開網站。']],
  ];
  return `
    <section class="sos-section" aria-labelledby="sos-heading">
      <div class="section-heading"><span class="section-num">SOS</span><h2 id="sos-heading">SOS 離線急救卡</h2></div>
      <p class="lead">危及生命先撥 <a href="tel:112">112</a> 或 <a href="tel:999">999</a>；其餘狀況依下列卡片處理，並保留可離線查看的聯絡資料。</p>
      <div class="sos-grid" id="sos-contacts">
        <article class="database-card"><h3>112 緊急報案</h3><p>歐盟通用緊急電話。</p><p class="database-card-action"><a href="tel:112">撥打 112</a></p></article>
        <article class="database-card"><h3>999 醫療急救</h3><p>波蘭醫療緊急電話。</p><p class="database-card-action"><a href="tel:999">撥打 999</a></p></article>
        <article class="database-card"><h3>駐波蘭台北代表處</h3><p>30th Floor, Ul. Emilii Plater 53, 00-113 Warsaw, Poland</p><p><a href="https://www.google.com/maps/search/?api=1&amp;query=Taipei%20Representative%20Office%20in%20Poland%2C%20Emilii%20Plater%2053%2C%20Warsaw" target="_blank" rel="noopener noreferrer">開啟地址地圖 ↗</a></p><p class="database-card-action"><a href="tel:+48222130060">辦公室 +48 22 213 0060</a><br><a href="tel:+48668027574">急難救助 +48 668 027 574</a></p></article>
        <article class="database-card"><h3>外交部 24 小時緊急聯絡中心</h3><p>海外緊急聯絡，以台灣國碼格式撥打。</p><p class="database-card-action"><a href="tel:+886800085095">+886 800 085 095</a></p></article>
        <article class="database-card"><h3>保險海外救援</h3><p><span class="status-private">狀態：${escapeHtml(medicalStatus)}</span></p><p>請在私人離線包填入保險公司與救援電話；不放入公開網站。</p></article>
      </div>
      <div class="grid-wide sos-flows">${flows.map(([id, title, steps]) => `<article class="card" id="sos-flow-${id}"><h3>${title}</h3><ol>${steps.map(step => `<li>${step}</li>`).join('')}</ol></article>`).join('')}</div>
    </section>`;
}

export function renderDatabase({ entries, sections, statusLabels }) {
  const index = sections.map(section => {
    const label = escapeHtml(displaySectionLabels[section.id] || section.label);
    return `<li><a href="#section-${escapeHtml(section.id)}">${label}</a></li>`;
  }).join('');
  const sectionCards = sections.map(section => {
    const label = escapeHtml(displaySectionLabels[section.id] || section.label);
    const cards = entries.filter(entry => entry.section === section.id)
      .map(entry => renderCard(entry, statusLabels)).join('');
    return `
      <section class="section" id="section-${escapeHtml(section.id)}" aria-labelledby="heading-${escapeHtml(section.id)}">
        <div class="section-heading"><span class="section-num">資料庫</span><h2 id="heading-${escapeHtml(section.id)}">${label}</h2></div>
        <div class="database-section-grid" data-db-section="${escapeHtml(section.id)}">${cards || '<p>尚無資料。</p>'}</div>
      </section>`;
  }).join('');
  const bodyHtml = `
    <div class="journal-database">
    <header class="journal-appendix-header">
      <span class="section-num">Travel database</span>
      <h1>自由行資料庫</h1>
      <p class="hero-dek">把可公開查證的資料、出發前重查事項與私人待填項目分開呈現；本站不公開訂位代碼、護照、保單或付款資料。</p>
    </header>
    ${renderSos(entries, statusLabels)}
    <nav class="database-index" aria-label="資料庫主題索引">
      <h2>主題索引</h2>
      <ol>${index}</ol>
    </nav>
    ${sectionCards}
    </div>`;
  return renderLayout({
    title: '自由行資料庫',
    activeNav: 'practical',
    bodyHtml,
    pathPrefix: '../',
    pageKind: 'practical',
    currentPage: 'practical/database.html',
  });
}
