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
    id: 'rail', title: '城際交通', eyebrow: 'Rail · 6 項',
    intro: null, // 由 railGroupIntro(todoGroupsRaw) 依 Lajkonik 回程那筆的狀態推導，見下方 todoGroups
    items: [
      {checkedAt:'2026-09-28', recheckAt:null, date:'10/25', name:'EIP 5300｜Warszawa Centralna → Kraków Główny', status:'已購票', action:'App 票券清單顯示 08:40 發車；開啟票券詳細頁核對抵達時間、艙等、車廂、座位並存離線。', url:'https://www.intercity.pl/en/'},
      {checkedAt:'2026-10-13', recheckAt:null, date:'10/26', name:`Lajkonik 去程 ${lajkonikOutboundAdopted.dep} 克拉科夫 → Auschwitz`, status:'已購票', action:`已在 moj-bus.pl 購得 2 張全票（線上總價 ${auschwitzBus.outbound.booked.total}）：${lajkonikOutboundAdopted.dep} 由 Kraków MDA（ul. Bosacka 18）下層 D9 站位發車、${lajkonikOutboundAdopted.arr} 抵 Więźniów Oświęcimia 55。業者要求發車前 15 分鐘到站牌，上車出示列印票或手機票（螢幕至少 4 吋）。距 10:00 到場要求只剩 10 分鐘，想多留緩衝可在票券管理頁改成 ${lajkonikOutboundRejected.dep}。票號與票券管理連結只存私人資料。`, url:'https://moj-bus.pl/en'},
      {checkedAt:'2026-10-14', recheckAt:'2026-10-22', date:'10/26', name:`Lajkonik 回程 ${lajkonikInboundAdopted.dep} Auschwitz → 克拉科夫`, status:'尚未購票', action:`導覽約 14:15 結束，買 ${lajkonikInboundAdopted.dep}（Więźniów Oświęcimia 55）→ ${lajkonikInboundAdopted.arr} 抵 Kraków MDA；導覽延後的備案為 ${lajkonikInboundBackup.dep} → ${lajkonikInboundBackup.arr}。可在去程同一個平台 moj-bus.pl 線上買，或當天上車向司機買（司機售票全票 27 zł）；10/26 已開賣、全票仍 25 zł，發車前 12 小時以前可免費退改；付款前再看一次售票頁。`, url:'https://www.lajkonikbus.pl/'},
      {checkedAt:'2026-09-28', recheckAt:null, date:'10/27', name:'IC 3830｜Kraków Główny → Wrocław Główny', status:'已購票', action:'App 票券清單顯示 16:45 發車；開啟票券詳細頁核對抵達時間、艙等、車廂、座位。15:00 結束 Kazimierz，16:10 前到站。', url:'https://www.intercity.pl/en/'},
      {checkedAt:'2026-09-28', recheckAt:null, date:'10/28', name:'IC 260｜Wrocław Główny → Poznań Główny', status:'已購票', action:'App 票券清單顯示 19:10 發車；核對抵達時間、艙等、車廂、座位，並確認公寓晚間取鑰匙方式。', url:'https://www.intercity.pl/en/'},
      {checkedAt:'2026-10-06', recheckAt:null, date:'10/29', name:'EIC 8104｜Poznań Główny → Warszawa Centralna', status:'已購票', action:'App 票券清單顯示 17:40 發車；開啟票券詳細頁核對抵達時間、艙等、車廂、座位及票價並存離線。17:05 前到站。', url:'https://www.intercity.pl/en/'},
    ],
  },
  {
    id: 'attractions', title: '主要景點', eyebrow: 'Tickets · 4 項',
    intro: '指定日期的場次與庫存會變動；付款完成後請下載離線票券並核對入場時間。新行程付費景點只在外面拍照：樂斯拉夫全景畫、華沙起義博物館、華沙皇家城堡不用訂了。',
    items: [
      {checkedAt:'2026-10-13', recheckAt:null, skip:true, date:'10/25', ticketPurchaseId:'krakow-wawel-castle', name:'Wawel 城堡 15:15', status:'線上已售完', action:'旅客回報 10/25 線上已訂不到，不再提醒。仍排在 Day 2 行程：15:15 到 Wawel 售票處問當日剩餘的短路線（王冠寶庫、Castle Underground 或 Armoury）；有沒有現場票以當天售票處為準，買不到就只逛免費的山丘庭院與外觀，16:15 前離開。', url:ticketPurchaseById('krakow-wawel-castle').purchaseUrl},
      {checkedAt:'2026-10-13', recheckAt:null, skip:true, date:'10/25', ticketPurchaseId:'krakow-schindler', name:'辛德勒工廠 17:30', status:'線上已售完', action:'旅客回報 10/25 線上已訂不到，不再提醒。仍排在 Day 2 行程：17:10 前到入口，向現場售票處問當日剩餘入場時段（最後入場 18:30）；有沒有現場票以當天為準，買不到就在外觀與 Zabłocie 一帶短停，提早往 Hankki 晚餐。', url:ticketPurchaseById('krakow-schindler').purchaseUrl},
      {checkedAt:'2026-09-09', recheckAt:null, date:'10/26', ticketPurchaseId:'krakow-auschwitz', name:'Auschwitz 英文官方導覽 10:30', status:'已訂妥', action:'10:30 個人 educator 導覽（英文），官方標示約 3 小時 45 分，2 人。電子入場證存離線，入場須同時出示證件。', url:ticketPurchaseById('krakow-auschwitz').purchaseUrl},
      {checkedAt:'2026-10-13', recheckAt:null, date:'10/27', ticketPurchaseId:'krakow-wieliczka', name:'Wieliczka 鹽礦英文團 09:00', status:'已購票', action:'已付款：10/27 09:00 英文 Tourist Route（Individual tour）。票券 PDF 隨確認信附上，存離線；訂單與預約編號只存私人資料。原規劃 10:00 場，提早一小時後 Day 4 早上已往前調。', url:ticketPurchaseById('krakow-wieliczka').purchaseUrl},
    ],
  },
  {
    id: 'dining', title: '餐飲訂位', eyebrow: 'Dining · 9 項',
    intro: '餐廳營業與臨時包場以店家訂位頁公告為準。',
    items: [
      {checkedAt:'2026-10-13', recheckAt:'2026-10-22', date:'10/24', name:'Specjały Regionalne 18:30 晚餐', status:'尚未訂位', action:'時段以店家卡為準（品牌門市頁週五、週六 11:30–23:00；polishcuisine.pl 列 12:00–23:30），10/24 18:30 兩個版本都有營業。訂位只訂 18:30 一個時間；提早到可問能不能先入座。抵達日不想排隊就先在 TheFork 訂位：https://www.thefork.com/restaurant/specjaly-regionalne-restauracja-polska-stare-miasto-r858538', url:'https://www.google.com/maps/search/?api=1&query=Specja%C5%82y%20Regionalne%20Nowy%20%C5%9Awiat%2044%2C%20Warszawa'},
      {checkedAt:'2026-10-13', recheckAt:'2026-10-22', date:'10/25', name:'Pimiento 13:00 午餐', status:'尚未訂位', action:'Świętego Filipa 21，午餐菜單 13:00 起才供應，週日只開到 15:00，沒訂到可能吃不到午餐菜單。用官網 https://pimiento.pl/stary-kleparz/ 的聯絡表單或 Email pimiento@pimiento.pl 寄信訂 10/25 13:00 兩位（官網線上訂位只涵蓋 Kazimierz 與 Stare Miasto 店），以回信為準；沒回信就請 Hotel Metropol 櫃檯代訂；訂不到改 Hotel Polonia 餐廳。', url:'https://pimiento.pl/stary-kleparz/'},
      {checkedAt:'2026-10-13', recheckAt:'2026-10-22', date:'10/25', name:'Hankki 19:15 晚餐', status:'尚未訂位', action:' Michelin 與 MojStolik：週日 13:00–21:00，19:15 在營業時間內；最後點餐時間查不到。建議用 MojStolik 線上訂位（https://mojstolik.pl/restauracja/Hankki/f733c19bc164a5ad85848d96dc851be9），訂不到改 MOLÁM 或 NOAH。', url:'https://guide.michelin.com/mx/es/lesser-poland/krakow/restaurante/hankki'},
      {checkedAt:'2026-10-13', recheckAt:'2026-10-22', date:'10/26', name:'Mr. Jerry 18:30 晚餐（Beef Wellington）', status:'尚未訂位', action:'奧斯威辛返城後的晚餐。官網確認 Jagiellońska 5 與招牌 Beef Wellington，週一 15:00–22:00（多數目錄一致，官網各區塊矛盾），價格未公開；在官網訂位頁線上訂，備註欄請店家預留 10/26 的 Beef Wellington。訂不到改 Pod Aniołami（每日 13:00–23:00）；FOLGA 週一可能休息，要去先看 Google 地圖當日營業狀態。', url:'https://www.mrjerry.pl/rezerwacja-krakow/'},
      {checkedAt:'2026-10-13', recheckAt:'2026-10-22', date:'10/27', name:'Bistro Posolone 出礦後午餐', status:'待確認營業', action:'位於鹽礦園區 Park Kingi 6，官方寫「每天依鹽礦開放時間」（約 08:00–18:00），確切時刻未查到。菜單有披薩、漢堡、湯、沙拉、薯條，30 分鐘內吃完就點湯、沙拉或漢堡，才趕得上返回車站與 16:45 IC 3830；當天出礦時現場看有沒有開，來不及改自備餐。', url:'https://www.google.com/maps/search/?api=1&query=Bistro%20Posolone%2C%20Wieliczka'},
      {checkedAt:'2026-10-14', recheckAt:null, date:'10/28', name:'Restauracja Wrocławska 12:00 午餐（選配）', status:'尚未訂位（選配）', action:'選配：先訂可以省掉排隊時間。Szewska 59/60，每日 12:00 開門；入座就點餐（主菜現做約 30 分鐘），13:10 前離開去百年廳。想訂就用官網留言或請 Piast 櫃檯代訂；不訂就 12:00 開門直接去。', url:'https://restauracja-wroclawska.eatbu.com/?lang=en'},
      {checkedAt:'2026-10-13', recheckAt:'2026-10-22', date:'10/29', name:'Carla Trattoria Moderna 14:00 午餐', status:'尚未訂位', action:'在 zjedz.my 訂 10/29 14:00 兩位（https://zjedz.my/carla-trattoria-moderna）。週四 14:00 才開門（Google 地圖與 zjedz.my 一致，menu.pl 外送時段到 21:30），12:30 吃不到。15:15 前結帳，上菜慢就把帝王區縮短到只看帝王城堡外觀，先保 17:05 到站；近期有評論說上菜偏慢。訂不到改 Pyra Bar 或 Zen On，中午 12:15 吃午餐。', url:'https://zjedz.my/carla-trattoria-moderna'},
      {checkedAt:'2026-10-13', recheckAt:'2026-10-22', date:'10/29', name:'Arirang 晚餐', status:'待確認營業', action:'10/29 晚餐首選，19:59（Koleo）抵華沙。Yelp 與多個目錄週四 12:00–22:00，沒有店家官網，最後點餐時間與線上訂位都未查到。當天打 22 881 78 51 或 22 622 18 86 問，21:00 到店、21:15 前能入座才去，否則改 Złote Tarasy 內快食或 24 小時的 Ćma。', url:'https://www.google.com/maps/search/?api=1&query=Arirang%20Restaurant%20Nowogrodzka%2038%2C%20Warszawa'},
      {checkedAt:'2026-10-13', recheckAt:'2026-10-22', date:'10/30', name:'華沙最後晚餐 · Soul Kitchen 18:30（威靈頓）', status:'尚未訂位', action:'Nowogrodzka 18A，Metropol 步行約 8 分。用 Google 地圖或店家網站的線上訂位訂 10/30（週五）18:30、2 人，備註請店家預留 Beef Wellington；沒有線上管道就請 Hotel Metropol 櫃檯代訂。菜單隨季節換，官方菜單未確認，沒供應就改訂 Rusiko（Wierzbowa 11，週二至週六 13:00–24:00）。另一間威靈頓評價高的 Primitivo（Waliców 13，週五至 23:00）在 Wola，離晚上動線較遠。', url:'https://restaurantguru.com/Soul-Kitchen-Warsaw'},
    ],
  },
  {
    id: 'prep', title: '出發前準備', eyebrow: 'Prep · 2 項',
    intro: '新行程的出發前待辦：用訊息確認波茲南公寓，手機先裝好交通 App。',
    items: [
      {checkedAt:'2026-10-14', recheckAt:'2026-10-22', date:'10/28', name:'傳訊息給 Poznan Apartments', status:'待確認', action:'出發前用訂房平台的訊息功能或 Email 問兩件事：① 10/28 晚上 20:29（Koleo ）抵達 Poznań Główny 後怎麼拿鑰匙；② 10/29 早上 07:00 退房時接待處開了沒、能不能寄放行李到 16:15。官網聯絡頁沒寫接待時間和行李寄放。不能寄就改用 Poznań Główny 車站的寄物櫃（位置和空位當天再看）。', url:'https://www.poznanapartments.com/kontakt'},
      {checkedAt:'2026-10-14', recheckAt:'2026-10-22', date:'10/24', name:'手機安裝 Jakdojade 與 Bolt', status:'尚未安裝', action:'Jakdojade 查三座城市的電車、地鐵路線並買車票；Bolt 叫車（10/29 早上 Cytadela → Rondo Śródka、雨天或天黑時用）。出發前在台灣先裝好、登入並綁好付款方式。', url:'https://jakdojade.pl/'},
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
  dateRange: '2026 / 10 / 24 — 10 / 31',
  flightDateRange: '2026 / 10 / 23 — 11 / 01',
  travelStart: '2026-10-23',
  tripStart: '2026-10-24',
  tripEnd: '2026-10-31',
  timeZone: 'Europe/Warsaw',
  nights: 7, days: 8,
  route: '華沙 → 克拉科夫 → 樂斯拉夫 → 波茲南 → 華沙',
};

export const days = [
  {
    n: 1, date: '10/24 (六)', city: '華沙',
    title: '抵達華沙 · 皇家大道到總統府，晚上金色梯田',
    headline: '13:30 抵蕭邦機場，換匯後從棕櫚樹圓環沿皇家大道採點到總統府看日落，E.Wedel 熱巧克力後折返晚餐，晚上逛 Złote Tarasy 與車站 Biedronka',
    tag: 'Arrival',
    intensity: '中',
    hardConstraints: ['首次 EES 入境登錄與提行李時間不保證；入境排太久就從哥白尼紀念碑開始走，E.Wedel 改外帶或略過', '換匯用週六有開的 REDAR 分店 II（營業時間見下方實用資訊），不要等 Hotel Metropol 樓下的總店', '付費景點只在外面拍照；這天走到總統府旁的 E.Wedel 就折返，城堡廣場與老城留到 10/30', '18:30 Specjały Regionalne 晚餐（訂位時間）', '21:45 前回到飯店'],
    compressible: ['E.Wedel 熱巧克力（改外帶或略過）', '訪親會教堂、Czapski 宮等小站只拍不停', 'Złote Tarasy 逛街時間'],
    steps: [
      {t:'機上', timingMode:'relative', id:'d1-breakfast', label:'機上早餐／出發前自理', sub:'依實際航段供餐'},
      {t:'抵達前後', timingMode:'relative', id:'d1-lunch', label:'機上、機場或抵達後輕食', sub:'三明治與熱飲即可，依落地及入住情況調整'},
      {t:'13:30', label:'抵蕭邦機場', sub:'申根入境、EES 首次護照／指紋與臉部登錄 + 提行李約 75 min（規劃估計）；排隊延長即順延進城，改從哥白尼紀念碑開始走、E.Wedel 改外帶', cost:'—', dur:'75 min'},
      {t:'14:45', label:'SKM S2／S3 目標班次', sub:'WTP 官方機場交通頁：S2 停 Warszawa Śródmieście、S3 停 Warszawa Centralna，兩線都不互停，官方標示買 75 分鐘第 1 區票。上車先看是 S2 還 S3——S2 坐到 Śródmieście 出站即 Metro Centrum、飯店在對街；S3 要在 Centralna 下車再步行。月台與即時班次抵達後查 WTP', cost:'75 分第 1 區票 4.40', dur:'25–30 min'},
      {t:'15:15', label:'Hotel Metropol Check-in', sub:'入住 15:00 起，提早到可先寄放行李再出門；抵達較晚就把後面全部順延', dur:'30 min'},
      {t:'15:45', label:'換匯 · REDAR.net 分店 II', sub:'Metro Centrum／Rotunda 地下通道 Lokal 33，離飯店步行約 5 分；官網週六 08:00–20:00。Hotel Metropol 樓下的 REDAR 總店（Marszałkowska 99A）只列週一至週五，不要等它。現場看現鈔買賣價，線上預訂匯率不等於臨櫃牌告', cost:'—', dur:'20 min'},
      {t:'16:05', label:'★ 戴高樂圓環「棕櫚樹」', sub:'華沙地標的人工棕櫚樹；圓環轉角那棟是前波蘭共產黨總部 Dom Partii（後來做過證交所），一起拍。旁邊是國家博物館，只拍外觀不進館', cost:'免費', dur:'15 min'},
      {t:'16:20', label:'新世界街 Nowy Świat 往北', sub:'路邊有蕭邦音樂長椅，按一下會播他的曲子；兩側是戰後照原樣重建的低矮街屋', cost:'免費', dur:'10 min'},
      {t:'16:30', label:'A. Blikle 1869 外帶 pączek', sub:'Nowy Świat 35 的百年甜點店，外帶一顆波蘭甜甜圈 pączek 邊走邊吃；開門時間各目錄不一，沒開就略過', cost:'依店家', dur:'10 min'},
      {t:'16:40', label:'哥白尼紀念碑＋Staszic 宮', sub:'Krakowskie Przedmieście 南端，戶外拍照；紀念碑與後方 Staszic 宮同框', cost:'免費', dur:'10 min'},
      {t:'16:50', label:'★ 聖十字教堂', sub:'蕭邦的心臟安放在柱子裡；週六傍晚可能在做彌撒，能不能進去看當下，彌撒時不要進去拍照。從對街拍雙塔與門前背十字架的基督像', cost:'免費', dur:'10 min'},
      {t:'17:00', label:'華沙大學正門', sub:'鑄鐵大門，可以走進去看校園庭院與 Kazimierzowski 宮；對街的 Czapski 宮（美術學院）是蕭邦一家住過的地方，只拍外觀', cost:'免費', dur:'10 min'},
      {t:'17:10', label:'訪親會教堂＋普魯斯紀念碑', sub:'Krakowskie Przedmieście 34 的白色巴洛克立面（蕭邦學生時代在這裡彈管風琴）；斜對面是作家 Bolesław Prus 的銅像。只拍外觀', cost:'免費', dur:'10 min'},
      {t:'17:20', label:'★ 總統府＋Hotel Bristol 外觀', sub:'Krakowskie Przedmieście 48/50，總統府與門前騎馬像；隔壁 Hotel Bristol、對面 Raffles Europejski 與 Potocki 宮（文化部）一起拍。17:23 日落，拍皇家大道的黃金時段', cost:'免費', dur:'15 min'},
      {t:'17:35', label:'E.Wedel 熱巧克力 · Krakowskie Przedmieście 45', sub:'今天往北的折返點：總統府旁的 E.Wedel 坐下喝熱巧克力（週六 10:00–23:00）；再往北的聖安妮教堂、城堡廣場與老城都留到 10/30。18:05 起身', cost:'依店家', dur:'30 min'},
      {t:'18:05', label:'沿皇家大道走回 Nowy Świat 44', sub:'原路往南約 1 公里，順便拍打燈的總統府、聖十字教堂夜景，18:30 前到餐廳', cost:'免費', dur:'20 min'},
      {t:'18:30', id:'d1-dinner', label:'波蘭地方料理晚餐', sub:'Specjały Regionalne · Nowy Świat 44；Żurek＋綜合 Pierogi，主菜選梅醬豬肋排或半隻烤鴨。時間照待辦的 18:30 訂位（只訂一個時間）；提早到可問能不能先入座', cost:'PLN 35–55', dur:'1 h 15 min'},
      {t:'20:00', label:'沿耶路撒冷大道往西 → 科學文化宮夜景', sub:'Nowy Świat 往南到棕櫚樹圓環，轉 Al. Jerozolimskie 往西走，右手邊就是打燈的科學文化宮，走到中央車站與 Złote Tarasy', cost:'免費', dur:'20 min'},
      {t:'20:20', label:'Złote Tarasy 購物中心', sub:'Złota 59（中央車站旁），波浪玻璃屋頂夜裡很好拍；週六商場至 22:00、個別店家時間不同。10/25（週日）是波蘭非營業週日，克拉科夫大型超市與便利商店多半休息，隔天要吃的水果與飲品今晚順路在商場或 Żabka、Biedronka 先備好', cost:'購物另計', dur:'約 50 min'},
      {t:'21:10', label:'Biedronka 超市採買 · 中央車站', sub:'Al. Jerozolimskie 54 中央車站內的 Biedronka，官方門市頁每日 05:00–01:00；買水、隔天早上的備用麵包與零食，明早 07:15 就要出發上車', cost:'依購買', dur:'20 min'},
      {t:'21:30', label:'回飯店休息', sub:'由中央車站步行約 10 分回 Metropol；隔天 07:15 出發往中央車站。⚠️ 隔天凌晨 03:00 換冬令時間，時鐘撥回 1 小時，手錶和鬧鐘要手動調'},
    ],
    eat: [],
    backup: [
      {label:'下雨備案', where:'科學文化宮 30F 觀景台', why:'全票 30／優待 25 PLN· 每日 10:00–20:00 · 室內 + 360° 城景；從老城前往須另抓交通時間，依當下導航確認', map:'https://www.google.com/maps/search/?api=1&query=Pa%C5%82ac%20Kultury%20i%20Nauki%2C%20plac%20Defilad%201%2C%20Warszawa'},
      {label:'時差太累', where:'Łazienki 公園散步', why:'官網票價頁：花園每日 06:00–21:00 免費；蕭邦像在戶外，館舍另有門票與開放時間，不能當成免費室內備案。抵達日仍以體力與交通時間決定是否前往', map:'https://www.google.com/maps/search/?api=1&query=%C5%81azienki%20Kr%C3%B3lewskie%2C%20Agrykola%201%2C%20Warszawa'},
    ],
    practical: [
      {tag:'寄物', name:'飯店櫃檯優先', note:'Hotel Metropol 櫃檯提供行李寄放，15:00 前抵達先寄物；車站寄物櫃只作備案，尺寸、空位與費率會變動'},
      {tag:'換錢', name:'REDAR.net 分店 II（週六有開）', note:'Metro Centrum／Rotunda 地下通道 Lokal 33，官網週一至六 08:00–20:00、週日 10:00–18:00；Hotel Metropol 樓下的總店（Oddział I）只列平日。現場比較買入與賣出價，不以「0% 手續費」代替實際匯率判斷'},
      {tag:'SIM', name:'Play / Plus / Orange', note:'預付卡需實名登記；通路、容量與價格以抵達當日電信商方案為準'},
    ],
  },
  {
    n: 2, date: '10/25 (日)', city: '華沙 → 克拉科夫',
    title: 'Wawel + 老城 + 辛德勒工廠 + Hankki 晚餐',
    headline: 'EIP 5300 已購票：08:40 由 Warszawa Centralna 出發，11:10 抵 Kraków Główny',
    tag: 'Transit',
    intensity: '高',
    hardConstraints: ['08:05 前抵 Warszawa Centralna；EIP 5300 08:40 發車，月台與車廂依票面及現場電子牌確認', '辛德勒工廠 17:10 前到入口問現場票（最後入場 18:30）', '13:00 準時入座 Pimiento（午餐菜單 13:00 起才供應），13:45 前離店，14:30 瓦維爾大教堂', '16:15 前離開 Wawel，17:10 前到辛德勒入口'],
    compressible: ['聖瑪利亞教堂內部參觀', '紡織會館停留時間'],
    train: {segmentId:'eip-5300'},
    steps: [
      {t:'07:15', label:'退房後前往上車站', sub:'Hotel Metropol → Warszawa Centralna，預留約 20 分鐘步行及尋找店家；早餐外帶不壓縮進站緩衝', dur:'20 min'},
      {t:'07:35', id:'d2-breakfast', label:'早餐 · Green Nero Express 車站外帶', sub:'07:55 前買好法棍＋咖啡，接 08:05 進站找月台；未開或久候就用前晚麵包', dur:'20 min'},
      {t:'08:05', label:'抵 Warszawa Centralna', sub:'已購 EIP 5300 08:40 由本站出發；月台、車廂與座位依票券詳細頁及當日電子牌確認', dur:'35 min 緩衝'},
      {t:'08:40', label:'EIP 5300 前往克拉科夫', sub:'已購票；08:40 Warszawa Centralna → 11:10 Kraków Główny（Koleo Peron III 抵達）。車廂座位依票券詳細頁', cost:'已購票', dur:'2 h 30 min'},
      {t:'11:10', label:'抵 Kraków Główny', sub:'11:10 進站（Koleo）；下月台、拖行李走到飯店約 15 分鐘，故寄放行李排在 11:25', dur:'約 15 min 拖行李'},
      {t:'11:25', label:'旅館寄放行李', sub:'ibis budget Krakow Stare Miasto，飯店官網標示距車站約 200 公尺；只放行李、不辦入住，10 分鐘內出門', dur:'10 min'},
      {t:'11:35', id:'d2-prep', label:'Lajkonik 備妥隔日早餐與午餐', sub:'寄放行李後沿路到 Basztowa 15 採買隔日麵包、水果與飲品，再走去旁邊的城門；含步行與採買暫抓 35 分鐘。10/25 是波蘭非營業週日，大型超市與便利商店多半休息，這家麵包咖啡店有開，但水果與飲品可能買不到，所以 10/24 在華沙先備好水果與水。需冷藏品先確認保存條件，否則選常溫品', dur:'35 min'},
      {t:'12:10', label:'聖弗洛里安城門 → 甕城 Barbakan → Stary Kleparz', sub:'先逛老城北邊，三處離 Pimiento 都約 300 公尺：城門與甕城只看外觀（收費展館不進）；Stary Kleparz 市場週日是否營業未確認，只當街景路過。12:55 走到餐廳', cost:'外觀免費', dur:'45 min'},
      {t:'13:00', id:'d2-lunch', label:'午餐 · Pimiento Shop and Bistro', sub:'Świętego Filipa 21（Stary Kleparz 旁），離 ibis 步行約 7 分；午餐菜單 13:00 起才供應（09:00–13:00 只有早餐菜單），所以 13:00 準時入座：Tatar 阿根廷牛韃靼、Argentine burger 或照重量點阿根廷牛排。週日只開到 15:00（Google 地圖與 MapQuest，官網未列），先用官網表單或 Email 訂位。13:45 前離店，穿過聖弗洛里安城門沿 Floriańska 往南，約 10 分到中央廣場。客滿或關門改 Restauracja Polonia（Basztowa 25）、24 小時的 Przypiecek 或外帶，不壓縮預定景點時段', cost:'依店家', dur:'45 min'},
      {t:'14:00', label:'★ 中央廣場 + 聖瑪利亞', sub:'看廣場與教堂外觀，剛好聽 14:00 整點 Hejnał 號角；登塔改為有餘裕才安排，塔票僅於 Mariacki 廣場 7 號當日現場售票', cost:'外觀免費', dur:'10 min'},
      {t:'14:10', label:'紡織會館 Sukiennice 快速一覽', sub:'本次不排採購（決定取消），伴手禮改在華沙 Złote Tarasy 或 10/31 早上補；14:15 沿 Grodzka 往南約 1 公里、15 分到瓦維爾大教堂', cost:'免費入場', dur:'5 min'},
      {t:'14:30', label:'★ 瓦維爾大教堂', sub:'官網：4–10 月時段，週日 12:30–17:00、售票至 16:30（11–3 月才縮為 16:00）；Cathedral Museum 週日休館。另一個訂票站 bilety-wawel.pl 的規章寫 10 月起週日可能 16:00 閉館，14:30 入場兩種版本都來得及，現場以公告為準', cost:'PLN 26／18', dur:'45 min'},
      {t:'15:15', label:'★ Wawel 城堡短路線', constraint:{venue:'krakow-wawel-treasury'}, sub:'線上已訂不到：到售票處問當日剩餘票，買不到就只逛免費的山丘庭院與外觀；16:00 下到北岸 Bulwar Czerwieński 拍河岸全景，16:15 前離開。官網 9–12 月分路線售票，適合一小時空檔的是：王冠寶庫 47／35、Castle Underground 47／35（含語音導覽）、Armoury 47／35；二樓代表廳 57／43 需時較長。不要硬排一、二樓完整路線，會壓縮前往辛德勒工廠的時間', cost:'寶庫或地下路線 PLN 47／35', dur:'1 h'},
      {t:'16:15', label:'步行經 Kazimierz → Bernatek 橋 → 辛德勒工廠', sub:'Wawel 往東南步行約 15 分到 Plac Nowy 圓亭（Endzior 週日公休，改其他窗口或路邊 obwarzanek 小點心，15 分內），再經 Szeroka 街口、Bernatek 人行橋過河到 Podgórze，約 20 分；17:10 前到入口。下雨或腳痠改搭電車（用 Jakdojade 查車號）', dur:'約 55 min'},
      {t:'17:30', label:'★ 辛德勒工廠', constraint:{venue:'krakow-schindler'}, sub:`線上已訂不到：17:10 前到入口向現場售票處問當日剩餘時段，買不到就看外觀後提早往 Hankki。週日 ${schindlerVenue.hours.opens}–${schindlerVenue.hours.closes}、最後入場為閉館前 90 分（${schindlerVenue.hours.lastEntry}）· 常設展票一律實名，入場要帶與購票同名的證件正本。為接 19:15 晚餐，預計 19:00 前離館（約 1 h 30 min）`, cost:'PLN 60 · 優待 45', dur:'約 1 h 30 min'},
      {t:'19:15', id:'d2-dinner', label:'晚餐 · Hankki（先確認接單）', sub:'辛德勒 17:30 入場、預計 19:00 前離館，步行約 5 分到 Zabłocie 19A；Gyoza、Honey Garlic Popcorn Chicken、Kimbap 或 Bibimbap。週日 13:00–21:00 營業，最後點餐時間查不到，建議先在 MojStolik 訂位；想換泰式改 MOLÁM（週日至 21:30），NOAH 留作備選；Endzior 多數來源週日公休，宵夜改 Plac Nowy 圓亭其他窗口', cost:'依店家', dur:'1 h'},
    ],
    eat: [
      snack({text:'16:30 前後路過 Plac Nowy：Endzior 週日公休，改圓亭其他窗口 zapiekanka 或 obwarzanek @ Endzior', placeId:'krakow-endzior'}),
    ],
    warn: '❗EIP 5300 已購票，11:10 抵 Kraków Główny，11:25 寄放行李；誤點再依 PKP App 調整午後行程。Wawel 城堡與辛德勒工廠 10/25 線上已訂不到，仍照原時段到現場售票處問剩餘票；買不到 Wawel 就逛免費庭院，買不到辛德勒就看外觀後提早吃晚餐。瓦維爾大教堂週日 12:30–17:00（售票至 16:30）；先逛北邊甕城一帶，13:00 Pimiento 午餐（午餐菜單 13:00 起才供應），飯後沿 Floriańska 往南，14:00 中央廣場聽整點號角，14:30 瓦維爾大教堂、Wawel 短路線 15:15，16:15 前離開後步行經 Kazimierz（Plac Nowy 圓亭）、Bernatek 人行橋到辛德勒工廠，下雨或腳痠才改搭電車。辛德勒工廠週二至週日 09:00–20:00、最後入場 18:30，17:30 屬可行時段。10/25 為非營業週日，多數一般商店關閉；餐廳等法定例外是否營業仍以店家公告為準。',
    backup: [
      {label:'辛德勒現場也沒票', where:'外觀與 Zabłocie 一帶短停，提早往 Hankki', why:'線上 10/25 已售完；現場有沒有當日票以售票處為準，最後入場 18:30'},
      {label:'雨天替代 Wawel', where:'地下市集博物館 Rynek Underground', map:'https://www.google.com/maps/search/?api=1&query=Rynek%20Underground%2C%20Rynek%20G%C5%82%C3%B3wny%201%2C%20Krak%C3%B3w', why:'廣場下方歷史展（Rynek Główny 1），PLN 45／35，最後入場為閉館前 75 分鐘。官方 2026 閉館日不含 10/25；週日時間以官網當日為準。另註：每週二免費（免費日不可預約、現場限量、每人限領 5 張），每月第二個週一休館'},
    ],
    practical: [
      {tag:'寄物', name:'Kraków Główny', note:'優先詢問旅館寄放；車站寄物設施的空位與費率以當日現場為準'},
      {tag:'換錢', name:'Kantor 民間匯兌', note:'觀光區匯率可能較差；交易前先確認實際可得 PLN 總額'},
      {tag:'電車', name:'Wawel → Podgórze 路線', note:'路線可能因工程改道，出發時用 Jakdojade 查當下可搭車號與轉乘'},
    ],
  },
  {
    n: 3, date: '10/26 (一)', city: '克拉科夫',
    title: 'Auschwitz-Birkenau · 一日往返',
    headline: `10:30 英文 educator 導覽已訂妥；去程巴士 ${lajkonikOutboundAdopted.dep} 已購票（${lajkonikOutboundAdopted.arr} 抵），回程 ${lajkonikInboundAdopted.dep} ${lajkonikInboundState}`,
    tag: 'Memorial',
    intensity: '中高',
    hardConstraints: ['08:10 前到 Kraków MDA 下層 D9 站位（業者要求發車前 15 分鐘到站牌）', `10:00 前抵 Muzeum Auschwitz 留安檢時間（官方要求至少提前 30 分鐘到場）；已購 ${lajkonikOutboundAdopted.dep} 班 ${lajkonikOutboundAdopted.arr} 抵達，只剩 10 分鐘餘裕`, '10:30 英文 educator 導覽已訂妥，遲到不予補場', `回程巴士 ${lajkonikInboundAdopted.dep} 發車，導覽結束後不要走遠`, '晚間不再加博物館或長距離步行'],
    compressible: ['回克拉科夫後晚餐形式', '晚間自由活動'],
    // 導覽已訂妥 10:30；去程巴士 2026-10-13 已購 08:25 → 09:50（rail.js outbound.booked）。
    // 回程購票狀態由 todoGroups 推導（lajkonikInboundState），班次與公開班表正本在 rail.js；9/09 售票頁只代表當時的可售快照。
    train: {segmentId:'bus-lajkonik'},
    steps: [
      {t:'07:15', id:'d3-breakfast', label:'自備早餐 · 住宿內吃完', sub:'前一天先買好，07:35 離開住宿，07:55 至 MDA 報到', dur:'20 min'},
      {t:'07:55', label:'Kraków MDA 報到', sub:'ul. Bosacka 18 Dworzec Autobusowy（Kraków Główny 後方步行約 5 分）；票面標示下層（dolna płyta）D9 站位，業者要求發車前 15 分鐘（08:10）到站牌，仍以現場電子看板為準', dur:'30 min 規劃緩衝'},
      {t: lajkonikOutboundAdopted.dep, label:'Lajkonik · 克拉科夫 → 奧斯威辛', sub:`已購票（2 張全票，線上總價 ${auschwitzBus.outbound.booked.total}）：${lajkonikOutboundAdopted.dep} 由 ${lajkonikOutboundAdopted.bay} 發車、${lajkonikOutboundAdopted.arr} 抵 Więźniów Oświęcimia 55，車程 ${lajkonikOutboundAdopted.dur}。上車出示列印票或手機票（螢幕至少 4 吋）。原規劃的 ${lajkonikOutboundRejected.dep} → ${lajkonikOutboundRejected.arr} 緩衝較多，想改票可在票券管理頁處理`, cost:`已購票（2 張 ${auschwitzBus.outbound.booked.total}）`, dur: lajkonikOutboundAdopted.dur},
      {t: lajkonikOutboundAdopted.arr, label:'抵 Auschwitz I', sub:'下車處就在博物館停車場對面。距 10:30 入場只有 40 分鐘，官方要求 10:00 前到場——只剩 10 分鐘餘裕：下車直接寄大件行李（付費，費率以現場為準）、過安檢（機場式檢查會排隊），不逛書店；可入館包袋不得超過 35 × 25 × 15 公分。巴士明顯誤點時，依官方確認信的說明先聯絡博物館', dur:'40 min（到場要求前只剩 10 min）'},
      {t:'10:30', label:'★ 英文官方導覽（已訂妥）', sub:'個人 educator 導覽 · 一館 + 比克瑙 · 官方標示約 3 小時 45 分；入場憑電子入場證＋證件，兩者缺一不可', cost:'已付款', dur:'3h45'},
      {t:'依導覽休息', timingMode:'relative', id:'d3-lunch', label:'自備午餐 · 依允許的休息時段', sub:'攜帶三明治、水果與水；只在導覽允許的用餐區吃，不在參觀區進食或為午餐離團'},
      {t:'約 14:15', label:'導覽結束', sub:'比克瑙結束後搭免費接駁巴士回一號營區（回克拉科夫的巴士從一號營區旁發車），留意接駁班次，再走到停車站牌'},
      {t: lajkonikInboundAdopted.dep, label:'回程巴士返克拉科夫', sub:`於 lajkonikbus.pl 售票頁當時顯示 10/26 回程可售三班（不是全線完整班表）：${lajkonikInboundRejected.dep}（導覽結束前就開走，不可用）、${lajkonikInboundAdopted.dep}、${lajkonikInboundBackup.dep}。採 ${lajkonikInboundAdopted.dep} 由 Więźniów Oświęcimia 55 發車，導覽結束後有 75 分鐘走回站牌與休息；若導覽延後或接駁排隊，改搭 ${lajkonikInboundBackup.dep}（${lajkonikInboundBackup.arr} 抵）`, cost:`線上快照 PLN ${lajkonikFare.full}（優待 ${lajkonikFare.discount}；付款前重查）`, dur: lajkonikInboundAdopted.dur},
      {t: lajkonikInboundAdopted.arr, label:'抵 Kraków MDA · 休息', sub:'ul. Bosacka 18 Dworzec Autobusowy；先回旅館放東西與休息；回 ibis 前先在 Lajkonik 買明早麵包（20:00 關門）。晚餐暫排 18:30；太累就在巴士站旁 Galeria Krakowska 吃速食'},
      {t:'17:55', label:'咖啡 · Karma Kawiarnia（選配）', sub:'Krupnicza 12/3，Karma Coffee Roasters 官網聯絡頁列平日 08:00–20:00（另一個網站 karmakrakow.pl 寫平日 07:00–18:00，若屬實 17:55 已近打烊；出門前看 Google 地圖當日營業時間，沒開就直接去晚餐）；由 ibis 步行約 15 分，喝完步行約 5 分到 Jagiellońska 5。巴士延誤或太累就略過，不影響 18:30 晚餐', cost:'依店家', dur:'25 min'},
      {t:'18:30', id:'d3-dinner', label:'晚餐 · Mr. Jerry 威靈頓牛排', sub:'Jagiellońska 5（老城），返城休息後前往；招牌 Beef Wellington，胃口大可加乾式熟成牛排。週一 15:00–22:00、廚房至 21:30，建議線上訂位並在備註請店家預留 Wellington；返程延誤就用訂位確認信回信告知。訂不到改 Pod Aniołami；FOLGA 週一可能休息', cost:'依店家菜單', dur:'1 h 15 min'},
    ],
    eat: [
      snack({text:'17:55 晚餐前咖啡（巴士延誤就略過） @ Karma Kawiarnia（Krupnicza 12）', placeId:'krakow-karma-coffee-roasters'}),
    ],
    warn: `✅ 導覽已訂妥：10/26 10:30 英文個人 educator 導覽（Zwiedzanie indywidualne z edukatorem），官方標示約 3 小時 45 分，2 人。官方明載「入場證需搭配身分證件」，請把電子入場證存離線並帶護照。🚌 **去程巴士已購票**：**${lajkonikOutboundAdopted.dep} → ${lajkonikOutboundAdopted.arr}**，Kraków MDA 下層 D9 站位發車、2 張全票線上總價 ${auschwitzBus.outbound.booked.total}；業者要求發車前 15 分鐘到站牌，上車出示列印票或手機票。⚠ 官方要求導覽前至少 30 分鐘、即 **10:00 前到場**，這班 ${lajkonikOutboundAdopted.arr} 抵達只剩 10 分鐘餘裕：下車直接寄物、過安檢，不逛書店；巴士一誤點就可能趕不上，若想多留緩衝，可在票券管理頁改成 ${lajkonikOutboundRejected.dep} → ${lajkonikOutboundRejected.arr}（退改規則以票券頁為準）。**回程${lajkonikInboundState}**：導覽約 14:15 結束，同日售票頁曾顯示 10/26 下午三班（歷史快照，不是完整班表）：${lajkonikInboundRejected.dep}（導覽結束前開走，不可用）、**${lajkonikInboundAdopted.dep} → ${lajkonikInboundAdopted.arr}（採用）**、${lajkonikInboundBackup.dep} → ${lajkonikInboundBackup.arr}（備案），車程 ${lajkonikInboundAdopted.dur}${lajkonikInboundOpen ? '；可先在 moj-bus.pl 線上買，或當天上車向司機買（司機售票全票 27 zł），付款前以售票頁當下顯示為準。' : '；請把票券存離線。'}`,
    // 回程選項。導覽約 14:15 結束，全部以「14:15 之後發車」為門檻。
    // 回程班次為 2026-09-09 官方售票頁 lajkonikbus.pl 查得的 10/26 快照；
    // 去程已於 2026-10-13 購票；回程購票狀態見 lajkonikInboundState（由 todoGroups 推導）。
    returnOptions: [
      {
        rank: '採用', name: `Lajkonik ${lajkonikInboundAdopted.dep} → ${lajkonikInboundAdopted.arr} 抵 Kraków MDA`,
        detail: `由 Więźniów Oświęcimia 55 發車、停 ul. Bosacka 18 Dworzec Autobusowy，車程 ${lajkonikInboundAdopted.dur}，${lajkonikInboundAdopted.fare}。導覽 14:15 結束後有 75 分鐘走回站牌、上洗手間與逛訪客中心書店。`,
        status: `✅ lajkonikbus.pl 售票頁有 10/26 這班；${lajkonikInboundState}。`,
        url: 'https://www.lajkonikbus.pl/',
      },
      {
        rank: '備案', name: `Lajkonik ${lajkonikInboundBackup.dep} → ${lajkonikInboundBackup.arr} 抵 Kraków MDA`,
        detail: '同站牌、同票價的下一班。導覽延後、比克瑙接駁排隊或想多留時間時改搭，代價是多等 1 小時。',
        status: `✅ 有這班。當天若已趕上 ${lajkonikInboundAdopted.dep} 就不需要這班。`,
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
        status: '⚠️ 現行班表到 10/24，10/25 起為新班表（Day 2 EIP 5300 即新表第一天，出發前用 PKP App 確認票面時刻與月台）；10/26 火車時刻以新表為準，必須重查。',
        url: 'https://portalpasazera.pl/en/',
      },
      {
        rank: '其他業者', name: 'Przewóz Osób JS／GT TRANS／Lewański',
        detail: '同樣行駛 Oświęcim ⇄ Kraków，班次可補 Lajkonik 的空檔；但多數停靠 Oświęcim 市區站而非博物館門口，需先確認上車點。',
        status: '⚠️ 班表與上車點未逐家確認，請在 busy-krk.pl 或各業者頁面比對。',
        url: 'https://www.busy-krk.pl/en/oswiecim-krakow/',
      },
      {
        rank: '其他業者', name: 'Moj Bus（moj-bus.pl）',
        detail: '另一個 Kraków ⇄ Oświęcim 的巴士訂位入口，網址帶 /en 為英文介面。Lajkonik 15:30 或 16:30 客滿時用來找替代班次。',
        status: '⚠️ 班次、票價與上下車點都要出發前自行確認；務必看清楚停靠的是博物館門口還是 Oświęcim 市區站。',
        url: 'https://moj-bus.pl/en',
      },
    ],
    backup: [
      {label:'戶外為主 · 必備雨具', where:'比克瑙營區戶外 80%', map:'https://www.google.com/maps/search/?api=1&query=Auschwitz%20II%20Birkenau%2C%20O%C5%9Bwi%C4%99cim', why:'導覽風雨無阻，請穿防水鞋 + 帶折傘'},
      {label:'若無導覽額度', where:'Galicia Jewish Museum + Kazimierz 室內行程', map:'https://www.google.com/maps/search/?api=1&query=Galicia%20Jewish%20Museum%2C%20Dajwor%2018%2C%20Krak%C3%B3w', why:'Galicia Jewish Museum 每日 10:00–18:00、全票 35 PLN；MOCAK 週一休館，10/26 不列入備案。出發前仍須重查臨時閉館。'},
    ],
  },
  {
    n: 4, date: '10/27 (二)', city: '克拉科夫 → 樂斯拉夫',
    title: 'Wieliczka 鹽礦 + 16:45 轉場',
    headline: 'IC 3830 已購票：16:45 由 Kraków Główny 出發；鹽礦後縮短 Kazimierz 停留',
    tag: 'Transit',
    intensity: '高',
    hardConstraints: ['09:00 Wieliczka 鹽礦英文團已購票；07:55 前到 Kraków Główny 搭 KMŁ，依票面提早到礦井入口', '15:00 結束 Kazimierz 並回旅館取行李；若鹽礦延誤，跳過 Kazimierz', '16:10 前抵 Kraków Główny；已購 IC 3830 16:45 發車'],
    compressible: ['Kazimierz 白天散步', '老城補逛與採購'],
    train: {segmentId:'ic-3830'},
    steps: [
      {t:'06:55', label:'退房 + 行李寄旅館', sub:'鹽礦 09:00 英文團已購票，往回推：先退房把行李寄 ibis，在飯店吃早餐，07:55 前到 Kraków Główny', dur:'10 min'},
      {t:'07:05', id:'d4-breakfast', label:'自備早餐 · 住宿內吃完', sub:'前晚在 Lajkonik 或 Żabka 買好麵包，在 ibis 吃；車站只隔約 200 公尺，07:45 出門即可', dur:'40 min'},
      {t:'08:00', label:'火車到 Wieliczka Rynek-Kopalnia', sub:'目標 08:00 前後發車、約 08:25 抵站，再步行約 10 分到 Daniłowicz 礦井入口；班次當日用 KMŁ／PKP App 查。KMŁ；ZTP 官方票價表載明 70 分鐘 KMK+KMŁ 聯票涵蓋 Wieliczka Bogucice–Wieliczka Rynek Kopalnia 區段與所有站名含「Kraków」的車站，唯一排除的是 Kraków Airport——此程適用。注意是「70 分鐘」有效，逾時要另購', cost:'PLN 10（優待 5）', dur:'約 25 min'},
      {t:'09:00', label:'★ Wieliczka 鹽礦 Tourist Route 英文團', sub:'已付款：10/27 09:00 英文 Tourist Route（Individual tour）。票券 PDF 隨確認信附上，存離線；訂單編號只存私人資料。3.5 km · 135m 深 · St. Kinga 鹽教堂，依票面提早到 Daniłowicz 礦井入口', cost:'已購票', dur:'2–3 h'},
      {t:'出礦後', timingMode:'relative', id:'d4-lunch', label:'午餐 · Bistro Posolone', sub:'09:00 場約 11:30–12:00 出礦，可以坐下吃當日湯、Halloumi 沙拉或兩人分一份披薩，12:40 收尾；較晚就外帶／吃自備餐。另預留走回車站及候車，回程延誤就略過 Kazimierz，保住 16:10 抵站', cost:'依店家', dur:'有餘裕才留 30 min'},
      {t:'12:45', label:'前往 Wieliczka 車站候車', sub:'由餐廳／出礦口步行，暫留 30 分鐘含找站與候車；實際出口與班次當日重算', dur:'30 min'},
      {t:'13:15 目標', label:'火車回 Kraków Główny', sub:'當日查 KMŁ 班次；去程票已失效需另購，回城後先保住取行李與 16:10 抵站', cost:'依當日票價', dur:'約 25 min'},
      {t:'回城後有餘裕', timingMode:'relative', label:'Kazimierz 快速散步（有餘裕才去）', sub:'鹽礦改 09:00 場後，約 13:45 可回城，多半有 1 小時散步；15:00 前能結束才去，不為散步繞路。若回程這班停 Kraków Grzegórzki，可在此下車步行約 600 公尺進 Kazimierz，出發前用 KMŁ App 確認'},
      {t:'15:00', label:'結束 Kazimierz 散步，回 ibis 取行李', sub:'飯店距 Kraków Główny 約 200 公尺；不要再安排採購'},
      {t:'16:10', label:'抵 Kraków Główny', sub:'確認月台、車廂與座位；發車前保留 35 分鐘', dur:'35 min 緩衝'},
      {t:'16:45', label:'IC 3830 前往樂斯拉夫', sub:'已購票；16:45 → 19:50（Koleo，Peron II 抵達），車廂座位依票券詳細頁', cost:'已購票', dur:'3 h 05 min'},
      {t:'19:50', label:'抵 Wrocław Główny', sub:'Koleo 19:50 到；順手拍打燈的新哥德式主車站，再步行至主站對面的 Hotel Piast，拖行李保守抓 5–10 分鐘'},
      {t:'20:05', label:'Piast 放行李', sub:'Piłsudskiego 98，車站對面；放好行李就出門吃晚餐', dur:'10 min'},
      {t:'20:15', id:'d4-dinner', label:'晚餐 · Samarqand 或車站 KFC', sub:'Stawowa 23（車站旁）：Uzbek Plov 抓飯、Manti 湯餃。關門前 1 小時廚房就不出餐，誤點、晚到或不接單直接改 KFC Wrocław PKP 或 Wroclavia 的 MAX（到 01:00）。抵達時間依 Koleo 為 19:50，誤點再用 PKP App 即時查', dur:'50 min'},
      {t:'21:05', label:'★ Przejście「無名行人」雕像（選配）', sub:'Świdnicka × Piłsudskiego：一群銅像行人沉進人行道、再從對面冒出來。今天 06:55 就出門，夜拍整段是選配，累了吃完晚餐就回飯店', cost:'免費', dur:'15 min'},
      {t:'21:25', label:'★ 中央廣場夜景（選配）', sub:'哥德式市政廳打燈', cost:'免費', dur:'20 min'},
      {t:'21:45', label:'★ Neon Side Gallery 夜景（選配）', sub:'Ruska 46c 的中庭，舊霓虹招牌晚上才亮；整修狀況未查到最新公告，出發前看一下 Google 地圖最新評論', cost:'免費', dur:'15 min'},
      {t:'22:05', label:'搭電車或叫車回 Piast', sub:'用 Jakdojade 查電車，或開 Bolt 叫車', dur:'約 15 min'},
    ],
    eat: [
      snack({text:'Sernik（Krupnicza 6 不在今天動線上，有空才去） @ Cukiernia Michałek', placeId:'krakow-cukiernia-michalek'}),
      snack({text:'手工餃子（Kazimierz 有空檔才去） @ Pierogi MR Vincent', placeId:'krakow-pierozki-u-vincenta'}),
    ],
    warn: '✅ 鹽礦已購票：10/27 09:00 英文 Tourist Route（付款），票券 PDF 存離線，訂單編號只存私人資料。比原規劃的 10:00 場早一小時，早上往回推：06:55 退房寄行李、07:05 在 ibis 吃前晚備妥的早餐、07:55 前到 Kraków Główny 搭 KMŁ。城際段已購 IC 3830，16:45 發車；若鹽礦延誤，直接跳過 Kazimierz，16:10 前抵 Kraków Główny。抵達樂斯拉夫 19:50（Koleo ），20:15 晚餐 Samarqand；之後的夜拍（無名行人雕像、中央廣場、Neon Side Gallery）是選配，累了就回飯店。',
    backup: [
      {label:'鹽礦客滿或超時', where:'先查當日英文場並保住 16:45 的已購火車', why:'需要 16:10 前到 Kraków Główny；來不及就略過 Kazimierz'},
      {label:'雨天備案', where:'鹽礦本身就在地下 135m', map:'https://www.google.com/maps/search/?api=1&query=Kopalnia%20Soli%20Wieliczka%2C%20Dani%C5%82owicza%2010%2C%20Wieliczka', why:'地下約 17–18°C、防雨遮陽最佳備案'},
      {label:'想留更多 Kazimierz 時間', where:'以 15:00 收尾為上限', why:'不得壓縮取行李與 16:10 抵站緩衝'},
    ],
    practical: [
      {tag:'交通', name:'Wieliczka 火車', note:'Kraków Główny 搭 KMŁ 至 Wieliczka Rynek-Kopalnia。ZTP 官方票價表原文：70 分鐘 KMK+KMŁ 聯票 10／5 PLN，可搭 I、II、III 區的 KMK 車輛，以及 KMŁ 在 Wieliczka Bogucice–Wieliczka Rynek Kopalnia 區段與所有站名含「Kraków」的車站，唯一排除 Kraków Airport——本段全程涵蓋。但有效期只有 70 分鐘，去回要各買一張。'},
      {tag:'寄物', name:'旅館 + Główny 備案', note:'退房後優先寄旅館；若旅館不收，依車站當日設施、空位與費率處理'},
      {tag:'裝備', name:'鹽礦低溫', note:'地下約 17–18°C，攜薄外套；官方標示全程超過 800 階，須穿好走鞋'},
    ],
  },
  {
    n: 5, date: '10/28 (三)', city: '樂斯拉夫 → 波茲南',
    title: '小矮人 + 百年廳 + 座堂島點燈 + 晚轉場',
    headline: 'IC 260 已購票，19:10 由 Wrocław Główny 出發；付費景點只在外面拍照，下午加百年廳；20:29 抵 Poznań Główny',
    tag: 'Transit',
    intensity: '高',
    hardConstraints: ['07:00 出門，行李留在 Piast（能不能寄放，入住時當面問櫃檯）', '午餐 13:10 前離開 Restauracja Wrocławska', '座堂島點燈人無對外保證的固定出發分鐘（通常日落前約 30–40 分鐘出發），15:45 上島就留意', '18:35 前抵 Wrocław Główny；已購 IC 260 19:10 發車'],
    compressible: ['百年廳（時間不夠先刪，含來回電車可省約 1 小時 15 分鐘）', '座堂島改 45 分鐘重點散步', '午餐改簡餐或外帶'],
    train: {segmentId:'ic-260'},
    steps: [
      {t:'07:00', label:'主車站晨景，出發', sub:'行李留在 Piast（退房 12:00 前，傍晚回來拿；能不能寄放，入住時當面問櫃檯）', dur:'5 min'},
      {t:'07:05', label:'Świdnicka 大街 → Papa Krasnal', sub:'Piłsudskiego 路口的「無名行人」銅像群（前晚沒看到就這時補）、聖多羅西教堂與歌劇院外觀、護城河小橋，第一隻小矮人 Papa Krasnal；清晨沒什麼人', cost:'免費', dur:'25 min'},
      {t:'07:30', id:'d5-breakfast', label:'早餐 · Central Cafe', sub:'Świętego Antoniego 10，平日 07:00 開門；美式鬆餅、貝果或燕麥粥，08:10 收尾；未供餐改同街 Charlotte Pokoyhof', dur:'40 min'},
      {t:'08:15', label:'★ 四教派街區', sub:'白鸛猶太會堂的庭院（Włodkowica 7），附近還有路德會、天主教堂和東正教堂；只在庭院與外觀拍照', cost:'免費', dur:'20 min'},
      {t:'08:35', label:'Neon Side Gallery 白天版', sub:'Ruska 46c，就在四教派街區隔壁', cost:'免費', dur:'15 min'},
      {t:'08:50', label:'鹽廣場 Plac Solny', sub:'花市', cost:'免費', dur:'15 min'},
      {t:'09:05', label:'★ 中央廣場 + 紡織會館', sub:'哥德式舊市政廳外觀與天文鐘面、刑柱、弗雷德羅雕像、「Pod Gryfami」等彩色山形屋、紡織會館；市政廳博物館不進。沿路用 dwarfsmap.com 找小矮人', cost:'免費', dur:'45 min'},
      {t:'09:50', label:'屠夫巷 → 糖果屋雙屋 → 聖伊莉莎白教堂外觀', sub:'屠夫巷 Jatki 的動物銅像；從糖果屋拱門往上取景拍高塔。不上塔（省 PLN 16／10）', cost:'免費', dur:'30 min'},
      {t:'10:20', label:'咖啡休息 · El Gato Specialty Coffee', sub:'Odrzańska 8，就在屠夫巷旁，每日 08:00–20:00', cost:'依店家', dur:'30 min'},
      {t:'10:50', label:'★ 大學區', sub:'劍客噴泉、大學主樓的巴洛克立面（Aula Leopoldina 收費不進）、耶穌會的聖名教堂外觀、大學橋拍河岸、Ossolineum 庭院；只看外觀', cost:'免費', dur:'50 min'},
      {t:'11:40', label:'Hala Targowa 市場大廳', sub:'混凝土拱頂；可以買水果。11:50 起身，往西步行約 10 分回 Szewska 午餐', cost:'免費', dur:'20 min'},
      {t:'12:00', id:'d5-lunch', label:'午餐 · Restauracja Wrocławska', sub:'Szewska 59/60，12:00 開門；入座就點餐：Śląskie niebo＋Bigos Wrocławski。主菜現做約 30 分鐘，13:10 離開（後面的全景畫外觀縮短，19:10 火車不受影響）。想省排隊可先訂位（選配，見待辦）', cost:'依店家', dur:'1 h 10 min'},
      {t:'13:20', label:'全景畫圓形館＋國家博物館外觀', sub:'午餐後由 Szewska 往東步行約 10 分到 Purkyniego。全景畫不入內、不用買全景畫票，只在圓形館外拍外景；國家博物館整面爬藤，十月底可能轉紅，也只拍外觀。甜點：國家博物館內的 Słodki Chłopak 不需門票，依博物館時間營業（10/28 週三 10:00–16:00），外帶一塊蛋糕到百年廳吃；排隊就略過', cost:'免費', dur:'10 min'},
      {t:'13:30', label:'Grunwaldzki 橋 → 電車往百年廳', sub:'過橋後搭電車往東約 15 分；用 Jakdojade 查當下車號', cost:'依當日票價', dur:'25 min'},
      {t:'13:55', label:'★ 百年廳 Hala Stulecia（外觀）', sub:'UNESCO 世界遺產：外觀、尖塔 Iglica、Pergola 柱廊、Szczytnicki 公園秋葉，只看外觀不買票。多媒體噴泉大概率已停：官網 2026 的季末之夜「Noc pokazów」排在 10/24，6/20 雷擊後也只能部分運作，只拍建築就好。時間不夠先刪這段', cost:'免費', dur:'55 min'},
      {t:'14:50', label:'電車回 Słodowa 島一帶', sub:'約 15 分，在離 Słodowa 島最近的站下車；站名與車號用 Jakdojade 查', cost:'依當日票價', dur:'20 min'},
      {t:'15:10', label:'★ Słodowa 島 → 沙島', sub:'由西往東走：先在 Słodowa 島拍河景，過小橋到沙島看紅磚的沙上聖母堂外觀', cost:'免費', dur:'35 min'},
      {t:'15:45', label:'★ 座堂橋 → 座堂島', sub:'座堂橋上的愛情鎖、上下兩層的聖十字教堂、城裡最古老的聖吉爾斯小教堂、大主教宮與主教座堂雙塔外觀；正殿通常可以免費看一眼，登塔收費不上', cost:'免費', dur:'45 min'},
      {t:'16:34', label:'★ 座堂島煤氣燈', sub:'日落約 16:34；樂斯拉夫市立博物館介紹點燈人通常在日落前約 30–40 分鐘出發（非固定場次），15:45 上島就邊走邊留意，不要等到日落才找', cost:'免費', dur:'約 40 min'},
      {t:'17:15', label:'座堂島結束後回 Piast 取行李', sub:'座堂島 → 旅館約 25–30 分，取行李再往 Wroclavia；若 18:05 前無法到 MAX，改車站內外帶。已購 IC 260 19:10 發車，18:35 抵站後保留約 35 分鐘緩衝', dur:'約 50 min'},
      {t:'18:05', id:'d5-dinner', label:'晚餐 · MAX Wroclavia 外帶', sub:'取行李後選 Frisco 或 Halloumi 漢堡＋地瓜薯條；18:15 前拿到餐，留 20 分鐘進主站。排隊就改同商場 Pasibus、主站 KFC 或現成麵包，不壓縮進站緩衝；不要等到波茲南再吃', dur:'10 min'},
      {t:'18:35 前', label:'抵 Wrocław Główny', sub:'確認已買好外帶，開始找月台、車廂與座位；此時不再排隊買餐', dur:'至少 35 min 緩衝'},
      {t:'19:10', label:'IC 260 前往波茲南', sub:'已購票；19:10 → 20:29（Koleo，Peron VIII 抵達；列車名 BALTIC EXPRESS），車廂座位依票券詳細頁', cost:'已購票', dur:'1 h 19 min'},
      {t:'20:29', label:'抵 Poznań Główny', sub:'Koleo 20:29 到；先依訂房確認核對晚間取鑰匙方式（出發前用訂房平台的訊息功能或 Email 問 Poznan Apartments），再前往接待處或指定地點。實際公寓門牌依訂房確認'},
    ],
    eat: [
      snack({text:'10:20 咖啡休息 @ El Gato Specialty Coffee', placeId:'wroclaw-el-gato-specialty-coffee'}),
      snack({text:'13:20 飯後甜點外帶（國家博物館內，不需門票） @ Słodki Chłopak', placeId:'wroclaw-slodki-chlopak-muzeum-narodowe'}),
      snack({text:'甜點（有空才去：12:00 才開，與下午往東動線相反） @ Dessert Boutique', placeId:'wroclaw-dessert-boutique'}),
    ],
    warn: '✅ IC 260 城際火車已購票。新行程付費景點只在外面拍照：全景畫、聖伊莉莎白教堂塔樓、國家博物館都不用買票。午餐 Restauracja Wrocławska 12:00 開門，主菜現做約 30 分鐘，13:10 離開，步行約 10 分到全景畫，外觀縮成 10 分鐘（順路在國家博物館內的 Słodki Chłopak 外帶蛋糕），13:30 過 Grunwaldzki 橋搭電車去百年廳，19:10 火車不受影響。百年廳多媒體噴泉大概率已停，只拍建築。10/28 日落約 16:34；點燈人沒有對外保證的固定出發分鐘，市立博物館介紹通常在日落前約 30–40 分鐘出發，15:45 上島就邊走邊留意，16:34–17:15 在座堂島等候。',
    backup: [
      {label:'下雨', where:'市場大廳 + 紡織會館拱廊', map:'https://www.google.com/maps/search/?api=1&query=Hala%20Targowa%2C%20Piaskowa%2017%2C%20Wroc%C5%82aw', why:'有遮蔽的地方多停一下，咖啡時間可以拉長；百年廳改快拍或整段刪掉'},
      {label:'雨天備案', where:'Sky Tower 觀景台', map:'https://www.google.com/maps/search/?api=1&query=Sky%20Tower%2C%20Powsta%C5%84c%C3%B3w%20%C5%9Al%C4%85skich%2095%2C%20Wroc%C5%82aw', why:'開放時間、票價與能見度以官方當日公告為準，不用舊票價規劃'},
      {label:'點燈師看不到', where:'廣場連拱廊 + 紡織會館內部市集', map:'https://www.google.com/maps/search/?api=1&query=Rynek%20Wroc%C5%82aw', why:'若日落後遇雨遮蔽煤氣燈，回廣場喝熱酒（PLN 12）'},
    ],
  },
  {
    n: 6, date: '10/29 (四)', city: '波茲南 → 華沙',
    title: '無頭人像 + 山羊鐘樓秀 + 聖馬丁牛角麵包',
    headline: 'EIC 8104 已購票，17:40 發車；付費館只在外面拍照，上午 Cytadela 與教堂島，中午山羊秀',
    tag: 'Transit',
    intensity: '高',
    hardConstraints: ['07:00 退房寄行李：接待處幾點開、能不能寄放，出發前傳訊息確認', '11:45 前抵達老城廣場卡位', '12:00 山羊鐘樓秀', '14:00 Carla 午餐（14:00 才開門），15:15 前結帳', '16:15 從 Kaponiera 圓環回去取行李', '17:05 前抵 Poznań Główny；搭乘已購 EIC 8104'],
    compressible: ['Cytadela（時間不夠先刪，08:30 直接去教堂島）', '帝王區步行（只看帝王城堡外觀、跳過 Kaponiera）', 'Stary Browar 逛街時間'],
    train: {segmentId:'eic-8104'},
    steps: [
      {t:'07:00', label:'退房、寄放行李', sub:'⚠️ 接待處幾點開、能不能寄行李還沒確認：出發前傳訊息問清楚（用訂房平台的訊息功能或 Email 問 Poznan Apartments）；不能寄就改用 Poznań Główny 車站的寄物櫃（位置和空位當天再看）', dur:'15 min'},
      {t:'07:15', id:'d6-breakfast', label:'早餐 · Charlotte Krysiewicza', sub:'Krysiewicza 3a/27，07:00 開門；French Breakfast、可頌＋咖啡，Poznań rugelach 兩人分享。07:55 出發搭電車', dur:'40 min'},
      {t:'08:00', label:'電車往 Armii Poznań 站', sub:'約 15 分；用 Jakdojade 查當下車號', cost:'依當日票價', dur:'15 min'},
      {t:'08:15', label:'★ Cytadela 公園「Nierozpoznani」', sub:'Magdalena Abakanowicz 的 112 尊無頭鑄鐵人像，可以走進人像之間；公園秋色。時間不夠先刪這段，08:30 直接去教堂島', cost:'免費', dur:'45 min'},
      {t:'09:00', label:'叫 Bolt 或 Uber 到 Rondo Śródka', sub:'約 10 分；搭電車可能要轉乘', cost:'依 App 報價', dur:'15 min'},
      {t:'09:25', label:'★ Śródka 立體壁畫', sub:'「Opowieść śródecka」整面樓的錯覺壁畫', cost:'免費', dur:'20 min'},
      {t:'09:45', label:'★ 教堂島 Ostrów Tumski', sub:'經約旦橋上島；主教座堂雙塔、旁邊哥德式的 In Summo 聖母教堂、Lubrański 學院與 Brama Poznania 都只看外觀（Brama Poznania 是收費展館不進）。正殿通常可以免費看一眼，收費的地下墓室和金禮拜堂不進；主教座堂上午幾點開放未查到，以現場為準', cost:'外觀免費', dur:'45 min'},
      {t:'10:30', label:'走 Chwaliszewo 街回老城', sub:'約 20 分', cost:'免費', dur:'20 min'},
      {t:'10:50', label:'皇家城堡山丘', sub:'重建的 Przemysł 王城外觀與旁邊方濟會教堂，從山丘俯瞰老城屋頂；觀景塔收費不上，只在外面拍', cost:'免費', dur:'15 min'},
      {t:'11:05', label:'咖啡 · Weranda Caffe', sub:'Świętosławska 10，週四 09:00 開門；就在粉紅色 Fara 教堂那條街，從街上拍 Fara', cost:'依店家', dur:'40 min'},
      {t:'11:45', label:'廣場卡正面位置', sub:'彩色商人小屋、四座噴泉、Bamberka 銅像、刑柱與衛兵所 Odwach 外觀；站市政廳正面', dur:'15 min · 提早卡位'},
      {t:'12:00', label:'★ 山羊鐘樓秀', sub:'官方每日 12:00 與 15:00 登場；本次採正午場，兩隻金屬山羊互頂 12 次。錯過還有 15:00 場，但仍須保留取行李與到站時間', cost:'免費', dur:'5 min'},
      {t:'12:05', label:'★ 聖馬丁牛角麵包 (PGI)', sub:'ROGAL Świętomarciński（Stary Rynek 11/17）；兩人分一個當點心，撐到 14:00 午餐。週四 09:00–20:00，排隊或售完改 Cukiernia Kandulski（Plac Ratajskiego 1，週四 09:00–17:00，官網 kandulski.pl）', cost:'依門市標價', dur:'20 min'},
      {t:'12:25', label:'自由廣場 Plac Wolności', sub:'從廣場西南角經耶穌會學院（今市政府）與粉紅色 Fara 教堂正面（正殿通常免費看一眼）往南；自由廣場上 Raczyński 圖書館、Arkadia 宮外觀', cost:'免費', dur:'20 min'},
      {t:'12:45', label:'★ Stary Browar', sub:'舊啤酒廠改建的商場，紅磚和工業風建築；有洗手間，逛到約 13:45，再步行約 10 分到 Carla', cost:'免費', dur:'1 h'},
      {t:'14:00', id:'d6-lunch', label:'午餐 · Carla Trattoria Moderna', sub:'Święty Marcin 34，週四 14:00 開門，14:00 準時入座；在 zjedz.my 訂 14:00 兩位。手工麵、披薩與小盤分享，兩人分享即可。15:15 前結帳；上菜慢、15:30 還沒吃完，就把帝王區縮短到只看帝王城堡外觀、跳過 Kaponiera，17:05 一定要到站。客滿或訂不到改 Pyra Bar（Strzelecka 13，週四 11:00–21:00）或 Zen On（Święty Marcin 21，週四 12:00–20:00），可改回 12:15 吃午餐', cost:'依店家', dur:'75 min'},
      {t:'15:15', label:'Okrąglak 圓形百貨外觀', sub:'飯後往西順路拍這棟現代主義圓形建築，只看外觀', cost:'免費', dur:'10 min'},
      {t:'15:25', label:'★ 聖馬丁街帝王區', sub:'繼續往西：Collegium Minus → 密茨凱維奇公園 → 1956 年六月事件紀念碑 → 大劇院 → 帝王城堡外觀（不進去，不用買聯票）', cost:'免費', dur:'35 min'},
      {t:'16:00', label:'Kaponiera 圓環', sub:'Abakanowicz 的另一組無頭人像「5 figur」（ul. Roosevelta 22）、Bałtyk 大樓', cost:'免費', dur:'15 min'},
      {t:'16:15', label:'取行李、前往 Poznań Główny', sub:'由 Kaponiera 走約 300 公尺回 Poznan Apartments Towarowa（Towarowa 37）或車站寄物櫃拿行李；寄放地點以出發前訊息確認的為準；17:05 前抵站', dur:'約 50 min'},
      {t:'17:05', label:'抵 Poznań Główny', sub:'確認月台、車廂與座位；拖行李保留進站緩衝', dur:'35 min 緩衝'},
      {t:'17:40', label:'EIC 8104 前往華沙', sub:'EIC 8104 已購票；17:40 → 19:59（Koleo，Peron II 抵達；列車名 BOLESŁAW PRUS），車廂與座位依票券詳細頁', cost:'票價未提供', dur:'2 h 19 min'},
      {t:'19:59', label:'抵 Warszawa Centralna', sub:'Koleo 19:59 到；步行至 Hotel Metropol 約 500 公尺，拖行李預留 10–15 分鐘'},
      {t:'21:00', id:'d6-dinner', label:'晚餐 · Arirang 韓式', sub:'Nowogrodzka 38，離 Metropol 步行約 5 分；Bulgogi、拌飯或 Jajangmyeon。週四 12:00–22:00（多個目錄一致），當天先打 22 881 78 51 或 22 622 18 86 確認仍接單；21:15 前還沒能入座就改中央車站對面 Złote Tarasy 速食（到 22:00），再晚改 24 小時的 Ćma', cost:'依店家', dur:'約 1 h'},
      {t:'22:00', label:'科學文化宮夜景（選配：Siatkarka 霓虹招牌）', sub:'回飯店途中拍打燈的科學文化宮；想再走一點可以去 Plac Konstytucji 看「排球少女 Siatkarka」老霓虹招牌', cost:'免費', dur:'20 min'},
    ],
    eat: [
      snack({text:'12:05 聖馬丁牛角麵包 @ ROGAL Świętomarciński', placeId:'poznan-rogal'}),
    ],
    backup: [
      {label:'下雨備案', where:'Stary Browar + 老城咖啡座', map:'https://www.google.com/maps/search/?api=1&query=Stary%20Browar%2C%20Polwiejska%2042%2C%20Poznan', why:'Stary Browar 和咖啡店都在室內，可以拉長；Carla 照 14:00，帝王區改快拍，16:15 仍要回去取行李'},
      {label:'Carla 客滿或訂不到', where:'Pyra Bar 或 Zen On', why:'Pyra Bar（Strzelecka 13，週四 11:00–21:00，波茲南馬鈴薯料理）或 Zen On（Święty Marcin 21，週四 12:00–20:00，Michelin 推薦拉麵）；中午就開，可以改回 12:15 吃午餐'},
    ],
  },
  {
    n: 7, date: '10/30 (五)', city: '華沙',
    title: '從最北邊往回逛 · 新城 + 老城全採點 + 瓦津基',
    headline: '收費館只路過拍外觀：MSN、科學文化宮、POLIN 一路往南，新城、老城、城堡廣場一次走完；下午薩克森花園、無名塚、蕭邦博物館外觀、BUW 屋頂花園與瓦津基湖邊日落',
    tag: 'City Walk',
    intensity: '高',
    hardConstraints: ['收費館只路過拍外觀不進：MSN、POLIN、居禮夫人博物館、華沙博物館、皇家城堡、Zachęta、蕭邦博物館', '老城與新城上午一次走完、不回頭；12:30 午餐', '水上宮殿入內是選配：週五個人參觀免費、10:00 開門，開放範圍以館方當日公告為準，想進要在最後入場 17:30 前；本次只排湖邊外觀', '16:12 日落前先在湖邊拍水上宮殿外觀', '晚餐 Soul Kitchen 18:30 先訂位並預留威靈頓'],
    compressible: ['BUW 屋頂花園（時間不夠先刪，從無名塚直接搭車去瓦津基，多出約 45 分）', '聖母訪親教堂、Piwna 街等小站只拍不停', '走回飯店改叫車'],
    steps: [
      {t:'07:30', id:'d7-breakfast', label:'早餐 · Bułkę przez Bibułkę', sub:'Zgoda 3，離 Metropol 步行約 8 分，平日 07:30 開門；Bagel、炒蛋或 Avocado Toast，08:05 前結帳', dur:'35 min'},
      {t:'08:05', label:'MSN 現代美術館＋科學文化宮外觀', sub:'去搭地鐵順路：Świętokrzyska 站口旁、Marszałkowska 103 的白色新館 MSN 與對面的科學文化宮早晨外觀；兩處都是收費館／觀景台，只在外面拍', cost:'免費', dur:'10 min'},
      {t:'08:15', label:'地鐵 M1 → Ratusz Arsenał', sub:'Świętokrzyska 站搭 M1 往北只坐 1 站，下車再走約 10 分到 POLIN；用 Jakdojade 查當下班次', cost:'75 分第 1 區票 4.40', dur:'約 20 min'},
      {t:'08:35', label:'★ POLIN 外觀＋猶太隔離區英雄紀念碑', sub:'POLIN 博物館的玻璃與裂縫造型；館前的隔離區英雄紀念碑、西德總理布蘭特下跪紀念碑。不進館', cost:'免費', dur:'25 min'},
      {t:'09:00', label:'★ 克拉辛斯基廣場', sub:'華沙起義紀念碑（戶外雕塑，不是起義博物館）、最高法院的綠色柱廊、克拉辛斯基宮外觀；花園可略過', cost:'免費', dur:'25 min'},
      {t:'09:25', label:'★ 新城廣場＋聖卡齊米日教堂', sub:'沿 Świętojerska、Freta 北段進新城；廣場中央的井、東側白色的聖禮修女會聖卡齊米日教堂', cost:'免費', dur:'15 min'},
      {t:'09:40', label:'聖母訪親教堂＋居禮夫人雕像', sub:'新城往東北短走：磚造哥德式教堂、高地上的居禮夫人雕像，往下看維斯瓦河；不下到河岸', cost:'免費', dur:'15 min'},
      {t:'09:55', label:'★ Freta 街：居禮夫人出生地 → 聖雅各 → 聖靈教堂', sub:'Freta 16 出生地外牆紀念牌（居禮夫人博物館不進）、聖雅各教堂、新城入口的聖靈教堂，一路往南外觀快拍', cost:'免費', dur:'15 min'},
      {t:'10:10', label:'★ 甕城 Barbakan＋城牆', sub:'城門內外兩側都拍；沿 Podwale 磚牆走，小小起義者銅像就在城牆外側', cost:'免費', dur:'20 min'},
      {t:'10:30', label:'Szeroki Dunaj → Wąski Dunaj', sub:'從城牆鑽回老城的兩條小巷與小廣場，接到老城廣場', cost:'免費', dur:'10 min'},
      {t:'10:40', label:'★ 老城廣場', sub:'美人魚像、四側彩色立面、北側華沙博物館的街屋外觀（不進館）；一次拍完廣場四面', cost:'免費', dur:'25 min'},
      {t:'11:05', label:'石階街 → Brzozowa → Gnojna Góra 觀景點', sub:'從 Kamienne Schodki 石階往下看河，沿 Brzozowa 窄街走到 Gnojna Góra 高地拍維斯瓦河；不下到河岸，省得再爬回來', cost:'免費', dur:'25 min'},
      {t:'11:30', label:'Kanonia 許願鐘 → 聖若望大教堂', sub:'Kanonia 小廣場的銅鐘、窄立面老屋 → 聖若望大教堂與隔壁耶穌會教堂；正殿通常可以免費看一眼，地下墓室收費不進', cost:'免費（地下墓室另收費）', dur:'20 min'},
      {t:'11:50', label:'★ 城堡廣場（白天版）', sub:'皇家城堡正面與鐘塔、齊格蒙特圓柱；廣場東南角的聖安妮教堂、往南 200 公尺的密茨凱維奇紀念碑與加爾默羅會教堂（10/24 傍晚已經過，白天光線再補拍）順路看。臨河那側的 Kubicki 拱廊開放時間以現場為準。不進城堡', cost:'免費', dur:'25 min'},
      {t:'12:15', label:'Piwna 街 → 聖馬丁教堂', sub:'從城堡廣場沿 Piwna 往北走到聖馬丁教堂門面，再原路回城堡廣場吃午餐', cost:'免費', dur:'15 min'},
      {t:'12:30', id:'d7-lunch', label:'午餐 · Polka', sub:'Świętojańska 2，就在城堡旁；平日 12:00–16:00 有午間套餐，點 Pierogi 或 Żurek，13:15 離開。客滿改 Pyzy Flaki Gorące（Podwale 5，甕城旁，週一到週六 12:00 開門）吃 pyzy 馬鈴薯丸子', cost:'依店家', dur:'45 min'},
      {t:'13:15', label:'劇院廣場', sub:'大劇院外觀、Nike 紀念碑；對面是重建的舊市政廳 Jabłonowski 宮', cost:'免費', dur:'15 min'},
      {t:'13:30', label:'薩克森花園', sub:'劇院廣場往南穿進華沙最老的公園：噴泉、19 世紀的日晷與兩側雕像，穿過去就到無名塚背面', cost:'免費', dur:'20 min'},
      {t:'13:50', label:'★ 無名塚與衛兵', sub:'plac Piłsudskiego、薩克森花園東側拱廊；衛兵整點換崗，14:00 剛好看一輪', cost:'免費', dur:'15 min'},
      {t:'14:05', label:'往東走到維斯瓦河邊', sub:'Królewska 往東：路過 Zachęta 國家美術館外觀 → 穿過皇家大道 → Tamka 街坡道上蕭邦博物館所在的 Ostrogski 宮外觀（2026 整修閉館，只拍外面）→ 下坡到河邊，約 1.8 公里', cost:'免費', dur:'30 min'},
      {t:'14:35', label:'★ BUW 屋頂花園＋河岸步道', sub:'華沙大學圖書館 Dobra 56/66，屋頂花園免費、開到 10/31；10 月時段 08:00–18:00（官網兩頁一致，08:00–20:00 是 5–9 月夏季時段），14:35 去在開放時間內；11/1 起不開放屋頂。接著走河岸步道；哥白尼科學中心在南邊約 600 m，只從河岸遠拍、不專程走過去。時間不夠先刪這段', cost:'免費', dur:'30 min'},
      {t:'15:05', label:'搭車前往瓦津基公園', sub:'由 BUW 搭公車或叫車往瓦津基北門，約 20 分', cost:'依交通方式', dur:'約 20 min'},
      {t:'15:25', label:'★ 瓦津基公園', sub:'蕭邦紀念碑、紅松鼠、孔雀；花園每日 06:00–21:00 免費。園內有免費廁所，位置看入口的園區地圖', cost:'免費', dur:'20 min'},
      {t:'15:45', label:'★ 瓦津基 · 水上宮殿', constraint:{venue:'warsaw-lazienki-palace'}, sub:'以湖邊外觀為主：16:12 日落時拍宮殿倒影，順路看湖上圓形劇場、舊橘園與 Myślewicki 宮外觀。宮殿週五個人參觀免費（最後入場 17:30，以館方當日公告為準），不排入，想進再進', cost:'免費', dur:'45 min'},
      {t:'16:30', label:'往北走 → 三十字廣場', sub:'Belweder 外觀 → Aleje Ujazdowskie 林蔭大道 → Ujazdowski 城堡外觀 → 三十字廣場的聖亞歷山大教堂圓頂（米其林 NUTA 就在廣場邊，只路過），約 2 公里。天黑、累了或下雨就叫車', cost:'免費', dur:'約 35 min'},
      {t:'17:15', label:'下午點心 · QQ Warsaw 抹茶', sub:'Żurawia 32/34，從三十字廣場沿 Żurawia 往西走約 8 分；週五 11:00–20:00、廚房至 19:30（店家 Instagram，另有目錄列週二休）。抹茶拿鐵為主，韓式吐司兩人分一份就好，18:30 還有晚餐', cost:'依店家', dur:'20 min'},
      {t:'17:35', label:'回 Metropol 休息、換衣服', sub:'Żurawia 走回 Marszałkowska 約 5 分；放東西、加外套'},
      {t:'18:30', id:'d7-dinner', label:'最後晚餐 · Soul Kitchen 威靈頓牛排', sub:'Nowogrodzka 18A，Metropol 步行約 8 分；多個評論來源列 Beef Wellington 為招牌，配韃靼牛肉或 Żurek。菜單隨季節換，Wellington 常需預留，訂位時一併確認 10/30 有供應並請店家留份；沒有就改 Rusiko（Wierzbowa 11，喬治亞菜）', cost:'依菜單', dur:'1.5 h'},
      {t:'20:15', label:'可選 · E.Wedel 本店熱巧克力', sub:'Szpitalna 8，開到 22:00；喝完散步回飯店整理行李。隔天早上 08:00 早餐、09:45 退房', cost:'依店家', dur:'約 30 min'},
    ],
    eat: [],
    warn: '✅ 新行程不進付費館：皇家城堡、華沙起義博物館、POLIN、居禮夫人博物館、華沙博物館都只看外觀，不用買票。水上宮殿週五個人參觀免費（以館方當日公告為準），10:00–18:00、最後入場 17:30；日落 16:12，在湖邊拍倒影。❗晚餐 Soul Kitchen 18:30 訂位時請店家預留威靈頓。BUW 屋頂花園 10 月開放 08:00–18:00，14:35 去都在開放時間內。瓦津基花園每日 06:00–21:00 免費。蕭邦博物館 2026 全年整修閉館，本趟不列入。',
    extend: [
      {label:'華沙起義博物館外觀＋紀念牆', when:'下午體力夠、想刪 BUW 時替代', map:'https://www.google.com/maps/search/?api=1&query=Muzeum%20Powstania%20Warszawskiego%2C%20Grzybowska%2079%2C%20Warszawa', why:'Grzybowska 79，在 Wola 區、不在步行路線上，從無名塚搭車約 15 分；收費館不進，只拍紅磚電車廠房外觀與館外的起義紀念'},
      {label:'Hala Koszyki 美食大廳', when:'晚餐後', map:'https://www.google.com/maps/search/?api=1&query=Hala%20Koszyki%2C%20Koszykowa%2063%2C%20Warszawa', why:'Koszykowa 63，百年市場改建的鐵架大廳，週五大廳開到 01:00（各攤位時間另查）；從 Soul Kitchen 走約 15 分，想看華沙年輕人的週五夜晚可以繞過去喝一杯'},
      {label:'Bulwary Wiślane 維斯瓦河畔', when:'晚餐後', map:'https://www.google.com/maps/search/?api=1&query=Bulwary%20Wi%C5%9Blane%2C%20Warszawa', why:'河濱步道，城堡廣場步行 10–15 分，晚餐後想散步再去，免費'},
      {label:'Neon Museum 霓虹燈博物館', when:'下雨、取消瓦津基時替代', map:'https://www.google.com/maps/search/?api=1&query=Neon%20Muzeum%2C%20plac%20Defilad%201%2C%20Warszawa', why:'已遷入科學文化宮 4 樓（Marszałkowska 入口），共產時期霓虹招牌收藏，PLN 28／優待 18，離飯店最近的室內選項'},
      {label:'科學文化宮 30F 觀景台', when:'晚餐前', map:'https://www.google.com/maps/search/?api=1&query=Pa%C5%82ac%20Kultury%20i%20Nauki%2C%20plac%20Defilad%201%2C%20Warszawa', why:'全票 30／優待 25 PLN · 每日開放與售票皆至 20:00；10/30 沒有晚間延長場，17:00 後已是夜景'},
    ],
    backup: [
      {label:'Polka 客滿', where:'Pyzy Flaki Gorące（Podwale 5，甕城旁）', map:'https://www.google.com/maps/search/?api=1&query=Pyzy%20Flaki%20Gor%C4%85ce%2C%20Podwale%205%2C%20Warszawa', why:'週一到週六 12:00 開門，吃華沙在地的 pyzy 馬鈴薯丸子'},
      {label:'體力不足', where:'刪 BUW 屋頂花園，無名塚後直接搭車去瓦津基', why:'多出約 45 分；走回飯店那段也可以改叫車，不影響 18:30 晚餐'},
      {label:'下雨', where:'老城改快拍；下午改 Hala Koszyki 美食大廳和 Złote Tarasy', map:'https://www.google.com/maps/search/?api=1&query=Hala%20Koszyki%2C%20Koszykowa%2063%2C%20Warszawa', why:'水上宮殿室內照樣可以進（週五免費）；戶外淋雨意義不大'},
    ],
  },
  {
    n: 8, date: '10/31 (六)', city: '華沙 → 多哈',
    title: '機場日 · 14:40 QR 260 起飛',
    headline: '從容收尾 · SKM 機場線約 25–30 分鐘，另留候車與找月台時間',
    tag: 'Departure',
    intensity: '低',
    hardConstraints: ['11:00 前抵達華沙蕭邦機場', '如需退稅需預留更多機場時間', '不排正式景點'],
    compressible: ['飯店周邊散步', '最後採買'],
    steps: [
      {t:'07:50', label:'住宿出發前往 Zgoda 3', sub:'行李先留住宿，步行約 8 分；週六 08:00 開門', dur:'10 min'},
      {t:'08:00', id:'d8-breakfast', label:'早餐 · Bułkę przez Bibułkę', sub:'Zgoda 3，週六 08:00–22:00；Bagel、炒蛋或 Avocado Toast，08:50 收尾。08:15 還無法入座就外帶或改車站沿線，保住機場交通', cost:'依店家', dur:'50 min'},
      {t:'08:50', label:'返回 Metropol 取行李', sub:'步行約 8 分回住宿，09:30 前取齊行李並辦理退房，09:45 出發；多出的時間可在 Złote Tarasy（09:00 開門）補伴手禮，09:30 前回飯店', dur:'55 min'},
      {t:'09:45', label:'退房 → Śródmieście（S2）或 Warszawa Centralna（S3）', sub:'由 Hotel Metropol 出發，以 S2 為主：Warszawa Śródmieście 站口就在飯店旁約 250 公尺，拖行李最短，不用往回走；當日 WTP 查到先開的是 S3，才走約 500 公尺到 Centralna。預留找月台緩衝', dur:'30–45 min'},
      {t:'10:30', label:'SKM S2／S3 目標班次', sub:'回程往機場方向：S2 由 Warszawa Śródmieście 上車、S3 由 Warszawa Centralna 上車（兩線停靠站不同，看清楚再上）。官方標示 75 分鐘第 1 區票；當日查 WTP 月台與發車時間', cost:'75 分第 1 區票 4.40', dur:'約 25–30 min'},
      {t:'11:00', label:'抵 Chopin 第一航廈'},
      {t:'11:15', label:'退稅文件 + 報到 + 安檢', sub:'如有 TAX FREE 商品，依機場與電子文件指示辦理；託運商品須在交運前備妥供海關查驗', dur:'預留至少 60–90 min'},
      {t:'安檢與出境後', timingMode:'relative', id:'d8-lunch', label:'機場午餐 · 依登機區選擇', sub:'先確認登機門與截止時間，再找可通行區域內的餐廳；QR 260 往多哈不把申根區 Gate One 當作主選'},
      {t:'14:40', label:'★ QR 260 起飛', sub:'WAW → DOH → HKG → TPE'},
      {t:'機上', timingMode:'relative', id:'d8-dinner', label:'機上晚餐', sub:'依實際航段供餐；轉機時先確認下一段登機門與截止'},
    ],
    eat: [],
    backup: [
      {label:'早餐備案', where:'Warszawa Centralna 車站內當日營業的咖啡或麵包店', map:'https://www.google.com/maps/search/?api=1&query=Warszawa%20Centralna%20coffee%20bakery', why:'Zgoda 3 客滿時，退房後往 Centralna 搭 S3 的沿線；店家和週六開門時間尚未指定，前一晚確認。Bar Mleczny Prasowy（Marszałkowska 10/16）週六 09:00 才開且不順路，不列為 08:00 早餐備案'},
      {label:'班機提早 2 h', where:'蕭邦機場 1F Costa Coffee · 觀景窗', map:'https://www.google.com/maps/search/?api=1&query=Warsaw%20Chopin%20Airport%20Terminal%20A', why:'退稅 + 安檢順可能 12:30 就過關，1F 貴賓區外有平價咖啡'},
      {label:'紀念品最後採買', where:'先在飯店旁 Złote Tarasy 補齊，機場店只作最後備案', map:'https://www.google.com/maps/search/?api=1&query=Z%C5%82ote%20Tarasy%2C%20Z%C5%82ota%2059%2C%20Warszawa', why:'Złote Tarasy 就在 Warszawa Centralna 對面、距 Hotel Metropol 約 500 公尺，一–六約 09:00 開門；早餐改在 Zgoda 3 後約 09:00 回到飯店，09:05–09:30 可補買約 25 分鐘，仍需往返與結帳；伴手禮宜前一天買齊，機場價差不作預算依據'},
    ],
  },
];

export const flights = {
  out: [
    {code:'CX 479',  leg:'TPE → HKG', when:'10/23 五 21:05 → 23:05', dur:'2h00m', status:'已購票'},
    {code:'⇄ HKG',   leg:'轉機',       when:'2h20m', dur:'', layover:true},
    {code:'QR 815',  leg:'HKG → DOH', when:'10/24 六 01:25 → 04:50', dur:'8h25m', status:'已購票'},
    {code:'⇄ DOH',   leg:'轉機',       when:'3h40m', dur:'', layover:true},
    {code:'QR 259',  leg:'DOH → WAW', when:'10/24 六 08:30 → 13:30', dur:'6h00m', status:'已購票'},
  ],
  back: [
    {code:'QR 260',  leg:'WAW → DOH', when:'10/31 六 14:40 → 22:10', dur:'5h30m', status:'已購票'},
    {code:'⇄ DOH',   leg:'轉機',       when:'3h55m', dur:'', layover:true},
    {code:'QR 818',  leg:'DOH → HKG', when:'11/1 日 02:05 → 14:50', dur:'7h45m', status:'已購票'},
    {code:'⇄ HKG',   leg:'轉機',       when:'4h50m', dur:'', layover:true},
    {code:'BR 872',  leg:'HKG → TPE', when:'11/1 日 19:40 → 21:25', dur:'1h45m', status:'已購票'},
  ],
};

export const stay = [
  {
    id:'warsaw-metropol-arrival', city:'華沙', name:'Hotel Metropol',
    checkIn:'2026-10-24', checkOut:'2026-10-25', checkInTime:'15:00', checkOutTime:'12:00', nights:1,
    address:'ul. Marszałkowska 99a, 00-693 Warszawa', addressVerified:true, rooms:1, status:'已確認',
    coordinates:{lat:52.22901, lng:21.01099, status:'已核對', checkedAt:'2026-08-11'},
    officialUrl:'https://www.hotelmetropol.com.pl/pl/',
    phone:'+48 22 32 53 100', phoneSource:{url:'https://www.hotelmetropol.com.pl/pl/', checkedAt:'2026-10-06'},
    note:'第一段華沙住宿（2026-09 換訂本館，兩段華沙住宿現為同一家）。位置在 Marszałkowska／Metro Centrum 出口正對面，步行至 Warszawa Centralna 約 500 公尺；入住 15:00 起、退房 12:00 前，櫃檯可寄放行李。時間依公開訂房資料，抵達前再以訂房確認核對。',
  },
  {
    id:'krakow-stare-miasto', city:'克拉科夫', name:'ibis budget Krakow Stare Miasto',
    checkIn:'2026-10-25', checkOut:'2026-10-27', checkInTime:'15:00', checkOutTime:'12:00', nights:2,
    address:'ul. Pawia 11, 31-154 Kraków', addressVerified:true, rooms:1, status:'已確認',
    coordinates:{lat:50.07075, lng:19.946163, status:'已核對', checkedAt:'2026-08-11'},
    officialUrl:'https://all.accor.com/hotel/7165/index.en.shtml',
    phone:'+48 12 355 29 50', phoneSource:{url:'https://all.accor.com/hotel/7165/index.en.shtml', checkedAt:'2026-10-06'},
    note:'位於 Kraków Główny 與 Galeria Krakowska 旁。10/06 官網確認入住 15:00 起、退房 12:00 前，提供寄物服務；私人訂房約定仍以確認信為準。',
  },
  {
    id:'wroclaw-piast', city:'樂斯拉夫', name:'Piast',
    checkIn:'2026-10-27', checkOut:'2026-10-28', checkInTime:'14:00', checkOutTime:'12:00', nights:1,
    address:'Piłsudskiego 98, Wrocław', addressVerified:true, rooms:1, status:'已確認',
    coordinates:{lat:51.10013, lng:17.03569, status:'已核對', checkedAt:'2026-08-11'},
    officialUrl:'https://piastwroclaw.pl/',
    phone:'+48 71 796 62 00', phoneSource:{url:'https://piastwroclaw.pl/kontakt/', checkedAt:'2026-10-06'},
    note:'住宿訂單已確認，門牌 Piłsudskiego 98 已核對；飯店官網目前未正常顯示完整地址，仍建議出發前用訂房確認再核對一次。',
  },
  {
    id:'poznan-towarowa', city:'波茲南', name:'Poznan Apartments Towarowa',
    checkIn:'2026-10-28', checkOut:'2026-10-29', checkInTime:'15:00', checkOutTime:'11:00', nights:1,
    address:'Towarowa 37/201, 61-896 Poznań', addressVerified:true, rooms:1, status:'已確認',
    coordinates:{lat:52.403903, lng:16.915609, status:'接待處座標已核對', checkedAt:'2026-08-11'},
    officialUrl:'https://www.poznanapartments.com/kontakt',
    phone:'+48 531 000 209', phoneSource:{url:'https://www.poznanapartments.com/kontakt', checkedAt:'2026-10-06'},
    note:'此處為官方接待與取鑰匙地址；實際公寓門牌以私人訂房確認為準。',
  },
  {
    id:'warsaw-metropol', city:'華沙', name:'Hotel Metropol',
    checkIn:'2026-10-29', checkOut:'2026-10-31', checkInTime:'15:00', checkOutTime:'12:00', nights:2,
    address:'ul. Marszałkowska 99a, 00-693 Warszawa', addressVerified:true, rooms:1, status:'已確認',
    coordinates:{lat:52.22901, lng:21.01099, status:'已核對', checkedAt:'2026-08-11'},
    officialUrl:'https://www.hotelmetropol.com.pl/pl/',
    phone:'+48 22 32 53 100', phoneSource:{url:'https://www.hotelmetropol.com.pl/pl/', checkedAt:'2026-10-06'},
    note:'第二段華沙住宿，與第一段同館同址，行李寄放與周邊動線可沿用 Day 1 經驗。10/29 EIC 8104 抵 Warszawa Centralna 後步行約 500 公尺即到；10/31 退房 12:00 前，當日 09:45 出發搭機不受影響。',
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
  {
    name: 'Lajkonik 官方售票網站（lajkonikbus.pl）',
    url: 'https://www.lajkonikbus.pl/',
    note: '由官方售票頁確認為現行網域（專案先前使用的舊網域已全面更新）。首頁即為查詢表單，可切換 English，另有 Where is my bus?（即時車輛位置）與 My Ticket（查已購票）。Auschwitz 往返請用下方「Auschwitz 巴士」區塊的查詢參數操作。',
  },
  {
    name: 'Moj Bus 售票網站（moj-bus.pl）',
    url: 'https://moj-bus.pl/en',
    note: 'Kraków ⇄ Oświęcim 路線的另一個巴士訂位入口，網址帶 /en 即為英文介面。Lajkonik 採用的 15:30（或備案 16:30）客滿、或想比對其他時段時用這裡⚠️ 班次、票價與上下車點請出發前自行於該站確認——尤其要確認停靠的是博物館門口還是 Oświęcim 市區站。',
  },
];

// auschwitzBus 的正本已搬到 rail.js（segments 的 Lajkonik 段也從這裡推導）；
// 這裡原樣重新匯出，既有的 import { auschwitzBus } from './trip.js' 都不用改。
export { auschwitzBus };

export const railPurchaseSteps = [
  {
    title: '先用官方時刻表找直達班次',
    detail: '在 Passenger Portal 輸入出發站、抵達站、日期與目標時間，勾選 Direct connections。四段起點依序使用 Warszawa Centralna、Kraków Główny、Wrocław Główny、Poznań Główny；已購四段仍以票面站名為準。',
  },
  {
    title: '逐張核對 PKP App 已購車票',
    detail: '10/25 EIP 5300、10/27 IC 3830、10/28 IC 260、10/29 EIC 8104 均已在旅客 App 票券清單；請逐張開啟票券詳細頁，核對抵達時間、艙等、車廂、座位與票價，並保存離線副本。',
  },
  {
    title: '選車種、艙等與正確優惠資格',
    detail: '優先選直達 EIP／EIC／IC／TLK，依實際抵達時間與預算決定。沒有符合波蘭法定優惠資格就選一般成人票，不自行套用學生或年齡折扣。',
  },
  {
    title: '確認座位與旅客資料再付款',
    detail: '依系統畫面選 2 等座、座位偏好與同行人數；付款前核對日期、起訖站、車次、發到時間、車廂與座位。',
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
  {tier:'第一優先', note:`四段城際火車、Auschwitz 導覽、Lajkonik 去程與鹽礦已訂妥；回程巴士${lajkonikInboundOpen ? '依售票頁確認座位' : lajkonikInboundState}`, items:[
    {name:'Auschwitz 官方英文導覽（10/26 10:30 已訂妥）', url:ticketPurchaseById('krakow-auschwitz').purchaseUrl},
    {name:'Wieliczka 鹽礦英文團（10/27 09:00 已購票）', url:ticketPurchaseById('krakow-wieliczka').purchaseUrl},
    {name:`Lajkonik 巴士（去程 ${lajkonikOutboundAdopted.dep} → ${lajkonikOutboundAdopted.arr} 已購票；回程 ${lajkonikInboundAdopted.dep} → ${lajkonikInboundAdopted.arr} ${lajkonikInboundState}）`, url:'https://www.lajkonikbus.pl/'},
    {name:'華沙 → 克拉科夫 EIP 5300（已購票；核對抵達時間與座位）', url:'https://www.intercity.pl/en/'},
    {name:'克拉科夫 → 樂斯拉夫 IC 3830（已購票；核對抵達時間與座位）', url:'https://www.intercity.pl/en/'},
    {name:'樂斯拉夫 → 波茲南 IC 260（已購票；核對抵達時間與座位）', url:'https://www.intercity.pl/en/'},
    {name:'波茲南 → 華沙 EIC 8104（已購票；核對抵達時間與座位）', url:'https://www.intercity.pl/en/'},
  ]},
  {tier:'第二優先', note:'10/25 辛德勒與 Wawel 線上已售完，當天現場再試；新行程不進付費館，華沙起義博物館、皇家城堡與全景畫不用訂了', items:[
    {name:'辛德勒工廠（10/25 線上已售完，當天現場再試；最後入場 18:30）', url:ticketPurchaseById('krakow-schindler').purchaseUrl},
    {name:'Wawel 城堡短路線 15:15（10/25 線上已售完，當天現場再試）', url:ticketPurchaseById('krakow-wawel-castle').purchaseUrl},
  ]},
  {tier:'餐廳與備案', note:'❗全部尚未訂（旅客確認）· 優先訂 Mr. Jerry 與 Soul Kitchen，再訂 Hankki、Specjały 與 Pimiento、Carla 兩頓午餐', items:[
    {name:'Mr. Jerry 10/26 18:30（Beef Wellington；官網訂位）', url:'https://www.mrjerry.pl/rezerwacja-krakow/'},
    {name:'Soul Kitchen 10/30 18:30（線上訂位或請飯店櫃檯代訂，備註預留 Beef Wellington；沒有改 Rusiko）', url:'https://restaurantguru.com/Soul-Kitchen-Warsaw'},
    {name:'Hankki 10/25 19:15（MojStolik 線上訂位）', url:'https://mojstolik.pl/restauracja/Hankki/f733c19bc164a5ad85848d96dc851be9'},
    {name:'Specjały Regionalne 10/24 18:30（TheFork 訂位）', url:'https://www.thefork.com/restaurant/specjaly-regionalne-restauracja-polska-stare-miasto-r858538'},
    {name:'Pimiento 10/25 13:00 兩位（尚未訂；官網表單或 Email pimiento@pimiento.pl；官網線上訂位不含這間分店）', url:'https://pimiento.pl/stary-kleparz/'},
    {name:'Carla Trattoria Moderna 10/29 14:00 兩位（zjedz.my 線上訂位）', url:'https://zjedz.my/carla-trattoria-moderna'},
    {name:'（選配）Restauracja Wrocławska 10/28 12:00 兩位（官網留言或請旅館櫃檯代訂，可省排隊時間）', url:'https://restauracja-wroclawska.eatbu.com/?lang=en'},
  ]},
];

export const reservations = [
  {when:'✅ 已完成', what:'Auschwitz 英文官方導覽 — 10/26 10:30 個人 educator 導覽（約 3 小時 45 分，2 人）已訂妥。入場憑電子入場證＋證件，出發前存離線。'},
  {when:'✅ 已完成', what:'Wieliczka 鹽礦英文 Tourist Route — 10/27 09:00 已購票（付款）；票券 PDF 存離線，訂單編號只存私人資料。'},
  {when:'✅ 去程已購', what:`Lajkonik 巴士 10/26 ${lajkonikOutboundAdopted.dep} → ${lajkonikOutboundAdopted.arr} 已購 2 張全票；回程 ${lajkonikInboundAdopted.dep} ${lajkonikInboundState}${lajkonikInboundOpen ? '，可線上或當天向司機買' : ''}。`},
  {when:'現在可先訂', what:'行程餐廳：10/26 Mr. Jerry（威靈頓）、10/30 Soul Kitchen（威靈頓）先訂，再訂 10/25 Hankki、10/24 Specjały，以及 10/25 Pimiento、10/29 Carla 兩頓午餐；米其林星級餐廳（Bottiglieria 1881、BABA／Most、WANDAL）未排入行程，想加需另外訂並重排晚餐'},
  {when:'火車票：已購 4／4 段', what:'App 票券清單已有 10/25 EIP 5300（Warszawa Centralna 08:40）、10/27 IC 3830（Kraków Główny 16:45）、10/28 IC 260（Wrocław Główny 19:10）、10/29 EIC 8104（Poznań Główny 17:40）。四段抵達時間已由 Koleo （11:10、19:50、20:29、19:59）；艙等、車廂、座位與票價待查票券詳細頁。'},
  {when:'不用訂了', what:'新行程付費景點只在外面拍照：樂斯拉夫全景畫、華沙起義博物館、華沙皇家城堡都不用買票；華沙水上宮殿週五免費，照樣可以進去。'},
  {when:'出發前傳訊息', what:'Poznan Apartments（訂房平台訊息或 Email）：10/28 晚上怎麼拿鑰匙、10/29 早上 07:00 能不能寄行李；不能寄就改用 Poznań Główny 車站寄物櫃。'},
  {when:'出發前 1 週', what:'臨時活動與維修可能變動，出門前看一下官網公告'},
  {when:'當天現場再試', what:'10/25 Wawel 15:15 短路線與辛德勒工廠 17:30 線上已售完，不再提醒；照原時段到售票處問剩餘票，買不到 Wawel 只逛庭院與外觀，買不到辛德勒就提早吃晚餐。'},
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
    id: 'dining-michelin', date: '2026-10-19', category: '餐飲',
    title: '行程餐廳訂位（Mr. Jerry、Soul Kitchen、Hankki、Specjały、Pimiento、Carla）',
    action: '先訂兩家晚餐主選：10/26 Mr. Jerry 18:30（官網線上訂位，備註預留 Beef Wellington）、10/30 Soul Kitchen 18:30（線上訂位或請 Hotel Metropol 櫃檯代訂，備註預留 Beef Wellington；沒有就改 Rusiko）；再訂 10/25 Hankki 19:15（MojStolik）與 10/24 Specjały Regionalne 18:30（TheFork）；兩頓午餐 10/25 Pimiento 13:00（官網表單或 Email，Stary Kleparz 店無線上訂位）與 10/29 Carla Trattoria Moderna 14:00（zjedz.my）也要訂。米其林星級餐廳未排入行程，想加再另外訂。',
    status: null, todoRef: {group:'dining', nameIncludes:['Specjały','Pimiento','Hankki','Mr. Jerry','Carla','Soul Kitchen']},
    url: 'https://www.mrjerry.pl/rezerwacja-krakow/',
    basis: '行前提醒「熱門餐廳出發前 3–4 週訂」，原取下緣 3 週（10/02）已過；依改排後的每日晚餐更新店名，補上待辦頁已列的兩家午餐訂位；因 10/02 已過、仍有 6 項未訂，行動期限改為出發前 4 天的 10/19（尚有 6 項未訂，留 3 天等訂位回信與時差）。',
  },
  {
    id: 'ticket-wieliczka', date: '2026-10-02', category: '門票',
    title: 'Wieliczka 鹽礦 10/27 英語團',
    action: '10/27 09:00 英文 Tourist Route；票券 PDF 存離線，訂單編號只存私人資料。',
    status: null, todoRef: {group:'attractions', ticketPurchaseIds:['krakow-wieliczka']}, url: ticketPurchaseById('krakow-wieliczka').purchaseUrl,
    basis: '訂票優先順序列為第一優先「現在即可訂」；指定日場次有限，取出發前 3 週為行動下限。',
  },
  {
    id: 'bus-lajkonik', date: '2026-10-22', category: '交通',
    title: 'Lajkonik 回程巴士購票',
    action: `回程班次 ${lajkonikInboundAdopted.dep} → ${lajkonikInboundAdopted.arr}，備案 ${lajkonikInboundBackup.dep}。可在 moj-bus.pl 線上買，或當天上車向司機買（全票 27 zł）；付款前看售票頁的座位。`,
    status: null, todoRef: {group:'rail', nameIncludes:['Lajkonik 回程']}, url: 'https://www.lajkonikbus.pl/',
    basis: '待辦事項該筆的 recheckAt = 2026-10-22。',
  },
  {
    id: 'etias-check-2', date: '2026-10-20', category: '證件',
    title: 'ETIAS 最終確認',
    action: 'ETIAS 尚未啟用、不收申請；10/23 出發前最後確認一次，僅在本次旅行已需授權時申請。EES 入境登錄已運作，須留現場登錄時間。',
    status: '待確認', url: 'https://travel-europe.europa.eu/etias_en',
    basis: '資料庫項目 entry-etias-and-passport 已於 10/06 重查官方狀態，並排；本筆是出發前 3 天的最後決策點，兩者互補不重複。',
  },
], todoGroups);
