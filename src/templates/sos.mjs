import { escapeHtml } from '../lib/html.mjs';
import { stay } from '../data/trip.js';
import { renderPrivatePanel, renderPrivateRuntime } from './private-panel.mjs';

// SOS 緊急聯絡：2026-10-20 自由行資料庫頁移除後，整段搬到「安全與基本須知」頁。
// 私人資料（保險救援電話、保單、訂位代號）只存在這支手機的 localStorage。
export { renderPrivateRuntime };

function hotelPhoneItems() {
  const seen = new Set();
  return stay.filter(item => !seen.has(item.name) && seen.add(item.name)).map(item => {
    const digits = String(item.phone || '').replace(/[^\d+]/g, '');
    return `<li><b>${escapeHtml(item.name)}</b>（${escapeHtml(item.city)}）<br>${digits
      ? `<a href="tel:${escapeHtml(digits)}">${escapeHtml(item.phone)}</a>`
      : '<span class="source-meta">請看訂房確認信</span>'}</li>`;
  }).join('');
}

export function renderSosSection() {
  const flows = [
    ['passport', '護照遺失', ['立即報警取得報案證明。', '聯絡駐波蘭台北代表處。', '攜護照影本與證件照辦理補發；急於返台時詢問入國證明書。']],
    ['medical', '緊急就醫', ['危及生命先撥 112 或 999。', '告知姓名、位置、症狀與回撥電話。', '聯絡保險救援，保留診斷、處方、收據與付款證明。']],
    ['baggage', '行李未到', ['不要離開行李提領區。', '向最後承運航空的 baggage service 申報並取得 PIR。', '保留行李牌、PIR、生活必需品收據與配送聯絡資料。']],
    ['connection', '轉機失接', ['在管制區內先找承運航空轉機櫃檯。', '出示所有登機牌與行李牌，要求確認改簽、行李去向與餐宿安排。', '若無櫃檯，使用官方 App／電話，並保留延誤及支出證明。']],
    ['card', '卡片遺失', ['立即在發卡銀行 App 暫停卡片，或撥打卡片背面的海外報失電話。', '查看未授權交易並向銀行申報。', '改用分開收納的備用卡；完整卡號不放在公開網站。']],
  ];
  return `
    <section class="sos-section" aria-labelledby="sos-heading">
      <div class="section-heading"><span class="section-num">SOS</span><h2 id="sos-heading">SOS 緊急聯絡</h2></div>
      <p class="lead">危及生命先撥 <a href="tel:112">112</a> 或 <a href="tel:999">999</a>；其餘狀況依下列卡片處理。</p>
      <div class="sos-grid" id="sos-contacts">
        <article class="database-card"><h3>112 緊急報案</h3><p>歐盟通用緊急電話。</p><p class="database-card-action"><a href="tel:112">撥打 112</a></p></article>
        <article class="database-card"><h3>999 醫療急救</h3><p>波蘭醫療緊急電話。</p><p class="database-card-action"><a href="tel:999">撥打 999</a></p></article>
        <article class="database-card"><h3>駐波蘭台北代表處</h3><p>30th Floor, Ul. Emilii Plater 53, 00-113 Warsaw, Poland</p><p><a href="https://www.google.com/maps/search/?api=1&amp;query=Taipei%20Representative%20Office%20in%20Poland%2C%20Emilii%20Plater%2053%2C%20Warsaw" target="_blank" rel="noopener noreferrer">開啟地址地圖 ↗</a></p><p class="database-card-action"><a href="tel:+48222130060">辦公室 +48 22 213 0060</a><br><a href="tel:+48668027574">急難救助 +48 668 027 574</a></p></article>
        <article class="database-card"><h3>外交部 24 小時緊急聯絡中心</h3><p>海外緊急聯絡，以臺灣國碼格式撥打。</p><p class="database-card-action"><a href="tel:+886800085095">+886 800 085 095</a></p></article>
        <article class="database-card" id="sos-hotels"><h3>住宿電話</h3><p>飯店官方網站公開的電話；晚到、鑰匙或行李問題先聯絡住宿櫃檯。</p><ul class="sos-hotel-list">${hotelPhoneItems()}</ul></article>
        <article class="database-card"><h3>保險海外救援</h3>
          <p data-private-missing="insurerPhone">還沒填。請到下方<a href="#my-private">「我的私人資料」</a>填入保險公司與救援電話，只會存在這支手機。</p>
          <p data-private-has="insurerPhone" hidden><b data-private-text="insurer"></b></p>
          <p class="database-card-action" data-private-has="insurerPhone" hidden><a data-private-tel="insurerPhone" class="private-tel"></a></p>
          <p class="source-meta" data-private-has="policy" hidden>保單號碼：<span data-private-text="policy"></span></p></article>
      </div>
      ${renderPrivatePanel()}
      <div class="grid-wide sos-flows">${flows.map(([id, title, steps]) => `<article class="card" id="sos-flow-${id}"><h3>${title}</h3><ol>${steps.map(step => `<li>${step}</li>`).join('')}</ol></article>`).join('')}</div>
    </section>`;
}
