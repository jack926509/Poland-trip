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
// 去程資料 2026-09-09 由官方售票頁 lajkonikbus.pl 查 2026-10-26 當日結果取得；
// 回程尚未查詢，下方保留可直接照填的查詢參數。
export const auschwitzBus = {
  operator: 'LAJKONIK',
  site: 'https://www.lajkonikbus.pl/',
  siteNote: '首頁右上可切 English；表單四欄依序為 Departure from／Destination／Date of departure／Normal（人數），按 Search courses 查班次，每筆班次可直接 Buy ticket。另有 Where is my bus? 查即時車輛位置、My Ticket 查已購票券。',
  fare: '全票 25.00 zł／優待 22.00 zł（每人，官方售票頁 2026-10-26 顯示值）',
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
      { dep: '08:25', arr: '09:50', dur: '1h25', bay: 'D9', fare: '25,00 zł', decision: '不採用', why: '官方要求入場前 30 分鐘完成安檢（10:00 前到），此班只早 10 分鐘，誤點即錯過已付款導覽。' },
    ],
    note: '2026-09-09 售票頁當日只開放這兩班、沒有 07:35；2026-09-18 查官方公告時刻表，Kraków MDA（Bosacka 18）整日發車為 06:15／07:10／08:25／09:20／10:40／11:30／13:00／14:00／15:55／17:30，多數由 D10 發車（08:25 那班為 D9）。若售票頁只剩少數班次，那是可售狀況而非全部班次。班次與票價仍以購票當下的售票頁為準。',
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
    note: '2026-09-09 售票頁當日下午只開放這三班；2026-09-18 查官方公告時刻表，Oświęcim Muz. Auschwitz 整日回程為 08:10／09:00／11:00／12:00／14:00／15:30／16:30／17:30／18:30／19:45，也就是 17:30 與 18:30 可作更晚的保底。15:30 與 16:30 都由 Więźniów Oświęcimia 55 發車、停 ul. Bosacka 18 Dworzec Autobusowy，票價同為 25,00 zł。時刻表註明中途站是招手停，部分班次帶季節／假日代碼，購票時確認 10/26 是否適用。',
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
    arriveBy: '10:00（官方要求入場時段前 30 分鐘完成安檢）',
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
    seg: 'Warszawa Zachodnia → Kraków Główny', date: '10/25', type: 'EIP 5300',
    from: 'Warszawa Zachodnia', to: 'Kraków Główny',
    dayType: 'EIP 5300 · 參考班次', dayLeg: '指定日待確認／尚未訂票 · 一等艙建議',
    saleOpens: '2026-09-25', saleCheckedAt: '2026-09-08',
    dep: '08:45', arr: '10:58', dur: '2h13', price: '票價待確認',
    status: '參考班次／尚未訂票',
    note: '一等艙建議；本趟安排頭等艙體驗。現行班表本車先停 Warszawa Centralna（約 08:40）再停 Zachodnia；住宿改為 Hotel Metropol 後由 Centralna 上車只需步行 500 公尺，購票時優先比較 Centralna 出發的票價與座位。10/25 換表後仍須確認實際停靠站。',
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
    price: `PLN ${lajkonikFare.full}（優待 ${lajkonikFare.discount}，購票日確認）`,
    dayDep: lajkonikOutboundAdopted.dep, dayArr: lajkonikOutboundAdopted.arr, dayDur: lajkonikOutboundAdopted.dur,
    dayPrice: `PLN ${lajkonikFare.full}（優待 ${lajkonikFare.discount}）`,
    status: '去回班次皆已查得／尚未購票',
    note: '2026-09-09 於官方售票頁查 10/26：去程 07:10（D10）→ 08:35 採用、08:25（D9）→ 09:50 只比 10:00 安檢截止早 10 分鐘故不用（售票頁當時沒有 07:35）；回程 14:00 → 15:25 在導覽 14:15 結束前開走不可用、15:30 → 16:55 採用（結束後留 75 分鐘緩衝）、16:30 → 17:55 為備案。2026-09-18 另查官方公告時刻表，確認 07:10→08:35 與 15:30→16:55 都在正班表上，且全線班次比售票頁當時顯示的多（Kraków MDA 發車 06:15／07:10／08:25／09:20／10:40／11:30／13:00／14:00／15:55／17:30；Muz. Auschwitz 回程 08:10／09:00／11:00／12:00／14:00／15:30／16:30／17:30／18:30／19:45）——「當日只有兩班／三班」只是那天售票頁的可售結果，不是全部班次。時刻表另註中途站為招手停（na żądanie），且部分班次有季節／假日代碼限制，購票時一併確認。',
  },
  {
    id: 'ic-3600', day: 4,
    seg: 'Kraków Główny → Wrocław Główny', date: '10/27', type: 'IC 3600 Siemiradzki',
    from: 'Kraków Główny', to: 'Wrocław Główny',
    dayType: 'IC 3600 Siemiradzki · 參考班次', dayLeg: '指定日待確認／尚未訂票 · 二等艙建議',
    saleOpens: '2026-09-27', saleCheckedAt: '2026-09-08',
    dep: '17:55', arr: '20:52', dur: '2h57', price: '票價待確認',
    status: '參考班次／尚未訂票',
    note: '二等艙建議；一等艙可選。17:20 前到站。',
  },
  {
    id: 'baltic-express-260', day: 5,
    seg: 'Wrocław Główny → Poznań Główny', date: '10/28', type: 'Baltic Express 260',
    from: 'Wrocław Główny', to: 'Poznań Główny',
    dayType: 'Baltic Express 260 · 參考班次', dayLeg: '指定日待確認／尚未訂票 · 二等艙建議',
    saleOpens: '2026-09-28', saleCheckedAt: '2026-09-08',
    dep: '19:10', arr: '20:29', dur: '1h19', price: '票價待確認',
    status: '參考班次／尚未訂票',
    note: '二等艙建議。18:35 前到站。',
  },
  {
    id: 'eic-8104', day: 6,
    seg: 'Poznań Główny → Warszawa Centralna', date: '10/29', type: 'EIC 8104 Bolesław Prus',
    from: 'Poznań Główny', to: 'Warszawa Centralna',
    dayType: 'EIC 8104 Bolesław Prus · 參考班次', dayLeg: '指定日待確認／尚未訂票 · 二等艙建議',
    saleOpens: '2026-09-25', saleCheckedAt: '2026-09-08',
    dep: '17:40', arr: '20:00', dur: '2h20', price: '票價待確認',
    status: '參考班次／尚未訂票',
    note: '適合體驗一等艙；若 10/25 已搭 EIP 一等艙，可依價差改選二等艙。17:05 前到站。',
  },
];
