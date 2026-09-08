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
      {t:'14:45', label:'SKM S2/S3 目標班次', sub:'第 1 區時間票 · 約 25–30 分；抵達後查 WTP 即時月台與票價', cost:'抵達日確認', dur:'25–30 min'},
      {t:'15:15', label:'旅館 Check-in', dur:'30 min'},
      {t:'16:45', label:'★ 老城廣場', sub:'皇家城堡 · 美人魚雕像', cost:'免費', dur:'1 h'},
      {t:'18:00', label:'Krakowskie Przedmieście', sub:'黃昏氛圍', cost:'免費', dur:'1 h'},
      {t:'19:00', label:'Pierogi 晚餐', sub:'Zapiecek · Krakowskie Przedmieście 55（就在 18:00 散步那條街上）；出發前確認當日營業', cost:'PLN 35–55'},
      {t:'21:00', label:'早睡倒時差'},
    ],
    eat: [
      {text:'Pierogi @ Zapiecek', place:'Zapiecek（老城多家分店）', map:'https://www.google.com/maps/search/?api=1&query=Zapiecek+Polskie+Pierogarnie+Warszawa'},
      {text:'Wedel 熱巧克力 @ E. Wedel Pijalnia', place:'Pijalnia Czekolady E.Wedel', map:'https://www.google.com/maps/search/?api=1&query=Pijalnia+Czekolady+E.Wedel+Warszawa'},
    ],
    backup: [
      {label:'下雨備案', where:'科學文化宮 30F 觀景台', why:'票價出發前依官方售票頁重查 · 室內 + 360° 城景，老城廣場走路 12 分'},
      {label:'時差太累', where:'Łazienki 公園溫室', why:'室內展館 + 蕭邦像，免費，傍晚前可走'},
    ],
    practical: [
      {tag:'寄物', name:'Warszawa Centralna', note:'到站後依車站現場指示找寄物櫃；尺寸、空位與費率會變動'},
      {tag:'換錢', name:'Kantor 民間匯兌', note:'現場比較買入與賣出價，不以「0% 手續費」代替實際匯率判斷'},
      {tag:'SIM', name:'Play / Plus / Orange', note:'預付卡需實名登記；通路、容量與價格以抵達當日電信商方案為準'},
    ],
  },
  {
    n: 2, date: '10/25 (日)', city: '華沙 → 克拉科夫',
    title: 'Wawel + 老城 + 辛德勒工廠 + Kazimierz 晚餐',
    headline: 'EIP 5300 參考 08:45–10:56；由華沙西站上車並安排一等艙體驗',
    tag: 'Transit',
    intensity: '高',
    hardConstraints: ['08:10 前抵達 Warszawa Zachodnia；10/25 換表後須再次確認 EIP 5300 仍停靠西站', '辛德勒工廠 17:30 入場（最後入場 18:30）', '午餐與 Check-in 不能拖太久'],
    mustBook: ['❗尚未訂 · 華沙 → 克拉科夫火車', '❗尚未訂 · Wawel 城堡短路線 14:00 左右時段票', '可立即查／購 · 辛德勒工廠 17:30 時段票'],
    compressible: ['聖瑪利亞教堂內部參觀', '紡織會館購物時間'],
    weather: '尚無可靠預報；出發前 7–10 天更新',
    train: {type:'EIP 5300 · 參考班次', leg:'指定日待確認／尚未訂票 · 一等艙建議', from:'Warszawa Zachodnia', to:'Kraków Główny', dep:'08:45', arr:'10:56', dur:'2h11', price:'票價待確認'},
    steps: [
      {t:'07:50', label:'退房後步行前往 Warszawa Zachodnia', sub:'ibis budget Warszawa West Station 出發；步行規劃約 15–20 分，出發前依導航重算', dur:'15–20 min'},
      {t:'08:10', label:'抵 Warszawa Zachodnia', sub:'預留找月台與一等車廂時間；月台以當日電子牌為準', dur:'35 min 緩衝'},
      {t:'參考 08:45', label:'EIP 5300 前往克拉科夫', sub:'參考班次；10/25 換表後須確認仍停靠西站並完成購票', cost:'票價待確認', dur:'2h11'},
      {t:'參考 10:56', label:'抵 Kraków Główny', dur:'5–10 min 拖行李'},
      {t:'11:10', label:'旅館寄放行李', sub:'ibis budget Krakow Stare Miasto 在 Pawia 11，飯店官網標示距車站約 200 公尺', dur:'20 min'},
      {t:'11:30', label:'車站周邊午餐', sub:'10/25 為非營業週日，先確認店家當日營業；用餐後步行約 25–30 分到 Wawel', cost:'PLN 40–60', dur:'45 min'},
      {t:'13:00', label:'★ 瓦維爾大教堂', sub:'週日 12:30–17:00；Cathedral Museum 週日不開', cost:'PLN 26／18', dur:'45 min'},
      {t:'14:00', label:'★ Wawel 城堡短路線', sub:'選擇可於 15:00 前結束的展區；完整 2 小時路線會壓縮後續步行', cost:'依選定展區官網票價', dur:'1 h'},
      {t:'15:00', label:'★ 中央廣場 + 聖瑪利亞', sub:'本次先看廣場與教堂外觀，登塔改為有餘裕才安排。整點 Hejnał 號角；塔票僅於 Mariacki 廣場 7 號當日現場售票', cost:'外觀免費', dur:'30 min（含由城堡步行）'},
      {t:'15:30', label:'紡織會館 Sukiennice 快速一覽', sub:'採購留到 10/27', cost:'免費入場', dur:'15 min'},
      {t:'15:45', label:'步行經 Kazimierz、Podgórze 前往辛德勒工廠', sub:'保留約 85 分鐘步行與沿途短停，17:10 前到入口；時間不足改用 Jakdojade 查當下交通', dur:'約 1 h 25 min'},
      {t:'17:30', label:'★ 辛德勒工廠', sub:'週日最後入場 18:30 · mhk.pl/en 預約', cost:'PLN 60 · 優待 45', dur:'2 h'},
      {t:'19:45', label:'★ Kazimierz Plac Nowy zapiekanka 晚餐', sub:'Endzior / Krzysiek', cost:'PLN 18–25'},
    ],
    eat: [
      {text:'Obwarzanek 圓圈麵包 (PGI)', note:'老城與 Kazimierz 街邊推車皆有售，無固定店址'},
      {text:'Zapiekanka @ Plac Nowy 圓亭', place:'Okrąglak, Plac Nowy', map:'https://www.google.com/maps/search/?api=1&query=Okraglak+Plac+Nowy+Krakow'},
      {text:'Klezmer-Hois 猶太料理', place:'Klezmer-Hois（Kazimierz）', map:'https://www.google.com/maps/search/?api=1&query=Klezmer-Hois+Krakow'},
    ],
    warn: '❗瓦維爾城堡尚未訂票；辛德勒工廠個人網路票在參觀日前 90 天 09:00 開放，10/25 已可在官方售票頁查／購。瓦維爾大教堂週日 12:30–17:00；城堡改走短路線並於 15:00 前離開，保留經 Kazimierz、Podgórze 步行到辛德勒工廠的時間。辛德勒工廠週二至週日 09:00–20:00、最後入場 18:30，17:30 屬可行時段。10/25 為非營業週日，多數一般商店關閉；餐廳等法定例外是否營業仍以店家公告為準。',
    backup: [
      {label:'辛德勒 17:30 滿場', where:'改訂 18:30 最後入場，或往前壓到下午較早時段（如 14:00）', why:'最後入場其實是 18:30，比原記錄多一小時可調度；mhk.pl/en 開放預約後立即下單'},
      {label:'雨天替代 Wawel', where:'地下市集博物館 Rynek Underground', why:'廣場下方歷史展（Rynek Główny 1），PLN 45／35，最後入場為閉館前 75 分鐘。官方 2026 閉館日不含 10/25；週日時間以官網當日為準。另註：每週二免費（免費日不可預約、現場限量、每人限領 5 張），每月第二個週一休館'},
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
    headline: '波蘭最沉重也最重要的一天',
    tag: 'Memorial',
    intensity: '中高',
    hardConstraints: ['導覽開團前 30 分鐘抵達', '晚間不再加博物館或長距離步行'],
    mustBook: ['❗需查／購 · Auschwitz 官方英文導覽（指定場次庫存以官方系統為準）', '❗指定日待確認 · Lajkonik 往返巴士'],
    compressible: ['回克拉科夫後晚餐形式', '晚間自由活動'],
    weather: '尚無可靠預報；出發前 7–10 天更新',
    // Lajkonik 現行班表可作規劃參考，但 10/26 指定日仍須等業者售票頁確認。
    train: {type:'BUS · Lajkonik', leg:'指定日待複查', from:'Kraków MDA', to:'Muzeum Auschwitz', dep:'參考 07:10', arr:'參考 08:35', dur:'約 1h25', price:'待業者開放 10/26 售票'},
    steps: [
      {t:'參考 07:10', label:'Lajkonik · 克拉科夫 → 奧斯威辛', sub:'Kraków MDA 地下 D10 → Muzeum Auschwitz；現行班表參考，10/26 指定日須再確認', cost:'待確認', dur:'約 1h25'},
      {t:'參考 08:35', label:'抵 Auschwitz I', sub:'預留約 85 分鐘完成寄物、安檢、領耳機與提前報到', dur:'約 1h25'},
      {t:'10:00', label:'★ 英文官方導覽', sub:'一館 + 比克瑙 · 約 3.5 h；票價依官方訂票頁', cost:'依官方訂票頁', dur:'3.5 h'},
      {t:'13:30', label:'導覽結束'},
      {t:'參考 15:30', label:'Lajkonik 巴士返克拉科夫', sub:'13:45 班次緩衝過短，不採用；10/26 指定日仍須再確認', cost:'待確認', dur:'約 1h25'},
      {t:'參考 16:55', label:'抵 Kraków MDA · 休息'},
      {t:'18:00', label:'安靜晚餐沉澱情緒', cost:'PLN 60–100'},
    ],
    warn: '❗最急一項。所有入場證只在 visit.auschwitz.org 線上提供，入口不售票；10 月入場時間為 07:30–17:00。Lajkonik 07:10 去、15:30 回是 2026-08-09 查得的現行班表參考，不是 10/26 已確認班次，付款前必須再查。',
    backup: [
      {label:'戶外為主 · 必備雨具', where:'比克瑙營區戶外 80%', why:'導覽風雨無阻，請穿防水鞋 + 帶折傘'},
      {label:'若無導覽額度', where:'Galicia Jewish Museum + Kazimierz 室內行程', why:'Galicia Jewish Museum 每日 10:00–18:00、全票 35 PLN；MOCAK 週一休館，10/26 不列入備案。出發前仍須重查臨時閉館。'},
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
    train: {type:'IC 3600 Siemiradzki · 參考班次', leg:'指定日待確認／尚未訂票 · 二等艙建議', from:'Kraków Główny', to:'Wrocław Główny', dep:'17:55', arr:'20:52', dur:'2h57', price:'票價待確認'},
    steps: [
      {t:'08:00', label:'早餐 + 退房', sub:'行李寄旅館'},
      {t:'09:00', label:'火車到 Wieliczka Rynek-Kopalnia', sub:'KMŁ；用 70 分鐘 KMK+KMŁ 聯票或依當日售票頁', cost:'PLN 10（70 分聯票）', dur:'約 25 min'},
      {t:'10:00', label:'★ Wieliczka 鹽礦 Tourist Route 英文團', sub:'3.5 km · 135m 深 · St. Kinga 鹽教堂', cost:'依 10/27 官方日期選擇器', dur:'2–3 h'},
      {t:'13:00', label:'Wieliczka 鎮中心午餐', cost:'PLN 40–60', dur:'30 min'},
      {t:'13:30', label:'火車回 Kraków Główny', cost:'PLN 10（70 分聯票）', dur:'約 25 min'},
      {t:'14:30', label:'★ Kazimierz 白天散步', sub:'舊猶太會堂 · Szeroka 街 · 《辛德勒名單》場景', cost:'免費', dur:'1.5 h'},
      {t:'16:00', label:'結束 Kazimierz 散步，回 ibis 取行李', sub:'飯店距 Kraków Główny 約 200 公尺；採購改為有餘裕才安排'},
      {t:'17:20', label:'抵 Kraków Główny', sub:'確認月台、車廂與座位；發車前保留約 35 分鐘', dur:'35 min 緩衝'},
      {t:'參考 17:55', label:'IC 3600 前往樂斯拉夫', sub:'指定日待確認／尚未訂票', cost:'票價待確認', dur:'2h57'},
      {t:'參考 20:52', label:'抵 Wrocław Główny', sub:'步行至主站對面的 Hotel Piast，拖行李保守抓 5–10 分鐘'},
    ],
    eat: [
      {text:'鹽礦 125m 地下餐廳 Karczma Górnicza', place:'Karczma Górnicza（維利奇卡鹽礦內）', map:'https://www.google.com/maps/search/?api=1&query=Karczma+Gornicza+Kopalnia+Soli+Wieliczka'},
      {text:'Sernik @ Cukiernia Michałek', place:'Cukiernia Michałek', map:'https://www.google.com/maps/search/?api=1&query=Cukiernia+Michalek+Krakow'},
      {text:'Pierożki u Vincenta（Kazimierz）', place:'Pierożki u Vincenta', map:'https://www.google.com/maps/search/?api=1&query=Pierozki+u+Vincenta+Krakow'},
    ],
    warn: '❗鹽礦與城際火車皆尚未訂。鹽礦英文場、實際票價與庫存須在官方日期選擇器確認；IC 3600 的 17:55–20:52 是目前採用的參考班次，不是已購票。若指定日班表不同，先保留 17:20 抵站與住宿接駁緩衝再重排。',
    backup: [
      {label:'鹽礦客滿或超時', where:'先查當日英文場與 PKP 實際班次再調整', why:'10/27 城際班表尚未確定，不能先假定末班車或緩衝時間'},
      {label:'雨天備案', where:'鹽礦本身就在地下 135m', why:'地下約 17–18°C、防雨遮陽最佳備案'},
      {label:'想留更多 Kazimierz 時間', where:'PKP 班次確定後，才延伸散步或採購時間', why:'16:00 先收尾；不得壓縮取行李與 17:20 抵站緩衝'},
    ],
    practical: [
      {tag:'交通', name:'Wieliczka 火車', note:'Kraków Główny 搭 KMŁ 至 Wieliczka Rynek-Kopalnia；2026 可買 70 分鐘 KMK+KMŁ 聯票 10 PLN（不含機場段）。'},
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
    train: {type:'Baltic Express 260 · 參考班次', leg:'指定日待確認／尚未訂票 · 二等艙建議', from:'Wrocław Główny', to:'Poznań Główny', dep:'19:10', arr:'20:29', dur:'1h19', price:'票價待確認'},
    steps: [
      {t:'09:00', label:'★ 中央廣場 + 紡織會館', sub:'dwarfsmap.com 找小矮人', cost:'免費', dur:'1.5 h'},
      {t:'10:30', label:'糖果屋雙屋 + 教堂塔樓', sub:'聖伊莉莎白教堂塔高 96m、觀景台 75m、304 階無電梯；一–六 10:00–19:00', cost:'PLN 16／10 · 現金', dur:'45 min'},
      {t:'11:30', label:'★ 拉茨瓦維採全景畫', sub:'30 分鐘導覽', cost:'PLN 50', dur:'1 h'},
      {t:'13:30', label:'★ 百年廳 (UNESCO)', sub:'先以官方 availability calendar 確認 10/28 是否可參觀內部；未確認前以外觀、噴泉與日本花園規劃', cost:'外觀免費', dur:'1 h'},
      {t:'16:15', label:'★ 座堂島煤氣燈', sub:'日落約 16:34；點燈人無固定公開出發分鐘，在島上等候與散步', cost:'免費', dur:'1 h'},
      {t:'17:15', label:'座堂島結束後回 Piast 取行李', sub:'座堂島 → 旅館約 25–30 分；距參考發車 1h55，18:35 前抵站後保留約 35 分鐘緩衝', dur:'約 1 h 20 min'},
      {t:'18:35 前', label:'抵 Wrocław Główny', sub:'確認月台、車廂與座位', dur:'至少 35 min 緩衝'},
      {t:'參考 19:10', label:'Baltic Express 260 前往波茲南', sub:'指定日待確認／尚未訂票', cost:'票價待確認', dur:'1h19'},
      {t:'參考 20:29', label:'抵 Poznań Główny', sub:'先到 Towarowa 37/201 接待處取鑰匙；實際公寓門牌依訂房確認'},
    ],
    eat: [
      {text:'Śląskie kluski @ Konspira', place:'Konspira（老城廣場旁）', map:'https://www.google.com/maps/search/?api=1&query=Konspira+Wroclaw'},
      {text:'Browar Stu Mostów 精釀', place:'Browar Stu Mostów', map:'https://www.google.com/maps/search/?api=1&query=Browar+Stu+Mostow+Wroclaw'},
    ],
    warn: '❗此日兩項皆尚未訂票。百年廳的 10/28 內部參觀狀態須以官方 availability calendar 確認，未確認前不販售或保證室內行程。10/28 日落約 16:34；點燈人沒有對外保證的固定出發分鐘，因此安排 16:15–17:15 在座堂島等候，不再把 16:45 寫成確定時刻。',
    backup: [
      {label:'雨天備案', where:'Sky Tower 觀景台', why:'開放時間、票價與能見度以官方當日公告為準，不用舊票價規劃'},
      {label:'點燈師看不到', where:'廣場連拱廊 + 紡織會館內部市集', why:'若日落後遇雨遮蔽煤氣燈，回廣場喝熱酒（PLN 12）'},
      {label:'百年廳未開放內部時的替代', where:'Panorama 全景畫後直接回老城，多留時間給小矮人與座堂島', why:'若 official availability calendar 顯示內部不可參觀，省下的時間可補足點燈前空檔'},
    ],
  },
  {
    n: 6, date: '10/29 (四)', city: '波茲南 → 華沙',
    title: '山羊鐘樓秀 + 聖馬丁牛角麵包',
    headline: 'EIC 8104 參考 17:40–約 20:00；兼顧正午山羊秀與下午行程',
    tag: 'Transit',
    intensity: '中高',
    hardConstraints: ['11:45 前抵達老城廣場卡位', '12:00 山羊鐘樓秀', '17:05 前抵 Poznań Główny；EIC 8104 指定日班次仍須確認'],
    mustBook: ['❗尚未訂 · 波茲南 → 華沙火車', '❗尚未訂 · 牛角麵包博物館（10/29 英語場待確認）'],
    compressible: ['Stary Browar 停留時間', '帝王城堡內部參觀'],
    weather: '尚無可靠預報；出發前 7–10 天更新',
    train: {type:'EIC 8104 Bolesław Prus · 參考班次', leg:'指定日待確認／尚未訂票 · 二等艙建議', from:'Poznań Główny', to:'Warszawa Centralna', dep:'17:40', arr:'約 20:00', dur:'約 2h20', price:'票價待確認'},
    steps: [
      {t:'09:00', label:'★ 教堂島 Ostrów Tumski', sub:'梅什科一世受洗地', cost:'未收費', dur:'1.5 h'},
      {t:'11:00', label:'廣場卡正面位置', dur:'45 min · 提早卡位'},
      {t:'12:00', label:'★ 山羊鐘樓秀', sub:'官方固定正午登場，兩隻金屬山羊互頂 12 次', cost:'免費', dur:'5 min'},
      {t:'12:15', label:'★ 聖馬丁牛角麵包 (PGI)', sub:'Cukiernia Kandulski；出發前確認分店、當日營業與 PGI 證書', cost:'依門市標價', dur:'15 min'},
      {t:'13:30–15:00 預留', label:'★ 牛角麵包博物館', sub:'10/29 週四英語場尚未確認；依官網可售場次調整，不能直接視為 13:30 開演', cost:'依官方售票頁', dur:'表演約 1 h'},
      {t:'15:00', label:'Stary Browar', sub:'博物館若延後則縮短購物；沒有合適英語場時改逛帝王城堡', cost:'購物另計', dur:'1 h'},
      {t:'16:00', label:'取行李、前往 Poznań Główny', sub:'先確認公寓行李寄放地點；17:05 前抵站', dur:'約 1 h'},
      {t:'17:05', label:'抵 Poznań Główny', sub:'確認月台、車廂與座位；拖行李保留進站緩衝', dur:'35 min 緩衝'},
      {t:'參考 17:40', label:'EIC 8104 前往華沙', sub:'指定日待確認／尚未訂票', cost:'票價待確認', dur:'約 2h20'},
      {t:'參考約 20:00', label:'抵 Warszawa Centralna', sub:'步行至 Hotel Metropol 約 500 公尺，拖行李預留 10–15 分鐘'},
    ],
    eat: [
      {text:'Rogal Świętomarciński (PGI) ⭐', note:'認證店家眾多，出發前依官方認證名單就近選擇'},
      {text:'Pyry z gzikiem @ Pyra Bar', place:'Pyra Bar', map:'https://www.google.com/maps/search/?api=1&query=Pyra+Bar+Poznan'},
    ],
    backup: [
      {label:'雨天想看山羊鐘', where:'可頌博物館官方售票頁', why:'週四英語場、價格與庫存都須依 10/29 官方售票系統確認；未確認前改以 Stary Browar 或帝王城堡為室內備案'},
      {label:'無合適英語場', where:'Stary Browar 商場 + 帝王城堡內部', why:'兩處各有室內空間，但館際移動需走戶外；下雨仍需雨具並預留交通時間'},
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
      {t:'10:00', label:'★ 皇家城堡', sub:'採 Royal Route，官方標示約 60 分；二–日 10:00–18:00、末入 17:00', cost:'票價出發前依官方售票頁重查', dur:'約 60 min'},
      {t:'11:15', label:'午餐（老城 → POLIN 路上）', sub:'選當日有營業且可訂位的店', cost:'依餐廳', dur:'45 min'},
      {t:'12:00', label:'前往 POLIN + 安檢緩衝', sub:'依當日交通重算，保留入館安檢與提早報到時間', dur:'1 h 15 min'},
      {t:'13:15', label:'★ POLIN 猶太博物館', sub:'週五 10:00–18:00；主展最晚 16:00 入場', cost:'依官方售票頁', dur:'2 h'},
      {t:'15:15', label:'前往華沙起義博物館 + 安檢緩衝', sub:'依當日交通重算，16:00 僅為規劃目標，以實際可售時段為準', dur:'45 min'},
      {t:'16:00', label:'★ 華沙起義博物館', sub:'35／30 PLN；以官方票頁 10/30 可售時段為準', cost:'PLN 35／30', dur:'2 h'},
      {t:'19:30', label:'老城最後晚餐', sub:'U Fukiera / Polka', cost:'PLN 120–200', dur:'1.5 h'},
      {t:'21:00', label:'老城廣場夜燈漫步', sub:'自由收尾'},
    ],
    eat: [
      {text:'Żurek 酸黑麥湯 @ U Fukiera', place:'U Fukiera（老城廣場）', map:'https://www.google.com/maps/search/?api=1&query=U+Fukiera+Warszawa'},
      {text:'Pączki @ A. Blikle 1869', place:'A.Blikle（Nowy Świat）', map:'https://www.google.com/maps/search/?api=1&query=A.Blikle+Nowy+Swiat+Warszawa'},
    ],
    warn: '❗四項皆尚未訂。皇家城堡已由官方確認二–日 10:00–18:00、最後入場 17:00；本行程採約 60 分鐘 Royal Route，避免與午餐及館際移動重疊。POLIN 週五 10:00–18:00，主展最後入場為閉館前 2 小時。起義博物館票價 35／30，個人免費日為週一（非週四，官方公告）；10/30 是週五，照常收費，實際可售時段仍以官方票頁為準。蕭邦博物館 2026 整修資訊則須在出發前再核對官方公告。',
    extend: [
      {label:'Bulwary Wiślane 維斯瓦河畔', when:'21:00 後老城散步延伸', why:'河濱步道 + 沙灘酒吧，皇家城堡步行 10–15 分，適合晚餐後收尾散步，免費'},
      {label:'Neon Museum 霓虹燈博物館', when:'若提前結束起義博物館可插入', why:'已遷入科學文化宮 4 樓（Marszałkowska 入口），共產時期霓虹招牌收藏，PLN 25／優待 18，可與觀景台一起看'},
      {label:'Praga 區塗鴉與 Koneser 舊釀酒廠', when:'午餐後彈性時段', why:'起義博物館到皇家城堡之間若時間寬裕，可繞道河對岸 Praga 感受工業改造街區，步行或電車皆可'},
      {label:'科學文化宮 30F 觀景台夜景版', when:'起義博物館後、晚餐前', why:'票價出發前依官方售票頁重查；一般售票資訊至 20:00，是否有晚間特別時段仍看當日公告'},
    ],
    backup: [
      {label:'三館太累', where:'保留已訂時段，POLIN 與起義擇一深看', why:'兩館內容都沉重；不要犧牲已確認的皇家城堡上午時段'},
      {label:'天氣轉壞', where:'科學文化宮 30 樓觀景台（室內）', why:'票價出發前依官方售票頁重查 · 45 min · 直通老城地鐵，雨天備案'},
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
      {t:'08:00', label:'早餐 + 老城散步', cost:'PLN 40', dur:'1.5 h'},
      {t:'09:45', label:'退房 → Warszawa Centralna', sub:'由 Hotel Metropol 出發；依行李狀況步行或叫車，當日再用導航重算並預留找月台緩衝', dur:'30–45 min'},
      {t:'10:30', label:'SKM S2/S3 目標班次', sub:'第 1 區時間票；當日查 WTP 月台、發車時間與票價', cost:'當日確認', dur:'約 25–30 min'},
      {t:'11:00', label:'抵 Chopin 第一航廈'},
      {t:'11:15', label:'退稅文件 + 報到 + 安檢', sub:'如有 TAX FREE 商品，依機場與電子文件指示辦理；託運商品須在交運前備妥供海關查驗', dur:'預留至少 60–90 min'},
      {t:'14:40', label:'★ QR 260 起飛', sub:'WAW → DOH → HKG → TPE'},
    ],
    backup: [
      {label:'班機提早 2 h', where:'蕭邦機場 1F Costa Coffee · 觀景窗', why:'退稅 + 安檢順可能 12:30 就過關，1F 貴賓區外有平價咖啡'},
      {label:'紀念品最後採買', where:'Wedel + Krówki 機場店', why:'1F 出境前最後一站，伴手禮價差 +10–15% 但方便'},
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
    id:'warsaw-reduta', city:'華沙', en:'Warszawa', name:'ibis budget Warszawa Reduta',
    officialName:'ibis budget Warszawa West Station', checkIn:'2026-10-24', checkOut:'2026-10-25', nights:1,
    address:'ul. Bitwy Warszawskiej 16 A, 02-366 Warszawa', addressVerified:true, rooms:1, status:'已確認',
    coordinates:{lat:52.214645, lng:20.968169, status:'已核對', checkedAt:'2026-08-12'},
    officialUrl:'https://all.accor.com/hotel/7148/index.pl.shtml',
    note:'訂單仍使用 Reduta 舊名；Accor 官網目前改稱 Warszawa West Station，為同一地址。',
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
    checkIn:'2026-10-29', checkOut:'2026-10-31', nights:2,
    address:'ul. Marszałkowska 99a, 00-693 Warszawa', addressVerified:true, rooms:1, status:'已確認',
    coordinates:{lat:52.22901, lng:21.01099, status:'已核對', checkedAt:'2026-08-11'},
    officialUrl:'https://www.hotelmetropol.com.pl/pl/',
    note:'位於 Metro Centrum 附近，步行可達 Warszawa Centralna。',
  },
];

export const trains = [
  {seg:'Warszawa Zachodnia → Kraków Główny', date:'10/25', type:'EIP 5300', dep:'08:45', arr:'10:56', dur:'2h11', price:'票價待確認', status:'參考班次／尚未訂票', note:'一等艙建議；本趟安排頭等艙體驗。10/25 換表後須確認仍停靠西站。'},
  {seg:'Kraków MDA ⇄ Muzeum Auschwitz', date:'10/26', type:'BUS · Lajkonik', leg:'現行班表參考', dep:'參考 07:10', arr:'參考 16:55 回抵', dur:'單程約 1h25', price:'待業者開放 10/26 售票', status:'指定日尚未確認'},
  {seg:'Kraków Główny → Wrocław Główny', date:'10/27', type:'IC 3600 Siemiradzki', dep:'17:55', arr:'20:52', dur:'2h57', price:'票價待確認', status:'參考班次／尚未訂票', note:'二等艙建議；一等艙可選。17:20 前到站。'},
  {seg:'Wrocław Główny → Poznań Główny', date:'10/28', type:'Baltic Express 260', dep:'19:10', arr:'20:29', dur:'1h19', price:'票價待確認', status:'參考班次／尚未訂票', note:'二等艙建議。18:35 前到站。'},
  {seg:'Poznań Główny → Warszawa Centralna', date:'10/29', type:'EIC 8104 Bolesław Prus', dep:'17:40', arr:'約 20:00', dur:'約 2h20', price:'票價待確認', status:'參考班次／尚未訂票', note:'適合體驗一等艙；若 10/25 已搭 EIP 一等艙，可依價差改選二等艙。17:05 前到站。'},
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
    name: 'Lajkonik · Auschwitz 巴士班表與購票',
    url: 'https://www.lajkonikbus.eu/krakow-oswiecim.html',
    note: '查 Kraków MDA → Muzeum Auschwitz；回程請由同站切換 Oświęcim → Kraków，10/26 指定日付款前再核對。',
  },
];

export const railPurchaseSteps = [
  {
    title: '先用官方時刻表找直達班次',
    detail: '在 Passenger Portal 輸入出發站、抵達站、日期與目標時間，勾選 Direct connections。四段起點依序使用 Warszawa Zachodnia、Kraków Główny、Wrocław Główny、Poznań Główny。',
  },
  {
    title: '進 PKP Intercity 官方購票頁重查',
    detail: '用相同站名與日期搜尋；通常最早約 30 天前開放，10/25、27、28、29 的提醒日分別是 9/25、9/27、9/28、9/29，但不是保證開賣日。只有購票頁顯示可選車次與價格時才算可售。',
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
    {name:'Auschwitz 官方英文導覽（僅線上入場證；指定場次庫存以系統為準）', url:'https://visit.auschwitz.org/'},
    {name:'Wieliczka 鹽礦英文團（現在即可訂）', url:'https://www.wieliczka-saltmine.com/'},
    {name:'Lajkonik 往返巴士（10/26 指定日班次待確認）', url:'https://www.lajkonikbus.eu/krakow-oswiecim.html'},
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
    intro: '四段 PKP 已選定規劃班次，一組 Auschwitz 往返巴士採現行班表參考；尚未完成指定日確認或購票前，不把時刻、車種或月台當成已確認。',
    items: [
      {checkedAt:null, recheckAt:null, date:'10/25', name:'EIP 5300｜Warszawa Zachodnia → Kraków Główny', status:'參考班次／尚未訂票', action:'核對 10/25 換表後仍停西站，確認 08:45–10:56、票價及一等艙座位後購票。', url:'https://www.intercity.pl/en/'},
      {checkedAt:null, recheckAt:null, date:'10/26', name:'Lajkonik 克拉科夫 ⇄ Auschwitz 巴士', status:'指定日尚未確認', action:'依已取得的 Auschwitz 導覽時段，在業者售票頁確認 10/26 去回班次、上下車點與票價。', url:'https://www.lajkonikbus.eu/krakow-oswiecim.html'},
      {checkedAt:null, recheckAt:null, date:'10/27', name:'IC 3600｜Kraków Główny → Wrocław Główny', status:'參考班次／尚未訂票', action:'核實 17:55–20:52 指定日班表並購票；記錄車廂、座位與訂位憑證。', url:'https://www.intercity.pl/en/'},
      {checkedAt:null, recheckAt:null, date:'10/28', name:'Baltic Express 260｜Wrocław Główny → Poznań Główny', status:'參考班次／尚未訂票', action:'核實 19:10–20:29 指定日班表並購票；確認公寓晚間取鑰匙方式。', url:'https://www.intercity.pl/en/'},
      {checkedAt:null, recheckAt:null, date:'10/29', name:'EIC 8104｜Poznań Główny → Warszawa Centralna', status:'參考班次／尚未訂票', action:'核實 17:40–約 20:00 指定日班表並購票；抵站後步行至 Metropol 預留 10–15 分鐘。', url:'https://www.intercity.pl/en/'},
    ],
  },
  {
    id: 'attractions', title: '主要景點', eyebrow: 'Tickets · 8 項',
    intro: '指定日期的場次與庫存會變動；付款完成後請下載離線票券並核對入場時間。',
    items: [
      {checkedAt:null, recheckAt:null, date:'10/25', name:'Wawel 城堡 14:00', status:'尚未訂', action:'以官方售票頁選 10/25 14:00 左右、可於 15:00 前結束的短路線；完整 2 小時路線會壓縮步行時間。', url:'https://wawel.krakow.pl/en/what-to-see'},
      {checkedAt:null, recheckAt:null, date:'10/25', name:'辛德勒工廠 17:30', status:'現可查／購', action:'10/25 已進個人網路票 90 天窗口；以官方售票頁的可售時段為準。', url:'https://muzeumkrakowa.pl/en/branches/oskar-schindlers-enamel-factory'},
      {checkedAt:null, recheckAt:null, date:'10/26', name:'Auschwitz 英文官方導覽', status:'需查／購', action:'只能線上取得入場證；選擇官方系統提供的英文導覽場次。', url:'https://visit.auschwitz.org/'},
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
      {checkedAt:null, recheckAt:null, date:'10/28', name:'百年廳 10/28 內部參觀狀態', status:'待官方日曆確認', action:'上 halastulecia.pl 的 availability calendar 查 10/28 圓頂展廳是否開放；2026-08-09 盤查時官方公開頁既無法證實關閉、也無法證實開放。行前 3–5 天再複查一次。', url:'https://halastulecia.pl/zwiedzanie/visitor-centre/'},
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
  {when:'❗現在就查／訂（最急）', what:'Auschwitz 英文官方導覽 — 所有入場證僅能在線上取得，10/26 的指定場次庫存與價格以 visit.auschwitz.org 為準，入口不售票。'},
  {when:'❗現在就查／訂', what:'Wieliczka 鹽礦英文 Tourist Route 10:00 場 — 10/27 英文場、實際票價與庫存以官方日期選擇器為準；不要用舊價格或開賣週期取代訂票結果。'},
  {when:'現在可訂', what:'皇家城堡 — 已查證二至日 10:00–18:00、最後入場 17:00；Day 7 已改為 10:00 第一站（zamek-krolewski.pl）'},
  {when:'現在可先訂', what:'米其林與熱門餐廳：Bottiglieria 1881（二星，最搶）、BABA / Most（樂斯拉夫僅停留一晚零彈性）、WANDAL、Pod Aniołami（TheFork / OpenTable / 餐廳官網）'},
  {when:'火車票：指定日可售即處理', what:'PKP Intercity 四段已選規劃班次：10/25 EIP 5300 08:45–10:56、10/27 IC 3600 17:55–20:52、10/28 Baltic Express 260 19:10–20:29、10/29 EIC 8104 17:40–約 20:00。全部仍須在 bilet.intercity.pl 與 Passenger Portal 核實指定日班表、票價與座位後購票。'},
  {when:'現在可查／訂', what:'辛德勒工廠 10/25 場次已進個人網路票 90 天窗口；POLIN、華沙起義博物館與皇家城堡均以官方售票頁顯示的指定日庫存為準。'},
  {when:'出發前 1 週', what:'把上述所有票價、特別閉館與開放時間再確認一次 — 本清單資料查證日為 2026-08-09，臨時活動與維修仍可能變動'},
  {when:'抵達當日', what:'隔日 Wawel 國家廳室現場票（限額制，售完只能改庭院）'},
];
