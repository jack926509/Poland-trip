// venues.js — 景點主檔（精煉切片 4a）。
//
// 這裡以前分四份平行表各存一次同一批景點事實：tickets.js 的 fares（票價與說明）、
// ticketsByCity（城市分組的行程摘要短句）、venueHours（給 tools/audit-schedule.mjs
// 用的結構化開放時間），以及 cities.js attractions[].priceNote（城市頁的自由文字）。
// 四份各自手key，改一個字要記得改四處，實際上常常漏改（見 data-audit.md §2-D）。
//
// 這裡先把 fares／venueHours 收斂成單一主檔；tickets.js 的三個 export 改成
// 由這裡推導，export 名稱與模板消費端暫不動。cities.js attractions 的收斂留給
// 切片 4b（那邊還要動 travel-database.js 的地址、day-maps.js 的圖釘）。
//
// 欄位：
//   id          venueHours 原本的 slug，穩定識別碼
//   cityKey     WAW／KRK／WRO／POZ
//   name        「城市 · 景點名」，與原 fares[].name 一致（維持 dist 輸出不變）
//   map         Google Maps 定位連結（原 fares[].mapUrl）
//   officialUrl 官方頁面
//   address     街道地址；4a 階段不整併地址（那是切片 4b 的範圍），先留 null
//   prices      { full, discount, note }——note 是原 fares[].note 的完整查證文字
//   hours       { opens, closes, lastEntry, closedWeekdays, checkedAt, sourceRef, note }
//               只在原本就有 venueHours 結構化資料的場館才有值，其餘留 null——
//               沒查到開放時間結構就是沒查到，不用常識補（沿用原 tickets.js 的方法論）
//   checkedAt   最近一次查證日；來源本身沒帶日期就是 null
//   quickNote   原 ticketsByCity 該筆的行程摘要短句；沒有對應項目就是 null
//
// 矛盾修正（見 data-audit.md §3）：
//   #11 辛德勒工廠：fares.note 已有 2026-09-18 官網查證的完整時段，但原本
//        venueHours 結構化欄位仍是 null——等於敘述說查過、結構卻沒填。兩邊同一
//        個來源，這裡把 hours.opens/closes 補上，不是另外猜測。
//   #12 Wawel 步驟對錯場館：trip.js Day 2「★ Wawel 城堡短路線」的文字描述是
//        「寶庫或地下路線」，但原本 constraint.venue 指向的是二樓代表廳
//        （krakow-wawel-castle，57／43、末入 16:10）；已在 trip.js 改指
//        krakow-wawel-treasury（47／35、末入 16:20），與步驟文字和 cost 一致。
//   #5 POLIN 公休日：cities.js 的 priceNote 寫「週二休」，但站內只查得到週五
//        時段、查無公休日的官方紀錄（見下方 warsaw-polin 的 hours.note）。兩邊
//        都沒有一份「官方公休日」的來源可引用，不屬於「報告已指明哪邊對」的情況；
//        依指示保留現狀（hours.closedWeekdays 留空，不猜週二），cities.js 那句
//        未經查證的「週二休」留到切片 4b 改用 venueId 渲染時一併拿掉。
//
// 新增 warsaw-polin、warsaw-rising-museum 兩筆：這兩個場館原本只存在於
// ticketsByCity 與 venueHours，fares／門票速查頁完全沒有這兩列，使用者在
// 門票速查頁看不到華沙這兩個景點的票價資訊。
export const venues = {
  'warsaw-royal-castle': {
    id: "warsaw-royal-castle", cityKey: "WAW", name: "華沙 · 皇家城堡",
    map: "https://www.google.com/maps/search/?api=1&query=%E8%8F%AF%E6%B2%99%20%E7%9A%87%E5%AE%B6%E5%9F%8E%E5%A0%A1",
    officialUrl: "https://www.zamek-krolewski.pl/en/strona/opening-hours-and-ticket-prices/2801-opening-hours-and-ticket-prices-may-2-2026",
    address: null,
    prices: { full: "60／95", discount: "45／75", note: "2026-08-11 官網查證：二–日 10:00–18:00、最後入場 17:00；Royal Route 60／45（約 60 分）、Castle Route 95／75（約 150 分，含語音導覽）；週三免費但只走限定路線、現場領票且數量有限，語音導覽另收 10" },
    hours: {
      opens: "10:00", closes: "18:00", lastEntry: "17:00",
      closedWeekdays: [1], checkedAt: "2026-08-11",
      sourceRef: "fares['華沙 · 皇家城堡'].note",
      note: "二–日 10:00–18:00、最後入場 17:00（二–日開放即代表週一休）。",
    },
    checkedAt: "2026-08-11",
    quickNote: "Royal Route 60／45、Castle Route 95／75 · 週三限定路線免費（2026-08-11 官網查證）",
    shortLabel: "皇家城堡",
  },
  'warsaw-pkin-terrace': {
    id: "warsaw-pkin-terrace", cityKey: "WAW", name: "華沙 · 科學文化宮觀景台",
    map: "https://www.google.com/maps/search/?api=1&query=%E8%8F%AF%E6%B2%99%20%E7%A7%91%E5%AD%B8%E6%96%87%E5%8C%96%E5%AE%AE%E8%A7%80%E6%99%AF%E5%8F%B0",
    officialUrl: "https://pkin.pl/taras-widokowy/o-tarasie-widokowym/",
    address: null,
    prices: { full: "30", discount: "25", note: "2026-09-18 官方售票系統（bilety.pkin.pl）查證：全票 30、優待 25 PLN（10 人以上團體全票 22）；線上票自購買日起 12 個月有效。每日 10:00–20:00、售票口同開放時間；不接受事前預約，現場售票最多可買到 7 天後的場次。觀景台在 30 樓、114 m，電梯 19 秒；夜間場（20:00–24:00、35 PLN、只收信用卡、僅大廳自動售票機販售）只在週五六且只到 9 月底，10 月不適用；11/1 閉館" },
    hours: {
      opens: "10:00", closes: "20:00", lastEntry: null,
      closedWeekdays: [], checkedAt: "2026-08-11",
      sourceRef: "fares['華沙 · 科學文化宮觀景台'].note",
      note: "每日 10:00–20:00；夜間場只在週五六且只到 9 月底，10 月不適用。",
    },
    checkedAt: "2026-08-11",
    quickNote: "PLN 30／25（2026-09-18 官方售票系統查證）· 每日 10:00–20:00、不接受預約，現場最多買到 7 天後 · 夜間場只到 9 月底，10 月不適用；11/1 閉館",
    shortLabel: "科學文化宮觀景台",
  },
  'warsaw-neon-museum': {
    id: "warsaw-neon-museum", cityKey: "WAW", name: "華沙 · Neon 霓虹博物館",
    map: "https://www.google.com/maps/search/?api=1&query=%E8%8F%AF%E6%B2%99%20Neon%20%E9%9C%93%E8%99%B9%E5%8D%9A%E7%89%A9%E9%A4%A8",
    officialUrl: "https://www.neonmuzeum.org/",
    address: null,
    prices: { full: "25", discount: "18", note: "科學文化宮 4 樓；一–四 11:00–18:00、五–六至 19:00、日 11:00–18:00" },
    hours: null,
    checkedAt: null,
    quickNote: null,
    shortLabel: null,
  },
  'warsaw-msn': {
    id: "warsaw-msn", cityKey: "WAW", name: "華沙 · MSN 當代美術館",
    map: "https://www.google.com/maps/search/?api=1&query=%E8%8F%AF%E6%B2%99%20MSN%20%E7%95%B6%E4%BB%A3%E7%BE%8E%E8%A1%93%E9%A4%A8",
    officialUrl: "https://artmuseum.pl/en/visit",
    address: null,
    prices: { full: "40", discount: "30", note: "二–四／六 11:00–19:00、五至 20:00、日至 18:00；18:00 後 25／15，Gallery A 免費" },
    hours: null,
    checkedAt: null,
    quickNote: "展覽 40／30 · 18:00 後 25／15 · Gallery A 免費",
    shortLabel: "MSN 現代藝術博物館",
  },
  'warsaw-history-museum': {
    id: "warsaw-history-museum", cityKey: "WAW", name: "華沙 · 波蘭歷史博物館",
    map: "https://www.google.com/maps/search/?api=1&query=%E8%8F%AF%E6%B2%99%20%E6%B3%A2%E8%98%AD%E6%AD%B7%E5%8F%B2%E5%8D%9A%E7%89%A9%E9%A4%A8%20Warszawa",
    officialUrl: "https://muzhp.pl/en/about-museum",
    address: null,
    prices: { full: "以官網", discount: "—", note: "華沙城堡區新館已於 2023 開館；常設展仍在建置，先查當期臨展" },
    hours: null,
    checkedAt: null,
    quickNote: null,
    shortLabel: null,
  },
  'warsaw-wedel-chocolate': {
    id: "warsaw-wedel-chocolate", cityKey: "WAW", name: "華沙 · E.Wedel 巧克力工廠博物館",
    map: "https://www.google.com/maps/search/?api=1&query=%E8%8F%AF%E6%B2%99%20E.Wedel%20Warszawa",
    officialUrl: "https://fabrykaczekolady.pl/en/",
    address: null,
    prices: { full: "70", discount: "55", note: "2026-09-18 官網英文版查證：導覽個人票全票 70、優待 55、家庭票 59／人（另有工作坊 95／80，工作坊票不含導覽）· al. Emila Wedla 5（近 Warszawa Wschodnia 站，入口在 Kamionkowskie 湖畔）· 一–日 10:00–20:00 · 導覽 90 分鐘、分組跟導覽員，官方要求準時 · 官網明列英語導覽場只在週一與週五，本行程唯一可用的是 10/30（五）· 官方建議線上購票；退票為導覽前 3 天、工作坊前 7 天" },
    hours: null,
    checkedAt: null,
    quickNote: "導覽個人票 70／55 · 每日 10:00–20:00、導覽 90 分 · 官網載英語場只在週一與週五，本行程只有 10/30（五）可用",
    shortLabel: "E.Wedel 巧克力工廠",
  },
  'krakow-wawel-treasury': {
    id: "krakow-wawel-treasury", cityKey: "KRK", name: "克拉科夫 · Wawel 王冠寶庫",
    map: "https://www.google.com/maps/search/?api=1&query=%E5%85%8B%E6%8B%89%E7%A7%91%E5%A4%AB%20Wawel%20%E7%8E%8B%E5%86%A0%E5%AF%B6%E5%BA%AB",
    officialUrl: "https://wawel.krakow.pl/",
    address: null,
    prices: { full: "47", discount: "35", note: "2026-09-17 官網查證（9–12 月）：二–日 09:00–17:00、最後入場為閉館前 40 分（約 16:20），47／35 PLN。皇家花園季節開放只到 10/4，10/25 票券不含花園。官網另載 10–12 月週一有限定路線的免費場、數量有限，10/25 是週日不適用，若要改排週一須先在官方售票頁確認" },
    hours: {
      opens: "09:00", closes: "17:00", lastEntry: "16:20",
      closedWeekdays: [1], checkedAt: "2026-09-17",
      sourceRef: "fares['克拉科夫 · Wawel 王冠寶庫'].note",
      note: "2026-09-17 官網 9–12 月規則：二–日 09:00–17:00，最後入場為閉館前 40 分（16:20）。",
    },
    checkedAt: "2026-09-17",
    quickNote: "PLN 47／35 · 末入場為閉館前 40 分 · 本行程 10/25 一小時空檔較適合這條",
    shortLabel: "瓦維爾王冠寶庫",
  },
  'krakow-wawel-castle': {
    id: "krakow-wawel-castle", cityKey: "KRK", name: "克拉科夫 · Wawel 城堡一、二樓",
    map: "https://www.google.com/maps/search/?api=1&query=%E5%85%8B%E6%8B%89%E7%A7%91%E5%A4%AB%20Wawel%20%E5%9F%8E%E5%A0%A1",
    officialUrl: "https://wawel.krakow.pl/en/what-to-see",
    address: null,
    prices: { full: "57", discount: "43", note: "2026-09-17 官網查證（9–12 月）：二–日 09:00–17:00、最後入場為閉館前 50 分（約 16:10）。官網此季分路線售票，「Castle 2nd floor（代表廳＋鄂圖曼土耳其帳篷）」57／43；同季另有 Castle Underground 47／35（含語音導覽）、Armoury 47／35。官網未列 95／71 的一、二樓整合套票，需要合併路線請以官方售票系統 bilety.wawel.krakow.pl 當日顯示為準" },
    hours: {
      opens: "09:00", closes: "17:00", lastEntry: "16:10",
      closedWeekdays: [1], checkedAt: "2026-09-17",
      sourceRef: "fares['克拉科夫 · Wawel 城堡一、二樓'].note",
      note: "2026-09-17 官網 9–12 月規則：二–日 09:00–17:00，Castle 2nd floor 最後入場為閉館前 50 分（16:10）。本行程採短路線，較有彈性。",
    },
    checkedAt: "2026-09-17",
    quickNote: "PLN 57／43 · 二–日 09:00–17:00、末入場為閉館前 50 分 · 官網 9–12 月分路線售票，沒有 95／71 的一、二樓套票",
    shortLabel: "瓦維爾城堡二樓代表廳",
  },
  'krakow-schindler': {
    id: "krakow-schindler", cityKey: "KRK", name: "克拉科夫 · 辛德勒工廠",
    map: "https://www.google.com/maps/search/?api=1&query=%E5%85%8B%E6%8B%89%E7%A7%91%E5%A4%AB%20%E8%BE%9B%E5%BE%B7%E5%8B%92%E5%B7%A5%E5%BB%A0",
    officialUrl: "https://muzeumkrakowa.pl/oddzialy/fabryka-emalia-oskara-schindlera",
    address: null,
    prices: { full: "60", discount: "45", note: "2026-09-18 克拉科夫博物館官網查證：ul. Lipowa 4 · 週一 10:00–15:00、二–日 09:00–20:00，每月第一個週二休館、最後入場為閉館前 90 分（10/25 是週日，09:00–20:00）· 全票 60 PLN（官網價目另列 Karta Kraków dla Rodziny 30／22.5，即全票與優待 45 的半價）· 英語個人導覽場二–日 10:00、12:00、16:00，英語固定導覽票 90／75 · 常設展線上票一律實名，入場須帶與購票同名的證件正本；線上開賣為參觀日前 90 天，團體票 08:00 起、個人票 09:00 起 · 週一免費入場（免費日不能預約、現場限量）· 官方近期休館日含 10/6、11/1、11/3、11/11，本行程日期不受影響" },
    hours: {
      opens: "09:00", closes: "20:00", lastEntry: "18:30",
      closedWeekdays: [], checkedAt: "2026-09-18",
      sourceRef: "prices.note（2026-09-18 克拉科夫博物館官網查證，與 hours 同一來源）",
      note: "2026-09-18 官網查證：二–日 09:00–20:00，最後入場為閉館前 90 分（18:30）；每月第一個週二休館（月頻率例外，非每週）。週一另外開放 10:00–15:00，本行程僅 10/25（週日）造訪，適用二–日時段。",
    },
    checkedAt: "2026-09-18",
    quickNote: "PLN 60／45 · 一 10:00–15:00、二–日 09:00–20:00，末入場為閉館前 90 分 · 線上票實名，入場要帶同名證件正本 · 英語導覽場二–日 10:00／12:00／16:00（90／75）· 週一免費、現場限量",
    shortLabel: "辛德勒工廠",
  },
  'krakow-wieliczka': {
    id: "krakow-wieliczka", cityKey: "KRK", name: "克拉科夫 · 維利奇卡鹽礦",
    map: "https://www.google.com/maps/search/?api=1&query=%E5%85%8B%E6%8B%89%E7%A7%91%E5%A4%AB%20%E7%B6%AD%E5%88%A9%E5%A5%87%E5%8D%A1%E9%B9%BD%E7%A4%A6%20Wieliczka",
    officialUrl: "https://www.wieliczka-saltmine.com/individual-tourist/useful-information/ticket-prices-and-visiting-hours",
    address: null,
    prices: { full: "日期選擇器", discount: "日期選擇器", note: "2026-09-18 官網複查：票價與場次頁只有 JavaScript 日期選擇器，靜態頁讀不到指定日數字，10/27 英語場的票價、時刻與庫存仍須在官網選日期確認（先前查得旅遊路線全票 143／優待 121）· 官方註記「非波蘭語與英語的導覽才強制事先線上購票」，英語場可現場購票但受庫存限制 · 官方唯一售票通道是 bilety.kopalnia.pl 與礦區售票口／售票機，官網聲明不與任何外部平台或中介合作 · 集合點 Szyb Daniłowicz（ul. Daniłowicza 10）官方 GPS 49.98348°N／20.05477°E · 全程約 2–3 小時、地下 17–18ºC、路線 3.5 km、下探 135 m、超過 800 級階梯" },
    hours: null,
    checkedAt: null,
    quickNote: "10/27 英文場、實際票價與庫存看官方日期選擇器（先前查得 143／121）· 只在 bilety.kopalnia.pl 與現場售票口購票，官方不與外部平台合作",
    shortLabel: "維利奇卡鹽礦",
  },
  'krakow-auschwitz': {
    id: "krakow-auschwitz", cityKey: "KRK", name: "克拉科夫 · 奧斯威辛",
    map: "https://www.google.com/maps/search/?api=1&query=%E5%85%8B%E6%8B%89%E7%A7%91%E5%A4%AB%20%E5%A5%A7%E6%96%AF%E5%A8%81%E8%BE%9B%20O%C5%9Bwi%C4%99cim",
    officialUrl: "https://www.auschwitz.org/en/visiting/guided-tours-for-individual-visitors/",
    address: null,
    prices: { full: "依訂票頁", discount: "依資格", note: "所有入場證僅能線上取得；10 月 07:30–16:00 只能跟官方導覽，16:00 後才有免費自導時段" },
    hours: null,
    checkedAt: null,
    quickNote: null,
    shortLabel: null,
  },
  'wroclaw-zoo': {
    id: "wroclaw-zoo", cityKey: "WRO", name: "樂斯拉夫 · Afrykarium／動物園",
    map: "https://www.google.com/maps/search/?api=1&query=%E6%A8%82%E6%96%AF%E6%8B%89%E5%A4%AB%20Afrykarium%EF%BC%8F%E5%8B%95%E7%89%A9%E5%9C%92",
    officialUrl: "https://zoo.wroclaw.pl/en/prices/",
    address: null,
    prices: { full: "線上 69 起／現場 99", discount: "線上 59 起／現場 89", note: "2026-09-17 官方票價頁查證：全票線上 69 zł 起、售票口 99 zł；優待票線上 59 zł 起、售票口 89 zł。採動態定價，「起」價會隨日期變動，指定日以官方售票頁為準 · 2026-09-19 官方開放時間複核：10 月一–四入園 09:00–16:00、館舍至 16:45、戶外與 Afrykarium 至 17:00；五–日及假日入園至 17:00、館舍至 17:45、戶外與 Afrykarium 至 18:00 · 入園票已含 Afrykarium，不需另購" },
    hours: {
      opens: "09:00", closes: "17:00", lastEntry: "16:00",
      closedWeekdays: [], checkedAt: "2026-09-19",
      sourceRef: "fares['樂斯拉夫 · Afrykarium／動物園'].note",
      note: "2026-09-19 官網查證：此處採旅程 10/28 週三適用時間，入園 09:00–16:00、館舍至 16:45、戶外與 Afrykarium 至 17:00；10 月五–日及假日則入園至 17:00、Afrykarium 至 18:00。",
    },
    checkedAt: "2026-09-19",
    quickNote: "全票線上 69 起／現場 99；優待線上 59 起／現場 89 · 10 月一–四末入 16:00、Afrykarium 至 17:00；五–日及假日末入 17:00、Afrykarium 至 18:00 · 已含 Afrykarium",
    shortLabel: "Afrykarium 動物園",
  },
  'wroclaw-panorama': {
    id: "wroclaw-panorama", cityKey: "WRO", name: "樂斯拉夫 · Panorama Racławicka",
    map: "https://www.google.com/maps/search/?api=1&query=%E6%A8%82%E6%96%AF%E6%8B%89%E5%A4%AB%20Panorama%20Rac%C5%82awicka",
    officialUrl: "https://mnwr.pl/",
    address: null,
    prices: { full: "50", discount: "35", note: "官網優待價已補上" },
    hours: null,
    checkedAt: null,
    quickNote: "PLN 50／35 · 每場 30 分鐘 · 10/28 指定時段庫存待確認",
    shortLabel: "拉茨瓦維採全景畫",
  },
  'wroclaw-hala-stulecia': {
    id: "wroclaw-hala-stulecia", cityKey: "WRO", name: "樂斯拉夫 · 百年廳 Visitor Centre",
    map: "https://www.google.com/maps/search/?api=1&query=%E6%A8%82%E6%96%AF%E6%8B%89%E5%A4%AB%20%E7%99%BE%E5%B9%B4%E5%BB%B3",
    officialUrl: "https://halastulecia.pl/zwiedzanie/visitor-centre/",
    address: null,
    prices: { full: "25", discount: "20", note: "2026-09-18 官網查證：夏季（4–10 月）二–日 10:00–18:00、冬季（11–3 月）二–日 10:00–17:00；多媒體展全票 25／優待 20、家庭票 45，加看百年廳內部（看台視角）為 30／25、家庭票 55。10 人以下散客不需預約，只有 10 人以上團體要事先訂位 · 內部開放依官方 availability calendar 分四色：綠＝展覽與廳內看台都可看、藍＝部分時段廳內不開放但展覽可看、黃＝不能進到圓頂正下方但展覽可看、紅＝展覽與廳內都關閉；10/28 是哪一色須在官網日曆當日確認" },
    hours: {
      opens: "10:00", closes: "18:00", lastEntry: null,
      closedWeekdays: [1], checkedAt: "2026-08-11",
      sourceRef: "fares['樂斯拉夫 · 百年廳 Visitor Centre'].note",
      note: "夏季（4–10 月）二–日 10:00–18:00、冬季（11–3 月）二–日 10:00–17:00；10 人以下散客不需預約。圓頂展廳內部依官方 availability calendar 逐日標四色（綠＝展覽＋廳內看台／藍＝部分時段廳內不開／黃＝不能進圓頂正下方／紅＝兩者皆不開）；2026-09-18 複查日曆仍以 JavaScript 逐日渲染，10/28 是哪一色仍待確認。",
    },
    checkedAt: "2026-08-11",
    quickNote: "Visitor Centre 25／20；含廳內 30／25 · 夏季（4–10 月）二–日 10:00–18:00 · 10 人以下不需預約 · 內部開放看官方日曆四色分級，10/28 當日確認",
    shortLabel: "百年廳 Hala Stulecia",
  },
  'wroclaw-hydropolis': {
    id: "wroclaw-hydropolis", cityKey: "WRO", name: "樂斯拉夫 · Hydropolis",
    map: "https://www.google.com/maps/search/?api=1&query=%E6%A8%82%E6%96%AF%E6%8B%89%E5%A4%AB%20Hydropolis",
    officialUrl: "https://bilety.hydropolis.pl/cennik.html?lang=en",
    address: null,
    prices: { full: "45", discount: "36", note: "2026-08-11 官網查證：週末及假日為 47／38 PLN；指定日期入場名額以官方售票頁為準" },
    hours: null,
    checkedAt: null,
    quickNote: null,
    shortLabel: null,
  },
  'wroclaw-kolejkowo': {
    id: "wroclaw-kolejkowo", cityKey: "WRO", name: "樂斯拉夫 · Kolejkowo",
    map: "https://www.google.com/maps/search/?api=1&query=%E6%A8%82%E6%96%AF%E6%8B%89%E5%A4%AB%20Kolejkowo",
    officialUrl: "https://kolejkowo.pl/wroclaw/en/price-list/",
    address: null,
    prices: { full: "線上 39 起／現場 55 起", discount: "線上 33 起／現場 45 起", note: "2026-08-12 官網查證：票價為起價，指定日期與線上庫存以官方售票頁為準 · Sky Tower 1 樓（Powstańców Śląskich 95）· 全年 365 天開放含非營業週日，每日 10:00 起、關門時間依官方日期日曆 · 參觀約 1.5 h" },
    hours: null,
    checkedAt: null,
    quickNote: null,
    shortLabel: null,
  },
  'poznan-palmiarnia': {
    id: "poznan-palmiarnia", cityKey: "POZ", name: "波茲南 · Palmiarnia 棕櫚屋",
    map: "https://www.google.com/maps/search/?api=1&query=%E6%B3%A2%E8%8C%B2%E5%8D%97%20Palmiarnia%20%E6%A3%95%E6%AB%9A%E5%B1%8B",
    officialUrl: "https://palmiarnia.poznan.pl/zwiedzanie/godziny-otwarcia/",
    address: null,
    prices: { full: "暫時閉館", discount: "—", note: "2026-09-18 再次複查，公告未變（原查證 2026-09-17）：整站首頁為「ZAMKNIĘCIE PALMIARNI」公告——因現代化與改建工程對外暫時閉館，官方只說重開與參觀方式會在官方管道公告（另指向 pim.poznan.pl），未給任何重開日期。本行程 10/29 不排入，也不再作為雨天室內備案；舊的 19／15 PLN 與二–五 09:00–17:00 規則已失效" },
    hours: {
      opens: null, closes: null, lastEntry: null,
      closedWeekdays: [], checkedAt: "2026-09-17",
      sourceRef: "fares['波茲南 · Palmiarnia 棕櫚屋'].note",
      note: "官網公告因現代化與改建工程暫時閉館，未公布重開日期；閉館期間沒有可比對的開放時間。",
    },
    checkedAt: "2026-09-17",
    quickNote: "官網公告改建暫時閉館、重開未定（2026-09-18 複查未變）——不要排入，也不要當雨天備案",
    shortLabel: "Palmiarnia 棕櫚屋",
  },
  'poznan-croissant-museum': {
    id: "poznan-croissant-museum", cityKey: "POZ", name: "波茲南 · 可頌博物館",
    map: "https://www.google.com/maps/search/?api=1&query=%E6%B3%A2%E8%8C%B2%E5%8D%97%20%E5%8F%AF%E9%A0%8C%E5%8D%9A%E7%89%A9%E9%A4%A8",
    officialUrl: "https://rogalowemuzeum.pl/en/buy-tickets/",
    address: null,
    prices: { full: "英語公開場 47", discount: "未滿 3 歲 1", note: "2026-09-17 官網查證：英語公開場 47 PLN／人（滿 3 歲起）、未滿 3 歲 1 PLN；2026-09-18 官方售票頁複查開放時間為日–五（Nd-Pt）11:00–15:30、六 11:00–17:00，官方註明這是第一場與最後一場「開演」時間，入口在 Klasztorna 23、售票口於開演前 15 分開放、館內約 50 人上限。10/29（週四）是否有英語場、開演時刻與庫存一律以官方售票頁當日顯示為準——不可預設 13:30 有場，未顯示日期也不等於售罄" },
    hours: null,
    checkedAt: null,
    quickNote: "英語公開場 47 PLN（滿 3 歲）／未滿 3 歲 1 PLN · 官網列日–五 11:00–15:30、六 11:00–17:00（第一場與最後一場開演時間）· 10/29 有無英語場與開演時刻看官方售票頁",
    shortLabel: "牛角麵包博物館",
  },
  'poznan-ck-zamek': {
    id: "poznan-ck-zamek", cityKey: "POZ", name: "波茲南 · 帝王城堡",
    map: "https://www.google.com/maps/search/?api=1&query=%E6%B3%A2%E8%8C%B2%E5%8D%97%20%E5%B8%9D%E7%8E%8B%E5%9F%8E%E5%A0%A1",
    officialUrl: "https://ckzamek.pl/podstrony/6071-zwiedzanie-zamku/",
    address: null,
    prices: { full: "地圖 10／語音導覽 20", discount: "地圖 7／語音導覽 15", note: "2026-09-17 官網查證：一–日 12:00–19:00、售票至 18:00；附地圖摺頁自行參觀 10／7 PLN，語音導覽 20／15 PLN，導覽機最晚 18:00 發放、19:00 前歸還（也可改用語音導覽存取碼，需自備手機與耳機）。這裡是 CK ZAMEK 文化中心而非宮殿博物館，可參觀空間仍依當日活動而定" },
    hours: {
      opens: "12:00", closes: "19:00", lastEntry: "18:00",
      closedWeekdays: [], checkedAt: "2026-09-17",
      sourceRef: "fares['波茲南 · 帝王城堡'].note",
      note: "2026-09-17 官網查證：一–日 12:00–19:00，售票至 18:00（語音導覽機同樣 18:00 前發放、19:00 前歸還）。",
    },
    checkedAt: "2026-09-17",
    quickNote: "一–日 12:00–19:00、售票至 18:00 · 地圖摺頁 10／7、語音導覽 20／15 · 導覽機 18:00 前發放、19:00 前歸還",
    shortLabel: "帝王城堡 CK ZAMEK",
  },
  'poznan-old-town-hall-museum': {
    id: "poznan-old-town-hall-museum", cityKey: "POZ", name: "波茲南 · 古市政廳博物館",
    map: "https://www.google.com/maps/search/?api=1&query=%E6%B3%A2%E8%8C%B2%E5%8D%97%20%E5%8F%A4%E5%B8%82%E6%94%BF%E5%BB%B3%E5%8D%9A%E7%89%A9%E9%A4%A8",
    officialUrl: "https://www.msu.mnp.art.pl/profile/wizyta-ratusz-muzeum-poznania",
    address: null,
    prices: { full: "閉館中", discount: "—", note: "整修中；官方預計 2027 年底至 2028 年初才全面重開" },
    hours: null,
    checkedAt: null,
    quickNote: "整修閉館；預計 2027 年底至 2028 年初全面重開",
    shortLabel: "古市政廳博物館",
  },
  'poznan-archaeological-museum': {
    id: "poznan-archaeological-museum", cityKey: "POZ", name: "波茲南 · 考古博物館",
    map: "https://www.google.com/maps/search/?api=1&query=%E6%B3%A2%E8%8C%B2%E5%8D%97%20%E8%80%83%E5%8F%A4%E5%8D%9A%E7%89%A9%E9%A4%A8",
    officialUrl: "https://nowa.muzarp.poznan.pl/pl/bilety",
    address: null,
    prices: { full: "15", discount: "10", note: "2026-09-18 官方票價頁查證：本館（Pałac Górków，ul. Wodna 27）常設展全票 15、優待 10、家庭票 40（最多 6 人）、10 人以上團體 10／人；與 Genius loci 考古保護區的聯票 25／15、家庭票 70。官方明列「每週二免費入場」——10/29 是週四不適用。學期季（9/1–6/30）開放時間二–四 09:00–16:00、五 10:00–17:00、六 11:00–18:00、日 12:00–16:00。2026-09-17 記錄的舊值 10／6 已確認過時，外傳的 15／10 與 25／15 則與官方一致" },
    hours: null,
    checkedAt: null,
    quickNote: "PLN 15／10（與 Genius loci 聯票 25／15）· 二–四 09:00–16:00、五 10:00–17:00、六 11:00–18:00、日 12:00–16:00 · 官方每週二免費，10/29 是週四不適用",
    shortLabel: "考古博物館",
  },
  'warsaw-polin': {
    id: "warsaw-polin", cityKey: "WAW", name: "華沙 · POLIN 猶太歷史博物館",
    map: "https://maps.google.com/?cid=16292574584610500784",
    officialUrl: "https://polin.pl/en",
    address: null,
    prices: { full: "依官方售票頁", discount: "—", note: "週五 10:00–18:00，主展最後入場為閉館前 2 小時。每週公休日站內尚無查證資料，行前須另行確認。" },
    hours: {
      opens: "10:00", closes: "18:00", lastEntry: "16:00",
      closedWeekdays: [], checkedAt: null,
      sourceRef: "ticketsByCity 華沙『POLIN 猶太歷史』與 Day 7 warn",
      note: "週五 10:00–18:00，主展最後入場為閉館前 2 小時。每週公休日站內尚無查證資料，行前須另行確認。",
    },
    checkedAt: null,
    quickNote: "週五 10:00–18:00；票價與指定日庫存看官方售票頁",
    shortLabel: "POLIN 猶太歷史",
  },
  'warsaw-rising-museum': {
    id: "warsaw-rising-museum", cityKey: "WAW", name: "華沙 · 華沙起義博物館",
    map: "https://maps.google.com/?cid=12215511195580548645",
    officialUrl: "https://www.1944.pl/en/article/visit-us,4993.html",
    address: null,
    prices: { full: "35", discount: "30", note: "2026-09-17 官網查證：一、三、四、五 08:00–18:00，二休館，六日 10:00–18:00；售票至閉館前 30 分。本行程 10/30 是週五，適用 08:00–18:00。週四免費入場。" },
    hours: {
      opens: "08:00", closes: "18:00", lastEntry: "17:30",
      closedWeekdays: [2], checkedAt: "2026-09-17",
      sourceRef: "官方 Visit us 頁（1944.pl），2026-09-17 查證",
      note: "2026-09-17 官網查證：一、三、四、五 08:00–18:00，二休館，六日 10:00–18:00；售票至閉館前 30 分。本行程 10/30 是週五，適用 08:00–18:00。週四免費入場。",
    },
    checkedAt: "2026-09-17",
    quickNote: "PLN 35／30 · 官方目前列週四免費；10/30（五）不適用",
    shortLabel: "華沙起義博物館",
  },
};

// ticketsByCity 裡 4 筆與景點主檔無關（永久閉館公告、現場售票的登塔票、
// 導覽本身的訂位狀態、無票價資料的地下市集博物館），不是「票價／開放時間」
// 事實，不勉強塞進上面的 venues 物件；tickets.js 組 ticketsByCity 時按城市
// 順序插入這裡對應的項目即可。
export const ticketsByCityExtras = {
  "chopinMuseum": [
    "蕭邦博物館",
    "2026 全年整修閉館（1/1–12/31），官方預告 2027 年 1 月配合蕭邦鋼琴大賽百年重開；期間售票處移至隔壁 Tamka 43 蕭邦研究所"
  ],
  "stMaryTower": [
    "聖瑪麗教堂登塔",
    "PLN 20／15 · 只在 Mariacki 廣場 7 號當日現場售票、無法預約 · 入口在 Floriańska 街"
  ],
  "auschwitzTour": [
    "奧斯威辛 Educator 導覽",
    "10/26 10:30 英文場已訂妥（約 3 小時 45 分，2 人）；10 月上午本來就必須跟團"
  ],
  "rynekUnderground": [
    "地下市集博物館",
    "PLN 45／35 · 末入為閉館前 75 分鐘 · 每週二免費（現場限量）· 每月第二個週一休"
  ]
};
