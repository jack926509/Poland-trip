import { days as itineraryDays, stay } from './trip.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const overridePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'travel-database.sync.json');
const syncMeta = readSyncOverrides();

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
    title: '護照與 ETIAS 動態閘門',
    summary: '非 EU 旅客護照須在離開 EU 後至少仍有 3 個月效期、入境日距簽發日不得超過 10 年。ETIAS 官方頁目前寫預計 2026 年第 4 季啟用，行程正值該期間，不能先判定不需要申請。',
    status: 'recheck', sourceUrl: 'https://travel-europe.europa.eu/en/etias', verifiedAt: '2026-08-08', recheckAt: '2026-09-24',
    offlineNote: '列印護照、回程票、住宿與保險證明；出發前 30、14、3 天重查 EU 官方頁。', private: false,
  },
  {
    id: 'aviation-baggage-rules', section: 'aviation', category: 'transit', cityKey: 'ROUTE',
    title: '航空行李官方規則',
    summary: '聯運行程的行李額度需依電子機票與航空公司的官方行李規則判讀；不用非本次訂單的一般額度代替。',
    status: 'verified', sourceUrl: 'https://www.qatarairways.com/en/baggage/allowance.html', verifiedAt: '2026-08-08', recheckAt: null,
    offlineNote: '先保存官方規則，但本次可用額度仍以電子機票為準。', private: false,
  },
  {
    id: 'aviation-trip-baggage-confirmation', section: 'aviation', category: 'transit', cityKey: 'ROUTE',
    title: '本次航班時刻、行李額度與直掛確認',
    summary: '本次電子機票的實際起降時刻、行李額度、是否直掛及 HKG、DOH 轉機程序，必須由旅客的訂單與航空公司確認。網站上的 QR 260 於 10/31 14:40 起飛屬冬季班表，與目前公開的夏季班表不同，Day 8 全天時間表都建立在這個時刻上，務必以電子機票核對。',
    status: 'private-required', sourceUrl: null, verifiedAt: null, recheckAt: '2026-10-22',
    offlineNote: '離線保存電子機票；先核對五個航段的起降時刻與轉機時間是否與行程一致，再於出發前 48 小時核對報到、航廈、座位、行李直掛與特殊餐。', private: true,
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
    summary: '本次華沙、克拉科夫、樂斯拉夫與波茲南間的車次、車廂、座位與 through-ticket 狀態尚待開賣後確認。',
    status: 'pending', sourceUrl: null, verifiedAt: null, recheckAt: '2026-09-23',
    offlineNote: 'PKP 開賣後保存車票 PDF 與月台查詢連結；分開買票要留意轉乘保障可能不同。', private: false,
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
    summary: '波蘭緊急狀況可撥 112；醫療急症可撥 999。保險公司、保單號與海外救援電話必須由旅客自行填入私人資料。',
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
    summary: '退房後優先使用旅館寄放；若旅館未確認，才以車站或人工寄存作備案。費率、尺寸與空位皆為動態資料，不預先保證。',
    status: 'private-required', sourceUrl: 'https://portalpasazera.pl/en/KatalogStacji', verifiedAt: '2026-08-08', recheckAt: '2026-10-20',
    offlineNote: '每個轉場日先確認最晚領取時間、費用與件數；離線保留 A 旅館／B 車站備案。', private: true,
  },
  {
    id: 'calendar-sunday-and-all-saints', section: 'calendar', category: 'practical', cityKey: 'PL',
    title: '非營業週日與諸聖節前夕',
    summary: '10/25 為非營業週日，多數一般商店不得營業；10/31 為諸聖節前夕，交通、人潮與店家營業可能調整。餐廳與各店仍須逐店查證。',
    status: 'recheck', sourceUrl: 'https://www.gov.pl/web/family/trade-on-sundays', verifiedAt: '2026-08-08', recheckAt: '2026-10-18',
    offlineNote: '10/25 手機會自動更新夏令時間，但紙本與手錶要自行確認。', private: false,
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
    summary: 'PKP PLK Passenger Portal 可查部分車站對行動不便旅客的設施與可達性；需要協助者應依營運單位規則在訂票前申請。',
    status: 'recheck', sourceUrl: 'https://portalpasazera.pl/en/KatalogStacji', verifiedAt: '2026-08-08', recheckAt: '2026-10-10',
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
    title: '餐廳訂位與當日營業',
    summary: '主選餐廳只有在分店地址與當日營業時間確認後才標示已查；每餐另備同區與便利備案，不從其他分店套用時間。',
    status: 'pending', sourceUrl: null, verifiedAt: null, recheckAt: '2026-10-17',
    offlineNote: '保存訂位姓名、時間與過敏飲食需求的波蘭文／英文卡，但不放到公開網站。', private: false,
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
    title: '景點票券與入場時段',
    summary: '須預約景點的購票狀態、參觀日期、入場時段與同行人數尚待逐項確認；公開版只顯示進度，不保存票券條碼、姓名或付款資料。',
    status: 'pending', sourceUrl: null, verifiedAt: null, recheckAt: '2026-09-24',
    offlineNote: '完成購票後把票券 PDF、官方地址、集合點與取消規則存入私人離線包。', private: true,
  },
  {
    id: 'accommodation-confirmations', section: 'accommodation', category: 'practical', cityKey: 'ROUTE',
    title: '7 晚住宿已確認',
    summary: '5 筆訂單共 7 晚皆已確認：華沙 ibis budget Warszawa Reduta、克拉科夫 ibis budget Krakow Stare Miasto、樂斯拉夫 Piast、波茲南 Poznan Apartments Towarowa、華沙 Hotel Metropol。公開版不保存訂房代碼、姓名或付款證明。',
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

export const readinessItems = [
  { id: 'accommodation', title: '住宿', detail: '5 筆／7 晚訂單已確認；出發前補齊私人離線備份與寄放安排', priority: 'P0', status: 'private-required', entryId: 'accommodation-confirmations', private: true },
  { id: 'rail-tickets', title: '城際車票', detail: '確認車次、車廂、座位與轉乘保障', priority: 'P0', status: 'pending', entryId: 'rail-trip-tickets', private: false },
  { id: 'attraction-tickets', title: '景點票券', detail: '確認日期、入場時段與離線票券', priority: 'P0', status: 'pending', entryId: 'documents-attraction-tickets', private: true },
  { id: 'flight-ticket', title: '航班時刻與行李', detail: '核對電子機票的五段起降時刻、行李額度與是否直掛', priority: 'P0', status: 'private-required', entryId: 'aviation-trip-baggage-confirmation', private: true },
  { id: 'insurance', title: '旅平險', detail: '保存保單與海外救援聯絡方式', priority: 'P0', status: 'private-required', entryId: 'medical-insurance-and-emergency', private: true },
  { id: 'offline-pack', title: '網路離線', detail: '準備 SIM／eSIM、離線地圖與文件包', priority: 'P1', status: 'pending', entryId: 'connectivity-prepaid-registration', private: false },
  { id: 'passport-etias', title: 'ETIAS', detail: '依官方啟用進度重查入境資格', priority: 'P0', status: 'recheck', entryId: 'entry-etias-and-passport', private: false },
  { id: 'emergency-contact', title: '緊急聯絡', detail: '完成旅外登錄並讓聯絡人持有行程', priority: 'P0', status: 'private-required', entryId: 'documents-travel-registration', private: true },
];

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

const officialPlaceUrls = {
  '華沙蕭邦機場': 'https://www.lotnisko-chopina.pl/en/index.html',
  'Warszawa Centralna': 'https://portalpasazera.pl/en/KatalogStacji',
  '華沙皇家城堡': 'https://www.zamek-krolewski.pl/en/strona/opening-hours-and-ticket-prices/2801-opening-hours-and-ticket-prices-may-2-2026',
  '華沙老城市場廣場': 'https://go2warsaw.pl/en/old-town/',
  'Krakowskie Przedmieście': 'https://warsawtour.pl/en/royal-route/',
  'Kraków Główny': 'https://portalpasazera.pl/en/KatalogStacji',
  '瓦維爾大教堂': 'https://www.katedra-wawelska.pl/en/katedra-wawelska/zaplanuj-wizyte/',
  '瓦維爾皇家城堡': 'https://wawel.krakow.pl/en/what-to-see',
  '辛德勒工廠': 'https://www.muzeumkrakowa.pl/en/opening-hours-and-ticket-prices',
  '聖瑪利亞聖殿': 'https://mariacki.com/en/',
  '中央廣場 Rynek Główny': 'https://krakow.travel/en/55-krakow-main-market-square',
  '紡織會館 Sukiennice': 'https://mnk.pl/oddzialy/sukiennice/',
  'Plac Nowy': 'https://krakow.travel/655-krakow-plac-nowy',
  'Auschwitz I 訪客服務中心／入口': 'https://www.auschwitz.org/en/visiting/',
  'Auschwitz II–Birkenau': 'https://www.auschwitz.org/en/visiting/',
  '維利奇卡鹽礦': 'https://www.kopalnia.pl/',
  'Wrocław Główny': 'https://portalpasazera.pl/en/KatalogStacji',
  '拉茨瓦維採全景畫': 'https://mnwr.pl/en/branches/panorama-of-the-battle-of-raclawice/information/',
  '百年廳': 'https://halastulecia.pl/zwiedzanie/visitor-centre/',
  '樂斯拉夫中央廣場': 'https://visitwroclaw.eu/en/atrakcje/market-square-and-town-hall/',
  '樂斯拉夫主教座堂': 'https://katedra.wroclaw.pl/',
  'Poznań Główny': 'https://portalpasazera.pl/en/KatalogStacji',
  '波茲南主教座堂': 'https://www.katedra.archpoznan.pl/',
  '波茲南市政廳': 'https://www.msu.mnp.art.pl/profile/wizyta-ratusz-muzeum-poznania',
  '帝王城堡': 'https://ckzamek.pl/podstrony/6071-zwiedzanie-zamku/',
  'Stary Browar': 'https://starybrowar5050.com/en/contact/',
  'POLIN 波蘭猶太人歷史博物館': 'https://polin.pl/en',
  '華沙起義博物館': 'https://www.1944.pl/en',
  '駐波蘭台北代表處': 'https://www.mofa.gov.tw/CountryInfo.aspx?CASN=1&n=164&s=124&sms=33&tabs=08617EE9DB3C61E3',
};

const entranceNotesByName = {
  '華沙蕭邦機場': '抵達後依 Arrivals 與 SKM／Railway Station 標示前往航廈下方車站；回程依電子機票確認報到區。',
  'Warszawa Centralna': '由已確認住宿方向選最近入口；進站後以大廳電子牌確認月台，不預先假定入口或月台。',
  '華沙皇家城堡': '主要訪客入口在 plac Zamkowy 4；依票券時段與現場安檢標示入場。',
  '華沙老城市場廣場': '公共廣場，導航至 Rynek Starego Miasta；與 plac Zamkowy 的皇家城堡廣場是不同地點。',
  'Krakowskie Przedmieście': '公共街道，從城堡廣場沿皇家大道步行，無需入場。',
  'Kraków Główny': '依 Galeria Krakowska／車站大廳指標進站，月台以當日電子牌為準。',
  '瓦維爾大教堂': '登上 Wawel Hill 後依 Cathedral 指標前往大教堂入口，避開禮拜動線。',
  '瓦維爾皇家城堡': '先到 Wawel Hill 訪客服務／票券標示處，再依已購路線入口入場。',
  '中央廣場 Rynek Główny': '公共廣場，從 Grodzka／Floriańska 等街道步行進入，無單一入口。',
  '聖瑪利亞聖殿': '由 plac Mariacki 5 的訪客入口依現場標示進入，禮拜入口可能分流。',
  '紡織會館 Sukiennice': '一樓公共市集由中央廣場拱廊進入；博物館入口依 MNK 現場標示。',
  'Plac Nowy': '公共廣場，導航至中央圓亭；餐飲攤位仍須逐店確認。',
  '辛德勒工廠': '導航至 Lipowa 4，依 Museum of Kraków 入口與已購時段排隊。',
  'Auschwitz I 訪客服務中心／入口': '務必到 Więźniów Oświęcimia 55 的訪客服務中心／入口，不使用通訊地址 20 號。',
  'Auschwitz II–Birkenau': '跟隨官方導覽接駁與工作人員指示，不自行變更集合點。',
  '維利奇卡鹽礦': 'Tourist Route 從 Daniłowicz Shaft（Daniłowicza 10）集合入場。',
  'Wrocław Główny': '由主站大廳進站，當日用電子牌確認月台與任何臨時改道。',
  '樂斯拉夫中央廣場': '公共廣場，導航至 Rynek；無單一入口。',
  '拉茨瓦維採全景畫': '由 Purkyniego 11 主入口依已購時段入場。',
  '百年廳': '本日只看外觀與周邊；如臨時改入室內，使用 Wystawowa 1 訪客中心入口。',
  '樂斯拉夫主教座堂': '由 plac Katedralny 18 正門進入；禮拜期間尊重現場分流。',
  'Poznań Główny': '由車站大廳依電子牌前往月台；商場與車站入口不要混淆。',
  '波茲南主教座堂': '由 Ostrów Tumski 17 正門進入；禮拜期間以現場開放區域為準。',
  '波茲南市政廳': '本次只在 Stary Rynek 1 外觀區看 12:00 山羊鐘樓秀，博物館整修閉館。',
  '帝王城堡': '由 Święty Marcin 80/82 依 CK Zamek 訪客標示進入。',
  'Stary Browar': '由 Półwiejska 42 商場入口進入；與帝王城堡是兩個不同站點。',
  'POLIN 波蘭猶太人歷史博物館': '由 Mordechaja Anielewicza 6 主入口依票券與安檢標示進入。',
  '華沙起義博物館': '由 Grzybowska 79 訪客入口依已購時段進場。',
  '駐波蘭台北代表處': '僅作緊急聯絡備援；一般領務先於辦公時間電話確認。',
};

const addressStepLabels = {
  '華沙蕭邦機場': ['抵蕭邦機場', '抵 Chopin 第一航廈', '退稅文件 + 報到 + 安檢', '★ QR 260 起飛'],
  'Warszawa Centralna': ['退房 → Warszawa Centralna', '抵華沙中央車站'],
  '華沙皇家城堡': ['★ 皇家城堡'],
  '華沙老城市場廣場': ['★ 老城廣場', '老城廣場夜燈漫步', '早餐 + 老城散步'],
  'Krakowskie Przedmieście': ['Krakowskie Przedmieście'],
  'Kraków Główny': ['抵 Kraków Główny', '火車回 Kraków Główny', '旅館取行李 → Bolt 到 Kraków Główny'],
  '瓦維爾大教堂': ['★ 瓦維爾大教堂'],
  '瓦維爾皇家城堡': ['★ Wawel 城堡一、二樓完整路線'],
  '辛德勒工廠': ['★ 辛德勒工廠'],
  '中央廣場 Rynek Główny': ['★ 中央廣場 + 聖瑪利亞', '★ 中央廣場 + 紡織會館'],
  '聖瑪利亞聖殿': ['★ 中央廣場 + 聖瑪利亞'],
  '紡織會館 Sukiennice': ['紡織會館 Sukiennice 快速一覽', '紡織會館 Sukiennice 採購收尾', '★ 中央廣場 + 紡織會館'],
  'Plac Nowy': ['★ Kazimierz Plac Nowy zapiekanka 晚餐', '★ Kazimierz 白天散步'],
  'Auschwitz I 訪客服務中心／入口': ['抵 Auschwitz I', '★ 英文官方導覽', '導覽結束'],
  '維利奇卡鹽礦': ['★ Wieliczka 鹽礦 Tourist Route 英文團'],
  'Wrocław Główny': ['抵 Wrocław Główny'],
  '拉茨瓦維採全景畫': ['★ 拉茨瓦維採全景畫'],
  '百年廳': ['★ 百年廳 (UNESCO)'],
  '樂斯拉夫中央廣場': ['★ 中央廣場 + 紡織會館'],
  '樂斯拉夫主教座堂': ['★ 座堂島煤氣燈'],
  '波茲南主教座堂': ['★ 教堂島 Ostrów Tumski'],
  '波茲南市政廳': ['廣場卡正面位置', '★ 山羊鐘樓秀'],
  '帝王城堡': ['帝王城堡 / Stary Browar'],
  'Stary Browar': ['帝王城堡 / Stary Browar'],
  'POLIN 波蘭猶太人歷史博物館': ['★ POLIN 猶太博物館'],
  '華沙起義博物館': ['★ 華沙起義博物館'],
};

const address = (name, street, query, note = '') => ({
  name,
  address: street,
  url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
  note,
  reliable: Boolean(officialPlaceUrls[name]),
  entranceNote: officialPlaceUrls[name] ? entranceNotesByName[name] || '抵達後依官網預約資訊與現場入口標示進入。' : '待班次、分店或現場集合點確認。',
  officialUrl: officialPlaceUrls[name] || null,
  stepLabels: addressStepLabels[name] || [],
});

export const dayOperations = {
  1: {
    cityKey: 'warsaw',
    entryIds: ['connectivity-prepaid-registration', 'aviation-missing-baggage', 'accommodation-confirmations'],
    note: '抵達後啟用網路、確認住宿地址與行李狀態。',
    addresses: [
      address('華沙蕭邦機場', 'Żwirki i Wigury 1, 00-906 Warszawa', 'Warsaw Chopin Airport, Żwirki i Wigury 1, Warszawa', '抵達後依航站現場標示前往 SKM 月台。'),
      address('Warszawa Centralna', 'al. Jerozolimskie 54, 00-024 Warszawa', 'Warszawa Centralna, al. Jerozolimskie 54, Warszawa'),
      address('華沙皇家城堡', 'plac Zamkowy 4, 00-277 Warszawa', 'Royal Castle Warsaw, plac Zamkowy 4, Warszawa'),
      address('華沙老城市場廣場', 'Rynek Starego Miasta, 00-272 Warszawa', 'Rynek Starego Miasta, Warszawa'),
      address('Krakowskie Przedmieście', 'Krakowskie Przedmieście, Warszawa', 'Krakowskie Przedmiescie, Warszawa'),
      accommodationAddress('warsaw-reduta', ['旅館 Check-in']),
    ],
    navigation: [
      { mode: 'SKM', route: '蕭邦機場 → 華沙市中心', action: '抵達後查 WTP 即時班次與月台，使用第 1 區 75 分鐘票。' },
      { mode: '步行／市內交通', route: '住宿 → 老城廣場', action: '先以已確認的住宿地址建立路線；若拖行李不直接去老城。' },
    ],
    dailyAlerts: [
      '抵達日不排室內票券；若入境或行李延誤，直接壓縮老城散步。',
      '離開行李提領區前確認託運行李已到；未到先申報 PIR。',
    ],
    nightChecklist: [...standardNightChecklist, '確認 10/25 華沙 → 克拉科夫車票、車站入口與下車後的行李寄放方案'],
  },
  2: {
    cityKey: 'krakow',
    entryIds: ['rail-trip-tickets', 'calendar-sunday-and-all-saints', 'accommodation-confirmations'],
    note: '非營業週日；火車班次與餐廳營業當日確認。',
    addresses: [
      address('Warszawa Centralna', 'al. Jerozolimskie 54, 00-024 Warszawa', 'Warszawa Centralna, al. Jerozolimskie 54, Warszawa'),
      address('Kraków Główny', 'plac Jana Nowaka-Jeziorańskiego 3, 31-154 Kraków', 'Krakow Glowny, plac Jana Nowaka-Jezioranskiego 3, Krakow'),
      address('瓦維爾大教堂', 'Wawel 3, 31-001 Kraków', 'Wawel Cathedral, Wawel 3, Krakow'),
      address('瓦維爾皇家城堡', 'Wawel 5, 31-001 Kraków', 'Wawel Royal Castle, Wawel 5, Krakow'),
      address('中央廣場 Rynek Główny', 'Rynek Główny, 31-042 Kraków', 'Rynek Glowny, Krakow'),
      address('聖瑪利亞聖殿', 'plac Mariacki 5, 31-042 Kraków', 'St Mary Basilica, plac Mariacki 5, Krakow'),
      address('紡織會館 Sukiennice', 'Rynek Główny 3, 31-042 Kraków', 'Sukiennice, Rynek Glowny 3, Krakow'),
      address('辛德勒工廠', 'Lipowa 4, 30-702 Kraków', 'Oskar Schindler Enamel Factory, Lipowa 4, Krakow'),
      address('Plac Nowy', 'Plac Nowy, 31-056 Kraków', 'Plac Nowy, Krakow'),
      accommodationAddress('krakow-stare-miasto', ['旅館寄放行李']),
    ],
    navigation: [
      { mode: 'PKP', route: '華沙 → 克拉科夫', action: '只依已購票上的車次、車廂與座位進站；月台當日查 Passenger Portal 與站內電子牌。' },
      { mode: '步行／市內交通', route: 'Kraków Główny → Wawel → 辛德勒工廠', action: '取行李後先寄放；Wawel 到 Podgórze 的電車路線當日用 Jakdojade 重查改道。' },
    ],
    dailyAlerts: [
      '10/25 為非營業週日，多數一般商店關閉；餐廳與例外店家仍逐店確認。',
      '華沙至克拉科夫班次在完成購票前都是目標，不把 09:00 當成已確定發車。',
    ],
    nightChecklist: [...standardNightChecklist, '確認 Auschwitz 官方導覽姓名、入場時段、行李限制與往返車票狀態'],
  },
  3: {
    cityKey: 'krakow',
    entryIds: ['dining-reservation-and-backup', 'medical-insurance-and-emergency', 'daily-basics-krakow-water'],
    note: '長時間導覽日，保留補水、保暖與醫療聯絡卡。',
    addresses: [
      address('Kraków MDA 客運站', 'Bosacka 18, 31-505 Kraków', 'MDA Bus Station Krakow, Bosacka 18, Krakow', 'Lajkonik 現行去程由地下 D10 發車；10/26 指定日仍須依售票頁確認。'),
      address('Auschwitz I 訪客服務中心／入口', 'Więźniów Oświęcimia 55, 32-600 Oświęcim', 'Auschwitz I Visitor Service Center, Wiezniow Oswiecimia 55, Oswiecim'),
      address('Auschwitz II–Birkenau', 'Ofiar Faszyzmu 12, 32-600 Brzezinka', 'Auschwitz II Birkenau, Ofiar Faszyzmu 12, Brzezinka'),
      accommodationAddress('krakow-stare-miasto'),
    ],
    navigation: [
      { mode: 'Lajkonik 巴士', route: 'Kraków MDA ↔ Muzeum Auschwitz', action: '現行班表參考 07:10 → 08:35、15:30 → 16:55；10/26 指定日與票價仍須由業者售票頁確認。' },
      { mode: '導覽接駁', route: 'Auschwitz I → Birkenau', action: '參加官方導覽時依當日工作人員指示搭接駁車，不自行跳過集合點。' },
    ],
    dailyAlerts: [
      '所有入場證必須事先線上取得；至少提前 30 分鐘抵達安檢。',
      '行程內容沉重且戶外時間長，帶水、防雨保暖層，晚間不再加排高強度活動。',
    ],
    nightChecklist: [...standardNightChecklist, '確認鹽礦英文團票券、Kraków Główny 去程交通與退房寄行李安排'],
  },
  4: {
    cityKey: 'wroclaw',
    entryIds: ['luggage-storage-transition', 'rail-trip-tickets', 'accessibility-station-assistance'],
    note: '退房後先確認行李寄放，再依實際 PKP 班次轉場。',
    addresses: [
      address('Kraków Główny', 'plac Jana Nowaka-Jeziorańskiego 3, 31-154 Kraków', 'Krakow Glowny, plac Jana Nowaka-Jezioranskiego 3, Krakow'),
      address('維利奇卡鹽礦', 'Daniłowicza 10, 32-020 Wieliczka', 'Wieliczka Salt Mine, Danilowicza 10, Wieliczka'),
      address('Plac Nowy', 'Plac Nowy, 31-056 Kraków', 'Plac Nowy, Krakow'),
      address('紡織會館 Sukiennice', 'Rynek Główny 3, 31-042 Kraków', 'Sukiennice, Rynek Glowny 3, Krakow'),
      address('Wrocław Główny', 'Piłsudskiego 105, 50-085 Wrocław', 'Wroclaw Glowny, Pilsudskiego 105, Wroclaw'),
      accommodationAddress('krakow-stare-miasto', ['早餐 + 退房', '旅館取行李 → Bolt 到 Kraków Główny']),
      accommodationAddress('wroclaw-piast'),
    ],
    navigation: [
      { mode: 'KMŁ', route: 'Kraków Główny ↔ Wieliczka Rynek-Kopalnia', action: '以當日時刻表與售票頁為準；下車後步行前往 Daniłowicza 立坑入口。' },
      { mode: 'PKP', route: 'Kraków Główny → Wrocław Główny', action: '目標 19:30 只是規劃錨點；開賣後依已購直達班次重排取行李與進站時間。' },
    ],
    dailyAlerts: [
      '鹽礦全程階梯多、地下約 17–18°C；穿好走防滑鞋並攜薄外套。',
      '克拉科夫→樂斯拉夫完成購票前，不延長 Kazimierz 活動到壓縮進站緩衝。',
    ],
    nightChecklist: [...standardNightChecklist, '抵達樂斯拉夫後確認隔日 Panorama 時段票、行李寄放與往波茲南的已購車票'],
  },
  5: {
    cityKey: 'poznan',
    entryIds: ['luggage-storage-transition', 'rail-trip-tickets', 'daily-basics-wroclaw-water'],
    note: '高強度轉場日；晚間先充電並下載隔日資料。',
    addresses: [
      address('Wrocław Główny', 'Piłsudskiego 105, 50-085 Wrocław', 'Wroclaw Glowny, Pilsudskiego 105, Wroclaw'),
      address('拉茨瓦維採全景畫', 'Jana Ewangelisty Purkyniego 11, 50-155 Wrocław', 'Panorama Raclawicka, Purkyniego 11, Wroclaw'),
      address('百年廳', 'Wystawowa 1, 51-618 Wrocław', 'Centennial Hall, Wystawowa 1, Wroclaw'),
      address('樂斯拉夫中央廣場', 'Rynek, 50-101 Wrocław', 'Rynek, Wroclaw'),
      address('樂斯拉夫主教座堂', 'plac Katedralny 18, 50-329 Wrocław', 'Wroclaw Cathedral, plac Katedralny 18, Wroclaw'),
      address('Poznań Główny', 'Dworcowa 2, 61-801 Poznań', 'Poznan Glowny, Dworcowa 2, Poznan'),
      accommodationAddress('wroclaw-piast'),
      accommodationAddress('poznan-towarowa'),
    ],
    navigation: [
      { mode: '步行／市內交通', route: '老城 → Panorama → 百年廳 → 座堂島', action: '百年廳跨區移動當日用 Jakdojade 選取實際電車；預留從座堂島回車站取行李的時間。' },
      { mode: 'PKP', route: 'Wrocław Główny → Poznań Główny', action: '目標 19:00 不是已確定班次；依已購票券的車次與月台行動。' },
    ],
    dailyAlerts: [
      '百年廳 10/28 的內部參觀狀態須以官方 availability calendar 確認；未確認前只排外觀與周邊。',
      '點燈人沒有對外保證的出發分鐘；日落前到座堂島等待，不把 16:45 當成確定時刻。',
    ],
    nightChecklist: [...standardNightChecklist, '確認 10/29 山羊鐘樓卡位路線、波茲南行李寄放與返華沙車票'],
  },
  6: {
    cityKey: 'warsaw',
    entryIds: ['luggage-storage-transition', 'rail-trip-tickets', 'dining-reservation-and-backup'],
    note: '城際火車與華沙住宿均以離線地址備援。',
    addresses: [
      address('Poznań Główny', 'Dworcowa 2, 61-801 Poznań', 'Poznan Glowny, Dworcowa 2, Poznan'),
      address('波茲南主教座堂', 'Ostrów Tumski 17, 61-109 Poznań', 'Poznan Cathedral, Ostrow Tumski 17, Poznan'),
      address('波茲南市政廳', 'Stary Rynek 1, 61-768 Poznań', 'Poznan Town Hall, Stary Rynek 1, Poznan', '博物館整修閉館，此地點用於 12:00 山羊鐘樓秀外觀。'),
      address('帝王城堡', 'Święty Marcin 80/82, 61-809 Poznań', 'Zamek Culture Centre, Swiety Marcin 80 82, Poznan'),
      address('Stary Browar', 'Półwiejska 42, 61-888 Poznań', 'Stary Browar, Polwiejska 42, Poznan'),
      address('Warszawa Centralna', 'al. Jerozolimskie 54, 00-024 Warszawa', 'Warszawa Centralna, al. Jerozolimskie 54, Warszawa'),
      accommodationAddress('poznan-towarowa'),
      accommodationAddress('warsaw-metropol'),
    ],
    navigation: [
      { mode: '步行／市內交通', route: '教堂島 → 舊城市場 → 帝王城堡 → Poznań Główny', action: '11:45 前到市政廳正面；全程依當日交通與步行時間保留取行李緩衝。' },
      { mode: 'PKP', route: 'Poznań Główny → Warszawa Centralna', action: '目標 17:30 只作為排程上限；實際車次、座位與月台依已購票及當日電子牌。' },
    ],
    dailyAlerts: [
      '市政廳博物館整修閉館；主行程只看官方確認的 12:00 山羊鐘樓秀。',
      '聖馬丁牛角麵包尚未選定分店；待分店與營業確定後再導航，不預填地址。',
    ],
    nightChecklist: [...standardNightChecklist, '確認 Day 7 三館已購時段、入場地址與晚餐訂位狀態'],
  },
  7: {
    cityKey: 'warsaw',
    entryIds: ['calendar-sunday-and-all-saints', 'dining-reservation-and-backup', 'emergency-taiwan-representative'],
    note: '諸聖節前夕，逐店確認晚餐與交通；離線備妥 SOS 卡。',
    addresses: [
      address('華沙皇家城堡', 'plac Zamkowy 4, 00-277 Warszawa', 'Royal Castle Warsaw, plac Zamkowy 4, Warszawa'),
      address('華沙老城市場廣場', 'Rynek Starego Miasta, 00-272 Warszawa', 'Rynek Starego Miasta, Warszawa'),
      address('POLIN 波蘭猶太人歷史博物館', 'Mordechaja Anielewicza 6, 00-157 Warszawa', 'POLIN Museum, Mordechaja Anielewicza 6, Warszawa'),
      address('華沙起義博物館', 'Grzybowska 79, 00-844 Warszawa', 'Warsaw Rising Museum, Grzybowska 79, Warszawa'),
      accommodationAddress('warsaw-metropol'),
    ],
    navigation: [
      { mode: '步行／市內交通', route: '皇家城堡 → POLIN → 華沙起義博物館', action: '以已購入場時段倒推離館時間；館際移動當日用 Jakdojade 重算。' },
      { mode: '步行／餐廳', route: '起義博物館 → 華沙晚餐', action: '晚餐地址待訂位／分店確定後填入；不以備選店名臆測導航。' },
    ],
    dailyAlerts: [
      '三館內容量大；保留已購時段，不為追完所有展區壓縮館際移動。',
      '10/31 為諸聖節前夕，今晚重查明日市區交通、機場與店家特別營運。',
    ],
    nightChecklist: [...standardNightChecklist, '整理 TAX FREE 商品與文件，確認需海關查驗的託運品不先交運', '確認 QR 260 報到、行李額度、機場交通與護照收納位置'],
  },
  8: {
    cityKey: 'warsaw',
    entryIds: ['tax-free-vat-refund', 'aviation-trip-baggage-confirmation', 'documents-travel-registration'],
    note: '離開 EU 前處理退稅；託運商品若需查驗，先完成海關程序。',
    addresses: [
      accommodationAddress('warsaw-metropol'),
      address('華沙老城市場廣場', 'Rynek Starego Miasta, 00-272 Warszawa', 'Rynek Starego Miasta, Warszawa'),
      address('Warszawa Centralna', 'al. Jerozolimskie 54, 00-024 Warszawa', 'Warszawa Centralna, al. Jerozolimskie 54, Warszawa'),
      address('華沙蕭邦機場', 'Żwirki i Wigury 1, 00-906 Warszawa', 'Warsaw Chopin Airport, Żwirki i Wigury 1, Warszawa'),
      address('駐波蘭台北代表處', '30th Floor, ul. Emilii Plater 53, 00-113 Warszawa', 'Taipei Representative Office in Poland, Emilii Plater 53, Warszawa', '僅供緊急狀況備援，不列為一般行程站點。'),
    ],
    navigation: [
      { mode: 'SKM', route: '華沙市中心 → 蕭邦機場', action: '當日查 WTP 即時發車、月台與改道；如要退稅或託運商品查驗，比一般報到更早抵達。' },
      { mode: '航空／出境', route: 'WAW → DOH → HKG → TPE', action: '依電子機票與報到櫃檯確認行李直掛終點與轉機程序；每段登機牌離線保存。' },
    ],
    dailyAlerts: [
      '離開 EU：如有 TAX FREE，先完成必要的出口確認與商品查驗，再交付託運行李。',
      '10/31 為諸聖節前夕；市區交通與機場營運以當日公告為準，不用平日末班資料倒推。',
    ],
    nightChecklist: [...standardNightChecklist, '抵台後確認行李已全數取得，保留登機牌、TAX FREE 與必要收據至程序結束'],
  },
};

// 未確認步驟必須人工明列；新增行程若沒有可靠地址或這份清單，validator 會直接失敗。
const dynamicTransitReason = '班次、月台或上下車點為動態資料，依已購票與當日電子牌確認。';
const flexibleStopReason = '未選定可靠分店或為彈性活動，不預填地址。';
const unresolvedStepReasons = {
  1: {
    'SKM S2/S3 目標班次': dynamicTransitReason,
    'Pierogi 晚餐': flexibleStopReason,
    '早睡倒時差': '休息安排不需要導航地址。',
  },
  2: {
    '華沙 → 克拉科夫直達車': dynamicTransitReason,
    '車站周邊午餐': flexibleStopReason,
    '電車 50 / 24 到 Plac Bohaterów Getta': dynamicTransitReason,
  },
  3: {
    'Lajkonik · 克拉科夫 → 奧斯威辛': dynamicTransitReason,
    'Lajkonik 巴士返克拉科夫': dynamicTransitReason,
    '抵 Kraków MDA · 休息': '抵達後的休息地點保持彈性，不需要固定導航地址。',
    '安靜晚餐沉澱情緒': flexibleStopReason,
  },
  4: {
    '火車到 Wieliczka Rynek-Kopalnia': dynamicTransitReason,
    'Wieliczka 鎮中心午餐': flexibleStopReason,
    '自由活動或補拍照、找地方喝咖啡': flexibleStopReason,
    'IC 直達車': dynamicTransitReason,
  },
  5: {
    '糖果屋雙屋 + 教堂塔樓': '教堂塔樓入口與開放狀態須依當日官方公告確認。',
    '取行李 → Wrocław Główny': 'Piast 住宿已確認，但完整門牌尚待飯店第一方或私人訂房確認核對。',
    'IC 直達車': dynamicTransitReason,
  },
  6: {
    '★ 聖馬丁牛角麵包 (PGI)': '尚未選定可靠分店，待分店與營業時間確認後補入。',
    '波茲南 → 華沙直達車': dynamicTransitReason,
  },
  7: {
    '午餐（老城 → POLIN 路上）': flexibleStopReason,
    '老城最後晚餐': flexibleStopReason,
  },
  8: {
    'SKM S2/S3 目標班次': dynamicTransitReason,
  },
};

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
export function validateTravelDatabase({ entries, sections, readiness, operations, labels }) {
  const allowedCategories = new Set(['place', 'transit', 'dining', 'practical', 'safety', 'document']);
  const allowedCityKeys = new Set(['WAW', 'KRK', 'WRO', 'POZ', 'PL', 'ROUTE']);
  const sectionIds = new Set();
  for (const section of sections) {
    assertStableSlug(section.id, '資料庫 section ID');
    if (sectionIds.has(section.id)) throw new Error(`資料庫 section ID 重複：${section.id}`);
    sectionIds.add(section.id);
  }

  const entryIds = new Set();
  const entriesById = new Map();
  const sectionCounts = new Map(sections.map(section => [section.id, 0]));
  for (const entry of entries) {
    assertStableSlug(entry.id, '資料庫 entry ID');
    if (entryIds.has(entry.id)) throw new Error(`資料庫 entry ID 重複：${entry.id}`);
    entryIds.add(entry.id);
    entriesById.set(entry.id, entry);

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

  const readinessIds = new Set();
  for (const item of readiness) {
    assertStableSlug(item.id, 'readiness ID');
    if (readinessIds.has(item.id)) throw new Error(`readiness ID 重複：${item.id}`);
    readinessIds.add(item.id);
    for (const field of ['title', 'detail']) assertNonEmptyText(item[field], `${item.id} 的 ${field}`);
    if (!['P0', 'P1'].includes(item.priority)) throw new Error(`${item.id} 使用未知 priority：${item.priority}`);
    if (typeof item.private !== 'boolean') throw new Error(`${item.id} 的 private 必須是 boolean`);
    const entry = entriesById.get(item.entryId);
    if (!entry) throw new Error(`${item.id} 指向不存在的 entry：${item.entryId}`);
    if (item.status !== entry.status) throw new Error(`${item.id} 的狀態與 ${item.entryId} 不一致`);
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

    if (!Array.isArray(operation.entryIds) || operation.entryIds.length === 0) {
      throw new Error(`Day ${day} 的 entryIds 必須是非空陣列`);
    }
    for (const entryId of operation.entryIds) {
      if (!entriesById.has(entryId)) throw new Error(`Day ${day} 指向不存在的 entry：${entryId}`);
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

  const serialized = JSON.stringify({ entries, sections, readiness, operations });
  for (const forbidden of forbiddenPublicContent) {
    if (serialized.includes(forbidden)) throw new Error(`公開資料含禁止內容：${forbidden}`);
  }

  return true;
}

validateTravelDatabase({
  entries: databaseEntries,
  sections: databaseSections,
  readiness: readinessItems,
  operations: dayOperations,
  labels: statusLabels,
});
