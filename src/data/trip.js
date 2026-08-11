// trip.js — 行程資料源頭：meta、flights、days×8、stay、trains、bookingTiers、reservations
// 來源：redesign/data.js（原 window.TRIP 物件字面值），轉為 ES module 具名匯出。
// 2026-08-09 依景點、博物館與交通營運單位公開資料重新盤查。
// 尚未開賣的 10 月火車與短期資料明確標為待確認，不用歷史班次作為確定時刻。

export const meta = {
  code: 'POLSKA',
  edition: '2026 Poland Field Plan',
  dateRange: '2026 / 10 / 24 — 10 / 31',
  tripStart: '2026-10-24',
  tripEnd: '2026-10-31',
  timeZone: 'Europe/Warsaw',
  nights: 7, days: 8,
  cities: ['Warszawa', 'Kraków', 'Wrocław', 'Poznań'],
  route: '華沙 → 克拉科夫 → 樂斯拉夫 → 波茲南 → 華沙',
  highestRiskDays: ['Day 5 樂斯拉夫全景點 + 晚轉場', 'Day 7 三館連看'],
  flights: '國泰 + 卡達 + 長榮聯運',
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
    eat: ['Pierogi @ Zapiecek', 'Wedel 熱巧克力 @ E. Wedel Pijalnia'],
    backup: [
      {label:'下雨備案', where:'科學文化宮 30F 觀景台', why:'PLN 30／優待 25 · 室內 + 360° 城景，老城廣場走路 12 分'},
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
    headline: '目標抓早班直達車；實際車次待 PKP 開賣',
    tag: 'Transit',
    intensity: '高',
    hardConstraints: ['需搭約 09:00 的華沙 → 克拉科夫直達車', '辛德勒工廠 17:30 入場（最後入場 18:30）', '午餐與 Check-in 不能拖太久'],
    mustBook: ['❗尚未訂 · 華沙 → 克拉科夫火車', '✅ 可立即查／購 · 辛德勒工廠 17:30 時段票'],
    compressible: ['聖瑪利亞教堂內部參觀', '紡織會館購物時間'],
    weather: '尚無可靠預報；出發前 7–10 天更新',
    train: {type:'EIP／IC', from:'WAW', to:'KRK', dep:'目標 09:00', arr:'約 11:25', dur:'約 2h25', price:'待 PKP 開賣'},
    steps: [
      {t:'約 09:00', label:'華沙 → 克拉科夫直達車', sub:'EIP／IC 皆可；班次、車種與餐飲服務待 PKP 開賣確認', cost:'待開賣', dur:'約 2h25'},
      {t:'約 11:25', label:'抵 Kraków Główny', dur:'10 min 拖行李'},
      {t:'11:40', label:'旅館寄放行李', sub:'ibis budget Krakow Stare Miasto 在 Pawia 11，緊鄰車站；未到 Check-in 時間先寄行李', dur:'20 min'},
      {t:'12:00', label:'車站周邊午餐', sub:'10/25 為非營業週日，先確認店家當日營業；用餐後步行約 25–30 分到 Wawel', cost:'PLN 40–60', dur:'30 min'},
      {t:'13:00', label:'★ 瓦維爾大教堂', sub:'週日 12:30–17:00；Cathedral Museum 週日不開', cost:'PLN 26／18', dur:'45 min'},
      {t:'14:00', label:'★ Wawel 城堡一、二樓完整路線', sub:'09:00–17:00 · 完整路線最後入場 15:00', cost:'PLN 95／71', dur:'2 h'},
      {t:'16:00', label:'★ 中央廣場 + 聖瑪利亞', sub:'整點 Hejnał 號角。週日聖殿內部 14:00–18:00、登塔 13:00–17:30，各 20 PLN 分開計；塔票只在 Mariacki 廣場 7 號當日現場售票、無法預約，入口在 Floriańska 街', cost:'PLN 20 內部／20 登塔', dur:'45 min'},
      {t:'16:45', label:'紡織會館 Sukiennice 快速一覽', sub:'採購留到 10/27', cost:'免費入場', dur:'15 min'},
      {t:'17:00', label:'電車 50 / 24 到 Plac Bohaterów Getta', dur:'15 min'},
      {t:'17:30', label:'★ 辛德勒工廠', sub:'週日最後入場 18:30 · mhk.pl/en 預約', cost:'PLN 60 · 優待 45', dur:'2 h'},
      {t:'19:45', label:'★ Kazimierz Plac Nowy zapiekanka 晚餐', sub:'Endzior / Krzysiek', cost:'PLN 18–25'},
    ],
    eat: ['Obwarzanek 圓圈麵包 (PGI)', 'Zapiekanka @ Plac Nowy 圓亭', 'Klezmer-Hois 猶太料理'],
    warn: '❗瓦維爾城堡尚未訂票；辛德勒工廠個人網路票在參觀日前 90 天 09:00 開放，10/25 已可在官方售票頁查／購。瓦維爾大教堂週日 12:30–17:00；城堡完整路線 95／71 PLN、最後入場 15:00；辛德勒工廠週二至週日 09:00–20:00、最後入場 18:30，17:30 屬可行時段。10/25 為非營業週日，多數一般商店關閉；餐廳等法定例外是否營業仍以店家公告為準。',
    backup: [
      {label:'辛德勒 17:30 滿場', where:'改訂 18:30 最後入場，或往前壓到下午較早時段（如 14:00）', why:'最後入場其實是 18:30，比原記錄多一小時可調度；mhk.pl/en 開放預約後立即下單'},
      {label:'雨天替代 Wawel', where:'地下市集博物館 Rynek Underground', why:'廣場下方歷史展，PLN 45／35；週日 10:00–19:00，最後入場 17:45'},
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
    mustBook: ['❗需查／購 · Auschwitz 官方英文導覽（指定場次庫存以官方系統為準）'],
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
    headline: '目標 19:30 左右直達車；待 PKP 開賣',
    tag: 'Transit',
    intensity: '高',
    hardConstraints: ['早上完成 Wieliczka 鹽礦', '目標班次前 45–60 分鐘取行李並前往 Kraków Główny', '城際車次待 PKP 開賣確認'],
    mustBook: ['❗尚未訂 · Wieliczka 鹽礦英文團', '❗尚未訂 · 克拉科夫 → 樂斯拉夫火車'],
    compressible: ['Kazimierz 白天散步', '紡織會館採購'],
    weather: '尚無可靠預報；出發前 7–10 天更新',
    train: {type:'IC', from:'KRK', to:'WRO', dep:'目標 19:30', arr:'約 22:20', dur:'約 2h50', price:'待 PKP 開賣'},
    steps: [
      {t:'08:00', label:'早餐 + 退房', sub:'行李寄旅館'},
      {t:'09:00', label:'火車到 Wieliczka Rynek-Kopalnia', sub:'KMŁ；用 70 分鐘 KMK+KMŁ 聯票或依當日售票頁', cost:'PLN 10（70 分聯票）', dur:'約 25 min'},
      {t:'10:00', label:'★ Wieliczka 鹽礦 Tourist Route 英文團', sub:'3.5 km · 135m 深 · St. Kinga 鹽教堂', cost:'依 10/27 官方日期選擇器', dur:'2–3 h'},
      {t:'13:00', label:'Wieliczka 鎮中心午餐', cost:'PLN 40–60', dur:'30 min'},
      {t:'13:30', label:'火車回 Kraków Główny', cost:'PLN 10（70 分聯票）', dur:'約 25 min'},
      {t:'14:30', label:'★ Kazimierz 白天散步', sub:'舊猶太會堂 · Szeroka 街 · 《辛德勒名單》場景', cost:'免費', dur:'1.5 h'},
      {t:'16:00', label:'紡織會館 Sukiennice 採購收尾', sub:'琥珀、刺繡、Wedel 巧克力', dur:'45 min'},
      {t:'17:00', label:'自由活動或補拍照、找地方喝咖啡', sub:'確定 PKP 班次後再決定可用時間', dur:'1 h'},
      {t:'18:00', label:'旅館取行李 → Bolt 到 Kraków Główny', cost:'PLN 15'},
      {t:'目標 19:30', label:'IC 直達車', sub:'實際班次待 PKP 開賣', cost:'待開賣', dur:'約 2h50'},
      {t:'約 22:20', label:'抵 Wrocław Główny'},
    ],
    eat: ['鹽礦 125m 地下餐廳 Karczma Górnicza', 'Sernik @ Cukiernia Michałek', 'Pierożki u Vincenta（Kazimierz）'],
    warn: '❗鹽礦與城際火車皆尚未訂。鹽礦官方通用頁僅列票價「從 131 PLN」；10/27 英文場、實際票價與庫存必須在官方日期選擇器確認。克拉科夫 → 樂斯拉夫的 19:30 目前只是規劃目標，不是已確認時刻；PKP 開賣後須依 10/27 實際直達班次重排。',
    backup: [
      {label:'鹽礦客滿或超時', where:'先查當日英文場與 PKP 實際班次再調整', why:'10/27 城際班表尚未確定，不能先假定末班車或緩衝時間'},
      {label:'雨天備案', where:'鹽礦本身就在地下 135m', why:'地下約 17–18°C、防雨遮陽最佳備案'},
      {label:'想留更多 Kazimierz 時間', where:'PKP 班次確定後，才延伸散步或咖啡時間', why:'取行李與進站預留 45–60 分鐘，不先把目標車次當已購票'},
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
    headline: '目標 19:00 左右直達車；待 PKP 開賣',
    tag: 'Transit',
    intensity: '很高',
    hardConstraints: ['早餐後早出門', '百年廳距離老城較遠需抓交通', '座堂島點燈人無對外保證的固定出發分鐘，日落前到場等候', '城際車次待 PKP 開賣確認'],
    mustBook: ['❗尚未訂 · 樂斯拉夫 → 波茲南火車', '❗尚未訂 · 拉茨瓦維採全景畫場次'],
    compressible: ['百年廳停留縮短為外觀與周邊', '座堂島改 45–60 分鐘重點散步', '午餐改簡餐或外帶'],
    weather: '尚無可靠預報；出發前 7–10 天更新',
    train: {type:'IC', from:'WRO', to:'POZ', dep:'目標 19:00', arr:'約 21:20', dur:'約 2h20', price:'待 PKP 開賣'},
    steps: [
      {t:'09:00', label:'★ 中央廣場 + 紡織會館', sub:'dwarfsmap.com 找小矮人', cost:'免費', dur:'1.5 h'},
      {t:'10:30', label:'糖果屋雙屋 + 教堂塔樓', sub:'聖伊莉莎白教堂塔高 96m、觀景台 75m、304 階無電梯；一–六 10:00–19:00', cost:'PLN 16／10 · 現金', dur:'45 min'},
      {t:'11:30', label:'★ 拉茨瓦維採全景畫', sub:'30 分鐘導覽', cost:'PLN 50', dur:'1 h'},
      {t:'13:30', label:'★ 百年廳 (UNESCO)', sub:'先以官方 availability calendar 確認 10/28 是否可參觀內部；未確認前以外觀、噴泉與日本花園規劃', cost:'外觀免費', dur:'1 h'},
      {t:'16:15', label:'★ 座堂島煤氣燈', sub:'日落約 16:34；點燈人無固定公開出發分鐘，在島上等候與散步', cost:'免費', dur:'1 h'},
      {t:'17:15', label:'取行李 → Wrocław Główny', sub:'座堂島 → 旅館約 25–30 分，取行李後再往車站；距目標發車 1h45，抵站後約 45–60 分鐘緩衝', dur:'約 1 h'},
      {t:'目標 19:00', label:'IC 直達車', sub:'實際班次待 PKP 開賣', cost:'待開賣', dur:'約 2h20'},
    ],
    eat: ['Śląskie kluski @ Konspira', 'Browar Stu Mostów 精釀'],
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
    headline: '目標 17:30 左右直達車；待 PKP 開賣',
    tag: 'Transit',
    intensity: '中高',
    hardConstraints: ['11:45 前抵達老城廣場卡位', '12:00 山羊鐘樓秀', '城際車次待 PKP 開賣確認'],
    mustBook: ['❗尚未訂 · 波茲南 → 華沙火車', '牛角麵包博物館場次（僅雨天備案才需要，主行程走的是 Kandulski 烘焙坊）'],
    compressible: ['Stary Browar 停留時間', '帝王城堡內部參觀'],
    weather: '尚無可靠預報；出發前 7–10 天更新',
    train: {type:'EIP／IC', from:'POZ', to:'WAW', dep:'目標 17:30', arr:'約 19:50', dur:'約 2h20', price:'待 PKP 開賣'},
    steps: [
      {t:'09:00', label:'★ 教堂島 Ostrów Tumski', sub:'梅什科一世受洗地', cost:'未收費', dur:'1.5 h'},
      {t:'11:00', label:'廣場卡正面位置', dur:'45 min · 提早卡位'},
      {t:'12:00', label:'★ 山羊鐘樓秀', sub:'官方固定正午登場，兩隻金屬山羊互頂 12 次', cost:'免費', dur:'5 min'},
      {t:'12:15', label:'★ 聖馬丁牛角麵包 (PGI)', sub:'Cukiernia Kandulski；出發前確認分店、當日營業與 PGI 證書', cost:'依門市標價', dur:'15 min'},
      {t:'14:00', label:'帝王城堡 / Stary Browar', sub:'帝王城堡室內展覽依當日公告；可借語音導覽 10 PLN', cost:'依當日展覽／導覽', dur:'2 h'},
      {t:'目標 17:30', label:'波茲南 → 華沙直達車', sub:'EIP／IC 依實際班表', cost:'待開賣', dur:'約 2h20'},
      {t:'約 19:50', label:'抵華沙中央車站'},
    ],
    eat: ['Rogal Świętomarciński (PGI) ⭐', 'Pyry z gzikiem @ Pyra Bar'],
    backup: [
      {label:'雨天想看山羊鐘', where:'可頌博物館官方售票頁', why:'週四英語場、價格與庫存都須依 10/29 官方售票系統確認；未確認前改以 Stary Browar 或帝王城堡為室內備案'},
      {label:'雨天備案', where:'Stary Browar 商場 + 帝王城堡內部', why:'兩處步行 10 分相連，全程室內可消磨 3 h'},
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
    compressible: ['POLIN 看主展重點', '起義博物館抓核心展區', '皇家城堡控制在 60–90 分鐘'],
    weather: '尚無可靠預報；出發前 7–10 天更新',
    steps: [
      {t:'10:00', label:'★ 皇家城堡', sub:'二–日 10:00–18:00、末入 17:00；Castle Route 95／75 含語音導覽，官方標示約 150 分', cost:'PLN 95／75', dur:'約 150 min'},
      {t:'12:15', label:'午餐（老城 → POLIN 路上）', sub:'選當日有營業且可訂位的店', cost:'依餐廳', dur:'45 min'},
      {t:'13:15', label:'★ POLIN 猶太博物館', sub:'週五 10:00–18:00；主展最晚 16:00 入場', cost:'依官方售票頁', dur:'2 h'},
      {t:'16:00', label:'★ 華沙起義博物館', sub:'35／30 PLN；以官方票頁 10/30 可售時段為準', cost:'PLN 35／30', dur:'2 h'},
      {t:'19:30', label:'老城最後晚餐', sub:'U Fukiera / Polka', cost:'PLN 120–200', dur:'1.5 h'},
      {t:'21:00', label:'老城廣場夜燈漫步', sub:'自由收尾'},
    ],
    eat: ['Żurek 酸黑麥湯 @ U Fukiera', 'Pączki @ A. Blikle 1869'],
    warn: '❗四項皆尚未訂。皇家城堡已由官方確認二–日 10:00–18:00、最後入場 17:00，因此原本排 17:00 的版本不可行，已改成 10:00 第一站。POLIN 週五 10:00–18:00，主展最後入場為閉館前 2 小時。起義博物館票價 35／30，個人免費日為週一（非週四，官方公告）；10/30 是週五，照常收費，實際可售時段仍以官方票頁為準。蕭邦博物館 2026 整修資訊則須在出發前再核對官方公告。',
    extend: [
      {label:'Bulwary Wiślane 維斯瓦河畔', when:'21:00 後老城散步延伸', why:'河濱步道 + 沙灘酒吧，皇家城堡步行 10–15 分，適合晚餐後收尾散步，免費'},
      {label:'Neon Museum 霓虹燈博物館', when:'若提前結束起義博物館可插入', why:'已遷入科學文化宮 4 樓（Marszałkowska 入口），共產時期霓虹招牌收藏，PLN 25／優待 18，可與觀景台一起看'},
      {label:'Praga 區塗鴉與 Koneser 舊釀酒廠', when:'午餐後彈性時段', why:'起義博物館到皇家城堡之間若時間寬裕，可繞道河對岸 Praga 感受工業改造街區，步行或電車皆可'},
      {label:'科學文化宮 30F 觀景台夜景版', when:'起義博物館後、晚餐前', why:'PLN 30／25；一般售票資訊至 20:00，是否有晚間特別時段仍看當日公告'},
    ],
    backup: [
      {label:'三館太累', where:'保留已訂時段，POLIN 與起義擇一深看', why:'兩館內容都沉重；不要犧牲已確認的皇家城堡上午時段'},
      {label:'天氣轉壞', where:'科學文化宮 30 樓觀景台（室內）', why:'PLN 30／優待 25 · 45 min · 直通老城地鐵，雨天備案'},
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
    {code:'CX 479',  leg:'TPE → HKG', when:'10/23 五 21:05 → 23:05', dur:'2h00m'},
    {code:'⇄ HKG',   leg:'轉機',       when:'2h20m', dur:'', layover:true},
    {code:'QR 815',  leg:'HKG → DOH', when:'10/24 六 01:25 → 04:50', dur:'8h25m'},
    {code:'⇄ DOH',   leg:'轉機',       when:'3h40m', dur:'', layover:true},
    {code:'QR 259',  leg:'DOH → WAW', when:'10/24 六 08:30 → 13:30', dur:'6h00m'},
  ],
  back: [
    {code:'QR 260',  leg:'WAW → DOH', when:'10/31 六 14:40 → 22:10', dur:'5h30m'},
    {code:'⇄ DOH',   leg:'轉機',       when:'3h55m', dur:'', layover:true},
    {code:'QR 818',  leg:'DOH → HKG', when:'11/1 日 02:05 → 14:50', dur:'7h45m'},
    {code:'⇄ HKG',   leg:'轉機',       when:'4h50m', dur:'', layover:true},
    {code:'BR 872',  leg:'HKG → TPE', when:'11/1 日 19:40 → 21:25', dur:'1h45m'},
  ],
};

export const stay = [
  {
    id:'warsaw-reduta', city:'華沙', en:'Warszawa', name:'ibis budget Warszawa Reduta',
    officialName:'ibis budget Warszawa West Station', checkIn:'2026-10-24', checkOut:'2026-10-25', nights:1,
    address:'ul. Bitwy Warszawskiej 16 A, 02-366 Warszawa', addressVerified:true, rooms:1, status:'已確認',
    officialUrl:'https://all.accor.com/hotel/7148/index.pl.shtml',
    note:'訂單仍使用 Reduta 舊名；Accor 官網目前改稱 Warszawa West Station，為同一地址。',
  },
  {
    id:'krakow-stare-miasto', city:'克拉科夫', en:'Kraków', name:'ibis budget Krakow Stare Miasto',
    checkIn:'2026-10-25', checkOut:'2026-10-27', nights:2,
    address:'ul. Pawia 11, 31-154 Kraków', addressVerified:true, rooms:1, status:'已確認',
    officialUrl:'https://all.accor.com/hotel/7165/index.en.shtml',
    note:'位於 Kraków Główny 與 Galeria Krakowska 旁。',
  },
  {
    id:'wroclaw-piast', city:'樂斯拉夫', en:'Wrocław', name:'Piast',
    checkIn:'2026-10-27', checkOut:'2026-10-28', checkInTime:'14:00', checkOutTime:'12:00', nights:1,
    address:'完整地址待飯店第一方確認', addressVerified:false, rooms:1, status:'已確認',
    officialUrl:'https://piastwroclaw.pl/',
    note:'住宿訂單已確認；飯店官網目前未正常顯示完整地址，出發前須用訂房確認或直接向飯店核對。',
  },
  {
    id:'poznan-towarowa', city:'波茲南', en:'Poznań', name:'Poznan Apartments Towarowa',
    checkIn:'2026-10-28', checkOut:'2026-10-29', checkInTime:'15:00', checkOutTime:'11:00', nights:1,
    address:'Towarowa 37/201, 61-896 Poznań', addressVerified:true, rooms:1, status:'已確認',
    officialUrl:'https://www.poznanapartments.com/kontakt',
    note:'此處為官方接待與取鑰匙地址；實際公寓門牌以私人訂房確認為準。',
  },
  {
    id:'warsaw-metropol', city:'華沙', en:'Warszawa', name:'Hotel Metropol',
    checkIn:'2026-10-29', checkOut:'2026-10-31', nights:2,
    address:'ul. Marszałkowska 99a, 00-693 Warszawa', addressVerified:true, rooms:1, status:'已確認',
    officialUrl:'https://www.hotelmetropol.com.pl/pl/',
    note:'位於 Metro Centrum 附近，步行可達 Warszawa Centralna。',
  },
];

export const trains = [
  {seg:'WAW → KRK', date:'10/25', type:'EIP', dep:'目標 09:00', arr:'約 11:25', dur:'約 2h25', price:'待開賣', status:'尚未確認班次'},
  {seg:'Kraków MDA ⇄ Muzeum Auschwitz', date:'10/26', type:'BUS · Lajkonik', leg:'現行班表參考', dep:'參考 07:10', arr:'參考 16:55 回抵', dur:'單程約 1h25', price:'待業者開放 10/26 售票', status:'指定日尚未確認'},
  {seg:'KRK → WRO', date:'10/27', type:'IC', dep:'目標 19:30', arr:'約 22:20', dur:'約 2h50', price:'待開賣', status:'尚未確認班次'},
  {seg:'WRO → POZ', date:'10/28', type:'IC', dep:'目標 19:00', arr:'約 21:20', dur:'約 2h20', price:'待開賣', status:'尚未確認班次'},
  {seg:'POZ → WAW', date:'10/29', type:'EIP', dep:'目標 17:30', arr:'約 19:50', dur:'約 2h20', price:'待開賣', status:'尚未確認班次'},
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
    detail: '在 Passenger Portal 輸入出發站、抵達站、日期與目標時間，勾選 Direct connections。四段依序使用 Warszawa Centralna、Kraków Główny、Wrocław Główny、Poznań Główny。',
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
    {name:'華沙 → 克拉科夫火車', url:'https://www.intercity.pl/en/'},
    {name:'克拉科夫 → 樂斯拉夫火車', url:'https://www.intercity.pl/en/'},
    {name:'樂斯拉夫 → 波茲南火車', url:'https://www.intercity.pl/en/'},
    {name:'波茲南 → 華沙火車', url:'https://www.intercity.pl/en/'},
  ]},
  {tier:'第二優先', note:'❗全部尚未訂 · 辛德勒工廠現已可查／購，其餘依官方售票頁', items:[
    {name:'辛德勒工廠（10/25 已進個人網路票 90 天窗口；最後入場 18:30）', url:'https://muzeumkrakowa.pl/en/branches/oskar-schindlers-enamel-factory'},
    {name:'POLIN 波蘭猶太人歷史博物館', url:'https://polin.pl/en'},
    {name:'華沙起義博物館', url:'https://www.1944.pl/en'},
    {name:'皇家城堡（已查證二至日 10:00–18:00，末入 17:00）', url:'https://www.zamek-krolewski.pl/en'},
    {name:'牛角麵包博物館（僅雨天備案需要）', url:'https://rogalowemuzeum.pl/en/'},
    {name:'拉茨瓦維採全景畫', url:'https://mnwr.pl/en/category/branches/panorama-raclawicka/'},
  ]},
  {tier:'餐廳與備案', note:'❗全部尚未訂 · 旅行品質加分', items:[
    {name:'克拉科夫 Kazimierz 晚餐', url:'https://www.google.com/maps/search/?api=1&query=Kazimierz+Krakow+restaurants'},
    {name:'華沙最後晚餐', url:'https://www.google.com/maps/search/?api=1&query=Warsaw+old+town+Polish+restaurant'},
    {name:'樂斯拉夫午餐或晚餐', url:'https://www.google.com/maps/search/?api=1&query=Wroclaw+old+town+Polish+restaurant'},
    {name:'波茲南老城午餐', url:'https://www.google.com/maps/search/?api=1&query=Poznan+old+town+restaurant'},
  ]},
];

export const todoGroups = [
  {
    id: 'rail', title: '城際交通', eyebrow: 'Rail · 4 項',
    intro: '四段都是行程銜接目標，尚未開賣或完成購票前，不把規劃時刻當成已確認班次。',
    items: [
      {date:'10/25', name:'華沙 → 克拉科夫火車', status:'尚未開賣／確認', action:'在 PKP Intercity 顯示實際車次後，確認車廂、座位與轉乘保障。', url:'https://www.intercity.pl/en/'},
      {date:'10/27', name:'克拉科夫 → 樂斯拉夫火車', status:'尚未開賣／確認', action:'依實際直達班次重排晚間抵達與住宿接駁。', url:'https://www.intercity.pl/en/'},
      {date:'10/28', name:'樂斯拉夫 → 波茲南火車', status:'尚未開賣／確認', action:'確認發車時刻、月台與座位後更新當日轉場。', url:'https://www.intercity.pl/en/'},
      {date:'10/29', name:'波茲南 → 華沙火車', status:'尚未開賣／確認', action:'確認抵達華沙時間，保留晚餐與入住緩衝。', url:'https://www.intercity.pl/en/'},
    ],
  },
  {
    id: 'attractions', title: '主要景點', eyebrow: 'Tickets · 7 項',
    intro: '指定日期的場次與庫存會變動；付款完成後請下載離線票券並核對入場時間。',
    items: [
      {date:'10/25', name:'辛德勒工廠 17:30', status:'現可查／購', action:'10/25 已進個人網路票 90 天窗口；以官方售票頁的可售時段為準。', url:'https://muzeumkrakowa.pl/en/branches/oskar-schindlers-enamel-factory'},
      {date:'10/26', name:'Auschwitz 英文官方導覽', status:'需查／購', action:'只能線上取得入場證；選擇官方系統提供的英文導覽場次。', url:'https://visit.auschwitz.org/'},
      {date:'10/27', name:'Wieliczka 鹽礦英文團', status:'需查／購', action:'在官方日期選擇器確認英文場、票價與庫存。', url:'https://www.wieliczka-saltmine.com/'},
      {date:'10/28', name:'拉茨瓦維採全景畫', status:'尚未訂', action:'以官方售票頁確認指定入場時段。', url:'https://mnwr.pl/en/category/branches/panorama-raclawicka/'},
      {date:'10/30', name:'華沙皇家城堡 10:00', status:'尚未訂', action:'選擇 10:00 入場，並保留安檢與離館移動時間。', url:'https://www.zamek-krolewski.pl/en'},
      {date:'10/30', name:'POLIN 猶太人歷史博物館 13:15', status:'尚未訂', action:'依官方售票頁的指定日庫存選擇 13:15 左右時段（主展最後入場 16:00）。', url:'https://polin.pl/en'},
      {date:'10/30', name:'華沙起義博物館 16:00', status:'尚未訂', action:'依官方票頁可售時段確認，避免與前一館離館時間衝突。', url:'https://www.1944.pl/en'},
    ],
  },
  {
    id: 'venue-status', title: '場館開放狀態', eyebrow: 'Status · 1 項',
    intro: '不需購票，但會決定當天走不走得成；未確認前主行程只排外觀與周邊。',
    items: [
      {date:'10/28', name:'百年廳 10/28 內部參觀狀態', status:'待官方日曆確認', action:'上 halastulecia.pl 的 availability calendar 查 10/28 圓頂展廳是否開放；2026-08-09 盤查時官方公開頁既無法證實關閉、也無法證實開放。行前 3–5 天再複查一次。', url:'https://halastulecia.pl/zwiedzanie/visitor-centre/'},
    ],
  },
  {
    id: 'dining', title: '餐飲訂位', eyebrow: 'Dining · 1 項',
    intro: '餐廳營業與臨時包場以店家訂位頁公告為準。',
    items: [
      {date:'10/30', name:'華沙最後晚餐', status:'尚未訂位', action:'先依當天落腳區域選定店家，再以店家官網或訂位頁完成預約。', url:null},
    ],
  },
  {
    id: 'rainy-day', title: '雨天備案', eyebrow: 'Backup · 1 項',
    intro: '天氣不影響主行程時不必購買。',
    items: [
      {date:'10/29', name:'波茲南牛角麵包博物館場次', status:'僅雨天需要', action:'若雨勢影響老城散步，再以官方售票頁選擇合適場次。', url:'https://rogalowemuzeum.pl/en/'},
    ],
  },
];

export const reservations = [
  {when:'❗現在就查／訂（最急）', what:'Auschwitz 英文官方導覽 — 所有入場證僅能在線上取得，10/26 的指定場次庫存與價格以 visit.auschwitz.org 為準，入口不售票。'},
  {when:'❗現在就查／訂', what:'Wieliczka 鹽礦英文 Tourist Route 10:00 場 — 10/27 英文場、實際票價與庫存以官方日期選擇器為準；不要用舊價格或開賣週期取代訂票結果。'},
  {when:'現在可訂', what:'皇家城堡 — 已查證二至日 10:00–18:00、最後入場 17:00；Day 7 已改為 10:00 第一站（zamek-krolewski.pl）'},
  {when:'現在可先訂', what:'米其林與熱門餐廳：Bottiglieria 1881（二星，最搶）、BABA / Most（樂斯拉夫僅停留一晚零彈性）、WANDAL、Pod Aniołami（TheFork / OpenTable / 餐廳官網）'},
  {when:'火車票：開賣即處理', what:'PKP Intercity 四段（WAW→KRK、KRK→WRO、WRO→POZ、POZ→WAW）尚未確認可售班次。官方未提供可套用本次日期的固定開賣承諾；請持續查看 bilet.intercity.pl 與 Passenger Portal，實際顯示可售後再更新時刻與票價。'},
  {when:'現在可查／訂', what:'辛德勒工廠 10/25 場次已進個人網路票 90 天窗口；POLIN、華沙起義博物館與皇家城堡均以官方售票頁顯示的指定日庫存為準。'},
  {when:'出發前 1 週', what:'把上述所有票價、特別閉館與開放時間再確認一次 — 本清單資料查證日為 2026-08-09，臨時活動與維修仍可能變動'},
  {when:'抵達當日', what:'隔日 Wawel 國家廳室現場票（限額制，售完只能改庭院）'},
];
