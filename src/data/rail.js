// rail.js — 火車與巴士的單一來源。
//
// 精煉切片 3：trip.js 原本把每段城際交通存兩份（days[].train 整段複製、
// trains[] 再整段複製一次），Lajkonik 巴士的時刻與票價更在 trip.js 全檔
// 手打超過 10 處。這裡把 trains[] 升格為 segments[]（多補 id、day 兩欄
// 供 lib/rail.mjs 查找），auschwitzBus 也搬進來與 segments 同檔——
// Lajkonik 段（id:'bus-lajkonik'）的 dep/arr/dur/price 全部由
// auschwitzBus.outbound/inbound.services 中 decision === '採用' 的班次
// 推導，不再另外手抄一份。
//
// id 格式沿用 src/scripts/dashboard.js collectDeadlines() 產生倒數項目
// 時已使用的 `rail-<type-slug>` 規則（該函式的 id 加上 'rail-' 前綴即為
// 此處的 id），兩邊看到的是同一段資料。

/** 從 auschwitzBus.*.services 取出標記某個 decision 的班次；找不到就是資料本身有誤，直接丟錯不要悄悄回傳空值。 */
function pickService(services, decision) {
  const service = services.find(item => item.decision === decision);
  if (!service) throw new Error(`auschwitzBus 找不到 decision="${decision}" 的班次`);
  return service;
}

// Lajkonik · Auschwitz 往返巴士。
// 去回程資料為 2026-09-09 查詢 2026-10-26 的官方售票頁快照，尚未購票；
// 2026-10-06 重查公告班表與司機售票價，未重查指定日可售座位。
export const auschwitzBus = {
  operator: 'LAJKONIK',
  site: 'https://www.lajkonikbus.pl/',
  siteNote: '首頁右上可切 English；表單四欄依序為 Departure from／Destination／Date of departure／Normal（人數），按 Search courses 查班次，每筆班次可直接 Buy ticket。另有 Where is my bus? 查即時車輛位置、My Ticket 查已購票券。',
  fare: '全票 25.00 zł／優待 22.00 zł（每人，2026-09-09 查 2026-10-26 的線上票價快照，付款前重查）；2026-10-06 複核司機售票全票 27.00 zł／優待 22.00 zł，線上可能另有折扣，優待須符合資格並出示證明',
  stops: {
    krakow: 'Kraków · ul. Bosacka 18, Dworzec Autobusowy（MDA，Kraków Główny 後方步行約 5 分；站位 D9／D10）',
    oswiecim: 'Oświęcim · Więźniów Oświęcimia 55（Muzeum Auschwitz，下車處在博物館停車場對面）',
  },
  outbound: {
    status: '已於官方售票頁查得／尚未購票',
    checkedAt: '2026-09-09',
    query: { from: 'Kraków', to: 'Oświęcim', date: '2026-10-26', passengers: 1 },
    services: [
      { dep: '07:10', arr: '08:35', dur: '1h25', bay: 'D10', fare: '25,00 zł', decision: '採用', why: '距 10:30 入場有 1 小時 55 分，足以吸收巴士誤點、寄物與安檢排隊。' },
      { dep: '08:25', arr: '09:50', dur: '1h25', bay: 'D9', fare: '25,00 zł', decision: '不採用', why: '官方要求導覽前至少 30 分鐘抵達，以留安檢時間；10:30 導覽應在 10:00 前到場。此班只比到場要求早 10 分鐘，難吸收誤點與下車步行，因此不採用。' },
    ],
    note: '2026-09-09 查 10/26 的售票頁只顯示這兩班、沒有 07:35，這是當時的可售快照。2026-10-06 複核官方公告班表（自 2026-03-01 起至變更），Kraków MDA（Bosacka 18）發車為 06:15（11–3 月）／07:10／08:25／09:20／10:40／11:30／13:00／14:00／15:55（4–10 月），多數由 D10 發車（08:25 為 D9）。部分班次有季節／假日代碼，公告班表不代表 10/26 全部可售；班次、座位及線上票價仍須在付款前重查。',
  },
  inbound: {
    status: '已於官方售票頁查得／尚未購票',
    checkedAt: '2026-09-09',
    threshold: '導覽約 14:15 結束，必須挑 14:15 之後發車的班次',
    query: { from: 'Oświęcim', to: 'Kraków', date: '2026-10-26', passengers: 1 },
    services: [
      { dep: '14:00', arr: '15:25', dur: '1h25', fare: '25,00 zł', decision: '不採用', why: '在導覽 14:15 結束前就發車，趕不上。' },
      { dep: '15:30', arr: '16:55', dur: '1h25', fare: '25,00 zł', decision: '採用', why: '導覽結束後有 75 分鐘走回站牌、上洗手間與逛訪客中心書店，緩衝充足又不必空等。' },
      { dep: '16:30', arr: '17:55', dur: '1h25', fare: '25,00 zł', decision: '備案', why: '若導覽延後、比克瑙接駁排隊或想多留時間，改搭這班；代價是多等 1 小時。' },
    ],
    note: '2026-09-09 查 10/26 的售票頁下午只顯示這三班，25,00 zł 是當時的線上票價快照。2026-10-06 複核官方公告班表（自 2026-03-01 起至變更），Oświęcim Muz. Auschwitz 回程為 08:10（11–3 月）／09:00／11:00／12:00／14:00／15:30／16:30／17:30／18:30（4–10 月）；17:30／18:30 是公告中的較晚班次，適用日期與座位須另查。15:30／16:30 由 Więźniów Oświęcimia 55 發車，公告抵 Kraków MDA Bosacka 18 分別為 16:55／17:55。中途站是招手停，部分班次有季節／假日代碼；付款前確認 10/26 適用班次、座位與票價。',
  },
  // 巴士的取捨完全由這個已訂妥的導覽場次決定，因此把場次一併放在同一區塊。
  tour: {
    status: '已訂妥',
    date: '2026-10-26（一）',
    time: '10:30',
    name: 'Zwiedzanie indywidualne z edukatorem（個人 educator 導覽）',
    scope: 'Zwiedzanie ogólne · Auschwitz I ＋ Birkenau',
    language: 'English',
    duration: '官方標示 3 godz. 45 min.（3 小時 45 分）',
    people: '2 人',
    endsAt: '約 14:15',
    arriveBy: '10:00 前到場（官方要求導覽前至少 30 分鐘抵達，以留安檢時間；本行程另以 10:00 前完成安檢為保守目標，並非官方安檢截止）',
    entryRule: '官方確認信載明「Entry Pass is valid with identity card」——電子入場證與身分證件必須同時出示，入場證請列印或存離線。',
    officialUrl: 'https://visit.auschwitz.org/',
  },
};

const lajkonikOutboundAdopted = pickService(auschwitzBus.outbound.services, '採用');
const lajkonikInboundAdopted = pickService(auschwitzBus.inbound.services, '採用');

const fareMatch = /全票\s*([\d.]+)\s*zł.*?優待\s*([\d.]+)\s*zł/.exec(auschwitzBus.fare);
if (!fareMatch) throw new Error('auschwitzBus.fare 格式無法解析出全票／優待金額');
/** Lajkonik 全票／優待金額，解析自 auschwitzBus.fare——不在別處另打一次數字。 */
export const lajkonikFare = { full: fareMatch[1], discount: fareMatch[2] };

/** saleOpens（'YYYY-MM-DD'）→ 不補零的 'M/D'，供敘述文字引用，不再手抄開賣日。 */
export function saleOpensShort(id) {
  const segment = segments.find(item => item.id === id);
  if (!segment?.saleOpens) throw new Error(`saleOpensShort 找不到有 saleOpens 的交通段：${id}`);
  return segment.saleOpens.split('-').slice(1).map(Number).join('/');
}

// segments[]：五段城際交通的單一來源。id 供 days[].train 以 {segmentId} 引用，
// day 為對應的行程天數（trip.js 的 days[].n）。dep/arr/dur/price/status/note
// 沿用原 trains[] 形狀，供訂票頁與搜尋索引使用；from/to/dayType/dayLeg 是原本
// 只存在 days[].train 的每日觀點欄位（行程頁 eyebrow 文字與艙等建議，字首刻意
// 加 day 前綴避免撞名 trains[].leg／price 等訂票頁既有欄位），現在併到同一筆
// 記錄，不再分成兩處各寫一次。Lajkonik 巴士另外多 dayDep／dayArr／dayDur／
// dayPrice：訂票頁要顯示去回兩段的合併字串，行程頁只顯示當天那一段，兩種
// 呈現不同，因此保留兩組欄位，但數字都只從 lajkonikOutboundAdopted／
// lajkonikInboundAdopted 這唯一來源算出。
export const segments = [
  {
    id: 'eip-5300', day: 2,
    seg: 'Warszawa Centralna → Kraków Główny', date: '10/25', type: 'EIP 5300',
    from: 'Warszawa Centralna', to: 'Kraków Główny',
    dayType: 'EIP 5300', dayLeg: '已購票 · 08:40 由 Warszawa Centralna 上車；抵達時間待查票面',
    dep: '08:40', arr: '待查票面', dur: '待查票面', price: '票價未提供',
    status: '已購票',
    note: '2026-09-28 依旅客提供的 PKP App 票券清單確認日期、車次、起訖站與發車時間。截圖未顯示抵達時間、艙等、車廂、座位及票價；搭車前依票券詳細頁與車站電子看板確認。',
  },
  {
    id: 'bus-lajkonik', day: 3,
    seg: 'Kraków MDA ⇄ Oświęcim Muzeum Auschwitz', date: '10/26', type: 'BUS · Lajkonik',
    from: `Kraków MDA（ul. Bosacka 18，${lajkonikOutboundAdopted.bay}）`, to: 'Oświęcim, Więźniów Oświęcimia 55（Muzeum Auschwitz）',
    dayType: 'BUS · Lajkonik', dayLeg: `去回班次皆已於官方售票頁查得／尚未購票（回程 ${lajkonikInboundAdopted.dep} → ${lajkonikInboundAdopted.arr}）`,
    saleCheckedAt: '2026-09-09',
    dep: `${lajkonikOutboundAdopted.dep}（${lajkonikOutboundAdopted.bay}）／回程 ${lajkonikInboundAdopted.dep}`,
    arr: `${lajkonikOutboundAdopted.arr} ／回程 ${lajkonikInboundAdopted.arr} 抵 Kraków MDA`,
    dur: `單程 ${lajkonikOutboundAdopted.dur}`,
    price: `線上快照 PLN ${lajkonikFare.full}（優待 ${lajkonikFare.discount}，2026-09-09 查得；付款前重查）`,
    dayDep: lajkonikOutboundAdopted.dep, dayArr: lajkonikOutboundAdopted.arr, dayDur: lajkonikOutboundAdopted.dur,
    dayPrice: `線上快照 PLN ${lajkonikFare.full}（優待 ${lajkonikFare.discount}；付款前重查）`,
    status: '去回班次皆已查得／尚未購票',
    note: '2026-09-09 查 10/26 官方售票頁：去程 07:10（D10）→ 08:35 採用；08:25（D9）→ 09:50 只比官方要求的 10:00 到場時間早 10 分鐘，緩衝不足不採用；回程 14:00 → 15:25 趕不上，15:30 → 16:55 採用，16:30 → 17:55 備案。2026-10-06 複核公告班表：去程發車 06:15（11–3 月）／07:10／08:25／09:20／10:40／11:30／13:00／14:00／15:55（4–10 月）；Muz. Auschwitz 回程 08:10（11–3 月）／09:00／11:00／12:00／14:00／15:30／16:30／17:30／18:30（4–10 月）。公告自 2026-03-01 起至變更，部分班次有季節／假日代碼、中途站為招手停；公告班表與 09/09 可售快照均不保證目前 10/26 庫存。司機售票現行全票 27／優待 22 PLN，線上快照 25／22 PLN 須於付款前重查。',
  },
  {
    id: 'ic-3830', day: 4,
    seg: 'Kraków Główny → Wrocław Główny', date: '10/27', type: 'IC 3830',
    from: 'Kraków Główny', to: 'Wrocław Główny',
    dayType: 'IC 3830', dayLeg: '已購票 · 16:45 發車；抵達時間待查票面',
    dep: '16:45', arr: '待查票面', dur: '待查票面', price: '票價未提供',
    status: '已購票',
    note: '2026-09-28 依旅客提供的 PKP App 票券清單確認日期、車次、起訖站與發車時間。原規劃 IC 3600 17:55 已由本票券取代；抵達時間、艙等、車廂、座位及票價待查票面。16:10 前到站。',
  },
  {
    id: 'ic-260', day: 5,
    seg: 'Wrocław Główny → Poznań Główny', date: '10/28', type: 'IC 260',
    from: 'Wrocław Główny', to: 'Poznań Główny',
    dayType: 'IC 260', dayLeg: '已購票 · 19:10 發車；抵達時間待查票面',
    dep: '19:10', arr: '待查票面', dur: '待查票面', price: '票價未提供',
    status: '已購票',
    note: '2026-09-28 依旅客提供的 PKP App 票券清單確認日期、車次、起訖站與發車時間。截圖標示 IC 260；原規劃的 Baltic Express 名稱不再沿用。抵達時間、艙等、車廂、座位及票價待查票面。18:35 前到站。',
  },
  {
    id: 'eic-8104', day: 6,
    seg: 'Poznań Główny → Warszawa Centralna', date: '10/29', type: 'EIC 8104',
    from: 'Poznań Główny', to: 'Warszawa Centralna',
    dayType: 'EIC 8104', dayLeg: '已購票 · 17:40 發車；抵達時間待查票面',
    dep: '17:40', arr: '待查票面', dur: '待查票面', price: '票價未提供',
    status: '已購票',
    note: '2026-10-06 依旅客提供的 PKP App 票券清單確認日期、車次、起訖站與發車時間。截圖標示 EIC 8104；原規劃的 Bolesław Prus 名稱不再沿用。抵達時間、艙等、車廂、座位及票價待查票面。17:05 前到站。',
  },
];
