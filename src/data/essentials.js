import { todoGroups } from './trip.js';
import { railNoteHtml, bookingNoteHtml } from '../lib/todo-status.mjs';

export const phrases = [
  ['你好（非正式）', 'Cześć', 'chesh-ch'],
  ['您好', 'Dzień dobry', 'jen dob-ri'],
  ['晚安', 'Dobranoc', 'do-bra-nots'],
  ['謝謝', 'Dziękuję', 'jen-koo-yeh'],
  ['請 / 不客氣', 'Proszę', 'pro-sheh'],
  ['是 / 否', 'Tak / Nie', ''],
  ['對不起', 'Przepraszam', 'psheh-pra-sham'],
  ['廁所在哪', 'Gdzie jest toaleta?', ''],
  ['買單', 'Rachunek proszę', ''],
  ['多少錢', 'Ile to kosztuje?', ''],
  ['乾杯', 'Na zdrowie!', 'naz-dro-vyeh'],
  ['真好吃', 'Smaczne!', 'smach-neh'],
];

export const packingDefault = {
  '證件與金錢': ['護照（離開申根區後至少 3 個月有效，且簽發未滿 10 年）', '各票券訂位證明（列印或存離線）', '信用卡', '少量茲羅提現金', '旅遊保險單'],
  '電子': ['手機', '充電器', '歐規轉接頭', '行動電源（每人最多 2 個、各 ≤100 Wh；僅手提，規格須清楚）', '耳機'],
  '衣物（10 月波蘭）': ['保暖外套', '毛帽手套', '圍巾', '雨具', '好走的鞋'],
  '藥品盥洗': ['常備藥', '暈車藥', '牙刷牙膏', '保養品'],
};

// 八天的日照，供每日頁與拍照站位判斷戶外時間。
//
// 數值由 tools/sun-times.mjs 以天文演算法推算，不是人工填寫——2026-09-14
// 核對時發現原本人工填的 Day 1–4 日落早了 26–31 分鐘（剛好是沒有從已查證
// 來源抄過來的那幾天），日出則八天有七天有誤。tests/daylight.test.mjs 會
// 逐筆比對演算法與本表，數字不會再默默漂掉。
//
// 校驗基準：專案 2026-08-11 人工查證的四個日落值（華沙 10/26 16:19、
// 10/31 16:10、樂斯拉夫 10/28 16:34、波茲南 10/29 16:29），演算法四筆全中。
//
// 10/25 凌晨夏令時間結束（03:00 回撥 02:00），日落從 Day 1 的 17:23 掉到
// Day 2 的 16:30——整趟旅程的戶外可用時間在第二天就少掉 53 分鐘，這是排
// 傍晚行程的關鍵。blueHourEnd 為民用曙暮光結束（太陽 -6°），是手機仍拍得到
// 層次的實務下限，不是固定加 30 分鐘。
//
// 仍屬推算值：若要用於趕日落前抵達某拍攝點這類關鍵決策，出發前再以天文表核對。
export const daylight = [
  {day:1, date:'2026-10-24', city:'華沙', tz:'CEST',   sunrise:'07:16', sunset:'17:23', blueHourEnd:'17:58', note:'本日為桃園出發日，尚未抵波蘭；這列只保留華沙日照參考，不代表當天有華沙散步行程。'},
  {day:2, date:'2026-10-25', city:'克拉科夫', tz:'CET',    sunrise:'06:17', sunset:'16:30', blueHourEnd:'17:04', note:'冬令時間首日；18:12 抵克拉科夫時天已黑，先入住及用餐，白天景點不再排入。'},
  {day:3, date:'2026-10-26', city:'克拉科夫', tz:'CET',    sunrise:'06:19', sunset:'16:28', blueHourEnd:'17:02', note:'Auschwitz 回程 16:55 抵克拉科夫時已過日落，當晚不安排戶外拍攝。'},
  {day:4, date:'2026-10-27', city:'克拉科夫', tz:'CET',    sunrise:'06:20', sunset:'16:27', blueHourEnd:'17:00', note:'Kazimierz 白天散步約 13:45 回城後開始，日落前約 2 小時是磚牆與窄街的最佳光線。'},
  {day:5, date:'2026-10-28', city:'樂斯拉夫', tz:'CET',    sunrise:'06:36', sunset:'16:34', blueHourEnd:'17:08', note:'百年廳 13:55 拍外觀；座堂島煤氣燈：點燈人沒有對外保證的固定出發分鐘，通常在日落前約 30–40 分鐘出發，15:45 上島就邊走邊留意。'},
  {day:6, date:'2026-10-29', city:'波茲南', tz:'CET',    sunrise:'06:42', sunset:'16:29', blueHourEnd:'17:05', note:'Cytadela 與教堂島排在上午；16:00 Kaponiera 圓環是最後一站，16:15 就回去取行李往車站。'},
  {day:7, date:'2026-10-30', city:'華沙', tz:'CET',    sunrise:'06:27', sunset:'16:12', blueHourEnd:'16:47', note:'從 POLIN、新城、老城一路往南到瓦津基，付費館只看外觀。日落 16:12，在水上宮殿湖邊拍倒影；16:40 從 Agrykola 出口叫車回飯店，天色已暗。'},
  {day:8, date:'2026-10-31', city:'華沙', tz:'CET',    sunrise:'06:28', sunset:'16:10', blueHourEnd:'16:45', note:'09:45 出發搭機，不涉及傍晚戶外行程。'},
];

export const about = [
  ['語言', '波蘭語（觀光區英語通）'],
  ['電壓', '230V · C/E/F 型插座'],
  ['時區', 'CET（夏令 CEST）'],
  ['匯率', '每日浮動；付款與記帳以當日銀行／卡組織匯率為準'],
  ['物價水位', '依城市與店型差異大，以實際菜單與訂票頁為準'],
  ['小費文化', '餐廳 10%（非強制）'],
  ['刷卡付款', '刷卡機或 ATM 問要不要換成台幣（DCC）時，一律選 PLN（złoty），用台幣結帳匯率較差。'],
  ['10/25（日）', '凌晨 03:00 改冬令時間，時鐘撥回 02:00，手機會自動調。當天是非營業週日，多數商店不開，當天抵達後找有開的車站店或便利商店補給。'],
  ['搭火車', 'IC／EIP 對號入座，看票上的車廂（wagon）與座位（miejsce）；大行李放車廂兩端行李架。查票時出示 App 或 PDF 票券。'],
  ['10/30–31 諸聖節前夕', '墓園開始點滿蠟燭，華沙人潮與交通都比平常多；11/1 閉館的景點已在離境之後，不影響行程。'],
  ['台灣簽證', '持載有國民身分證統一編號的有效中華民國護照，可依申根短期停留規則免簽；仍備妥回程票、住宿與行程證明'],
  ['EES 入境登錄', '已全面運作。非 EU 旅客第一次入境要在邊境登錄護照、指紋與臉部照片，不用事先申請；10/25 華沙入境多留排隊時間。'],
  ['ETIAS', '還沒啟用、不收申請，這趟不用辦。網路上收費「代辦 ETIAS」的網站都是詐騙。'],
  ['行動電源・本趟準備', '每人最多 2 個、各不超過 100 Wh，符合香港航空及 Qatar 航段容量上限；只放手提行李，保護接點防短路，規格標示清楚。三家航司均禁止託運及放頭頂置物箱，放前座下方或航司允許的可及位置。'],
  ['行動電源・香港航空', 'HX 283：每人最多 2 個、各不超過 100 Wh，只能手提；禁止機上使用或充電，不放頭頂置物箱，放前座下方或座椅口袋等可及位置。'],
  ['行動電源・Qatar', 'QR 815／259／260／818：最多 2 個、各 ≤100 Wh，只能手提；禁止在機上為行動電源充電，須保持可及，不放頭頂或側邊收納櫃。使用前仍依機組指示。'],
  ['行動電源・EVA', 'BR 872：最多 2 個，只能手提，不放頭頂置物箱；進入航空器後不得使用行動電源或為行動電源／備用鋰電池充電。超過 100 Wh 的一般備用電池規則不能代替本趟 Qatar 容量上限。'],
];

export const safety = {
  emergency: [
    ['歐洲通用緊急', '112'],
    ['警察 Policja', '997'],
    ['消防 Straż Pożarna', '998'],
    ['救護 Pogotowie', '999'],
    ['市政警察（服務地區依城市）', '986'],
  ],
  embassy: [
    ['駐波蘭台北代表處', '30th Floor, Ul. Emilii Plater 53, 00-113 Warsaw, Poland'],
    ['辦公室電話', '+48 22 213 0060'],
    ['急難救助專線', '+48 668 027 574'],
    ['外交部 24h 專線', '+886 800 085 095'],
  ],
  tips: [
    {label:'觀光陷阱', text:'拒絕未先講明價格的拍照、手環或攬客服務；機場與車站只走官方排班或 App 叫車；換匯前先看清買入／賣出價與手續費。'},
    {label:'禮儀', text:'進教堂脫帽；Auschwitz 禁笑鬧自拍；勿把波蘭當俄國；餐廳小費約 10%'},
    {label:'治安', text:'火車站、車廂與 Rynek 等人潮區注意扒竊；護照、手機與錢包分開收，背包在人多處移到身前。'},
    {label:'就醫', text:'市政供水通常可飲用，但老建物內部管線狀況不同；若水色、氣味異常就改用瓶裝水。Apteka 藥局普及，並建議投保涵蓋緊急醫療的旅平險。'},
  ],
};

export const essentialSources = [
  {name:'EU 官方 EES／ETIAS 狀態', checkedAt:'2026-10-06', note:'EES 已全面運作；ETIAS 尚未運作、不收申請，啟用日另行公告。', url:'https://home-affairs.ec.europa.eu/policies/schengen/smart-borders_en'},
  {name:'EU 官方 EES 入境程序', checkedAt:'2026-10-06', note:'首次短期入境登錄護照、指紋與臉部影像；豁免依旅客身分判斷。', url:'https://www.consilium.europa.eu/en/policies/entryexit-system/'},
  {name:'Qatar 行動電源公告', checkedAt:'2026-10-06', note:'每人 2 個、各 ≤100 Wh；僅手提，禁止在機上為行動電源充電，保持可及。', url:'https://www.qatarairways.com/en/travel-alerts.html'},
  {name:'香港航空行動電源規則', checkedAt:'2026-10-22', note:'每人 2 個；手提且放前座下方，機上不可使用或充電。', url:'https://content.hongkongairlines.com/en_CA/fly-with-us/baggage/handcarry'},
  {name:'EVA 行動電源規則', checkedAt:'2026-10-06', note:'每人 2 個；僅手提、不放頭頂，進入航空器後不可使用或充電。', url:'https://www.evaair.com/zh-tw/fly-prepare/baggage/additional-baggage-information/restrictions/'},
  {name:'外交部領事事務局・波蘭入境須知', checkedAt:'2026-09-08', note:'核對台灣護照免簽資格、護照條件與可能被要求出示的旅行證明。', url:'https://www.boca.gov.tw/sp-foof-countrycp-01-62-aa8d5-02-1.html'},
  {name:'波蘭政府・112 緊急電話', checkedAt:'2026-09-08', note:'112 為歐洲通用緊急電話；997／998／999 仍分別對應警察、消防與救護。', url:'https://www.gov.pl/web/mswia-en/what-and-how-to-report'},
  {name:'波蘭 TAX FREE 官方說明', checkedAt:'2026-09-08', note:'同一賣家單筆 TAX FREE 文件含稅金額至少 200 PLN，商品須以旅客個人行李帶離 EU。', url:'https://puesc.gov.pl/en/uslugi/tax-free-informacja-dla-podroznych'},
];

// 第 05、07 條（城際交通、先訂清單）的訂票狀態由 todoGroups 自動產生，不手寫。
export const preDepartureNotes = [
  '10/25（日）夏令時間結束——03:00 回撥為 02:00。當日不是營業週日，多數一般商店不得營業；加油站、值班藥局與符合法定例外的店可開，但不能假設每間 Żabka／小店都營業。',
  '日照——逐日的日出、日落與藍調時刻請看行前提醒頁的「八日日照」表，每日行程頁也各自標示當天數值；本條不再重複列出時間，避免兩處各自漂移。重點是 10/25 凌晨夏令時間結束後日落提前 53 分鐘，戶外行程要往前收。',
  '10/31 諸聖節前日——克拉科夫／華沙人潮多；辛德勒工廠、Wawel 部分展區 11/1、11/11 閉館（Wawel 自身公告的閉館日，不含 11/3）。你的回程班機是 10/31 14:40 起飛（WAW → DOH），不是 11/1，這些閉館日都在你離境之後，對本趟無實質影響。',
  '米其林訂位——二星＋各一星出發前 3–4 週訂；華沙 splurge 級 3–5 週。',
  railNoteHtml(todoGroups, 'todos.html'),
  '火車實務——IC／EIP 對號入座；城際段優先使用 PKP Intercity 官方 App／網站購票與選位。上車查票出示離線保存的 PDF 或 App 票券；大件行李放車廂端行李架並自行留意。',
  bookingNoteHtml(todoGroups, 'todos.html'),
  '諸聖節燭海（11/1 Wszystkich Świętych）——波蘭最動人的傳統：墓園在 10/30–11/1 點滿蠟燭成燭海。你 10/30–31 在華沙，可傍晚到 Powązki 老墓園感受；11/1 當天是燭海最盛的高峰日，但你已在 10/31 14:40 搭機離境，只能感受前一晚的氣氛。',
];
