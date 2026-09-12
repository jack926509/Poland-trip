// The narrative reads the same itinerary as the day pages; it never invents schedules.
const cities = [
  { name: '華沙', latin: 'Warszawa', x: 355, y: 115 },
  { name: '克拉科夫', latin: 'Kraków', x: 302, y: 355 },
  { name: '弗羅茨瓦夫', latin: 'Wrocław', x: 105, y: 285 },
  { name: '波茲南', latin: 'Poznań', x: 115, y: 105 },
];
const chapters = [
  { city: 0, title: '初見，華沙。', note: '把腳步放慢，從老城的第一場散步開始。', photo: 'warsaw-royal-castle.webp', alt: '華沙皇家城堡與城堡廣場', stamp: '抵達波蘭', end: 0 },
  { city: 1, title: '下一站，古都。', note: '走過城堡、廣場與猶太區，讀一座城市的不同篇章。', photo: 'krakow-wawel.webp', alt: '克拉科夫瓦維爾城堡', stamp: '古都漫遊', end: 1 },
  { city: 1, title: '留一天，記住歷史。', note: 'Auschwitz–Birkenau。留時間閱讀、思考，也留一些安靜。', stamp: '歷史與記憶', end: 1, quiet: true },
  { city: 1, title: '走入地下，再向西。', note: '鹽礦、最後一張明信片，以及傍晚出發的火車。', stamp: '鹽礦與轉場', end: 2 },
  { city: 2, title: '轉角，遇見小矮人。', note: '從彩色廣場走向河岸，收藏弗羅茨瓦夫的細節。', photo: 'wroclaw-dwarf-explorer.webp', alt: '弗羅茨瓦夫街頭的小矮人雕像', stamp: '河岸散步', end: 3 },
  { city: 3, title: '山羊、可頌、好時光。', note: '波茲南的鐘樓與甜點，替回華沙前的午後留下味道。', photo: 'poznan-old-market.webp', alt: '波茲南老城市集廣場', stamp: '波茲南午後', end: 4 },
  { city: 0, title: '回到華沙，再讀一頁。', note: '博物館、皇家城堡，與旅程最後一頓晚餐。', stamp: '華沙終章', end: 4, quiet: true },
  { city: 0, title: '把波蘭，帶回日常。', note: '整理行李與回憶，留一點時間，好好告別。', stamp: '下次再見', end: 4 },
];
const esc = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');

export function renderJourney(days) {
  return `<section class="travel-story" data-journey aria-labelledby="journey-heading">
    <div class="story-heading"><div><span class="story-overline">A LITTLE RAILWAY JOURNAL</span><h2 id="journey-heading">沿著鐵道，把波蘭讀一遍。</h2></div><p>8 天 · 4 座城市 · 一圈秋日旅行</p></div>
    <nav class="story-day-nav" aria-label="動畫旅程日期">${days.map(day => `<a href="#journey-day-${day.n}" data-journey-jump="${day.n - 1}"><small>DAY ${String(day.n).padStart(2, '0')}</small>${esc(day.date.split(' ')[0])}</a>`).join('')}</nav>
    <div class="story-columns">
      <aside class="story-map-panel" aria-label="四城火車路線示意">
        <div class="story-map-top"><span>POLAND / 秋日鐵道</span><button type="button" data-journey-motion aria-pressed="false" hidden>暫停動畫</button></div>
        <svg class="story-map" viewBox="0 0 480 440" role="img" aria-labelledby="journey-map-title journey-map-desc">
          <title id="journey-map-title">波蘭四城火車路線</title><desc id="journey-map-desc">華沙往南到克拉科夫，往西到弗羅茨瓦夫，往北到波茲南，再回華沙。示意線不代表實際鐵路軌跡。</desc>
          <text x="24" y="34" class="map-compass">N ↑</text>
          <text x="195" y="215" class="map-country">POLSKA</text>
          <text x="196" y="238" class="map-country-note">2026 · AUTUMN</text>
          <path class="story-track" d="M355 115 L302 355 L105 285 L115 105 L355 115"/>
          <path class="story-track-dashes" d="M355 115 L302 355 L105 285 L115 105 L355 115"/>
          <path class="story-travelled" data-journey-path d="M355 115 L302 355 L105 285 L115 105 L355 115"/>
          ${cities.map((city, index) => `<g class="story-map-city" data-map-city="${index}"><circle cx="${city.x}" cy="${city.y}" r="7"/><text x="${city.x}" y="${city.y + (index === 1 ? 29 : -35)}" text-anchor="middle">${city.name}</text><text class="map-latin" x="${city.x}" y="${city.y + (index === 1 ? 49 : -17)}" text-anchor="middle">${city.latin}</text></g>`).join('')}
          <g data-journey-train transform="translate(355 115)" aria-hidden="true"><circle r="19" fill="#faf5e9" stroke="#9a452e" stroke-width="2"/><text x="0" y="7" font-size="23" text-anchor="middle">🚆</text></g>
          <text x="24" y="418" class="map-country-note">路線示意 · 非實際鐵路軌跡</text>
        </svg>
        <div class="story-map-caption"><div><small data-journey-current-day>DAY 01 / 08</small><strong data-journey-current-city>華沙 Warszawa</strong></div><span class="story-stamp" data-journey-stamp>抵達波蘭</span></div>
        <p class="story-map-hint">往下翻閱，或選擇上方日期。</p>
      </aside>
      <div class="story-chapters">${days.map((day, index) => {
        const chapter = chapters[index];
        return `<article class="story-chapter${chapter.quiet ? ' story-quiet' : ''}" id="journey-day-${day.n}" data-journey-chapter="${index}" data-city="${chapter.city}" data-route-end="${chapter.end}" data-stamp="${chapter.stamp}" tabindex="-1">
          <div class="story-chapter-date"><span>DAY ${String(day.n).padStart(2, '0')}</span><time>${esc(day.date)}</time></div>
          <h3>${chapter.title}</h3><p class="story-chapter-note">${chapter.note}</p>
          ${chapter.photo ? `<figure class="story-postcard"><img src="assets/photos/${chapter.photo}" alt="${chapter.alt}" width="1000" height="667" loading="lazy" decoding="async"><figcaption>${cities[chapter.city].latin} / ${chapter.stamp}</figcaption></figure>` : ''}
          <div class="story-highlights"><h4>旅遊重點</h4><p>${esc(day.title)}</p></div>
          <details class="story-details"><summary>展開時間表與提醒</summary><ol>${day.steps.map(step => `<li><span>${esc(step.t)}</span><div><b>${esc(step.label)}</b>${step.sub ? `<p>${esc(step.sub)}</p>` : ''}</div></li>`).join('')}</ol><p class="story-caution">${day.hardConstraints.map(esc).join('；')}</p></details>
          <a class="story-day-link" href="day-${String(day.n).padStart(2, '0')}.html">Day ${day.n} 完整行程與導航 <span aria-hidden="true">↗</span></a>
        </article>`;
      }).join('')}</div>
    </div>
    <div class="story-finale"><span class="story-overline">WARSAW → KRAKÓW → WROCŁAW → POZNAŃ → WARSAW</span><h2>繞了一圈，滿載而歸。</h2><p>華沙的第一眼，古都的午後，河岸的小矮人，還有波茲南的甜。</p><a href="#days">翻閱八日旅程目錄 ↓</a></div>
  </section>`;
}
