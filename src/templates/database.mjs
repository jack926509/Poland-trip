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

function formatDate(value) {
  return value || '未設定';
}

function renderCard(entry, statusLabels) {
  const statusText = statusLabels[entry.status] || entry.status;
  const statusClass = entry.status === 'private-required' ? 'private' : entry.status;
  const source = entry.sourceUrl
    ? `<a href="${entry.sourceUrl}" target="_blank" rel="noopener">開啟官方來源 →</a>`
    : '尚無官方來源';
  return `
    <article class="database-card" id="entry-${entry.id}">
      <div class="database-card-header">
        <p class="eyebrow">${entry.category}</p>
        <span class="status-${statusClass}">狀態：${statusText}</span>
      </div>
      <h3>${entry.title}</h3>
      <p>${entry.summary}</p>
      <p><b>離線備註：</b>${entry.offlineNote}</p>
      <dl class="source-meta">
        <div><dt>查證日期</dt><dd>${formatDate(entry.verifiedAt)}</dd></div>
        <div><dt>重查日期</dt><dd>${formatDate(entry.recheckAt)}</dd></div>
        <div><dt>官方來源</dt><dd>${source}</dd></div>
      </dl>
    </article>`;
}

function renderSos(entries, statusLabels) {
  const representative = entries.find(entry => entry.id === 'emergency-taiwan-representative');
  const medical = entries.find(entry => entry.id === 'medical-insurance-and-emergency');
  return `
    <section class="sos-section" aria-labelledby="sos-heading">
      <div class="section-heading"><span class="section-num">SOS</span><h2 id="sos-heading">SOS 離線急救卡</h2></div>
      <p class="lead">危及生命先撥 <a href="tel:112">112</a> 或 <a href="tel:999">999</a>；其餘狀況依下列卡片處理，並保留可離線查看的聯絡資料。</p>
      <div class="sos-grid">
        ${representative ? renderCard(representative, statusLabels).replace('+48 668 027 574', '<a href="tel:+48668027574">+48 668 027 574</a>') : ''}
        ${medical ? renderCard(medical, statusLabels) : ''}
      </div>
    </section>`;
}

export function renderDatabase({ entries, sections, statusLabels }) {
  const index = sections.map(section => {
    const label = displaySectionLabels[section.id] || section.label;
    return `<li><a href="#section-${section.id}">${label}</a></li>`;
  }).join('');
  const sectionCards = sections.map(section => {
    const label = displaySectionLabels[section.id] || section.label;
    const cards = entries.filter(entry => entry.section === section.id)
      .map(entry => renderCard(entry, statusLabels)).join('');
    return `
      <section class="section" id="section-${section.id}" aria-labelledby="heading-${section.id}">
        <div class="section-heading"><span class="section-num">資料庫</span><h2 id="heading-${section.id}">${label}</h2></div>
        <div class="grid-wide">${cards || '<p>尚無資料。</p>'}</div>
      </section>`;
  }).join('');
  const bodyHtml = `
    <header class="hero">
      <div class="hero-copy">
        <span class="section-num">Travel database</span>
        <h1>自由行資料庫</h1>
        <p class="hero-dek">把可公開查證的資料、出發前重查事項與私人待填項目分開呈現；本站不公開訂位代碼、護照、保單或付款資料。</p>
      </div>
    </header>
    ${renderSos(entries, statusLabels)}
    <nav class="database-index" aria-label="資料庫主題索引">
      <h2>主題索引</h2>
      <ol>${index}</ol>
    </nav>
    ${sectionCards}`;
  return renderLayout({ title: '自由行資料庫', activeNav: 'practical', bodyHtml, pathPrefix: '../' });
}
