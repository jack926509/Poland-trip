import { escapeAttr as esc } from '../lib/html.mjs';
import { days } from '../data/trip.js';
import { nightStay, checkoutStay, bookingProgress, dayHref, isDepartureDay } from '../lib/journey.mjs';
import { cityGuides } from '../lib/city-guide.mjs';

export function renderJourneyOverview() {
  return `<section class="section" id="journey-overview">
    <div class="section-heading"><span class="section-num">Plan your trip</span><h2>全程動線與過夜安排</h2></div>
    <p class="lead">白天玩哪裡、晚上住哪裡一起看。轉場日先保留取行李與進站時間；Day 5、Day 7 依當日「時間彈性」調整停留。</p>
    <div class="table-wrap table-wrap-cards"><table class="table-editorial"><thead><tr><th>日期／行程</th><th>白天與轉場</th><th>今晚住宿</th><th>強度／準備</th></tr></thead><tbody>
    ${days.map(day => { const hotel = nightStay(day); const progress = bookingProgress(day); return `<tr>
      <th scope="row"><a href="${dayHref(day)}">Day ${day.n} · ${esc(day.date)}</a></th>
      <td>${esc(day.city)}<br>${esc(day.title)}</td>
      <td>${hotel ? `${esc(hotel.city)} · ${esc(hotel.name)}` : isDepartureDay(day) ? '離境／機上過夜' : '⚠ 住宿資料缺漏'}</td>
      <td>${esc(day.intensity)} · ${progress.pending.length ? `<a href="${dayHref(day)}#day-preparation">待處理 ${progress.pending.length} 項</a>` : '<span class="source-meta">無待訂項目</span>'}</td>
    </tr>`; }).join('')}</tbody></table></div>
  </section>`;
}

export function renderDayContext(day) {
  const hotel = nightStay(day), checkout = checkoutStay(day);
  const guides = Object.values(cityGuides).filter(guide => day.city.includes(guide.name) || hotel?.city === guide.name);
  // 「今日主軸」＝ day.headline，日頁的刊頭 hero-dek 已經顯示過一次
  // （稽核 M3：同一句在日頁重複出現），這裡不再重複輸出。
  return `<aside class="journey-context" aria-label="當日行程銜接">
    <p><b>今晚：</b>${hotel ? `${esc(hotel.city)} · ${esc(hotel.name)}（${esc(hotel.status)}）` : isDepartureDay(day) ? '離境／機上過夜' : '⚠ 住宿資料缺漏，請確認'}${hotel && !hotel.addressVerified ? ' · 飯店門牌待確認' : ''}</p>
    ${checkout ? `<p><b>行李：</b>今天從 ${esc(checkout.name)} 退房；先確認寄放與取件方式，再依交通時間取行李。</p>` : ''}
    <p class="action-links"><a href="index.html#journey-overview">全程動線</a>${guides.map(guide => `<a href="${guide.file}#city-journey">${guide.name}指南</a>`).join('')}<a href="practical/booking.html">住宿與交通詳情</a></p>
  </aside>`;
}

export function renderCityJourney(city) {
  const related = days.filter(day => day.city.includes(city.name) || nightStay(day)?.city === city.name);
  return `<section class="section" id="city-journey"><div class="section-heading"><span class="section-num">Your itinerary</span><h2>這座城在你的旅程中</h2></div>
    <p class="lead">先選日期查看實際走法；景點清單與餐廳候選供當天取捨，不代表全部都要走完。</p>
    <ul class="journey-day-links">${related.map(day => `<li><a href="${dayHref(day)}"><b>Day ${day.n} · ${esc(day.date)}</b> ${esc(day.title)}</a><span>${nightStay(day)?.city === city.name ? '本晚住這座城' : '當日遊覽／轉場'} · 強度 ${esc(day.intensity)}</span><a href="${dayHref(day)}#day-food">當日餐飲 →</a></li>`).join('')}</ul>
    <p class="action-links"><a href="#city-dining">餐廳候選</a><a href="practical/tickets.html">景點票務</a><a href="practical/transit.html">市內交通</a><a href="index.html#journey-overview">全程動線</a></p>
  </section>`;
}
