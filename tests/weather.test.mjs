import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { weatherAdvice, weatherCodeText, weatherUrl } from '../src/scripts/weather.js';
import { weatherPoints } from '../src/data/weather-points.js';
import { days } from '../src/data/trip.js';

const hourly = chances => ({
  time: chances.map((_, hour) => `2026-10-24T${String(hour).padStart(2, '0')}:00`),
  precipitation_probability: chances,
});
const forecast = (daily, chances = Array(24).fill(0)) => ({
  daily: { time: ['2026-10-24'], ...Object.fromEntries(Object.entries(daily).map(([key, value]) => [key, [value]])) },
  hourly: hourly(chances),
});

test('天氣：下雨、冷、強風各自給出對應提醒，並找出白天較可能下雨的時段', () => {
  const chances = Array(24).fill(10);
  for (const hour of [9, 10, 14]) chances[hour] = 70;
  chances[2] = 90; // 半夜的雨不算進行程時段
  const advice = weatherAdvice(forecast({
    weather_code: 61, temperature_2m_max: 8.6, temperature_2m_min: 2.2, apparent_temperature_min: -1.4,
    precipitation_probability_max: 90, precipitation_sum: 4.2, wind_gusts_10m_max: 48,
  }, chances));
  assert.equal(advice.summary, '雨 · 2–9°C · 降雨 90% · 陣風 48 km/h');
  assert.equal(advice.rainHours, '09–11 時、14–15 時');
  assert.ok(advice.tips.some(tip => tip.includes('帶折傘') && tip.includes('09–11 時')));
  assert.ok(advice.tips.some(tip => tip.includes('最低體感 -1°C')));
  assert.ok(advice.tips.some(tip => tip.includes('陣風可達 48 km/h')));
});

test('天氣：穩定的日子只給一句照常出發；缺資料回 null 讓頁面保留平均氣候', () => {
  const advice = weatherAdvice(forecast({
    weather_code: 1, temperature_2m_max: 14, temperature_2m_min: 6, apparent_temperature_min: 5,
    precipitation_probability_max: 5, precipitation_sum: 0, wind_gusts_10m_max: 20,
  }));
  assert.deepEqual(advice.tips, ['天氣穩定，照原定行程走；早晚溫差大，外套帶著。']);
  assert.equal(weatherAdvice({}), null);
  assert.equal(weatherAdvice({ daily: { time: [] } }), null);
  assert.equal(weatherCodeText(71), '雪');
  assert.equal(weatherCodeText(95), '雷雨');
});

test('天氣：預報網址帶當天日期與華沙時區，只查一天', () => {
  const url = weatherUrl(52.2297, 21.0122, '2026-10-24');
  assert.match(url, /^https:\/\/api\.open-meteo\.com\/v1\/forecast\?/);
  assert.match(url, /start_date=2026-10-24&end_date=2026-10-24/);
  assert.match(url, /timezone=Europe%2FWarsaw/);
});

test('今日卡：八天都有天氣區塊，帶座標、日期與離線時的平均氣候，內嵌腳本含載入函式', () => {
  assert.deepEqual(Object.keys(weatherPoints).map(Number), days.map(day => day.n));
  const html = fs.readFileSync('dist/today.html', 'utf8');
  const blocks = [...html.matchAll(/<section class="today-block today-weather" data-today-weather data-weather-lat="([\d.]+)" data-weather-lng="([\d.]+)" data-weather-date="(2026-10-\d\d)">/g)];
  assert.equal(blocks.length, 8);
  assert.deepEqual(blocks.map(match => match[3]), ['2026-10-24', '2026-10-25', '2026-10-26', '2026-10-27', '2026-10-28', '2026-10-29', '2026-10-30', '2026-10-31']);
  assert.equal((html.match(/data-weather-fallback>10 月下旬平均/g) || []).length, 8);
  assert.match(html, /function loadWeather\(/);
  assert.match(html, /function weatherAdvice\(/);
  const standalone = fs.readFileSync('poland-travel-guide-2026.html', 'utf8');
  assert.match(standalone, /function loadWeather\(/);
});
