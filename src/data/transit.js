export const transitFares = [
  {city:'華沙 ZTM', short:'20 分 3.40', min90:'7', hour24:'15', note:'涵蓋電車／巴士／地鐵／SKM · 第一區'},
  {city:'克拉科夫 KMK', short:'15 分 4', min90:'9', hour24:'20', note:'2026/3 起新價 · 單次票 6'},
  {city:'樂斯拉夫 MPK', short:'15 分 3.20', min90:'7', hour24:'15', note:'短程全國最便宜 · 單程票 4.60'},
  {city:'波茲南 ZTM', short:'15 分 5', min90:'9', hour24:'18', note:'短程最貴 · 45 分 7（無中間檔）'},
];

export const airportTransit = [
  {route:'華沙蕭邦機場 → 市中心', method:'🚆 SKM／KM 火車', price:'4.40', time:'約 25–30 分', note:'買至少 75 分鐘票（涵蓋轉乘）· 06:00–23:00 · 到 Śródmieście／Centralna 站'},
  {route:'華沙蕭邦機場 → 市中心', method:'🚌 175 路巴士', price:'4.40', time:'約 30 分', note:'04:58–23:58，每 15–20 分一班 · 直達市中心＋近舊城'},
  {route:'華沙蕭邦機場 → 市中心', method:'🚕 計程車／Bolt', price:'30–35', time:'約 20 分', note:'機場內認明官方排班計程車，避免搭訕攬客'},
  {route:'克拉科夫 Balice 機場 → 市中心', method:'🚆 SKA1 火車', price:'20', time:'17–18 分', note:'唯一班次，直達方向 Wieliczka Rynek Kopalnia · 04:17 首班，約每 30 分一班到 22:17 · 此票價與市內單程票不同，另計'},
  {route:'克拉科夫 Balice 機場 → 市中心', method:'🚌 300 路巴士', price:'依區', time:'約 30–40 分', note:'10:00–20:00 每 15 分一班 · 到 Rondo Grunwaldzkie，靠近舊城 · 機場屬 I+II 區，需買對應區間票'},
  {route:'克拉科夫 Balice 機場 → 市中心', method:'🌙 902 夜間巴士', price:'依區', time:'約 40–45 分', note:'深夜／凌晨航班備案 · 到火車站東側'},
];

export const recommendedApps = [
  {name:'📱 Jakdojade（首選）', desc:'波蘭最普及的大眾運輸 App，四城都支援。可查即時時刻、規劃路線、App 內直接買票並自動啟用；上車前記得先在 App 內啟用電子票（未啟用視同無票，2026 罰款 PLN 133–266）。錢包儲值支援信用卡／Apple Pay。★4.4（157 萬則評論）。'},
  {name:'💳 車上機台感應卡（最簡單）', desc:'不裝 App 也行：車上或站牌的售票機直接感應信用卡／手機／手錶，選好票種按「Kup i skasuj（購買並驗票）」即完成，系統自動綁定在該卡上，查票時感應同一張卡即可，免列印、免額外驗票步驟。支援 Visa／Mastercard 感應、Apple Pay、Google Pay、BLIK。'},
  {name:'🗺️ Google Maps', desc:'路線規劃同樣好用、四城公車電車時刻都有收錄，適合已經很熟悉、只需要「怎麼走」的人；買票仍需搭配 Jakdojade 或現場機台。'},
  {name:'🚗 Bolt', desc:'叫車 App，四城都有涵蓋。深夜、雨天或懶得等車時的備案，價格透明、免小費文化。'},
];

export const passChecklist = [
  '單程／15–20 分短票最省——老城區多在步行範圍，一天搭乘 3 趟以下用短票通常比 24 小時票划算。',
  '24 小時票——一天內要搭 4 趟以上（例如安排較遠景點來回）再考慮買，四城價格 15–20 PLN 不等，見上表。',
  '多日券（48 小時／72 小時／7 日）——本行程每城只停留 1–2 晚，通常用不到；除非同一城市安排 3 天以上再評估。',
  '觀光城市卡（Kraków Card 等）——含景點門票＋交通，但需一天刷 3 個以上付費景點才划算；本行程景點分散在多天，多數情況下單買門票＋短程交通票更划算，不特別建議加購。',
];

export const usefulRoutes = [
  '克拉科夫舊城 → Kazimierz——搭電車 6、8、10、13 路直達猶太區入口，省下步行 20 分鐘。',
  '華沙機場往舊城——175 路巴士坐到底站，步行 4–5 分鐘即達皇家之路／舊城區，比火車轉乘更省事。',
  '夜間交通——四城電車多在 23:00–00:00 收班；深夜改搭夜間巴士（克拉科夫 600 開頭路線，如 601、662，取代電車路線）或 Bolt 叫車。',
  '下車要按鈴——巴士（非電車）不會每站必停，要下車須按扶手上的「STOP」按鈕告知司機，否則可能直接開過站。',
  '查票員抽查——便服查票員會不定時上車查票，出示手機票券或已感應的卡片即可；電子票務必記得「啟用」這一步，光買票沒啟用等同無票。',
];

export const practical = [
  {tag:'左行寄物', name:'火車站 Locker', note:'WAW Centralna / KRK Główny / WRO Główny / POZ Główny 都有自助 locker。小箱 PLN 8–12 / 大箱 PLN 12–18 · 24 h 為一單位。'},
  {tag:'換錢', name:'Kantor 民間匯兌', note:'機場 / 觀光區匯率最差。市區「Internet Kantor」、「Kantor Pomocna」買賣價差 ≤ 1.5%。⚠ 看到「0% Commission」要警覺。'},
  {tag:'SIM 卡', name:'Play / Plus / Orange', note:'蕭邦機場到達層櫃台、市區 Empik / Żabka 都有。PLN 30 起含 30 天無限上網 + 通話。台灣免簽歐盟漫遊不適用波蘭費率。'},
  {tag:'付款', name:'信用卡 + Revolut', note:'四城 95% 商家收 Visa / Master，含廣場攤販。Apple Pay 普及。建議帶 PLN 200–300 現金應付小費 / 教堂 / 鄉間。'},
  {tag:'退稅', name:'Tax Free 海關蓋章', note:'單筆 PLN 200 以上於 Tax Free 標誌商店可退 8–18% VAT。離境前在蕭邦機場 / KRK 機場海關櫃台蓋章再投退稅信箱。'},
  {tag:'交通卡', name:'單程票 vs 24h 票', note:'華沙 / 克拉科夫 24 h 票約 PLN 18，當日搭 3 趟以上划算。Jakdojade / Koleo App 查時刻 + 直接買票。'},
];
