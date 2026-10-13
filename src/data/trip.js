import { resolveDining } from './dining-places.js';
import { segments, auschwitzBus, lajkonikFare } from './rail.js';
import { resolveVenue } from '../lib/venues.mjs';
import { ticketPurchaseById } from './ticket-purchases.js';
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

// 精煉切片 4b：兩個步驟的 sub 裡原本手打了一次開放時間，剛好與 constraint.venue
// 指到的場館 hours 完全同義（辛德勒工廠、皇家城堡）；改成從 venues.js
// 用 template literal 帶出，不再另打一份數字。其餘掛 constraint.venue 的步驟
// （Wawel 短路線比較四條子路線票價、百年廳的四色日曆說明）不是單一場館 hours
// 可以乾淨代換的內容，保留原文，不勉強套用。
const schindlerVenue = resolveVenue('krakow-schindler');
const royalCastleVenue = resolveVenue('warsaw-royal-castle');

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
    title: '抵達華沙 · 皇家大道傍晚散步',
    headline: '13:30 抵蕭邦機場，換匯後沿皇家大道看日落，晚餐後逛 Złote Tarasy',
    tag: 'Arrival',
    intensity: '低',
    hardConstraints: ['首次 EES 入境登錄與提行李時間不保證；進城延後就縮短皇家大道散步', '換匯用週六有開的 REDAR 分店 II（08:00–20:00），不要等 Hotel Metropol 樓下的總店', '不進皇家城堡、不深入老城（完整留到 10/30）', '21:30 前回飯店，隔天 07:15 出發'],
    compressible: ['皇家大道散步範圍', 'Café Bristol 咖啡', 'Złote Tarasy 逛街時間'],
    steps: [
      {t:'機上', timingMode:'relative', id:'d1-breakfast', label:'機上早餐／出發前自理', sub:'依實際航段供餐'},
      {t:'抵達前後', timingMode:'relative', id:'d1-lunch', label:'機上、機場或抵達後輕食', sub:'三明治與熱飲即可，依落地及入住情況調整'},
      {t:'13:30', label:'抵蕭邦機場', sub:'申根入境、EES 首次護照／指紋與臉部登錄 + 提行李約 75 min（規劃估計）；排隊延長即順延進城，壓縮老城散步', cost:'—', dur:'75 min'},
      {t:'14:45', label:'SKM S2／S3 目標班次', sub:'2026-09-17 WTP 官方機場交通頁：S2 停 Warszawa Śródmieście、S3 停 Warszawa Centralna，兩線都不互停，官方標示買 75 分鐘第 1 區票。上車先看是 S2 還 S3——S2 坐到 Śródmieście 出站即 Metro Centrum、飯店在對街；S3 要在 Centralna 下車再步行。月台與即時班次抵達後查 WTP', cost:'75 分第 1 區票 4.40', dur:'25–30 min'},
      {t:'15:15', label:'Hotel Metropol Check-in', sub:'入住 15:00 起，提早到可先寄放行李再出門；抵達較晚就把後面全部順延', dur:'30 min'},
      {t:'15:45', label:'換匯 · REDAR.net 分店 II', sub:'Metro Centrum／Rotunda 地下通道 Lokal 33，離飯店步行約 5 分；官網週六 08:00–20:00。Hotel Metropol 樓下的 REDAR 總店（Marszałkowska 99A）只列週一至週五，不要等它。現場看現鈔買賣價，線上預訂匯率不等於臨櫃牌告', cost:'—', dur:'20 min'},
      {t:'16:05', label:'新世界街 → 哥白尼紀念碑 → 聖十字教堂', sub:'由 Rotunda 沿 Nowy Świat 往北走，戶外街景為主；聖十字教堂（蕭邦心臟安放處）能否入內視當時彌撒', cost:'免費', dur:'45 min'},
      {t:'16:50', label:'★ 總統府外觀', sub:'Krakowskie Przedmieście 48/50，建築外觀拍照；日落 17:23，17:20 前拍完皇家大道的戶外重點', cost:'免費', dur:'20 min'},
      {t:'17:10', label:'Café Bristol 咖啡（可略過）', sub:'就在總統府隔壁的 Hotel Bristol，Bristol cake 配咖啡（週六 08:00–21:00）；累了就直接慢慢走回 Nowy Świat 準備晚餐', cost:'依店家', dur:'45 min'},
      {t:'18:00', label:'沿皇家大道走回 Nowy Świat', sub:'Krakowskie Przedmieście 一路往南約 15 分，天黑後看街燈', cost:'免費', dur:'20 min'},
      {t:'18:30', id:'d1-dinner', label:'波蘭地方料理晚餐', sub:'Specjały Regionalne · Nowy Świat 44；Żurek＋綜合 Pierogi，主菜選梅醬豬肋排或半隻烤鴨。出發前確認當日營業', cost:'PLN 35–55', dur:'1 h 15 min'},
      {t:'20:00', label:'Złote Tarasy 購物中心', sub:'Złota 59（中央車站旁），週六商場至 22:00、個別店家時間不同；逛街之外順便買隔天早上的備用麵包與水', cost:'購物另計', dur:'約 1 h 15 min'},
      {t:'21:30', label:'回飯店休息', sub:'由 Złote Tarasy 步行約 10 分回 Metropol；隔天 07:15 出發往中央車站'},
    ],
    eat: [
      snack({text:'甜點 @ Pijalnia Czekolady E.Wedel（Szpitalna 8）', placeId:'warsaw-wedel-szpitalna-8'}),
    ],
    backup: [
      {label:'下雨備案', where:'科學文化宮 30F 觀景台', why:'全票 30／優待 25 PLN（2026-09-18 官方售票系統查證）· 每日 10:00–20:00 · 室內 + 360° 城景；從老城前往須另抓交通時間，依當下導航確認', map:'https://www.google.com/maps/search/?api=1&query=Pa%C5%82ac%20Kultury%20i%20Nauki%2C%20plac%20Defilad%201%2C%20Warszawa'},
      {label:'時差太累', where:'Łazienki 公園散步', why:'2026-09-19 官網複核：花園每日 06:00–22:00 免費；蕭邦像在戶外，館舍另有門票與開放時間，不能當成免費室內備案。抵達日仍以體力與交通時間決定是否前往', map:'https://www.google.com/maps/search/?api=1&query=%C5%81azienki%20Kr%C3%B3lewskie%2C%20Agrykola%201%2C%20Warszawa'},
    ],
    practical: [
      {tag:'寄物', name:'飯店櫃檯優先', note:'Hotel Metropol 櫃檯提供行李寄放，15:00 前抵達先寄物；車站寄物櫃只作備案，尺寸、空位與費率會變動'},
      {tag:'換錢', name:'REDAR.net 分店 II（週六有開）', note:'Metro Centrum／Rotunda 地下通道 Lokal 33，官網週一至六 08:00–20:00、週日 10:00–18:00，電話 22 602 22 20；Hotel Metropol 樓下的總店（Oddział I）只列平日。現場比較買入與賣出價，不以「0% 手續費」代替實際匯率判斷'},
      {tag:'SIM', name:'Play / Plus / Orange', note:'預付卡需實名登記；通路、容量與價格以抵達當日電信商方案為準'},
    ],
  },
  {
    n: 2, date: '10/25 (日)', city: '華沙 → 克拉科夫',
    title: 'Wawel + 老城 + 辛德勒工廠 + Hankki 晚餐',
    headline: 'EIP 5300 已購票：08:40 由 Warszawa Centralna 出發；抵達時間待查票面',
    tag: 'Transit',
    intensity: '高',
    hardConstraints: ['08:05 前抵 Warszawa Centralna；EIP 5300 08:40 發車，月台與車廂依票面及現場電子牌確認', '辛德勒工廠 17:30 入場（最後入場 18:30）', '13:00 準時入座 Pimiento（午餐菜單 13:00 起才供應），13:50 前離店，14:30 瓦維爾大教堂', '16:15 前離開 Wawel，17:10 前到辛德勒入口'],
    compressible: ['聖瑪利亞教堂內部參觀', '紡織會館購物時間'],
    train: {segmentId:'eip-5300'},
    steps: [
      {t:'07:15', label:'退房後前往上車站', sub:'Hotel Metropol → Warszawa Centralna，預留約 20 分鐘步行及尋找店家；早餐外帶不壓縮進站緩衝', dur:'20 min'},
      {t:'07:35', id:'d2-breakfast', label:'早餐 · Green Nero Express 車站外帶', sub:'07:55 前買好法棍＋咖啡，接 08:05 進站找月台；未開或久候就用前晚麵包', dur:'20 min'},
      {t:'08:05', label:'抵 Warszawa Centralna', sub:'已購 EIP 5300 08:40 由本站出發；月台、車廂與座位依票券詳細頁及當日電子牌確認', dur:'35 min 緩衝'},
      {t:'08:40', label:'EIP 5300 前往克拉科夫', sub:'已購票；票券清單顯示 08:40 Warszawa Centralna → Kraków Główny。抵達時間與車廂座位待查票面', cost:'已購票', dur:'車程待查票面'},
      {t:'抵站後', label:'抵 Kraków Główny', sub:'票券清單未顯示抵達時間；後續 11:10 寄放行李等排程，須依票券詳細頁重核', dur:'5–10 min 拖行李'},
      {t:'11:10', label:'旅館寄放行李', sub:'ibis budget Krakow Stare Miasto，飯店官網標示距車站約 200 公尺', dur:'20 min'},
      {t:'11:30', id:'d2-prep', label:'Lajkonik 備妥隔日早餐與午餐', sub:'寄放行李後沿路到 Basztowa 15 採買隔日麵包、水果與飲品，再步行往中央廣場；含步行與採買暫抓 40 分鐘。需冷藏品先確認保存條件，否則選常溫品；時間依列車實際抵達重算', dur:'40 min'},
      {t:'12:10', label:'★ 中央廣場 + 聖瑪利亞', sub:'本次先看廣場與教堂外觀，登塔改為有餘裕才安排。整點 Hejnał 號角；塔票僅於 Mariacki 廣場 7 號當日現場售票；午餐改 13:00，所以先在這裡看，不留到下午', cost:'外觀免費', dur:'20 min'},
      {t:'12:30', label:'紡織會館 Sukiennice 快速一覽', sub:'採購留到 10/27；12:40 前動身，步行約 12 分到 Pimiento', cost:'免費入場', dur:'10 min'},
      {t:'13:00', id:'d2-lunch', label:'午餐 · Pimiento Shop and Bistro', sub:'Świętego Filipa 21（Stary Kleparz 旁），離 ibis 步行約 7 分；午餐菜單 13:00 起才供應（09:00–13:00 只有早餐菜單），所以 13:00 準時入座：Tatar 阿根廷牛韃靼、Argentine burger 或照重量點阿根廷牛排。週日只開到 15:00（Google 地圖與 MapQuest，官網未列），先用官網或電話訂位。13:50 前離店，預留約 30 分鐘步行去瓦維爾。時刻依已購列車實際抵達重算；客滿或關門改 Restauracja Polonia（Basztowa 25）、24 小時的 Przypiecek 或外帶，不壓縮預定景點時段', cost:'依店家', dur:'50 min'},
      {t:'14:30', label:'★ 瓦維爾大教堂', sub:'2026-10-07 官網：4–10 月時段，週日 12:30–17:00、售票至 16:30（11–3 月才縮為 16:00）；Cathedral Museum 週日休館', cost:'PLN 26／18', dur:'45 min'},
      {t:'15:15', label:'★ Wawel 城堡短路線', constraint:{venue:'krakow-wawel-treasury'}, sub:'2026-09-17 官網 9–12 月分路線售票，適合一小時空檔的是：王冠寶庫 47／35、Castle Underground 47／35（含語音導覽）、Armoury 47／35；二樓代表廳 57／43 需時較長。不要硬排一、二樓完整路線，會壓縮前往辛德勒工廠的時間', cost:'寶庫或地下路線 PLN 47／35', dur:'1 h'},
      {t:'16:15', label:'電車或計程車前往辛德勒工廠', sub:'由 Wawel 搭電車（出發前用 Jakdojade 查當下車號與轉乘）或計程車到 Podgórze，約 20–30 分；17:10 前到入口，剩餘空檔可在 Kazimierz 或 Podgórze 短停', dur:'約 30 min'},
      {t:'17:30', label:'★ 辛德勒工廠', constraint:{venue:'krakow-schindler'}, sub:`週日 ${schindlerVenue.hours.opens}–${schindlerVenue.hours.closes}、最後入場為閉館前 90 分（${schindlerVenue.hours.lastEntry}）· 常設展線上票一律實名，入場要帶與購票同名的證件正本 · 官方售票頁預約。為接 19:15 晚餐，預計 19:00 前離館（約 1 h 30 min）`, cost:'PLN 60 · 優待 45', dur:'約 1 h 30 min'},
      {t:'19:15', id:'d2-dinner', label:'晚餐 · Hankki（先確認接單）', sub:'辛德勒 17:30 入場、預計 19:00 前離館，步行約 5 分到 Zabłocie 19A；Gyoza、Honey Garlic Popcorn Chicken、Kimbap 或 Bibimbap。週日 13:00–21:00 營業，最後點餐時間查不到，建議先在 MojStolik 訂位；想換泰式改 MOLÁM（週日至 21:30），NOAH 留作備選；Endzior 多數來源週日公休，宵夜改 Plac Nowy 圓亭其他窗口', cost:'依店家', dur:'1 h'},
    ],
    eat: [
      snack({text:'zapiekanka 街食（週日可能公休，改圓亭其他窗口） @ Endzior', placeId:'krakow-endzior'}),
    ],
    warn: '❗EIP 5300 已購票，但截圖未顯示抵達時間；11:10 寄放行李與午後行程須依票券詳細頁重新核對。瓦維爾城堡尚未訂票；辛德勒工廠個人網路票在參觀日前 90 天 09:00 開放，10/25 已可在官方售票頁查／購。瓦維爾大教堂週日 12:30–17:00（售票至 16:30）；午餐改排 Pimiento 13:00（午餐菜單 13:00 起才供應），中央廣場與紡織會館提前到 12:10–12:40，瓦維爾大教堂移到 14:30、Wawel 短路線 15:15，16:15 前離開後搭電車或計程車到辛德勒工廠，不再步行。辛德勒工廠週二至週日 09:00–20:00、最後入場 18:30，17:30 屬可行時段。10/25 為非營業週日，多數一般商店關閉；餐廳等法定例外是否營業仍以店家公告為準。',
    backup: [
      {label:'辛德勒 17:30 滿場', where:'改訂 18:30 最後入場，或 17:00 前後的可售場次', why:'最後入場其實是 18:30，比原記錄多一小時可調度；mhk.pl/en 開放預約後立即下單'},
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
    headline: `10:30 英文 educator 導覽已訂妥；巴士去 ${lajkonikOutboundAdopted.dep}、回 ${lajkonikInboundAdopted.dep} 曾查得班次，尚未購票；指定日庫存待重查`,
    tag: 'Memorial',
    intensity: '中高',
    hardConstraints: ['10:00 前抵 Muzeum Auschwitz 留安檢時間（官方要求至少提前 30 分鐘到場）；本行程採 08:35 早到緩衝', '10:30 英文 educator 導覽已訂妥，遲到不予補場', `回程巴士 ${lajkonikInboundAdopted.dep} 發車，導覽結束後不要走遠`, '晚間不再加博物館或長距離步行'],
    compressible: ['回克拉科夫後晚餐形式', '晚間自由活動'],
    // 導覽已訂妥 10:30，巴士以「09:45 前抵達」回推。
    // 班次與公開班表正本在 rail.js；9/09 售票頁只代表當時的可售快照。
    // 本行程採 rail.js 的去程班次早到；指定日班次、庫存與價格付款前重查。
    train: {segmentId:'bus-lajkonik'},
    steps: [
      {t:'06:00', id:'d3-breakfast', label:'自備早餐 · 住宿內吃完', sub:'前一天先買好，06:20 離開住宿，06:40 至 MDA 報到', dur:'20 min'},
      {t:'06:40', label:'Kraków MDA 報到', sub:'ul. Bosacka 18 Dworzec Autobusowy（Kraków Główny 後方步行約 5 分）；官方售票頁顯示此班由地下層 D10 發車，仍以現場電子看板為準', dur:'30 min 規劃緩衝（非官方最低要求）'},
      {t: lajkonikOutboundAdopted.dep, label:'Lajkonik · 克拉科夫 → 奧斯威辛', sub:`2026-09-09 於 lajkonikbus.pl 查得 10/26 當日班次：${lajkonikOutboundAdopted.dep} ${lajkonikOutboundAdopted.bay} 發車、${lajkonikOutboundAdopted.arr} 抵 Więźniów Oświęcimia 55，車程 ${lajkonikOutboundAdopted.dur}，全票 ${lajkonikFare.full} zł（優待 ${lajkonikFare.discount} zł）。當日另一班 ${lajkonikOutboundRejected.dep} → ${lajkonikOutboundRejected.arr} 距官方建議的 10:00 到場時間只剩 10 分鐘，緩衝不足不採用`, cost:`線上快照 PLN ${lajkonikFare.full}（優待 ${lajkonikFare.discount}；付款前重查）`, dur: lajkonikOutboundAdopted.dur},
      {t: lajkonikOutboundAdopted.arr, label:'抵 Auschwitz I', sub:'下車處就在博物館停車場對面。距 10:30 入場有 1 小時 55 分：大件行李先使用付費寄物服務（費率以現場為準）；可入館包袋不得超過 35 × 25 × 15 公分，再過安檢（機場式檢查會排隊），剩餘時間可待在訪客中心書店與展覽前導區', dur:'1h55 緩衝'},
      {t:'10:30', label:'★ 英文官方導覽（已訂妥）', sub:'個人 educator 導覽 · 一館 + 比克瑙 · 官方標示約 3 小時 45 分；入場憑電子入場證＋證件，兩者缺一不可', cost:'已付款', dur:'3h45'},
      {t:'依導覽休息', timingMode:'relative', id:'d3-lunch', label:'自備午餐 · 依允許的休息時段', sub:'攜帶三明治、水果與水；只在導覽允許的用餐區吃，不在參觀區進食或為午餐離團'},
      {t:'約 14:15', label:'導覽結束', sub:'比克瑙結束後依接駁巴士回一館，再走到停車站牌'},
      {t: lajkonikInboundAdopted.dep, label:'回程巴士返克拉科夫', sub:`2026-09-09 於 lajkonikbus.pl 售票頁當時顯示 10/26 回程可售三班（不是全線完整班表）：${lajkonikInboundRejected.dep}（導覽結束前就開走，不可用）、${lajkonikInboundAdopted.dep}、${lajkonikInboundBackup.dep}。採 ${lajkonikInboundAdopted.dep} 由 Więźniów Oświęcimia 55 發車，導覽結束後有 75 分鐘走回站牌與休息；若導覽延後或接駁排隊，改搭 ${lajkonikInboundBackup.dep}（${lajkonikInboundBackup.arr} 抵）`, cost:`線上快照 PLN ${lajkonikFare.full}（優待 ${lajkonikFare.discount}；付款前重查）`, dur: lajkonikInboundAdopted.dur},
      {t: lajkonikInboundAdopted.arr, label:'抵 Kraków MDA · 休息', sub:'ul. Bosacka 18 Dworzec Autobusowy；先回旅館放東西與休息，晚餐暫排 18:30；太累就在巴士站旁 Galeria Krakowska 吃速食'},
      {t:'18:30', id:'d3-dinner', label:'晚餐 · Mr. Jerry 威靈頓牛排', sub:'Jagiellońska 5（老城），返城休息後前往；招牌 Beef Wellington，胃口大可加乾式熟成牛排。週一 15:00–22:00、廚房至 21:30，建議訂位並確認當天供應 Wellington；返程延誤先聯絡餐廳（+48 533 836 624）。訂不到改 Pod Aniołami；FOLGA 週一可能休息', cost:'依店家菜單', dur:'1 h 15 min'},
    ],
    eat: [
      snack({text:'回程後的一杯咖啡 @ Karma Kawiarnia（Krupnicza 12）', placeId:'krakow-karma-coffee-roasters'}),
    ],
    warn: `✅ 導覽已訂妥：10/26 10:30 英文個人 educator 導覽（Zwiedzanie indywidualne z edukatorem），官方標示約 3 小時 45 分，2 人。官方明載「入場證需搭配身分證件」，請把電子入場證存離線並帶護照。🚌 巴士去回曾查得班次，指定日庫存待重查、但尚未購票：官方要求至少提前 30 分鐘抵達以留安檢時間，10:30 場應在 10:00 前到場；本行程另採 08:35 早到目標，並非官方要求 10:00 前完成安檢；導覽約 14:15 結束，回程只能挑那之後的班次。去程已於 2026-09-09 在官方售票頁 lajkonikbus.pl 查得 10/26 實際班次並選定 **${lajkonikOutboundAdopted.dep} → ${lajkonikOutboundAdopted.arr}**（${lajkonikOutboundAdopted.bay} 發車，${lajkonikOutboundAdopted.dur}，全票 ${lajkonikFare.full} zł／優待 ${lajkonikFare.discount} zł），抵達後距入場有 1 小時 55 分。當日另一班 ${lajkonikOutboundRejected.dep} → ${lajkonikOutboundRejected.arr} 距官方建議的 10:00 到場時間只剩 10 分鐘，巴士一誤點就來不及，不採用；**沒有 07:35 這班**。回程同日售票頁顯示 10/26 下午可售三班（歷史查價快照，不是完整班表）：${lajkonikInboundRejected.dep}（導覽結束前開走，不可用）、**${lajkonikInboundAdopted.dep} → ${lajkonikInboundAdopted.arr}（採用）**、${lajkonikInboundBackup.dep} → ${lajkonikInboundBackup.arr}（備案），皆 ${lajkonikFare.full} zł、車程 ${lajkonikOutboundAdopted.dur}。去回兩程皆尚未購票，付款前仍以售票頁當下顯示為準。`,
    // 回程選項。導覽約 14:15 結束，全部以「14:15 之後發車」為門檻。
    // 去程與回程皆已於 2026-09-09 由官方售票頁 lajkonikbus.pl 查得 10/26 當日班次；
    // 兩個方向都尚未購票，付款前仍以售票頁當下顯示為準。
    returnOptions: [
      {
        rank: '採用', name: `Lajkonik ${lajkonikInboundAdopted.dep} → ${lajkonikInboundAdopted.arr} 抵 Kraków MDA`,
        detail: `由 Więźniów Oświęcimia 55 發車、停 ul. Bosacka 18 Dworzec Autobusowy，車程 ${lajkonikInboundAdopted.dur}，${lajkonikInboundAdopted.fare}。導覽 14:15 結束後有 75 分鐘走回站牌、上洗手間與逛訪客中心書店。`,
        status: '✅ 2026-09-09 於官方售票頁 lajkonikbus.pl 查得 10/26 確有此班；尚未購票。',
        url: 'https://www.lajkonikbus.pl/',
      },
      {
        rank: '備案', name: `Lajkonik ${lajkonikInboundBackup.dep} → ${lajkonikInboundBackup.arr} 抵 Kraków MDA`,
        detail: '同站牌、同票價的下一班。導覽延後、比克瑙接駁排隊或想多留時間時改搭，代價是多等 1 小時。',
        status: `✅ 同日查得。當天若已趕上 ${lajkonikInboundAdopted.dep} 就不需要這班。`,
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
        status: '⚠️ 2026-09-14 於本專案建置環境無法連線查證，班次、票價與上下車點都要出發前自行確認；務必看清楚停靠的是博物館門口還是 Oświęcim 市區站。',
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
    hardConstraints: ['早上完成 Wieliczka 鹽礦', '15:00 結束 Kazimierz 並回旅館取行李；若鹽礦延誤，跳過 Kazimierz', '16:10 前抵 Kraków Główny；已購 IC 3830 16:45 發車'],
    compressible: ['Kazimierz 白天散步', '老城補逛與採購'],
    train: {segmentId:'ic-3830'},
    steps: [
      {t:'07:30', label:'退房 + 行李寄旅館', sub:'先退房把行李寄 ibis，再去吃早餐；09:00 去程為目標班次，出發前重查', dur:'15 min'},
      {t:'07:45', id:'d4-breakfast', label:'早餐 · Charlotte Plac Szczepański', sub:'French Breakfast、可頌或蛋料理＋咖啡；08:30 收尾，步行約 15 分回 Kraków Główny。候位太久就外帶，或吃前晚備妥的麵包', dur:'45 min'},
      {t:'09:00', label:'火車到 Wieliczka Rynek-Kopalnia', sub:'KMŁ；2026-09-17 ZTP 官方票價表載明 70 分鐘 KMK+KMŁ 聯票涵蓋 Wieliczka Bogucice–Wieliczka Rynek Kopalnia 區段與所有站名含「Kraków」的車站，唯一排除的是 Kraków Airport——此程適用。注意是「70 分鐘」有效，逾時要另購', cost:'PLN 10（優待 5）', dur:'約 25 min'},
      {t:'10:00', label:'★ Wieliczka 鹽礦 Tourist Route 英文團', sub:'3.5 km · 135m 深 · St. Kinga 鹽教堂。10/27 英語 Tourist Route 全票 143／優待 121 PLN，英文場 08:30 起每 30 分鐘一場；尚未購票，餘額會變動，買票前看待辦頁該項的說明', cost:'PLN 143（優待 121）· 已查票價／尚未購票', dur:'2–3 h'},
      {t:'出礦後', timingMode:'relative', id:'d4-lunch', label:'午餐 · Bistro Posolone', sub:'13:00 前出礦才坐下吃當日湯、Halloumi 沙拉或兩人分一份披薩，13:30 收尾；較晚就外帶／吃自備餐。另預留走回車站及候車，回程延誤就略過 Kazimierz，保住 16:10 抵站', cost:'依店家', dur:'有餘裕才留 30 min'},
      {t:'13:30', label:'前往 Wieliczka 車站候車', sub:'由餐廳／出礦口步行，暫留 30 分鐘含找站與候車；實際出口與班次當日重算', dur:'30 min'},
      {t:'14:00 目標', label:'火車回 Kraków Główny', sub:'當日查 KMŁ 班次；去程票已失效需另購，回城後先保住取行李與 16:10 抵站', cost:'依當日票價', dur:'約 25 min'},
      {t:'回城後有餘裕', timingMode:'relative', label:'Kazimierz 快速散步（有餘裕才去）', sub:'僅在實際提前返城且 15:00 前能結束時採用；一般直接回旅館取行李，不為散步繞路'},
      {t:'15:00', label:'結束 Kazimierz 散步，回 ibis 取行李', sub:'飯店距 Kraków Główny 約 200 公尺；不要再安排採購'},
      {t:'16:10', label:'抵 Kraków Główny', sub:'確認月台、車廂與座位；發車前保留 35 分鐘', dur:'35 min 緩衝'},
      {t:'16:45', label:'IC 3830 前往樂斯拉夫', sub:'已購票；抵達時間與車廂座位待查票券詳細頁', cost:'已購票', dur:'車程待查票面'},
      {t:'抵站後', label:'抵 Wrocław Główny', sub:'票券清單未顯示抵達時間；步行至主站對面的 Hotel Piast，拖行李保守抓 5–10 分鐘'},
      {t:'抵站放行李後', timingMode:'relative', id:'d4-dinner', label:'晚餐 · Samarqand 或車站 KFC', sub:'約 21:00 前能到 Samarqand 且確認仍接單才吃 Uzbek Plov 抓飯、Manti 湯餃；誤點或不接單直接改 KFC Wrocław PKP 或 Wroclavia 的 MAX（到 01:00）。抵達時間待查票面'},
    ],
    eat: [
      snack({text:'Sernik @ Cukiernia Michałek', placeId:'krakow-cukiernia-michalek'}),
      snack({text:'手工餃子（Kazimierz 有空檔才去） @ Pierogi MR Vincent', placeId:'krakow-pierozki-u-vincenta'}),
    ],
    warn: '❗鹽礦尚未購票。10/27 英語 Tourist Route 票價 2026-10-06 已核實為 143／121 PLN，10/06 官網查詢時 10:00 英文場有名額（餘額會變動，不保證有位），建議盡早購票並在官方日期選擇器核對。城際段已購 IC 3830，16:45 發車；若鹽礦延誤，直接跳過 Kazimierz，16:10 前抵 Kraków Główny。抵達樂斯拉夫時間待查票面。',
    backup: [
      {label:'鹽礦客滿或超時', where:'先查當日英文場並保住 16:45 的已購火車', why:'需要 16:10 前到 Kraków Główny；來不及就略過 Kazimierz'},
      {label:'雨天備案', where:'鹽礦本身就在地下 135m', map:'https://www.google.com/maps/search/?api=1&query=Kopalnia%20Soli%20Wieliczka%2C%20Dani%C5%82owicza%2010%2C%20Wieliczka', why:'地下約 17–18°C、防雨遮陽最佳備案'},
      {label:'想留更多 Kazimierz 時間', where:'以 15:00 收尾為上限', why:'不得壓縮取行李與 16:10 抵站緩衝'},
    ],
    practical: [
      {tag:'交通', name:'Wieliczka 火車', note:'Kraków Główny 搭 KMŁ 至 Wieliczka Rynek-Kopalnia。2026-09-17 ZTP 官方票價表原文：70 分鐘 KMK+KMŁ 聯票 10／5 PLN，可搭 I、II、III 區的 KMK 車輛，以及 KMŁ 在 Wieliczka Bogucice–Wieliczka Rynek Kopalnia 區段與所有站名含「Kraków」的車站，唯一排除 Kraków Airport——本段全程涵蓋。但有效期只有 70 分鐘，去回要各買一張。'},
      {tag:'寄物', name:'旅館 + Główny 備案', note:'退房後優先寄旅館；若旅館不收，依車站當日設施、空位與費率處理'},
      {tag:'裝備', name:'鹽礦低溫', note:'地下約 17–18°C，攜薄外套；官方標示全程超過 800 階，須穿好走鞋'},
    ],
  },
  {
    n: 5, date: '10/28 (三)', city: '樂斯拉夫 → 波茲南',
    title: '小矮人尋寶 + 點燈儀式 + 晚轉場',
    headline: 'IC 260 已購票，19:10 由 Wrocław Główny 出發；午餐與跨區移動先留時間，抵達時間待查票面',
    tag: 'Transit',
    intensity: '很高',
    hardConstraints: ['早餐後早出門', '座堂島點燈人無對外保證的固定出發分鐘，日落前到場等候', '18:35 前抵 Wrocław Główny；已購 IC 260 19:10 發車'],
    compressible: ['國家博物館可整段取消，改午後咖啡休息', '座堂島改 45–60 分鐘重點散步', '午餐改簡餐或外帶'],
    train: {segmentId:'ic-260'},
    steps: [
      {t:'07:30', id:'d5-breakfast', label:'早餐 · Central Cafe', sub:'Piast 出發先預留前往老城的交通；美式鬆餅、貝果或燕麥粥，08:15 收尾；未供餐改同街 Charlotte Pokoyhof', dur:'45 min'},
      {t:'09:00', label:'★ 中央廣場 + 紡織會館', sub:'dwarfsmap.com 找小矮人', cost:'免費', dur:'1.5 h'},
      {t:'10:30', label:'糖果屋雙屋 + 教堂塔樓', sub:'聖伊莉莎白教堂塔高 96m、觀景台 75m、304 階無電梯；10 月 10:00 起、週日 11:00 起，開到黃昏（約 16:30 前）；下雨或雷暴不開，改走廣場與全景畫', cost:'PLN 16／10 · 現金', dur:'45 min'},
      {t:'11:30', label:'★ 拉茨瓦維採全景畫', sub:'11:30 場，約 30 分鐘，每 30 分鐘一場；尚未購票，餘額會變動，買票前看待辦頁該項的說明；12:00 前後散場接午餐', cost:'PLN 50／優待 35', dur:'約 30 min'},
      {t:'12:00', id:'d5-lunch', label:'午餐 · Restauracja Wrocławska 候選', sub:'全景畫後往 Szewska 59/60（全景畫 30 分鐘場，約 12:00 散場後直接過去）；Śląskie niebo＋Bigos Wrocławski（胃口夠加 Crayfish Soup）。主菜現做約 30 分鐘，13:15 前結帳、13:30 前離店，另留 15 分鐘往國家博物館；排隊久就改快食', cost:'依店家', dur:'1 h 15 min'},
      {t:'14:15', label:'★ 弗羅茨瓦夫國家博物館', sub:'pl. Powstańców Warszawy 5，全景畫旁。2026-10-07 官網：10/1 起冬季時段週二至週五 10:00–16:00、售票至 15:30，週一休館；全景畫票 3 個月內可免費參觀常設展（單買 20／15 PLN）。挑西里西亞中世紀雕刻與波蘭繪畫重點看，15:30 收尾後步行約 20 分到座堂島', cost:'持全景畫票免費', dur:'1 h 15 min'},
      {t:'16:15', label:'★ 座堂島煤氣燈', sub:'日落約 16:34；點燈人無固定公開出發分鐘，在島上等候與散步', cost:'免費', dur:'1 h'},
      {t:'17:15', label:'座堂島結束後回 Piast 取行李', sub:'座堂島 → 旅館約 25–30 分，取行李再往 Wroclavia；若 18:05 前無法到 MAX，改車站內外帶。已購 IC 260 19:10 發車，18:35 抵站後保留約 35 分鐘緩衝', dur:'約 50 min'},
      {t:'18:05', id:'d5-dinner', label:'晚餐 · MAX Wroclavia 外帶', sub:'取行李後選 Frisco 或 Halloumi 漢堡＋地瓜薯條；18:15 前拿到餐，留 20 分鐘進主站。排隊就改同商場 Pasibus、主站 KFC 或現成麵包，不壓縮進站緩衝；不要等到波茲南再吃', dur:'10 min'},
      {t:'18:35 前', label:'抵 Wrocław Główny', sub:'確認已買好外帶，開始找月台、車廂與座位；此時不再排隊買餐', dur:'至少 35 min 緩衝'},
      {t:'19:10', label:'IC 260 前往波茲南', sub:'已購票；抵達時間與車廂座位待查票券詳細頁', cost:'已購票', dur:'車程待查票面'},
      {t:'抵站後', label:'抵 Poznań Główny', sub:'票券清單未顯示抵達時間；先依訂房確認核對晚間取鑰匙方式，再前往接待處或指定地點。實際公寓門牌依訂房確認'},
    ],
    eat: [
      snack({text:'咖啡 @ El Gato Specialty Coffee', placeId:'wroclaw-el-gato-specialty-coffee'}),
      snack({text:'甜點 @ Dessert Boutique', placeId:'wroclaw-dessert-boutique'}),
    ],
    warn: '✅ IC 260 城際火車已購票；拉茨瓦維採全景畫 11:30 場已查到但尚未購票。午餐候選已確認 12:00 開門，仍須確認出餐速度。午餐後至座堂島前保留彈性休息時間。10/28 日落約 16:34；點燈人沒有對外保證的固定出發分鐘，因此安排 16:15–17:15 在座堂島等候。',
    backup: [
      {label:'雨天備案', where:'Sky Tower 觀景台', map:'https://www.google.com/maps/search/?api=1&query=Sky%20Tower%2C%20Powsta%C5%84c%C3%B3w%20%C5%9Al%C4%85skich%2095%2C%20Wroc%C5%82aw', why:'開放時間、票價與能見度以官方當日公告為準，不用舊票價規劃'},
      {label:'點燈師看不到', where:'廣場連拱廊 + 紡織會館內部市集', map:'https://www.google.com/maps/search/?api=1&query=Rynek%20Wroc%C5%82aw', why:'若日落後遇雨遮蔽煤氣燈，回廣場喝熱酒（PLN 12）'},
    ],
  },
  {
    n: 6, date: '10/29 (四)', city: '波茲南 → 華沙',
    title: '山羊鐘樓秀 + 聖馬丁牛角麵包',
    headline: 'EIC 8104 已購票，17:40 發車；兼顧正午山羊秀與下午行程',
    tag: 'Transit',
    intensity: '中高',
    hardConstraints: ['11:45 前抵達老城廣場卡位', '12:00 山羊鐘樓秀', '14:00 Carla 午餐（14:00 才開門），15:15 前結帳', '16:15 離開帝王城堡取行李', '17:05 前抵 Poznań Główny；搭乘已購 EIC 8104'],
    compressible: ['帝王城堡內部參觀', '老城自由時間'],
    train: {segmentId:'eic-8104'},
    steps: [
      {t:'08:00', id:'d6-breakfast', label:'早餐 · Charlotte Krysiewicza', sub:'Krysiewicza 3a/27，07:00 開門；French Breakfast、可頌＋咖啡，Poznań rugelach 兩人分享。08:40 收尾，留約 50 分鐘交通；想提早到教堂島就改 07:30 用餐。Inna Piekarnia（08:30 開門、09:30 前要出發，時間太趕）只列備案', dur:'40 min'},
      {t:'09:30', label:'★ 教堂島 Ostrów Tumski', sub:'依交通可再提早；10:30 收尾後前往老城，11:00 到廣場等山羊秀', cost:'未收費', dur:'1 h'},
      {t:'11:00', label:'廣場卡正面位置', dur:'45 min · 提早卡位'},
      {t:'12:00', label:'★ 山羊鐘樓秀', sub:'官方每日 12:00 與 15:00 登場；本次採正午場，兩隻金屬山羊互頂 12 次。錯過可考慮 15:00，但仍須保留取行李與到站時間', cost:'免費', dur:'5 min'},
      {t:'12:15', label:'★ 聖馬丁牛角麵包 (PGI)', sub:'ROGAL Świętomarciński（Stary Rynek）；兩人買一個分享，當點心不另點大量餐食。排隊或售完改往帝王城堡路上的 Cukiernia Kandulski（Plac Ratajskiego 1）', cost:'依門市標價', dur:'15 min'},
      {t:'12:30', label:'老城自由時間', sub:'Carla 14:00 才開門，這段留給老城散步或找咖啡座休息（Weranda caffe 週四 09:00 起）；13:45 出發前往 Carla，步行約 9 分，並確認 zjedz.my 的訂位', dur:'約 1 h 15 min'},
      {t:'14:00', id:'d6-lunch', label:'午餐 · Carla Trattoria Moderna', sub:'Święty Marcin 34，週四 14:00 開門，14:00 準時入座；先在 zjedz.my 訂 14:00 兩位（尚未訂）。手工麵、披薩與小盤分享，兩人分享即可。15:15 前結帳；上菜慢、15:30 還沒吃完就放棄帝王城堡內部，先保 17:05 到站。客滿或訂不到改 Pyra Bar（Strzelecka 13，週四 11:00–21:00）', cost:'依店家', dur:'75 min'},
      {t:'15:35', label:'★ 帝王城堡', sub:'CK ZAMEK（Święty Marcin 80/82），由老城步行約 15 分；每日 12:00–19:00、售票至 18:00。9/5–12/6 展期售展覽＋城堡聯票：含地圖 35／30 PLN、含語音導覽 40／35 PLN（2026-10-07 官網）。看德皇威廉二世時代的城堡廳室與當期展覽；本日縮短為約 40 分，16:15 離開', cost:'聯票 PLN 35–40', dur:'40 min', constraint:{venue:'poznan-ck-zamek'}},
      {t:'16:15', label:'取行李、前往 Poznań Główny', sub:'離開帝王城堡後直接回 Poznan Apartments Towarowa（Towarowa 37）取行李，約 20–25 分；先確認公寓行李寄放地點；17:05 前抵站', dur:'約 50 min'},
      {t:'17:05', label:'抵 Poznań Główny', sub:'確認月台、車廂與座位；拖行李保留進站緩衝', dur:'35 min 緩衝'},
      {t:'17:40', label:'EIC 8104 前往華沙', sub:'EIC 8104 已購票；抵達時間、車廂與座位待查票面', cost:'票價未提供', dur:'待查票面'},
      {t:'抵站後', label:'抵 Warszawa Centralna', sub:'票面抵達時間待查；步行至 Hotel Metropol 約 500 公尺，拖行李預留 10–15 分鐘'},
      {t:'抵站放行李後', timingMode:'relative', id:'d6-dinner', label:'晚餐 · Arirang 韓式', sub:'Nowogrodzka 38，離 Metropol 步行約 5 分；Bulgogi、拌飯或 Jajangmyeon。週四 12:00–22:00（多個目錄一致），當天先打 22 881 78 51 或 22 622 18 86 確認仍接單；21:30 前無法入座就改中央車站對面 Złote Tarasy 速食（到 22:00）或 Soul Kitchen（威靈頓），再晚改 24 小時的 Ćma', cost:'依店家', dur:'約 1 h'},
    ],
    eat: [
      snack({text:'12:15 聖馬丁牛角麵包 @ ROGAL Świętomarciński', placeId:'poznan-rogal'}),
      snack({text:'抵站、放行李後華沙宵夜 @ Hala Koszyki', placeId:'warsaw-hala-koszyki'}),
    ],
    backup: [
      {label:'下雨備案', where:'帝王城堡內部 + 老城咖啡座', map:'https://www.google.com/maps/search/?api=1&query=Zamek%20Cesarski%2C%20%C5%9Awi%C4%99ty%20Marcin%2080%2F82%2C%20Pozna%C5%84', why:'兩處都有室內空間；下雨可拉長午餐前的咖啡座時間，Carla 照 14:00，帝王城堡仍以 16:15 離開為準，需雨具'},
    ],
  },
  {
    n: 7, date: '10/30 (五)', city: '華沙',
    title: '起義博物館 + 皇家城堡 + 老城 + 瓦津基',
    headline: '早上起義博物館，中午皇家城堡與老城，下午瓦津基水上宮殿；國家博物館看體力',
    tag: 'Museums',
    intensity: '高',
    hardConstraints: ['起義博物館 08:00 開門、08:30 入場', '皇家城堡 10:00 開門、16:00 最後入場', '水上宮殿 16:12 日落前先拍外觀再入內', '晚餐 Soul Kitchen 18:30 先訂位並預留威靈頓'],
    compressible: ['起義博物館抓核心展區（約 1.5 h）', '老城步行段改外觀快拍', '水上宮殿只拍外觀不入內', '國家博物館整段略過'],
    steps: [
      {t:'07:30', id:'d7-breakfast', label:'早餐 · Bułkę przez Bibułkę', sub:'Zgoda 3，離 Metropol 步行約 8 分，平日 07:30 開門；Bagel、炒蛋或 Avocado Toast，08:05 前結帳', dur:'35 min'},
      {t:'08:05', label:'地鐵 M2 → Rondo Daszyńskiego', sub:'Świętokrzyska 站搭 M2 往 Bemowo 兩站，下車步行約 8 分到 Grzybowska 79；用 Jakdojade 查當下班次', cost:'75 分第 1 區票 4.40', dur:'約 25 min'},
      {t:'08:30', label:'★ 華沙起義博物館', constraint:{venue:'warsaw-rising-museum'}, sub:'週五 08:00–18:00、售票至 17:30；一早人少，抓 1944 年起義主線、下水道通道與 B-24 機身。館方預估約 2 小時', cost:'PLN 35／30', dur:'2 h'},
      {t:'10:30', label:'前往無名塚', sub:'地鐵 M2 回 Świętokrzyska 或 Nowy Świat-Uniwersytet，再步行到 plac Piłsudskiego；當日以 Jakdojade 重算', cost:'75 分第 1 區票 4.40', dur:'約 25 min'},
      {t:'10:55', label:'★ 無名塚與衛兵', sub:'plac Piłsudskiego、薩克森花園東側拱廊；衛兵整點換崗，11:00 前到可看一次', cost:'免費', dur:'20 min'},
      {t:'11:15', label:'步行到城堡廣場', sub:'經劇院廣場與 Krakowskie Przedmieście 北段，約 15 分', dur:'15 min'},
      {t:'11:30', label:'★ 皇家城堡', constraint:{venue:'warsaw-royal-castle'}, sub:`Royal Route 約 60–70 分（含語音導覽）。二–日 ${royalCastleVenue.hours.opens}–${royalCastleVenue.hours.closes}、最後入場 ${royalCastleVenue.hours.lastEntry}、週一休館；10/30 是週五，不適用週三的限定路線免費場`, cost:'PLN 60 · 優待 45', dur:'約 70 min'},
      {t:'12:40', id:'d7-lunch', label:'午餐 · Polka', sub:'Świętojańska 2，就在城堡旁；平日 12:00–16:00 有午間套餐，點 Pierogi 或 Żurek，13:30 前結帳。客滿改老城廣場的 U Fukiera 或外帶', cost:'依店家', dur:'50 min'},
      {t:'13:30', label:'★ 老城步行：聖若望大教堂 → 許願鐘 → 老城廣場 → 甕城', sub:'聖若望大教堂就在 Polka 旁；Kanonia 小廣場的許願鐘、美人魚像所在的老城廣場、紅磚甕城一路往北，約 1 公里', cost:'免費（教堂地下室另收費）', dur:'50 min'},
      {t:'14:20', label:'小小起義者紀念碑 → 華沙起義紀念碑', sub:'甕城外 Podwale 的小小起義者像，再往西北走 5 分到 plac Krasińskich 的起義紀念碑，和上午的博物館前後呼應', cost:'免費', dur:'20 min'},
      {t:'14:40', label:'搭車前往瓦津基公園', sub:'老城到瓦津基約 4 公里：由 plac Krasińskich 一帶搭公車或叫車約 25–30 分，不要走路；下車點選 Łazienki Królewskie 北門', cost:'依交通方式', dur:'約 30 min'},
      {t:'15:10', label:'★ 瓦津基 · 水上宮殿', constraint:{venue:'warsaw-lazienki-palace'}, sub:'日落 16:12：先在湖邊拍宮殿外觀與倒影，再入內；週五個人參觀免費（以當日公告為準），10 月 10:00–18:00', cost:'週五免費', dur:'約 80 min'},
      {t:'16:30', label:'返回市中心，回飯店稍休', sub:'沿 Aleje Ujazdowskie 搭公車或叫車約 15–20 分回 Metropol 放東西、加外套', dur:'約 45 min'},
      {t:'17:15', label:'可選 · 華沙國家博物館', constraint:{venue:'warsaw-national-museum'}, sub:'Al. Jerozolimskie 3，週五開到 20:00、17:00 後門票半價、售票 19:15 截止；挑波蘭繪畫廳看 45 分鐘，18:10 前離館。下雨、體力不足或老城待久就直接略過', cost:'17:00 後半價', dur:'約 55 min'},
      {t:'18:30', id:'d7-dinner', label:'最後晚餐 · Soul Kitchen 威靈頓牛排', sub:'Nowogrodzka 18A，國家博物館步行約 12 分、Metropol 步行約 8 分；多個評論來源列 Beef Wellington 為招牌，配韃靼牛肉或 Żurek。菜單隨季節換，Wellington 常需預留，訂位時一併確認 10/30 有供應並請店家留份；沒有就改原首選 Rusiko（Wierzbowa 11，喬治亞菜）', cost:'依菜單', dur:'1.5 h'},
      {t:'20:15', label:'回飯店整理行李', sub:'Soul Kitchen 步行約 8 分回 Metropol；想喝熱巧克力可繞 Wedel Szpitalna 8（到 22:00）。隔天早上 08:00 早餐、09:45 退房'},
    ],
    eat: [],
    warn: '❗三項皆尚未訂：起義博物館 08:30、皇家城堡 11:30、晚餐 Soul Kitchen 18:30（訂位時預留威靈頓）。2026-10-12 官網複查，皇家城堡已由官方確認 10 月起為二–日 10:00–17:00、最後入場 16:00（不是夏季的 18:00／17:00），11:30 入場仍有餘裕。起義博物館週五 08:00–18:00、週二休館，個人免費日為週四，10/30 照常收費。瓦津基公園每日 06:00–22:00 免費，水上宮殿週五免費入內（以館方當日公告為準）；日落 16:12，先拍外觀。國家博物館週五至 20:00、17:00 後半價，屬加碼行程。蕭邦博物館 2026 全年整修閉館，本趟不列入。',
    extend: [
      {label:'Bulwary Wiślane 維斯瓦河畔', when:'晚餐後', map:'https://www.google.com/maps/search/?api=1&query=Bulwary%20Wi%C5%9Blane%2C%20Warszawa', why:'河濱步道，城堡廣場步行 10–15 分，晚餐後想散步再去，免費'},
      {label:'Neon Museum 霓虹燈博物館', when:'取消瓦津基或國家博物館時替代', map:'https://www.google.com/maps/search/?api=1&query=Neon%20Muzeum%2C%20plac%20Defilad%201%2C%20Warszawa', why:'已遷入科學文化宮 4 樓（Marszałkowska 入口），共產時期霓虹招牌收藏，PLN 28／優待 18（2026-10-13 官網），離飯店最近的室內選項'},
      {label:'科學文化宮 30F 觀景台', when:'取消國家博物館、晚餐前', map:'https://www.google.com/maps/search/?api=1&query=Pa%C5%82ac%20Kultury%20i%20Nauki%2C%20plac%20Defilad%201%2C%20Warszawa', why:'全票 30／優待 25 PLN · 每日開放與售票皆至 20:00；10/30 沒有晚間延長場，17:00 後已是夜景'},
    ],
    backup: [
      {label:'體力不足', where:'14:40 後直接回飯店休息', why:'起義博物館與城堡都在上午到中午完成；下午的瓦津基與國家博物館都可以整段取消，不影響晚餐'},
      {label:'天氣轉壞', where:'水上宮殿只看室內，或改國家博物館（室內）', map:'https://www.google.com/maps/search/?api=1&query=Muzeum%20Narodowe%20w%20Warszawie%2C%20Aleje%20Jerozolimskie%203', why:'老城步行段縮成教堂與老城廣場；瓦津基戶外淋雨意義不大，改提早進國家博物館（週五至 20:00）'},
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
      {t:'07:20', label:'住宿出發前往 Charlotte Złota', sub:'行李先留住宿，前往 Złota 83；預留約 40 分鐘步行與找店，天候差就改住宿／車站沿線早餐', dur:'40 min'},
      {t:'08:00', id:'d8-breakfast', label:'早餐 · Charlotte Bouillon Złota', sub:'法式吐司或歐姆蛋，08:45 收尾；08:15 還無法入座就外帶或改住宿／車站沿線，保住機場交通', cost:'依店家', dur:'45 min'},
      {t:'08:45', label:'返回 Metropol 取行李', sub:'預留 45 分鐘返回住宿，09:30 前取齊行李並辦理退房，09:45 出發', dur:'45 min'},
      {t:'09:45', label:'退房 → Warszawa Centralna', sub:'由 Hotel Metropol 出發；依行李狀況步行或叫車，當日再用導航重算並預留找月台緩衝', dur:'30–45 min'},
      {t:'10:30', label:'SKM S2／S3 目標班次', sub:'回程往機場方向：S2 由 Warszawa Śródmieście 上車、S3 由 Warszawa Centralna 上車（兩線停靠站不同，看清楚再上）。官方標示 75 分鐘第 1 區票；當日查 WTP 月台與發車時間', cost:'75 分第 1 區票 4.40', dur:'約 25–30 min'},
      {t:'11:00', label:'抵 Chopin 第一航廈'},
      {t:'11:15', label:'退稅文件 + 報到 + 安檢', sub:'如有 TAX FREE 商品，依機場與電子文件指示辦理；託運商品須在交運前備妥供海關查驗', dur:'預留至少 60–90 min'},
      {t:'安檢與出境後', timingMode:'relative', id:'d8-lunch', label:'機場午餐 · 依登機區選擇', sub:'先確認登機門與截止時間，再找可通行區域內的餐廳；QR 260 往多哈不把申根區 Gate One 當作主選'},
      {t:'14:40', label:'★ QR 260 起飛', sub:'WAW → DOH → HKG → TPE'},
      {t:'機上', timingMode:'relative', id:'d8-dinner', label:'機上晚餐', sub:'依實際航段供餐；轉機時先確認下一段登機門與截止'},
    ],
    eat: [],
    backup: [
      {label:'早餐備案', where:'Warszawa Centralna 車站內當日營業的咖啡或麵包店', map:'https://www.google.com/maps/search/?api=1&query=Warszawa%20Centralna%20coffee%20bakery', why:'由 Hotel Metropol 往機場鐵路站時順路購買；店家和週六開門時間尚未指定，前一晚確認。Bar Mleczny Prasowy（Marszałkowska 10/16）週六 09:00 才開且不順路，不列為 08:00 早餐備案'},
      {label:'班機提早 2 h', where:'蕭邦機場 1F Costa Coffee · 觀景窗', map:'https://www.google.com/maps/search/?api=1&query=Warsaw%20Chopin%20Airport%20Terminal%20A', why:'退稅 + 安檢順可能 12:30 就過關，1F 貴賓區外有平價咖啡'},
      {label:'紀念品最後採買', where:'先在飯店旁 Złote Tarasy 補齊，機場店只作最後備案', map:'https://www.google.com/maps/search/?api=1&query=Z%C5%82ote%20Tarasy%2C%20Z%C5%82ota%2059%2C%20Warszawa', why:'Złote Tarasy 就在 Warszawa Centralna 對面、距 Hotel Metropol 約 500 公尺，一–六約 09:00 開門，距 09:45 退房出發僅 45 分鐘，還需往返與結帳；伴手禮宜前一天買齊，未核實的機場價差不作預算依據'},
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
    note: '2026-09-09 由官方售票頁確認為現行網域（專案先前使用的舊網域已全面更新）。首頁即為查詢表單，可切換 English，另有 Where is my bus?（即時車輛位置）與 My Ticket（查已購票）。Auschwitz 往返請用下方「Auschwitz 巴士」區塊的查詢參數操作。',
  },
  {
    name: 'Moj Bus 售票網站（moj-bus.pl）',
    url: 'https://moj-bus.pl/en',
    note: 'Kraków ⇄ Oświęcim 路線的另一個巴士訂位入口，網址帶 /en 即為英文介面。Lajkonik 採用的 15:30（或備案 16:30）客滿、或想比對其他時段時用這裡。⚠️ 2026-09-14 於本專案建置環境無法連線查證（對外連線被阻擋），班次、票價與上下車點請出發前自行於該站確認——尤其要確認停靠的是博物館門口還是 Oświęcim 市區站。',
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
  {tier:'第一優先', note:'四段城際火車與 Auschwitz 導覽已訂妥；其餘依官方售票系統確認指定日期與庫存', items:[
    {name:'Auschwitz 官方英文導覽（10/26 10:30 已訂妥）', url:ticketPurchaseById('krakow-auschwitz').purchaseUrl},
    {name:'Wieliczka 鹽礦英文團（現在即可訂）', url:ticketPurchaseById('krakow-wieliczka').purchaseUrl},
    {name:`Lajkonik 往返巴士（去程 ${lajkonikOutboundAdopted.dep} → ${lajkonikOutboundAdopted.arr}、回程 ${lajkonikInboundAdopted.dep} → ${lajkonikInboundAdopted.arr}，皆曾查得、付款前重查）`, url:'https://www.lajkonikbus.pl/'},
    {name:'華沙 → 克拉科夫 EIP 5300（已購票；核對抵達時間與座位）', url:'https://www.intercity.pl/en/'},
    {name:'克拉科夫 → 樂斯拉夫 IC 3830（已購票；核對抵達時間與座位）', url:'https://www.intercity.pl/en/'},
    {name:'樂斯拉夫 → 波茲南 IC 260（已購票；核對抵達時間與座位）', url:'https://www.intercity.pl/en/'},
    {name:'波茲南 → 華沙 EIC 8104（已購票；核對抵達時間與座位）', url:'https://www.intercity.pl/en/'},
  ]},
  {tier:'第二優先', note:'❗全部尚未訂 · 辛德勒工廠現已可查／購，其餘依官方售票頁', items:[
    {name:'辛德勒工廠（10/25 已進個人網路票 90 天窗口；最後入場 18:30）', url:ticketPurchaseById('krakow-schindler').purchaseUrl},
    {name:'Wawel 城堡短路線 15:15 左右時段票', url:ticketPurchaseById('krakow-wawel-castle').purchaseUrl},
    {name:'華沙起義博物館', url:ticketPurchaseById('warsaw-rising-museum').purchaseUrl},
    {name:`皇家城堡（官網複查二至日 ${royalCastleVenue.hours.opens}–${royalCastleVenue.hours.closes}，末入 ${royalCastleVenue.hours.lastEntry}）`, url:ticketPurchaseById('warsaw-royal-castle').purchaseUrl},
    {name:'拉茨瓦維採全景畫', url:ticketPurchaseById('wroclaw-panorama').purchaseUrl},
  ]},
  {tier:'餐廳與備案', note:'❗全部尚未訂（2026-10-13 旅客確認）· 優先訂 Mr. Jerry 與 Soul Kitchen，再訂 Hankki、Specjały 與 Pimiento、Carla 兩頓午餐', items:[
    {name:'Mr. Jerry 10/26 18:30（Beef Wellington；官網訂位）', url:'https://www.mrjerry.pl/rezerwacja-krakow/'},
    {name:'Soul Kitchen 10/30 18:30（電話 +48 519 020 888 訂位並預留 Beef Wellington；沒有改 Rusiko +48 22 629 06 28）', url:'https://restaurantguru.com/Soul-Kitchen-Warsaw'},
    {name:'Hankki 10/25 19:15（MojStolik 線上訂位）', url:'https://mojstolik.pl/restauracja/Hankki/f733c19bc164a5ad85848d96dc851be9'},
    {name:'Specjały Regionalne 10/24 18:30（TheFork 訂位）', url:'https://www.thefork.com/restaurant/specjaly-regionalne-restauracja-polska-stare-miasto-r858538'},
    {name:'Pimiento 10/25 13:00 兩位（尚未訂；官網 ZAREZERWUJ 或電話 +48 517 475 818）', url:'https://pimiento.pl/stary-kleparz/'},
    {name:'Carla Trattoria Moderna 10/29 14:00 兩位（zjedz.my 線上訂位）', url:'https://zjedz.my/carla-trattoria-moderna'},
  ]},
];

// checkedAt：實際人工核對這筆狀態的 YYYY-MM-DD；不以建置日期代填。
// 2026-10-13 旅客逐項確認：15 項未完成項目全部仍未購票／未訂位，故統一記為 10/13。
// recheckAt：下次查核期限 YYYY-MM-DD；null 時儀表板以行程日期判斷逾期。
// 前三段的 checkedAt 為 2026-09-28，第四段為 2026-10-06 檢視 App 票券清單日期；
// 截圖未顯示抵達時間、艙等與座位，這些資訊仍需票券詳細頁。
export const todoGroups = [
  {
    id: 'rail', title: '城際交通', eyebrow: 'Rail · 5 項',
    intro: '四段 PKP 均已出現在旅客 App 票券清單；Auschwitz 導覽已訂妥，往返巴士尚未購票。四段火車的抵達時間、艙等、車廂、座位與票價仍待票券詳細頁核對。',
    items: [
      {checkedAt:'2026-09-28', recheckAt:null, date:'10/25', name:'EIP 5300｜Warszawa Centralna → Kraków Główny', status:'已購票', action:'App 票券清單顯示 08:40 發車；開啟票券詳細頁核對抵達時間、艙等、車廂、座位並存離線。', url:'https://www.intercity.pl/en/'},
      {checkedAt:'2026-10-13', recheckAt:'2026-10-12', date:'10/26', name:'Lajkonik 克拉科夫 ⇄ Auschwitz 巴士', status:'曾查得指定日班次／尚未購票', action:`2026-09-09 曾在 lajkonikbus.pl 查得去回班次；本輪未重新取得 10/26 可售結果，付款前須重查班次與庫存：去程 ${lajkonikOutboundAdopted.dep}（Bosacka 18 ${lajkonikOutboundAdopted.bay}）→ ${lajkonikOutboundAdopted.arr}、回程 ${lajkonikInboundAdopted.dep}（Więźniów Oświęcimia 55）→ ${lajkonikInboundAdopted.arr}，各 ${lajkonikOutboundAdopted.dur}、全票 ${lajkonikFare.full} zł／優待 ${lajkonikFare.discount} zł。備案為回程 ${lajkonikInboundBackup.dep} → ${lajkonikInboundBackup.arr}。下單時確認人數、上下車站與是否需選位。2026-10-13 網路搜尋（未能直接開啟售票頁）：lajkonikbus.pl 公開時刻表仍列 Bosacka 18 ${lajkonikOutboundAdopted.dep} 發車，Lajkonik 線上訂票平台 lajkonik.moj-bus.pl 的奧斯威辛→克拉科夫班次仍含 ${lajkonikInboundAdopted.dep}、${lajkonikInboundBackup.dep}；10/26 實際可售座位須在付款頁確認。`, url:'https://www.lajkonikbus.pl/'},
      {checkedAt:'2026-09-28', recheckAt:null, date:'10/27', name:'IC 3830｜Kraków Główny → Wrocław Główny', status:'已購票', action:'App 票券清單顯示 16:45 發車；開啟票券詳細頁核對抵達時間、艙等、車廂、座位。15:00 結束 Kazimierz，16:10 前到站。', url:'https://www.intercity.pl/en/'},
      {checkedAt:'2026-09-28', recheckAt:null, date:'10/28', name:'IC 260｜Wrocław Główny → Poznań Główny', status:'已購票', action:'App 票券清單顯示 19:10 發車；核對抵達時間、艙等、車廂、座位，並確認公寓晚間取鑰匙方式。', url:'https://www.intercity.pl/en/'},
      {checkedAt:'2026-10-06', recheckAt:null, date:'10/29', name:'EIC 8104｜Poznań Główny → Warszawa Centralna', status:'已購票', action:'App 票券清單顯示 17:40 發車；開啟票券詳細頁核對抵達時間、艙等、車廂、座位及票價並存離線。17:05 前到站。', url:'https://www.intercity.pl/en/'},
    ],
  },
  {
    id: 'attractions', title: '主要景點', eyebrow: 'Tickets · 7 項',
    intro: '指定日期的場次與庫存會變動；付款完成後請下載離線票券並核對入場時間。',
    items: [
      {checkedAt:'2026-10-13', recheckAt:null, date:'10/25', ticketPurchaseId:'krakow-wawel-castle', name:'Wawel 城堡 15:15', status:'尚未訂', action:'以官方售票頁選 10/25 15:15 左右、可於 16:15 前結束的短路線；完整 2 小時路線會壓縮到辛德勒工廠的移動時間。', url:ticketPurchaseById('krakow-wawel-castle').purchaseUrl},
      {checkedAt:'2026-10-13', recheckAt:null, date:'10/25', ticketPurchaseId:'krakow-schindler', name:'辛德勒工廠 17:30', status:'現可查／購', action:'10/25 已進個人網路票 90 天窗口；以官方售票頁的可售時段為準。', url:ticketPurchaseById('krakow-schindler').purchaseUrl},
      {checkedAt:'2026-09-09', recheckAt:null, date:'10/26', ticketPurchaseId:'krakow-auschwitz', name:'Auschwitz 英文官方導覽 10:30', status:'已訂妥', action:'10:30 個人 educator 導覽（英文），官方標示約 3 小時 45 分，2 人。電子入場證存離線，入場須同時出示證件。', url:ticketPurchaseById('krakow-auschwitz').purchaseUrl},
      {checkedAt:'2026-10-13', recheckAt:null, date:'10/27', ticketPurchaseId:'krakow-wieliczka', name:'Wieliczka 鹽礦英文團', status:'需查／購', action:'在官方日期選擇器確認英文場、票價與庫存。2026-10-06 官方售票系統查詢時，10/27 英文場自 08:30 起每 30 分鐘一場，10:00 場當時有名額（不保證購票時仍有位）；英語 Tourist Route 全票 143／優待 121 PLN。', url:ticketPurchaseById('krakow-wieliczka').purchaseUrl},
      {checkedAt:'2026-10-13', recheckAt:null, date:'10/28', ticketPurchaseId:'wroclaw-panorama', name:'拉茨瓦維採全景畫 11:30', status:'場次已查／尚未訂', action:'9/24 官方 10/28 日期下曾列 11:30 場、85 個名額（30 分鐘一場）；這是歷史快照，10/06 未取得目前庫存，付款前重查。', url:ticketPurchaseById('wroclaw-panorama').purchaseUrl},
      {checkedAt:'2026-10-13', recheckAt:null, date:'10/30', ticketPurchaseId:'warsaw-royal-castle', name:'華沙皇家城堡 11:30', status:'尚未訂', action:'選 11:30 入場的 Royal Route；10 月起最後入場 16:00（2026-10-12 官網），起義博物館與無名塚之後接著走。', url:ticketPurchaseById('warsaw-royal-castle').purchaseUrl},
      {checkedAt:'2026-10-13', recheckAt:null, date:'10/30', ticketPurchaseId:'warsaw-rising-museum', name:'華沙起義博物館 08:30', status:'尚未訂', action:'週五 08:00 開館，訂 08:30 入場（一早人最少）；看約 2 小時，10:30 前離館接無名塚與皇家城堡。', url:ticketPurchaseById('warsaw-rising-museum').purchaseUrl},
    ],
  },
  {
    id: 'dining', title: '餐飲訂位', eyebrow: 'Dining · 8 項',
    intro: '餐廳營業與臨時包場以店家訂位頁公告為準。',
    items: [
      {checkedAt:'2026-10-13', recheckAt:'2026-10-22', date:'10/24', name:'Specjały Regionalne 18:30 晚餐', status:'尚未訂位', action:'時段以店家卡為準（2026-10-10 查：品牌門市頁週五、週六 11:30–23:00；polishcuisine.pl 列 12:00–23:30），10/24 18:30 兩個版本都有營業。抵達日不想排隊就先在 TheFork 訂位：https://www.thefork.com/restaurant/specjaly-regionalne-restauracja-polska-stare-miasto-r858538', url:'https://www.google.com/maps/search/?api=1&query=Specja%C5%82y%20Regionalne%20Nowy%20%C5%9Awiat%2044%2C%20Warszawa'},
      {checkedAt:'2026-10-13', recheckAt:'2026-10-22', date:'10/25', name:'Pimiento 13:00 午餐', status:'尚未訂位', action:'Świętego Filipa 21，午餐菜單 13:00 起才供應，週日只開到 15:00，沒訂到可能吃不到午餐菜單。用官網 ZAREZERWUJ 按鈕（https://pimiento.pl/stary-kleparz/）或電話 +48 517 475 818 訂 10/25 13:00 兩位；訂不到改 Hotel Polonia 餐廳。', url:'https://pimiento.pl/stary-kleparz/'},
      {checkedAt:'2026-10-13', recheckAt:'2026-10-22', date:'10/25', name:'Hankki 19:15 晚餐', status:'尚未訂位', action:'2026-10-10 查 Michelin 與 MojStolik：週日 13:00–21:00，19:15 在營業時間內；最後點餐時間查不到。建議用 MojStolik 線上訂位（https://mojstolik.pl/restauracja/Hankki/f733c19bc164a5ad85848d96dc851be9）或電話 +48 798 399 851，訂不到改 MOLÁM 或 NOAH。', url:'https://guide.michelin.com/mx/es/lesser-poland/krakow/restaurante/hankki'},
      {checkedAt:'2026-10-13', recheckAt:'2026-10-22', date:'10/26', name:'Mr. Jerry 18:30 晚餐（Beef Wellington）', status:'尚未訂位', action:'奧斯威辛返城後的晚餐。2026-10-12 複查：官網確認 Jagiellońska 5 與招牌 Beef Wellington，週一 15:00–22:00（多數目錄一致，官網各區塊矛盾），價格未公開；訂位時一併確認 10/26 有供應 Wellington（電話 +48 533 836 624）。訂不到改 Pod Aniołami（每日 13:00–23:00）；FOLGA 週一可能休息，要去先打電話。', url:'https://www.mrjerry.pl/rezerwacja-krakow/'},
      {checkedAt:'2026-10-13', recheckAt:'2026-10-22', date:'10/27', name:'Bistro Posolone 出礦後午餐', status:'待確認營業', action:'2026-10-10 查得：位於鹽礦園區 Park Kingi 6，官方寫「每天依鹽礦開放時間」（約 08:00–18:00），確切時刻未查到。菜單有披薩、漢堡、湯、沙拉、薯條，30 分鐘內吃完就點湯、沙拉或漢堡，才趕得上返回車站與 16:45 IC 3830；可電話 +48 12 278 75 20 確認，來不及改自備餐。', url:'https://www.google.com/maps/search/?api=1&query=Bistro%20Posolone%2C%20Wieliczka'},
      {checkedAt:'2026-10-13', recheckAt:'2026-10-22', date:'10/29', name:'Carla Trattoria Moderna 14:00 午餐', status:'尚未訂位', action:'在 zjedz.my 訂 10/29 14:00 兩位（https://zjedz.my/carla-trattoria-moderna）；店家也有電話 +48 796 200 002。2026-10-12 查：週四 14:00 才開門（Google 地圖與 zjedz.my 一致，menu.pl 外送時段到 21:30），12:30 吃不到。15:15 前結帳，上菜慢就砍帝王城堡內部，先保 17:05 到站；近期有評論說上菜偏慢。訂不到改 Pyra Bar 12:30 午餐。', url:'https://zjedz.my/carla-trattoria-moderna'},
      {checkedAt:'2026-10-13', recheckAt:'2026-10-22', date:'10/29', name:'Arirang 晚餐', status:'待確認營業', action:'10/29 晚餐首選，約 20:30（待查票面）抵華沙。2026-10-12 複查：Yelp 與多個目錄週四 12:00–22:00，沒有店家官網，最後點餐時間與線上訂位都未查到。當天打 22 881 78 51 或 22 622 18 86 問，21:30 前能入座才去，否則改 Złote Tarasy 內快食、Soul Kitchen 或 24 小時的 Ćma。', url:'https://www.google.com/maps/search/?api=1&query=Arirang%20Restaurant%20Nowogrodzka%2038%2C%20Warszawa'},
      {checkedAt:'2026-10-13', recheckAt:'2026-10-22', date:'10/30', name:'華沙最後晚餐 · Soul Kitchen 18:30（威靈頓）', status:'尚未訂位', action:'國家博物館步行約 12 分到 Nowogrodzka 18A。電話 +48 519 020 888 訂 10/30（週五）18:30、2 人，並請店家預留 Beef Wellington；菜單隨季節換，官方菜單未確認，沒供應就改訂 Rusiko（Wierzbowa 11，+48 22 629 06 28，週二至週六 13:00–24:00）。另一間威靈頓評價高的 Primitivo（Waliców 13，+48 606 44 44 62，週五至 23:00）在 Wola，離晚上動線較遠。', url:'https://restaurantguru.com/Soul-Kitchen-Warsaw'},
    ],
  },
];

export const reservations = [
  {when:'✅ 已完成', what:'Auschwitz 英文官方導覽 — 10/26 10:30 個人 educator 導覽（約 3 小時 45 分，2 人）已訂妥。入場憑電子入場證＋證件，出發前存離線。'},
  {when:'❗現在就查／訂', what:'Wieliczka 鹽礦英文 Tourist Route 10:00 場 — 10/27 英文場、實際票價與庫存以官方日期選擇器為準；不要用舊價格或開賣週期取代訂票結果。'},
  {when:'現在可訂', what:`皇家城堡 — 2026-10-12 官網複查二至日 ${royalCastleVenue.hours.opens}–${royalCastleVenue.hours.closes}、最後入場 ${royalCastleVenue.hours.lastEntry}；Day 7 排 11:30 入場（zamek-krolewski.pl）`},
  {when:'現在可先訂', what:'行程餐廳：10/26 Mr. Jerry（威靈頓）、10/30 Soul Kitchen（威靈頓）先訂，再訂 10/25 Hankki、10/24 Specjały，以及 10/25 Pimiento、10/29 Carla 兩頓午餐；米其林星級餐廳（Bottiglieria 1881、BABA／Most、WANDAL）未排入行程，想加需另外訂並重排晚餐'},
  {when:'火車票：已購 4／4 段', what:'App 票券清單已有 10/25 EIP 5300（Warszawa Centralna 08:40）、10/27 IC 3830（Kraków Główny 16:45）、10/28 IC 260（Wrocław Główny 19:10）、10/29 EIC 8104（Poznań Główny 17:40）。四段抵達時間、艙等、車廂、座位與票價待查票券詳細頁。'},
  {when:'現在可查／訂', what:'辛德勒工廠 10/25 場次已進個人網路票 90 天窗口；華沙起義博物館與皇家城堡均以官方售票頁顯示的指定日庫存為準。'},
  {when:'出發前 1 週', what:'把上述所有票價、特別閉館與開放時間再確認一次 — 門票速查與城市指南已於 2026-09-17／09-18 全面複查過，臨時活動與維修仍可能變動'},
  {when:'現在查／購 10/25', what:'Wawel 15:15 短路線：優先查王冠寶庫或 Castle Underground 的 10/25 時段；各 47／35 PLN，尚未購票。10/25 才到克拉科夫，不能安排 10/24 在當地購票；無合適時段則只看庭院與外觀，16:15 前離開。'},
];

// 訂票與查核的行動截止日。
//
// 尚未購票的城際火車不列在這裡——它的開賣日已經是 trains[].saleOpens，
// 重抄一次就會有兩份各自漂移的事實；改由 collectDeadlines() 於建置時併入。
//
// basis 記錄每個日期的來源：官方公告的照抄，由既有規則推算的寫明怎麼算的。
// 沒有來源基礎的日期不要放進這張表，倒數看板會讓它看起來像官方期限。
export const deadlines = [
  {
    id: 'dining-michelin', date: '2026-10-02', category: '餐飲',
    title: '行程餐廳訂位（Mr. Jerry、Soul Kitchen、Hankki、Specjały、Pimiento、Carla）',
    action: '先訂兩家晚餐主選：10/26 Mr. Jerry 18:30（電話 +48 533 836 624，順便確認當天有 Beef Wellington）、10/30 Soul Kitchen 18:30（+48 519 020 888，請店家預留 Beef Wellington；沒有就改 Rusiko +48 22 629 06 28）；再訂 10/25 Hankki 19:15（MojStolik 或 +48 798 399 851）與 10/24 Specjały Regionalne 18:30（TheFork）；兩頓午餐 10/25 Pimiento 13:00（官網 ZAREZERWUJ 或 +48 517 475 818）與 10/29 Carla Trattoria Moderna 14:00（zjedz.my）也要訂。2026-10-13 旅客確認六家都還沒訂。米其林星級餐廳未排入行程，想加再另外訂。',
    status: '尚未訂位', url: 'https://www.mrjerry.pl/rezerwacja-krakow/',
    basis: '行前提醒「熱門餐廳出發前 3–4 週訂」，取窗口下緣 3 週由 10/23 台灣出發日回推；2026-10-12 依改排後的每日晚餐更新店名，2026-10-13 補上待辦頁已列的兩家午餐訂位。',
  },
  {
    id: 'ticket-wieliczka', date: '2026-10-02', category: '門票',
    title: 'Wieliczka 鹽礦 10/27 英語團',
    action: '於官方日期選擇器確認 10/27 英語場次、票價與庫存後購票；通用頁最低起價不是 10/27 英語場實際票價。',
    status: '需查／購', url: ticketPurchaseById('krakow-wieliczka').purchaseUrl,
    basis: '訂票優先順序列為第一優先「現在即可訂」；指定日場次有限，取出發前 3 週為行動下限。',
  },
  {
    id: 'ticket-schindler', date: '2026-10-02', category: '門票',
    title: '克拉科夫 10/25：辛德勒工廠與 Wawel 短路線',
    action: '10/25 已進個人網路票 90 天窗口，依官方售票頁可售時段購票（辛德勒 17:30，最後入場 18:30）；同一天的 Wawel 15:15 左右、16:15 前可結束的短路線（王冠寶庫或 Castle Underground）在 bilety.wawel.krakow.pl 一起訂。2026-10-13 旅客確認兩館都還沒買。',
    status: '現可查／購', url: ticketPurchaseById('krakow-schindler').purchaseUrl,
    basis: '訂票優先順序第二優先已註記「10/25 已進個人網路票 90 天窗口」；取出發前 3 週為行動下限。Wawel 同為 10/25 指定時段票，原本沒有自己的期限，2026-10-13 併入本筆。',
  },
  {
    id: 'ticket-warsaw-trio', date: '2026-10-09', category: '門票',
    title: '華沙兩館 10/30 指定日票',
    action: '起義博物館 08:30、皇家城堡 11:30（10 月起末入 16:00），依各官方售票頁的 10/30 可售時段一次訂齊；瓦津基水上宮殿週五免費、國家博物館現場買即可。',
    status: '尚未訂', url: ticketPurchaseById('warsaw-royal-castle').purchaseUrl,
    basis: 'Day 7 兩館（皇家城堡、起義博物館）皆已查得開放時間但均未訂；取出發前 2 週為行動下限。',
  },
  {
    id: 'ticket-panorama', date: '2026-10-09', category: '門票',
    title: '拉茨瓦維採全景畫 10/28 11:30 場次',
    action: '在官方售票頁選 10/28（週三）11:30 場；9/24 曾列 85 個名額，那是歷史快照，付款前看當下庫存。全景畫票含國家博物館等常設展，3 個月內有效。2026-10-13 旅客確認還沒買。',
    status: '場次已查／尚未訂', url: ticketPurchaseById('wroclaw-panorama').purchaseUrl,
    basis: '與華沙兩館同屬指定日、限量場次的票，比照 ticket-warsaw-trio 取出發前 2 週為行動下限；2026-10-13 補上——待辦頁原本有這筆，倒數表卻漏列。',
  },
  {
    id: 'bus-lajkonik', date: '2026-10-12', category: '交通',
    title: 'Lajkonik 往返 Auschwitz 巴士購票',
    action: `2026-09-09 曾查得班次，尚未購票；付款前須重查班次、票價與庫存：去程 ${lajkonikOutboundAdopted.dep}（Bosacka 18 · ${lajkonikOutboundAdopted.bay}）→ ${lajkonikOutboundAdopted.arr}、回程 ${lajkonikInboundAdopted.dep} → ${lajkonikInboundAdopted.arr}，全票 ${lajkonikFare.full} zł。備案為回程 ${lajkonikInboundBackup.dep}。`,
    status: '指定日尚未確認', url: 'https://www.lajkonikbus.pl/',
    basis: '待辦事項該筆的 recheckAt = 2026-10-12。',
  },
  {
    id: 'recheck-all', date: '2026-10-16', category: '複查',
    title: '全站票價、開放時間與特別閉館複查',
    action: '門票速查與城市指南已於 2026-09-17／09-18 全面複查過，但臨時活動與維修仍可能變動；出發前再整批重查一次，重點在仍標「待確認」的項目（Wieliczka 10/27 場次、帝王城堡展期聯票；El Gato Odrzańska 8 已查每日 08:00–20:00）。',
    status: '待執行', url: null,
    basis: '訂位與每人預算清單的「出發前 1 週」條目，由 10/23 台灣出發日回推。',
  },
  {
    id: 'etias-check-2', date: '2026-10-20', category: '證件',
    title: 'ETIAS 最終確認',
    action: '10/06 官方仍未啟用、不收 ETIAS 申請；10/23 出發前最後一次重查啟用日、適用對象與過渡規則，僅在本次旅行已需授權時申請。EES 入境登錄已運作，須留現場登錄時間。',
    status: '待確認', url: 'https://travel-europe.europa.eu/etias_en',
    basis: '資料庫項目 entry-etias-and-passport 已於 10/06 重查官方狀態，並排 2026-10-16 複查；本筆是出發前 3 天的最後決策點，兩者互補不重複。',
  },
];
