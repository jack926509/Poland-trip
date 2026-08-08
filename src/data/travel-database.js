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

export const databaseEntries = [
  {
    id: 'entry-etias-and-passport', section: 'entry', category: '入境資格', cityKey: null,
    title: '護照與 ETIAS 動態閘門',
    summary: '非 EU 旅客護照須在離開 EU 後至少仍有 3 個月效期、入境日距簽發日不得超過 10 年。ETIAS 官方頁目前寫預計 2026 年第 4 季啟用，行程正值該期間，不能先判定不需要申請。',
    status: 'recheck', sourceUrl: 'https://travel-europe.europa.eu/en/etias', verifiedAt: '2026-08-08', recheckAt: '2026-09-24',
    offlineNote: '列印護照、回程票、住宿與保險證明；出發前 30、14、3 天重查 EU 官方頁。', private: false,
  },
  {
    id: 'aviation-baggage-and-connection', section: 'aviation', category: '聯運行李', cityKey: null,
    title: '聯運行李額度與轉機',
    summary: '聯運行程的行李額度可能依 IATA Most Significant Marketing Carrier 規則決定，實際額度、是否直掛與轉機程序必須以電子機票及航空公司確認為準。',
    status: 'private-required', sourceUrl: 'https://www.qatarairways.com/en/baggage/allowance.html', verifiedAt: '2026-08-08', recheckAt: '2026-10-22',
    offlineNote: '離線保存電子機票；出發前 48 小時核對報到、航廈、座位、行李直掛與特殊餐。', private: true,
  },
  {
    id: 'aviation-missing-baggage', section: 'aviation', category: '行李異常', cityKey: 'warsaw',
    title: '行李未到處理',
    summary: '託運行李未出現在轉盤時，應在離開行李提領區前向最後承運航空申報，建立 PIR 並保存行李牌與收據。',
    status: 'verified', sourceUrl: 'https://www.iata.org/en/programs/ops-infra/baggage/passenger-baggage-rules/', verifiedAt: '2026-08-08', recheckAt: null,
    offlineNote: '先到 baggage service；記下 PIR，再提供第一晚住宿配送地址。', private: false,
  },
  {
    id: 'rail-ticket-and-delay-rights', section: 'rail', category: '城際車票', cityKey: null,
    title: '城際車票與延誤處理',
    summary: '火車票須記錄完整站名、車次、車廂、座位與是否為 through-ticket。預計延誤 60 分鐘以上時，官方規則提供退款、改道或改日等選項。',
    status: 'pending', sourceUrl: 'https://europa.eu/youreurope/citizens/travel/passenger-rights/rail/index_en.htm', verifiedAt: '2026-08-08', recheckAt: '2026-09-23',
    offlineNote: 'PKP 開賣後保存車票 PDF 與月台查詢連結；分開買票要留意轉乘保障可能不同。', private: false,
  },
  {
    id: 'rail-station-directory', section: 'rail', category: '車站資訊', cityKey: null,
    title: '車站即時資訊與設施',
    summary: 'PKP PLK Passenger Portal 的車站目錄提供站址、座標、抵離站資訊及部分無障礙設施，可作為四大車站的動態入口。',
    status: 'recheck', sourceUrl: 'https://portalpasazera.pl/en/KatalogStacji', verifiedAt: '2026-08-08', recheckAt: '2026-10-24',
    offlineNote: '離線保存車站全名與純文字地址；月台與設施以當天頁面為準。', private: false,
  },
  {
    id: 'connectivity-prepaid-registration', section: 'connectivity', category: 'SIM 與離線', cityKey: null,
    title: '波蘭預付 SIM 登記',
    summary: '波蘭預付 SIM 完成登記前不會啟用；外國人可使用護照或居留卡資料登記。未選定方案前不填虛構流量或價格。',
    status: 'pending', sourceUrl: 'https://cik.uke.gov.pl/gfx/cik/userfiles/_public/ukraina_poradniki/uslugi_telekomunikacyjne_en.pdf', verifiedAt: '2026-08-08', recheckAt: '2026-10-24',
    offlineNote: '先下載四城地圖、票券 PDF、住宿與車站地址；eSIM 先確認手機支援且已解鎖。', private: false,
  },
  {
    id: 'money-pln-and-dcc', section: 'money', category: '付款策略', cityKey: null,
    title: 'PLN 付款與拒絕 DCC',
    summary: '波蘭法定貨幣為 złoty 與 grosz。商店或 ATM 提供動態貨幣轉換時，應顯示幣別、匯率與費用，持卡人可拒絕轉換。',
    status: 'verified', sourceUrl: 'https://www.visa.com/en-us/personal/travel/dynamic-currency-conversion', verifiedAt: '2026-08-08', recheckAt: null,
    offlineNote: '付款與提款優先選 PLN；保留少量現金並把備用卡與現金分開收。', private: false,
  },
  {
    id: 'medical-insurance-and-emergency', section: 'medical', category: '海外醫療', cityKey: null,
    title: '旅平險與緊急就醫',
    summary: '波蘭緊急狀況可撥 112；醫療急症可撥 999。保險公司、保單號與海外救援電話必須由旅客自行填入私人資料。',
    status: 'private-required', sourceUrl: 'https://www.gov.pl/web/mswia-en/emergency-number-112', verifiedAt: '2026-08-08', recheckAt: '2026-10-21',
    offlineNote: '危及生命先撥 112 或 999，接著聯絡保險救援並保存診斷、處方、收據與付款證明。', private: true,
  },
  {
    id: 'emergency-taiwan-representative', section: 'emergency', category: '駐外聯絡', cityKey: 'warsaw',
    title: '駐波蘭台北代表處',
    summary: '地址：30th Floor, Ul. Emilii Plater 53, 00-113 Warsaw, Poland。辦公室電話 +48 22 213 0060；急難救助電話 +48 668 027 574，僅限生命安全等緊急狀況。',
    status: 'verified', sourceUrl: 'https://www.mofa.gov.tw/CountryInfo.aspx?CASN=1&n=164&s=124&sms=33&tabs=08617EE9DB3C61E3', verifiedAt: '2026-08-08', recheckAt: '2026-10-24',
    offlineNote: '離線保存純文字地址與電話；領務事項於辦公時間聯絡。', private: false,
  },
  {
    id: 'emergency-lost-passport', section: 'emergency', category: '護照遺失', cityKey: null,
    title: '國外遺失護照步驟',
    summary: '護照遺失時，先向當地警察報案取得證明，再聯絡駐外館處申請補發；急於返國可詢問入國證明書。',
    status: 'verified', sourceUrl: 'https://www.boca.gov.tw/fp-24-6772-acc24-1.html', verifiedAt: '2026-08-08', recheckAt: null,
    offlineNote: '把護照影本與照片與正本分開保存。', private: false,
  },
  {
    id: 'luggage-storage-transition', section: 'luggage', category: '退房與寄放', cityKey: null,
    title: '轉場日行李寄放',
    summary: '退房後優先使用旅館寄放；若旅館未確認，才以車站或人工寄存作備案。費率、尺寸與空位皆為動態資料，不預先保證。',
    status: 'private-required', sourceUrl: 'https://portalpasazera.pl/en/KatalogStacji', verifiedAt: '2026-08-08', recheckAt: '2026-10-20',
    offlineNote: '每個轉場日先確認最晚領取時間、費用與件數；離線保留 A 旅館／B 車站備案。', private: true,
  },
  {
    id: 'calendar-sunday-and-all-saints', section: 'calendar', category: '特別營運', cityKey: null,
    title: '非營業週日與諸聖節前夕',
    summary: '10/25 為非營業週日，多數一般商店不得營業；10/31 為諸聖節前夕，交通、人潮與店家營業可能調整。餐廳與各店仍須逐店查證。',
    status: 'recheck', sourceUrl: 'https://www.gov.pl/web/family/trade-on-sundays', verifiedAt: '2026-08-08', recheckAt: '2026-10-18',
    offlineNote: '10/25 手機會自動更新夏令時間，但紙本與手錶要自行確認。', private: false,
  },
  {
    id: 'tax-free-vat-refund', section: 'tax-free', category: '旅客退稅', cityKey: 'warsaw',
    title: 'TAX FREE 出口確認',
    summary: '旅客須在 EU 外有永久居所、向合格店家取得文件，單一 TAX FREE 文件含稅金額至少 200 PLN，並在期限前以未使用商品隨身行李帶離 EU。',
    status: 'verified', sourceUrl: 'https://www.podatki.gov.pl/pozostale/tax-free-vat-refund-vap-oss-i-ioss/zwrot-vat-dla-podroznych', verifiedAt: '2026-08-08', recheckAt: '2026-10-31',
    offlineNote: '購買時索取文件；離境前備妥商品、護照、登機資料與單據。託運商品先完成需要的海關查驗。', private: false,
  },
  {
    id: 'accessibility-station-assistance', section: 'accessibility', category: '低步行備案', cityKey: null,
    title: '車站無障礙與協助',
    summary: 'PKP PLK Passenger Portal 可查部分車站對行動不便旅客的設施與可達性；需要協助者應依營運單位規則在訂票前申請。',
    status: 'recheck', sourceUrl: 'https://portalpasazera.pl/en/KatalogStacji', verifiedAt: '2026-08-08', recheckAt: '2026-10-10',
    offlineNote: '每天保留少走路版：叫車或低地板交通，並在出發前確認電梯與協助狀態。', private: false,
  },
  {
    id: 'daily-basics-krakow-water', section: 'daily-basics', category: '飲水與充電', cityKey: 'krakow',
    title: '克拉科夫飲水與每日離線包',
    summary: '克拉科夫城市供水符合波蘭與 EU 飲用標準，可直接飲用而無須煮沸；若住宿告知建物管線有問題，或水色、氣味異常，則不要飲用並詢問櫃檯。裝置是否可用 230V 要看充電器 INPUT。',
    status: 'verified', sourceUrl: 'https://wodociagi.krakow.pl/en/water-quality/facts-and-myths-about-tap-water', verifiedAt: '2026-08-08', recheckAt: null,
    offlineNote: '每日晚間充電、下載隔日票券與地圖，並截圖月台及集合點。', private: false,
  },
  {
    id: 'daily-basics-wroclaw-water', section: 'daily-basics', category: '飲水與充電', cityKey: 'wroclaw',
    title: '樂斯拉夫飲水與每日離線包',
    summary: '樂斯拉夫城市供水受持續監測，符合波蘭、EU 及 WHO 標準；若住宿告知建物管線有問題，或水色、氣味異常，則不要飲用並詢問櫃檯。裝置是否可用 230V 要看充電器 INPUT。',
    status: 'verified', sourceUrl: 'https://www.mpwik.wroc.pl/csr-2/pij-kranowke/', verifiedAt: '2026-08-08', recheckAt: null,
    offlineNote: '每日晚間充電、下載隔日票券與地圖，並截圖月台及集合點。', private: false,
  },
  {
    id: 'dining-reservation-and-backup', section: 'dining', category: '用餐備案', cityKey: null,
    title: '餐廳訂位與當日營業',
    summary: '主選餐廳只有在分店地址與當日營業時間確認後才標示已查；每餐另備同區與便利備案，不從其他分店套用時間。',
    status: 'pending', sourceUrl: null, verifiedAt: null, recheckAt: '2026-10-17',
    offlineNote: '保存訂位姓名、時間與過敏飲食需求的波蘭文／英文卡，但不放到公開網站。', private: false,
  },
  {
    id: 'documents-travel-registration', section: 'documents', category: '旅程文件', cityKey: null,
    title: '入境文件包與旅外登錄',
    summary: '免簽入境可能被要求出示住宿、行程、回程票與財力證明；出發前應完成旅外國人動態登錄並讓緊急聯絡人持有行程與住宿資訊。',
    status: 'private-required', sourceUrl: 'https://www.boca.gov.tw/sp-foof-countrycp-01-62-aa8d5-02-1.html', verifiedAt: '2026-08-08', recheckAt: '2026-10-21',
    offlineNote: '列印或離線保存住宿、回程票、保險與完整行程；不要公開證件號碼與付款證明。', private: true,
  },
  {
    id: 'documents-attraction-tickets', section: 'documents', category: '景點票券', cityKey: null,
    title: '景點票券與入場時段',
    summary: '須預約景點的購票狀態、參觀日期、入場時段與同行人數尚待逐項確認；公開版只顯示進度，不保存票券條碼、姓名或付款資料。',
    status: 'pending', sourceUrl: null, verifiedAt: null, recheckAt: '2026-09-24',
    offlineNote: '完成購票後把票券 PDF、官方地址、集合點與取消規則存入私人離線包。', private: true,
  },
  {
    id: 'accommodation-confirmations', section: 'accommodation', category: '住宿訂單', cityKey: null,
    title: '7 晚住宿確認',
    summary: '住宿名稱、完整地址、日期、入住退房、聯絡方式與寄放行李確認都尚待填入；公開版僅顯示完成狀態，不公開訂房代碼、姓名或付款證明。',
    status: 'private-required', sourceUrl: null, verifiedAt: null, recheckAt: '2026-10-10',
    offlineNote: '離線保存每張住宿確認與純文字地址；華沙、克拉科夫、樂斯拉夫、波茲南各自備妥導航。', private: true,
  },
];

export const readinessItems = [
  { id: 'accommodation', title: '住宿', detail: '確認 7 晚訂單、完整地址與寄放安排', priority: 'P0', status: 'private-required', entryId: 'accommodation-confirmations', private: true },
  { id: 'rail-tickets', title: '城際車票', detail: '確認車次、車廂、座位與轉乘保障', priority: 'P0', status: 'pending', entryId: 'rail-ticket-and-delay-rights', private: false },
  { id: 'attraction-tickets', title: '景點票券', detail: '確認日期、入場時段與離線票券', priority: 'P0', status: 'pending', entryId: 'documents-attraction-tickets', private: true },
  { id: 'flight-ticket', title: '航班行李', detail: '核對電子機票、行李額度與是否直掛', priority: 'P0', status: 'private-required', entryId: 'aviation-baggage-and-connection', private: true },
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

const accommodationAddress = city => ({
  name: `${city} 住宿`,
  address: '待住宿／分店確定後填入',
  url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${city} Poland`)}`,
  note: '公開版不填未確定的旅館名與訂單資料。',
});

const address = (name, street, query, note = '') => ({
  name,
  address: street,
  url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
  note,
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
      accommodationAddress('Warszawa'),
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
    entryIds: ['rail-ticket-and-delay-rights', 'calendar-sunday-and-all-saints', 'accommodation-confirmations'],
    note: '非營業週日；火車班次與餐廳營業當日確認。',
    addresses: [
      address('Warszawa Centralna', 'al. Jerozolimskie 54, 00-024 Warszawa', 'Warszawa Centralna, al. Jerozolimskie 54, Warszawa'),
      address('Kraków Główny', 'plac Jana Nowaka-Jeziorańskiego 3, 31-154 Kraków', 'Krakow Glowny, plac Jana Nowaka-Jezioranskiego 3, Krakow'),
      address('瓦維爾大教堂', 'Wawel 3, 31-001 Kraków', 'Wawel Cathedral, Wawel 3, Krakow'),
      address('辛德勒工廠', 'Lipowa 4, 30-702 Kraków', 'Oskar Schindler Enamel Factory, Lipowa 4, Krakow'),
      accommodationAddress('Kraków'),
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
      address('Kraków MDA 客運站', 'Bosacka 18, 31-505 Kraków', 'MDA Bus Station Krakow, Bosacka 18, Krakow', '實際業者與月台待 10/26 班表確定。'),
      address('Auschwitz I', 'Więźniów Oświęcimia 20, 32-600 Oświęcim', 'Auschwitz I, Wiezniow Oswiecimia 20, Oswiecim'),
      address('Auschwitz II–Birkenau', 'Ofiar Faszyzmu 12, 32-600 Brzezinka', 'Auschwitz II Birkenau, Ofiar Faszyzmu 12, Brzezinka'),
      accommodationAddress('Kraków'),
    ],
    navigation: [
      { mode: '巴士／火車', route: '克拉科夫 ↔ Oświęcim', action: '以 09:00 前抵達為目標；業者、發車站、月台、票價與回程都等 10/26 班表再定。' },
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
    entryIds: ['luggage-storage-transition', 'rail-ticket-and-delay-rights', 'accessibility-station-assistance'],
    note: '退房後先確認行李寄放，再依實際 PKP 班次轉場。',
    addresses: [
      address('Kraków Główny', 'plac Jana Nowaka-Jeziorańskiego 3, 31-154 Kraków', 'Krakow Glowny, plac Jana Nowaka-Jezioranskiego 3, Krakow'),
      address('維利奇卡鹽礦', 'Daniłowicza 10, 32-020 Wieliczka', 'Wieliczka Salt Mine, Danilowicza 10, Wieliczka'),
      address('Wrocław Główny', 'Piłsudskiego 105, 50-085 Wrocław', 'Wroclaw Glowny, Pilsudskiego 105, Wroclaw'),
      accommodationAddress('Wrocław'),
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
    entryIds: ['luggage-storage-transition', 'rail-ticket-and-delay-rights', 'daily-basics-wroclaw-water'],
    note: '高強度轉場日；晚間先充電並下載隔日資料。',
    addresses: [
      address('Wrocław Główny', 'Piłsudskiego 105, 50-085 Wrocław', 'Wroclaw Glowny, Pilsudskiego 105, Wroclaw'),
      address('拉茨瓦維採全景畫', 'Jana Ewangelisty Purkyniego 11, 50-155 Wrocław', 'Panorama Raclawicka, Purkyniego 11, Wroclaw'),
      address('百年廳', 'Wystawowa 1, 51-618 Wrocław', 'Centennial Hall, Wystawowa 1, Wroclaw'),
      address('樂斯拉夫主教座堂', 'plac Katedralny 18, 50-329 Wrocław', 'Wroclaw Cathedral, plac Katedralny 18, Wroclaw'),
      address('Poznań Główny', 'Dworcowa 2, 61-801 Poznań', 'Poznan Glowny, Dworcowa 2, Poznan'),
      accommodationAddress('Poznań'),
    ],
    navigation: [
      { mode: '步行／市內交通', route: '老城 → Panorama → 百年廳 → 座堂島', action: '百年廳跨區移動當日用 Jakdojade 選取實際電車；預留從座堂島回車站取行李的時間。' },
      { mode: 'PKP', route: 'Wrocław Główny → Poznań Główny', action: '目標 19:00 不是已確定班次；依已購票券的車次與月台行動。' },
    ],
    dailyAlerts: [
      '百年廳 10/28 圓頂展廳不開放，只排外觀與周邊；出發前仍重查當日公告。',
      '點燈人沒有對外保證的出發分鐘；日落前到座堂島等待，不把 16:45 當成確定時刻。',
    ],
    nightChecklist: [...standardNightChecklist, '確認 10/29 山羊鐘樓卡位路線、波茲南行李寄放與返華沙車票'],
  },
  6: {
    cityKey: 'warsaw',
    entryIds: ['luggage-storage-transition', 'rail-ticket-and-delay-rights', 'dining-reservation-and-backup'],
    note: '城際火車與華沙住宿均以離線地址備援。',
    addresses: [
      address('Poznań Główny', 'Dworcowa 2, 61-801 Poznań', 'Poznan Glowny, Dworcowa 2, Poznan'),
      address('波茲南主教座堂', 'Ostrów Tumski 17, 61-109 Poznań', 'Poznan Cathedral, Ostrow Tumski 17, Poznan'),
      address('波茲南市政廳', 'Stary Rynek 1, 61-768 Poznań', 'Poznan Town Hall, Stary Rynek 1, Poznan', '博物館整修閉館，此地點用於 12:00 山羊鐘樓秀外觀。'),
      address('帝王城堡', 'Święty Marcin 80/82, 61-809 Poznań', 'Zamek Culture Centre, Swiety Marcin 80 82, Poznan'),
      address('Warszawa Centralna', 'al. Jerozolimskie 54, 00-024 Warszawa', 'Warszawa Centralna, al. Jerozolimskie 54, Warszawa'),
      accommodationAddress('Warszawa'),
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
      address('POLIN 波蘭猶太人歷史博物館', 'Mordechaja Anielewicza 6, 00-157 Warszawa', 'POLIN Museum, Mordechaja Anielewicza 6, Warszawa'),
      address('華沙起義博物館', 'Grzybowska 79, 00-844 Warszawa', 'Warsaw Rising Museum, Grzybowska 79, Warszawa'),
      accommodationAddress('Warszawa'),
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
    entryIds: ['tax-free-vat-refund', 'aviation-baggage-and-connection', 'documents-travel-registration'],
    note: '離開 EU 前處理退稅；託運商品若需查驗，先完成海關程序。',
    addresses: [
      accommodationAddress('Warszawa'),
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
