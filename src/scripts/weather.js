// 今日卡的天氣提醒。
//
// 預報來自 Open-Meteo（免費、免金鑰、允許跨網域），只在顯示中的那張日卡需要時才抓，
// 抓到的結果存在這支手機的 localStorage，一小時內重開不再重抓；離線時沿用上次的結果
// 並標出更新時間。完全抓不到（離線又沒存過、或日期超出預報範圍）就保留建置時寫好的
// 「10 月下旬平均氣候」，不會變成空白。
//
// ⚠ 與 today.js 相同：本檔函式由 templates/today.mjs 以 fn.toString() 內嵌，
// 不可依賴模組層常數或 import，相依函式要一起列入 runtime 陣列。

export function weatherCodeText(code) {
  const c = Number(code);
  if (c === 0) return '晴';
  if (c === 1) return '大致晴';
  if (c === 2) return '晴時多雲';
  if (c === 3) return '陰';
  if (c === 45 || c === 48) return '霧';
  if (c >= 51 && c <= 57) return '毛毛雨';
  if (c >= 61 && c <= 67) return c >= 65 ? '大雨' : '雨';
  if (c >= 71 && c <= 77) return '雪';
  if (c >= 80 && c <= 82) return '陣雨';
  if (c === 85 || c === 86) return '陣雪';
  if (c >= 95) return '雷雨';
  return '多雲';
}

export function weatherUrl(lat, lng, iso) {
  const daily = 'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_min,precipitation_probability_max,precipitation_sum,wind_gusts_10m_max';
  return `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=${daily}&hourly=precipitation_probability&timezone=Europe%2FWarsaw&start_date=${iso}&end_date=${iso}`;
}

/**
 * 把 Open-Meteo 單日回應整理成一行摘要與提醒。
 * 只看 08–20 時的逐時降雨機率找「比較可能下雨的時段」，半夜的雨不影響行程。
 */
export function weatherAdvice(data) {
  const d = data && data.daily;
  if (!d || !Array.isArray(d.time) || !d.time.length) return null;
  const pick = key => (Array.isArray(d[key]) ? d[key][0] : null);
  const round = value => (Number.isFinite(value) ? Math.round(value) : null);
  const code = pick('weather_code');
  const max = round(pick('temperature_2m_max'));
  const min = round(pick('temperature_2m_min'));
  const feels = round(pick('apparent_temperature_min'));
  const rainChance = round(pick('precipitation_probability_max'));
  const rainSum = pick('precipitation_sum');
  const gust = round(pick('wind_gusts_10m_max'));
  if (max === null || min === null) return null;

  const hours = [];
  const hourly = data.hourly || {};
  (hourly.time || []).forEach((time, index) => {
    const hour = Number(String(time).slice(11, 13));
    const chance = (hourly.precipitation_probability || [])[index];
    if (hour >= 8 && hour <= 20 && chance >= 50) hours.push(hour);
  });
  // 連續的小時併成區段：8,9,10,14 → 08–11 時、14–15 時
  const ranges = [];
  hours.forEach(hour => {
    const last = ranges[ranges.length - 1];
    if (last && last[1] === hour) last[1] = hour + 1; else ranges.push([hour, hour + 1]);
  });
  const pad = value => String(value).padStart(2, '0');
  const rainHours = ranges.map(([from, to]) => `${pad(from)}–${pad(to)} 時`).join('、');

  const tips = [];
  const c = Number(code);
  const wet = (rainChance !== null && rainChance >= 50) || (Number.isFinite(rainSum) && rainSum >= 1);
  if (c >= 95) tips.push('可能有雷雨：戶外行程留意天色，雷聲出現就先進室內。');
  if ((c >= 71 && c <= 77) || c === 85 || c === 86) tips.push('可能下雪：穿防滑的鞋，石板路與橋面會滑。');
  if (wet) tips.push(`可能下雨（${rainChance ?? '—'}%${rainHours ? `，較可能在 ${rainHours}` : ''}）：帶折傘或防水外套，拍照的戶外點盡量排在雨小的時段。`);
  else if (rainChance !== null && rainChance >= 30) tips.push(`降雨機率 ${rainChance}%：包裡放一把折傘備用。`);
  if (feels !== null && feels <= 3) tips.push(`最低體感 ${feels}°C：洋蔥式穿搭，帶毛帽、手套與圍巾。`);
  else if (max <= 10) tips.push('白天也偏冷：外套要夠保暖，室內外溫差大，裡面穿可以脫的薄層。');
  if (gust !== null && gust >= 40) tips.push(`陣風可達 ${gust} km/h：傘容易翻，改穿有帽子的防風外套。`);
  if (c === 45 || c === 48) tips.push('早上起霧：遠景與高處視野可能不清楚，拍照點可以往後挪。');
  if (!tips.length) tips.push('天氣穩定，照原定行程走；早晚溫差大，外套帶著。');

  const summary = `${weatherCodeText(code)} · ${min}–${max}°C${rainChance !== null ? ` · 降雨 ${rainChance}%` : ''}${gust !== null ? ` · 陣風 ${gust} km/h` : ''}`;
  return { summary, tips, rainHours, date: d.time[0] };
}

export function renderWeatherInto(block, advice, fetchedAt, stale) {
  const summary = block.querySelector('[data-weather-summary]');
  const tips = block.querySelector('[data-weather-tips]');
  const meta = block.querySelector('[data-weather-meta]');
  const fallback = block.querySelector('[data-weather-fallback]');
  if (!summary || !tips) return;
  summary.textContent = advice.summary;
  summary.hidden = false;
  tips.textContent = '';
  advice.tips.forEach(text => {
    const li = document.createElement('li');
    li.textContent = text;
    tips.appendChild(li);
  });
  tips.hidden = false;
  if (fallback) fallback.hidden = true;
  if (meta) {
    const time = new Intl.DateTimeFormat('zh-TW', { timeZone: 'Europe/Warsaw', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(fetchedAt));
    meta.textContent = `Open-Meteo 預報 · 更新於華沙時間 ${time}${stale ? '（離線，顯示上次結果）' : ''}；出門前再看一次。`;
    meta.hidden = false;
  }
  block.setAttribute('data-weather-state', stale ? 'stale' : 'live');
}

/** 載入顯示中日卡的天氣；一小時內用快取，抓不到就用快取（標示離線），再不行保留平均氣候。 */
export function loadWeather(block, now = Date.now()) {
  if (!block || typeof fetch !== 'function') return;
  const lat = block.getAttribute('data-weather-lat');
  const lng = block.getAttribute('data-weather-lng');
  const iso = block.getAttribute('data-weather-date');
  if (!lat || !lng || !iso) return;
  const key = `pl-weather-v1:${iso}:${lat},${lng}`;
  let cached = null;
  try { cached = JSON.parse(localStorage.getItem(key) || 'null'); } catch (error) { cached = null; }
  const cachedAdvice = cached && weatherAdvice(cached.data);
  if (cachedAdvice && now - cached.fetchedAt < 3600000) {
    renderWeatherInto(block, cachedAdvice, cached.fetchedAt, false);
    return;
  }
  if (block.getAttribute('data-weather-loading') === '1') return;
  block.setAttribute('data-weather-loading', '1');
  fetch(weatherUrl(lat, lng, iso))
    .then(response => (response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`))))
    .then(data => {
      const advice = weatherAdvice(data);
      if (!advice) throw new Error('no forecast');
      try { localStorage.setItem(key, JSON.stringify({ fetchedAt: now, data })); } catch (error) { /* 私密模式存不了也照樣顯示 */ }
      renderWeatherInto(block, advice, now, false);
    })
    .catch(() => {
      if (cachedAdvice) renderWeatherInto(block, cachedAdvice, cached.fetchedAt, true);
    })
    .finally(() => block.removeAttribute('data-weather-loading'));
}
