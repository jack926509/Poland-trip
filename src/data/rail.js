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

import { lajkonikInboundWord } from '../lib/todo-status.mjs';

// 回程是否已購只有一個正本：trip.js todoGroups 裡 Lajkonik 回程那筆。
// 本檔在 trip.js 之前載入，所以狀態欄位用 getter，trip.js 建好 todoGroups 後呼叫 bindTodoGroups 綁定；
// 未綁定時（單獨載入本檔）回中性用詞，不含任何購票狀態。
let boundGroups = null;
export function bindTodoGroups(groups) { boundGroups = groups; }
const inboundWord = () => lajkonikInboundWord(boundGroups);
/** 供其他資料檔（travel-database）在讀取當下取得回程購票用字。 */
export { inboundWord as lajkonikInboundWord };

/** 從 auschwitzBus.*.services 取出標記某個 decision 的班次；找不到就是資料本身有誤，直接丟錯不要悄悄回傳空值。 */
function pickService(services, decision) {
  const service = services.find(item => item.decision === decision);
  if (!service) throw new Error(`auschwitzBus 找不到 decision="${decision}" 的班次`);
  return service;
}

// Lajkonik · Auschwitz 往返巴士。
// 2026-10-13 旅客已在 moj-bus.pl（Lajkonik 線上售票）購得去程 08:25 → 09:50、2 張全票；
// 回程購票狀態不在此手寫（見 bindTodoGroups）；班次資料為 2026-09-09 售票頁快照與 2026-10-06 公告班表。
// 票號、乘客姓名、電話與票券管理連結屬私人資料，不寫進公開資料。
export const auschwitzBus = {
  operator: 'LAJKONIK',
  site: 'https://www.lajkonikbus.pl/',
  siteNote: '首頁右上可切 English；表單四欄依序為 Departure from／Destination／Date of departure／Normal（人數），按 Search courses 查班次，每筆班次可直接 Buy ticket。另有 Where is my bus? 查即時車輛位置、My Ticket 查已購票券。',
  fare: '全票 25.00 zł／優待 22.00 zł（每人，2026-10-26 的線上票價快照，付款前重查）；司機售票全票 27.00 zł／優待 22.00 zł，線上可能另有折扣，優待須符合資格並出示證明',
  stops: {
    krakow: 'Kraków · ul. Bosacka 18, Dworzec Autobusowy（MDA，Kraków Główny 後方步行約 5 分；站位 D9／D10）',
    oswiecim: 'Oświęcim · Więźniów Oświęcimia 55（Muzeum Auschwitz，下車處在博物館停車場對面）',
  },
  outbound: {
    status: '已購票',
    checkedAt: '2026-10-13',
    booked: { dep: '08:25', arr: '09:50', bay: 'D9（下層 dolna płyta）', tickets: '2 張全票', total: '47,50 zł', channel: 'moj-bus.pl（Lajkonik 線上售票）', rules: '只限票面日期、時間與路線；上車出示列印票或手機票（螢幕至少 4 吋）；業者要求發車前 15 分鐘到站牌。' },
    query: { from: 'Kraków', to: 'Oświęcim', date: '2026-10-26', passengers: 1 },
    services: [
      { dep: '07:10', arr: '08:35', dur: '1h25', bay: 'D10', fare: '25,00 zł', decision: '不採用', why: '原規劃首選：距 10:30 入場有 1 小時 55 分緩衝。旅客已改訂 08:25；若想多留緩衝，可在票券管理頁改票（退改規則以票券頁為準）。' },
      { dep: '08:25', arr: '09:50', dur: '1h25', bay: 'D9', fare: '23,75 zł', decision: '採用', why: '已購 2 張全票（線上總價 47,50 zł）。官方要求導覽前至少 30 分鐘、即 10:00 前到場，此班 09:50 抵達只剩 10 分鐘餘裕：下車直接寄物、安檢，不再逛書店。' },
    ],
    note: '10/26 的售票頁只顯示這兩班、沒有 07:35，這是當時的可售快照。官方公告班表（公告至另行變更為止），Kraków MDA（Bosacka 18）發車為 06:15（11–3 月）／07:10／08:25／09:20／10:40／11:30／13:00／14:00／15:55（4–10 月），多數由 D10 發車（08:25 為 D9）。部分班次有季節／假日代碼，公告班表不代表 10/26 全部可售；班次、座位及線上票價仍須在付款前重查。',
  },
  inbound: {
    get status() { const word = inboundWord(); return word === '尚未購票' ? '已於官方售票頁查得／尚未購票' : word; },
    checkedAt: '2026-10-14',
    threshold: '導覽約 14:15 結束，必須挑 14:15 之後發車的班次',
    query: { from: 'Oświęcim', to: 'Kraków', date: '2026-10-26', passengers: 1 },
    services: [
      { dep: '14:00', arr: '15:25', dur: '1h25', fare: '25,00 zł', decision: '不採用', why: '在導覽 14:15 結束前就發車，趕不上。' },
      { dep: '15:30', arr: '16:55', dur: '1h25', fare: '25,00 zł', decision: '採用', why: '導覽結束後有 75 分鐘走回站牌、上洗手間與逛訪客中心書店，緩衝充足又不必空等。' },
      { dep: '16:30', arr: '17:55', dur: '1h25', fare: '25,00 zł', decision: '備案', why: '若導覽延後、比克瑙接駁排隊或想多留時間，改搭這班；代價是多等 1 小時。' },
    ],
    note: '10/26 的售票頁下午只顯示這三班，25,00 zł 是當時的線上票價快照。官方公告班表（公告至另行變更為止），Oświęcim Muz. Auschwitz 回程為 08:10（11–3 月）／09:00／11:00／12:00／14:00／15:30／16:30／17:30／18:30（4–10 月）；17:30／18:30 是公告中的較晚班次，適用日期與座位須另查。15:30／16:30 由 Więźniów Oświęcimia 55 發車，公告抵 Kraków MDA Bosacka 18 分別為 16:55／17:55。中途站是招手停，部分班次有季節／假日代碼；付款前確認 10/26 適用班次、座位與票價。在 moj-bus.pl 查 10/26：09:00／11:00／12:00／14:00／15:30／16:30／17:30／18:30 八班皆可線上購票，全票 25,00 zł、優待 22,00 zł 未變；15:30 班發車前 12 小時以前可退或改，之後不可退。查詢時網頁日曆把 10/26 顯示為灰色點不到，遇到時可改用手機或換瀏覽器。',
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
    id: 'eip-1306', day: 2,
    seg: 'Warszawa Zachodnia → Kraków Główny', date: '10/25', type: 'EIP 1306',
    from: 'Warszawa Zachodnia', to: 'Kraków Główny',
    dayType: 'EIP 1306', dayLeg: '已購票 · 15:45 由 Warszawa Zachodnia（西站）上車；18:12 抵 Kraków Główny · 1 等',
    dep: '15:45', arr: '18:12', dur: '2h27', class: 1, price: '409,22 PLN（截圖所示金額）',
    status: '已購票', checkedAt: '2026-10-22',
    note: '依旅客 10/22 提供的 PKP 截圖確認。15:45 西站上車，取代原本的早班；13:10 飛抵華沙後直接轉西站，不經市中心飯店。第 1 車，24、26 號；金額涵蓋人數依完整票券核對；月台看現場電子牌。',
  },
  {
    id: 'bus-lajkonik', day: 3,
    seg: 'Kraków MDA ⇄ Oświęcim Muzeum Auschwitz', date: '10/26', type: 'BUS · Lajkonik',
    from: `Kraków MDA（ul. Bosacka 18，${lajkonikOutboundAdopted.bay}）`, to: 'Oświęcim, Więźniów Oświęcimia 55（Muzeum Auschwitz）',
    dayType: 'BUS · Lajkonik',
    get dayLeg() { return `去程已購票；回程 ${lajkonikInboundAdopted.dep} → ${lajkonikInboundAdopted.arr} ${inboundWord()}`; },
    saleCheckedAt: '2026-09-09',
    dep: `${lajkonikOutboundAdopted.dep}（${lajkonikOutboundAdopted.bay}）／回程 ${lajkonikInboundAdopted.dep}`,
    arr: `${lajkonikOutboundAdopted.arr} ／回程 ${lajkonikInboundAdopted.arr} 抵 Kraków MDA`,
    dur: `單程 ${lajkonikOutboundAdopted.dur}`,
    price: `去程已購 2 張 ${auschwitzBus.outbound.booked.total}；回程線上快照 PLN ${lajkonikFare.full}（優待 ${lajkonikFare.discount}；付款前重查）`,
    dayDep: lajkonikOutboundAdopted.dep, dayArr: lajkonikOutboundAdopted.arr, dayDur: lajkonikOutboundAdopted.dur,
    dayPrice: `去程已購票（2 張全票 ${auschwitzBus.outbound.booked.total}）`,
    get status() { return `去程已購票／回程${inboundWord()}`; },
    get note() { return `旅客已購去程 08:25（D9，下層 dolna płyta）→ 09:50，2 張全票線上總價 47,50 zł；回程${inboundWord()}。10/26 官方售票頁：去程 07:10（D10）→ 08:35 原為首選，08:25 → 09:50 只比官方要求的 10:00 到場時間早 10 分鐘；回程 14:00 → 15:25 趕不上，15:30 → 16:55 採用，16:30 → 17:55 備案。公告班表：去程發車 06:15（11–3 月）／07:10／08:25／09:20／10:40／11:30／13:00／14:00／15:55（4–10 月）；Muz. Auschwitz 回程 08:10（11–3 月）／09:00／11:00／12:00／14:00／15:30／16:30／17:30／18:30（4–10 月）。公告至另行變更為止，部分班次有季節／假日代碼、中途站為招手停；當天以售票頁與司機為準。司機售票現行全票 27／優待 22 PLN，線上快照 25／22 PLN 須於付款前重查。`; },
  },
  {
    id: 'ic-3830', day: 4,
    seg: 'Kraków Główny → Wrocław Główny', date: '10/27', type: 'IC 3830',
    from: 'Kraków Główny', to: 'Wrocław Główny',
    dayType: 'IC 3830', dayLeg: '已購票 · 16:45 發車；19:50 抵 Wrocław Główny · 1 等',
    dep: '16:45', arr: '19:50', dur: '3h05', class: 1, price: '48,00 PLN（截圖所示金額）',
    status: '已購票', checkedAt: '2026-10-22',
    note: '依旅客 10/22 提供的 PKP 截圖確認日期、車次、起訖站、發到時間、車程、1 等及截圖金額；車廂、座位與金額涵蓋人數未顯示，依完整票券核對；月台以現場電子牌為準。',
  },
  {
    id: 'ic-260', day: 5,
    seg: 'Wrocław Główny → Poznań Główny', date: '10/28', type: 'IC 260',
    from: 'Wrocław Główny', to: 'Poznań Główny',
    dayType: 'IC 260', dayLeg: '已購票 · 19:10 發車；20:29 抵 Poznań Główny · 2 等',
    dep: '19:10', arr: '20:29', dur: '1h19', class: 2, price: '68,60 PLN（截圖所示金額）',
    status: '已購票', checkedAt: '2026-10-22',
    note: '依旅客 10/22 提供的 PKP 截圖確認日期、車次、起訖站、發到時間、車程、2 等及截圖金額；車廂、座位與金額涵蓋人數未顯示，依完整票券核對；月台以現場電子牌為準。',
  },
  {
    id: 'eic-8104', day: 6,
    seg: 'Poznań Główny → Warszawa Centralna', date: '10/29', type: 'EIC 8104',
    from: 'Poznań Główny', to: 'Warszawa Centralna',
    dayType: 'EIC 8104', dayLeg: '已購票 · 17:40 發車；19:59 抵 Warszawa Centralna · 2 等',
    dep: '17:40', arr: '19:59', dur: '2h19', class: 2, price: '235,42 PLN（截圖所示金額）',
    status: '已購票', checkedAt: '2026-10-22',
    note: '依旅客 10/22 提供的 PKP 截圖確認日期、車次、起訖站、發到時間、車程、2 等及截圖金額；車廂、座位與金額涵蓋人數未顯示，依完整票券核對；月台以現場電子牌為準。',
  },
];
