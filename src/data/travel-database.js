import { days as itineraryDays, stay, todoGroups } from './trip.js';
import { attractionTicketSummary } from '../lib/todo-status.mjs';
import { dayDining, dayMeals } from './day-dining.js';
import { diningPlaces } from './dining-places.js';
import { venueAddress } from '../lib/venues.mjs';
import { auschwitzBus, segments, lajkonikFare, lajkonikInboundWord } from './rail.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// 景點票券的訂票狀態由待辦正本（trip.js todoGroups）推導，不手寫。
const attractionTickets = attractionTicketSummary(todoGroups);

const overridePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'travel-database.sync.json');
const syncMeta = readSyncOverrides();

// 精煉切片 3 已把 Lajkonik 巴士與四段城際火車的時刻、票價收斂進 rail.js，但
// 這個檔案裡還留了幾處手抄的 Lajkonik 去程時刻／票價與 EIP 1306 發車時刻
// （切片 4b 補的殘留，見 data-audit.md 切片 4 說明）；改用 rail.js 的資料，
// 不再另打一份第二份數字。
const lajkonikOutboundAdopted = auschwitzBus.outbound.services.find(item => item.decision === '採用');
const lajkonikOutboundRejected = auschwitzBus.outbound.services.find(item => item.decision === '不採用');
const eip1306 = segments.find(item => item.id === 'eip-1306');

// 自由行資料庫：公開事實與私人待填狀態分開，供後續首頁、每日操作卡與 SOS 頁共用。
// 私人項目只記錄完成狀態，絕不放入訂位代碼、護照、保單或付款資料。

export const statusLabels = {
  verified: '已查證',
  recheck: '出發前重查',
  pending: '待確認',
  'private-required': '需填私人資料',
};

export const databaseSections = [
  { id: 'entry', label: '入境與出發' },
  { id: 'aviation', label: '航空與行李' },
  { id: 'rail', label: '鐵路與轉乘' },
  { id: 'connectivity', label: '網路與離線' },
  { id: 'money', label: '付款與現金' },
  { id: 'medical', label: '醫療與保險' },
  { id: 'emergency', label: '緊急與護照' },
  { id: 'luggage', label: '行李寄放' },
  { id: 'calendar', label: '日曆與營業' },
  { id: 'tax-free', label: '退稅' },
  { id: 'accessibility', label: '無障礙與體力' },
  { id: 'daily-basics', label: '每日基本需求' },
  { id: 'dining', label: '用餐' },
  { id: 'documents', label: '旅程文件' },
  { id: 'accommodation', label: '住宿' },
];

const databaseEntriesBase = [
  {
    id: 'entry-etias-and-passport', section: 'entry', category: 'document', cityKey: 'PL',
    title: '護照、EES 與 ETIAS 出發前複查',
    summary: '10/06 EU 官方確認 EES 已於 4/10 全面運作，短期入境非 EU 旅客首次須在邊境登錄護照及生物辨識。ETIAS 尚未運作、不收申請，確切日期另公告。護照效期須在離開申根區後至少 3 個月，且入境時簽發未滿 10 年；旅客須自行核對私人證件。',
    status: 'recheck', sourceUrl: 'https://home-affairs.ec.europa.eu/policies/schengen/smart-borders_en', verifiedAt: '2026-10-06', recheckAt: '2026-10-19',
    offlineNote: '備妥護照、回程票、住宿與保險證明；10/19 前複查 EU 狀態，10/20 最終確認 EU 官方 EES／ETIAS 狀態。10/25 首次入境留 EES 登錄與排隊時間，不將私人護照核對視為已完成。', private: false,
  },
  {
    id: 'aviation-baggage-rules', section: 'aviation', category: 'transit', cityKey: 'ROUTE',
    title: '航空行李官方規則',
    summary: '10/22 電子機票各段標示託運 25 kg，實際直掛終點依報到櫃檯行李條確認。行動電源：香港航空／Qatar／EVA 均每人最多 2 個、只能手提且不放頭頂；Qatar 各 ≤100 Wh、機上不得為行動電源充電；香港航空／EVA 另禁止機上使用。各航司來源見行前提醒頁。',
    status: 'verified', sourceUrl: 'https://www.qatarairways.com/en/travel-alerts.html', verifiedAt: '2026-10-06', recheckAt: null,
    offlineNote: '本趟準備每人最多 2 個、各 ≤100 Wh，保護接點且規格清楚；保存各承運航司規則。本次免費行李額度與直掛仍待電子機票確認。', private: false,
  },
  {
    id: 'aviation-trip-baggage-confirmation', section: 'aviation', category: 'transit', cityKey: 'ROUTE',
    title: '本次航班時刻、行李額度與直掛確認',
    summary: '本次電子機票的實際起降時刻、行李額度、是否直掛及 HKG、DOH 轉機程序，必須由旅客的訂單與航空公司確認。網站上的 QR 260 於 10/31 14:40 起飛屬冬季班表，與目前公開的夏季班表不同，Day 8 全天時間表都建立在這個時刻上，務必以電子機票核對。',
    status: 'private-required', sourceUrl: null, verifiedAt: null, recheckAt: '2026-10-22',
    offlineNote: '離線保存電子機票；先核對六段航班（含轉機共 3 段去程、3 段回程）的起降時刻與轉機時間是否與行程一致，再於出發前 48 小時核對報到、航廈、座位、行李直掛與特殊餐。', private: true,
  },
  {
    id: 'aviation-missing-baggage', section: 'aviation', category: 'safety', cityKey: 'WAW',
    title: '行李未到處理',
    summary: '託運行李未出現在轉盤時，應在離開行李提領區前向最後承運航空申報，建立 PIR 並保存行李牌與收據。',
    status: 'verified', sourceUrl: 'https://www.iata.org/en/programs/ops-infra/baggage/passenger-baggage-rules/', verifiedAt: '2026-08-08', recheckAt: null,
    offlineNote: '先到 baggage service；記下 PIR，再提供第一晚住宿配送地址。', private: false,
  },
  {
    id: 'rail-delay-rights', section: 'rail', category: 'transit', cityKey: 'ROUTE',
    title: '鐵路延誤旅客權益',
    summary: '預計延誤 60 分鐘以上時，EU 官方規則提供退款、改道或改日等選項，但適用細節仍要看票券與營運人。',
    status: 'verified', sourceUrl: 'https://europa.eu/youreurope/citizens/travel/passenger-rights/rail/index_en.htm', verifiedAt: '2026-08-08', recheckAt: null,
    offlineNote: '保留車票、延誤證明、收據與營運人通知。', private: false,
  },
  {
    id: 'rail-trip-tickets', section: 'rail', category: 'transit', cityKey: 'ROUTE',
    title: '本次城際車票',
    summary: '10/22 票券截圖確認四段均已購票，發到時間、艙等與截圖金額見交通主檔；10/25 改為 EIP 1306 西站 15:45–18:12，座位見車票。金額涵蓋人數看完整票券。',
    status: 'pending', sourceUrl: null, verifiedAt: '2026-10-22', checkedAt: '2026-10-22', recheckAt: '2026-10-24',
    offlineNote: '請在臺灣出發日 10/24，也就是 10/25 首段城際火車前一日，保存四段車票離線副本並核對票面詳細資料；這是自行設定的查核期限，非官方期限。搭車前用 Passenger Portal 查月台與異動。', private: false,
  },
  {
    id: 'rail-station-directory', section: 'rail', category: 'transit', cityKey: 'PL',
    title: '車站即時資訊與設施',
    summary: 'PKP PLK Passenger Portal 的車站目錄提供站址、座標、抵離站資訊及部分無障礙設施，可作為四大車站的動態入口。',
    status: 'recheck', sourceUrl: 'https://portalpasazera.pl/en/KatalogStacji', verifiedAt: '2026-08-08', recheckAt: '2026-10-24',
    offlineNote: '離線保存車站全名與純文字地址；月台與設施以當天頁面為準。', private: false,
  },
  {
    id: 'connectivity-prepaid-registration', section: 'connectivity', category: 'practical', cityKey: 'PL',
    title: '波蘭預付 SIM 登記',
    summary: '波蘭預付 SIM 完成登記前不會啟用；外國人可使用護照或居留卡資料登記。未選定方案前不填虛構流量或價格。',
    status: 'pending', sourceUrl: 'https://cik.uke.gov.pl/gfx/cik/userfiles/_public/ukraina_poradniki/uslugi_telekomunikacyjne_en.pdf', verifiedAt: '2026-08-08', recheckAt: '2026-10-24',
    offlineNote: '先下載四城地圖、票券 PDF、住宿與車站地址；eSIM 先確認手機支援且已解鎖。', private: false,
  },
  {
    id: 'money-pln-and-dcc', section: 'money', category: 'practical', cityKey: 'PL',
    title: 'PLN 付款與拒絕 DCC',
    summary: '波蘭法定貨幣為 złoty 與 grosz。商店或 ATM 提供動態貨幣轉換時，應顯示幣別、匯率與費用，持卡人可拒絕轉換。',
    status: 'verified', sourceUrl: 'https://www.visa.com/en-us/personal/travel/dynamic-currency-conversion', verifiedAt: '2026-08-08', recheckAt: null,
    offlineNote: '付款與提款優先選 PLN；保留少量現金並把備用卡與現金分開收。', private: false,
  },
  {
    id: 'medical-insurance-and-emergency', section: 'medical', category: 'safety', cityKey: 'PL',
    title: '旅平險與緊急就醫',
    summary: '波蘭緊急狀況可撥 112；醫療急症可撥 999。保險公司、保單號與海外救援電話必須由旅客自行填入私人資料（可填在自由行資料庫 SOS 區的「我的私人資料」，只存在這支手機）。',
    status: 'private-required', sourceUrl: 'https://www.gov.pl/web/mswia-en/emergency-number-112', verifiedAt: '2026-08-08', recheckAt: '2026-10-21',
    offlineNote: '危及生命先撥 112 或 999，接著聯絡保險救援並保存診斷、處方、收據與付款證明。', private: true,
  },
  {
    id: 'emergency-taiwan-representative', section: 'emergency', category: 'safety', cityKey: 'WAW',
    title: '駐波蘭台北代表處',
    summary: '地址：30th Floor, Ul. Emilii Plater 53, 00-113 Warsaw, Poland。辦公室電話 +48 22 213 0060；急難救助電話 +48 668 027 574，僅限生命安全等緊急狀況。',
    status: 'verified', sourceUrl: 'https://www.mofa.gov.tw/CountryInfo.aspx?CASN=1&n=164&s=124&sms=33&tabs=08617EE9DB3C61E3', verifiedAt: '2026-08-08', recheckAt: '2026-10-24',
    offlineNote: '離線保存純文字地址與電話；領務事項於辦公時間聯絡。', private: false,
  },
  {
    id: 'emergency-lost-passport', section: 'emergency', category: 'safety', cityKey: 'PL',
    title: '國外遺失護照步驟',
    summary: '護照遺失時，先向當地警察報案取得證明，再聯絡駐外館處申請補發；急於返國可詢問入國證明書。',
    status: 'verified', sourceUrl: 'https://www.boca.gov.tw/fp-24-6772-acc24-1.html', verifiedAt: '2026-08-08', recheckAt: null,
    offlineNote: '把護照影本與照片與正本分開保存。', private: false,
  },
  {
    id: 'luggage-storage-transition', section: 'luggage', category: 'practical', cityKey: 'ROUTE',
    title: '轉場日行李寄放',
    summary: '10/29 使用 Poznań Główny 置物櫃（24 小時，小件約 20 zł、大件約 25 zł、支援感應付款，第三方 TripAdvisor，出發前再確認）；備案 Radical Storage Dworcowa 1（06:00–21:00、約 15 zł，出發前再確認）。其他轉場日優先確認旅館寄放。費率、尺寸與空位皆為動態資料，不預先保證。',
    status: 'private-required', sourceUrl: 'https://portalpasazera.pl/en/KatalogStacji', verifiedAt: '2026-08-08', recheckAt: '2026-10-20',
    offlineNote: '每個轉場日先確認最晚領取時間、費用與件數；10/29 離線保留車站置物櫃與 Radical Storage 備案；公寓官方未寫能否寄放。', private: true,
  },
  {
    id: 'calendar-sunday-and-all-saints', section: 'calendar', category: 'practical', cityKey: 'PL',
    title: '非營業週日與諸聖節前夕',
    summary: '10/25 為非營業週日，多數一般商店不得營業；10/31 為諸聖節前夕，交通、人潮與店家營業可能調整。餐廳與各店仍須逐店查證。',
    status: 'recheck', sourceUrl: 'https://www.gov.pl/web/family/trade-on-sundays', verifiedAt: '2026-08-08', recheckAt: '2026-10-18',
    offlineNote: '10/25 凌晨 03:00 歐洲改為冬令時間（時鐘撥回 02:00），手機會自動更新，但紙本與手錶要自行確認。', private: false,
  },
  {
    id: 'tax-free-vat-refund', section: 'tax-free', category: 'document', cityKey: 'WAW',
    title: 'TAX FREE 出口確認',
    summary: '旅客須在 EU 外有永久居所、向合格店家取得文件，單一 TAX FREE 文件含稅金額至少 200 PLN，並在期限前以未使用商品隨身行李帶離 EU。',
    status: 'verified', sourceUrl: 'https://www.podatki.gov.pl/pozostale/tax-free-vat-refund-vap-oss-i-ioss/zwrot-vat-dla-podroznych', verifiedAt: '2026-08-08', recheckAt: '2026-10-31',
    offlineNote: '購買時索取文件；離境前備妥商品、護照、登機資料與單據。託運商品先完成需要的海關查驗。', private: false,
  },
  {
    id: 'accessibility-station-assistance', section: 'accessibility', category: 'practical', cityKey: 'PL',
    title: '車站無障礙與協助',
    summary: 'PKP PLK Passenger Portal 可查部分車站對行動不便旅客的設施與可達性。搭 PKP Intercity 需要協助者，官網要求至少在出發前 24 小時申請（舊頁面仍寫 48 小時，保守以 48 小時提出），24 小時客服 +48 42 205 45 31 或 19 757。',
    status: 'recheck', sourceUrl: 'https://www.intercity.pl/en/wyd/informacje-dla-niepelnosprawnych.html', verifiedAt: '2026-10-12', recheckAt: '2026-10-22',
    offlineNote: '每天保留少走路版：叫車或低地板交通，並在出發前確認電梯與協助狀態。', private: false,
  },
  {
    id: 'daily-basics-krakow-water', section: 'daily-basics', category: 'practical', cityKey: 'KRK',
    title: '克拉科夫飲水與每日離線包',
    summary: '克拉科夫城市供水符合波蘭與 EU 飲用標準，可直接飲用而無須煮沸；若住宿告知建物管線有問題，或水色、氣味異常，則不要飲用並詢問櫃檯。裝置是否可用 230V 要看充電器 INPUT。',
    status: 'verified', sourceUrl: 'https://wodociagi.krakow.pl/en/water-quality/facts-and-myths-about-tap-water', verifiedAt: '2026-08-08', recheckAt: null,
    offlineNote: '每日晚間充電、下載隔日票券與地圖，並截圖月台及集合點。', private: false,
  },
  {
    id: 'daily-basics-wroclaw-water', section: 'daily-basics', category: 'practical', cityKey: 'WRO',
    title: '樂斯拉夫飲水與每日離線包',
    summary: '樂斯拉夫城市供水受持續監測，符合波蘭、EU 及 WHO 標準；若住宿告知建物管線有問題，或水色、氣味異常，則不要飲用並詢問櫃檯。裝置是否可用 230V 要看充電器 INPUT。',
    status: 'verified', sourceUrl: 'https://www.mpwik.wroc.pl/csr-2/pij-kranowke/', verifiedAt: '2026-08-08', recheckAt: null,
    offlineNote: '每日晚間充電、下載隔日票券與地圖，並截圖月台及集合點。', private: false,
  },
  {
    id: 'dining-reservation-and-backup', section: 'dining', category: 'dining', cityKey: 'ROUTE',
    title: '餐廳現場入座與當日營業',
    summary: 'Soul Kitchen 10/30 18:00–20:00、2 人已訂妥；其他行程餐廳維持現場入座。出門前看當日營業狀態，客滿就改每餐的同區或便利備案，不從其他分店套用時間。',
    status: 'pending', sourceUrl: null, verifiedAt: null, recheckAt: '2026-10-24',
    offlineNote: '保存過敏與飲食需求的波蘭文／英文卡，但不放到公開網站。', private: false,
  },
  {
    id: 'documents-travel-registration', section: 'documents', category: 'document', cityKey: 'ROUTE',
    title: '入境文件包與旅外登錄',
    summary: '免簽入境可能被要求出示住宿、行程、回程票與財力證明；出發前應完成旅外國人動態登錄並讓緊急聯絡人持有行程與住宿資訊。',
    status: 'private-required', sourceUrl: 'https://www.boca.gov.tw/sp-foof-countrycp-01-62-aa8d5-02-1.html', verifiedAt: '2026-08-08', recheckAt: '2026-10-21',
    offlineNote: '列印或離線保存住宿、回程票、保險與完整行程；不要公開證件號碼與付款證明。', private: true,
  },
  {
    id: 'documents-attraction-tickets', section: 'documents', category: 'document', cityKey: 'ROUTE',
    title: attractionTickets.title,
    summary: `${attractionTickets.text}仍須核對私人票券的參觀日期、入場時段、語言、人數與集合點；公開版不保存票券條碼、姓名或付款資料。`,
    status: 'private-required', sourceUrl: null, verifiedAt: null, recheckAt: '2026-09-24',
    offlineNote: '先保存已訂 Auschwitz 與鹽礦的票券 PDF 與證件；一併核對日期、時段、語言、人數、官方地址、集合點與取消規則，存入私人離線包。', private: true,
  },
  {
    id: 'accommodation-confirmations', section: 'accommodation', category: 'practical', cityKey: 'ROUTE',
    title: '當地 6 晚住宿；10/24 這晚因航班改期不入住，已通知飯店；不退款（旅客 10/24 確認）',
    summary: '保留原 5 筆訂單紀錄共 7 晚；改班後 10/24 不在波蘭，當地實際住宿為 6 晚，原 Metropol 首晚：10/24 這晚因航班改期不入住，已通知飯店；不退款（旅客 10/24 確認）。原訂單：華沙 Hotel Metropol 兩段住宿（10/24–10/25、10/29–10/31）、克拉科夫 ibis budget Krakow Stare Miasto、樂斯拉夫 Piast、波茲南 Poznan Apartments Towarowa。公開版不保存訂房代碼、姓名或付款證明。',
    status: 'private-required', sourceUrl: null, verifiedAt: null, recheckAt: '2026-10-10',
    offlineNote: '公開版已放飯店官網地址；另將 5 張訂房確認存入私人離線包，並向各住宿確認寄放行李與晚到方式。', private: true,
  },
];

function readSyncOverrides() {
  try {
    if (!fs.existsSync(overridePath)) return { entries: new Map(), syncRows: [] };
    const raw = fs.readFileSync(overridePath, 'utf8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return { entries: new Map(), syncRows: [] };

    const entries = new Map();
    const syncRows = [];
    for (const row of parsed) {
      if (!row || typeof row.id !== 'string' || !row.id.trim()) continue;
      const normalized = normalizeSyncRow(row);
      if (!normalized) continue;
      entries.set(normalized.id, normalized);
      syncRows.push(normalized);
    }
    return { entries, syncRows };
  } catch (error) {
    throw new Error(`無法讀取 dashboard 同步覆寫：${error.message}`);
  }
}

export function normalizeSyncRow(row) {
  const rowId = String(row.id).trim();
  if (!rowId) return null;

  const status = typeof row.status === 'string' ? row.status.trim() : null;
  const hasPrivateValue = Object.hasOwn(row, 'private')
    && row.private !== null
    && String(row.private).trim() !== '';
  const privateRaw = hasPrivateValue ? row.private : undefined;
  const privateValue =
    typeof privateRaw === 'boolean'
      ? privateRaw
      : String(privateRaw || '').trim().toLowerCase();

  let privateFlag;
  if (privateRaw !== undefined) {
    if (typeof privateRaw === 'boolean') {
      privateFlag = privateRaw;
    } else if (['true', '1', 'y', 'yes', '是'].includes(privateValue)) {
      privateFlag = true;
    } else if (['false', '0', 'n', 'no', '否'].includes(privateValue)) {
      privateFlag = false;
    } else {
      throw new Error(`${rowId} 的 private 值無法辨識`);
    }
  }

  const parsed = {
    id: rowId,
    status: status || null,
    sourceUrl: row.sourceUrl != null ? (String(row.sourceUrl).trim() || null) : null,
    verifiedAt: row.verifiedAt != null ? (String(row.verifiedAt).trim() || null) : null,
    recheckAt: row.recheckAt != null ? (String(row.recheckAt).trim() || null) : null,
    checkedAt: row.checkedAt != null ? (String(row.checkedAt).trim() || null) : null,
    summary: row.summary != null ? (String(row.summary).trim() || null) : null,
    offlineNote: row.offlineNote != null ? (String(row.offlineNote).trim() || null) : null,
    private: privateFlag,
  };

  return parsed;
}

export function applyDashboardSync(baseEntries, overrideEntries = syncMeta.entries) {
  if (!overrideEntries.size) return baseEntries;
  return baseEntries.map((entry) => {
    const patch = overrideEntries.get(entry.id);
    if (!patch) return entry;
    const privateFlag = patch.private ?? entry.private;
    return {
      ...entry,
      status: patch.status || entry.status,
      private: privateFlag,
      sourceUrl: patch.sourceUrl !== null ? patch.sourceUrl : entry.sourceUrl,
      verifiedAt: patch.verifiedAt !== null ? patch.verifiedAt : entry.verifiedAt,
      recheckAt: patch.recheckAt !== null ? patch.recheckAt : entry.recheckAt,
      checkedAt: patch.checkedAt !== null ? patch.checkedAt : entry.checkedAt,
      summary: privateFlag ? entry.summary : patch.summary || entry.summary,
      offlineNote: privateFlag ? entry.offlineNote : patch.offlineNote || entry.offlineNote,
    };
  });
}

export const databaseEntries = applyDashboardSync(databaseEntriesBase);
export const syncRows = syncMeta.syncRows;

// `checkedAt` 表示本次盤查日期；它不等同「已查證」，pending/private-required 仍維持原狀態。
for (const entry of databaseEntries) {
  entry.checkedAt ||= entry.id === 'accommodation-confirmations' ? '2026-08-10' : '2026-08-08';
}

const standardNightChecklist = [
  '手機、行動電源、相機與耳機充電',
  '將隔日火車／景點票券 PDF 存到離線資料夾',
  '截圖隔日集合點、車站入口與月台查詢頁',
  '重查隔日天氣、場館營運與市區交通異動',
];

const stayById = new Map(stay.map(item => [item.id, item]));
const accommodationAddress = (id, stepLabels = []) => {
  const booking = stayById.get(id);
  if (!booking) throw new Error(`找不到住宿資料：${id}`);
  return {
    name: booking.name,
    address: booking.address,
    url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.addressVerified ? `${booking.name}, ${booking.address}` : `${booking.name}, ${booking.city}`)}`,
    note: booking.note,
    reliable: booking.addressVerified,
    entranceNote: !booking.addressVerified
      ? '完整門牌尚待飯店第一方或私人訂房確認核對。'
      : id === 'poznan-towarowa'
      ? '先到 Towarowa 37/201 接待處取鑰匙；實際公寓門牌依私人訂房確認。'
      : '抵達後由飯店主入口前往接待櫃檯，訂房代碼僅保留於私人離線資料。',
    officialUrl: booking.officialUrl,
    stepLabels: booking.addressVerified ? stepLabels : [],
  };
};

// officialPlaceUrls／entranceNotesByName 兩份表（景點官網、現場怎麼進入）與
// venueCard() 呼叫本身重複打的街道地址，精煉切片 4b 前是三份各自維護的事實
// （見 data-audit.md §2-E）。三者已併入 src/data/venues.js 的單一景點／地點
// 主檔，這裡改由 src/lib/venues.mjs 的 venueAddress() 取得；下面只留
// addressStepLabels——它把「行程步驟 label」對回「地址卡」，是這個資料庫檔案
// 自己的呈現邏輯（哪個步驟該連到哪張地址卡），不是重複的地點事實，暫時保留
// 用字串鍵（displayName）比對。
const addressStepLabels = {
  '華沙蕭邦機場': ['抵蕭邦機場', '抵 Chopin 第一航廈', '退稅文件 + 報到 + 安檢', '★ QR 260 起飛'],
  'Warszawa Centralna': ['退房 → Śródmieście（S2）或 Warszawa Centralna（S3）', '退房後前往上車站', '抵華沙中央車站', '抵 Warszawa Centralna'],
  '華沙皇家城堡': ['★ 城堡廣場（白天版）皇家城堡外觀＋聖安妮教堂外觀'],
  '華沙老城市場廣場': ['★ 老城廣場', 'Kanonia 許願鐘 → 聖若望大教堂'],
  'Krakowskie Przedmieście': ['哥白尼紀念碑＋Staszic 宮', '★ 聖十字教堂', '華沙大學正門', '訪親會教堂＋普魯斯紀念碑', '★ 總統府＋Hotel Bristol 外觀'],
  '瓦津基水上宮殿': ['★ 瓦津基公園', '★ 瓦津基 · 水上宮殿'],
  'Kraków Główny': ['抵 Kraków Główny', 'SKA1 回 Kraków Główny'],
  '瓦維爾大教堂': ['★ 瓦維爾大教堂'],
  '瓦維爾皇家城堡': ['★ Wawel 城堡短路線'],
  '辛德勒工廠': ['★ 辛德勒工廠'],
  '中央廣場 Rynek Główny': ['★ 中央廣場 + 聖瑪利亞', '★ 中央廣場 + 紡織會館'],
  '聖瑪利亞聖殿': ['★ 中央廣場 + 聖瑪利亞'],
  '紡織會館 Sukiennice': ['紡織會館 Sukiennice 快速一覽', '紡織會館 Sukiennice 採購收尾', '★ 中央廣場 + 紡織會館'],
  'Plac Nowy': [],
  'Auschwitz I 訪客服務中心／入口': ['抵 Auschwitz I', '★ 英文官方導覽（已訂妥）', '導覽結束'],
  '維利奇卡鹽礦': ['★ Wieliczka 鹽礦 Tourist Route 英文團'],
  'Wrocław Główny': ['抵 Wrocław Główny'],
  '拉茨瓦維採全景畫（外觀）': ['前往 Panorama · 全景畫圓形館外觀'],
  '百年廳 Hala Stulecia': [],
  '樂斯拉夫中央廣場': ['★ 中央廣場 Rynek + 紡織會館'],
  '樂斯拉夫主教座堂': ['★ 座堂橋 → 座堂島'],
  'Poznań Główny': ['抵 Poznań Główny', '抵 Poznań Główny 月台'],
  '波茲南主教座堂': ['★ 教堂島 Ostrów Tumski'],
  '波茲南市政廳': ['廣場卡正面位置', '★ 山羊鐘樓秀'],
  '帝王城堡（外觀）': ['★ 聖馬丁街帝王區'],
  'Stary Browar': ['★ Stary Browar'],
};

// venueId 對 src/data/venues.js 的地點主檔；displayName 是這個步驟要顯示的
// 名稱（多數與 venue.name 相同，但少數地址卡沿用比較口語的稱呼，例如
// 「瓦維爾皇家城堡」對到 venues.js 的 krakow-wawel-castle），note 是每個
// call site 各自的當下提醒文字，不是地點本身的固定事實。
const venueCard = (venueId, displayName, note = '') => {
  const venue = venueAddress(venueId);
  return {
    name: displayName,
    address: venue.address,
    url: venue.url,
    note,
    reliable: Boolean(venue.officialUrl),
    entranceNote: venue.entranceNote || (venue.officialUrl ? '抵達後依官網預約資訊與現場入口標示進入。' : '待班次、分店或現場集合點確認。'),
    officialUrl: venue.officialUrl || null,
    stepLabels: addressStepLabels[displayName] || [],
  };
};

export const dayOperations = {
  1: {
    cityKey: 'warsaw',
    note: '桃園出發日，今天仍未抵波蘭；此處波蘭資料僅供抵達後參考。',
    addresses: [{ name: '桃園國際機場第二航廈', address: 'TPE 第二航廈（依 10/22 電子機票）', url: 'https://www.taoyuan-airport.com/', reliable: true, officialUrl: 'https://www.taoyuan-airport.com/', entranceNote: '依機票至第二航廈，香港航空報到櫃檯與登機門看當日電子牌。', stepLabels: ['桃園第二航廈報到'] }],
    navigation: [{ mode: '航空', route: 'TPE 第二航廈 → HKG 第一航廈', action: 'HX 283 10/24 21:45–23:45，香港轉機 1 小時 40 分接 QR 815；依登機證與現場登機門。' }],
    dailyAlerts: ['原 10/24 華沙觀光不再執行；Hotel Metropol 原首晚訂單：10/24 這晚因航班改期不入住，已通知飯店；不退款（旅客 10/24 確認）。', '新航班報到與行李直掛依櫃檯確認，電子機票及登機證存離線。'],
    nightChecklist: ['香港抵達後直接依轉機指標前往 QR 815 登機門，不安排購物'],
  },
  2: {
    cityKey: 'krakow',
    note: '13:10 抵華沙，15:45 西站 EIP 1306，18:12 抵克拉科夫；轉乘不能保證。',
    addresses: [
      venueCard('warsaw-chopin-airport', '華沙蕭邦機場', '13:10 抵達後先入境、提行李，再直接轉西站。'),
      venueCard('warsaw-zachodnia-station', 'Warszawa Zachodnia', '15:45 EIP 1306 上車站是西站，不是 Centralna。'),
      venueCard('krakow-glowny-station', 'Kraków Główny'),
      accommodationAddress('krakow-stare-miasto', ['ibis 入住 · 放行李']),
    ],
    navigation: [
      { mode: '機場鐵路／計程車', route: '華沙蕭邦機場 → Warszawa Zachodnia', action: '入境與提行李後用 Jakdojade 查直達西站班次；等車過久則比較官方計程車或 Bolt 的即時預估，不繞中央車站或 Metropol。15:05 還沒走出行李大廳 → 在 PKP Intercity App 改搭當天下一班 EIP 到克拉科夫（班次以 App 當下顯示為準）。' },
      { mode: 'PKP', route: 'Warszawa Zachodnia → Kraków Główny', action: `EIP 1306 ${eip1306.dep}–${eip1306.arr}，1 等；座位見車票，月台看現場電子牌。` },
      { mode: '步行／叫車', route: 'Kraków Główny → ibis → Hankki', action: '18:12 抵站、約 200 公尺步行約 5 分入住 ibis，約 18:45 搭車往 Zabłocie 19A。19:15 晚餐保留，延誤就改近站快食。' },
    ],
    dailyAlerts: ['13:10 落地至 15:45 火車只有 2 小時 35 分，入境、行李或航班延誤可能接不上；無法保證免費改搭下一班。', '原 Wawel、辛德勒與 Pimiento 白天安排不再排入。10/25 是非營業週日、多數商店不開：10/26 早餐與午餐請在杜哈機場、華沙蕭邦機場或西站先買好；克拉科夫晚上採買只當備案（週日營業時間未查證）。'],
    nightChecklist: [...standardNightChecklist, '確認 Auschwitz 電子入場證、護照與往返車票，並確認 10/26 早餐、午餐與水已備妥（沒買齊再問旅館輕食）', '明早 07:15 早餐、07:35 出門，08:10 前到 MDA 下層 D9'],
  },
  3: {
    cityKey: 'krakow',
    note: '長時間導覽日，保留補水、保暖與醫療聯絡卡。',
    addresses: [
      venueCard('krakow-mda-bus-station', 'Kraków MDA 客運站', `Kraków Główny 後方步行約 5 分。已購的 10/26 ${lajkonikOutboundAdopted.dep} 班次票面標示下層（dolna płyta）${lajkonikOutboundAdopted.bay} 站位；站位仍以當日電子看板為準。`),
      venueCard('krakow-auschwitz-i-entrance', 'Auschwitz I 訪客服務中心／入口'),
      venueCard('krakow-auschwitz-ii-birkenau', 'Auschwitz II–Birkenau'),
      accommodationAddress('krakow-stare-miasto'),
    ],
    navigation: [
      { mode: 'Lajkonik 巴士', route: 'Kraków MDA ↔ Oświęcim Muzeum Auschwitz', get action() { return `去程已購票：${lajkonikOutboundAdopted.dep} 由 ul. Bosacka 18 下層 D9 站位發車、${lajkonikOutboundAdopted.arr} 抵 Więźniów Oświęcimia 55，${lajkonikOutboundAdopted.dur}；業者要求發車前 15 分鐘到站牌，距 10:00 到場要求只剩 10 分鐘。回程${lajkonikInboundWord()}：15:30 → 16:55，2 張全票 47,50 zł；15:15 前到 Więźniów Oświęcimia 55 站牌。14:00 班在導覽結束前開走；16:30 備案需另買新票（已購票不能改期）。`; } },
      { mode: '導覽接駁', route: 'Auschwitz I → Birkenau', action: '參加官方導覽時依當日工作人員指示搭接駁車，不自行跳過集合點。' },
    ],
    dailyAlerts: [
      '所有入場證必須事先線上取得；至少提前 30 分鐘抵達安檢。',
      'Mr. Jerry 10/26 18:00 已訂位（2 位；威靈頓到店再點，無訂金）。',
      '行程內容沉重且戶外時間長，帶水、防雨保暖層，晚間不再加排高強度活動。',
    ],
    nightChecklist: [...standardNightChecklist, '確認鹽礦 09:00 英文團票券 PDF 已存離線、06:55 退房寄行李、07:55 前到 Kraków Główny', '今晚在 Lajkonik 麵包店或 Żabka 備妥明早麵包，Sztolnia 午餐 11:00 開門、未訂位、現場入座，查 Samarqand 接單與車站 KFC 備案'],
  },
  4: {
    cityKey: 'wroclaw',
    note: '退房後先確認行李寄放，再依實際 PKP 班次轉場。',
    addresses: [
      venueCard('krakow-glowny-station', 'Kraków Główny'),
      venueCard('krakow-wieliczka', '維利奇卡鹽礦'),
      { name: 'Sztolnia Wieliczka', address: diningPlaces['wieliczka-sztolnia'].address, url: diningPlaces['wieliczka-sztolnia'].map, officialUrl: diningPlaces['wieliczka-sztolnia'].sourceUrl, reliable: true, entranceNote: '依地址與現場招牌找入口。', stepLabels: ['午餐 · Sztolnia Wieliczka 豬肋排'] },
      { name: 'Obwarzanek Krakowski - Tunel', address: diningPlaces['krakow-obwarzanek-tunel'].address, url: diningPlaces['krakow-obwarzanek-tunel'].map, officialUrl: diningPlaces['krakow-obwarzanek-tunel'].sourceUrl, reliable: true, entranceNote: '依地址與現場招牌找入口。', stepLabels: ['買圈餅 · Obwarzanek Krakowski - Tunel'] },
      venueCard('wroclaw-glowny-station', 'Wrocław Główny'),
      accommodationAddress('krakow-stare-miasto', ['退房 + 行李寄旅館', '回 ibis 取行李、休息']),
      accommodationAddress('wroclaw-piast', ['Piast 放行李']),
    ],
    navigation: [
      { mode: 'KMŁ', route: 'Kraków Główny ↔ Wieliczka Rynek-Kopalnia', action: 'SKA1 去程 08:08 → 08:31（或 07:38 → 08:01），步行 5–8 分，08:45 前到 Daniłowicz Shaft；回程 13:41 → 14:03（22 分鐘），備案 14:11／14:41，最晚 15:11。70 分鐘 KMK+KMŁ 聯票 10／5 PLN，去回各買一張，車上有售票機。' },
      { mode: 'PKP', route: 'Kraków Główny → Wrocław Główny', action: '已購 IC 3830 16:45，預計 19:50 抵 Wrocław Główny（Koleo）；14:30 從圈餅店走回 ibis（約 3–5 分），16:10 前到站。車廂與座位依票券詳細頁。' },
    ],
    dailyAlerts: [
      '鹽礦全程階梯多、地下約 17–18°C；穿好走防滑鞋並攜薄外套。',
      '克拉科夫→樂斯拉夫已購 IC 3830 16:45；14:30 回 ibis，16:10 前到站。SKA1 回城最晚 15:11，搭這班就跳過圈餅；Sztolnia 肋排份量大，兩人分一份再加湯，13:20 前結帳。',
    ],
    nightChecklist: [...standardNightChecklist, '抵達樂斯拉夫後在 Piast 櫃檯問 12:00 後行李寄放（不行就用 Wrocław Główny 寄物櫃）；IC 260 車票存離線；Poznan Apartments 訊息見待辦「之後聯絡 Poznan Apartments」', '確認 Central Cafe 07:55 早餐供應，準備 Charlotte 備案；MAX 18:10 前離開，18:20 前到站（硬性限制 18:35）'],
  },
  5: {
    cityKey: 'poznan',
    note: '高強度轉場日；晚間先充電並下載隔日資料。',
    addresses: [
      venueCard('wroclaw-glowny-station', 'Wrocław Główny'),
      venueCard('wroclaw-panorama', '拉茨瓦維採全景畫（外觀）', '13:00 午餐結束後前往圓形館，只拍外觀、不入內；13:20 到國家博物館免票進咖啡廳吃甜點。'),
      venueCard('wroclaw-rynek', '樂斯拉夫中央廣場'),
      venueCard('wroclaw-cathedral', '樂斯拉夫主教座堂'),
      venueCard('poznan-glowny-station', 'Poznań Główny'),
      accommodationAddress('wroclaw-piast', ['座堂島結束後回 Piast 取行李']),
      accommodationAddress('poznan-towarowa'),
    ],
    navigation: [
      { mode: '步行', route: '老城 → 午餐 → Panorama → 國家博物館 → Hala Targowa → Słodowa → 沙島 → 座堂島', action: '13:00 午餐結束去 Panorama 外觀，13:20 甜點，15:35 前到 InfoCentrum，17:00 離島；步行時間為 OSM 路由，第三方計算，未含紅綠燈與拍照。' },
      { mode: 'PKP', route: 'Wrocław Główny → Poznań Główny', action: '已購 IC 260 19:10，預計 20:29 抵 Poznań Główny（Koleo）；18:20 前抵站（硬性最晚 18:35）。車廂與座位依票券詳細頁。' },
    ],
    dailyAlerts: [
      "點燈人約 15:20–16:05 之間開始，無固定場次，出發前再確認；官方來源互相矛盾：InfoCentrum 頁說日落前約 30 分（約 16:03），市府報導說冬季約 15:20。15:35 前到 InfoCentrum，17:00 離島；日落約 16:33–16:34。",
    ],
    nightChecklist: [...standardNightChecklist, '確認 10/29 山羊鐘樓卡位路線、波茲南行李寄放與返華沙車票', '照訂房確認拿 Poznan Apartments 鑰匙，預計約 20:45 到（接待處 08:00–22:00、退房 11:00，出發前再確認）；隔天 09:00 離開、09:10 車站置物櫃寄行李（第三方 TripAdvisor，容量出發前再確認），備案 Radical Storage Dworcowa 1；09:25 電車 6、11:00 Manekin 早餐。晚餐 Arirang 出發前再確認，當天先看 Google 地圖營業狀態，20:40 前不能入座改 Złote Tarasy 或 Ćma'],
  },
  6: {
    cityKey: 'warsaw',
    note: '城際火車與華沙住宿均以離線地址備援。',
    addresses: [
      venueCard('poznan-glowny-station', 'Poznań Główny'),
      venueCard('poznan-cathedral', '波茲南主教座堂'),
      venueCard('poznan-town-hall', '波茲南市政廳', '博物館整修閉館，此地點用於 12:00 山羊鐘樓秀外觀。'),
      venueCard('poznan-stary-browar', 'Stary Browar'),
      venueCard('poznan-ck-zamek', '帝王城堡（外觀）', '新行程只在帝王區步行時看外觀，不進去、不用買聯票。'),
      venueCard('warsaw-centralna-station', 'Warszawa Centralna'),
      {
        name: diningPlaces['poznan-rogal'].name,
        address: diningPlaces['poznan-rogal'].address,
        url: diningPlaces['poznan-rogal'].map,
        note: '週四 09:00–20:00（第三方，出發前再確認）；售完改 Cukiernia Kandulski（Plac Ratajskiego 1，週四 09:00–17:00）。',
        reliable: true,
        entranceNote: '依店家地址與現場招牌找入口；營業與售完狀況須現場確認。',
        officialUrl: diningPlaces['poznan-rogal'].sourceUrl,
        stepLabels: ['★ 聖馬丁牛角麵包 (PGI)'],
      },
      accommodationAddress('poznan-towarowa'),
      accommodationAddress('warsaw-metropol', ['入住 Hotel Metropol、放行李', '回 Hotel Metropol']),
    ],
    navigation: [
      { mode: '步行', route: 'Metropol → Arirang → Złote Tarasy → 科學文化宮 → Metropol', action: '20:15 入住，20:20 Arirang（Nowogrodzka 38，步行約 3 分／約 150–200 m）；21:15 Złote Tarasy（從 Arirang 步行約 10 分，22:00 關門），21:55 科學文化宮夜景、22:10 回飯店。伴手禮在 10/29 或 10/30 晚上買齊。' },
      { mode: '電車／步行', route: 'Towarowa → Główny 置物櫃 → Śródka → 教堂島 → Manekin → Rynek → Fara → Plac Wolności → Stary Browar → 帝王區 → Kaponiera → Główny', action: '09:00 出發，09:10 寄放；09:25 電車 6（09:14 電車 5 也可，第三方推算，出發前再確認），45 分鐘票 7 zł/人，外國卡未確認，備現金。11:00 早餐、12:00 山羊鐘、13:00 Food Hall 午餐；15:45 回車站、16:00 取行李、17:15 前到月台。' },
      { mode: 'PKP', route: 'Poznań Główny → Warszawa Centralna', action: 'EIC 8104 已購票，17:40 發車；17:15 前到月台，預計 19:59 抵 Warszawa Centralna（Koleo）。車廂與座位依票券詳細頁，搭車前再查月台與異動。' },
    ],
    dailyAlerts: [
      '市政廳博物館整修閉館；主行程只看官方確認的 12:00 山羊鐘樓秀。',
      '聖馬丁牛角麵包已選定 ROGAL Świętomarciński（Stary Rynek 11/17）；週四 09:00–20:00，售完改 Cukiernia Kandulski（週四 09:00–17:00）。',
    ],
    nightChecklist: [...standardNightChecklist, 'Day 7 收費館只路過拍外觀，不用買票；明早 08:00 出門，08:10–08:50 在 Zgoda 3/5 早餐，08:55 拍 MSN 與科學文化宮，再從 Świętokrzyska 搭 M1 到 Ratusz Arsenał', '12:50 Gospoda pod Zygmuntem 午餐維持現場入座，客滿改 Gościniec 約 14:00 往南路上吃；Soul Kitchen 已訂 10/30 18:00–20:00、2 人，保留 15 分鐘，店家已註記 1 份威靈頓；17:50 從 Metropol 出發，確認信存離線'],
  },
  7: {
    cityKey: 'warsaw',
    note: '10/30 為諸聖節前兩日，逐店確認晚餐與交通；離線備妥 SOS 卡。',
    addresses: [
      {
        name: 'POLIN 波蘭猶太人歷史博物館（外觀）',
        address: 'Mordechaja Anielewicza 6, Warszawa',
        url: 'https://www.google.com/maps/search/?api=1&query=POLIN%20Museum%2C%20Mordechaja%20Anielewicza%206%2C%20Warszawa',
        note: '只看外觀與館前的猶太隔離區英雄紀念碑，不進館、不用買票。',
        reliable: true,
        entranceNote: '從 Ratusz Arsenał 站步行約 10 分；紀念碑在館前廣場。',
        officialUrl: 'https://polin.pl/en',
        stepLabels: ['★ POLIN 外觀＋猶太隔離區英雄紀念碑'],
      },
      venueCard('warsaw-old-town-square', '華沙老城市場廣場'),
      venueCard('warsaw-royal-castle', '華沙皇家城堡', '新行程只在城堡廣場拍白天外觀，不進城堡、不用買票。'),
      {
        name: 'BUW 華沙大學圖書館屋頂花園',
        address: 'Dobra 56/66, Warszawa',
        url: 'https://www.google.com/maps/search/?api=1&query=Biblioteka%20Uniwersytecka%20w%20Warszawie%2C%20Dobra%2056%2F66%2C%20Warszawa',
        note: '屋頂花園免費、開到 10/31；10 月時段 08:00–18:00；11/1 起不開放屋頂。時間不夠先刪這段。',
        reliable: true,
        entranceNote: '屋頂花園入口依現場指標；15:00 遊園後，15:25 叫車到瓦津基北門。',
        officialUrl: 'https://www.buw.uw.edu.pl/',
        stepLabels: ['★ BUW 屋頂花園＋河岸步道'],
      },
      venueCard('warsaw-lazienki-palace', '瓦津基水上宮殿'),
      accommodationAddress('warsaw-metropol', ['從 Metropol 出發']),
    ],
    navigation: [
      { mode: '地鐵 M1', route: 'Świętokrzyska → Ratusz Arsenał', action: '08:55 在站口拍 MSN 與科學文化宮，再搭 M1 只坐 1 站，下車步行約 10 分到 POLIN。' },
      { mode: '步行', route: 'POLIN → 克拉辛斯基廣場 → 新城廣場 → Freta → 甕城 → 老城廣場 → 石階街／Gnojna Góra → 聖若望大教堂 → Piwna → 城堡廣場 → 聖安妮教堂（外觀） → Gospoda pod Zygmuntem → 總統府 → 聖十字教堂 → Tamka／Ostrogski 宮 → 美人魚像 → BUW', action: '09:25 後全程步行，由北往南採點，僅午餐小幅折返；午餐後沿皇家大道、Tamka 與河岸走到 BUW，再叫車去瓦津基；時間不夠先刪 BUW 屋頂花園與美人魚。' },
      { mode: '叫車／步行', route: 'BUW → 瓦津基北門 → 水上宮殿 → Agrykola → Metropol → Soul Kitchen', action: '15:25 從 BUW 搭計程車／Bolt 約 15 分直達北門，北門看蕭邦紀念碑、15:55 抵水上宮殿等 16:12 日落；16:40 從 Agrykola 叫車回飯店，17:50 步行約 8 分到 Soul Kitchen，18:00 已訂位。' },
    ],
    dailyAlerts: [
      '收費館只路過拍外觀：MSN、POLIN、居禮夫人博物館、華沙博物館、皇家城堡、蕭邦博物館都不進；教堂正殿能不能進以現場告示為準，彌撒時不要進去拍照。',
      '水上宮殿週五個人參觀免費，最後入場 17:30（以館方當日公告為準）；本次只排湖邊外觀，15:55 抵湖邊等日落 16:12 拍倒影。',
      '10/31 為諸聖節前夕，今晚重查明日市區交通、機場與店家特別營運。SKM 10 月班表未查證，需前一晚用 Jakdojade 確認 Śródmieście 往機場 S2 的確切時刻；錯過一班約晚 30 分，仍約 11:30 到機場。',
    ],
    nightChecklist: [...standardNightChecklist, '前一晚先整理好行李，10/31 早上只需收尾', '整理 TAX FREE 商品與文件，確認需海關查驗的託運品不先交運', '確認 QR 260 報到、行李額度、機場交通與護照收納位置', '明早 07:20 從 Metropol 出發看 08:00 無名塚衛兵交接，08:35 在 Bułkę przez Bibułkę（Zgoda 3）早餐；08:40 未入座改外帶，09:45 退房、10:05 出門，11:00 前到機場'],
  },
  8: {
    cityKey: 'warsaw',
    note: '離開 EU 前處理退稅；託運商品若需查驗，先完成海關程序。',
    addresses: [
      accommodationAddress('warsaw-metropol', ['回 Metropol、整理行李', '辦理退房']),
      { name: 'Blikle', stepLabels: ['Blikle 外帶甜甜圈'], address: 'Nowy Świat 33, Warszawa', url: diningPlaces['warsaw-a-blikle-1869'].map, note: '09:10 外帶甜甜圈，沒開就略過。', reliable: false },
      venueCard('warsaw-centralna-station', 'Warszawa Centralna'),
      {
        name: 'Warszawa Śródmieście（SKM S2）',
        address: 'Al. Jerozolimskie／Pasaż Wisławy Szymborskiej, Warszawa',
        url: 'https://www.google.com/maps/search/?api=1&query=Warszawa%20%C5%9Ar%C3%B3dmie%C5%9Bcie%20SKM',
        note: 'S2 往機場的上車站，Hotel Metropol 旁約 250 公尺；先開的是 S3 才改去 Centralna。',
        reliable: true,
        entranceNote: '站口在 Marszałkowska 與 Al. Jerozolimskie 路口一帶，往月台依站內 SKM 指標與電子牌；座標為 OSM node 2351113017。',
        officialUrl: 'https://portalpasazera.pl/en/KatalogStacji?stacja=Warszawa+%C5%9Ar%C3%B3dmie%C5%9Bcie',
        stepLabels: ['出門 → Śródmieście（S2）或 Warszawa Centralna（S3）'],
      },
      venueCard('warsaw-chopin-airport', '華沙蕭邦機場'),
      venueCard('taipei-representative-office-warsaw', '駐波蘭台北代表處', '僅供緊急狀況備援，不列為一般行程站點。'),
    ],
    navigation: [
      { mode: '步行', route: 'Metropol → 薩克森花園 → 無名塚 → 劇院廣場 → Zgoda 3 → Blikle → 棕櫚樹 → Metropol', action: '07:20 沿 Marszałkowska 往北；07:40 從花園西口往東，07:55 到無名塚等 08:00 換崗；08:10 劇院廣場（約 340 m），08:15 往東南約 1.4 km，08:35 早餐、09:05 結帳；09:10 Blikle、09:20 棕櫚樹、09:35 回飯店。' },
      { mode: 'SKM', route: '華沙市中心 → 蕭邦機場', action: 'SKM 10 月班表未查證，需前一晚用 Jakdojade 確認 Śródmieście 往機場 S2 的確切時刻；錯過一班約晚 30 分，仍約 11:30 到機場；當日再查月台與改道；如要退稅或託運商品查驗，比一般報到更早抵達。' },
      { mode: '航空／出境', route: 'WAW → DOH → HKG → TPE', action: '依電子機票與報到櫃檯確認行李直掛終點與轉機程序；每段登機牌離線保存。' },
    ],
    dailyAlerts: [
      '早上沿 Marszałkowska 往北、從西口穿薩克森花園；08:00 換崗、08:10 劇院廣場、08:35 Zgoda 3、09:10 Blikle、09:20 棕櫚樹；09:45 退房、10:05 出門。',
      '離開 EU：如有 TAX FREE，先完成必要的出口確認與商品查驗，再交付託運行李。',
      '10/31 為諸聖節前夕；市區交通與機場營運以當日公告為準，不用平日末班資料倒推。',
    ],
    nightChecklist: [...standardNightChecklist, '抵台後確認行李已全數取得，保留登機牌、TAX FREE 與必要收據至程序結束'],
  },
};

// 未確認步驟必須人工明列；新增行程若沒有可靠地址或這份清單，validator 會直接失敗。
const dynamicTransitReason = '班次、月台或上下車點為動態資料，依已購票與當日電子牌確認。';
const unresolvedStepReasons = {
  1: {
    '早餐 · 自理': '出發前在臺灣自行安排，沒有指定餐廳地址。',
    '午餐 · 自理': '出發前自行安排，沒有指定餐廳地址。',
    '晚餐 · 桃園機場': '先完成安檢與登機門確認，再在可通行區域用餐。',
    'HX 283 桃園 → 香港': dynamicTransitReason,
    '香港轉機': '依轉機指標與 QR 815 登機證到當日登機門，不使用固定地面地址。',
  },
  2: {
    '早餐 · 機上或杜哈轉機': '依實際供餐與當日登機門調整，沒有固定地面餐廳地址。',
    '午餐 · 機上或機場輕食': '先入境、提行李與轉西站，餐食依可用時間安排。',
    'QR 815 香港 → 杜哈': dynamicTransitReason,
    'QR 259 杜哈 → 華沙': dynamicTransitReason,
    '抵蕭邦機場 · 入境與提行李': '航廈內依入境與行李提領指標，離開機場後直接轉西站。',
    '蕭邦機場 → Warszawa Zachodnia（西站）': dynamicTransitReason,
    '抵 Warszawa Zachodnia（西站）': '西站地址見當日地址卡；上車月台看當日電子牌。',
    'EIP 1306 前往克拉科夫': dynamicTransitReason,
    '買好隔日早餐、午餐與水': '10/25 是非營業週日，請在杜哈機場、華沙蕭邦機場或西站先買好；克拉科夫晚上採買只當備案，買不齊時詢問旅館。',
  },
  3: {
    'Kraków MDA 報到': `巴士站地址（Bosacka 18）與 10/26 的 ${lajkonikOutboundAdopted.dep} 班次已購票，票面標示下層 ${lajkonikOutboundAdopted.bay} 站位；站位仍以當日電子看板為準。`,
    'Lajkonik · 克拉科夫 → 奧斯威辛': dynamicTransitReason,
    '回程巴士返克拉科夫': '15:30 班已購票，由 Więźniów Oświęcimia 55（Muzeum Auschwitz）發車；15:15 前到站牌，站牌位置見當日地圖。',
    '抵 Kraków MDA · 休息': '抵達後的休息地點保持彈性，不需要固定導航地址。',
  },
  4: {
    '步行到 Wieliczka Rynek-Kopalnia': 'Sztolnia 至車站約 400 m，步行 6–8 分；車站位置見當日地圖，13:41 搭 SKA1。',
    '火車到 Wieliczka Rynek-Kopalnia': dynamicTransitReason,
    'IC 3830 前往樂斯拉夫': dynamicTransitReason,
    '★ Przejście「無名行人」雕像（選配）': '戶外雕像，在 Świdnicka 與 Piłsudskiego 路口兩側人行道上，由 Piast 步行即到。',
    '★ 中央廣場夜景（選配）': '戶外夜拍，沿 Świdnicka 往北走到中央廣場；選配行程，累了就略過。',
    '★ Neon Side Gallery 夜景（選配）': 'Ruska 46c 的中庭，依現場招牌進入；去之前看 Google 地圖最新評論確認有開。',
    '搭電車或叫車回 Piast': dynamicTransitReason,
  },
  5: {
    'Piast 出發 · 無名行人 → Papa Krasnal': '沿 Świdnicka 街步行，見當日地圖圖釘。',
    '★ 白鸛會堂外觀': 'Włodkowica 7，只看外觀，庭院未確認。',
    '鹽廣場 Plac Solny': '中央廣場西南角花市。',
    '糖果屋雙屋 → 聖伊莉莎白教堂外觀 → 屠夫巷 Jatki': '見當日地圖圖釘，不登塔。',
    '★ 大學區、大學橋河岸': 'plac Uniwersytecki 1 一帶，只看外觀。',
    '咖啡休息 · El Gato Specialty Coffee': 'Odrzańska 8。',
    'Hala Targowa 市場大廳': 'Piaskowa 17。',
    '★ Słodowa 島': '島嶼範圍中心見地圖。',
    '沙島 · 沙上聖母堂': 'Świętej Jadwigi 1。',
    '★ InfoCentrum 等點燈人': 'pl. Katedralny 1，大教堂入口右側雙燈處；座標未驗證，依地址導航。',
    '國家博物館 · Słodki Chłopak 甜點': 'pl. Powstańców Warszawy 5，免票進入咖啡廳。',
    '午餐前緩衝': '大學步行到 Szewska 59/60。',
    '步行前往 Hala Targowa': '由國家博物館往 Piaskowa 17。',
    'Piast 取行李': '回原住宿領行李。',
    'IC 260 前往波茲南': dynamicTransitReason,
  },
  6: {
    '退房、離開 Poznan Apartments Towarowa': '回原住宿退房，導航見時間表。',
    'Poznań Główny 置物櫃寄放行李': '車站內置物櫃位置與空位依現場確認，車站導航見時間表。',
    'Poznań Główny 取行李': '車站內領取行李，車站導航見時間表。',
    '電車 6 往 Rondo Śródka': '乘車站位與班次依當日 ZTM／Jakdojade 確認。',
    '★ Śródka 立體壁畫': '戶外壁畫，見當日地圖圖釘。',
    '走 Chwaliszewo 到 Manekin': '步行路段，目的地導航見早餐餐廳。',
    '皇家城堡山丘（選配）': '戶外山丘，只看外觀，見當日地圖圖釘。',
    'Fara 粉紅教堂': '入口見當日地圖圖釘，依現場開放情況進入。',
    '自由廣場 Plac Wolności': '廣場範圍，見當日地圖圖釘。',
    'Okrąglak 圓形百貨外觀': '建築外觀拍照點，見當日地圖圖釘。',
    'Kaponiera 圓環': '圓環周邊多處外觀點，見當日地圖圖釘。',
    '走回 Poznań Główny': '步行路段，車站導航見取行李列。',
    '★ Złote Tarasy 玻璃波浪屋頂夜景': 'Złota 59，中央車站對面的商場，從 Arirang 步行約 10 分（Metropol 約 0.9 km），依現場指標進入；週一到週六 09:00–22:00。',
    '往回走，途經科學文化宮拍夜景': '戶外步行段，從 Złote Tarasy 往回走，順路在科學文化宮外拍夜景。',
    'EIC 8104 前往華沙': dynamicTransitReason,
  },
  7: {
    '從 Agrykola 出口叫車回飯店': dynamicTransitReason,
    '可選 · E.Wedel 本店熱巧克力': 'Szpitalna 8，20:15 選配；營業到 22:00（出發前再確認）。',
    'BUW 叫 Bolt 或計程車到瓦津基北門、蕭邦紀念碑': '從 Dobra 56/66 搭 Bolt 約 15 分到蕭邦紀念碑北門。' + '；' + '北門進園後前往蕭邦紀念碑，再往水上宮殿。',
    '步行前往 Soul Kitchen': '由 Metropol 步行約 8 分到 Nowogrodzka 18A，餐廳導航見當日已訂晚餐。',
    'MSN 現代美術館＋科學文化宮外觀；地鐵 M1 → Ratusz Arsenał': '戶外拍照點，在 Świętokrzyska 地鐵站口旁的 Plac Defilad；只拍外觀不進館。' + '；' + dynamicTransitReason,
    '★ 克拉辛斯基廣場': '戶外廣場，起義紀念碑在 plac Krasińskich，由 POLIN 往東步行即到。',
    '★ 新城廣場＋聖母訪親教堂＋居禮夫人雕像＋Freta 街': '戶外廣場，由克拉辛斯基廣場往東經 Świętojerska、Freta 北段即到。' + '；' + '教堂在 Przyrynek 2，由新城廣場往東北步行約 3 分；雕像在教堂旁高地。' + '；' + '出生地在 Freta 16，只拍外牆紀念牌，不進館；沿 Freta 往南走到甕城。',
    '★ 甕城 Barbakan＋城牆 → Szeroki Dunaj → Wąski Dunaj': '戶外城牆，在 Freta 街南端；小小起義者像在 Podwale。' + '；' + '老城西北側的戶外巷弄，由城牆內側往東走即接老城廣場。',
    '石階街 → Brzozowa → Gnojna Góra 觀景點': '戶外步行段：石階由老城廣場東北角往下，Gnojna Góra 在 Brzozowa 與 Celna 交口的高地。',
    'Kanonia 許願鐘 → 聖若望大教堂 → Piwna 街 → 聖馬丁教堂': '戶外步行段，教堂在 Piwna 9/11，由聖若望大教堂往西步行約 3 分，再沿 Piwna 往南走到城堡廣場。',
    '沿皇家大道往南：總統府、Bristol、訪親會教堂、華沙大學': '戶外步行段，沿 Krakowskie Przedmieście 往南；E.Wedel 在對面，想外帶熱巧克力再進店。' + '；' + '戶外步行段，都在 Krakowskie Przedmieście 同一條街上，只拍外觀。',
    '★ 聖十字教堂': '教堂在 Krakowskie Przedmieście 3，正殿通常免費可進，彌撒時不要拍照。',
    '哥白尼紀念碑 → Tamka 街蕭邦長椅、Ostrogski 宮外觀 → 河邊美人魚像': '戶外步行段，經 Ordynacka 轉 Tamka 街下坡；Ostrogski 宮（蕭邦博物館）整修閉館，只拍外觀。' + '；' + '戶外步行段，美人魚像在 Wybrzeże Kościuszkowskie 河岸，路過快拍。',
  },
  8: {
    '棕櫚樹圓環': '戶外圓環，Blikle 往南約 250 m，不用專程導航。',
    '從 Metropol 沿 Marszałkowska 往北': '沿 Marszałkowska 往北約 1.4 km 到花園西口。',
    '從西口進薩克森花園往東穿過': '從西口往東穿過約 0.5 km。',
    '抵無名塚': 'plac Piłsudskiego，07:55 抵達等 08:00 換崗。',
    '往東南步行約 1.4 km 到 Zgoda 3': '從劇院廣場往東南到 Zgoda 3，累了可刪劇院廣場。',
    '劇院廣場': '戶外廣場，大劇院在 plac Teatralny 1，只拍外觀。',
    '★ 無名塚衛兵交接': '位於 plac Piłsudskiego 的薩克森花園東側拱廊，開放戶外紀念地，衛兵整點換崗，依現場指標前往。',
    'SKM S2／S3 目標班次': dynamicTransitReason,
  },
};

// 餐廳地址直接取門市主檔；自備餐維持明確的現場安排。
for (const day of itineraryDays) {
  const restaurantSteps = (dayDining[day.n] || []).filter(item => item.stepId);
  for (const item of [...restaurantSteps, ...(dayMeals[day.n] || []).filter(item => !item.placeId)]) {
    const step = day.steps.find(step => step.id === item.stepId);
    if (!step) throw new Error(`Day ${day.n} 餐飲步驟不存在：${item.stepId}`);
    const alreadyCovered = dayOperations[day.n].addresses.some(address => address.reliable && address.stepLabels.includes(step.label));
    if (alreadyCovered) continue;
    if (item.placeId && item.sourceUrl && item.verificationStatus !== 'pending' && !/待確認/.test(item.address)) {
      dayOperations[day.n].addresses.push({ name:item.name, address:item.address, url:item.map,
        officialUrl:item.sourceUrl, reliable:true, stepLabels:[step.label],
        entranceNote:'依店家地址與現場招牌找入口；館內／商場店依樓層指標，營業與接單仍須確認。',
        note:item.condition || '行程預留，不代表已訂位。' });
    } else {
      unresolvedStepReasons[day.n][step.label] = item.placeId
        ? '分店或營業資訊待確認；請先看當日餐飲的來源與備案，不把搜尋結果當成已核實入口。'
        : item.note;
    }
  }
}

for (const day of itineraryDays) {
  dayOperations[day.n].unresolvedSteps = Object.entries(unresolvedStepReasons[day.n] || {})
    .map(([label, reason]) => ({ label, reason }));
}

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
const stableSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const forbiddenPublicContent = [
  'Al. Jerozolimskie 179',
  'Więźniów Oświęcimia 20',
  '護照號：',
  '完整卡號：',
  '保單號：',
];

function isHttpsUrl(value) {
  if (typeof value !== 'string' || !value.startsWith('https://')) return false;
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

function assertDate(value, field, id, required) {
  if (value == null && !required) return;
  if (typeof value !== 'string' || !isoDatePattern.test(value)) {
    throw new Error(`${id} 的 ${field} 必須是真實曆日 YYYY-MM-DD${required ? '' : ' 或 null'}`);
  }
  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(0);
  parsed.setUTCHours(0, 0, 0, 0);
  parsed.setUTCFullYear(year, month - 1, day);
  if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) {
    throw new Error(`${id} 的 ${field} 必須是真實曆日 YYYY-MM-DD`);
  }
}

function assertStableSlug(value, field) {
  if (typeof value !== 'string' || !stableSlugPattern.test(value)) {
    throw new Error(`${field} 必須是穩定 slug：${value ?? ''}`);
  }
}

function assertNonEmptyText(value, field) {
  if (typeof value !== 'string' || value.trim() === '') throw new Error(`${field} 必須是非空字串`);
}

/**
 * 驗證自由行資料庫的公開資料契約。
 * 可由測試注入資料，亦在模組載入時檢查正式資料，避免錯誤進入產出頁面。
 */
export function validateTravelDatabase({ entries, sections, operations, labels }) {
  const allowedCategories = new Set(['place', 'transit', 'dining', 'practical', 'safety', 'document']);
  const allowedCityKeys = new Set(['WAW', 'KRK', 'WRO', 'POZ', 'PL', 'ROUTE']);
  const sectionIds = new Set();
  for (const section of sections) {
    assertStableSlug(section.id, '資料庫 section ID');
    if (sectionIds.has(section.id)) throw new Error(`資料庫 section ID 重複：${section.id}`);
    sectionIds.add(section.id);
  }

  const entryIds = new Set();
  const sectionCounts = new Map(sections.map(section => [section.id, 0]));
  for (const entry of entries) {
    assertStableSlug(entry.id, '資料庫 entry ID');
    if (entryIds.has(entry.id)) throw new Error(`資料庫 entry ID 重複：${entry.id}`);
    entryIds.add(entry.id);

    for (const field of ['title', 'summary', 'offlineNote']) {
      assertNonEmptyText(entry[field], `${entry.id} 的 ${field}`);
    }
    if (typeof entry.private !== 'boolean') throw new Error(`${entry.id} 的 private 必須是 boolean`);
    assertDate(entry.checkedAt, 'checkedAt', entry.id, true);

    if (!Object.hasOwn(labels, entry.status)) throw new Error(`${entry.id} 使用未知狀態：${entry.status}`);
    if (!allowedCategories.has(entry.category)) throw new Error(`${entry.id} 使用未知 category：${entry.category}`);
    if (!allowedCityKeys.has(entry.cityKey)) throw new Error(`${entry.id} 使用未知 cityKey：${entry.cityKey}`);
    if (!sectionIds.has(entry.section)) throw new Error(`${entry.id} 指向不存在的 section：${entry.section}`);
    sectionCounts.set(entry.section, sectionCounts.get(entry.section) + 1);

    if (entry.sourceUrl != null && !isHttpsUrl(entry.sourceUrl)) {
      throw new Error(`${entry.id} 的 sourceUrl 必須使用 HTTPS`);
    }
    if (entry.status === 'verified' && !isHttpsUrl(entry.sourceUrl)) {
      throw new Error(`${entry.id} 已查證但缺少 HTTPS 官方來源`);
    }

    const verificationRequired = entry.status === 'verified' || entry.status === 'recheck';
    assertDate(entry.verifiedAt, 'verifiedAt', entry.id, verificationRequired);
    assertDate(entry.recheckAt, 'recheckAt', entry.id, entry.status === 'recheck');
  }

  for (const [sectionId, count] of sectionCounts) {
    if (count === 0) throw new Error(`資料庫 section 沒有任何資料：${sectionId}`);
  }

  for (let day = 1; day <= 8; day += 1) {
    const operation = operations[day];
    if (!operation) throw new Error(`Day ${day} 缺少每日操作資料`);
    if (!Array.isArray(operation.addresses) || operation.addresses.length === 0) {
      throw new Error(`Day ${day} 的 addresses 必須是非空陣列`);
    }
    for (const [index, item] of operation.addresses.entries()) {
      if (typeof item !== 'object' || item === null || Array.isArray(item)) {
        throw new Error(`Day ${day} 的 addresses[${index}] 必須是物件`);
      }
      assertNonEmptyText(item.name, `Day ${day} 的 addresses[${index}].name`);
      assertNonEmptyText(item.address, `Day ${day} 的 addresses[${index}].address`);
      if (!isHttpsUrl(item.url)) throw new Error(`Day ${day} 的 addresses[${index}].url 必須使用 HTTPS`);
      if (!Array.isArray(item.stepLabels)) throw new Error(`Day ${day} 的 addresses[${index}].stepLabels 必須是陣列`);
      if (item.reliable) {
        assertNonEmptyText(item.entranceNote, `Day ${day} 的 addresses[${index}].entranceNote`);
        if (!isHttpsUrl(item.officialUrl)) throw new Error(`Day ${day} 的 addresses[${index}].officialUrl 必須使用 HTTPS`);
      }
    }

    if (!Array.isArray(operation.navigation) || operation.navigation.length === 0) {
      throw new Error(`Day ${day} 的 navigation 必須是非空陣列`);
    }
    for (const [index, item] of operation.navigation.entries()) {
      if (typeof item !== 'object' || item === null || Array.isArray(item)) {
        throw new Error(`Day ${day} 的 navigation[${index}] 必須是物件`);
      }
      for (const field of ['mode', 'route', 'action']) {
        assertNonEmptyText(item[field], `Day ${day} 的 navigation[${index}].${field}`);
      }
    }

    for (const field of ['dailyAlerts', 'nightChecklist']) {
      if (!Array.isArray(operation[field]) || operation[field].length === 0) {
        throw new Error(`Day ${day} 的 ${field} 必須是非空陣列`);
      }
      for (const [index, item] of operation[field].entries()) {
        assertNonEmptyText(item, `Day ${day} 的 ${field}[${index}]`);
      }
    }

    if (!Array.isArray(operation.unresolvedSteps)) throw new Error(`Day ${day} 的 unresolvedSteps 必須是陣列`);
    const coveredLabels = new Set(operation.addresses.filter(item => item.reliable).flatMap(item => item.stepLabels));
    const unresolvedLabels = new Set(operation.unresolvedSteps.map(item => {
      assertNonEmptyText(item.label, `Day ${day} 的 unresolvedSteps.label`);
      assertNonEmptyText(item.reason, `Day ${day} 的 unresolvedSteps.reason`);
      return item.label;
    }));
    const itineraryLabels = new Set(itineraryDays.find(item => item.n === day).steps.map(step => step.label));
    for (const label of unresolvedLabels) {
      if (!itineraryLabels.has(label)) throw new Error(`Day ${day} unresolvedSteps 含不存在步驟：${label}`);
      if (coveredLabels.has(label)) throw new Error(`Day ${day} 步驟同時標為可靠與未確認：${label}`);
    }
    for (const step of itineraryDays.find(item => item.n === day).steps) {
      if (!coveredLabels.has(step.label) && !unresolvedLabels.has(step.label)) {
        throw new Error(`Day ${day} 行程步驟未覆蓋：${step.label}`);
      }
    }
  }

  const serialized = JSON.stringify({ entries, sections, operations });
  for (const forbidden of forbiddenPublicContent) {
    if (serialized.includes(forbidden)) throw new Error(`公開資料含禁止內容：${forbidden}`);
  }

  return true;
}

validateTravelDatabase({
  entries: databaseEntries,
  sections: databaseSections,
  operations: dayOperations,
  labels: statusLabels,
});
