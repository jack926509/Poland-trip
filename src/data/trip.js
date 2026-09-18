// trip.js — 行程資料源頭：meta、flights、days×8、stay、trains、bookingTiers、reservations
// 來源：redesign/data.js（原 window.TRIP 物件字面值），轉為 ES module 具名匯出。
// 2026-08-09 依景點、博物館與交通營運單位公開資料重新盤查。
// 尚未開賣的 10 月火車與短期資料明確標為待確認，不用歷史班次作為確定時刻。

export const meta = {
  code: 'POLSKA',
  edition: '2026 Poland Field Plan',
  dateRange: '2026 / 10 / 24 — 10 / 31',
  flightDateRange: '2026 / 10 / 23 — 11 / 01',
  travelStart: '2026-10-23',
  travelEnd: '2026-11-01',
  tripStart: '2026-10-24',
  tripEnd: '2026-10-31',
  timeZone: 'Europe/Warsaw',
  nights: 7, days: 8,
  cities: ['Warszawa', 'Kraków', 'Wrocław', 'Poznań'],
  route: '華沙 → 克拉科夫 → 樂斯拉夫 → 波茲南 → 華沙',
  highestRiskDays: ['Day 5 樂斯拉夫全景點 + 晚轉場', 'Day 7 三館連看'],
  flights: '國泰 + 卡達 + 長榮（六段均已購票；是否聯運／單一訂位待電子機票確認）',
};

export const days = [
  {
    n: 1, date: '10/24 (六)', city: '華沙',
    title: '抵達華沙 · 老城傍晚漫步',
    headline: '13:30 抵蕭邦機場，SKM 進城，老城散步、倒時差',
    tag: 'Arrival',
    intensity: '低',
    hardConstraints: ['不排室內博物館', '晚上早睡，保留 Day 2 轉場體力'],
    mustBook: [],
    compressible: ['老城散步範圍', '晚餐後甜點'],
    weather: '尚無可靠預報；出發前 7–10 天更新',
    steps: [
      {t:'13:30', label:'抵蕭邦機場', sub:'申根入境 + 提行李 ~75min', cost:'—', dur:'75 min'},
      {t:'14:45', label:'SKM S2／S3 目標班次', sub:'2026-09-17 WTP 官方機場交通頁：S2 停 Warszawa Śródmieście、S3 停 Warszawa Centralna，兩線都不互停，官方標示買 75 分鐘第 1 區票。上車先看是 S2 還 S3——S2 坐到 Śródmieście 出站即 Metro Centrum、飯店在對街；S3 要在 Centralna 下車再步行。月台與即時班次抵達後查 WTP', cost:'75 分第 1 區票 4.40', dur:'25–30 min'},
      {t:'15:15', label:'Hotel Metropol Check-in', sub:'ul. Marszałkowska 99a；入住 15:00 起，提早到可先寄放行李再出門', dur:'30 min'},
      {t:'16:45', label:'★ 老城廣場', sub:'皇家城堡 · 美人魚雕像', cost:'免費', dur:'1 h'},
      {t:'18:00', label:'Krakowskie Przedmieście', sub:'黃昏氛圍', cost:'免費', dur:'1 h'},
      {t:'19:00', label:'波蘭地方料理晚餐', sub:'Specjały Regionalne · Nowy Świat；出發前確認當日營業', cost:'PLN 35–55'},
      {t:'21:00', label:'早睡倒時差'},
    ],
    eat: [
      {text:'甜點 @ Pijalnia Czekolady E.Wedel（Szpitalna 8）', place:'Pijalnia Czekolady E.Wedel（Szpitalna 8）', note:'一–五 08:00–22:00、六 09:00–22:00、日 09:00–21:00', map:'https://www.google.com/maps/search/?api=1&query=Pijalnia+Czekolady+E.Wedel+Szpitalna+8+Warsaw'},
    ],
    backup: [
      {label:'下雨備案', where:'科學文化宮 30F 觀景台', why:'全票 30／優待 25 PLN（2026-09-18 官方售票系統查證）· 每日 10:00–20:00 · 室內 + 360° 城景，老城廣場走路 12 分', map:'https://www.google.com/maps/search/?api=1&query=Pa%C5%82ac%20Kultury%20i%20Nauki%2C%20plac%20Defilad%201%2C%20Warszawa'},
      {label:'時差太累', where:'Łazienki 公園溫室', why:'室內展館 + 蕭邦像，免費，傍晚前可走', map:'https://www.google.com/maps/search/?api=1&query=%C5%81azienki%20Kr%C3%B3lewskie%2C%20Agrykola%201%2C%20Warszawa'},
    ],
    practical: [
      {tag:'寄物', name:'飯店櫃檯優先', note:'Hotel Metropol 櫃檯提供行李寄放，15:00 前抵達先寄物；車站寄物櫃只作備案，尺寸、空位與費率會變動'},
      {tag:'換錢', name:'Kantor 民間匯兌', note:'現場比較買入與賣出價，不以「0% 手續費」代替實際匯率判斷'},
      {tag:'SIM', name:'Play / Plus / Orange', note:'預付卡需實名登記；通路、容量與價格以抵達當日電信商方案為準'},
    ],
  },
  {
    n: 2, date: '10/25 (日)', city: '華沙 → 克拉科夫',
    title: 'Wawel + 老城 + 辛德勒工廠 + Kazimierz 晚餐',
    headline: 'EIP 5300 參考 08:45–10:58；上車站以票面為準（現行班表 Centralna 08:40／Zachodnia 08:45），安排一等艙體驗',
    tag: 'Transit',
    intensity: '高',
    hardConstraints: ['08:10 前抵達購票票面所載的上車站；10/25 換表後先確認 EIP 5300 的停靠站（現行班表同時停 Warszawa Centralna 與 Zachodnia）', '辛德勒工廠 17:30 入場（最後入場 18:30）', '午餐與 Check-in 不能拖太久'],
    mustBook: ['❗尚未購票 · 華沙 → 克拉科夫火車', '❗尚未購票 · Wawel 短路線 14:00 左右時段票（寶庫或地下路線 47／35）', '可立即查／購 · 辛德勒工廠 17:30 時段票'],
    compressible: ['聖瑪利亞教堂內部參觀', '紡織會館購物時間'],
    weather: '尚無可靠預報；出發前 7–10 天更新',
    train: {type:'EIP 5300 · 參考班次', saleOpens:'2026-09-25', saleCheckedAt:'2026-09-08', leg:'指定日待確認／尚未訂票 · 一等艙建議', from:'Warszawa Zachodnia', to:'Kraków Główny', dep:'08:45', arr:'10:58', dur:'2h13', price:'票價待確認'},
    steps: [
      {t:'07:35', label:'退房後前往上車站', sub:'Hotel Metropol → Warszawa Centralna 步行約 500 公尺／8–10 分；若票面上車站為 Warszawa Zachodnia，再由 Centralna 轉 SKM／KM 約 7–10 分，全程用 Jakdojade 重算並預留拖行李時間', dur:'約 15–35 min'},
      {t:'08:10', label:'抵票面上車站', sub:'現行班表 EIP 5300 停 Warszawa Centralna（約 08:40）後才到 Zachodnia（約 08:45）；購票時若可選 Centralna 上車，可省去跨站轉乘。月台以當日電子牌為準', dur:'35 min 緩衝'},
      {t:'參考 08:45', label:'EIP 5300 前往克拉科夫', sub:'參考班次；10/25 換表後須確認實際停靠站與時刻並完成購票，購票後只依票面上車站行動', cost:'票價待確認', dur:'2h13'},
      {t:'參考 10:58', label:'抵 Kraków Główny', dur:'5–10 min 拖行李'},
      {t:'11:10', label:'旅館寄放行李', sub:'ibis budget Krakow Stare Miasto 在 Pawia 11，飯店官網標示距車站約 200 公尺', dur:'20 min'},
      {t:'11:30', label:'車站周邊午餐', sub:'10/25 為非營業週日，先確認店家當日營業；用餐後步行約 25–30 分到 Wawel', cost:'PLN 40–60', dur:'45 min'},
      {t:'13:00', label:'★ 瓦維爾大教堂', sub:'週日 12:30–17:00；Cathedral Museum 週日不開', cost:'PLN 26／18', dur:'45 min'},
      {t:'14:00', label:'★ Wawel 城堡短路線', constraint:{venue:'krakow-wawel-castle'}, sub:'2026-09-17 官網 9–12 月分路線售票，適合一小時空檔的是：王冠寶庫 47／35、Castle Underground 47／35（含語音導覽）、Armoury 47／35；二樓代表廳 57／43 需時較長。不要硬排一、二樓完整路線，會壓縮後續步行', cost:'寶庫或地下路線 PLN 47／35', dur:'1 h'},
      {t:'15:00', label:'★ 中央廣場 + 聖瑪利亞', sub:'本次先看廣場與教堂外觀，登塔改為有餘裕才安排。整點 Hejnał 號角；塔票僅於 Mariacki 廣場 7 號當日現場售票', cost:'外觀免費', dur:'30 min（含由城堡步行）'},
      {t:'15:30', label:'紡織會館 Sukiennice 快速一覽', sub:'採購留到 10/27', cost:'免費入場', dur:'15 min'},
      {t:'15:45', label:'步行經 Kazimierz、Podgórze 前往辛德勒工廠', sub:'保留約 85 分鐘步行與沿途短停，17:10 前到入口；時間不足改用 Jakdojade 查當下交通', dur:'約 1 h 25 min'},
      {t:'17:30', label:'★ 辛德勒工廠', constraint:{venue:'krakow-schindler'}, sub:'週日 09:00–20:00、最後入場為閉館前 90 分（18:30）· 常設展線上票一律實名，入場要帶與購票同名的證件正本 · 官方售票頁預約', cost:'PLN 60 · 優待 45', dur:'2 h'},
      {t:'19:45', label:'★ Kazimierz Plac Nowy zapiekanka 晚餐', sub:'19:45 主餐先訂 NOAH（以色列烤羊肉串配 pitta 餅），飯後再走去圓亭吃 Endzior zapiekanka', cost:'PLN 60–100'},
    ],
    eat: [
      {text:'zapiekanka 街食 @ Endzior', place:'Endzior @ Okrąglak（Plac Nowy 圓亭）', note:'圓亭內 zapiekanka 名攤，長棍麵包烤蘑菇起司', map:'https://www.google.com/maps/search/?api=1&query=Endzior+Krakow'},
    ],
    warn: '❗瓦維爾城堡尚未訂票；辛德勒工廠個人網路票在參觀日前 90 天 09:00 開放，10/25 已可在官方售票頁查／購。瓦維爾大教堂週日 12:30–17:00；城堡改走短路線並於 15:00 前離開，保留經 Kazimierz、Podgórze 步行到辛德勒工廠的時間。辛德勒工廠週二至週日 09:00–20:00、最後入場 18:30，17:30 屬可行時段。10/25 為非營業週日，多數一般商店關閉；餐廳等法定例外是否營業仍以店家公告為準。',
    backup: [
      {label:'辛德勒 17:30 滿場', where:'改訂 18:30 最後入場，或往前壓到下午較早時段（如 14:00）', why:'最後入場其實是 18:30，比原記錄多一小時可調度；mhk.pl/en 開放預約後立即下單'},
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
    headline: '10:30 英文 educator 導覽已訂妥；巴士去 07:10、回 15:30 皆已查定',
    tag: 'Memorial',
    intensity: '中高',
    hardConstraints: ['10:00 前完成 Muzeum Auschwitz 安檢（官方要求入場時段前 30 分鐘到場）', '10:30 英文 educator 導覽已訂妥，遲到不予補場', '回程巴士 15:30 發車，導覽結束後不要走遠', '晚間不再加博物館或長距離步行'],
    mustBook: ['✅ 已訂妥 · Auschwitz 官方英文導覽 10/26 10:30（個人 educator 導覽，約 3 小時 45 分，2 人）', '❗尚未購票 · Lajkonik 去程 07:10 → 08:35（班次已查定，直接下單）', '❗尚未購票 · Lajkonik 回程 15:30 → 16:55（備案 16:30 → 17:55）'],
    compressible: ['回克拉科夫後晚餐形式', '晚間自由活動'],
    weather: '尚無可靠預報；出發前 7–10 天更新',
    // 導覽已訂妥 10:30，巴士以「09:45 前抵達」回推。
    // 2026-09-09 以公開班表資料點重算：現行班表 Kraków MDA 06:20 起約每小時一班，
    // 已知資料點 08:35→約 10:00（太晚）、08:40、09:50；回程已知 08:20、11:30、13:45→15:10、14:00、16:30，末班約 18:15–19:15。
    // 指定日班次仍須在業者售票頁確認，這裡只寫目標時段。
    train: {type:'BUS · Lajkonik', leg:'去回班次皆已於官方售票頁查得／尚未購票（回程 15:30 → 16:55）', from:'Kraków MDA（ul. Bosacka 18，D10）', to:'Oświęcim, Więźniów Oświęcimia 55（Muzeum Auschwitz）', dep:'07:10', arr:'08:35', dur:'1h25', price:'PLN 25.00（優待 22.00）'},
    steps: [
      {t:'06:45', label:'Kraków MDA 報到', sub:'ul. Bosacka 18 Dworzec Autobusowy（Kraków Główny 後方步行約 5 分）；官方售票頁顯示此班由地下層 D10 發車，仍以現場電子看板為準', dur:'25 min 緩衝'},
      {t:'07:10', label:'Lajkonik · 克拉科夫 → 奧斯威辛', sub:'2026-09-09 於 lajkonikbus.pl 查得 10/26 當日班次：07:10 D10 發車、08:35 抵 Więźniów Oświęcimia 55，車程 1h25，全票 25.00 zł（優待 22.00 zł）。當日另一班 08:25 → 09:50 只比 10:00 安檢截止早 10 分鐘，緩衝不足不採用', cost:'PLN 25.00（優待 22.00）', dur:'1h25'},
      {t:'08:35', label:'抵 Auschwitz I', sub:'下車處就在博物館停車場對面。距 10:30 入場有 1 小時 55 分：先用免費寄物櫃放大件行李、過安檢（機場式檢查會排隊），剩餘時間可待在訪客中心書店與展覽前導區', dur:'1h55 緩衝'},
      {t:'10:30', label:'★ 英文官方導覽（已訂妥）', sub:'個人 educator 導覽 · 一館 + 比克瑙 · 官方標示約 3 小時 45 分；入場憑電子入場證＋證件，兩者缺一不可', cost:'已付款', dur:'3h45'},
      {t:'約 14:15', label:'導覽結束', sub:'比克瑙結束後依接駁巴士回一館，再走到停車站牌'},
      {t:'15:30', label:'回程巴士返克拉科夫', sub:'2026-09-09 於 lajkonikbus.pl 查得 10/26 回程僅三班：14:00（導覽結束前就開走，不可用）、15:30、16:30。採 15:30 由 Więźniów Oświęcimia 55 發車，導覽結束後有 75 分鐘走回站牌與休息；若導覽延後或接駁排隊，改搭 16:30（17:55 抵）', cost:'PLN 25.00（優待 22.00）', dur:'1h25'},
      {t:'16:55', label:'抵 Kraków MDA · 休息', sub:'ul. Bosacka 18 Dworzec Autobusowy；距晚餐還有約 1 小時，可先回旅館放東西'},
      {t:'18:00', label:'安靜晚餐沉澱情緒', cost:'PLN 60–100'},
    ],
    eat: [
      {text:'回程後的一杯咖啡 @ Karma Coffee Roasters', place:'Karma Coffee Roasters（Krupnicza）', note:'克拉科夫第一家精品咖啡店，公開資料列一–五 08:00–20:00、六日 10:00–19:00；巴士回到市區後可先坐下沉澱', map:'https://www.google.com/maps/search/?api=1&query=Karma%20Coffee%20Krupnicza%20Krak%C3%B3w'},
    ],
    warn: '✅ 導覽已訂妥：10/26 10:30 英文個人 educator 導覽（Zwiedzanie indywidualne z edukatorem），官方標示約 3 小時 45 分，2 人。官方明載「入場證需搭配身分證件」，請把電子入場證存離線並帶護照。🚌 巴士去回皆已查定、但尚未購票：官方要求入場時段前 30 分鐘到場完成安檢，因此必須在 10:00 前完成安檢；導覽約 14:15 結束，回程只能挑那之後的班次。去程已於 2026-09-09 在官方售票頁 lajkonikbus.pl 查得 10/26 實際班次並選定 **07:10 → 08:35**（D10 發車，1h25，全票 25.00 zł／優待 22.00 zł），抵達後距入場有 1 小時 55 分。當日另一班 08:25 → 09:50 只比 10:00 安檢截止早 10 分鐘，巴士一誤點就來不及，不採用；**沒有 07:35 這班**。回程同日查得 10/26 下午僅三班：14:00（導覽結束前開走，不可用）、**15:30 → 16:55（採用）**、16:30 → 17:55（備案），皆 25.00 zł、車程 1h25。去回兩程皆尚未購票，付款前仍以售票頁當下顯示為準。',
    // 回程選項。導覽約 14:15 結束，全部以「14:15 之後發車」為門檻。
    // 去程與回程皆已於 2026-09-09 由官方售票頁 lajkonikbus.pl 查得 10/26 當日班次；
    // 兩個方向都尚未購票，付款前仍以售票頁當下顯示為準。
    returnOptions: [
      {
        rank: '採用', name: 'Lajkonik 15:30 → 16:55 抵 Kraków MDA',
        detail: '由 Więźniów Oświęcimia 55 發車、停 ul. Bosacka 18 Dworzec Autobusowy，車程 1h25，25,00 zł。導覽 14:15 結束後有 75 分鐘走回站牌、上洗手間與逛訪客中心書店。',
        status: '✅ 2026-09-09 於官方售票頁 lajkonikbus.pl 查得 10/26 確有此班；尚未購票。',
        url: 'https://www.lajkonikbus.pl/',
      },
      {
        rank: '備案', name: 'Lajkonik 16:30 → 17:55 抵 Kraków MDA',
        detail: '同站牌、同票價的下一班。導覽延後、比克瑙接駁排隊或想多留時間時改搭，代價是多等 1 小時。',
        status: '✅ 同日查得。當天若已趕上 15:30 就不需要這班。',
        url: 'https://www.lajkonikbus.pl/',
      },
      {
        rank: '不可採用', name: 'Lajkonik 14:00 → 15:25',
        detail: '當日下午最早的一班，由同一站牌發車。',
        status: '❌ 導覽約 14:15 才結束，這班在那之前就開走。',
        url: 'https://www.lajkonikbus.pl/',
      },
      {
        rank: '彈性備案', name: '火車 Oświęcim → Kraków Główny',
        detail: '車程約 1 小時（區間車約 1h15），票價約 PLN 20–29，班次比巴士密。但 Oświęcim 火車站距博物館約 1.6 公里：步行約 20 分，或搭市區 0／2／3／8 路到「Muzeum I」約 4 分，4–10 月另有 M 線接駁。',
        status: '⚠️ 現行鐵路班表只到 2026-10-25，你 10/26 出發時已換新表，時刻必須重查。',
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
    title: 'Wieliczka 鹽礦 + Kazimierz 白天 · 傍晚轉場',
    headline: 'IC 3600 參考 17:55–20:52；鹽礦後保留取行李與進站緩衝',
    tag: 'Transit',
    intensity: '高',
    hardConstraints: ['早上完成 Wieliczka 鹽礦', '16:00 結束 Kazimierz 並回旅館取行李', '17:20 前抵 Kraków Główny；IC 3600 指定日班次仍須確認'],
    mustBook: ['❗尚未訂 · Wieliczka 鹽礦英文團', '❗尚未訂 · 克拉科夫 → 樂斯拉夫火車'],
    compressible: ['Kazimierz 白天散步', '老城補逛與採購'],
    weather: '尚無可靠預報；出發前 7–10 天更新',
    train: {type:'IC 3600 Siemiradzki · 參考班次', saleOpens:'2026-09-27', saleCheckedAt:'2026-09-08', leg:'指定日待確認／尚未訂票 · 二等艙建議', from:'Kraków Główny', to:'Wrocław Główny', dep:'17:55', arr:'20:52', dur:'2h57', price:'票價待確認'},
    steps: [
      {t:'08:00', label:'早餐 + 退房', sub:'行李寄旅館'},
      {t:'09:00', label:'火車到 Wieliczka Rynek-Kopalnia', sub:'KMŁ；2026-09-17 ZTP 官方票價表載明 70 分鐘 KMK+KMŁ 聯票涵蓋 Wieliczka Bogucice–Wieliczka Rynek Kopalnia 區段與所有站名含「Kraków」的車站，唯一排除的是 Kraków Airport——此程適用。注意是「70 分鐘」有效，逾時要另購', cost:'PLN 10（優待 5）', dur:'約 25 min'},
      {t:'10:00', label:'★ Wieliczka 鹽礦 Tourist Route 英文團', sub:'3.5 km · 135m 深 · St. Kinga 鹽教堂。指定日票價已查：10/27 英語 Tourist Route 全票 143／優待 121 PLN；但 10:00 這個場次是否存在、還有沒有位子仍未確認，購票前務必在官方日期選擇器逐項核對', cost:'PLN 143（優待 121）· 已查票價／尚未購票', dur:'2–3 h'},
      {t:'13:00', label:'Wieliczka 鎮中心午餐', cost:'PLN 40–60', dur:'30 min'},
      {t:'13:30', label:'火車回 Kraków Główny', sub:'回程同樣可用 70 分鐘 KMK+KMŁ 聯票（去程那張已失效，需再買一張）', cost:'PLN 10（優待 5）', dur:'約 25 min'},
      {t:'14:30', label:'★ Kazimierz 白天散步', sub:'舊猶太會堂 · Szeroka 街 · 《辛德勒名單》場景', cost:'免費', dur:'1.5 h'},
      {t:'16:00', label:'結束 Kazimierz 散步，回 ibis 取行李', sub:'飯店距 Kraków Główny 約 200 公尺；採購改為有餘裕才安排'},
      {t:'17:20', label:'抵 Kraków Główny', sub:'確認月台、車廂與座位；發車前保留約 35 分鐘', dur:'35 min 緩衝'},
      {t:'參考 17:55', label:'IC 3600 前往樂斯拉夫', sub:'指定日待確認／尚未訂票', cost:'票價待確認', dur:'2h57'},
      {t:'參考 20:52', label:'抵 Wrocław Główny', sub:'步行至主站對面的 Hotel Piast，拖行李保守抓 5–10 分鐘'},
    ],
    eat: [
      {text:'Sernik @ Cukiernia Michałek', place:'Cukiernia Michałek', map:'https://www.google.com/maps/search/?api=1&query=Cukiernia+Michalek+Krakow'},
      {text:'Pierożki u Vincenta（Kazimierz）', place:'Pierożki u Vincenta', map:'https://www.google.com/maps/search/?api=1&query=Pierozki+u+Vincenta+Krakow'},
    ],
    warn: '❗鹽礦與城際火車皆尚未購票。10/27 英語 Tourist Route 票價已查到 143／121 PLN，但 10:00 場次與庫存仍未確認，仍須在官方日期選擇器逐項核對；IC 3600 的 17:55–20:52 是目前採用的參考班次，不是已購票。若指定日班表不同，先保留 17:20 抵站與住宿接駁緩衝再重排。',
    backup: [
      {label:'鹽礦客滿或超時', where:'先查當日英文場與 PKP 實際班次再調整', why:'10/27 城際班表尚未確定，不能先假定末班車或緩衝時間'},
      {label:'雨天備案', where:'鹽礦本身就在地下 135m', map:'https://www.google.com/maps/search/?api=1&query=Kopalnia%20Soli%20Wieliczka%2C%20Dani%C5%82owicza%2010%2C%20Wieliczka', why:'地下約 17–18°C、防雨遮陽最佳備案'},
      {label:'想留更多 Kazimierz 時間', where:'PKP 班次確定後，才延伸散步或採購時間', why:'16:00 先收尾；不得壓縮取行李與 17:20 抵站緩衝'},
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
    headline: 'Baltic Express 260 參考 19:10–20:29；完整保留白天遊玩時間',
    tag: 'Transit',
    intensity: '很高',
    hardConstraints: ['早餐後早出門', '百年廳距離老城較遠需抓交通', '座堂島點燈人無對外保證的固定出發分鐘，日落前到場等候', '18:35 前抵 Wrocław Główny；260 指定日班次仍須確認'],
    mustBook: ['❗尚未訂 · 樂斯拉夫 → 波茲南火車', '❗尚未訂 · 拉茨瓦維採全景畫場次'],
    compressible: ['百年廳停留縮短為外觀與周邊', '座堂島改 45–60 分鐘重點散步', '午餐改簡餐或外帶'],
    weather: '尚無可靠預報；出發前 7–10 天更新',
    train: {type:'Baltic Express 260 · 參考班次', saleOpens:'2026-09-28', saleCheckedAt:'2026-09-08', leg:'指定日待確認／尚未訂票 · 二等艙建議', from:'Wrocław Główny', to:'Poznań Główny', dep:'19:10', arr:'20:29', dur:'1h19', price:'票價待確認'},
    steps: [
      {t:'09:00', label:'★ 中央廣場 + 紡織會館', sub:'dwarfsmap.com 找小矮人', cost:'免費', dur:'1.5 h'},
      {t:'10:30', label:'糖果屋雙屋 + 教堂塔樓', sub:'聖伊莉莎白教堂塔高 96m、觀景台 75m、304 階無電梯；一–六 10:00–19:00', cost:'PLN 16／10 · 現金', dur:'45 min'},
      {t:'11:30', label:'★ 拉茨瓦維採全景畫', sub:'30 分鐘一場，採分時段入場；10/28 指定時段庫存尚未確認', cost:'PLN 50／優待 35', dur:'1 h'},
      {t:'13:30', label:'★ 百年廳 (UNESCO)', constraint:{venue:'wroclaw-hala-stulecia'}, sub:'官方 availability calendar 逐日分四色：綠＝多媒體展與廳內看台都可看、藍＝部分時段廳內不開但展覽可看、黃＝不能進到圓頂正下方但展覽可看、紅＝兩者都不開。2026-09-18 複查官方日曆仍以 JavaScript 逐日渲染，靜態頁讀不到指定日顏色，10/28 屬於哪一色仍未確認——行前重查，未確認前以外觀、噴泉與日本花園規劃', cost:'外觀免費；Visitor Centre 25／20、加看廳內 30／25', dur:'1 h'},
      {t:'16:15', label:'★ 座堂島煤氣燈', sub:'日落約 16:34；點燈人無固定公開出發分鐘，在島上等候與散步', cost:'免費', dur:'1 h'},
      {t:'17:15', label:'座堂島結束後回 Piast 取行李', sub:'座堂島 → 旅館約 25–30 分；距參考發車 1h55，18:35 前抵站後保留約 35 分鐘緩衝', dur:'約 1 h 20 min'},
      {t:'18:35 前', label:'抵 Wrocław Główny', sub:'確認月台、車廂與座位', dur:'至少 35 min 緩衝'},
      {t:'參考 19:10', label:'Baltic Express 260 前往波茲南', sub:'指定日待確認／尚未訂票', cost:'票價待確認', dur:'1h19'},
      {t:'參考 20:29', label:'抵 Poznań Główny', sub:'先到 Towarowa 37/201 接待處取鑰匙；實際公寓門牌依訂房確認'},
    ],
    eat: [
      {text:'咖啡 @ El Gato Specialty Coffee', place:'El Gato Specialty Coffee（Odrzańska 8/1）', note:'2026-09-18 官網確認市中心門市在 Odrzańska 8/1（品牌另有其他門市，別走錯）；營業時間官網未公布，仍待確認', map:'https://www.google.com/maps/search/?api=1&query=El+Gato+Specialty+Coffee+Odrzanska+8+Wroclaw'},
      {text:'甜點 @ Dessert Boutique', place:'Dessert Boutique', note:'二–五 12:00–19:00', map:'https://www.google.com/maps/search/?api=1&query=Dessert+Boutique+Cukiernia+Premium+Wroclaw'},
    ],
    warn: '❗此日兩項皆尚未訂票。百年廳的 10/28 內部參觀狀態須以官方 availability calendar 確認，未確認前不販售或保證室內行程。10/28 日落約 16:34；點燈人沒有對外保證的固定出發分鐘，因此安排 16:15–17:15 在座堂島等候，不再把 16:45 寫成確定時刻。',
    backup: [
      {label:'雨天備案', where:'Sky Tower 觀景台', map:'https://www.google.com/maps/search/?api=1&query=Sky%20Tower%2C%20Powsta%C5%84c%C3%B3w%20%C5%9Al%C4%85skich%2095%2C%20Wroc%C5%82aw', why:'開放時間、票價與能見度以官方當日公告為準，不用舊票價規劃'},
      {label:'點燈師看不到', where:'廣場連拱廊 + 紡織會館內部市集', map:'https://www.google.com/maps/search/?api=1&query=Rynek%20Wroc%C5%82aw', why:'若日落後遇雨遮蔽煤氣燈，回廣場喝熱酒（PLN 12）'},
      {label:'百年廳未開放內部時的替代', where:'Panorama 全景畫後直接回老城，多留時間給小矮人與座堂島', why:'若 official availability calendar 顯示內部不可參觀，省下的時間可補足點燈前空檔'},
    ],
  },
  {
    n: 6, date: '10/29 (四)', city: '波茲南 → 華沙',
    title: '山羊鐘樓秀 + 聖馬丁牛角麵包',
    headline: 'EIC 8104 參考 17:40–20:00；兼顧正午山羊秀與下午行程',
    tag: 'Transit',
    intensity: '中高',
    hardConstraints: ['11:45 前抵達老城廣場卡位', '12:00 山羊鐘樓秀', '17:05 前抵 Poznań Główny；EIC 8104 指定日班次仍須確認'],
    mustBook: ['❗尚未訂 · 波茲南 → 華沙火車', '❗尚未訂 · 牛角麵包博物館（10/29 英語場待確認）'],
    compressible: ['Stary Browar 停留時間', '帝王城堡內部參觀'],
    weather: '尚無可靠預報；出發前 7–10 天更新',
    train: {type:'EIC 8104 Bolesław Prus · 參考班次', saleOpens:'2026-09-25', saleCheckedAt:'2026-09-08', leg:'指定日待確認／尚未訂票 · 二等艙建議', from:'Poznań Główny', to:'Warszawa Centralna', dep:'17:40', arr:'20:00', dur:'2h20', price:'票價待確認'},
    steps: [
      {t:'09:00', label:'★ 教堂島 Ostrów Tumski', sub:'梅什科一世受洗地', cost:'未收費', dur:'1.5 h'},
      {t:'11:00', label:'廣場卡正面位置', dur:'45 min · 提早卡位'},
      {t:'12:00', label:'★ 山羊鐘樓秀', sub:'官方固定正午登場，兩隻金屬山羊互頂 12 次', cost:'免費', dur:'5 min'},
      {t:'12:15', label:'★ 聖馬丁牛角麵包 (PGI)', sub:'Cukiernia Kandulski；出發前確認分店、當日營業與 PGI 證書', cost:'依門市標價', dur:'15 min'},
      {t:'13:30–15:00 預留', label:'★ 牛角麵包博物館', sub:'2026-09-18 官網：英語公開場 47 PLN／人（滿 3 歲起，未滿 3 歲 1 PLN），官方售票頁列開放時間為日–五 11:00–15:30（官方註明是第一場與最後一場開演時間），入口在 Klasztorna 23。10/29 週四在營業日內，但有沒有英語場、幾點開演仍未確認，不能直接視為 13:30 開演——依官方售票頁當日可售場次調整', cost:'英語場 PLN 47／人', dur:'表演約 1 h'},
      {t:'15:00', label:'Stary Browar', sub:'博物館若延後則縮短購物；沒有合適英語場時改逛帝王城堡（CK ZAMEK 12:00–19:00、售票至 18:00，地圖摺頁 10／7、語音導覽 20／15）', cost:'購物另計', dur:'1 h'},
      {t:'16:00', label:'取行李、前往 Poznań Główny', sub:'先確認公寓行李寄放地點；17:05 前抵站', dur:'約 1 h'},
      {t:'17:05', label:'抵 Poznań Główny', sub:'確認月台、車廂與座位；拖行李保留進站緩衝', dur:'35 min 緩衝'},
      {t:'參考 17:40', label:'EIC 8104 前往華沙', sub:'指定日待確認／尚未訂票', cost:'票價待確認', dur:'2h20'},
      {t:'參考20:00', label:'抵 Warszawa Centralna', sub:'步行至 Hotel Metropol 約 500 公尺，拖行李預留 10–15 分鐘'},
      {t:'20:30', label:'放行李後晚餐', sub:'Hala Koszyki 美食大廳（2026-09-18 官網查證：週四 08:00–00:00，只有週五六才到凌晨 1:00），距飯店步行約 10–15 分；若想更省時可改車站對面 Złote Tarasy（一–六約至 22:00、日至 21:00）。大廳時間不等於各攤位時間，當日仍先確認個別店家營業與是否需訂位', cost:'PLN 60–120', dur:'1–1.5 h'},
    ],
    eat: [
      {text:'12:15 聖馬丁牛角麵包 @ Cukiernia Kandulski', place:'Cukiernia Kandulski（示範分店）', note:'認證店家眾多，出發前依官方認證名單就近選擇；地圖先連到示範分店，選定分店後再改導航', map:'https://www.google.com/maps/search/?api=1&query=Cukiernia+Kandulski+Pozna%C5%84'},
      {text:'20:30 華沙宵夜 @ Hala Koszyki', place:'Hala Koszyki（美食大廳）', note:'10/29 週四大廳 08:00–00:00（凌晨 1:00 只有週五六），距飯店步行約 10–15 分；個別攤位時間可能更早收', map:'https://www.google.com/maps/search/?api=1&query=Hala+Koszyki+Warszawa'},
    ],
    backup: [
      {label:'雨天想看山羊鐘', where:'可頌博物館官方售票頁', map:'https://www.google.com/maps/search/?api=1&query=Rogalowe%20Muzeum%20Poznania%2C%20Klasztorna%2023%2C%20Pozna%C5%84', why:'英語公開場官方票價 47 PLN／人，但 10/29 有無場次與庫存都須依官方售票系統確認；未確認前改以 Stary Browar 或帝王城堡為室內備案。棕櫚屋已因改建閉館，不能再列為雨天備案'},
      {label:'無合適英語場', where:'Stary Browar 商場 + 帝王城堡內部', map:'https://www.google.com/maps/search/?api=1&query=Stary%20Browar%2C%20P%C3%B3%C5%82wiejska%2042%2C%20Pozna%C5%84', why:'兩處各有室內空間，但館際移動需走戶外；下雨仍需雨具並預留交通時間。帝王城堡 12:00 才開門、售票至 18:00'},
    ],
  },
  {
    n: 7, date: '10/30 (五)', city: '華沙',
    title: '皇家城堡 + POLIN + 起義博物館',
    headline: '依閉館時間重排：最早先看皇家城堡',
    tag: 'Museums',
    intensity: '高',
    hardConstraints: ['皇家城堡 10:00 開門、17:00 最後入場', 'POLIN 主展最後入場為閉館前 2 小時', '起義博物館須依官方票頁可售時段', '晚餐建議預約'],
    mustBook: ['❗尚未訂 · 皇家城堡 10:00', '❗尚未訂 · POLIN 波蘭猶太人歷史博物館 13:15', '❗尚未訂 · 華沙起義博物館 16:00', '❗尚未訂 · 華沙最後晚餐'],
    compressible: ['POLIN 看主展重點', '起義博物館抓核心展區', '皇家城堡採約 60 分鐘 Royal Route'],
    weather: '尚無可靠預報；出發前 7–10 天更新',
    steps: [
      {t:'10:00', label:'★ 皇家城堡', constraint:{venue:'warsaw-royal-castle'}, sub:'採 Royal Route，官方標示約 60 分（含語音導覽）；二–日 10:00–18:00、末入 17:00、週一休館。10/30 是週五，不適用週三的限定路線免費場', cost:'PLN 60 · 優待 45', dur:'約 60 min'},
      {t:'11:15', label:'午餐（老城 → POLIN 路上）', sub:'Café Bristol（Krakowskie Przedmieście，Hotel Bristol 內）；選當日有營業且可訂位的店', cost:'依餐廳', dur:'45 min'},
      {t:'12:00', label:'前往 POLIN + 安檢緩衝', sub:'依當日交通重算，保留入館安檢與提早報到時間', dur:'1 h 15 min'},
      {t:'13:15', label:'★ POLIN 猶太博物館', constraint:{venue:'warsaw-polin'}, sub:'週五 10:00–18:00；主展最晚 16:00 入場', cost:'依官方售票頁', dur:'2 h'},
      {t:'15:15', label:'前往華沙起義博物館 + 安檢緩衝', sub:'依當日交通重算，16:00 僅為規劃目標，以實際可售時段為準', dur:'45 min'},
      {t:'16:00', label:'★ 華沙起義博物館', sub:'35／30 PLN；以官方票頁 10/30 可售時段為準', cost:'PLN 35／30', dur:'2 h'},
      {t:'19:30', label:'老城最後晚餐', sub:'U Fukiera', cost:'PLN 120–200', dur:'1.5 h'},
      {t:'21:00', label:'老城廣場夜燈漫步', sub:'自由收尾'},
    ],
    eat: [],
    warn: '❗四項皆尚未訂。皇家城堡已由官方確認二–日 10:00–18:00、最後入場 17:00；本行程採約 60 分鐘 Royal Route，避免與午餐及館際移動重疊。POLIN 週五 10:00–18:00，主展最後入場為閉館前 2 小時。起義博物館票價 35／30，個人免費日為週一（非週四，官方公告）；10/30 是週五，照常收費，實際可售時段仍以官方票頁為準。蕭邦博物館已由蕭邦研究所公告 2026 全年整修閉館、預計 2027 年 1 月重開，本趟不列入行程。',
    extend: [
      {label:'Bulwary Wiślane 維斯瓦河畔', when:'21:00 後老城散步延伸', map:'https://www.google.com/maps/search/?api=1&query=Bulwary%20Wi%C5%9Blane%2C%20Warszawa', why:'河濱步道 + 沙灘酒吧，皇家城堡步行 10–15 分，適合晚餐後收尾散步，免費'},
      {label:'Neon Museum 霓虹燈博物館', when:'若提前結束起義博物館可插入', map:'https://www.google.com/maps/search/?api=1&query=Neon%20Muzeum%2C%20plac%20Defilad%201%2C%20Warszawa', why:'已遷入科學文化宮 4 樓（Marszałkowska 入口），共產時期霓虹招牌收藏，PLN 25／優待 18，可與觀景台一起看'},
      {label:'Praga 區塗鴉與 Koneser 舊釀酒廠', when:'午餐後彈性時段', map:'https://www.google.com/maps/search/?api=1&query=Centrum%20Praskie%20Koneser%2C%20plac%20Konesera%202%2C%20Warszawa', why:'起義博物館到皇家城堡之間若時間寬裕，可繞道河對岸 Praga 感受工業改造街區，步行或電車皆可'},
      {label:'科學文化宮 30F 觀景台夜景版', when:'起義博物館後、晚餐前', map:'https://www.google.com/maps/search/?api=1&query=Pa%C5%82ac%20Kultury%20i%20Nauki%2C%20plac%20Defilad%201%2C%20Warszawa', why:'全票 30／優待 25 PLN · 每日開放與售票皆至 20:00；夜間場（35 PLN）只在週五六且官方只排到 9 月底，10/30 沒有晚間延長場'},
    ],
    backup: [
      {label:'三館太累', where:'保留已訂時段，POLIN 與起義擇一深看', why:'兩館內容都沉重；不要犧牲已確認的皇家城堡上午時段'},
      {label:'天氣轉壞', where:'科學文化宮 30 樓觀景台（室內）', map:'https://www.google.com/maps/search/?api=1&query=Pa%C5%82ac%20Kultury%20i%20Nauki%2C%20plac%20Defilad%201%2C%20Warszawa', why:'全票 30／優待 25 PLN · 45 min · 直通老城地鐵，雨天備案'},
    ],
  },
  {
    n: 8, date: '10/31 (六)', city: '華沙 → 多哈',
    title: '機場日 · 14:40 QR 260 起飛',
    headline: '從容收尾 · SKM 機場線 20 分鐘',
    tag: 'Departure',
    intensity: '低',
    hardConstraints: ['11:00 前抵達華沙蕭邦機場', '如需退稅需預留更多機場時間', '不排正式景點'],
    mustBook: [],
    compressible: ['飯店周邊散步', '最後採買'],
    weather: '尚無可靠預報；出發前 7–10 天更新',
    steps: [
      {t:'08:00', label:'早餐 + 老城散步', sub:'Café Bristol（Krakowskie Przedmieście，Hotel Bristol 內）；A. Blikle 09:00 才開門，不適合當早餐', cost:'PLN 40', dur:'1.5 h'},
      {t:'09:45', label:'退房 → Warszawa Centralna', sub:'由 Hotel Metropol 出發；依行李狀況步行或叫車，當日再用導航重算並預留找月台緩衝', dur:'30–45 min'},
      {t:'10:30', label:'SKM S2／S3 目標班次', sub:'回程往機場方向：S2 由 Warszawa Śródmieście 上車、S3 由 Warszawa Centralna 上車（兩線停靠站不同，看清楚再上）。官方標示 75 分鐘第 1 區票；當日查 WTP 月台與發車時間', cost:'75 分第 1 區票 4.40', dur:'約 25–30 min'},
      {t:'11:00', label:'抵 Chopin 第一航廈'},
      {t:'11:15', label:'退稅文件 + 報到 + 安檢', sub:'如有 TAX FREE 商品，依機場與電子文件指示辦理；託運商品須在交運前備妥供海關查驗', dur:'預留至少 60–90 min'},
      {t:'14:40', label:'★ QR 260 起飛', sub:'WAW → DOH → HKG → TPE'},
    ],
    eat: [],
    backup: [
      {label:'早餐備案', where:'Bar Mleczny Prasowy（Marszałkowska 10/16，旅館旁）', map:'https://www.google.com/maps/search/?api=1&query=Bar%20Mleczny%20Prasowy%2C%20Marsza%C5%82kowska%2010%2F16%2C%20Warszawa', why:'⚠️ 已不是可靠備案：2026-09-17 華沙市府旅遊資訊中心列 Marszałkowska 10/16 這家為週一 09:00–20:00、週二–日 09:00–19:00，10/31（六）09:00 才開，趕不上 08:00 早餐與 09:45 退房。網路上的「08:00 開」屬 Powiśle 分店（Zajęcza 1a）。此店也在 Marszałkowska 南端，與旅館（99a）不是步行五分鐘。若 Café Bristol 有異，改找退房路線上或車站內的選擇'},
      {label:'班機提早 2 h', where:'蕭邦機場 1F Costa Coffee · 觀景窗', map:'https://www.google.com/maps/search/?api=1&query=Warsaw%20Chopin%20Airport%20Terminal%20A', why:'退稅 + 安檢順可能 12:30 就過關，1F 貴賓區外有平價咖啡'},
      {label:'紀念品最後採買', where:'先在飯店旁 Złote Tarasy 補齊，機場店只作最後備案', map:'https://www.google.com/maps/search/?api=1&query=Z%C5%82ote%20Tarasy%2C%20Z%C5%82ota%2059%2C%20Warszawa', why:'Złote Tarasy 就在 Warszawa Centralna 對面、距 Hotel Metropol 約 500 公尺，一–六約 09:00 開門，退房前後順路可買；機場 1F 的 Wedel、Krówki 方便但價差約 +10–15%'},
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
    id:'warsaw-metropol-arrival', city:'華沙', en:'Warszawa', name:'Hotel Metropol',
    checkIn:'2026-10-24', checkOut:'2026-10-25', checkInTime:'15:00', checkOutTime:'12:00', nights:1,
    address:'ul. Marszałkowska 99a, 00-693 Warszawa', addressVerified:true, rooms:1, status:'已確認',
    coordinates:{lat:52.22901, lng:21.01099, status:'已核對', checkedAt:'2026-08-11'},
    officialUrl:'https://www.hotelmetropol.com.pl/pl/',
    note:'第一段華沙住宿（2026-09 換訂本館，兩段華沙住宿現為同一家）。位置在 Marszałkowska／Metro Centrum 出口正對面，步行至 Warszawa Centralna 約 500 公尺；入住 15:00 起、退房 12:00 前，櫃檯可寄放行李。時間依公開訂房資料，抵達前再以訂房確認核對。',
  },
  {
    id:'krakow-stare-miasto', city:'克拉科夫', en:'Kraków', name:'ibis budget Krakow Stare Miasto',
    checkIn:'2026-10-25', checkOut:'2026-10-27', nights:2,
    address:'ul. Pawia 11, 31-154 Kraków', addressVerified:true, rooms:1, status:'已確認',
    coordinates:{lat:50.07075, lng:19.946163, status:'已核對', checkedAt:'2026-08-11'},
    officialUrl:'https://all.accor.com/hotel/7165/index.en.shtml',
    note:'位於 Kraków Główny 與 Galeria Krakowska 旁。',
  },
  {
    id:'wroclaw-piast', city:'樂斯拉夫', en:'Wrocław', name:'Piast',
    checkIn:'2026-10-27', checkOut:'2026-10-28', checkInTime:'14:00', checkOutTime:'12:00', nights:1,
    address:'完整地址待飯店第一方確認', addressVerified:false, rooms:1, status:'已確認',
    coordinates:{lat:51.10013, lng:17.03569, status:'地圖座標已核對；門牌仍待第一方確認', checkedAt:'2026-08-11'},
    officialUrl:'https://piastwroclaw.pl/',
    note:'住宿訂單已確認；飯店官網目前未正常顯示完整地址，出發前須用訂房確認或直接向飯店核對。',
  },
  {
    id:'poznan-towarowa', city:'波茲南', en:'Poznań', name:'Poznan Apartments Towarowa',
    checkIn:'2026-10-28', checkOut:'2026-10-29', checkInTime:'15:00', checkOutTime:'11:00', nights:1,
    address:'Towarowa 37/201, 61-896 Poznań', addressVerified:true, rooms:1, status:'已確認',
    coordinates:{lat:52.403903, lng:16.915609, status:'接待處座標已核對', checkedAt:'2026-08-11'},
    officialUrl:'https://www.poznanapartments.com/kontakt',
    note:'此處為官方接待與取鑰匙地址；實際公寓門牌以私人訂房確認為準。',
  },
  {
    id:'warsaw-metropol', city:'華沙', en:'Warszawa', name:'Hotel Metropol',
    checkIn:'2026-10-29', checkOut:'2026-10-31', checkInTime:'15:00', checkOutTime:'12:00', nights:2,
    address:'ul. Marszałkowska 99a, 00-693 Warszawa', addressVerified:true, rooms:1, status:'已確認',
    coordinates:{lat:52.22901, lng:21.01099, status:'已核對', checkedAt:'2026-08-11'},
    officialUrl:'https://www.hotelmetropol.com.pl/pl/',
    note:'第二段華沙住宿，與第一段同館同址，行李寄放與周邊動線可沿用 Day 1 經驗。10/29 EIC 8104 抵 Warszawa Centralna 後步行約 500 公尺即到；10/31 退房 12:00 前，當日 09:45 出發搭機不受影響。',
  },
];

export const trains = [
  {seg:'Warszawa Zachodnia → Kraków Główny', date:'10/25', type:'EIP 5300', saleOpens:'2026-09-25', saleCheckedAt:'2026-09-08', dep:'08:45', arr:'10:58', dur:'2h13', price:'票價待確認', status:'參考班次／尚未訂票', note:'一等艙建議；本趟安排頭等艙體驗。現行班表本車先停 Warszawa Centralna（約 08:40）再停 Zachodnia；住宿改為 Hotel Metropol 後由 Centralna 上車只需步行 500 公尺，購票時優先比較 Centralna 出發的票價與座位。10/25 換表後仍須確認實際停靠站。'},
  {seg:'Kraków MDA ⇄ Oświęcim Muzeum Auschwitz', date:'10/26', type:'BUS · Lajkonik', saleCheckedAt:'2026-09-09', dep:'07:10（D10）／回程 15:30', arr:'08:35 ／回程 16:55 抵 Kraków MDA', dur:'單程 1h25', price:'PLN 25.00（優待 22.00，購票日確認）', status:'去回班次皆已查得／尚未購票', note:'2026-09-09 於官方售票頁查 10/26：去程 07:10（D10）→ 08:35 採用、08:25（D9）→ 09:50 只比 10:00 安檢截止早 10 分鐘故不用（售票頁當時沒有 07:35）；回程 14:00 → 15:25 在導覽 14:15 結束前開走不可用、15:30 → 16:55 採用（結束後留 75 分鐘緩衝）、16:30 → 17:55 為備案。2026-09-18 另查官方公告時刻表，確認 07:10→08:35 與 15:30→16:55 都在正班表上，且全線班次比售票頁當時顯示的多（Kraków MDA 發車 06:15／07:10／08:25／09:20／10:40／11:30／13:00／14:00／15:55／17:30；Muz. Auschwitz 回程 08:10／09:00／11:00／12:00／14:00／15:30／16:30／17:30／18:30／19:45）——「當日只有兩班／三班」只是那天售票頁的可售結果，不是全部班次。時刻表另註中途站為招手停（na żądanie），且部分班次有季節／假日代碼限制，購票時一併確認。'},
  {seg:'Kraków Główny → Wrocław Główny', date:'10/27', type:'IC 3600 Siemiradzki', saleOpens:'2026-09-27', saleCheckedAt:'2026-09-08', dep:'17:55', arr:'20:52', dur:'2h57', price:'票價待確認', status:'參考班次／尚未訂票', note:'二等艙建議；一等艙可選。17:20 前到站。'},
  {seg:'Wrocław Główny → Poznań Główny', date:'10/28', type:'Baltic Express 260', saleOpens:'2026-09-28', saleCheckedAt:'2026-09-08', dep:'19:10', arr:'20:29', dur:'1h19', price:'票價待確認', status:'參考班次／尚未訂票', note:'二等艙建議。18:35 前到站。'},
  {seg:'Poznań Główny → Warszawa Centralna', date:'10/29', type:'EIC 8104 Bolesław Prus', saleOpens:'2026-09-25', saleCheckedAt:'2026-09-08', dep:'17:40', arr:'20:00', dur:'2h20', price:'票價待確認', status:'參考班次／尚未訂票', note:'適合體驗一等艙；若 10/25 已搭 EIP 一等艙，可依價差改選二等艙。17:05 前到站。'},
];

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

export const railPurchaseSteps = [
  {
    title: '先用官方時刻表找直達班次',
    detail: '在 Passenger Portal 輸入出發站、抵達站、日期與目標時間，勾選 Direct connections。四段起點依序使用 Warszawa Zachodnia、Kraków Główny、Wrocław Główny、Poznań Główny。',
  },
  {
    title: '進 PKP Intercity 官方購票頁重查',
    detail: '用相同站名與日期搜尋。2026-09-08 逐班查核官方售票系統得到的預售起始日為：10/25 EIP 5300 與 10/29 EIC 8104 皆 9/25、10/27 IC 3600 為 9/27、10/28 Baltic Express 260 為 9/28。四段都落在 10/25 新班表換表前後，實際開賣仍以購票頁顯示可選車次與價格為準。EIP／EIC 名目上可提前更久購買，但新班表未上線前一樣買不到。',
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
  {tier:'第一優先', note:'❗全部尚未訂 · 先以官方售票系統確認指定日期與庫存', items:[
    {name:'Auschwitz 官方英文導覽（10/26 10:30 已訂妥）', url:'https://visit.auschwitz.org/'},
    {name:'Wieliczka 鹽礦英文團（現在即可訂）', url:'https://www.wieliczka-saltmine.com/'},
    {name:'Lajkonik 往返巴士（去程 07:10 → 08:35、回程 15:30 → 16:55，皆已查定待購票）', url:'https://www.lajkonikbus.pl/'},
    {name:'華沙 → 克拉科夫火車', url:'https://www.intercity.pl/en/'},
    {name:'克拉科夫 → 樂斯拉夫火車', url:'https://www.intercity.pl/en/'},
    {name:'樂斯拉夫 → 波茲南火車', url:'https://www.intercity.pl/en/'},
    {name:'波茲南 → 華沙火車', url:'https://www.intercity.pl/en/'},
  ]},
  {tier:'第二優先', note:'❗全部尚未訂 · 辛德勒工廠現已可查／購，其餘依官方售票頁', items:[
    {name:'辛德勒工廠（10/25 已進個人網路票 90 天窗口；最後入場 18:30）', url:'https://muzeumkrakowa.pl/en/branches/oskar-schindlers-enamel-factory'},
    {name:'Wawel 城堡短路線 14:00 左右時段票', url:'https://wawel.krakow.pl/en/what-to-see'},
    {name:'POLIN 波蘭猶太人歷史博物館', url:'https://polin.pl/en'},
    {name:'華沙起義博物館', url:'https://www.1944.pl/en'},
    {name:'皇家城堡（已查證二至日 10:00–18:00，末入 17:00）', url:'https://www.zamek-krolewski.pl/en'},
    {name:'牛角麵包博物館（10/29 主行程，英語場待確認）', url:'https://rogalowemuzeum.pl/en/'},
    {name:'拉茨瓦維採全景畫', url:'https://mnwr.pl/en/category/branches/panorama-raclawicka/'},
  ]},
  {tier:'餐廳與備案', note:'❗全部尚未訂 · 旅行品質加分', items:[
    {name:'克拉科夫 Kazimierz 晚餐', url:'https://www.google.com/maps/search/?api=1&query=Kazimierz+Krakow+restaurants'},
    {name:'華沙最後晚餐', url:'https://www.google.com/maps/search/?api=1&query=Warsaw+old+town+Polish+restaurant'},
    {name:'樂斯拉夫午餐或晚餐', url:'https://www.google.com/maps/search/?api=1&query=Wroclaw+old+town+Polish+restaurant'},
    {name:'波茲南老城午餐', url:'https://www.google.com/maps/search/?api=1&query=Poznan+old+town+restaurant'},
  ]},
];

// checkedAt：實際人工核對這筆狀態的 YYYY-MM-DD；不以建置日期代填。
// recheckAt：下次查核期限 YYYY-MM-DD；null 時儀表板以行程日期判斷逾期。
// 目前沒有逐筆查票日期證據，保留 null；只有取得訂票結果後才更新完成狀態。
export const todoGroups = [
  {
    id: 'rail', title: '城際交通', eyebrow: 'Rail · 5 項',
    intro: '四段 PKP 已選定規劃班次；Auschwitz 導覽已訂妥 10/26 10:30，往返巴士改依該時段回推目標班次。尚未完成指定日確認或購票前，不把時刻、車種或月台當成已確認。',
    items: [
      {checkedAt:null, recheckAt:null, date:'10/25', name:'EIP 5300｜華沙 → Kraków Główny', status:'參考班次／尚未訂票', action:'核對 10/25 換表後的實際停靠站，比較由 Warszawa Centralna（步行可達飯店）與 Zachodnia 上車的票價與座位，確認 08:45–10:58 後購票。', url:'https://www.intercity.pl/en/'},
      {checkedAt:'2026-09-09', recheckAt:'2026-10-12', date:'10/26', name:'Lajkonik 克拉科夫 ⇄ Auschwitz 巴士', status:'指定日尚未確認', action:'去回班次皆已在 lajkonikbus.pl 查定，剩下只差付款：去程 07:10（Bosacka 18 D10）→ 08:35、回程 15:30（Więźniów Oświęcimia 55）→ 16:55，各 1h25、全票 25.00 zł／優待 22.00 zł。備案為回程 16:30 → 17:55。下單時確認人數、上下車站與是否需選位。', url:'https://www.lajkonikbus.pl/krakow-oswiecim.html'},
      {checkedAt:null, recheckAt:null, date:'10/27', name:'IC 3600｜Kraków Główny → Wrocław Główny', status:'參考班次／尚未訂票', action:'核實 17:55–20:52 指定日班表並購票；記錄車廂、座位與訂位憑證。', url:'https://www.intercity.pl/en/'},
      {checkedAt:null, recheckAt:null, date:'10/28', name:'Baltic Express 260｜Wrocław Główny → Poznań Główny', status:'參考班次／尚未訂票', action:'核實 19:10–20:29 指定日班表並購票；確認公寓晚間取鑰匙方式。', url:'https://www.intercity.pl/en/'},
      {checkedAt:null, recheckAt:null, date:'10/29', name:'EIC 8104｜Poznań Główny → Warszawa Centralna', status:'參考班次／尚未訂票', action:'核實 17:40–20:00 指定日班表並購票；抵站後步行至 Metropol 預留 10–15 分鐘。', url:'https://www.intercity.pl/en/'},
    ],
  },
  {
    id: 'attractions', title: '主要景點', eyebrow: 'Tickets · 8 項',
    intro: '指定日期的場次與庫存會變動；付款完成後請下載離線票券並核對入場時間。',
    items: [
      {checkedAt:null, recheckAt:null, date:'10/25', name:'Wawel 城堡 14:00', status:'尚未訂', action:'以官方售票頁選 10/25 14:00 左右、可於 15:00 前結束的短路線；完整 2 小時路線會壓縮步行時間。', url:'https://wawel.krakow.pl/en/what-to-see'},
      {checkedAt:null, recheckAt:null, date:'10/25', name:'辛德勒工廠 17:30', status:'現可查／購', action:'10/25 已進個人網路票 90 天窗口；以官方售票頁的可售時段為準。', url:'https://muzeumkrakowa.pl/en/branches/oskar-schindlers-enamel-factory'},
      {checkedAt:'2026-09-09', recheckAt:null, date:'10/26', name:'Auschwitz 英文官方導覽', status:'已訂妥', action:'10:30 個人 educator 導覽（英文），官方標示約 3 小時 45 分，2 人。電子入場證存離線，入場須同時出示證件。', url:'https://visit.auschwitz.org/'},
      {checkedAt:null, recheckAt:null, date:'10/27', name:'Wieliczka 鹽礦英文團', status:'需查／購', action:'在官方日期選擇器確認英文場、票價與庫存。', url:'https://www.wieliczka-saltmine.com/'},
      {checkedAt:null, recheckAt:null, date:'10/28', name:'拉茨瓦維採全景畫', status:'尚未訂', action:'以官方售票頁確認指定入場時段。', url:'https://mnwr.pl/en/category/branches/panorama-raclawicka/'},
      {checkedAt:null, recheckAt:null, date:'10/30', name:'華沙皇家城堡 10:00', status:'尚未訂', action:'選擇 10:00 入場，並保留安檢與離館移動時間。', url:'https://www.zamek-krolewski.pl/en'},
      {checkedAt:null, recheckAt:null, date:'10/30', name:'POLIN 猶太人歷史博物館 13:15', status:'尚未訂', action:'依官方售票頁的指定日庫存選擇 13:15 左右時段（主展最後入場 16:00）。', url:'https://polin.pl/en'},
      {checkedAt:null, recheckAt:null, date:'10/30', name:'華沙起義博物館 16:00', status:'尚未訂', action:'依官方票頁可售時段確認，避免與前一館離館時間衝突。', url:'https://www.1944.pl/en'},
    ],
  },
  {
    id: 'venue-status', title: '場館開放狀態', eyebrow: 'Status · 1 項',
    intro: '不需購票，但會決定當天走不走得成；未確認前主行程只排外觀與周邊。',
    items: [
      {checkedAt:null, recheckAt:null, date:'10/28', name:'百年廳 10/28 內部參觀狀態', status:'待官方日曆確認', action:'上 halastulecia.pl 的 availability calendar 查 10/28 是綠／藍／黃／紅哪一色（綠＝含廳內看台、黃＝只能看展覽不能進圓頂下方、紅＝全關）；2026-09-18 複查仍讀不到指定日顏色，官方日曆只在瀏覽器逐日渲染。行前 3–5 天再查一次。', url:'https://halastulecia.pl/zwiedzanie/visitor-centre/'},
    ],
  },
  {
    id: 'dining', title: '餐飲訂位', eyebrow: 'Dining · 1 項',
    intro: '餐廳營業與臨時包場以店家訂位頁公告為準。',
    items: [
      {checkedAt:null, recheckAt:null, date:'10/30', name:'華沙最後晚餐', status:'尚未訂位', action:'先依當天落腳區域選定店家，再以店家官網或訂位頁完成預約。', url:null},
    ],
  },
  {
    id: 'rainy-day', title: '雨天備案', eyebrow: 'Backup · 1 項',
    intro: '天氣不影響主行程時不必購買。',
    items: [
      {checkedAt:null, recheckAt:null, date:'10/29', name:'波茲南牛角麵包博物館場次', status:'尚未訂', action:'主行程預留 13:30–15:00；週四不保證有英語場，先查 10/29 官方售票頁，沒有合適場次再改室內備案。', url:'https://rogalowemuzeum.pl/en/'},
    ],
  },
];

export const reservations = [
  {when:'✅ 已完成', what:'Auschwitz 英文官方導覽 — 10/26 10:30 個人 educator 導覽（約 3 小時 45 分，2 人）已訂妥。入場憑電子入場證＋證件，出發前存離線。'},
  {when:'❗現在就查／訂', what:'Wieliczka 鹽礦英文 Tourist Route 10:00 場 — 10/27 英文場、實際票價與庫存以官方日期選擇器為準；不要用舊價格或開賣週期取代訂票結果。'},
  {when:'現在可訂', what:'皇家城堡 — 已查證二至日 10:00–18:00、最後入場 17:00；Day 7 已改為 10:00 第一站（zamek-krolewski.pl）'},
  {when:'現在可先訂', what:'米其林與熱門餐廳：Bottiglieria 1881（二星，最搶）、BABA / Most（樂斯拉夫僅停留一晚零彈性）、WANDAL、Pod Aniołami（TheFork / OpenTable / 餐廳官網）'},
  {when:'火車票：指定日可售即處理', what:'PKP Intercity 四段已選規劃班次：10/25 EIP 5300 08:45–10:58、10/27 IC 3600 17:55–20:52、10/28 Baltic Express 260 19:10–20:29、10/29 EIC 8104 17:40–20:00。全部仍須在 bilet.intercity.pl 與 Passenger Portal 核實指定日班表、票價與座位後購票。'},
  {when:'現在可查／訂', what:'辛德勒工廠 10/25 場次已進個人網路票 90 天窗口；POLIN、華沙起義博物館與皇家城堡均以官方售票頁顯示的指定日庫存為準。'},
  {when:'出發前 1 週', what:'把上述所有票價、特別閉館與開放時間再確認一次 — 本清單資料查證日為 2026-08-09，臨時活動與維修仍可能變動'},
  {when:'抵達當日', what:'隔日 Wawel 國家廳室現場票（限額制，售完只能改庭院）'},
];

// 訂票與查核的行動截止日。
//
// 四段城際火車不列在這裡——它們的開賣日已經是 trains[].saleOpens，
// 重抄一次就會有兩份各自漂移的事實；改由 collectDeadlines() 於建置時併入。
//
// basis 記錄每個日期的來源：官方公告的照抄，由既有規則推算的寫明怎麼算的。
// 沒有來源基礎的日期不要放進這張表，倒數看板會讓它看起來像官方期限。
export const deadlines = [
  {
    id: 'dining-michelin', date: '2026-10-03', category: '餐飲',
    title: '米其林與熱門餐廳訂位',
    action: 'Bottiglieria 1881（二星）最搶，先訂；再處理華沙一星與 BABA／Most（樂斯拉夫只停留一晚，訂不到就沒有第二次機會）。',
    status: '尚未訂位', url: 'https://guide.michelin.com/en/pl/restaurants',
    basis: '行前提醒「二星＋各一星出發前 3–4 週訂；華沙 splurge 級 3–5 週」，取窗口下緣 3 週由 10/24 回推；建議窗口自 9/19 起。',
  },
  {
    id: 'ticket-wieliczka', date: '2026-10-03', category: '門票',
    title: 'Wieliczka 鹽礦 10/27 英語團',
    action: '於官方日期選擇器確認 10/27 英語場次、票價與庫存後購票；通用頁只列 from 131 PLN，不能當成實際票價。',
    status: '需查／購', url: 'https://www.wieliczka-saltmine.com/individual-tourist/useful-information/ticket-prices-and-visiting-hours',
    basis: '訂票優先順序列為第一優先「現在即可訂」；指定日場次有限，取出發前 3 週為行動下限。',
  },
  {
    id: 'ticket-schindler', date: '2026-10-03', category: '門票',
    title: '辛德勒工廠 10/25 場次',
    action: '10/25 已進個人網路票 90 天窗口，依官方售票頁可售時段購票；最後入場 18:30。',
    status: '現可查／購', url: 'https://muzeumkrakowa.pl/oddzialy/fabryka-emalia-oskara-schindlera',
    basis: '訂票優先順序第二優先已註記「10/25 已進個人網路票 90 天窗口」；取出發前 3 週為行動下限。',
  },
  {
    id: 'ticket-warsaw-trio', date: '2026-10-10', category: '門票',
    title: '華沙三館 10/30 指定日票',
    action: '皇家城堡 10:00（末入 17:00）、POLIN 13:15（主展末入 16:00）、起義博物館 16:00，依各官方售票頁的 10/30 可售時段一次訂齊，避免館際時間互相擠壓。',
    status: '尚未訂', url: 'https://www.zamek-krolewski.pl/en',
    basis: 'Day 7 為自評高風險日（三館連看），三館皆已查得開放時間但均未訂；取出發前 2 週為行動下限。',
  },
  {
    id: 'bus-lajkonik', date: '2026-10-12', category: '交通',
    title: 'Lajkonik 往返 Auschwitz 巴士購票',
    action: '班次已查定，只差付款：去程 07:10（Bosacka 18 · D10）→ 08:35、回程 15:30 → 16:55，全票 25.00 zł。備案為回程 16:30。',
    status: '指定日尚未確認', url: 'https://www.lajkonikbus.pl/',
    basis: '待辦事項該筆的 recheckAt = 2026-10-12。',
  },
  {
    id: 'ticket-croissant', date: '2026-10-14', category: '門票',
    title: '波茲南可頌博物館 10/29 英語場',
    action: '官網列的營業時間是日–五 11:00–15:30（第一場與最後一場開演時間），10/29 週四在營業日內，但週四不保證有英語場——先查 10/29 官方售票頁；沒有合適場次就改室內備案，不要預設週末的固定英文場。',
    status: '尚未訂', url: 'https://rogalowemuzeum.pl/en/buy-tickets/',
    basis: 'Day 6 主行程預留 13:30–15:00 且英語場未確認；取出發前 10 天為行動下限，留得下改備案的時間。',
  },
  {
    id: 'recheck-all', date: '2026-10-17', category: '複查',
    title: '全站票價、開放時間與特別閉館複查',
    action: '門票速查與城市指南已於 2026-09-17／09-18 全面複查過，但臨時活動與維修仍可能變動；出發前再整批重查一次，重點在仍標「待確認」的項目（百年廳 10/28 色階、可頌博物館 10/29 英語場、Wieliczka 10/27 場次、El Gato 營業時間）。',
    status: '待執行', url: null,
    basis: '訂位與每人預算清單的「出發前 1 週」條目，由 10/24 回推。',
  },
  {
    id: 'venue-hala-stulecia', date: '2026-10-21', category: '場館',
    title: '百年廳 10/28 內部參觀狀態',
    action: '上官方 availability calendar 查 10/28 是綠／藍／黃／紅哪一色；未確認前 Day 5 主行程只排外觀與周邊。',
    status: '待官方日曆確認', url: 'https://halastulecia.pl/zwiedzanie/visitor-centre/',
    basis: '待辦事項該筆：「行前 3–5 天再複查一次」，取 3 天由 10/24 回推。',
  },
  {
    id: 'etias-check-2', date: '2026-10-21', category: '證件',
    title: 'ETIAS 最終確認',
    action: '出發前最後一次確認；若已啟用則立即申請並存離線核准證明。',
    status: '待確認', url: 'https://travel-europe.europa.eu/etias_en',
    basis: '資料庫項目 entry-etias-and-passport 已排 2026-09-24 重查；本筆是出發前 3 天的最後決策點，兩者互補不重複。',
  },
];
