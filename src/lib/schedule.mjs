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

/**
 * days[].date（'10/24 (六)'）轉 ISO。年份取自 meta.tripStart，
 * 因為行程資料只寫月日。無法解析回 null。
 */
export function dayIsoDate(dayDate, tripStart) {
  const match = /^(\d{1,2})\/(\d{1,2})/.exec(String(dayDate ?? '').trim());
  if (!match) return null;
  const year = String(tripStart ?? '').slice(0, 4);
  if (!/^\d{4}$/.test(year)) return null;
  return toIsoDate(`${year}-${match[1].padStart(2, '0')}-${match[2].padStart(2, '0')}`);
}

/** ISO 日期的星期（0 = 週日 … 6 = 週六）；不合法回 null。 */
export function weekdayOf(isoDate) {
  const iso = toIsoDate(isoDate);
  if (iso === null) return null;
  return new Date(`${iso}T00:00:00Z`).getUTCDay();
}

export const WEEKDAY_NAMES = ['日', '一', '二', '三', '四', '五', '六'];

// ── 硬時間的語意分類 ───────────────────────────────────────────────
//
// hardConstraints 是寫給人看的句子，一句裡可能有多個時刻，而且語意不同：
// 「皇家城堡 10:00 開門、17:00 最後入場」的 10:00 是開門（不是期限），
// 真正不能錯過的是 17:00。只取第一個數字會錨在開門時間，過了 10:00 之後
// 當天最該盯的期限反而消失，因此這裡把每個時刻各自取出並分類。
// 來源字串一律不改寫——分類只是附加的讀取層。

/** 各類硬時間的顯示標籤。 */
export const HARD_TIME_KINDS = {
  departure: '發車',
  checkin: '報到／抵站',
  lastEntry: '最後入場',
  entry: '入場／場次',
  baggage: '行李',
  open: '開門',
  plan: '時間點',
};

// 由具體到一般：'最後入場' 必須早於 '入場' 判斷，否則會被歸成一般入場。
const HARD_TIME_RULES = [
  [/最後入場|末入場|最後入園|最晚入場|最後點餐/, 'lastEntry'],
  [/發車|開車|啟程|起飛/, 'departure'],
  [/報到|安檢|集合|卡位|前抵|抵達|抵\s|進站|登機|櫃檯/, 'checkin'],
  [/入場|場次|導覽|開演|秀|表演|預約/, 'entry'],
  [/取行李|寄放|行李/, 'baggage'],
  [/開門|開館|開放/, 'open'],
];

// 斷句符號：時刻的語意只看緊鄰的那一段，跨過標點就是另一件事。
// 少了這個切分，'辛德勒工廠 17:30 入場（最後入場 18:30）' 的 17:30
// 會讀到後面的「最後入場」而被誤判成期限。
const HARD_TIME_STOP = /[、，,；;。（）()·　\n]/;

function classifyHardTime(context) {
  for (const [pattern, kind] of HARD_TIME_RULES) {
    if (pattern.test(context)) return kind;
  }
  return null;
}

/**
 * 取出句中全部時刻並各自分類。
 * 回傳 [{ minutes, hhmm, kind, kindLabel, detail, text }]，沒有時刻回空陣列。
 */
export function parseHardTimes(raw) {
  const text = String(raw ?? '').trim();
  if (!text) return [];

  const pattern = /(\d{1,2}):(\d{2})/g;
  const found = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const minutes = toMinutes(match[0]);
    if (minutes !== null) found.push({ minutes, start: match.index, end: match.index + match[0].length });
  }

  return found.map((item, index) => {
    const after = text.slice(item.end, index + 1 < found.length ? found[index + 1].start : text.length)
      .split(HARD_TIME_STOP)[0];
    const beforeParts = text.slice(index === 0 ? 0 : found[index - 1].end, item.start).split(HARD_TIME_STOP);
    const before = beforeParts[beforeParts.length - 1];
    const kind = classifyHardTime(after) || classifyHardTime(before) || 'plan';
    return {
      minutes: item.minutes,
      hhmm: formatMinutes(item.minutes),
      kind,
      kindLabel: HARD_TIME_KINDS[kind],
      detail: (after.trim() || before.trim()),
      text,
    };
  });
}

/** 期限型的時刻才需要推導「該幾點開始移動」；開門、行李等不是。 */
export const HARD_TIME_DEADLINES = new Set(['departure', 'checkin', 'lastEntry', 'entry']);
