import { venues } from './venues.js';

// 官方購票入口正本；價格與開放時間仍以 venues.js 為準。
// checkedAt 只表示已查看官方購票／參觀資訊，不表示指定日期有庫存或已購票。
// 現場售票、免費、已含及閉館項目不提供會誤導旅客的「線上購票」按鈕。
export const ticketPurchaseCheckedAt = '2026-10-13';

const schindlerTickets = 'https://bilety.mhk.pl/rezerwacja/wydarzenie.html?idl=1&lang=en';
const mnwrTickets = 'https://bilety.mnwr.pl/?lang=en';
const kolejkowoTickets = 'https://bilety.kolejkowo.pl/';

function entry(id, name, options) {
  const venueIds = options.venueIds || (venues[id] ? [id] : []);
  return {
    id, name, plan: 'optional', method: 'online', day: null,
    purchaseUrl: null, checkedAt: ticketPurchaseCheckedAt,
    sourceUrl: venues[venueIds[0]]?.officialUrl || null,
    ...options, venueIds,
  };
}

export const ticketPurchaseGroups = [
  {
    cityKey: 'WAW', items: [
      entry('warsaw-royal-castle', '皇家城堡 Royal Castle', {
        purchaseUrl: 'https://bilety.zamek-krolewski.pl/index.html?lang=en',
        note: '新行程只看外觀、不進館，不用買票；10/30 中午只在城堡廣場拍外觀。想入內才選 Royal Route，注意不要選成較長的 Castle Route；按官方可售日期與入場時段購票。',
      }),
      entry('warsaw-rising-museum', '華沙起義博物館', {
        purchaseUrl: 'https://bilety.1944.pl/?lang=en',
        note: '新行程只看外觀、不進館，不用買票；想入內就提前購票；週四免費，週五需買票。',
      }),
      entry('warsaw-lazienki-palace', '瓦津基水上宮殿 Palace on the Isle', {
        plan: 'main', day: 7, method: 'free',
        sourceUrl: 'https://www.lazienki-krolewskie.pl/en/regulamin-zwiedzania',
        otherDatesUrl: 'https://bilety.lazienki-krolewskie.pl/',
        note: '主行程 10/30 是週五，個人參觀宮殿免費，直接入場、不必領票；其他日期依票種購買。公園散步免費。',
      }),
      entry('warsaw-national-museum', '華沙國家博物館', {
        purchaseUrl: 'https://bilety.mnw.art.pl/',
        note: '新行程只看外觀、不進館，不用買票；原 10/24 路線已因航班延後移出。想入內：週五 17:00 後門票半價，1 PLN 票除外。臨展票亦包含常設展，依想看的展覽選票。',
      }),
      entry('warsaw-pkin-terrace', '科學文化宮 30 樓觀景台', {
        purchaseUrl: 'https://www.bilety.pkin.pl/', sourceUrl: 'https://www.bilety.pkin.pl/',
        note: '雨天／延伸備案；可線上購票，買票不等於預約指定入場時段。',
      }),
      entry('warsaw-neon-museum', 'Neon 霓虹博物館', {
        method: 'onsite', sourceUrl: 'https://www.neonmuzeum.org/kup-bilety',
        note: '室內備案；官網提供票價與現場購票資訊，未確認獨立線上售票流程。已遷至科學文化宮。',
      }),
      entry('warsaw-msn', 'MSN 當代美術館', {
        purchaseUrl: 'https://sklep.artmuseum.pl/rezerwacja/wydarzenie.html',
        note: '付費展覽需門票；Gallery A 免費。選想看的展覽與入場方案。',
      }),
      entry('warsaw-wilanow-palace', 'Wilanów 維拉努夫宮', {
        purchaseUrl: 'https://wilanow-palac.pl/en/tickets', sourceUrl: 'https://wilanow-palac.pl/en/tickets',
        note: '宮殿、園區與季節活動依票種購買，確認票券涵蓋範圍。',
      }),
      entry('warsaw-poster-museum', 'Wilanów 海報博物館', {
        purchaseUrl: 'https://bilety.mnw.art.pl/rezerwacja/grupa-wydarzen.html?d=3&idl=7&lang=pl',
        sourceUrl: 'https://www.postermuseum.pl/',
        note: '售票系統選 Muzeum Plakatu；官網同時保留暫時閉館字樣與 10/13 換展重開資訊，參觀前再查當日公告。',
      }),
      entry('warsaw-history-museum', '波蘭歷史博物館', {
        purchaseUrl: 'https://sklep.muzhp.pl/', sourceUrl: 'https://muzhp.pl/en/visit',
        note: '按當期臨展選票；屋頂觀景平台免費，臨展另依規定。官網列週五可取得免費展覽票，仍需領票或線上取得。',
      }),
      entry('warsaw-wedel-chocolate', 'E.Wedel 巧克力工廠博物館', {
        purchaseUrl: 'https://bilety.fabrykaczekolady.pl/',
        note: '導覽需選場次；英語場在週一與週五，本趟如加入可查 10/30。導覽與工作坊分別售票。',
      }),
      entry('warsaw-kolejkowo', 'Kolejkowo Warszawa 微縮模型館', {
        purchaseUrl: kolejkowoTickets, sourceUrl: 'https://kolejkowo.pl/',
        note: '購票時選 Warszawa，避免選到 Wrocław 館。',
      }),
      entry('warsaw-curie-museum', '居禮夫人博物館', {
        method: 'onsite', sourceUrl: 'https://www.mmsc.waw.pl/en/plan-your-visit/',
        note: '城市故事提及的延伸景點；現場購票，週二個人參觀免費。',
      }),
      entry('warsaw-cathedral-crypt', '聖若望大教堂地下墓室', {
        method: 'onsite', sourceUrl: 'https://katedra.mkw.pl/wnetrze/',
        note: '老城步行若增加地下墓室參觀需另外購票；不把地下墓室門票當作老城散步費用。',
      }),
      entry('warsaw-st-anne-tower', '聖安妮教堂觀景台 Kościół św. Anny', {
        plan: 'closed', method: 'closed', day: 7,
        sourceUrl: 'https://swanna.waw.pl/zwiedzanie/',
        noticeUrl: 'https://swanna.waw.pl/timeline/uwaga/',
        userReviewUrl: 'https://www.threads.com/@dellyliu/post/DethFgEFFmW',
        sourceNote: '官方：教區官網 swanna.waw.pl（Zwiedzanie 頁與公告），2026-10-21 讀取；觀景台官網 taraswidokowy.pl 整修公告，2026-10-22 複查。網友評論：Threads 網友 Delly Liu（@dellyliu）〈波蘭自助旅行實戰經驗分享 — 華沙 1〉，2026-10-21 讀取。',
        checkedAt: '2026-10-22',
        note: '教區官網公告觀景台 10/6 起整修暫停開放，直到另行公告；2026-10-22 複查觀景台官網仍公告整修不開放，本趟 Day 7 只拍教堂外觀。萬一當天現場看到已開放，現場購票、不用預約，第三方資訊說只收現金。開放時間與票價出發前再確認。',
      }),
      entry('warsaw-polin-reference', 'POLIN 波蘭猶太人歷史博物館', {
        plan: 'reference', purchaseUrl: 'https://bilety.polin.pl/', sourceUrl: 'https://polin.pl/en',
        note: '附件原規劃有列；最新主行程未排入館，新行程只在 10/30 08:35 看建築外觀。只保留購票參考，若要入館須重新安排博物館時間。',
      }),
      entry('warsaw-chopin-museum', '蕭邦博物館', {
        plan: 'closed', method: 'closed', sourceUrl: 'https://muzeum.nifc.pl/en/muzeum/wizyta-informacje-miejsce/1_kontakt/',
        note: '官方公告 2026/1/1–12/31 整修閉館，本趟不購票。',
      }),
    ],
  },
  {
    cityKey: 'KRK', items: [
      entry('krakow-wawel-castle', 'Wawel 皇家城堡各展區', {
        venueIds: ['krakow-wawel-castle', 'krakow-wawel-treasury'],
        plan: 'reference', day: null, purchaseUrl: 'https://bilety.wawel.krakow.pl/',
        note: '分路線售票：王冠寶庫、Castle Underground、Armoury、一樓、二樓或一二樓合票。改班後 10/25 晚抵，未排入主行程；僅留城市延伸參考，可選一小時內的短路線；庭院與外觀散步不需展覽票。',
      }),
      entry('krakow-wawel-cathedral', '瓦維爾大教堂', {
        plan: 'reference', day: null, purchaseUrl: 'https://bilety-wawel.pl/',
        note: '與 Wawel 皇家城堡分開售票；含教堂、齊格蒙特鐘、皇家墓室等開放區域。教堂博物館週日休館，不保證票券列出的所有場館當日都開。',
      }),
      entry('krakow-schindler', '辛德勒工廠', {
        plan: 'reference', day: null, purchaseUrl: schindlerTickets,
        note: '售票頁選 Oskar Schindler’s Enamel Factory 的一般參觀時段；17:30 不是官方固定英語導覽場。線上票實名，入場須帶同名證件正本。',
      }),
      entry('krakow-auschwitz', '奧斯威辛－比克瑙 Auschwitz-Birkenau', {
        plan: 'main', day: 3, purchaseUrl: 'https://visit.auschwitz.org/', sourceUrl: 'https://www.auschwitz.org/en/visiting/',
        note: '導覽費涵蓋一館與比克瑙；所有入場證只在線上取得。免費自行參觀也需預約個人入場證，不能到入口買票。購票狀態以訂票待辦為準。',
      }),
      entry('krakow-wieliczka', '維利奇卡鹽礦 Wieliczka', {
        plan: 'main', day: 4, purchaseUrl: 'https://bilety.kopalnia.pl/index.html?lang=en',
        sourceUrl: 'https://www.wieliczka-saltmine.com/individual-tourist/tourist-route',
        note: '選 Tourist Route＋English，按可售場次購票。官方售票通道為 bilety.kopalnia.pl 與礦區現場售票口／售票機。',
      }),
      entry('krakow-st-mary-basilica', '聖瑪利亞教堂內部＋號角塔', {
        method: 'onsite', sourceUrl: 'https://mariacki.com/en/tourists/',
        note: '教堂觀光區與登塔分別收費；登塔無法預約，只能當日在 Mariacki 廣場 7 號購票，名額有限。塔樓 11 月至翌年 4 月關閉。',
      }),
      entry('krakow-rynek-underground', '地下市集博物館 Rynek Underground', {
        purchaseUrl: 'https://bilety.mhk.pl/rezerwacja/wydarzenie.html?idl=20&lang=en', sourceUrl: 'https://muzeumkrakowa.pl/en/branches/rynek-underground',
        note: '雨天替代 Wawel 的備案；售票頁選 Rynek Underground 的指定場次。週二免費日不能預約，需現場領取限量票。',
      }),
      entry('krakow-galicia-museum', 'Galicia 猶太博物館', {
        purchaseUrl: 'https://galiciajewishmuseum.org/en/tickets-online/',
        sourceUrl: 'https://galiciajewishmuseum.org/en/visit/practical-information/',
        note: '奧斯威辛的室內替代備案，仍須另外買博物館門票。',
      }),
      entry('krakow-mocak', 'MOCAK 當代藝術博物館', {
        purchaseUrl: 'https://bilety.mocak.pl/', sourceUrl: 'https://en.mocak.pl/visiting',
        note: '專案提及的延伸景點；週一休館，10/26 不適用。臨展與常設展免費規則不同。',
      }),
      entry('krakow-old-synagogue', '舊猶太會堂 Old Synagogue', {
        purchaseUrl: 'https://bilety.mhk.pl/rezerwacja/wydarzenie.html?idl=2', sourceUrl: 'https://muzeumkrakowa.pl/en/branches/old-synagogue',
        note: '拍照位置提及；若入內看博物館展覽，售票頁選 Old Synagogue。街道散步與外觀拍照不需門票。',
      }),
    ],
  },
  {
    cityKey: 'WRO', items: [
      entry('wroclaw-panorama', '拉茨瓦維採全景畫 Panorama Racławicka', {
        purchaseUrl: mnwrTickets,
        sourceUrl: 'https://mnwr.pl/oddzialy/panorama-raclawicka/bilety-informacje-praktyczne/',
        note: '新行程只看外觀、不進館，不用買票；10/28 13:20 不入內，只在圓形館外拍外景。想入內：選指定日期與場次，每場約 30 分鐘。全景畫票含國家博物館、民族誌博物館與四穹頂館常設展，限參觀全景畫後 3 個月內使用。',
      }),
      entry('wroclaw-national-museum', '樂斯拉夫國家博物館', {
        method: 'included', otherDatesUrl: mnwrTickets,
        note: '新行程只看外觀、不進館，不用買票；10/28 只看爬藤外牆。持全景畫票可免費參觀常設展，不必重買；未持全景畫票或想看另收費的臨展時，再查適用票種。',
      }),
      entry('wroclaw-st-elizabeth-tower', '聖伊莉莎白教堂塔樓', {
        method: 'onsite',
        sourceUrl: 'https://www.wroclaw.pl/dla-mieszkanca/kosciol-elzbiety-bazylika-mniejsza-poznaj-wroclaw',
        note: '新行程不上塔，10/28 只從糖果屋拱門往上拍高塔。想上塔：現場售票，未找到官方線上售票；下雨或雷暴可能關閉。糖果屋外觀與老城散步免費。',
      }),
      entry('wroclaw-cathedral', '座堂島主教座堂塔樓／巴洛克小堂', {
        method: 'onsite', sourceUrl: 'https://katedra.wroclaw.pl/ZWIEDZANIE/',
        note: '座堂島散步與看點燈不需票；登塔、巴洛克小堂等指定區域另收費。官網同頁有不同版本價目，付款前以現場最新價目為準。',
      }),
      entry('wroclaw-hala-stulecia', '百年廳 Visitor Centre', {
        method: 'onsite',
        note: '新行程 10/28 13:55 只看外觀、尖塔、柱廊與公園，不買票；多媒體噴泉大概率已停。想入內：多媒體展與含廳內看台的票種不同。先查官方 availability calendar，當日活動可能限制入內範圍。',
      }),
      entry('wroclaw-zoo', '動物園＋Afrykarium', {
        purchaseUrl: 'https://bilety.zoo.wroclaw.pl/',
        note: '動物園票已包含 Afrykarium，不必另買。指定日期採動態定價，以官方售票頁結帳前價格為準。',
      }),
      entry('wroclaw-hydropolis', 'Hydropolis 水知識中心', {
        purchaseUrl: 'https://bilety.hydropolis.pl/cennik.html?lang=en',
        note: '室內延伸景點，從官方售票系統選日期與場次。',
      }),
      entry('wroclaw-kolejkowo', 'Kolejkowo 微縮模型館', {
        purchaseUrl: kolejkowoTickets, sourceUrl: 'https://kolejkowo.pl/',
        note: '購票時選 Wrocław，避免選到 Warszawa 館；同在 Sky Tower，但與觀景台分開售票。',
      }),
      entry('wroclaw-sky-tower', 'Sky Tower 觀景台', {
        purchaseUrl: 'https://bilety.skytower.pl/index.html?lang=en', sourceUrl: 'https://bilety.skytower.pl/regulamin.html?lang=en',
        note: '雨天備案；需選日期與入場時段，付款前留意能見度及退票規則。',
      }),
    ],
  },
  {
    cityKey: 'POZ', items: [
      entry('poznan-ck-zamek', '帝王城堡 CK ZAMEK', {
        purchaseUrl: 'https://ckzamek.bilety24.pl/',
        note: '新行程只看外觀、不進館，不用買票；10/29 走帝王區時看外觀。想入內：選 Zwiedzanie Zamku 城堡參觀／當期展覽方案，不要買成音樂會票。參觀範圍與聯票內容以當日活動及售票頁為準。',
      }),
      entry('poznan-croissant-museum', '牛角麵包博物館 Rogalowe Muzeum', {
        purchaseUrl: 'https://rogalowemuzeum.pl/en/buy-ticket/',
        note: '附件原規劃有排，最新主行程未排；如加入，需選展演日期、場次與語言。10/29 有無英文場仍待售票日曆確認。',
      }),
      entry('poznan-archaeological-museum', '考古博物館／Genius loci 考古保護區', {
        purchaseUrl: 'https://tobilet.pl/wystawy-prezentowane-w-muzeum-archeologicznym-w-poznaniu.html',
        note: '官網連至 ToBilet 的本館線上售票；本館與 Genius loci 是不同地點，聯票內容依票種確認。官網票價頁列每週二免費；售票平台摘要與官網不一致，10/29 週四先按付費規劃，購票前再查。',
      }),
      entry('poznan-cathedral', '主教座堂地下墓室／觀景塔', {
        method: 'onsite', sourceUrl: 'https://www.katedra.archpoznan.pl/turysci-w-katedrze/',
        note: '教堂島散步不需票；地下墓室與塔樓需在教堂旅客服務處購票，開放依禮拜及季節調整。',
      }),
      entry('poznan-old-town-hall-museum', '古市政廳博物館', {
        plan: 'closed', method: 'closed', sourceUrl: 'https://mnp.art.pl/ratusz-muzeum-poznania',
        note: '整修閉館，官方預計 2027 年底至 2028 年初全面重開；本趟只看外觀與免費山羊秀。',
      }),
      entry('poznan-palmiarnia', 'Palmiarnia 棕櫚屋', {
        plan: 'closed', method: 'closed', sourceUrl: 'https://palmiarnia.poznan.pl/',
        note: '現代化工程暫時閉館，官方未公布重開日期；本趟不購票，也不作雨天室內備案。',
      }),
    ],
  },
];

export const ticketPurchases = ticketPurchaseGroups.flatMap(group =>
  group.items.map(item => ({ ...item, cityKey: group.cityKey })),
);

export function ticketPurchaseById(id) {
  const item = ticketPurchases.find(item => item.id === id);
  if (!item) throw new Error(`找不到購票景點：${id}`);
  return item;
}

export function ticketPurchaseForVenue(venueId) {
  return ticketPurchases.find(item => item.venueIds.includes(venueId)) || null;
}
