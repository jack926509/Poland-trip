import { resolveDining } from './dining-places.js';
import { segments, auschwitzBus, lajkonikFare, bindTodoGroups } from './rail.js';
import { resolveVenue } from '../lib/venues.mjs';
import { ticketPurchaseById } from './ticket-purchases.js';
import { withDerivedStatus, railGroupIntro, lajkonikInboundWord } from '../lib/todo-status.mjs';
// trip.js — 行程資料源頭：meta、flights、days×8、stay、trains、bookingTiers、reservations
// 來源：redesign/data.js（原 window.TRIP 物件字面值），轉為 ES module 具名匯出。
// 2026-08-09 依景點、博物館與交通營運單位公開資料重新盤查。
// 已購火車依旅客票券清單標示；尚未見票券及截圖未提供的細節維持待確認。
//
// 火車與巴士的欄位正本在 rail.js（segments、auschwitzBus）；這裡只用
// {segmentId} 引用，或在敘述文字用 template literal 帶出 rail.js 的值，
// 不再整段複製一次（精煉切片 3）。

function snack(item) {
  const place = resolveDining(item);
  return {...place, text:item.text, place:place.name, note:place.note};
}

// Lajkonik 去回目前採用（decision === '採用'）的班次與其他 3 個備選/不採用班次，
// 供本檔多處敘述文字引用，不再各自手打一次時刻。
const lajkonikOutboundAdopted = auschwitzBus.outbound.services.find(item => item.decision === '採用');
const lajkonikOutboundRejected = auschwitzBus.outbound.services.find(item => item.decision === '不採用');
const lajkonikInboundAdopted = auschwitzBus.inbound.services.find(item => item.decision === '採用');
const lajkonikInboundBackup = auschwitzBus.inbound.services.find(item => item.decision === '備案');
const lajkonikInboundRejected = auschwitzBus.inbound.services.find(item => item.decision === '不採用');

// 精煉切片 4b：步驟的 sub 裡原本手打了一次開放時間，剛好與 constraint.venue
// 指到的場館 hours 完全同義（辛德勒工廠；皇家城堡已在 2026-10-14 新行程改為只看外觀）；改成從 venues.js
// 用 template literal 帶出，不再另打一份數字。其餘掛 constraint.venue 的步驟
// （Wawel 短路線比較四條子路線票價、百年廳的四色日曆說明）不是單一場館 hours
// 可以乾淨代換的內容，保留原文，不勉強套用。
const schindlerVenue = resolveVenue('krakow-schindler');

// checkedAt：實際人工核對這筆狀態的 YYYY-MM-DD；不以建置日期代填。
// 2026-10-13 旅客逐項確認：15 項當時未完成的項目全部仍未購票／未訂位，故記為 10/13（此後陸續完成，現況以下列各筆 status 為準）。
// recheckAt：下次查核期限 YYYY-MM-DD；null 時儀表板以行程日期判斷逾期。
// 前三段的 checkedAt 為 2026-09-28，第四段為 2026-10-06 檢視 App 票券清單日期；
// 抵達時間已由 Koleo 查得（2026-10-17，見 rail.js）；艙等與座位仍需票券詳細頁。
const todoGroupsRaw = [
  {
    id: 'rail', title: '城際交通', eyebrow: 'Rail · 7 項',
    intro: null, // 由 railGroupIntro(todoGroupsRaw) 依 Lajkonik 回程那筆的狀態推導，見下方 todoGroups
    items: [
      {checkedAt:"2026-10-22", recheckAt:null, date:'10/25', name:"EIP 1306｜Warszawa Zachodnia → Kraków Główny", status:'已購票', action:"15:45 Warszawa Zachodnia（西站）→ 18:12 Kraków Główny，1 等；13:10 飛抵華沙後直接轉西站。票券存離線，座位見車票。", url:'https://www.intercity.pl/en/'},
      {checkedAt:'2026-10-13', recheckAt:null, date:'10/26', name:`Lajkonik 去程 ${lajkonikOutboundAdopted.dep} 克拉科夫 → Auschwitz`, status:'已購票', action:`已在 moj-bus.pl 購得 2 張全票（線上總價 ${auschwitzBus.outbound.booked.total}）：${lajkonikOutboundAdopted.dep} 由 Kraków MDA（ul. Bosacka 18）下層 D9 站位發車、${lajkonikOutboundAdopted.arr} 抵 Więźniów Oświęcimia 55。業者要求發車前 15 分鐘到站牌，上車出示列印票或手機票（螢幕至少 4 吋）。要準時上車；09:50 下車後直接走到入口報到，導覽 10:30 開始。退票規則見『訂票與交通』頁。票號與票券管理連結只存私人資料。`, url:'https://moj-bus.pl/en'},
      {checkedAt:'2026-10-23', recheckAt:null, date:'10/26', name:`Lajkonik 回程 ${lajkonikInboundAdopted.dep} Auschwitz → 克拉科夫`, status:'已購票', action:`已在 moj-bus.pl 購得 2 張全票（線上總價 47,50 zł）：15:30 由 Więźniów Oświęcimia 55 發車 → 16:55 抵 Kraków MDA（ul. Bosacka 18）。業者要求發車前 15 分鐘（15:15）到站牌，上車出示列印票或手機票（螢幕至少 4 吋）。導覽延後趕不上時，16:30 需向司機或線上另買新票。退票規則見『訂票與交通』頁。票號與票券管理連結只存私人資料。`, url:'https://www.lajkonikbus.pl/'},
      {checkedAt:"2026-10-22", recheckAt:null, date:'10/27', name:'IC 3830｜Kraków Główny → Wrocław Główny', status:'已購票', action:'16:45 Kraków Główny → 19:50 Wrocław Główny。鹽礦後 Sztolnia 未訂位、現場入座，客滿改 Bistro Posolone；13:41 SKA1 回城、14:10 買圈餅，14:30 回 ibis 取行李休息，16:10 前到站。', url:'https://www.intercity.pl/en/'},
      {checkedAt:"2026-10-22", recheckAt:null, date:'10/28', name:'IC 260｜Wrocław Główny → Poznań Główny', status:'已購票', action:'19:10 Wrocław Główny → 20:29 Poznań Główny。', url:'https://www.intercity.pl/en/'},
      {checkedAt:"2026-10-22", recheckAt:null, date:'10/29', name:'EIC 8104｜Poznań Główny → Warszawa Centralna', status:'已購票', action:'17:40 Poznań Główny → 19:59 Warszawa Centralna。約 16:00 取行李，17:15 前到月台。', url:'https://www.intercity.pl/en/'},
      {checkedAt:'2026-10-22', recheckAt:null, date:'10/24', name:'舊 PKP 票（EIP 5300，原 10/25 08:40）', status:'已完成', action:'已換成 EIP 1306，不需要再處理', url:'https://www.intercity.pl/en/'},
    ],
  },
  {
    id: 'attractions', title: '主要景點', eyebrow: 'Tickets · 5 項',
    intro: '已購票券存離線，入場時間看票面。新行程付費景點只在外面拍照：樂斯拉夫全景畫、華沙起義博物館、華沙皇家城堡不用訂了。',
    items: [
      {checkedAt:"2026-10-22", recheckAt:null, skip:true, date:'10/25', ticketPurchaseId:'krakow-wawel-castle', name:'Wawel 城堡 15:15', status:"改班後不排入", action:"10/25 改為 18:12 抵克拉科夫，趕不上原定白天時段；本日不再安排現場試票。保留購票入口作城市延伸參考。", url:ticketPurchaseById('krakow-wawel-castle').purchaseUrl},
      {checkedAt:"2026-10-22", recheckAt:null, skip:true, date:'10/25', ticketPurchaseId:'krakow-schindler', name:'辛德勒工廠 17:30', status:"改班後不排入", action:"10/25 改為 18:12 抵克拉科夫，趕不上原定白天時段；本日不再安排現場試票。保留購票入口作城市延伸參考。", url:ticketPurchaseById('krakow-schindler').purchaseUrl},
      {checkedAt:'2026-09-09', recheckAt:null, date:'10/26', ticketPurchaseId:'krakow-auschwitz', name:'Auschwitz 英文官方導覽 10:30', status:'已訂妥', action:'10:30 個人 educator 導覽（英文），官方標示約 3 小時 45 分，2 人。電子入場證存離線，入場須同時出示證件。', url:ticketPurchaseById('krakow-auschwitz').purchaseUrl},
      {checkedAt:'2026-10-22', recheckAt:null, date:'10/30', ticketPurchaseId:'warsaw-st-anne-tower', name:'聖安妮教堂觀景台（暫停開放）', status:'暫停開放・不排登塔', action:'教區官網 2026-10-21 公告：觀景台 10 月上旬起整修暫停開放，直到另行公告。2026-10-22 出發前複查：觀景台官網 taraswidokowy.pl 公告「07.10.2026 起至另行通知不開放（整修）」，沒有重新開放消息，Day 7 只拍教堂外觀。萬一當天現場看到已開放，現場購票、不用預約（第三方資訊說只收現金），時間從延伸行程那一則挪。網友心得來源：Threads 網友 Delly Liu @dellyliu〈波蘭自助旅行實戰經驗分享 — 華沙 1〉，2026-10-21 讀取，屬網友評論。', url:'https://swanna.waw.pl/zwiedzanie/'},
      {checkedAt:'2026-10-13', recheckAt:null, date:'10/27', ticketPurchaseId:'krakow-wieliczka', name:'Wieliczka 鹽礦英文團 09:00', status:'已購票', action:'已付款：10/27 09:00 英文 Tourist Route（Individual tour）。票券 PDF 隨確認信附上，存離線；訂單與預約編號只存私人資料。原規劃 10:00 場，提早一小時後 Day 4 早上已往前調。', url:ticketPurchaseById('krakow-wieliczka').purchaseUrl},
    ],
  },
  {
    id: 'dining', title: '餐飲訂位', eyebrow: 'Dining · 7 項',
    intro: 'Soul Kitchen 10/30 18:00 已訂妥；Mr. Jerry 10/26 18:00 已訂位（2 位、無訂金）；Beef Wellington 無法預點，到店再點；其餘保留現場入座決定。Specjały 與 Pimiento 因航班延後不再排入原時段。',
    items: [
      {skip:true, checkedAt:'2026-10-22', recheckAt:null, date:'10/24', name:'Specjały Regionalne 18:30 晚餐', status:"改班後不排入", action:"去程延後一天，10/25 18:12 才抵克拉科夫，原定用餐時段無法前往；不再列為當天用餐安排。未推定任何訂位已取消。", url:'https://www.google.com/maps/search/?api=1&query=Specja%C5%82y%20Regionalne%20Nowy%20%C5%9Awiat%2044%2C%20Warszawa'},
      {skip:true, checkedAt:'2026-10-22', recheckAt:null, date:'10/25', name:'Pimiento 13:00 午餐', status:"改班後不排入", action:"去程延後一天，10/25 18:12 才抵克拉科夫，原定用餐時段無法前往；不再列為當天用餐安排。未推定任何訂位已取消。", url:'https://pimiento.pl/stary-kleparz/'},
      {checkedAt:'2026-10-22', recheckAt:null, date:'10/25', name:'Hankki 19:15 晚餐', status:'不訂位・現場入座', action:"18:12 抵克拉科夫，先到 ibis 入住，約 18:45 搭車前往 Zabłocie 19A，19:15 現場入座；不另外訂位。列車或入住延誤就改車站周邊快食；隔日導覽早餐、午餐及水抵達前先在機場或西站買好。", url:'https://guide.michelin.com/en/lesser-poland/krakow/restaurant/hankki'},
      {checkedAt:'2026-10-23', recheckAt:null, date:'10/26', name:'Mr. Jerry 18:00 晚餐（Beef Wellington）', status:'已訂妥', action:'10/26 18:00 已訂位（2 位、無訂金）；Beef Wellington 無法預點，到店再點；確認信存離線。', url:'https://www.mrjerry.pl/rezerwacja-krakow/'},
      {checkedAt:'2026-10-22', recheckAt:null, date:'10/28', name:'Restauracja Wrocławska 12:00 午餐', status:'現場候位', action:'可訂位但非必要，預設現場候位；+48 71 305 12 28，12:00 起接聽。13:00 結束去 Panorama；營業時間出發前再確認。', url:'https://restauracja-wroclawska.eatbu.com/?lang=en'},
      {checkedAt:'2026-10-28', recheckAt:null, date:'10/29', name:'Manekin 早餐與 Stary Browar Food Hall 午餐', status:'出發前再確認', action:'11:00 Manekin（Kwiatowa 3），11:30 前離開；13:00 Stary Browar Food Hall，14:00 離開。公休、時段與價格出發前再確認。', url:'https://manekin.pl/'},
      {checkedAt:'2026-10-22', recheckAt:null, date:'10/30', name:"華沙最後晚餐 · Soul Kitchen 18:00（已訂妥）", status:"已訂妥", action:"Nowogrodzka 18A；店家 10/22 回信確認 10/30 18:00–20:00、2 人，保留訂位 15 分鐘；店家已註記 1 份 Beef Wellington，並非保證供餐。17:50 從 Metropol 步行約 8 分前往，確認信存離線。", url:"https://soulkitchen.pl/"},
    ],
  },
  {
    id: 'prep', title: '出發前準備', eyebrow: 'Prep · 5 項',
    intro: '出發前事項已完成；之後聯絡 Poznan Apartments，確認取鑰匙方式；10/29 改用車站置物櫃。',
    items: [
      {checkedAt:'2026-10-22', recheckAt:null, date:'10/28', name:'之後聯絡 Poznan Apartments', status:'尚未傳訊息', action:'10/28 約 20:45 抵達（接待到 22:00，出發前再確認）；10/27 晚上傳訊息確認 20:45 取鑰匙方式；10/29 09:00 離開後使用車站置物櫃，容量出發前再確認；10/27 入住 Piast 時問櫃台 12:00 後行李寄放，IC 260 車票存離線', url:'https://www.poznanapartments.com/kontakt'},
      {checkedAt:'2026-10-22', recheckAt:null, date:"10/24", name:"HX 283 改票後報到（10/24 21:45 桃園起飛）", status:'已完成', action:'旅客 10/23 確認已完成報到；登機證存離線。', url:"https://www.hongkongairlines.com/"},
      {checkedAt:'2026-10-22', recheckAt:null, date:"10/24", name:'外交部出國登錄', status:'已完成', action:'旅客 10/23 確認已更新出國登錄行程。', url:'https://www.boca.gov.tw/sp-abre-main-1.html'},
      {checkedAt:'2026-10-22', recheckAt:null, date:'10/24', name:'手機安裝 Jakdojade 與 Bolt', status:'已安裝', action:'Jakdojade 查三座城市的電車、地鐵路線並買車票；10/29 早上搭電車 6／5；Bolt 僅雨天備案。出發前在臺灣先裝好、登入並綁好付款方式。', url:'https://jakdojade.pl/'},
      {checkedAt:'2026-10-22', recheckAt:null, date:'10/24', name:'Agoda 預付 Metropol 10/24 那晚（約 NT$3,818）', status:'已完成', action:'10/24 這晚因航班改期不入住，已通知飯店；不退款（旅客 10/24 確認）', url:'https://www.agoda.com/'},
    ],
  },
];

// 正本只有這一份。rail 分類的 intro 由本分類裡 Lajkonik 回程那筆的狀態推導，不手寫。
export const todoGroups = todoGroupsRaw.map(group => (group.id === 'rail' ? { ...group, intro: railGroupIntro(todoGroupsRaw) } : group));
// 讓 rail.js 的 Lajkonik 段（status／dayLeg／note、inbound.status）從同一份待辦推導。
bindTodoGroups(todoGroups);
const lajkonikInboundState = lajkonikInboundWord(todoGroups);
// 回程還沒買時才附「怎麼買」的建議；買了就不再催。
const lajkonikInboundOpen = lajkonikInboundState === '尚未購票';

export const meta = {
  edition: '2026 Poland Field Plan',
  dateRange: '2026 / 10 / 25 — 10 / 31',
  flightDateRange: '2026 / 10 / 24 — 11 / 01',
  travelStart: '2026-10-24',
  tripStart: '2026-10-24',
  tripEnd: '2026-10-31',
  timeZone: 'Europe/Warsaw',
  nights: 6, days: 8,
  route: '華沙 → 克拉科夫 → 樂斯拉夫 → 波茲南 → 華沙',
};

export const days = [
  {
    n: 1, date: '10/24（六）', city: '桃園 → 香港', overnight: '香港轉機／機上過夜', timeZone: 'Asia/Taipei',
    title: '桃園出發 · HX 283 經香港轉杜哈',
    headline: '21:45 桃園第二航廈起飛，23:45 抵香港第一航廈；去程延後一天，10/25 才抵華沙',
    tag: 'Flight', intensity: '中',
    hardConstraints: ['18:45 前到桃園第二航廈（起飛前 3 小時規劃目標）', 'HX 283 21:45 起飛；香港轉機只有 1 小時 40 分，抵達後直接找 QR 815 登機門', '10/24 這晚因航班改期不入住，已通知飯店；不退款（旅客 10/24 確認）'],
    compressible: ['機場購物'],
    steps: [
      {t:'出發前', timingMode:'relative', id:'d1-breakfast', label:'早餐 · 自理', sub:'今天仍在臺灣，依出門時間安排'},
      {t:'出發前', timingMode:'relative', id:'d1-lunch', label:'午餐 · 自理', sub:'依出門時間安排，準備轉機時可用的輕食'},
      {t:'18:45', label:'桃園第二航廈報到', sub:'新機票為香港航空 HX 283。核對後續 QR 815、QR 259 登機證與行李條目的地；機票各段託運額度 25 kg，直掛仍以櫃檯確認為準', dur:'3 h 起飛前緩衝'},
      {t:'報到後', timingMode:'relative', id:'d1-dinner', label:'晚餐 · 桃園機場', sub:'先完成報到、安檢與登機門確認，再依可用時間用餐'},
      {t:'21:45', label:'HX 283 桃園 → 香港', sub:'TPE 第二航廈 → HKG 第一航廈；經濟艙，23:45 抵達，時間均為各機場當地時間', dur:'2 h'},
      {t:'23:45', label:'香港轉機', sub:'轉機 1 小時 40 分，接 10/25 01:25 QR 815；依轉機指標與登機證前往，不安排購物或離開機場', dur:'1 h 40 min'},
    ],
    eat: [], backup: [], practical: [],
    warn: '去程已延後一天，原 10/24 華沙觀光與 Specjały 晚餐不再排入。10/24–10/25 Hotel Metropol 訂單仍保留紀錄，10/24 這晚因航班改期不入住，已通知飯店；不退款（旅客 10/24 確認）。香港轉機時間只有 1 小時 40 分，若首段延誤，依航空公司轉機服務處指示處理。',
  },
  {
    n: 2, date: '10/25（日）', city: '華沙機場 → 克拉科夫',
    title: '13:10 抵華沙 · 西站 15:45 EIP 1306 → 克拉科夫',
    headline: 'QR 259 13:10 抵華沙後直接轉 Warszawa Zachodnia；EIP 1306 15:45–18:12，晚餐保留 Hankki',
    tag: 'Arrival · Rail', intensity: '高',
    hardConstraints: ['香港轉 QR 815、杜哈轉 QR 259，起降時刻依電子機票當地時間；抵華沙後才使用波蘭時間安排地面交通', '15:10 前抵 Warszawa Zachodnia（西站）為規劃目標，15:45 EIP 1306 發車；不是中央車站', '13:10 落地至 15:45 發車僅 2 小時 35 分，包含入境、提行李與轉乘，無法保證接上', '抵達克拉科夫前（杜哈機場、華沙蕭邦機場或西站）買妥 10/26 Auschwitz 的早餐、午餐與飲水；10/25 是非營業週日'],
    compressible: ['Hankki 晚餐可改近站快食', '不排白天景點'],
    train: {segmentId:'eip-1306'},
    steps: [
      {t:'香港起飛', timingMode:'relative', label:'QR 815 香港 → 杜哈', sub:'香港當地 01:25 由 HKG 第一航廈出發，04:50 抵 DOH；杜哈轉機 4 小時 20 分', dur:'8 h 25 min'},
      {t:'機上或轉機', timingMode:'relative', id:'d2-breakfast', label:'早餐 · 機上或杜哈轉機', sub:'依實際供餐與登機門時間調整'},
      {t:'杜哈起飛', timingMode:'relative', label:'QR 259 杜哈 → 華沙', sub:'杜哈當地 09:10 起飛，華沙當地 13:10 抵 WAW；波蘭已於當天切換冬令時間，所有火車時刻使用波蘭當地時間', dur:'6 h'},
      {t:'機上或機場', timingMode:'relative', id:'d2-lunch', label:'午餐 · 機上或機場輕食', sub:'優先完成入境、提行李與西站轉乘，不繞路進市中心用餐'},
      {t:'13:10', label:'抵蕭邦機場 · 入境與提行李', sub:'首次入境登錄與行李等待時間不保證；領到行李後直接前往 Warszawa Zachodnia。行李未到須先向航空公司申報；15:05 還沒走出行李大廳就改搭下一班（見下一步）'},
      {t:'完成入境後', timingMode:'relative', label:'蕭邦機場 → Warszawa Zachodnia（西站）', sub:'用 Jakdojade 查當下直達西站的機場鐵路班次、停靠站及月台；等車過久就比較官方計程車或 Bolt 的預估抵達時間。不要搭到 Centralna 才找月台，也不繞 Metropol。交通耗時依現場情況'},
      {t:'15:10 前', label:'抵 Warszawa Zachodnia（西站）', sub:'35 分鐘為規劃緩衝，月台依當日電子牌，座位見車票；15:05 還沒走出行李大廳 → 在 PKP Intercity App 改搭當天下一班 EIP 到克拉科夫（班次以 App 當下顯示為準），不保證免費改搭', dur:'35 min 緩衝'},
      {t:'抵達克拉科夫前', timingMode:'relative', id:'d2-prep', label:'買好隔日早餐、午餐與水', sub:'隔日 10/26 導覽日須自備餐食。10/25 是非營業週日、多數商店不開，所以抵達克拉科夫前先買好 10/26 早餐與午餐（與水）：杜哈機場、華沙蕭邦機場或西站都可以買。克拉科夫晚上再採買只當備案，週日營業時間未查證；買不齊就問旅館可取得的輕食'},
      {t:'15:45', label:'EIP 1306 前往克拉科夫', sub:'Warszawa Zachodnia → Kraków Główny，18:12 抵達，1 等；票券存離線', cost:'已購票', dur:'2 h 27 min'},
      {t:'18:12', label:'抵 Kraków Główny', sub:'約 200 公尺、步行約 5 分到 Pawia 11 的 ibis budget Krakow Stare Miasto，辦理入住'},
      {t:'18:30', label:'ibis 入住 · 放行李', sub:'先確認隔日 07:35 出門與 Auschwitz 票券；約 18:45 搭車往 Hankki，車程以 App 即時估算為準', dur:'約 15 min'},
      {t:'19:15', id:'d2-dinner', label:'晚餐 · Hankki（延誤就改近站快食）', sub:'保留原選定的韓式料理，Zabłocie 19A；現場入座、依當晚接單情況。若列車或入住延誤，改車站周邊仍營業的餐廳，避免晚歸', cost:'依店家', dur:'1 h'},
    ],
    eat: [], backup: [], practical: [],
    warn: '13:10 落地至 15:45 西站發車僅 2 小時 35 分，入境、行李或航班延誤可能接不上；以現場與 App 評估，不視為保證銜接；15:05 還沒走出行李大廳，就在 PKP Intercity App 改搭當天下一班 EIP（班次以 App 當下顯示為準）。新票是 Warszawa Zachodnia（西站），不是 Warszawa Centralna。18:12 才到克拉科夫，原 Pimiento 午餐、Wawel、瓦維爾大教堂與辛德勒白天行程不再排入，也不再安排現場試票。Hankki 保留，晚到改近站快食；隔日導覽餐食抵達前先買好（10/25 是非營業週日）。',
  },
  {
    n: 3, date: '10/26（一）', city: '克拉科夫',
    title: 'Auschwitz-Birkenau · 一日往返',
    headline: `10:30 英文 educator 導覽已訂妥；去程巴士 ${lajkonikOutboundAdopted.dep} 已購票（${lajkonikOutboundAdopted.arr} 抵），回程 ${lajkonikInboundAdopted.dep} ${lajkonikInboundState}`,
    tag: 'Memorial',
    intensity: '中高',
    hardConstraints: ['08:10 前到 Kraków MDA 下層 D9 站位（業者要求發車前 15 分鐘到站牌）', `10:00 前抵 Muzeum Auschwitz 留安檢時間（官方要求至少提前 30 分鐘到場）；已購 ${lajkonikOutboundAdopted.dep} 班 ${lajkonikOutboundAdopted.arr} 抵達，只剩 10 分鐘餘裕`, '10:30 英文 educator 導覽已訂妥，遲到不予補場', `回程巴士 ${lajkonikInboundAdopted.dep} 發車，15:15 前到站牌，導覽結束後不要走遠`, '晚間不再加博物館或長距離步行'],
    compressible: ['回克拉科夫後晚餐形式', '晚間自由活動'],
    // 導覽已訂妥 10:30；去程巴士 2026-10-13 已購 08:25 → 09:50（rail.js outbound.booked）。
    // 回程購票狀態由 todoGroups 推導（lajkonikInboundState），班次與公開班表正本在 rail.js；9/09 售票頁只代表當時的可售快照。
    train: {segmentId:'bus-lajkonik'},
    steps: [
      {t:'07:15', id:'d3-breakfast', label:'自備早餐 · 住宿內吃完', sub:'前一天先買好，07:35 離開住宿，07:55 至 MDA 報到', dur:'20 min'},
      {t:'07:55', label:'Kraków MDA 報到', sub:'ul. Bosacka 18 Dworzec Autobusowy（Kraków Główny 後方步行約 5 分）；票面標示下層（dolna płyta）D9 站位，業者要求發車前 15 分鐘（08:10）到站牌，仍以現場電子看板為準', dur:'30 min 規劃緩衝'},
      {t: lajkonikOutboundAdopted.dep, label:'Lajkonik · 克拉科夫 → 奧斯威辛', sub:`已購票（2 張全票，線上總價 ${auschwitzBus.outbound.booked.total}）：${lajkonikOutboundAdopted.dep} 由 ${lajkonikOutboundAdopted.bay} 發車、${lajkonikOutboundAdopted.arr} 抵 Więźniów Oświęcimia 55，車程 ${lajkonikOutboundAdopted.dur}。上車出示列印票或手機票（螢幕至少 4 吋）。要準時上車；09:50 下車後直接走到入口報到，導覽 10:30 開始。退票規則見『訂票與交通』頁。`, cost:`已購票（2 張 ${auschwitzBus.outbound.booked.total}）`, dur: lajkonikOutboundAdopted.dur},
      {t: lajkonikOutboundAdopted.arr, label:'抵 Auschwitz I', sub:'下車處就在博物館停車場對面。距 10:30 入場只有 40 分鐘，官方要求 10:00 前到場——只剩 10 分鐘餘裕：下車直接寄大件行李（付費，費率以現場為準）、過安檢（機場式檢查會排隊），不逛書店；可入館包袋不得超過 35 × 25 × 15 公分。巴士明顯誤點時，依官方確認信的說明處理', dur:'40 min（到場要求前只剩 10 min）'},
      {t:'10:30', label:'★ 英文官方導覽（已訂妥）', sub:'個人 educator 導覽 · 一館 + 比克瑙 · 官方標示約 3 小時 45 分；入場憑電子入場證＋證件，兩者缺一不可', cost:'已付款', dur:'3h45'},
      {t:'依導覽休息', timingMode:'relative', id:'d3-lunch', label:'自備午餐 · 依允許的休息時段', sub:'攜帶三明治、水果與水；只在導覽允許的用餐區吃，不在參觀區進食或為午餐離團'},
      {t:'約 14:15', label:'導覽結束', sub:'比克瑙結束後搭免費接駁巴士回一號營區（回克拉科夫的巴士從一號營區旁發車），留意接駁班次，再走到停車站牌'},
      {t: lajkonikInboundAdopted.dep, label:'回程巴士返克拉科夫', sub:`${lajkonikInboundState}：15:30 由 Więźniów Oświęcimia 55 發車 → 16:55 抵 Kraków MDA（ul. Bosacka 18）。15:15 前到站牌，出示列印票或手機票（螢幕至少 4 吋）；導覽約 14:15 結束，14:00 班不可用。趕不上時 16:30 需另買新票。退票規則見『訂票與交通』頁。`, cost:`已購票（2 張全票 47,50 zł）`, dur: lajkonikInboundAdopted.dur},
      {t: lajkonikInboundAdopted.arr, label:'抵 Kraków MDA · 休息', sub:'ul. Bosacka 18 Dworzec Autobusowy；步行回 ibis 放東西、休息。途中在 Lajkonik 麵包店（麵包店，不是巴士公司）買明早麵包，20:00 關門。約 17:35 由 ibis 出發，步行到 Jagiellońska 5 的 Mr. Jerry（18:00 已訂位），出門前用地圖確認步行時間。'},
      {t:'18:00', id:'d3-dinner', label:'晚餐 · Mr. Jerry 威靈頓牛排', sub:'Jagiellońska 5（老城），18:00 已訂位（2 位、無訂金）；Beef Wellington 無法預點，到店再點；Pod Aniołami 保留為備案。', cost:'依店家菜單', dur:'1 h 15 min'},
    ],
    eat: [
    ],
    warn: `✅ 導覽已訂妥：10/26 10:30 英文個人 educator 導覽（Zwiedzanie indywidualne z edukatorem），官方標示約 3 小時 45 分，2 人。官方明載「入場證需搭配身分證件」，請把電子入場證存離線並帶護照。🚌 **去程巴士已購票**：**${lajkonikOutboundAdopted.dep} → ${lajkonikOutboundAdopted.arr}**，Kraków MDA 下層 D9 站位發車、2 張全票線上總價 ${auschwitzBus.outbound.booked.total}；業者要求發車前 15 分鐘到站牌，上車出示列印票或手機票。⚠ 官方要求導覽前至少 30 分鐘、即 **10:00 前到場**，這班 ${lajkonikOutboundAdopted.arr} 抵達只剩 10 分鐘餘裕：下車直接寄物、過安檢，不逛書店；巴士一誤點就可能趕不上。要準時上車；09:50 下車後直接走到入口報到，導覽 10:30 開始。**回程已購 15:30 → 16:55，15:15 前到站牌**。去回程退票規則見『訂票與交通』頁。`,
    // 回程選項。導覽約 14:15 結束，全部以「14:15 之後發車」為門檻。
    // 回程班次為 2026-09-09 官方售票頁 lajkonikbus.pl 查得的 10/26 快照；
    // 去程已於 2026-10-13 購票；回程購票狀態見 lajkonikInboundState（由 todoGroups 推導）。
    returnOptions: [
      {
        rank: '採用', name: `Lajkonik ${lajkonikInboundAdopted.dep} → ${lajkonikInboundAdopted.arr} 抵 Kraków MDA`,
        detail: `由 Więźniów Oświęcimia 55 發車、停 ul. Bosacka 18 Dworzec Autobusowy，車程 ${lajkonikInboundAdopted.dur}，${lajkonikInboundAdopted.fare}。導覽 14:15 結束後請在 15:15 前回到站牌。`,
        status: `${lajkonikInboundState}；2 張全票 47,50 zł，15:15 前到站牌。`,
        url: 'https://www.lajkonikbus.pl/',
      },
      {
        rank: '備案', name: `Lajkonik ${lajkonikInboundBackup.dep} → ${lajkonikInboundBackup.arr} 抵 Kraków MDA`,
        detail: '同站牌的下一班，需另買新票（已購票不能改期）。導覽延後、比克瑙接駁排隊或想多留時間時改搭，代價是多等 1 小時。',
        status: `當天若已趕上 ${lajkonikInboundAdopted.dep} 就不需要這班。`,
        url: 'https://www.lajkonikbus.pl/',
      },
      {
        rank: '不可採用', name: `Lajkonik ${lajkonikInboundRejected.dep} → ${lajkonikInboundRejected.arr}`,
        detail: '當日下午最早的一班，由同一站牌發車。',
        status: '❌ 導覽約 14:15 才結束，這班在那之前就開走。',
        url: 'https://www.lajkonikbus.pl/',
      },
      {
        rank: '彈性備案', name: '火車 Oświęcim → Kraków Główny',
        detail: '車程約 1 小時（區間車約 1h15），票價約 PLN 20–29，班次比巴士密。但 Oświęcim 火車站距博物館約 1.6 公里：步行約 20 分，或搭市區 0／2／3／8 路到「Muzeum I」約 4 分，4–10 月另有 M 線接駁。',
        status: '需另買新票。⚠️ 現行班表到 10/24，10/25 起為新班表（Day 2 EIP 1306 即新表第一天，搭火車當天用 PKP App 查時刻與月台）。',
        url: 'https://portalpasazera.pl/en/',
      },
      {
        rank: '其他業者', name: 'Przewóz Osób JS／GT TRANS／Lewański',
        detail: '同樣行駛 Oświęcim ⇄ Kraków，班次可補 Lajkonik 的空檔；但多數停靠 Oświęcim 市區站而非博物館門口，需先確認上車點。',
        status: '需另買新票。⚠️ 班表與上車點未逐家確認，請在 busy-krk.pl 或各業者頁面比對。',
        url: 'https://www.busy-krk.pl/en/oswiecim-krakow/',
      },
      {
        rank: '其他業者', name: 'Moj Bus（moj-bus.pl）',
        detail: 'Lajkonik 的線上售票平台，本次去回程都在這裡購買，也可查票；16:30 備案需另買新票時也可用。',
        status: '需另買新票。⚠️ 班次與上下車點當天用 App 查；務必看清楚停靠的是博物館門口還是 Oświęcim 市區站。',
        url: 'https://moj-bus.pl/en',
      },
    ],
    backup: [
      {label:'戶外為主 · 必備雨具', where:'比克瑙營區戶外 80%', map:'https://www.google.com/maps/search/?api=1&query=Auschwitz%20II%20Birkenau%2C%20O%C5%9Bwi%C4%99cim', why:'導覽風雨無阻，請穿防水鞋 + 帶折傘'},
      {label:'導覽臨時取消或無法入場', where:'Galicia Jewish Museum', map:'https://www.google.com/maps/search/?api=1&query=Galicia%20Jewish%20Museum%2C%20Dajwor%2018%2C%20Krak%C3%B3w', why:'Galicia Jewish Museum 每日 10:00–18:00、全票 35 PLN；MOCAK 週一休館，10/26 不列入備案。去之前看 Google 地圖有沒有臨時閉館。'},
    ],
  },
  {
    n: 4, date: '10/27（二）', city: '克拉科夫 → 樂斯拉夫',
    title: 'Wieliczka 鹽礦 + 16:45 轉場',
    headline: 'IC 3830 已購票：16:45 由 Kraków Główny 出發；鹽礦後 Sztolnia 肋排午餐、13:41 SKA1 回城、14:10 買圈餅，14:30 回 ibis 取行李休息',
    tag: 'Transit',
    intensity: '高',
    hardConstraints: ['09:00 Wieliczka 鹽礦英文團已購票；07:55 前到 Kraków Główny 搭 KMŁ，依票面提早到礦井入口', '13:41 SKA1 回 Kraków Główny（最晚 15:11，搭 15:11 就跳過圈餅，直接回 ibis）', '14:30 回 ibis 取行李、休息；16:10 前抵 Kraków Główny，IC 3830 16:45 發車'],
    compressible: ['買圈餅'],
    train: {segmentId:'ic-3830'},
    steps: [
      {t:'06:55', label:'退房 + 行李寄旅館', sub:'鹽礦 09:00 英文團已購票，往回推：先退房把行李寄 ibis，在飯店吃早餐，07:55 前到 Kraków Główny', dur:'10 min'},
      {t:'07:05', id:'d4-breakfast', label:'自備早餐 · 住宿內吃完', sub:'前晚在 Lajkonik 麵包店或 Żabka 買好麵包，在 ibis 吃；車站只隔約 200 公尺，07:45 出門即可', dur:'40 min'},
      {t:'08:08', label:'火車到 Wieliczka Rynek-Kopalnia', sub:'SKA1 Kraków Główny 08:08 → Wieliczka Rynek-Kopalnia 08:31（緩衝版 07:38 → 08:01）；步行 5–8 分到 Daniłowicz Shaft，08:45 前到。70 分鐘 KMK+KMŁ 聯票 10／5 PLN，本段適用，去回各買一張', cost:'PLN 10（優待 5）', dur:'23 min'},
      {t:'09:00', label:'★ Wieliczka 鹽礦 Tourist Route 英文團', sub:'已付款：10/27 09:00 英文 Tourist Route（Individual tour）。票券 PDF 隨確認信附上，存離線；訂單編號只存私人資料。3.5 km · 135m 深 · St. Kinga 鹽教堂，依票面提早到 Daniłowicz 礦井入口', cost:'已購票', dur:'2–3 h'},
      {t:'12:00', id:'d4-lunch', label:'午餐 · Sztolnia Wieliczka 豬肋排', sub:'ul. Zamkowa 5；週二 11:00–22:00，未訂位、現場入座。Regis 出口步行約 2 分、Daniłowicz 約 5 分。ŻEBERKA WIEPRZOWE 蜂蜜啤酒或蒜味 57 zł，份量大，兩人分一份再加湯；第三方菜單價格，以現場菜單為準。付款方式未查到，卡與少量現金都帶；13:20 前結帳。Sztolnia 客滿或出礦太晚改 Bistro Posolone 備案', cost:'57 zł／份 · 13:20 結帳', dur:'80 min'},
      {t:'13:20', label:'步行到 Wieliczka Rynek-Kopalnia', sub:'約 400 m、6–8 分；買 70 分鐘 KMK+KMŁ 聯票 10／5 PLN，或在車上售票機購票', dur:'6–8 min'},
      {t:'13:41', label:'SKA1 回 Kraków Główny', sub:'13:41 → 14:03；備案 14:11 → 14:33、14:41 → 15:03、15:11 → 15:33（最晚 15:11，車程 22 分）。搭 15:11 就跳過圈餅，先取行李', cost:'PLN 10（優待 5）', dur:'22 min'},
      {t:'14:10', id:'d4-snack', label:'買圈餅 · Obwarzanek Krakowski - Tunel', sub:'Basztowa／Lubicz 地下道，每日 08:00–18:00，從車站步行 6–8 分；克拉科夫圈餅，可外帶當車上點心，準備零錢'},
      {t:'14:30', label:'回 ibis 取行李、休息', sub:'圈餅店走回 ibis 約 3–5 分；大廳或 Galeria Krakowska 休息，16:10 前到月台'},
      {t:'16:10', label:'抵 Kraków Główny', sub:'確認月台、車廂與座位；發車前保留 35 分鐘', dur:'35 min 緩衝'},
      {t:'16:45', label:'IC 3830 前往樂斯拉夫', sub:'已購票；16:45 → 19:50（Koleo，Peron II 抵達），車廂座位依票券詳細頁', cost:'已購票', dur:'3 h 05 min'},
      {t:'19:50', label:'抵 Wrocław Główny', sub:'Koleo 19:50 到；順手拍打燈的新哥德式主車站，再步行至主站對面的 Hotel Piast，拖行李保守抓 5–10 分鐘'},
      {t:'20:05', label:'Piast 放行李', sub:'Piłsudskiego 98，車站對面；放好行李就出門吃晚餐', dur:'10 min'},
      {t:'20:15', id:'d4-dinner', label:'晚餐 · Samarqand 或車站 KFC', sub:'Stawowa 23（車站旁）：Uzbek Plov 抓飯、Manti 湯餃。關門前 1 小時廚房就不出餐，誤點、晚到或不接單直接改 KFC Wrocław PKP 或 Wroclavia 的 MAX（到 01:00）。抵達時間依 Koleo 為 19:50，誤點再用 PKP App 即時查', dur:'50 min'},
      {t:'21:05', label:'★ Przejście「無名行人」雕像（選配）', sub:'Świdnicka × Piłsudskiego：一群銅像行人沉進人行道、再從對面冒出來。今天 06:55 就出門，夜拍整段是選配，累了吃完晚餐就回飯店', cost:'免費', dur:'15 min'},
      {t:'21:25', label:'★ 中央廣場夜景（選配）', sub:'哥德式市政廳打燈', cost:'免費', dur:'20 min'},
      {t:'21:45', label:'★ Neon Side Gallery 夜景（選配）', sub:'Ruska 46c 的中庭，舊霓虹招牌晚上才亮；去之前看 Google 地圖最新評論確認有開', cost:'免費', dur:'15 min'},
      {t:'22:05', label:'搭電車或叫車回 Piast', sub:'用 Jakdojade 查電車，或開 Bolt 叫車', dur:'約 15 min'},
    ],
    eat: [
    ],
    warn: '✅ 鹽礦已購票：10/27 09:00 英文 Tourist Route（付款），票券 PDF 存離線，訂單編號只存私人資料。比原規劃的 10:00 場早一小時，早上往回推：06:55 退房寄行李、07:05 在 ibis 吃前晚備妥的早餐、07:55 前到 Kraków Główny 搭 KMŁ。08:08 SKA1 → 08:31，08:45 前到入口。出礦後 12:00 Sztolnia 肋排午餐（未訂位、現場入座，客滿改 Bistro Posolone），13:20 前結帳，13:41 SKA1 → 14:03 回城，14:10 買圈餅，14:30 回 ibis 休息。最晚搭 15:11 SKA1，跳過圈餅。城際段已購 IC 3830，16:45 發車；若鹽礦延誤，跳過圈餅，16:10 前抵 Kraków Główny。抵達樂斯拉夫 19:50（Koleo），20:15 晚餐 Samarqand；之後的夜拍（無名行人雕像、中央廣場、Neon Side Gallery）是選配，累了就回飯店。',
    backup: [
      {label:'鹽礦延誤', where:'午餐改外帶或吃 Bistro Posolone 備案，最晚搭 15:11 SKA1', why:'保住 13:41 SKA1 和 16:45 IC 3830'},
      {label:'雨天備案', where:'鹽礦本身就在地下 135m', map:'https://www.google.com/maps/search/?api=1&query=Kopalnia%20Soli%20Wieliczka%2C%20Dani%C5%82owicza%2010%2C%20Wieliczka', why:'地下約 17–18°C、防雨遮陽最佳備案'},
      {label:'Sztolnia 客滿', where:'改 Bistro Posolone 備案', why:'保住 13:41 SKA1 和 16:45 IC 3830'},
    ],
    practical: [
      {tag:'交通', name:'Wieliczka 火車', note:'SKA1 去程 08:08 → 08:31（或 07:38 → 08:01）；回程採 13:41 → 14:03，備案 14:11／14:41，最晚 15:11 → 15:33。Kraków Główny 搭 KMŁ 至 Wieliczka Rynek-Kopalnia。ZTP 官方票價表原文：70 分鐘 KMK+KMŁ 聯票 10／5 PLN，可搭 I、II、III 區的 KMK 車輛，以及 KMŁ 在 Wieliczka Bogucice–Wieliczka Rynek Kopalnia 區段與所有站名含「Kraków」的車站，唯一排除 Kraków Airport——本段全程涵蓋。但有效期只有 70 分鐘，去回要各買一張。'},
      {tag:'寄物', name:'旅館 + Główny 備案', note:'退房後優先寄旅館；若旅館不收，依車站當日設施、空位與費率處理'},
      {tag:'裝備', name:'鹽礦低溫', note:'地下約 17–18°C，攜薄外套；官方標示全程超過 800 階，須穿好走鞋'},
    ],
  },
  {
    n: 5, date: '10/28（三）', city: '樂斯拉夫 → 波茲南',
    title: '老城散步 + 博物館甜點 + 座堂島點燈 + 晚轉場',
    headline: '12:00 Wrocławska 午餐、15:35 前到座堂島；17:00 離島、18:20 前到站，19:10 IC 260 → 波茲南約 20:29',
    tag: 'Transit',
    intensity: '高',
    hardConstraints: ['07:30 Piast 出發；行李寄放：10/27 入住時問櫃台，結果為準；不能寄就用車站寄物櫃', '12:00 午餐，13:00 結束去 Panorama', '15:35 前到座堂島；17:00 離島', '18:20 前到站為目標，18:35 為硬性限制；19:10 IC 260'],
    compressible: ['依序先砍大學區、El Gato、Hala Targowa、Słodowa 島', '可取消 MAX 晚餐，改車站簡餐'],
    train: {segmentId:'ic-260'},
    steps: [
      {t:'07:30', label:'Piast 出發 · 無名行人 → Papa Krasnal', sub:'沿路拍匿名行人雕塑與 Papa Krasnal，步行到 Central Cafe 約 22 分（OSM 路由，第三方計算，未含紅綠燈與拍照）。行李寄放：10/27 入住 Piast 時問櫃台。', dur:'25 min'},
      {t:'07:55', label:'早餐 · Central Cafe', sub:'Św. Antoniego 10；官方 07:00–21:00，出發前再確認。美式鬆餅、貝果或燕麥粥；08:35 收尾，步行約 3 分到白鸛會堂。', dur:'40 min', id:'d5-breakfast'},
      {t:'08:40', label:'★ 白鸛會堂外觀', sub:'Włodkowica 7；官方 10:00 才開，出發前再確認；只看外觀，庭院未確認。步行約 6 分到 Plac Solny。', dur:'10 min'},
      {t:'09:00', label:'鹽廣場 Plac Solny', sub:'花市；Paloma 可外帶，第三方營業時間 08:00–21:00，出發前再確認。步行約 2 分到 Rynek。', dur:'13 min'},
      {t:'09:15', label:'★ 中央廣場 Rynek + 紡織會館', sub:'舊市政廳外觀、天文鐘面、刑柱、彩色山形屋；不進市政廳博物館，沿路找小矮人。', dur:'30 min'},
      {t:'09:50', label:'糖果屋雙屋 → 聖伊莉莎白教堂外觀 → 屠夫巷 Jatki', sub:'糖果屋拱門拍高塔、Jatki 動物銅像；不登塔。Rynek 到 El Gato 約 3.4 分，含 Jatki 多約 1 分。', dur:'20 min'},
      {t:'10:15', label:'咖啡休息 · El Gato Specialty Coffee', sub:'Odrzańska 8；官方 08:00–20:00，出發前再確認。步行約 4 分到大學。', dur:'25 min'},
      {t:'10:45', label:'★ 大學區、大學橋河岸', sub:'劍客噴泉、大學主樓立面、大學橋河岸，只看外觀。時間不夠先刪。', dur:'35 min'},
      {t:'11:20', label:'午餐前緩衝', sub:'大學到 Wrocławska 步行約 5 分，11:50 前到；留時間休息與候位。', dur:'40 min'},
      {t:'12:00', label:'午餐 · Restauracja Wrocławska', sub:'Szewska 59/60；12:00 開門，出發前再確認。Śląskie niebo、Bigos、Pierogi；可訂位但非必要，預設現場候位；+48 71 305 12 28，12:00 起接聽。13:00 結束，步行約 10 分去 Panorama。', dur:'1 h', id:'d5-lunch'},
      {t:'13:00', label:'前往 Panorama · 全景畫圓形館外觀', sub:'午餐結束後步行約 10 分，只拍外觀、不入內，不用買全景畫票；再步行約 4 分到國家博物館。', dur:'20 min'},
      {t:'13:20', label:'國家博物館 · Słodki Chłopak 甜點', sub:'pl. Powstańców Warszawy 5；甜點 30–40 分，免票進入。10/28 博物館照常開放 10:00–16:00，咖啡廳同時段，16:00 前離開；官方只公告 10/31–11/2 閉館，營業時間出發前再確認。', dur:'40 min'},
      {t:'14:00', label:'步行前往 Hala Targowa', sub:'博物館到市場約 10 分；預留紅綠燈與拍照時間。', dur:'20 min'},
      {t:'14:20', label:'Hala Targowa 市場大廳', sub:'混凝土拱頂、買水果；官方週一至六 08:00–18:30，出發前再確認。步行約 4 分到 Słodowa。', dur:'15 min'},
      {t:'14:40', label:'★ Słodowa 島', sub:'拍河景，再步行約 3 分到沙島；時間不夠先刪。', dur:'15 min'},
      {t:'15:00', label:'沙島 · 沙上聖母堂', sub:'週三 09:00–17:30 為 adoracja 開放時間，推測可安靜入內，要守禮；17:30 有彌撒，出發前再確認。', dur:'20 min'},
      {t:'15:20', label:'★ 座堂橋 → 座堂島', sub:'經橋步行約 6 分到 InfoCentrum；15:35 前到大教堂入口右側雙燈處，途中就留意點燈人。', dur:'15 min'},
      {t:'15:35', label:'★ InfoCentrum 等點燈人', sub:'pl. Katedralny 1，大教堂入口右側雙燈處。點燈人約 15:20–16:05 之間開始，無固定場次，出發前再確認；官方來源互相矛盾：InfoCentrum 頁說日落前約 30 分（約 16:03），市府報導說冬季約 15:20。InfoCentrum 週三 09:00–16:00，出發前再確認。日落約 16:33–16:34，16:30–17:05 藍調時刻；風大，帶帽子手套，17:00 離島。', dur:'85 min'},
      {t:'17:00', label:'座堂島結束後回 Piast 取行李', sub:'步行約 29 分（OSM 路由，第三方計算，未含紅綠燈與拍照）；Bolt 約 8–10 分，價格未查。17:10 才離島就叫車，保留取行李與進站時間。', dur:'35 min'},
      {t:'17:35', label:'Piast 取行李', sub:'取行李後步行約 11 分到 Wroclavia；來不及就取消 MAX，直接到車站買簡餐。', dur:'10 min'},
      {t:'17:45', label:'晚餐 · MAX Wroclavia 外帶', sub:'官方週三 08:00–01:00，出發前再確認。Frisco 或 Halloumi 漢堡＋地瓜薯條；步行約 11 分抵商場後取餐，18:10 前離開，步行約 8 分到車站。排隊久改車站簡餐。', dur:'25 min', id:'d5-dinner'},
      {t:'18:20 前', label:'抵 Wrocław Główny', sub:'硬性最晚 18:35；確認月台、車廂與座位，此時不再排隊買餐。', dur:'至少 50 min 緩衝'},
      {t:'19:10', label:'IC 260 前往波茲南', sub:'已購票；19:10 → 約 20:29 Poznań Główny，票券存離線。', dur:'1 h 19 min'},
      {t:'20:29', label:'抵 Poznań Główny', sub:'約 20:45 取 Poznan Apartments 鑰匙；依事先傳訊確認的方式與訂房資料前往。'},
    ],
    eat: [
      snack({text:'10:15 咖啡休息 @ El Gato Specialty Coffee', placeId:'wroclaw-el-gato-specialty-coffee'}),
      snack({text:'13:20 甜點 30–40 分（免博物館門票） @ Słodki Chłopak', placeId:'wroclaw-slodki-chlopak-muzeum-narodowe'}),
      snack({text:'甜點候選（本日不另排時段） @ Dessert Boutique', placeId:'wroclaw-dessert-boutique'}),
    ],
    warn: "✅ IC 260 已購票，10/27 前存離線。本日不排百年廳與 Neon Side Gallery（約 20:00 後才亮）。點燈人約 15:20–16:05 之間開始，無固定場次，出發前再確認；官方來源互相矛盾：InfoCentrum 頁說日落前約 30 分（約 16:03），市府報導說冬季約 15:20。日落約 16:33–16:34。所有營業時間、票價出發前再確認；所有步行時間為 OSM 路由，第三方計算，未含紅綠燈與拍照。Piast 官方寄放說明未查到，10/27 入住時問櫃台；第三方稱有寄放與 24 小時櫃台，退房 12:00 也是訂房網站資料。",
    backup: [{label:'行李寄放', where:'Wrocław Główny 寄物櫃', map:'https://www.google.com/maps/search/?api=1&query=Wroc%C5%82aw%20G%C5%82%C3%B3wny', why:"PKP 官方（https://www.pkp.pl/pl/dworce/bezpieczenstwo/bagaz）：中央隧道，每 24 小時 25/30/35 zł，出發前再確認；離 Piast 步行約 5 分（OSM 路由，第三方計算，未含紅綠燈與拍照）。"}, {label:'時間不足', where:'車站簡餐', map:'https://www.google.com/maps/search/?api=1&query=Wroc%C5%82aw%20G%C5%82%C3%B3wny', why:'取消 MAX，保留 18:20 前到站與 19:10 火車緩衝。'}],
  },
  {
    n: 6, date: '10/29（四）', city: '波茲南 → 華沙',
    title: '09:00 出發 · 教堂島 + 山羊鐘樓秀 + 聖馬丁牛角麵包',
    headline: '09:00 離開公寓、車站寄行李；電車去 Śródka 與教堂島，11:00 Manekin 早餐、13:00 Stary Browar 午餐；17:40 EIC 8104 回華沙',
    tag: 'Transit',
    intensity: '高',
    hardConstraints: ['09:00 離開公寓、約 09:10 車站置物櫃寄放行李', '11:30 前離開 Manekin；11:55 Rynek 就位', '12:00 山羊鐘樓秀，不動就不重排', 'Fara 12:28 前出來或只看外觀', '14:00 離開 Stary Browar', '15:45 回車站、約 16:00 取行李，17:15 前到月台', '17:40 已購 EIC 8104，19:59 抵華沙'],
    compressible: ['皇家城堡山丘（Manekin 超過 11:30 就省略）', '帝王區大劇院只路過', 'Kaponiera 咖啡休息'],
    train: {segmentId:'eic-8104'},
    steps: [
      {t:'09:00', label:'退房、離開 Poznan Apartments Towarowa', sub:'Towarowa 37，約 09:10 到 Poznań Główny 置物櫃寄放行李。接待處 08:00–22:00、退房 11:00，出發前再確認；官方未寫公寓能否寄放，可傳訊息詢問。', dur:'10 min'},
      {t:'09:10', label:'Poznań Główny 置物櫃寄放行李', sub:'24 小時，小件約 20 zł、大件約 25 zł，支援感應付款（第三方 TripAdvisor）；容量、價格與付款方式出發前再確認。備案 Radical Storage Dworcowa 1，06:00–21:00、約 15 zł，出發前再確認。', dur:'15 min'},
      {t:'09:25', label:'電車 6 往 Rondo Śródka', sub:'POGL42 月台，往 Miłostowo，約 14 分；09:14 電車 5 也可。第三方推算，出發前再確認；ZTM 時刻表有效至 11/8，5／6 不在 Most Teatralny 改道名單。45 分鐘票 7 zł/人、兩人 14 zł；車上讀卡機感應或 Jakdojade 掃碼，外國卡未確認，備現金。', dur:'14 min'},
      {t:'09:44', label:'★ Śródka 立體壁畫', sub:'「Opowieść śródecka」看 10 分鐘，09:54 離開。', dur:'10 min'},
      {t:'10:02', label:'★ 教堂島 Ostrów Tumski', sub:'波茲南主教座堂平日 09:00–16:00，彌撒時不能參觀；平日彌撒 08:00，出發前再確認。主教座堂與教堂島逛到 10:35；收費地下墓室和金禮拜堂不進。', dur:'33 min'},
      {t:'10:35', label:'走 Chwaliszewo 到 Manekin', sub:'步行約 23 分，10:58 到 Kwiatowa 3。', dur:'23 min'},
      {t:'11:00', id:'d6-breakfast', label:'早餐 · Manekin', sub:'Kwiatowa 3；官方早餐週一至五 10:00–13:00，營業 10:00–22:00（menu.pl 寫 21:45）。炒蛋煎餅、起司煎餅、pancake burger 或 burrito 約 17.5–24 zł，咖啡約 6 zł；當日公休與價格出發前再確認。11:30 前離開。', dur:'30 min'},
      {t:'11:30', label:'皇家城堡山丘（選配）', sub:'約 11:42 到，只看 Przemysł 王城外觀，再走 3 分鐘到 Rynek；Manekin 超過 11:30 就省略，直接去 Rynek。', dur:'25 min'},
      {t:'11:55', label:'廣場卡正面位置', sub:'舊市集廣場 Stary Rynek，站市政廳正面等 12:00 山羊鐘。', dur:'5 min'},
      {t:'12:00', label:'★ 山羊鐘樓秀', sub:'每日 12:00 與 15:00；市政廳整修但山羊鐘照常，機械偶有停擺。12:00 不動就不重排。', dur:'5 min'},
      {t:'12:05', label:'★ 聖馬丁牛角麵包 (PGI)', sub:'ROGAL Świętomarciński（Stary Rynek 11/17），週四 09:00–20:00（第三方，出發前再確認）。兩人分一個；走 2 分鐘路過 Rogalowe Muzeum（Stary Rynek 41），只從外面看麵包，不參加導覽。售完改 Kandulski（Plac Ratajskiego 1，週四 09:00–17:00）。', dur:'10 min'},
      {t:'12:15', label:'Fara 粉紅教堂', sub:'每日 06:00–19:30；平日 12:30 彌撒，12:28 前出來或只看外觀。耶穌會學院外觀後往自由廣場。', dur:'15 min'},
      {t:'12:30', label:'自由廣場 Plac Wolności', sub:'Raczyński 圖書館、Arkadia 宮外觀；12:45 前出發。', dur:'15 min'},
      {t:'13:00', id:'d6-lunch', label:'★ Stary Browar', sub:'午餐 · Stary Browar Food Hall 與逛街；商場週一至六 09:00–21:00，Food Hall 週一至四 12:00–22:00，出發前再確認。舊啤酒廠紅磚建築與洗手間，14:00 離開。', dur:'1 h'},
      {t:'14:15', label:'Okrąglak 圓形百貨外觀', sub:'現代主義圓形建築，只看外觀，接著走帝王區。', dur:'10 min'},
      {t:'14:25', label:'★ 聖馬丁街帝王區', sub:'Collegium Minus → Park Mickiewicza → 1956 年六月事件紀念碑（座標未驗證） → 帝王城堡外觀（不進去）；大劇院只路過，約 15:00 結束。', dur:'35 min'},
      {t:'15:08', label:'Kaponiera 圓環', sub:'「5 figur」（ul. Roosevelta 22）與 Bałtyk 大樓外觀，咖啡休息到約 15:45。', dur:'37 min'},
      {t:'15:45', label:'走回 Poznań Główny', sub:'從 Kaponiera 步行約 11 分，約 16:00 取行李。', dur:'15 min'},
      {t:'16:00', label:'Poznań Główny 取行李', sub:'從置物櫃領行李，確認月台；距 17:15 上月台約 75 分緩衝，可先買食物帶上車。', dur:'70 min'},
      {t:'17:10', label:'抵 Poznań Główny 月台', sub:'17:15 前就位；確認月台與車廂，保留 17:40 發車前緩衝。', dur:'30 min'},
      {t:'17:40', label:'EIC 8104 前往華沙', sub:'EIC 8104 已購票；17:40 → 19:59（Koleo，Peron II 抵達；列車名 BOLESŁAW PRUS），車廂與座位依票券詳細頁。上車前在波茲南站買吃的帶上車吃（19:59 才到華沙，晚餐排 20:20）', cost:'已購票', dur:'2 h 19 min'},
      {t:'19:59', label:'抵 Warszawa Centralna', sub:'Koleo 19:59 到；步行至 Hotel Metropol 約 500 公尺，拖行李預留 10–15 分鐘'},
      {t:'20:15', label:'入住 Hotel Metropol、放行李', sub:'先放行李、換輕便外套，不在房間久待；Metropol 退房時間 12:00 前', dur:'約 5 min'},
      {t:'20:20', id:'d6-dinner', label:'晚餐 · Arirang 韓式', sub:'Nowogrodzka 38，從 Metropol 步行約 3 分／約 150–200 m；Bulgogi、拌飯或 Jajangmyeon。週四 12:00–22:00，最後點餐時間未查到；不用訂位，當天先看營業狀態，出發前再確認；20:40 前不能入座改 Złote Tarasy 或 Ćma', cost:'依店家', dur:'約 45 min'},
      {t:'21:15', label:'★ Złote Tarasy 玻璃波浪屋頂夜景', sub:'從 Arirang 步行約 10 分，Metropol 至商場約 0.9 km；看玻璃屋頂、買水與伴手禮，22:00 關門', cost:'免費', dur:'40 min'},
      {t:'21:55', label:'往回走，途經科學文化宮拍夜景', sub:'回程順路拍科學文化宮夜景', cost:'免費', dur:'15 min'},
      {t:'22:10', label:'回 Hotel Metropol', sub:'明早 08:00 出門，08:10 在 Zgoda 3/5 早餐，早點睡'},
    ],
    eat: [
      snack({text:'12:05 聖馬丁牛角麵包 @ ROGAL Świętomarciński', placeId:'poznan-rogal'}),
    ],
    warn: '置物櫃資料來自第三方 TripAdvisor，容量與感應付款出發前再確認；公寓官方未寫可否寄放。電車 6／5 為第三方推算，出發前再確認，外國卡未確認，備現金。Manekin 公休、ROGAL 營業與 Food Hall 時段出發前再確認；帝王城堡只看外觀。',
    backup: [
      {label:'行李寄放', where:'Radical Storage Dworcowa 1', map:'https://www.google.com/maps/search/?api=1&query=Radical%20Storage%20Dworcowa%201%20Pozna%C5%84', why:'06:00–21:00、約 15 zł，出發前再確認；Poznań Główny 置物櫃客滿時採用。'},
      {label:'下雨備案', where:'Stary Browar 與室內咖啡', why:'Bolt 僅雨天備案；縮短戶外停留，保留 12:00 山羊鐘與 15:45 回車站。'},
      {label:'Food Hall 客滿', where:'Pyra Bar 或 Zen On', why:'Stary Browar Food Hall 為主；客滿改 Pyra Bar（Strzelecka 13，週四 11:00–21:00）或 Zen On（Święty Marcin 21，週四 12:00–20:00），仍保留 14:00 離開午餐區。'},
    ],
  },
  {
    n: 7, date: '10/30（五）', city: '華沙',
    title: '08:00 出發由北往南逛 · 新城 + 老城全採點 + 瓦津基',
    headline: '收費館只路過拍外觀：MSN、科學文化宮、POLIN 一路往南，新城、老城、城堡廣場一次走完；下午沿皇家大道看聖十字教堂與蕭邦心臟、蕭邦博物館外觀、河邊美人魚、BUW 屋頂花園，15:25 直接叫車到瓦津基北門，15:55 到水上宮殿等日落',
    tag: 'City Walk',
    intensity: '高',
    hardConstraints: ['收費館只路過拍外觀不進：MSN、POLIN、居禮夫人博物館、華沙博物館、皇家城堡、蕭邦博物館', '老城與新城上午一次走完、不回頭；12:50–13:45 Gospoda 午餐', '水上宮殿入內是選配：週五個人參觀免費、10:00 開門，週五僅開放一樓（官網），其餘以館方當日公告為準，想進要在最後入場 17:30 前；本次只排湖邊外觀', '15:25 從 BUW 叫車約 15 分到瓦津基北門；15:55 抵水上宮殿等 16:12 日落', 'Soul Kitchen 18:00–20:00、2 人已訂妥，保留 15 分鐘，店家已註記 1 份威靈頓'],
    compressible: ['BUW 屋頂花園與美人魚（時間不夠先刪，從 Tamka 街直接叫車到瓦津基北門，保留更多交通緩衝）', '聖母訪親教堂、Piwna 街等小站只拍不停', '若聖安妮教堂觀景台重新開放要登塔（約 25 分）：老城廣場、石階街／Gnojna Góra、聖若望大教堂／Piwna 街各縮 5 分，城堡廣場／聖安妮外觀縮 10 分，仍保留 12:50 午餐', '日落後立即從 Agrykola 叫車回飯店'],
    steps: [
      {t:'08:00', label:'從 Metropol 出發', sub:'步行約 8 分到 Zgoda 3/5 早餐。', dur:'10 min'},
      {t:'08:10', id:'d7-breakfast', label:'早餐 · Bułkę przez Bibułkę', sub:'Zgoda 3/5，離 Metropol 步行約 8 分，週五 07:30–23:00（出發前再確認）；Bagel、炒蛋或 Avocado Toast，08:50 前結帳；備案 Kubuś Piekarenka（Marszałkowska 19，08:00–20:00，出發前再確認），離 Zgoda 約 1.8 km，需另留交通時間', dur:'40 min'},
      {t:'08:55', label:'MSN 現代美術館＋科學文化宮外觀；地鐵 M1 → Ratusz Arsenał', sub:'去搭地鐵順路：Świętokrzyska 站口旁、Marszałkowska 103 的白色新館 MSN 與對面的科學文化宮早晨外觀；兩處都是收費館／觀景台，只在外面拍；Świętokrzyska 搭 M1 往北 1 站到 Ratusz Arsenał，下車再走約 10 分到 POLIN，用 Jakdojade 查當下班次', cost:'75 分第 1 區票 4.40', dur:'30 min'},
      {t:'09:25', label:'★ POLIN 外觀＋猶太隔離區英雄紀念碑', sub:'POLIN 博物館的玻璃與裂縫造型；館前的隔離區英雄紀念碑、西德總理布蘭特下跪紀念碑。不進館', cost:'免費', dur:'25 min'},
      {t:'09:50', label:'★ 克拉辛斯基廣場', sub:'華沙起義紀念碑（戶外雕塑，不是起義博物館）、最高法院的綠色柱廊、克拉辛斯基宮外觀；花園可略過', cost:'免費', dur:'20 min'},
      {t:'10:10', label:'★ 新城廣場＋聖母訪親教堂＋居禮夫人雕像＋Freta 街', sub:'沿 Świętojerska、Freta 北段進新城；廣場中央的井、東側白色的聖禮修女會聖卡齊米日教堂；新城往東北短走：磚造哥德式教堂、高地上的居禮夫人雕像，往下看維斯瓦河；不下到河岸；Freta 16 出生地外牆紀念牌（居禮夫人博物館不進）、聖雅各教堂、新城入口的聖靈教堂，一路往南外觀快拍', cost:'免費', dur:'45 min'},
      {t:'10:55', label:'★ 甕城 Barbakan＋城牆 → Szeroki Dunaj → Wąski Dunaj', sub:'城門內外兩側都拍；沿 Podwale 磚牆走，小小起義者銅像就在城牆外側；從城牆鑽回老城的兩條小巷與小廣場，接到老城廣場', cost:'免費', dur:'25 min'},
      {t:'11:20', label:'★ 老城廣場', sub:'美人魚像、四側彩色立面、北側華沙博物館的街屋外觀（不進館）；一次拍完廣場四面', cost:'免費', dur:'25 min'},
      {t:'11:45', label:'石階街 → Brzozowa → Gnojna Góra 觀景點', sub:'從 Kamienne Schodki 石階往下看河，沿 Brzozowa 窄街走到 Gnojna Góra 高地看維斯瓦河約 10 分；不下到河岸，省得再爬回來', cost:'免費', dur:'20 min'},
      {t:'12:05', label:'Kanonia 許願鐘 → 聖若望大教堂 → Piwna 街 → 聖馬丁教堂', sub:'Kanonia 小廣場的銅鐘、窄立面老屋 → 聖若望大教堂與隔壁耶穌會教堂；正殿通常可以免費看一眼，地下墓室收費不進；從聖若望大教堂往西接 Piwna 街，看聖馬丁教堂門面，再沿 Piwna 往南直接走到城堡廣場，不走回頭路', cost:'免費', dur:'25 min'},
      {t:'12:30', label:'★ 城堡廣場（白天版）皇家城堡外觀＋聖安妮教堂外觀', sub:'皇家城堡正面與鐘塔、齊格蒙特圓柱。臨河那側的 Kubicki 拱廊開放時間以現場為準。不進城堡；Kościół św. Anny，Krakowskie Przedmieście 68，城堡廣場東南角，順路拍白色古典立面，拍完往北折返約 280 m，到 Świętojańska 15 午餐。觀景台 10 月上旬起整修暫停開放（直到另行公告）；週五 10:00–13:00 教堂打掃、僅能進門廊，今天只拍外觀（教區官網 swanna.waw.pl，2026-10-21 讀取）。網友心得說登塔景色不錯（Threads 網友 Delly Liu @dellyliu〈波蘭自助旅行實戰經驗分享 — 華沙 1〉，2026-10-21 讀取，屬網友評論）；若重新開放想登塔，見延伸行程', cost:'免費', dur:'20 min'},
      {t:'12:50', id:'d7-lunch', label:'午餐 · Gospoda pod Zygmuntem', sub:'Świętojańska 15，週五 11:00–23:00（出發前再確認）；Google 4.7／15,253 則評論，評分來自第三方 Google 評論。13:45 離開；客滿改 Gościniec Polskie Pierogi（Krakowskie Przedmieście 29，11:00–23:30，出發前再確認；Google 4.7／24,488 則評論，評分來自第三方 Google 評論），約 14:00 在往南路上吃。', cost:'依店家', dur:'55 min'},
      {t:'13:50', label:'沿皇家大道往南：總統府、Bristol、訪親會教堂、華沙大學', sub:'Krakowskie Przedmieście 往南先經密茨凱維奇紀念碑與加爾默羅會教堂，再看總統府、Hotel Bristol、Raffles Europejski 外觀；E.Wedel 就在對面，想喝熱巧克力可以外帶；訪親會教堂（Kościół Wizytek，和上午新城的聖母訪親教堂是不同教堂）、普魯斯（Prus）銅像、華沙大學正門，都在同一條街上，外觀快拍', cost:'免費', dur:'25 min'},
      {t:'14:15', label:'★ 聖十字教堂', sub:'入內看柱子裡的蕭邦心臟；正殿通常可以免費進，彌撒時不要拍照', cost:'免費', dur:'15 min'},
      {t:'14:30', label:'哥白尼紀念碑 → Tamka 街蕭邦長椅、Ostrogski 宮外觀 → 河邊美人魚像', sub:'先拍哥白尼紀念碑，經 Ordynacka 轉 Tamka 街：Ostrogski 宮（蕭邦博物館，2026 整修閉館，只看外觀）、蕭邦音樂長椅；沿 Tamka 往下坡走到維斯瓦河邊，Wybrzeże Kościuszkowskie 河岸的美人魚像（Pomnik Syrenki）；網友推薦，路過快拍', cost:'免費', dur:'30 min'},
      {t:'15:00', label:'★ BUW 屋頂花園＋河岸步道', sub:'華沙大學圖書館 Dobra 56/66，屋頂花園免費、開到 10/31；10 月時段 08:00–18:00（官網波蘭文與英文頁的開放時間表都寫 10 月 08:00–18:00，但兩頁的規章段落都另寫 10 月 08:00–20:00，官方說法不一致，以 18:00 保守規劃），15:00 去在開放時間內；11/1 起不開放屋頂。哥白尼科學中心在南邊約 600 m，只從河岸遠拍、不專程走過去。時間不夠先刪這段', cost:'免費', dur:'20 min'},
      {t:'15:25', label:'BUW 叫 Bolt 或計程車到瓦津基北門、蕭邦紀念碑', sub:'從 BUW 搭計程車／Bolt，約 15 分到 Łazienki 北門（蕭邦紀念碑）；北門進園看蕭邦紀念碑，再步行往水上宮殿；花園每日 06:00–21:00 免費（出發前再確認）', cost:'依 App 報價；公園免費', dur:'30 min'},
      {t:'15:55', label:'★ 瓦津基 · 水上宮殿', constraint:{venue:'warsaw-lazienki-palace'}, sub:'抵湖邊等待 16:12 日落，拍宮殿倒影；本次以外觀為主，日落後往 Agrykola 出口，16:40 叫車回飯店', cost:'免費', dur:'45 min'},
      {t:'16:40', label:'從 Agrykola 出口叫車回飯店', sub:'Agrykola 出口叫 Bolt 或 Uber，約 2.3 公里；天黑後不再步行', cost:'依 App 報價', dur:'約 20 min'},
      {t:'17:50', label:'步行前往 Soul Kitchen', sub:'由 Metropol 步行約 8 分到 Nowogrodzka 18A，準時 18:00 入座；訂位保留 15 分鐘'},
      {t:"18:00", id:'d7-dinner', label:'最後晚餐 · Soul Kitchen 威靈頓牛排', sub:"Nowogrodzka 18A；店家 10/22 回信確認 10/30 18:00–20:00、2 人，保留訂位 15 分鐘；店家已註記 1 份 Beef Wellington，並非保證供餐。17:50 從 Metropol 步行約 8 分前往，確認信存離線。", cost:'依菜單', dur:"2 h（至 20:00）"},
      {t:'20:15', label:'可選 · E.Wedel 本店熱巧克力', sub:'Szpitalna 8，開到 22:00（出發前再確認）；喝完散步回飯店整理行李。隔天 07:20 就要從飯店出發看衛兵交接，早點睡', cost:'依店家', dur:'約 30 min'},
    ],
    eat: [],
    warn: '✅ 新行程不進付費館：皇家城堡、華沙起義博物館、POLIN、居禮夫人博物館、華沙博物館都只看外觀，不用買票。水上宮殿週五個人參觀免費、週五僅開放一樓（以館方當日公告為準），10:00–18:00、最後入場 17:30；日落 16:12，在湖邊拍倒影。衛兵交接已改到 10/31 早上 08:00。Soul Kitchen 18:00–20:00、2 人已訂妥，保留訂位 15 分鐘，店家已註記 1 份威靈頓。BUW 屋頂花園 10 月開放 08:00–18:00（出發前再確認），15:00 去在開放時間內；15:25 叫車、15:55 抵水上宮殿。瓦津基花園每日 06:00–21:00 免費（出發前再確認）。蕭邦博物館 2026 全年整修閉館，本趟不列入。',
    extend: [
      {label:'華沙起義博物館外觀＋紀念牆', when:'下午體力夠、想刪 BUW 時替代', map:'https://www.google.com/maps/search/?api=1&query=Muzeum%20Powstania%20Warszawskiego%2C%20Grzybowska%2079%2C%20Warszawa', why:'Grzybowska 79，在 Wola 區、不在步行路線上，從市中心搭車約 15 分；收費館不進，只拍紅磚電車廠房外觀與館外的起義紀念'},
      {label:'若重新開放 · 聖安妮教堂觀景台登塔', when:'10/22 複查仍暫停開放；當天現場看到已開放才排，接在城堡廣場之後、Gospoda 午餐之前', map:'https://www.google.com/maps/search/?api=1&query=Ko%C5%9Bci%C3%B3%C5%82%20%C5%9Bw.%20Anny%2C%20Krakowskie%20Przedmie%C5%9Bcie%2068%2C%20Warszawa', why:'觀景台 10 月上旬起整修暫停開放（直到另行公告，教區官網 swanna.waw.pl，2026-10-21 讀取）。重新開放才去：登塔約 25 分，第三方資訊說約 150 階、據說只收現金；開放時間與票價現場看。25 分從可壓縮清單挪：老城廣場、石階街／Gnojna Góra、聖若望大教堂／Piwna 街各縮 5 分，城堡廣場／聖安妮外觀縮 10 分，仍保留 12:50 午餐'},
      {label:'Hala Koszyki 美食大廳', when:'晚餐後', map:'https://www.google.com/maps/search/?api=1&query=Hala%20Koszyki%2C%20Koszykowa%2063%2C%20Warszawa', why:'Koszykowa 63，百年市場改建的鐵架大廳，週五大廳開到 01:00（各攤位時間另查）；從 Soul Kitchen 走約 15 分，想看華沙年輕人的週五夜晚可以繞過去喝一杯'},
      {label:'Bulwary Wiślane 維斯瓦河畔', when:'晚餐後', map:'https://www.google.com/maps/search/?api=1&query=Bulwary%20Wi%C5%9Blane%2C%20Warszawa', why:'河濱步道，城堡廣場步行 10–15 分，晚餐後想散步再去，免費'},
      {label:'Neon Museum 霓虹燈博物館', when:'下雨、取消瓦津基時替代', map:'https://www.google.com/maps/search/?api=1&query=Neon%20Muzeum%2C%20plac%20Defilad%201%2C%20Warszawa', why:'已遷入科學文化宮 4 樓（Marszałkowska 入口），共產時期霓虹招牌收藏，PLN 28／優待 18，離飯店最近的室內選項'},
      {label:'科學文化宮 30F 觀景台', when:'晚餐前', map:'https://www.google.com/maps/search/?api=1&query=Pa%C5%82ac%20Kultury%20i%20Nauki%2C%20plac%20Defilad%201%2C%20Warszawa', why:'全票 30／優待 25 PLN · 每日開放與售票皆至 20:00；10/30 沒有晚間延長場，17:00 後已是夜景'},
    ],
    backup: [
      {label:'Gospoda 客滿 → Gościniec', where:'Gościniec Polskie Pierogi（Krakowskie Przedmieście 29）', map:'https://www.google.com/maps/search/?api=1&query=Go%C5%9Bciniec%20Polskie%20Pierogi%2C%20Krakowskie%20Przedmie%C5%9Bcie%2029%2C%20Warszawa', why:'11:00–23:30（出發前再確認），約 14:00 在往南路上吃；Google 4.7／24,488 則評論，評分來自第三方 Google 評論。'},
      {label:'體力不足', where:'刪 BUW 屋頂花園與美人魚，從 Tamka 街直接叫車到瓦津基北門', why:'保留更多交通緩衝；Agrykola 叫車回飯店本來就是叫車，不影響 18:00 已訂晚餐'},
      {label:'下雨', where:'老城改快拍；下午改 Hala Koszyki 美食大廳和 Złote Tarasy', map:'https://www.google.com/maps/search/?api=1&query=Hala%20Koszyki%2C%20Koszykowa%2063%2C%20Warszawa', why:'水上宮殿室內照樣可以進（週五免費、僅開放一樓）；戶外淋雨意義不大'},
    ],
  },
  {
    n: 8, date: '10/31（六）', city: '華沙 → 杜哈',
    title: '機場日 · 14:40 QR 260 起飛',
    headline: '早上散步採點後收尾 · SKM 機場線約 25–30 分鐘，另留候車與找月台時間',
    tag: 'Departure',
    intensity: '中',
    hardConstraints: ['08:00 無名塚衛兵交接（每整點換崗）', '09:45 退房、10:05 出門', '11:00 前抵達華沙蕭邦機場', '早上只排戶外散步與早餐、不進館'],
    compressible: ['累了就把劇院廣場刪掉'],
    steps: [
      {t:'07:20', label:'從 Metropol 沿 Marszałkowska 往北', sub:'往北步行約 1.4 km 到薩克森花園西口', dur:'20 min'},
      {t:'07:40', label:'從西口進薩克森花園往東穿過', sub:'往東穿過花園約 0.5 km 到無名塚', dur:'15 min'},
      {t:'07:55', label:'抵無名塚', sub:'提早等候 08:00 衛兵交接', dur:'5 min'},
      {t:'08:00', label:'★ 無名塚衛兵交接', sub:'plac Piłsudskiego，衛兵每整點換崗', dur:'5 min'},
      {t:'08:10', label:'劇院廣場', sub:'從無名塚步行約 5 分／340 m 看大劇院外觀；累了就把劇院廣場刪掉', dur:'5 min'},
      {t:'08:15', label:'往東南步行約 1.4 km 到 Zgoda 3', sub:'早餐店週六 08:00 開門', dur:'20 min'},
      {t:'08:35', id:'d8-breakfast', label:'早餐 · Bułkę przez Bibułkę', sub:'Zgoda 3，週六 08:00 開門；09:05 結帳，客滿改外帶', dur:'30 min'},
      {t:'09:10', id:'d8-dessert', label:'Blikle 買甜甜圈', sub:'Nowy Świat 33，09:00 開門；早餐後外帶 pączek；有目錄寫 10:00 開門，沒開就略過', dur:'10 min'},
      {t:'09:20', label:'棕櫚樹圓環', sub:'Rondo de Gaulle\'a，人造棕櫚樹快拍後步行約 10 分回 Metropol', dur:'5 min'},
      {t:'09:35', label:'回 Metropol、整理行李', sub:'行李前一晚已整理，確認護照、行李與退稅文件', dur:'10 min'},
      {t:'09:45', label:'辦理退房', sub:'確認行李、護照、退稅文件帶齊', dur:'20 min'},
      {t:'10:05', label:'出門 → Śródmieście（S2）或 Warszawa Centralna（S3）', sub:'以飯店旁約 250 m 的 Śródmieście 搭 S2 為主，若 S3 較早才改 Centralna；預留找月台時間', dur:'25 min'},
      {t:'10:30', label:'SKM S2／S3 目標班次', sub:'回程往機場方向：S2 由 Warszawa Śródmieście 上車、S3 由 Warszawa Centralna 上車（兩線停靠站不同，看清楚再上）。官方標示 75 分鐘第 1 區票；SKM 10 月班表未查證，需前一晚用 Jakdojade 確認 Śródmieście 往機場 S2 的確切時刻；錯過一班約晚 30 分，仍約 11:30 到機場', cost:'75 分第 1 區票 4.40', dur:'約 25–30 min'},
      {t:'11:00', label:'抵 Chopin 第一航廈', sub:'有退稅商品一到機場先處理退稅'},
      {t:'11:15', label:'退稅文件 + 報到 + 安檢', sub:'如有 TAX FREE 商品，依機場與電子文件指示辦理；託運商品須在交運前備妥供海關查驗', dur:'預留至少 60–90 min'},
      {t:'安檢與出境後', timingMode:'relative', id:'d8-lunch', label:'機場午餐 · 依登機區選擇', sub:'先確認登機門與截止時間，再找可通行區域內的餐廳；QR 260 往杜哈不把申根區 Gate One 當作主選'},
      {t:'14:40', label:'★ QR 260 起飛', sub:'WAW → DOH → HKG → TPE'},
      {t:'機上', timingMode:'relative', id:'d8-dinner', label:'機上晚餐', sub:'依實際航段供餐；轉機時先確認下一段登機門與截止'},
    ],
    eat: [],
    backup: [
      {label:'早餐備案', where:'Warszawa Centralna 車站內當日營業的咖啡或麵包店', map:'https://www.google.com/maps/search/?api=1&query=Warszawa%20Centralna%20coffee%20bakery', why:'Zgoda 3 客滿時，退房後往 Centralna 搭 S3 的沿線；店家和週六開門時間尚未指定，前一晚確認。Bar Mleczny Prasowy（Marszałkowska 10/16）週六 09:00 才開且不順路，不列為早餐備案'},
      {label:'班機提早 2 h', where:'蕭邦機場 1F Costa Coffee · 觀景窗', map:'https://www.google.com/maps/search/?api=1&query=Warsaw%20Chopin%20Airport%20Terminal%20A', why:'退稅 + 安檢順可能 12:30 就過關，1F 貴賓區外有平價咖啡'},
      {label:'紀念品最後採買', where:'10/29 或 10/30 晚上在 Złote Tarasy 買齊，機場店作最後備案', why:'10/31 早上保留散步、早餐與退房時間'},
    ],
  },
];

export const flights = {
  out: [
    {code:'HX 283',  leg:'TPE → HKG', when:'10/24 六 21:45 → 23:45', dur:'2h00m', status:'已購票'},
    {code:'⇄ HKG',   leg:'轉機',       when:'1h40m', dur:'', layover:true},
    {code:'QR 815',  leg:'HKG → DOH', when:'10/25 日 01:25 → 04:50', dur:'8h25m', status:'已購票'},
    {code:'⇄ DOH',   leg:'轉機',       when:'4h20m', dur:'', layover:true},
    {code:'QR 259',  leg:'DOH → WAW', when:'10/25 日 09:10 → 13:10', dur:'6h00m', status:'已購票'},
  ],
  back: [
    {code:'QR 260',  leg:'WAW → DOH', when:'10/31 六 14:40 → 22:10', dur:'5h30m', status:'已購票'},
    {code:'⇄ DOH',   leg:'轉機',       when:'3h45m', dur:'', layover:true},
    {code:'QR 818',  leg:'DOH → HKG', when:'11/1 日 01:55 → 14:50', dur:'7h55m', status:'已購票'},
    {code:'⇄ HKG',   leg:'轉機',       when:'4h50m', dur:'', layover:true},
    {code:'BR 872',  leg:'HKG → TPE', when:'11/1 日 19:40 → 21:25', dur:'1h45m', status:'已購票'},
  ],
};

export const stay = [
  {
    id:'warsaw-metropol-arrival', city:'華沙', name:'Hotel Metropol', itineraryActive:false,
    checkIn:'2026-10-24', checkOut:'2026-10-25', checkInTime:'15:00', checkOutTime:'12:00', nights:1,
    address:'ul. Marszałkowska 99a, 00-693 Warszawa', addressVerified:true, rooms:1, status:'已通知飯店（不入住、不退款）',
    coordinates:{lat:52.22901, lng:21.01099, status:'已核對', checkedAt:'2026-08-11'},
    officialUrl:'https://www.hotelmetropol.com.pl/pl/',
    note:'原 10/24 訂單保留紀錄；去程改為 10/25 抵達後直接往克拉科夫。10/24 這晚因航班改期不入住，已通知飯店；不退款（旅客 10/24 確認）。位置在 Marszałkowska／Metro Centrum 出口正對面，步行至 Warszawa Centralna 約 500 公尺；入住 15:00 起、退房 12:00 前，櫃檯可寄放行李。',
  },
  {
    id:'krakow-stare-miasto', city:'克拉科夫', name:'ibis budget Krakow Stare Miasto',
    checkIn:'2026-10-25', checkOut:'2026-10-27', checkInTime:'15:00', checkOutTime:'12:00', nights:2,
    address:'ul. Pawia 11, 31-154 Kraków', addressVerified:true, rooms:1, status:'已確認',
    coordinates:{lat:50.07075, lng:19.946163, status:'已核對', checkedAt:'2026-08-11'},
    officialUrl:'https://all.accor.com/hotel/7165/index.en.shtml',
    note:'位於 Kraków Główny 與 Galeria Krakowska 旁。10/06 官網確認入住 15:00 起、退房 12:00 前，提供寄物服務；私人訂房約定仍以確認信為準。',
  },
  {
    id:'wroclaw-piast', city:'樂斯拉夫', name:'Piast',
    checkIn:'2026-10-27', checkOut:'2026-10-28', checkInTime:'14:00', checkOutTime:'12:00', nights:1,
    address:'Piłsudskiego 98, Wrocław', addressVerified:true, rooms:1, status:'已確認',
    coordinates:{lat:51.10013, lng:17.03569, status:'已核對', checkedAt:'2026-08-11'},
    officialUrl:'https://piastwroclaw.pl/',
    note:'住宿訂單已確認，門牌 Piłsudskiego 98 已核對。',
  },
  {
    id:'poznan-towarowa', city:'波茲南', name:'Poznan Apartments Towarowa',
    checkIn:'2026-10-28', checkOut:'2026-10-29', checkInTime:'15:00', checkOutTime:'11:00', nights:1,
    address:'Towarowa 37/201, 61-896 Poznań', addressVerified:true, rooms:1, status:'已確認',
    coordinates:{lat:52.403903, lng:16.915609, status:'接待處座標已核對', checkedAt:'2026-08-11'},
    officialUrl:'https://www.poznanapartments.com/kontakt',
    note:'此處為官方接待與取鑰匙地址；實際公寓門牌以私人訂房確認為準。',
  },
  {
    id:'warsaw-metropol', city:'華沙', name:'Hotel Metropol',
    checkIn:'2026-10-29', checkOut:'2026-10-31', checkInTime:'15:00', checkOutTime:'12:00', nights:2,
    address:'ul. Marszałkowska 99a, 00-693 Warszawa', addressVerified:true, rooms:1, status:'已確認',
    coordinates:{lat:52.22901, lng:21.01099, status:'已核對', checkedAt:'2026-08-11'},
    officialUrl:'https://www.hotelmetropol.com.pl/pl/',
    note:'10/29–10/31 華沙住宿照常入住；10/24 這晚因航班改期不入住，已通知飯店；不退款（旅客 10/24 確認）。10/29 EIC 8104 抵 Warszawa Centralna 後步行約 500 公尺即到；10/31 退房 12:00 前，當日 10:05 出門搭機不受影響。',
  },
];

// trains[] 的正本已搬到 rail.js 的 segments（補了 id／day／from／to 等欄位）；
// 這裡原樣重新匯出，既有的 import { trains } from './trip.js' 都不用改。
export { segments as trains };

export const railOfficialLinks = [
  {
    name: 'PKP Intercity 官方購票',
    url: 'https://ebilet.intercity.pl/',
    note: '購買 EIP、EIC、IC、TLK 長途列車票；本行程四段城際車以此為主要購票入口。',
  },
  {
    name: 'Passenger Portal 官方時刻表',
    url: 'https://portalpasazera.pl/en/',
    note: '查全波蘭列車班次、停靠站、即時延誤與月台；月台仍以當日站內電子牌為準。',
  },
  {
    name: 'PKP Intercity 官方 App（iPhone／iPad）',
    url: 'https://apps.apple.com/pl/app/pkp-intercity-kupuj-bilety/id1500848669',
    note: '可購買 PKP Intercity 各車種、選位並離線開啟已購票券。',
  },
  { name: 'Lajkonik 線上售票規則 §4', url: 'https://www.lajkonikbus.pl/regulamin-bilet-on-line.html', note: '線上退票規則；與運送規章不同時，以業者運送規章為準。' },
  { name: 'Lajkonik 運送規章 §6', url: 'https://www.lajkonikbus.pl/regulamin.html', note: '發車 24 小時前申請可退，扣 20%；電子票不能改期，只能退票重買。' },
  {
    name: 'Lajkonik 官方售票網站（lajkonikbus.pl）',
    url: 'https://www.lajkonikbus.pl/',
    note: '由官方售票頁確認為現行網域（專案先前使用的舊網域已全面更新）。首頁即為查詢表單，可切換 English，另有 Where is my bus?（即時車輛位置）與 My Ticket（查已購票）。Auschwitz 往返請用下方「Auschwitz 巴士」區塊的查詢參數操作。',
  },
  {
    name: 'Moj Bus 售票網站（moj-bus.pl）',
    url: 'https://moj-bus.pl/en',
    note: 'Lajkonik 線上售票平台，本次去回程皆已購；查票或另買 16:30 備案時用這裡。⚠️ 班次、票價與上下車點請出發前自行於該站確認——尤其要確認停靠的是博物館門口還是 Oświęcim 市區站。',
  },
];

// auschwitzBus 的正本已搬到 rail.js（segments 的 Lajkonik 段也從這裡推導）；
// 這裡原樣重新匯出，既有的 import { auschwitzBus } from './trip.js' 都不用改。
export { auschwitzBus };

export const railPurchaseSteps = [
  {
    title: '先用官方時刻表找直達班次',
    detail: '在 Passenger Portal 輸入出發站、抵達站、日期與目標時間，勾選 Direct connections。四段起點依序使用 Warszawa Zachodnia、Kraków Główny、Wrocław Główny、Poznań Główny；已購四段仍以票面站名為準。',
  },
  {
    title: '逐張核對 PKP App 已購車票',
    detail: '10/25 EIP 1306、10/27 IC 3830、10/28 IC 260、10/29 EIC 8104 均已在旅客 App 票券清單；請逐張開啟票券詳細頁，核對車廂、座位與金額涵蓋人數，並保存離線副本。',
  },
  {
    title: '選車種、艙等與正確優惠資格',
    detail: '優先選直達 EIP／EIC／IC／TLK，依實際抵達時間與預算決定。沒有符合波蘭法定優惠資格就選一般成人票，不自行套用學生或年齡折扣。',
  },
  {
    title: '確認座位與旅客資料再付款',
    detail: '4 段火車都已買好（其中 2 段是 1 等）；車廂與座位看 PKP App 完整票券，出發前確認票券已存離線。',
  },
  {
    title: '下載 PDF 並保存離線副本',
    detail: '付款成功後立即下載票券 PDF，另存到手機離線資料夾；每一段都記錄車次、車廂、座位與取消／改票條件。',
  },
  {
    title: '搭車前再查月台與異動',
    detail: '前一晚與到站後用 Passenger Portal 查看延誤或改道，進站仍以電子看板為準；至少提早 20–30 分鐘抵達大站。',
  },
];

export const bookingTiers = [
  {tier:'第一優先', note:`四段城際火車、Auschwitz 導覽、Lajkonik 去回程與鹽礦已訂妥；回程巴士${lajkonikInboundOpen ? '依售票頁確認座位' : lajkonikInboundState}`, items:[
    {name:'Auschwitz 官方英文導覽（10/26 10:30 已訂妥）', url:ticketPurchaseById('krakow-auschwitz').purchaseUrl},
    {name:'Wieliczka 鹽礦英文團（10/27 09:00 已購票）', url:ticketPurchaseById('krakow-wieliczka').purchaseUrl},
    {name:`Lajkonik 巴士（去程 ${lajkonikOutboundAdopted.dep} → ${lajkonikOutboundAdopted.arr} 已購票；回程 ${lajkonikInboundAdopted.dep} → ${lajkonikInboundAdopted.arr} ${lajkonikInboundState}）`, url:'https://www.lajkonikbus.pl/'},
    {name:'華沙 → 克拉科夫 EIP 1306（已購票；座位見車票）', url:'https://www.intercity.pl/en/'},
    {name:'克拉科夫 → 樂斯拉夫 IC 3830（已購票；車廂座位看完整票券）', url:'https://www.intercity.pl/en/'},
    {name:'樂斯拉夫 → 波茲南 IC 260（已購票；車廂座位看完整票券）', url:'https://www.intercity.pl/en/'},
    {name:'波茲南 → 華沙 EIC 8104（已購票；車廂座位看完整票券）', url:'https://www.intercity.pl/en/'},
  ]},
  {tier:'第二優先', note:'10/25 改為 18:12 抵克拉科夫，辛德勒與 Wawel 不再排當天現場試票；保留城市延伸參考', items:[
    {name:'辛德勒工廠（改班後 10/25 不排入；僅留購票參考）', url:ticketPurchaseById('krakow-schindler').purchaseUrl},
    {name:'Wawel 城堡（改班後 10/25 不排入；僅留購票參考）', url:ticketPurchaseById('krakow-wawel-castle').purchaseUrl},
  ]},
  {tier:'餐廳與備案', note:'Soul Kitchen 10/30 18:00 已訂妥；Mr. Jerry 10/26 18:00 已訂位（2 位、無訂金）；Beef Wellington 無法預點，到店再點；其餘保留現場入座決定，改班後 Specjały 與 Pimiento 原時段不排入', items:[
    {name:'Mr. Jerry 10/26 18:00（已訂位）', url:'https://www.mrjerry.pl/rezerwacja-krakow/'},
    {name:"Soul Kitchen 10/30 18:00–20:00（已訂妥，2 人；保留 15 分鐘，已註記 1 份威靈頓）", url:"https://soulkitchen.pl/"},
    {name:'Hankki 10/25 19:15（不訂位，現場入座）', url:'https://mojstolik.pl/restauracja/Hankki/f733c19bc164a5ad85848d96dc851be9'},
    {name:'Specjały Regionalne（改班後原時段不排入）', url:'https://www.thefork.com/restaurant/specjaly-regionalne-restauracja-polska-stare-miasto-r858538'},
    {name:'Pimiento（改班後原午餐時段不排入）', url:'https://pimiento.pl/stary-kleparz/'},
    {name:'Manekin 10/29 11:00 早餐（出發前再確認）', url:'https://manekin.pl/'},
    {name:'Restauracja Wrocławska 10/28 12:00 兩位（現場候位）', url:'https://restauracja-wroclawska.eatbu.com/?lang=en'},
  ]},
];

export const reservations = [
  {when:'✅ 已完成', what:'Auschwitz 英文官方導覽 — 10/26 10:30 個人 educator 導覽（約 3 小時 45 分，2 人）已訂妥。入場憑電子入場證＋證件，出發前存離線。'},
  {when:'✅ 已完成', what:'Wieliczka 鹽礦英文 Tourist Route — 10/27 09:00 已購票（付款）；票券 PDF 存離線，訂單編號只存私人資料。'},
  {when:'✅ 去回程已購', what:`Lajkonik 巴士 10/26 ${lajkonikOutboundAdopted.dep} → ${lajkonikOutboundAdopted.arr} 已購 2 張全票；回程 ${lajkonikInboundAdopted.dep} ${lajkonikInboundState}。`},
  {when:'✅ 已訂位', what:"Soul Kitchen 10/30 18:00–20:00、2 位已訂位，保留 15 分鐘，已註記 1 份威靈頓；Mr. Jerry 10/26 18:00 已訂位（2 位、無訂金）；Beef Wellington 無法預點，到店再點。"},
  {when:'不訂位', what:'其餘餐廳現場入座；10/24 Specjały 與 10/25 Pimiento 因改班不再排入原時段。'},
  {when:'火車票：已購 4／4 段', what:"10/22 截圖確認：10/25 EIP 1306 西站 15:45–18:12（1 等）、10/27 IC 3830 16:45–19:50（1 等）、10/28 IC 260 19:10–20:29（2 等）、10/29 EIC 8104 17:40–19:59（2 等）。EIP 1306 座位見車票；截圖金額見各段交通卡，其餘車次車廂、座位與金額涵蓋人數看完整票券。"},
  {when:'不用訂了', what:'新行程付費景點只在外面拍照：樂斯拉夫全景畫、華沙起義博物館、華沙皇家城堡都不用買票；華沙水上宮殿週五免費，照樣可以進去。'},
  {when:'之後傳訊息', what:'Poznan Apartments：確認約 20:45 抵達取鑰匙（接待到 22:00，出發前再確認）；10/29 使用 Poznań Główny 車站置物櫃'},
  {when:'出發前 1 週', what:'臨時活動與維修可能變動，出門前看一下官網公告'},
  {when:"改班後調整", what:"10/25 18:12 才抵克拉科夫，Wawel、瓦維爾大教堂、辛德勒與 Pimiento 午餐不再排入當天行程，也不再安排現場試票。"},
];

// 訂票與查核的行動截止日。
//
// 尚未購票的城際火車不列在這裡——它的開賣日已經是 trains[].saleOpens，
// 重抄一次就會有兩份各自漂移的事實；改由 collectDeadlines() 於建置時併入。
//
// basis 記錄每個日期的來源：官方公告的照抄，由既有規則推算的寫明怎麼算的。
// 沒有來源基礎的日期不要放進這張表，倒數看板會讓它看起來像官方期限。
//
// status 欄不手寫：有 todoRef 的項目由待辦正本（todoGroups）推導，見 lib/todo-status.mjs 的
// withDerivedStatus。要改「已訂／未訂」只改 todoGroups 那一處；這裡的 status 值為 null 占位。
export const deadlines = withDerivedStatus([
  {
    id: 'dining-michelin', date: '2026-10-20', category: '餐飲',
    title: '餐廳狀態：Soul Kitchen 與 Mr. Jerry 已訂位，其餘現場入座',
    action: 'Soul Kitchen 10/30 18:00–20:00 已訂妥，2 人，保留 15 分鐘，店家已註記 1 份威靈頓；Mr. Jerry 10/26 18:00 已訂位，其餘維持現場入座。Specjały 與 Pimiento 原時段因改班不排入。',
    status: null, todoRef: {group:'dining', nameIncludes:['Specjały','Pimiento','Hankki','Mr. Jerry','Manekin','Soul Kitchen']},
    url: 'https://www.mrjerry.pl/rezerwacja-krakow/',
    basis: '行前提醒「熱門餐廳出發前 3–4 週訂」，原取下緣 3 週（10/02）已過；依改排後的每日晚餐更新店名，補上待辦頁已列的兩家午餐訂位；因 10/02 已過、仍有 6 項未訂，原以 10/23 出發回推 10/19；本次改班後以 10/24 重算為 10/20。10/22 依確認信完成 Soul Kitchen，其他維持現場入座。',
  },
  {
    id: 'ticket-wieliczka', date: '2026-10-03', category: '門票',
    title: 'Wieliczka 鹽礦 10/27 英語團',
    action: '10/27 09:00 英文 Tourist Route；票券 PDF 存離線，訂單編號只存私人資料。',
    status: null, todoRef: {group:'attractions', ticketPurchaseIds:['krakow-wieliczka']}, url: ticketPurchaseById('krakow-wieliczka').purchaseUrl,
    basis: '訂票優先順序列為第一優先「現在即可訂」；原以 10/23 回推 10/02；改班後以 10/24 重算為 10/03（出發前 3 週），此項已付款，僅保留紀錄。',
  },
  {
    id: 'ticket-st-anne-tower', date: '2026-10-22', category: '門票',
    title: '聖安妮教堂觀景台是否重新開放',
    action: '2026-10-22 已複查：仍暫停開放、沒有重新開放公告，Day 7 維持只拍外觀；當天現場看到已開放才考慮延伸行程的登塔。',
    status: null, todoRef: {group:'attractions', ticketPurchaseIds:['warsaw-st-anne-tower']}, url: 'https://swanna.waw.pl/zwiedzanie/',
    basis: '教區官網 2026-10-21 讀取：觀景台 10 月上旬起整修暫停開放、直到另行公告；2026-10-22 複查觀景台官網 taraswidokowy.pl 公告 07.10.2026 起至另行通知不開放（整修），無重新開放消息。',
  },
  {
    id: 'bus-lajkonik', date: '2026-10-22', category: '交通',
    title: 'Lajkonik 回程巴士購票',
    action: `回程${lajkonikInboundState}：15:30 → 16:55，2 張全票 47,50 zł；15:15 前到站牌。16:30 備案需另買新票。退票規則見『訂票與交通』頁。`,
    status: null, todoRef: {group:'rail', nameIncludes:['Lajkonik 回程']}, url: 'https://www.lajkonikbus.pl/',
    basis: '去回程皆已購票，recheckAt 為 null。',
  },
], todoGroups);
