export const transitFares = [
  {city:'華沙 WTP', short:'20 分 3.40', min90:'75 分 4.40（第 1 區）／90 分 7（第 1+2 區）', hour24:'15（第 1 區）／26（第 1+2 區）', note:'電車／巴士／地鐵／SKM；蕭邦機場在第 1 區。2026-09-17 以官方 Ticket tariff 頁複核：90 分一、二區 7／3.50，24 小時第 1 區 15／7.50、一、二區 26／13。SKM 上只認 ZTM 票，KM／PKP Intercity 的票不能用', checkedAt:'2026-09-17', officialUrl:'https://www.wtp.waw.pl/en/ticket-tariff/'},
  {city:'克拉科夫 KMK', short:'15 分 4', min90:'90 分 9', hour24:'20（第 I 區）／25（I+II+III）', note:'2026-09-17 以 ZTP 官方票價表複核：15 分 4／2，30 分或單趟 6／3，60 分 8／4，90 分 9／4.50，24 小時第 I 區 20／10、I+II+III 25／12.50；KMK+KMŁ 70 分聯票 10／5', checkedAt:'2026-09-17', officialUrl:'https://ztp.krakow.pl/en/kmk-public-transport/kmk-ticket-guide'},
  {city:'樂斯拉夫 MPK', short:'15 分 3.20', min90:'90 分 7', hour24:'15', note:'2026-09-17 以市府官方票價頁複核：單次 4.60／2.30，15 分 3.20／1.60，30 分 4／2，60 分 5.20／2.60，90 分 7／3.50，24 小時 15／7.50；時間票可轉乘', checkedAt:'2026-09-17', officialUrl:'https://www.wroclaw.pl/komunikacja/ceny-biletow-mpk-wroclaw'},
  {city:'波茲南 ZTM', short:'15 分 5', min90:'90 分 9', hour24:'18（A 區）／24（全區）', note:'2026-09-17 以 ZTM 官方 cennik 複核：15 分 5／2.50，45 分 7／3.50，90 分 9／4.50（皆為 A+B+C+D 全區）；24 小時 A 區 18／9、全區 24／12。手機票須輸入車號或掃描車內 QR 啟用', checkedAt:'2026-09-17', officialUrl:'https://www.ztm.poznan.pl/wszystko-o-biletach/cennik-biletow/'},
];

export const airportTransit = [
  {route:'華沙蕭邦機場 → 市中心', method:'🚆 SKM S2（往 Śródmieście）', price:'75 分第 1 區票 4.40', time:'約 25–30 分', note:'2026-09-17 官方機場交通頁查證：S2 經 Warszawa Zachodnia → Warszawa Śródmieście → Warszawa Wschodnia，官方標示用 75 分鐘票。Hotel Metropol 要在 Śródmieście 下車，出站即 Metro Centrum'},
  {route:'華沙蕭邦機場 → 市中心', method:'🚆 SKM S3（停 Centralna）', price:'75 分第 1 區票 4.40', time:'約 25–30 分', note:'2026-09-17 官方機場交通頁查證：S3 經 Warszawa Zachodnia → Warszawa Centralna → Warszawa Wschodnia，不停 Śródmieście。搭到 S3 就在 Centralna 下車走過去，不要等 Śródmieście'},
  {route:'華沙蕭邦機場 → 市中心', method:'🚌 175 路巴士', price:'75 分第 1 區票 4.40', time:'約 30–45 分', note:'2026-09-17 官方機場交通頁同樣標示 75 分鐘票；塞車時火車較穩。離開機場只能在下層 Przyloty 02 站上車，上層出境層不開放上車'},
  {route:'華沙蕭邦機場 → 市中心', method:'🚕 計程車／Bolt', price:'依跳錶／App 報價', time:'依路況', note:'機場內認明官方排班計程車，避免搭訕攬客'},
  {route:'克拉科夫 Balice 機場 → 市中心', method:'🚆 SKA1 火車', price:'20', time:'約 20 分', note:'Kraków Airport → Kraków Główny；行李免費，班次以 KMŁ 當日日曆為準'},
  {route:'克拉科夫 Balice 機場 → 市中心', method:'🚌 300／209', price:'6（30 分或單趟）', time:'約 45 分', note:'機場官方列為市郊路線；上車後立即驗票，班次查官方時刻表'},
  {route:'克拉科夫 Balice 機場 → 市中心', method:'🌙 902 夜間巴士', price:'6（30 分或單趟）', time:'約 45 分', note:'夜間備案；上車後立即驗票，班次查官方時刻表'},
];

export const recommendedApps = [
  {name:'📱 Jakdojade（首選）', desc:'四城都可規劃路線，部分城市可直接買票。App 票仍須依畫面指示啟用或掃描車內 QR；各城罰款不同，不在本站寫會變動的固定金額。'},
  {name:'💳 車上售票機', desc:'多數車輛可刷卡購票，但操作與票券是否自動啟用依城市和機型不同。畫面若要求「Validate／Skasuj」必須完成；查票時保留原付款卡或裝置。'},
  {name:'🗺️ Google Maps', desc:'路線規劃同樣好用、四城公車電車時刻都有收錄，適合已經很熟悉、只需要「怎麼走」的人；買票仍需搭配 Jakdojade 或現場機台。'},
  {name:'🚗 Bolt', desc:'叫車 App，四城都有涵蓋。深夜、雨天或懶得等車時的備案，價格透明、免小費文化。'},
];

export const passChecklist = [
  '單程／15–20 分短票最省——老城區多在步行範圍，一天搭乘 3 趟以下用短票通常比 24 小時票划算。',
  '24 小時票——先用該城短票價格估算；通常一天搭 4–5 趟以上才值得考慮，並確認所需區域。',
  '多日券（48 小時／72 小時／7 日）——本行程每城只停留 1–2 晚，通常用不到；除非同一城市安排 3 天以上再評估。',
  '觀光城市卡（Kraków Card 等）——含景點門票＋交通，但需一天刷 3 個以上付費景點才划算；本行程景點分散在多天，多數情況下單買門票＋短程交通票更划算，不特別建議加購。',
];

export const usefulRoutes = [
  '克拉科夫舊城 → Kazimierz——路線可能因工程改道，出發時用 Jakdojade 查當下可搭電車，不硬記車號。',
  '華沙機場往市中心——有大件行李優先 SKM；175 巴士較少轉乘但受路況影響，目的地靠老城時再比較。',
  '夜間交通——深夜班次與改道最容易變動，直接查 Jakdojade／各城市官方旅運規劃；叫車只作備案。',
  '需求站才要示意——2026-09-17 華沙 WTP 官方說明：只有「部分」站牌是需求站（站牌會標 na żądanie／on-demand）。要在需求站下車，按車上的「STOP／na żądanie」鈕；要在需求站上車，提早向司機明顯舉手。其餘站牌照常停靠，不是每站都得按鈴。',
  '查票員抽查——便服查票員會不定時上車查票，出示手機票券或已感應的卡片即可；電子票務必記得「啟用」這一步，光買票沒啟用等同無票。',
];

export const practical = [
  {tag:'寄物', name:'火車站 Locker', note:'四座主要車站通常有寄物櫃，但尺寸、空位與費率會變；抵站依現場標示，不預寫固定價。'},
  {tag:'換錢', name:'Kantor 民間匯兌', note:'機場與觀光區匯率可能較差。交易前比較買入、賣出價與實際可得 PLN；「0% 手續費」不代表匯率划算。'},
  {tag:'SIM 卡', name:'Play / Plus / Orange', note:'預付卡需依波蘭規定實名登記；方案和通路會變，抵達後以電信商官網／門市為準，不保證超商能完成所有開卡程序。'},
  {tag:'付款', name:'信用卡 + 少量現金', note:'刷卡普及，但教堂、小攤或機器故障仍可能需現金；刷卡選 PLN 計價，避免商戶動態換匯。'},
  {tag:'退稅', name:'Tax Free', note:'同一賣家、同一 TAX FREE 文件含稅至少 200 PLN；購買時索取電子文件與收據，離境時備妥未使用商品供海關確認。退款方式依店家或退稅業者，退款率不保證。'},
  {tag:'交通票', name:'短票 vs 24 h 票', note:'四城票制不同，請按上表逐城計算；Jakdojade 查市內路線，KOLEO／PKP Intercity 查鐵路。'},
];
