// src/lib/schedule.mjs — 時刻與日期的共用解析層。
//
// 為什麼需要這個模組：trip.js 的 steps[].t 是寫給人看的自由字串
//（'16:15'、'參考 10:58'、'18:35 前'、'13:30–15:00 預留'），
// 無法直接比較，因此「這個步驟晚於末入場了嗎」「轉場還剩幾分鐘」這類
// 檢查一直只能靠人腦記。本模組只負責讀取與比較，不改寫任何來源字串——
// steps[].t 的原文是既有輸出與測試的契約，必須保持不變。
//
// 無狀態、無資料相依，build 期與瀏覽器端共用。
//
// ⚠ 內嵌約束：templates/practical.mjs 以 fn.toString() 把執行期函式內嵌進頁面
//（見該檔的 dashboardRuntime）。被這樣內嵌的函式在瀏覽器裡沒有 import，
// 只看得到一起內嵌的其他函式。因此本檔每個函式若要送進瀏覽器，
// 其相依函式必須同為具名匯出並一起內嵌——這就是 todayIn 雖然是內部工具
// 卻仍對外匯出的原因。新增函式時請維持這個性質。

/** 各時刻的語意強度，決定稽核時要擋 build 還是只提醒。 */
export const TIME_KINDS = {
  exact: 'exact',          // 純 HH:MM，計劃時刻
  reference: 'reference',  // 「參考 10:58」尚未訂票的班次時刻
  estimate: 'estimate',    // 「約 14:15」估計值
  deadline: 'deadline',    // 「18:35 前」硬截止，晚於它就是錯
  window: 'window',        // 「13:30–15:00 預留」預留區間
};

const HHMM = /(\d{1,2}):(\d{2})/;

/** 'HH:MM' → 當日分鐘數；格式不符回 null（不拋錯，呼叫端自行決定如何處理）。 */
export function toMinutes(hhmm) {
  const match = HHMM.exec(String(hhmm ?? ''));
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

/** 分鐘數 → 'HH:MM'，供訊息輸出使用。 */
export function formatMinutes(minutes) {
  if (!Number.isInteger(minutes) || minutes < 0) return null;
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

/**
 * 解析 steps[].t。回傳 { hhmm, minutes, kind, raw, endHhmm?, endMinutes? }，
 * 無法辨識時回 null——呼叫端要能容忍，因為行程資料允許沒有時刻的步驟。
 */
export function parseStepTime(raw) {
  const text = String(raw ?? '').trim();
  if (!text) return null;

  // 先試區間：'13:30–15:00 預留'（全形連字號與半形皆可）
  const range = /(\d{1,2}:\d{2})\s*[–—-]\s*(\d{1,2}:\d{2})/.exec(text);
  if (range) {
    const start = toMinutes(range[1]);
    const end = toMinutes(range[2]);
    if (start === null || end === null) return null;
    return {
      raw: text, kind: TIME_KINDS.window,
      hhmm: formatMinutes(start), minutes: start,
      endHhmm: formatMinutes(end), endMinutes: end,
    };
  }

  const minutes = toMinutes(text);
  if (minutes === null) return null;

  // 「參考」與「參考20:00」都算 reference——來源資料兩種寫法都有。
  let kind = TIME_KINDS.exact;
  if (/前\s*$/.test(text)) kind = TIME_KINDS.deadline;
  else if (text.includes('參考')) kind = TIME_KINDS.reference;
  else if (text.includes('約')) kind = TIME_KINDS.estimate;

  return { raw: text, kind, hhmm: formatMinutes(minutes), minutes };
}

/** 'YYYY-MM-DD' 或 'M/D'（補 2026 年）→ 'YYYY-MM-DD'；不合法回 null。 */
export function toIsoDate(value) {
  const raw = String(value ?? '').trim();
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/) || raw.match(/^(\d{1,2})\/(\d{1,2})$/);
  if (!match) return null;
  const [year, month, day] = match.length === 4
    ? match.slice(1).map(Number)
    : [2026, ...match.slice(1).map(Number)];
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * 目標日期距今天幾天。正數為未來、0 為今天、負數為已過。
 * 兩個參數都必須是 'YYYY-MM-DD'；任一不合法回 null。
 */
export function daysUntil(targetDate, todayIso) {
  const target = toIsoDate(targetDate);
  const today = toIsoDate(todayIso);
  if (target === null || today === null) return null;
  return Math.round((Date.parse(`${target}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86400000);
}

/** 指定時區的當地日期；匯出以便與 taipeiToday／warsawToday 一起內嵌。 */
export function todayIn(timeZone, now) {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now);
  const part = type => parts.find(value => value.type === type).value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

/** 行前作業以台北時間為準（與 dashboard.js 的 getTaipeiToday 一致）。 */
export function taipeiToday(now = new Date()) {
  return todayIn('Asia/Taipei', now);
}

/** 旅途中的「今天」以華沙當地時間為準，跨越 10/25 冬令時轉換仍正確。 */
export function warsawToday(now = new Date()) {
  return todayIn('Europe/Warsaw', now);
}
