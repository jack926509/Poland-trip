import { escapeAttr as esc } from '../lib/html.mjs';
import { days } from '../data/trip.js';
import { nightStay, checkoutStay, dayHref, isDepartureDay } from '../lib/journey.mjs';
import { cityGuides } from '../lib/city-guide.mjs';

/**
 * 每日頁頁首摘要卡裡的「今晚住哪」一行（2026-10-20 UX F1：住宿縮成一行併入摘要卡，
 * 讓時間表第一筆進得了手機第一屏）。門牌待確認、今天退房仍在同一行標出。
 */
export function renderDayStayLine(day) {
  const hotel = nightStay(day), checkout = checkoutStay(day);
  const text = hotel ? `${esc(hotel.city)} · ${esc(hotel.name)}（${esc(hotel.status)}）` : isDepartureDay(day) ? '離境／機上過夜' : '⚠ 住宿資料缺漏，請確認';
  return `<p class="day-stay-line"><b>今晚：</b>${text}${hotel && !hotel.addressVerified ? ' · 飯店門牌待確認' : ''}${checkout ? ` · 今天從 ${esc(checkout.name)} 退房` : ''}</p>`;
}

/** 頁底的行程銜接：行李說明與「全程動線／城市指南／住宿與交通詳情」膠囊（F1 從頁首移到頁底）。 */
export function renderDayContext(day) {
  const hotel = nightStay(day), checkout = checkoutStay(day);
  const guides = Object.values(cityGuides).filter(guide => day.city.includes(guide.name) || hotel?.city === guide.name);
  // 「今日主軸」＝ day.headline，日頁的刊頭 hero-dek 已經顯示過一次
  // （稽核 M3：同一句在日頁重複出現），這裡不再重複輸出。
  return `<aside class="journey-context" aria-label="當日行程銜接">
    ${checkout ? `<p><b>行李：</b>今天從 ${esc(checkout.name)} 退房；先確認寄放與取件方式，再依交通時間取行李。</p>` : ''}
    <p class="action-links"><a href="index.html#journey-overview">全程動線</a>${guides.map(guide => `<a href="${guide.file}#city-journey">${guide.name}指南</a>`).join('')}<a href="practical/booking.html">住宿與交通詳情</a></p>
  </aside>`;
}

export function renderCityJourney(city) {
  const related = days.filter(day => day.city.includes(city.name) || nightStay(day)?.city === city.name);
  return `<section class="section" id="city-journey"><div class="section-heading"><span class="section-num">Your itinerary</span><h2>這座城在你的旅程中</h2></div>
    <p class="lead">先選日期查看實際走法；景點清單與餐廳候選供當天取捨，不代表全部都要走完。</p>
    <ul class="journey-day-links">${related.map(day => `<li><a href="${dayHref(day)}"><b>Day ${day.n} · ${esc(day.date)}</b> ${esc(day.title)}</a><span>${nightStay(day)?.city === city.name ? '本晚住這座城' : '當日遊覽／轉場'} · 強度 ${esc(day.intensity)}</span><a href="${dayHref(day)}#day-food">當日餐飲 →</a></li>`).join('')}</ul>
    <p class="action-links"><a href="#city-dining">餐廳候選</a><a href="practical/transit.html">市內交通</a><a href="index.html#journey-overview">全程動線</a></p>
  </section>`;
}
