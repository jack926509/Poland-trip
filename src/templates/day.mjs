import { mealTiming, renderMealList, renderStoreBody, renderStoreHead } from '../lib/dining.mjs';
import { escapeHtml, linkifyText, safeHttpsUrl } from '../lib/html.mjs';
import { bookingProgress, dayHref } from '../lib/journey.mjs';
import { statusTagClass } from '../lib/todo-status.mjs';
import { days as allDays } from '../data/trip.js';
import { segmentForDay } from '../lib/rail.mjs';
import { renderDayContext, renderDayStayLine } from './journey.mjs';
import { dayDining, dayMeals } from '../data/day-dining.js';
import { cityGuides, cityKeysForDay, detectCity } from '../lib/city-guide.mjs';
import { renderFastFoodDayList } from './fast-food.mjs';
import { fastFoodBranches, fastFoodChains, fastFoodHubs } from '../data/dining.js';
import { renderLayout } from './layout.mjs';
import { renderInteractiveMap } from './map.mjs';
import { renderPhotoGallery } from './photo-gallery.mjs';

function renderList(items, renderItem) {
  return items?.length ? `<ul class="check-list">${items.map(renderItem).join('')}</ul>` : '';
}

/**
 * 順路必吃可以是字串（沒有指定店家）或 {text, place, map, note}。
 * text 多半寫成「菜色 @ 店名」，拆開後菜色進小標、店名當標題，讀起來才是一家店而不是一句話。
 * 沒有固定店址的品項（obwarzanek、rogal）只留說明，不硬給連結。
 */
function eatEntry(item) {
  if (typeof item === 'string') return { role: '順路必吃', name: item, eat: true };
  const separator = item.text.includes(' @ ') ? ' @ ' : null;
  const [dish, shop] = separator ? item.text.split(separator) : [null, null];
  const name = dish ? (item.place || shop) : item.text;
  const sameAsName = item.place && (item.text.includes(item.place) || item.place.includes(item.text));
  return {
    ...(item.placeId ? item : {}),
    role: dish ? `順路必吃 · ${dish}` : '順路必吃',
    name,
    meta: dish ? '' : (sameAsName ? '' : item.place),
    note: item.note,
    map: item.map,
    eat: true,
    // 有門市的必吃也用店家卡，營業時間與推薦菜色一樣直接看得到。
    store: Boolean(item.placeId),
  };
}

function diningEntry(item, day) {
  const step = item.stepId ? day.steps.find(step => step.id === item.stepId) : null;
  return { ...item, meta: item.address, timing:mealTiming(item, day), store: true, day, stepTime: step?.t || '' };
}

/**
 * 每一列的導航連結放在標題右上角，而不是另起一行的膠囊——
 * 一天最多 8 列，原本每列都多一行連結，光連結就佔掉大半個卡片。
 * 連結可見文字只有「導航」，因此用 aria-label 帶上店名，螢幕閱讀器才知道是哪一家。
 */
function renderDayFoodItem(entry) {
  // 備選餐廳與三餐主安排共用同一種店家卡：營業時間、推薦菜色、菜單與電話直接可見。
  if (entry.store) {
    return `<li class="day-food-item${entry.eat ? ' day-food-item-eat' : ''}">
      ${renderStoreHead(entry, entry.role)}
      ${renderStoreBody(entry, { condition: '', timing: entry.timing, day: entry.day, time: entry.stepTime })}
    </li>`;
  }
  const url = safeHttpsUrl(entry.map);
  const link = url
    ? `<a class="day-food-map" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="在新視窗開啟 ${escapeHtml(entry.name)} 的 Google Maps 導航">導航 ↗</a>`
    : '';
  return `<li class="day-food-item${entry.eat ? ' day-food-item-eat' : ''}">
      <div class="day-food-head">
        <div class="day-food-title"><span class="eyebrow">${escapeHtml(entry.role)}</span><h4>${escapeHtml(entry.name)}</h4></div>
        ${link}
      </div>
      ${entry.meta ? `<p class="food-map-note">${escapeHtml(entry.meta)}</p>` : ''}
      ${entry.note ? `<p>${escapeHtml(entry.note)}</p>` : ''}
      ${entry.timing ? `<p class="food-map-note">${escapeHtml(entry.timing)}</p>` : ''}${entry.facts || ''}
    </li>`;
}

/**
 * 「當日餐廳候選」與「順路必吃」原本是同一張卡片裡的兩個清單，版式不同、
 * 連結寫法也不同。現在融合成一份「當日餐飲」：候選在前、必吃在後，共用同一種列版式，
 * 必吃以不同色的小標區分。
 */
function renderDayFood(day) {
  const entries = [
    ...(dayDining[day.n] || []).filter(item => !item.meal).map(item => diningEntry(item, day)),
    ...(day.eat || []).map(eatEntry),
  ];
  if (!entries.length && !dayMeals[day.n]?.length) return '';
  const eatCount = entries.filter(entry => entry.eat).length;
  const summary = [
    entries.length - eatCount ? `${entries.length - eatCount} 家候選` : '',
    eatCount ? `${eatCount} 項順路必吃` : '',
  ].filter(Boolean).join(' · ');

  // 這一天的餐位落在哪幾座城市，就連到哪幾份城市指南（跨城日會有兩條）。
  // 城市頁的同一家店也會標出是哪一天並連回來，兩邊互相對得上。
  const guideCities = [...new Set([...entries, ...(dayMeals[day.n] || []).map(item => ({...item, meta:item.address}))]
    .map(entry => detectCity(entry.meta, entry.map))
    .filter(Boolean))]
    // 跨城日依當天的移動方向排（day.city 寫成「克拉科夫 → 樂斯拉夫」），而不是資料出現順序
    .sort((a, b) => day.city.indexOf(cityGuides[a].name) - day.city.indexOf(cityGuides[b].name));
  const guides = guideCities.length ? `<p class="day-food-guides">${guideCities.map(city =>
    `<a href="${cityGuides[city].file}#city-dining">${cityGuides[city].name}城市指南的完整餐廳清單 →</a>`).join('')}</p>` : '';

  // 候選客滿或太晚時的退路：當天所在城市的連鎖速食，預設收合不佔版面。
  const fastFood = renderFastFoodDayList(cityKeysForDay(day), { branches: fastFoodBranches, chains: fastFoodChains, hubs: fastFoodHubs });

  return `<article class="card day-dining" id="day-food" aria-labelledby="day-food-heading">
    <span class="eyebrow">Dining</span><h3 id="day-food-heading">當日餐飲</h3>
    <p class="food-map-note">三餐各有一個主安排；標「先確認」的餐廳先確認接單，備選取代同餐，不額外加餐。時刻為波蘭當地時間，行程預留不代表已訂位。</p>
    ${renderMealList(day, dayMeals[day.n])}
    <p class="day-food-back"><a href="#schedule">↑ 回時間表</a></p>
    ${entries.length ? `<details><summary>備選、備餐與順路點心 · ${summary}</summary><ul class="day-food-list">${entries.map(renderDayFoodItem).join('')}</ul></details>` : ''}
    ${guides}
    ${fastFood}
  </article>`;
}

function renderOperation(operation, day) {
  if (!operation) return '';

  const addressItems = operation.addresses?.map(item => {
    const safeUrl = safeHttpsUrl(item.url);
    // 手機一張地址卡原本約 250px（名稱、地址、說明、入口、兩顆按鈕各一行）。
    // 改成名稱＋地址＋導航按鈕一眼可見，說明與入口收進「入口與說明」；
    // 餐廳共用的制式入口句不再重複列出。
    const entrance = item.entranceNote && !/^依店家地址與現場招牌找入口/.test(item.entranceNote) ? item.entranceNote : '';
    const official = safeHttpsUrl(item.officialUrl);
    return `
      <li class="operation-address">
        <div class="operation-address-head">
          <div class="operation-address-text"><b>${escapeHtml(item.name)}</b><span>${escapeHtml(item.address)}</span></div>
          <div class="operation-address-actions">${safeUrl ? `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" aria-label="在新視窗開啟 ${escapeHtml(item.name)} 導航">導航 ↗</a>` : ''}${official ? `<a href="${official}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(item.name)} 官網">官網 ↗</a>` : ''}</div>
        </div>
        ${item.note || entrance ? `<details class="operation-address-more"><summary>入口與說明</summary>${item.note ? `<p>${escapeHtml(item.note)}</p>` : ''}${entrance ? `<p><b>入口：</b>${escapeHtml(entrance)}</p>` : ''}</details>` : ''}
      </li>`;
  }) || [];
  // 地址卡多的日子（Day 5 有 13 張）手機要捲 3,000px；前 4 張直接可見，其餘收進摺疊區。
  const VISIBLE_ADDRESSES = 4;
  const addresses = addressItems.length
    ? addressItems.slice(0, VISIBLE_ADDRESSES).join('') + (addressItems.length > VISIBLE_ADDRESSES
      ? `<li class="operation-address-rest"><details class="operation-more-addresses"><summary>其餘 ${addressItems.length - VISIBLE_ADDRESSES} 個地址</summary><ul class="operation-addresses">${addressItems.slice(VISIBLE_ADDRESSES).join('')}</ul></details></li>`
      : '')
    : '<li>這一天尚無地址資料。</li>';

  const navigation = operation.navigation?.map(item => `
    <li>
      <span class="operation-mode">${escapeHtml(item.mode)}</span>
      <b>${escapeHtml(item.route)}</b>
      <p>${linkifyText(item.action)}</p>
    </li>`).join('') || '<li>這一天尚無移動步驟。</li>';

  const alerts = operation.dailyAlerts?.map(item => `<li>${escapeHtml(item)}</li>`).join('') || '<li>這一天尚無特別警示。</li>';
  const unresolved = operation.unresolvedSteps?.map(item => `<li><b>${escapeHtml(item.label)}</b><p>${escapeHtml(item.reason)}</p></li>`).join('') || '<li>本日所有步驟都已有可靠地址。</li>';

  return `
    <section class="section operation-section" id="directions" aria-labelledby="operation-heading">
      <div class="section-heading"><span class="section-num">On the ground</span><h2 id="operation-heading">今天怎麼走</h2></div>
      <p class="lead">${escapeHtml(operation.note)}</p>
      <div class="grid-wide operation-grid">
        <article class="card" id="day-addresses">
          <span class="eyebrow">Address book</span>
          <h3>現場地址</h3>
          <ul class="operation-addresses">${addresses}</ul>
        </article>
        <div class="operation-route-column">
        <article class="card" id="day-route">
          <span class="eyebrow">Route</span>
          <h3>移動步驟</h3>
          <ol class="operation-routes">${navigation}</ol>
        </article>
        </div>
      </div>
      <div class="callout-risk operation-alerts">
        <span class="tag-red">今日注意</span>
        <ul class="check-list">${alerts}</ul>
      </div>
      <details class="card operation-unresolved"><summary><b>待班次／住宿／分店確認的步驟</b></summary><ul class="check-list">${unresolved}</ul></details>
    </section>`;
}

function renderNightChecklist(operation) {
  if (!operation?.nightChecklist?.length) return '';
  return `
    <section class="section night-checklist" aria-labelledby="night-checklist-heading">
      <div class="section-heading"><span class="section-num">Before sleep</span><h2 id="night-checklist-heading">晚間準備</h2></div>
      <div class="card card-accent">
        <p class="lead">現在完成，明天出門就不用在網路不穩時臨時找資料。</p>
        <ul class="night-checks">${operation.nightChecklist.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      </div>
    </section>`;
}

export function renderDay(day, photoSpotsForDay = [], operation = null, city = null, detailPhotoCity = null, dayMap = null, mapChecks = {}, legend = {}, dayGallery = [], daylightForDay = null) {
  // 花費／時長常常沒有資料；手機把每欄拆成一行卡片，「—」照樣佔一整行
  // （稽核 M3：Day 2 20+ 步，每步多兩行約 60px）。桌機仍顯示「—」保留欄位
  // 對齊，手機用 data-empty 讓 CSS 直接不渲染那一行，不留空白。
  // 時間表每列的導航：沿用「現場地址」(operation.addresses) 與三餐主安排的導航網址，
  // 不另建資料。一列只在恰好對到一個可靠地點時才給按鈕，對不到就不顯示，不猜。
  const stepNavigation = step => {
    const unresolved = operation?.unresolvedSteps?.find(item => item.label === step.label);
    if (unresolved || /票面/.test(step.label)) return null;
    const matches = (operation?.addresses || []).filter(item => item.stepLabels?.includes(step.label));
    const place = matches.length === 1 && matches[0].reliable ? matches[0] : null;
    const meal = (dayMeals[day.n] || []).find(item => item.stepId && item.stepId === step.id && item.placeId);
    const href = safeHttpsUrl(place?.url) || safeHttpsUrl(meal?.map || meal?.mapUrl);
    return href ? { href, name: place?.name || meal?.name || step.label } : null;
  };
  // 時間表裡的餐次列（早餐／午餐／晚餐）連到同頁「當日餐飲」的店家卡（id 由 renderMealList 以 stepId 產生）。
  // 只連真的有店家卡的餐次；店名優先、其次取「 · 」後面的描述、再不行才整句，不憑空猜。
  const mealStepIds = new Set((dayMeals[day.n] || []).filter(item => item.stepId).map(item => item.stepId));
  const stepLabelHtml = step => {
    const label = String(step.label);
    if (!step.id || !mealStepIds.has(step.id)) return label;
    const meal = dayMeals[day.n].find(item => item.stepId === step.id);
    const href = `#meal-${step.id}`;
    const wrap = text => `<a class="step-meal-link" href="${href}">${text}</a>`;
    if (meal?.name && label.includes(meal.name)) return label.replace(meal.name, wrap(meal.name));
    const separator = label.indexOf(' · ');
    return separator === -1 ? wrap(label) : `${label.slice(0, separator + 3)}${wrap(label.slice(separator + 3))}`;
  };
  // UX 1017 H2：地圖圖釘的數字就是時間表第幾列；有圖釘的列在標題前標出同一個數字，方便對照。
  const pinnedSteps = new Set((dayMap?.points || []).map(point => point[8]).filter(Boolean));
  // 2026-10-20 UX F3／F21：每一步預設只顯示第一句（要做什麼），其餘收進「展開」；
  // 餐次列只留店名＋時間＋導航，店家細節看「當日餐飲」（店名連到餐廳卡），原說明仍收在「展開」裡不刪。
  // 第一句以句號／分號為界；超過 40 字時改在第 12 字之後的第一個逗號斷開，手機上維持一到兩行。
  const splitLead = sub => {
    const match = /^([\s\S]*?[。；！？])([\s\S]+)$/.exec(sub);
    let [lead, rest] = match && match[2].trim() ? [match[1], match[2].trim()] : [sub, ''];
    if (lead.length > 40) {
      const comma = /^([\s\S]{12,}?，)([\s\S]+)$/.exec(lead);
      if (comma) [lead, rest] = [comma[1], `${comma[2].trim()}${rest}`];
    }
    // 第一句尾端的「；」「，」「、」在斷句後多餘，去掉（「。」「！」「？」保留）。
    return [rest ? lead.replace(/[；，、]\s*$/, '') : lead, rest];
  };
  const stepMore = text => `<details class="step-more"><summary>展開</summary><span class="timeline-note">${text}</span></details>`;
  const stepSubHtml = step => {
    if (!step.sub) return '';
    if (step.id && mealStepIds.has(step.id)) return stepMore(step.sub);
    const [lead, rest] = splitLead(step.sub);
    return `<br><span class="timeline-note">${lead}</span>${rest ? stepMore(rest) : ''}`;
  };
  const stepsHtml = day.steps.map((step, index) => {
    const nav = stepNavigation(step);
    const pin = pinnedSteps.has(index + 1) ? `<span class="step-pin" title="地圖上的 ${index + 1} 號圖釘"><span class="visually-hidden">地圖圖釘 </span>${index + 1}</span>` : '';
    return `
    <tr>
      <td class="number" data-label="時間"><b>${step.t}</b>${nav ? `<a class="step-nav" href="${nav.href}" target="_blank" rel="noopener noreferrer" aria-label="在新視窗開啟 ${escapeHtml(nav.name)} 的 Google Maps 導航">導航 ↗</a>` : ''}</td>
      <td data-label="行程"><b>${pin}${stepLabelHtml(step)}</b>${stepSubHtml(step)}</td>
      <td class="number" data-label="花費"${step.cost ? '' : ' data-empty'}>${step.cost || '—'}</td>
      <td class="number" data-label="時長"${step.dur ? '' : ' data-empty'}>${step.dur || '—'}</td>
    </tr>`;
  }).join('');

  const trainSegment = segmentForDay(day);
  const trainPrice = trainSegment?.price;
  const trainHtml = trainSegment ? `
    <section class="section">
      <div class="section-heading"><span class="section-num">Transport</span><h2>當天交通</h2></div>
      <article class="card card-accent">
        <span class="eyebrow">${trainSegment.type}${trainSegment.leg ? ` · ${trainSegment.leg}` : ''}</span>
        <h3>${trainSegment.from || ''}${trainSegment.to ? ` → ${trainSegment.to}` : ''}</h3>
        ${(() => {
          // 抵達時間／車程未知時只寫「發車」，「待查票面」只在上方狀態列出現一次（UX 審查第 6 項）。
          const arrKnown = /^\d{1,2}:\d{2}/.test(trainSegment.arr || '');
          const durKnown = trainSegment.dur && !/待查/.test(trainSegment.dur);
          return `<p><b>${trainSegment.dep}${arrKnown ? ` → ${trainSegment.arr}` : ' 發車'}</b>${durKnown ? ` · ${trainSegment.dur}` : ''}${trainPrice && !/未提供/.test(trainPrice) ? ` · ${escapeHtml(trainPrice)}` : ''}</p>`;
        })()}
        ${trainSegment.saleOpens && !trainSegment.leg?.includes('已購票') ? `<p><b>${escapeHtml(trainSegment.saleOpens)} 起預售</b></p>` : ''}
        <p class="action-links"><a href="practical/booking.html#rail-itinerary">訂票與交通頁的完整班次表 →</a></p>
      </article>
    </section>` : '';

  // 訂票與訂位項目從待辦頁正本推導（見 lib/journey.mjs 的 dayTodos），
  // 每一筆連回待辦頁的同一筆，狀態字樣也和待辦頁一致。
  const { pending, confirmed, skipped } = bookingProgress(day);
  const bookingItem = item => `<li class="booking-item${item.open ? '' : item.skipped ? ' is-skipped' : ' is-done'}">
        <span class="booking-item-group">${escapeHtml(item.groupTitle)}</span>
        <b class="booking-item-name">${escapeHtml(item.name)}</b>
        <span class="${item.skipped ? 'tag-muted' : statusTagClass(item.status)}">${escapeHtml(item.status)}</span>
        <a class="booking-item-link" href="practical/todos.html#${item.anchor}">${item.open ? '下一步怎麼訂' : item.skipped ? '現場怎麼試' : '查看紀錄'} →</a>
      </li>`;
  const mustBookHtml = `${pending.length ? `
    <div class="callout-risk booking-due">
      <span class="tag-todo">尚未完成 ${pending.length} 項</span>
      <h3>這一天要先處理</h3>
      <ul class="booking-items">${pending.map(bookingItem).join('')}</ul>
    </div>` : `
    <div class="callout-good"><b>這一天沒有待訂項目。</b></div>`}
    ${skipped.length ? `<div class="callout-note booking-skipped"><b>線上訂不到、仍排在行程：${skipped.length} 項</b><p>不再列入待辦提醒；當天到現場售票處問剩餘票，買不到就照下方說明調整。</p><ul class="booking-items">${skipped.map(bookingItem).join('')}</ul></div>` : ''}
    ${confirmed.length ? `<details class="booking-done"><summary>已處理 ${confirmed.length} 項</summary><ul class="booking-items">${confirmed.map(bookingItem).join('')}</ul></details>` : ''}`;

  // 重要風險原本是一整段 8–12 行的文字牆，手機上很難找到重點：
  // 依句號拆成條列，一句一行；資料裡的 **粗體** 標記轉成 <b>。
  const warnItems = (day.warn || '')
    .split(/(?<=。)/)
    .map(sentence => sentence.trim())
    .filter(Boolean)
    .map(sentence => sentence.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>'));
  const warnHtml = warnItems.length ? `
    <div class="callout-risk">
      <span class="tag-red">重要風險</span>
      ${warnItems.length > 1 ? `<ul class="risk-list">${warnItems.map(item => `<li>${item}</li>`).join('')}</ul>` : `<p>${warnItems[0]}</p>`}
    </div>` : '';

  // 10 月底的波蘭日落在 16:00 上下，戶外行程排不排得下由這張卡決定；
  // 數值取自 essentials.js 的 daylight，逐日頁不自行寫死時間。
  const daylightHtml = daylightForDay ? `
      <article class="card">
        <span class="eyebrow">${escapeHtml(daylightForDay.tz)} · 戶外可用時間</span>
        <h3>日照</h3>
        <ul>
          <li>日出 <b>${escapeHtml(daylightForDay.sunrise)}</b>／日落 <b>${escapeHtml(daylightForDay.sunset)}</b></li>
          <li>藍調時刻至 <b>${escapeHtml(daylightForDay.blueHourEnd)}</b></li>
        </ul>
        <p>${escapeHtml(daylightForDay.note)}</p>
        <p class="source-meta">天文推算值。</p>
      </article>` : '';

  const constraintHtml = `
    <section class="section">
      <div class="section-heading"><span class="section-num">Priorities</span><h2>時間彈性</h2></div>
      <div class="grid-wide">
      <article class="card">
        <span class="eyebrow">不能延誤</span>
        <h3>硬性時間</h3>
        ${renderList(day.hardConstraints, item => `<li>${item}</li>`)}
      </article>
      <article class="card">
        <span class="eyebrow">時間不夠時</span>
        <h3>可以壓縮</h3>
        ${renderList(day.compressible, item => `<li>${item}</li>`)}
      </article>
      ${daylightHtml}
      </div>
    </section>`;

  const extendHtml = day.extend?.length ? `
    <section class="section">
      <div class="section-heading"><span class="section-num">Optional</span><h2>可插入的延伸選項</h2></div>
      ${renderList(day.extend, item => `<li><b>${item.label}</b>${item.when ? `（${item.when}）` : ''}— ${item.why}${safeHttpsUrl(item.map) ? ` <a href="${safeHttpsUrl(item.map)}" target="_blank" rel="noopener noreferrer">Google Maps 定位 →</a>` : ''}</li>`)}
    </section>` : '';

  const returnOptionsHtml = day.returnOptions?.length ? `
    <section class="section">
      <div class="section-heading"><span class="section-num">Return</span><h2>回程選項</h2></div>
      <p class="lead">導覽約 14:15 結束，以下全部以「14:15 之後發車」為門檻。第一方售票頁在查詢當下無法連線，時刻均為公開資料彙整，購票前請逐項核對。</p>
      <div class="grid-wide">${day.returnOptions.map(item => `
        <article class="card">
          <span class="eyebrow">${escapeHtml(item.rank)}</span>
          <h3>${escapeHtml(item.name)}</h3>
          <p>${escapeHtml(item.detail)}</p>
          <p class="timeline-note">${escapeHtml(item.status)}</p>
          ${safeHttpsUrl(item.url) ? `<p class="action-links"><a href="${safeHttpsUrl(item.url)}" target="_blank" rel="noopener noreferrer">查班次與購票 →</a></p>` : ''}
        </article>`).join('')}
      </div>
    </section>` : '';

  const backupHtml = day.backup?.length ? `
    <section class="section">
      <div class="section-heading"><span class="section-num">Plan B</span><h2>備案</h2></div>
      <div class="grid">${day.backup.map(item => `
        <article class="card">
          <span class="eyebrow">${item.label}</span>
          <h3>${item.where}</h3>
          <p>${item.why}</p>
          ${safeHttpsUrl(item.map) ? `<p class="food-map-links"><a href="${safeHttpsUrl(item.map)}" target="_blank" rel="noopener noreferrer">Google Maps 定位 →</a></p>` : ''}
        </article>`).join('')}
      </div>
    </section>` : '';

  const practicalHtml = day.practical?.length ? `
    <section class="section">
      <div class="section-heading"><span class="section-num">On the ground</span><h2>現場實用提醒</h2></div>
      ${renderList(day.practical, item => `<li>${typeof item === 'string' ? item : Object.values(item).filter(Boolean).join(' · ')}</li>`)}
    </section>` : '';

  const photoHtml = photoSpotsForDay.length ? `
    <section class="section">
      <div class="section-heading"><span class="section-num">Photo</span><h2>拍照建議</h2></div>
      <div class="photo-spot-grid">${photoSpotsForDay.map(spot => `
        <article class="card">
          <span class="eyebrow">${spot.bestTime}</span>
          <h3>${spot.name}</h3>
          <p><b>精確站位：</b>${spot.viewpoint}</p>
          <p><b>拍攝方向：</b>${spot.direction}</p>
          <p><b>光線與構圖：</b>${spot.light}</p>
          <p><a href="${spot.mapUrl}" target="_blank" rel="noopener noreferrer">開啟拍照站位 ↗</a></p>
        </article>`).join('')}
      </div>
    </section>` : '';

  // 前後一天：2026-10-20 UX F1 移到頁底，取代原本頁底另一組「← Day N｜Day N →」翻頁列。
  // 頁首換日：Day 1 沒有前一天、最後一天沒有後一天，只顯示存在的那一邊。
  const dayNeighbor = (n, arrow) => {
    const target = allDays.find(item => item.n === n);
    return target ? `<a class="day-switch-link is-${arrow}" href="${dayHref(target)}">${arrow === 'prev' ? `← Day ${n}` : `Day ${n} →`}</a>` : '';
  };
  const daySwitchHtml = `<nav class="day-switch" aria-label="前後一天">${dayNeighbor(day.n - 1, 'prev')}${dayNeighbor(day.n + 1, 'next')}</nav>`;
  const coverHtml = city?.photo?.hero ? `
      <figure class="journal-day-cover">
        <img src="${escapeHtml(city.photo.hero)}" alt="${escapeHtml(city.name)}城市風景" width="1200" height="800" decoding="async" fetchpriority="high">
        <figcaption>${escapeHtml(city.pl)} · ${escapeHtml(city.vibe)}</figcaption>
      </figure>` : '<div class="journal-day-cover-fallback" aria-hidden="true">POLSKA</div>';
  const detailPhotoHtml = detailPhotoCity?.photo?.detail ? `
    <figure class="city-detail-photo day-detail-photo">
      <img src="${escapeHtml(detailPhotoCity.photo.detail)}" alt="${escapeHtml(detailPhotoCity.photo.detailAlt)}" width="1280" height="${escapeHtml(detailPhotoCity.photo.detailHeight)}" loading="lazy" decoding="async">
      <figcaption>${escapeHtml(detailPhotoCity.photo.detailCaption)}<details class="photo-credit"><summary>圖片來源</summary>${escapeHtml(detailPhotoCity.photo.detailAuthor)} · <a href="${escapeHtml(detailPhotoCity.photo.detailSource)}" target="_blank" rel="noopener noreferrer">圖片來源 ↗</a> · <a href="${escapeHtml(detailPhotoCity.photo.detailLicenseUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(detailPhotoCity.photo.detailLicense)} 授權 ↗</a></details></figcaption>
    </figure>` : '';

  // 快捷列：地圖／地址／交通。該區塊當天不存在就不放，不留死連結。
  // 2026-10-20 UX F4：「時間表／吃哪」由手機底部固定列負責（每日頁指向 #schedule／#day-food），
  // 捷徑列不再重複，兩列合計少一半按鈕。
  const foodHtml = renderDayFood(day);
  const shortcuts = [
    dayMap ? [`#map-day-${day.n}-heading`, '地圖'] : null,
    operation ? ['#day-addresses', '地址'] : null,
    operation ? ['#day-route', '交通'] : null,
  ].filter(Boolean);

  const bodyHtml = `
    <header class="journal-day-header">
      <div class="journal-day-heading">
        <span class="section-num">Day ${String(day.n).padStart(2, '0')} · ${escapeHtml(day.date)}</span>
        <h1>${escapeHtml(day.title).replaceAll(' + ', ' +\u00a0')}</h1>
        <p class="hero-dek">${escapeHtml(day.headline)}</p>
        ${renderDayStayLine(day)}
      </div>
${coverHtml}
    </header>

    <nav class="day-shortcuts" aria-label="當日快速導覽">
      ${shortcuts.map(([href, text]) => `<a href="${href}">${text}</a>`).join('')}
    </nav>

    <section class="section" id="schedule">
      <div class="section-heading"><span class="section-num">Schedule</span><h2>當日時間表</h2></div>
      <div class="table-wrap table-wrap-cards">
        <table class="table-editorial table-schedule">
          <thead><tr><th>時間</th><th>行程</th><th>花費</th><th>時長</th></tr></thead>
          <tbody>${stepsHtml}</tbody>
        </table>
      </div>
    </section>

    ${foodHtml ? `<section class="section day-food-section">${foodHtml}</section>` : ''}
    ${dayMap ? renderInteractiveMap({ id: `map-day-${day.n}`, title: `Day ${day.n} 行程地圖`, mapData: dayMap, mapChecks, legend, note: dayMap.note }) : ''}
    ${renderOperation(operation, day)}
    ${trainHtml}
    <section class="section" id="day-preparation">
      <div class="section-heading"><span class="section-num">Preparation</span><h2>訂票與提醒</h2></div>
      ${mustBookHtml}
      ${warnHtml}
      <p class="action-links"><a href="practical/todos.html">全部待辦 →</a></p>
    </section>
    ${constraintHtml}
    ${extendHtml}
    ${returnOptionsHtml}
    ${backupHtml}
    ${practicalHtml}
    ${renderNightChecklist(operation)}
    ${detailPhotoHtml}
    ${renderPhotoGallery(dayGallery.length ? dayGallery : (city?.gallery || []).filter(photo => photo.days?.includes(day.n)), '沿途風景')}
    ${photoHtml}

    ${renderDayContext(day)}
    ${daySwitchHtml}`;

  return renderLayout({
    title: `Day ${day.n} ${day.title}`,
    activeNav: 'days',
    bodyHtml: bodyHtml.replace(/[ \t]+$/gm, ''),
    pageKind: 'day',
    currentPage: `day-${String(day.n).padStart(2, '0')}.html`,
    extraHead: dayMap ? '<link rel="stylesheet" href="assets/leaflet/leaflet.css">' : '',
  });
}
