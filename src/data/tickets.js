// 逐項以景點官網查證；價格單位均為 PLN。每筆 note 內自帶該項的查證日期，
// 不用單一全站日期概括——票價與開放規則各自改版的時間點不同。
// 最近一輪全面複查：2026-09-17。
export const fares = [
  {name:'華沙 · 皇家城堡', fullPrice:'60／95', discountPrice:'45／75', note:'2026-08-11 官網查證：二–日 10:00–18:00、最後入場 17:00；Royal Route 60／45（約 60 分）、Castle Route 95／75（約 150 分，含語音導覽）；週三免費但只走限定路線、現場領票且數量有限，語音導覽另收 10', officialUrl:'https://www.zamek-krolewski.pl/en/strona/opening-hours-and-ticket-prices/2801-opening-hours-and-ticket-prices-may-2-2026', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E8%8F%AF%E6%B2%99%20%E7%9A%87%E5%AE%B6%E5%9F%8E%E5%A0%A1'},
  {name:'華沙 · 科學文化宮觀景台', fullPrice:'出發前重查', discountPrice:'出發前重查', note:'2026-08-11 官網曾查得 30／25 PLN；票價屬動態資訊，出發前以官方售票頁為準。每日 10:00–20:00；觀景台在 30 樓、114 m，電梯 19 秒；夜間場（20:00–24:00）只在週五六且只到 9 月底，10 月不適用；11/1 閉館', officialUrl:'https://pkin.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E8%8F%AF%E6%B2%99%20%E7%A7%91%E5%AD%B8%E6%96%87%E5%8C%96%E5%AE%AE%E8%A7%80%E6%99%AF%E5%8F%B0'},
  {name:'華沙 · Neon 霓虹博物館', fullPrice:'25', discountPrice:'18', note:'科學文化宮 4 樓；一–四 11:00–18:00、五–六至 19:00、日 11:00–18:00', officialUrl:'https://www.neonmuzeum.org/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E8%8F%AF%E6%B2%99%20Neon%20%E9%9C%93%E8%99%B9%E5%8D%9A%E7%89%A9%E9%A4%A8'},
  {name:'華沙 · MSN 當代美術館', fullPrice:'40', discountPrice:'30', note:'二–四／六 11:00–19:00、五至 20:00、日至 18:00；18:00 後 25／15，Gallery A 免費', officialUrl:'https://artmuseum.pl/en/visit', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E8%8F%AF%E6%B2%99%20MSN%20%E7%95%B6%E4%BB%A3%E7%BE%8E%E8%A1%93%E9%A4%A8'},
  {name:'華沙 · 波蘭歷史博物館', fullPrice:'以官網', discountPrice:'—', note:'華沙城堡區新館已於 2023 開館；常設展仍在建置，先查當期臨展', officialUrl:'https://muzhp.pl/en/about-museum', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E8%8F%AF%E6%B2%99%20%E6%B3%A2%E8%98%AD%E6%AD%B7%E5%8F%B2%E5%8D%9A%E7%89%A9%E9%A4%A8%20Warszawa'},
  {name:'華沙 · E.Wedel 巧克力工廠博物館', fullPrice:'依場次', discountPrice:'依場次', note:'2026-09-17 官網查證：al. Emila Wedla 5（近 Warszawa Wschodnia 站）· 每日 10:00–20:00 · 導覽 90 分鐘，含導覽與試吃 · 官網明列「英語導覽場只在週一與週五」，本行程唯一可用的是 10/30（五）· 頁面可讀到減免票 55、家庭票 59／人、大家庭卡 56、團體 59／47；個人全票數字本次未能完整讀取，購票前以官方售票頁為準', officialUrl:'https://fabrykaczekolady.pl/en/contact-us', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E8%8F%AF%E6%B2%99%20E.Wedel%20Warszawa'},
  {name:'克拉科夫 · Wawel 王冠寶庫', fullPrice:'47', discountPrice:'35', note:'2026-09-17 官網查證（9–12 月）：二–日 09:00–17:00、最後入場為閉館前 40 分（約 16:20），47／35 PLN。皇家花園季節開放只到 10/4，10/25 票券不含花園。官網另載 10–12 月週一有限定路線的免費場、數量有限，10/25 是週日不適用，若要改排週一須先在官方售票頁確認', officialUrl:'https://wawel.krakow.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E5%85%8B%E6%8B%89%E7%A7%91%E5%A4%AB%20Wawel%20%E7%8E%8B%E5%86%A0%E5%AF%B6%E5%BA%AB'},
  {name:'克拉科夫 · Wawel 城堡一、二樓', fullPrice:'57', discountPrice:'43', note:'2026-09-17 官網查證（9–12 月）：二–日 09:00–17:00、最後入場為閉館前 50 分（約 16:10）。官網此季分路線售票，「Castle 2nd floor（代表廳＋鄂圖曼土耳其帳篷）」57／43；同季另有 Castle Underground 47／35（含語音導覽）、Armoury 47／35。官網未列 95／71 的一、二樓整合套票，需要合併路線請以官方售票系統 bilety.wawel.krakow.pl 當日顯示為準', officialUrl:'https://wawel.krakow.pl/en/what-to-see', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E5%85%8B%E6%8B%89%E7%A7%91%E5%A4%AB%20Wawel%20%E5%9F%8E%E5%A0%A1'},
  {name:'克拉科夫 · 辛德勒工廠', fullPrice:'60', discountPrice:'45', note:'ul. Lipowa 4', officialUrl:'https://muzeumkrakowa.pl/oddzialy/fabryka-emalia-oskara-schindlera', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E5%85%8B%E6%8B%89%E7%A7%91%E5%A4%AB%20%E8%BE%9B%E5%BE%B7%E5%8B%92%E5%B7%A5%E5%BB%A0'},
  {name:'克拉科夫 · 維利奇卡鹽礦', fullPrice:'日期選擇器', discountPrice:'日期選擇器', note:'英語導覽的 10/27 實際票價、場次與庫存以官網日期選擇器為準；通用頁僅列 from 131 PLN', officialUrl:'https://www.wieliczka-saltmine.com/individual-tourist/useful-information/ticket-prices-and-visiting-hours', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E5%85%8B%E6%8B%89%E7%A7%91%E5%A4%AB%20%E7%B6%AD%E5%88%A9%E5%A5%87%E5%8D%A1%E9%B9%BD%E7%A4%A6%20Wieliczka'},
  {name:'克拉科夫 · 奧斯威辛', fullPrice:'依訂票頁', discountPrice:'依資格', note:'所有入場證僅能線上取得；10 月 07:30–16:00 只能跟官方導覽，16:00 後才有免費自導時段', officialUrl:'https://www.auschwitz.org/en/visiting/guided-tours-for-individual-visitors/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E5%85%8B%E6%8B%89%E7%A7%91%E5%A4%AB%20%E5%A5%A7%E6%96%AF%E5%A8%81%E8%BE%9B%20O%C5%9Bwi%C4%99cim'},
  {name:'樂斯拉夫 · Afrykarium／動物園', fullPrice:'線上 69 起／現場 99', discountPrice:'線上 59 起／現場 89', note:'2026-09-17 官方票價頁查證：全票線上 69 zł 起、售票口 99 zł；優待票線上 59 zł 起、售票口 89 zł。採動態定價，「起」價會隨日期變動，指定日以官方售票頁為準 · 開放 09:00–18:00、最後入場 17:00 · 入園票已含 Afrykarium，不需另購', officialUrl:'https://zoo.wroclaw.pl/en/prices/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%A8%82%E6%96%AF%E6%8B%89%E5%A4%AB%20Afrykarium%EF%BC%8F%E5%8B%95%E7%89%A9%E5%9C%92'},
  {name:'樂斯拉夫 · Panorama Racławicka', fullPrice:'50', discountPrice:'35', note:'官網優待價已補上', officialUrl:'https://mnwr.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%A8%82%E6%96%AF%E6%8B%89%E5%A4%AB%20Panorama%20Rac%C5%82awicka'},
  {name:'樂斯拉夫 · 百年廳 Visitor Centre', fullPrice:'25', discountPrice:'20', note:'四–十月二–日 10:00–18:00；加看百年廳內部為 30／25，內部仍依活動日曆開放', officialUrl:'https://halastulecia.pl/zwiedzanie/visitor-centre/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%A8%82%E6%96%AF%E6%8B%89%E5%A4%AB%20%E7%99%BE%E5%B9%B4%E5%BB%B3'},
  {name:'樂斯拉夫 · Hydropolis', fullPrice:'45', discountPrice:'36', note:'2026-08-11 官網查證：週末及假日為 47／38 PLN；指定日期入場名額以官方售票頁為準', officialUrl:'https://bilety.hydropolis.pl/cennik.html?lang=en', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%A8%82%E6%96%AF%E6%8B%89%E5%A4%AB%20Hydropolis'},
  {name:'樂斯拉夫 · Kolejkowo', fullPrice:'線上 39 起／現場 55 起', discountPrice:'線上 33 起／現場 45 起', note:'2026-08-12 官網查證：票價為起價，指定日期與線上庫存以官方售票頁為準 · Sky Tower 1 樓（Powstańców Śląskich 95）· 全年 365 天開放含非營業週日，每日 10:00 起、關門時間依官方日期日曆 · 參觀約 1.5 h', officialUrl:'https://kolejkowo.pl/wroclaw/en/price-list/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%A8%82%E6%96%AF%E6%8B%89%E5%A4%AB%20Kolejkowo'},
  {name:'波茲南 · Palmiarnia 棕櫚屋', fullPrice:'暫時閉館', discountPrice:'—', note:'2026-09-17 官網查證：整站首頁已改為「ZAMKNIĘCIE PALMIARNI」公告——因現代化與改建工程對外暫時閉館，官方只說重開與參觀方式會在官方管道公告（另指向 pim.poznan.pl），未給任何重開日期。本行程 10/29 不排入，也不再作為雨天室內備案；舊的 19／15 PLN 與二–五 09:00–17:00 規則已失效', officialUrl:'https://palmiarnia.poznan.pl/zwiedzanie/godziny-otwarcia/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%B3%A2%E8%8C%B2%E5%8D%97%20Palmiarnia%20%E6%A3%95%E6%AB%9A%E5%B1%8B'},
  {name:'波茲南 · 可頌博物館', fullPrice:'英語公開場 47', discountPrice:'未滿 3 歲 1', note:'2026-09-17 官網查證：英語公開場 47 PLN／人（滿 3 歲起）、未滿 3 歲 1 PLN；官網列開放時間為日–四 11:00–15:30、六 11:00–17:00（未列週五），入口在 Klasztorna 23、售票口於開演前 15 分開放、館內約 50 人上限。10/29（週四）是否有英語場、開演時刻與庫存一律以官方售票頁當日顯示為準——不可預設 13:30 有場，未顯示日期也不等於售罄', officialUrl:'https://rogalowemuzeum.pl/en/buy-ticket/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%B3%A2%E8%8C%B2%E5%8D%97%20%E5%8F%AF%E9%A0%8C%E5%8D%9A%E7%89%A9%E9%A4%A8'},
  {name:'波茲南 · 帝王城堡', fullPrice:'地圖 10／語音導覽 20', discountPrice:'地圖 7／語音導覽 15', note:'2026-09-17 官網查證：一–日 12:00–19:00、售票至 18:00；附地圖摺頁自行參觀 10／7 PLN，語音導覽 20／15 PLN，導覽機最晚 18:00 發放、19:00 前歸還（也可改用語音導覽存取碼，需自備手機與耳機）。這裡是 CK ZAMEK 文化中心而非宮殿博物館，可參觀空間仍依當日活動而定', officialUrl:'https://ckzamek.pl/podstrony/6071-zwiedzanie-zamku/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%B3%A2%E8%8C%B2%E5%8D%97%20%E5%B8%9D%E7%8E%8B%E5%9F%8E%E5%A0%A1'},
  {name:'波茲南 · 古市政廳博物館', fullPrice:'閉館中', discountPrice:'—', note:'整修中；官方預計 2027 年底至 2028 年初才全面重開', officialUrl:'https://www.msu.mnp.art.pl/profile/wizyta-ratusz-muzeum-poznania', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%B3%A2%E8%8C%B2%E5%8D%97%20%E5%8F%A4%E5%B8%82%E6%94%BF%E5%BB%B3%E5%8D%9A%E7%89%A9%E9%A4%A8'},
  {name:'波茲南 · 考古博物館', fullPrice:'待重查', discountPrice:'待重查', note:'2026-09-17 官網查得學期季（9/1–6/30）開放時間：二–四 09:00–16:00、五 10:00–17:00、六 11:00–18:00、日 12:00–16:00。票價分頁本次讀取失敗，站內舊值 10／6 與外部流傳的 15／10、聯票 25／15 互相矛盾，兩者都沒有一手佐證，故一律標待重查，不擇一寫入；免費日同樣待確認', officialUrl:'https://www.muzarp.poznan.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%B3%A2%E8%8C%B2%E5%8D%97%20%E8%80%83%E5%8F%A4%E5%8D%9A%E7%89%A9%E9%A4%A8'},
];

// 舊版城市分組保留作快速對照，括號內指向上方較新的 fares 資料。
export const ticketsByCity = [
  {city:'華沙', items:[
    ['皇家城堡', 'Royal Route 60／45、Castle Route 95／75 · 週三限定路線免費（2026-08-11 官網查證）'],
    ['POLIN 猶太歷史', '週五 10:00–18:00；票價與指定日庫存看官方售票頁'],
    ['華沙起義博物館', 'PLN 35／30 · 官方目前列週四免費；10/30（五）不適用'],
    ['蕭邦博物館', '2026 全年整修閉館（1/1–12/31），官方預告 2027 年 1 月配合蕭邦鋼琴大賽百年重開；期間售票處移至隔壁 Tamka 43 蕭邦研究所'],
    ['科學文化宮觀景台', '票價出發前依官方售票頁重查（2026-08-11 曾查得 30／25 PLN）· 夜間場只到 9 月底，10 月不適用'],
    ['E.Wedel 巧克力工廠', '每日 10:00–20:00、導覽 90 分 · 官網載英語場只在週一與週五，本行程只有 10/30（五）可用'],
    ['MSN 現代藝術博物館', '展覽 40／30 · 18:00 後 25／15 · Gallery A 免費'],
  ]},
  {city:'克拉科夫', items:[
    ['瓦維爾城堡二樓代表廳', 'PLN 57／43 · 二–日 09:00–17:00、末入場為閉館前 50 分 · 官網 9–12 月分路線售票，沒有 95／71 的一、二樓套票'],
    ['瓦維爾王冠寶庫', 'PLN 47／35 · 末入場為閉館前 40 分 · 本行程 10/25 一小時空檔較適合這條'],
    ['辛德勒工廠', 'PLN 60 · 優待 45（以官網為準）'],
    ['聖瑪麗教堂登塔', 'PLN 20／15 · 只在 Mariacki 廣場 7 號當日現場售票、無法預約 · 入口在 Floriańska 街'],
    ['奧斯威辛 Educator 導覽', '10/26 10:30 英文場已訂妥（約 3 小時 45 分，2 人）；10 月上午本來就必須跟團'],
    ['維利奇卡鹽礦', '10/27 英文場、實際票價與庫存看官方日期選擇器'],
    ['地下市集博物館', 'PLN 45／35 · 末入為閉館前 75 分鐘 · 每週二免費（現場限量）· 每月第二個週一休'],
  ]},
  {city:'樂斯拉夫', items:[
    ['百年廳 Hala Stulecia', 'Visitor Centre 25／20；含廳內 30／25，內部依活動日曆'],
    ['拉茨瓦維採全景畫', 'PLN 50／35 · 每場 30 分鐘 · 10/28 指定時段庫存待確認'],
    ['Afrykarium 動物園', '全票線上 69 起／現場 99；優待線上 59 起／現場 89 · 09:00–18:00、末入 17:00 · 已含 Afrykarium'],
  ]},
  {city:'波茲南', items:[
    ['牛角麵包博物館', '英語公開場 47 PLN（滿 3 歲）／未滿 3 歲 1 PLN · 官網列日–四 11:00–15:30、六 11:00–17:00 · 10/29 有無英語場與開演時刻看官方售票頁'],
    ['Palmiarnia 棕櫚屋', '官網公告改建暫時閉館、重開未定——不要排入，也不要當雨天備案'],
    ['考古博物館', '二–四 09:00–16:00、五 10:00–17:00、六 11:00–18:00、日 12:00–16:00 · 票價待重查'],
    ['帝王城堡 CK ZAMEK', '一–日 12:00–19:00、售票至 18:00 · 地圖摺頁 10／7、語音導覽 20／15 · 導覽機 18:00 前發放、19:00 前歸還'],
    ['古市政廳博物館', '整修閉館；預計 2027 年底至 2028 年初全面重開'],
  ]},
];

export const ticketNotices = [
  {status:'已訂妥', level:'reminder', text:'奧斯威辛 10/26 10:30 英文個人 educator 導覽（官方標示約 3 小時 45 分，2 人）已完成訂購。入場證只在線上提供，且官方載明須搭配身分證件；請把入場證存離線並隨身帶護照。', url:'https://www.auschwitz.org/en/visiting/'},
  {status:'開賣再確認', level:'reminder', text:'博物館活動、臨時閉館與可售場次仍可能調整；本站不把「查證過」誤寫成「已訂到」，購票時請以官方日曆為準。', url:'https://visit.auschwitz.org/'},
];

// 場館開放規則的結構化版本。
//
// 同樣的事實原本只寫在自由文字裡（fares[].note 的「二–日 10:00–18:00、
// 最後入場 17:00」、trip.js 的 hardConstraints 等），人看得懂，程式無法用來
// 檢查行程有沒有排在末入場之後。這裡只把站內既有、已查證的內容轉成欄位。
//
// 規則：**不新增站內沒有的事實**。沒有來源就留 null 或空陣列，讓稽核跳過，
// 不要用常識補——稽核會把補上去的猜測當成查證過的規則。
// sourceRef 記錄每筆的出處，checkedAt 只在來源本身帶日期時才填。
//
// closedWeekdays：0 = 週日 … 6 = 週六。
// lastEntry：最後入場時刻；null 表示站內無此資料，稽核時跳過而不猜。
export const venueHours = {
  'warsaw-royal-castle': {
    name: '華沙 · 皇家城堡', closedWeekdays: [1], opens: '10:00', closes: '18:00', lastEntry: '17:00',
    checkedAt: '2026-08-11', sourceRef: "fares['華沙 · 皇家城堡'].note",
    officialUrl: 'https://www.zamek-krolewski.pl/en/strona/opening-hours-and-ticket-prices/2801-opening-hours-and-ticket-prices-may-2-2026',
    note: '二–日 10:00–18:00、最後入場 17:00（二–日開放即代表週一休）。',
  },
  'warsaw-polin': {
    // 站內只查得週五時段與「主展最後入場為閉館前 2 小時」，沒有每週公休日的記載。
    // 實際上許多波蘭博物館週二休，但站內沒有來源，因此留空而不是憑印象補。
    name: '華沙 · POLIN 猶太歷史博物館', closedWeekdays: [], opens: '10:00', closes: '18:00', lastEntry: '16:00',
    checkedAt: null, sourceRef: "ticketsByCity 華沙『POLIN 猶太歷史』與 Day 7 warn",
    officialUrl: 'https://polin.pl/en',
    note: '週五 10:00–18:00，主展最後入場為閉館前 2 小時。每週公休日站內尚無查證資料，行前須另行確認。',
  },
  'warsaw-pkin-terrace': {
    name: '華沙 · 科學文化宮觀景台', closedWeekdays: [], opens: '10:00', closes: '20:00', lastEntry: null,
    checkedAt: '2026-08-11', sourceRef: "fares['華沙 · 科學文化宮觀景台'].note",
    officialUrl: 'https://pkin.pl/',
    note: '每日 10:00–20:00；夜間場只在週五六且只到 9 月底，10 月不適用。',
  },
  'krakow-wawel-castle': {
    name: '克拉科夫 · Wawel 城堡一、二樓', closedWeekdays: [1], opens: '09:00', closes: '17:00', lastEntry: '16:10',
    checkedAt: '2026-09-17', sourceRef: "fares['克拉科夫 · Wawel 城堡一、二樓'].note",
    officialUrl: 'https://wawel.krakow.pl/en/what-to-see',
    note: '2026-09-17 官網 9–12 月規則：二–日 09:00–17:00，Castle 2nd floor 最後入場為閉館前 50 分（16:10）。本行程採短路線，較有彈性。',
  },
  'krakow-wawel-treasury': {
    name: '克拉科夫 · Wawel 王冠寶庫', closedWeekdays: [1], opens: '09:00', closes: '17:00', lastEntry: '16:20',
    checkedAt: '2026-09-17', sourceRef: "fares['克拉科夫 · Wawel 王冠寶庫'].note",
    officialUrl: 'https://wawel.krakow.pl/',
    note: '2026-09-17 官網 9–12 月規則：二–日 09:00–17:00，最後入場為閉館前 40 分（16:20）。',
  },
  'krakow-schindler': {
    // 站內的 18:30 出現在 Day 2 步驟（標為「週日最後入場」）與訂票優先順序。
    // 本行程只在 10/25（週日）造訪，故適用；不要當成每日通則。
    name: '克拉科夫 · 辛德勒工廠', closedWeekdays: [], opens: null, closes: null, lastEntry: '18:30',
    checkedAt: null, sourceRef: 'trip.js Day 2 hardConstraints 與 bookingTiers 第二優先',
    officialUrl: 'https://muzeumkrakowa.pl/oddzialy/fabryka-emalia-oskara-schindlera',
    note: '站內記載為週日最後入場 18:30，本行程 10/25 造訪日正是週日。其他星期的時段以官方售票頁為準。',
  },
  'wroclaw-hala-stulecia': {
    name: '樂斯拉夫 · 百年廳 Visitor Centre', closedWeekdays: [1], opens: '10:00', closes: '18:00', lastEntry: null,
    checkedAt: '2026-08-11', sourceRef: "fares['樂斯拉夫 · 百年廳 Visitor Centre'].note",
    officialUrl: 'https://halastulecia.pl/zwiedzanie/visitor-centre/',
    note: '四–十月二–日 10:00–18:00。圓頂展廳內部依官方 availability calendar 逐日標示三種狀態（可參觀／只能看 Visitor Centre／兩者皆不開）；2026-09-17 讀取官方日曆時只取得到當月頁面，10/28 仍待確認。',
  },
  'poznan-palmiarnia': {
    // 2026-09-17 官網公告改建暫時閉館。沒有任何生效中的開放規則可比對，
    // 因此時間欄位全部留 null——留著舊的 09:00–17:00 會讓稽核誤以為還能排。
    name: '波茲南 · Palmiarnia 棕櫚屋', closedWeekdays: [], opens: null, closes: null, lastEntry: null,
    checkedAt: '2026-09-17', sourceRef: "fares['波茲南 · Palmiarnia 棕櫚屋'].note",
    officialUrl: 'https://palmiarnia.poznan.pl/zwiedzanie/godziny-otwarcia/',
    note: '官網公告因現代化與改建工程暫時閉館，未公布重開日期；閉館期間沒有可比對的開放時間。',
  },
  'warsaw-rising-museum': {
    name: '華沙 · 華沙起義博物館', closedWeekdays: [2], opens: '08:00', closes: '18:00', lastEntry: '17:30',
    checkedAt: '2026-09-17', sourceRef: '官方 Visit us 頁（1944.pl），2026-09-17 查證',
    officialUrl: 'https://www.1944.pl/en/article/visit-us,4993.html',
    note: '2026-09-17 官網查證：一、三、四、五 08:00–18:00，二休館，六日 10:00–18:00；售票至閉館前 30 分。本行程 10/30 是週五，適用 08:00–18:00。週四免費入場。',
  },
  'poznan-ck-zamek': {
    name: '波茲南 · 帝王城堡 CK ZAMEK', closedWeekdays: [], opens: '12:00', closes: '19:00', lastEntry: '18:00',
    checkedAt: '2026-09-17', sourceRef: "fares['波茲南 · 帝王城堡'].note",
    officialUrl: 'https://ckzamek.pl/podstrony/6071-zwiedzanie-zamku/',
    note: '2026-09-17 官網查證：一–日 12:00–19:00，售票至 18:00（語音導覽機同樣 18:00 前發放、19:00 前歸還）。',
  },
  'wroclaw-zoo': {
    name: '樂斯拉夫 · Afrykarium／動物園', closedWeekdays: [], opens: '09:00', closes: '18:00', lastEntry: '17:00',
    checkedAt: '2026-09-17', sourceRef: "fares['樂斯拉夫 · Afrykarium／動物園'].note",
    officialUrl: 'https://zoo.wroclaw.pl/en/prices/',
    note: '2026-09-17 官網查證：09:00–18:00、最後入場 17:00。',
  },
};
