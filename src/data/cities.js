// src/data/cities.js
// 來源：redesign/data.js:260-289（cities/photoSpots/photoCredits）、:534-598（cityStories）、
//       poland-travel-guide-final.html:565（mapPins CITIES 圖釘物件，已套用校正表 3-1/3-2 修正）、
//       poland-travel-guide-final.html 各城「景點 · Sights」表格（attractions）。
// photoSpots 已套用校正表第 3 節拍照時段修正（waw-castle／krk-kazimierz／poz-rynek 的 bestTime，
// 以及 wro-dwarfs 的日落時間敘述）。

export const cities = [
  {key:'WAW', name:'華沙', pl:'Warszawa', tag:'CAPITAL', nights:'1 + 2', totalNights:3, stayNote:'首晚倒時差 + 回程兩晚收尾', vibe:'鋼鐵摩天 × 重建老城', highlights:['POLIN 猶太博物館','起義博物館','皇家城堡','Krakowskie Przedmieście'], photo:{hero:'assets/photos/warszawa-hero.webp',thumb:'assets/photos/warszawa-thumb.webp'}},
  {key:'KRK', name:'克拉科夫', pl:'Kraków', tag:'OLD WORLD', nights:2, totalNights:2, stayNote:'兩晚承接老城、Auschwitz、鹽礦', vibe:'中世紀石板路 × 千年王城', highlights:['Wawel 城堡','中央市集 Rynek','Auschwitz 一日往返','Kazimierz 猶太區'], photo:{hero:'assets/photos/krakow-hero.webp',thumb:'assets/photos/krakow-thumb.webp'}},
  {key:'WRO', name:'樂斯拉夫', pl:'Wrocław', tag:'700 DWARFS', nights:1, vibe:'700 小矮人 × 煤氣燈點燈', highlights:['百年廳 UNESCO','全景畫 Panorama','座堂島 Ostrów Tumski','糖果屋雙屋'], photo:{hero:'assets/photos/wroclaw-hero.webp',thumb:'assets/photos/wroclaw-thumb.webp'}},
  {key:'POZ', name:'波茲南', pl:'Poznań', tag:'CRADLE', nights:1, vibe:'波蘭文明發源 × 山羊報時', highlights:['教堂島 Ostrów Tumski','12:00 山羊鐘樓秀','聖馬丁牛角麵包 PGI','帝王城堡'], photo:{hero:'assets/photos/poznan-hero.webp',thumb:'assets/photos/poznan-thumb.webp'}},
];

export const cityNotices = {
  warsaw: [
    {status:'待確認', level:'risk', text:'Day 7 皇家城堡排在傍晚，但 10 月冬季時段可能 17:00 即閉館；需先上 zamek-krolewski.pl 確認，再決定當天三館順序。'},
  ],
  krakow: [
    {status:'待確認', level:'risk', text:'辛德勒工廠 10 月週日實際最後入場時間兩份資料對不上。本行程排 17:30 入場仍有緩衝，但建議行前上 muzeumkrakowa.pl 再確認一次。'},
  ],
  wroclaw: [
    {status:'已確認限制', level:'risk', text:'百年廳 10/28（本行程當天）圓頂展廳不開放；主行程只排外觀與周邊，行前 3–5 天仍建議查 halastulecia.pl 是否有其他臨時異動。'},
  ],
  poznan: [],
};

export const cityStories = [
  {
    city:'華沙', en:'Warszawa',
    geo:'維斯瓦河（Wisła）中游西岸，波蘭地理與交通的十字路口。左岸（西）是重建的老城與現代市中心，右岸 Praga 區因 1944 年已被蘇軍佔領而躲過摧毀，保留了戰前原始街景——今日的藝術替代區。',
    history:'二戰中被系統性夷平的城市：1944 華沙起義失敗後，希特勒下令逐街爆破，市區約 85% 化為瓦礫。戰後波蘭人依 18 世紀宮廷畫家 Bellotto（Canaletto）的城市風景畫逐磚重建老城，1980 年以「非典型完整重建案例」列入 UNESCO——你走的老城廣場每一面牆都不到 80 歲，卻承載 700 年的記憶。',
    stories:[
      {title:'美人魚與雙城傳說', text:'華沙市徽是持劍舉盾的美人魚 Syrenka。傳說她與哥本哈根小美人魚是姊妹，一路游進維斯瓦河，被漁民所救後誓言守護此城——所以華沙美人魚是戰鬥形態，哥本哈根那隻是憂鬱形態。'},
      {title:'蕭邦的心臟', text:'蕭邦客死巴黎，遺體葬於拉雪茲神父公墓，但遵其遺願，姊姊將他的心臟帶回華沙，封存在聖十字教堂（Krakowskie Przedmieście 上，Day 1 傍晚散步會經過）的柱子裡。二戰期間曾被納粹取走，戰後歸位。'},
      {title:'一份不受歡迎的禮物', text:'科學文化宮是 1955 年史達林「贈送」的蘇聯式摩天樓，華沙人曾說最棒的觀景點就是它的 30 樓——因為那是全城唯一看不到它的地方。如今旁邊蓋起純白的 MSN 現代美術館（2024 開幕、NYT 2026 必訪 No.2），新舊對峙本身就是展品。'},
      {title:'居禮夫人是華沙人', text:'瑪麗亞·斯克沃多夫斯卡（Maria Skłodowska-Curie）1867 年生於新城區 Freta 街 16 號，是史上唯一在兩個不同科學領域拿諾貝爾獎的人。老城散步腳程內就有她的出生地博物館。'},
    ],
    onSite:[
      '老城廣場地面找「重建前 vs 重建後」對照銅牌',
      '聖十字教堂左側第二根柱：蕭邦心臟安放處',
      'Praga 區（Day 7 已排）注意牆上戰前彈孔與原始磚面——左岸看不到的真跡',
    ],
  },
  {
    city:'克拉科夫', en:'Kraków',
    geo:'維斯瓦河上游，Wawel 城堡建在河畔一座石灰岩丘上——控制河運的天然要塞，也是波蘭王權 500 年的地理支點。老城以歐洲最大中世紀廣場 Rynek Główny（200m × 200m）為核心，街廓自 1257 年大蒙古劫掠後重劃至今未變。',
    history:'1038–1596 年的波蘭王都，歷代國王在 Wawel 加冕與安葬。二戰時因作為納粹總督府所在地而未被戰火摧毀，是波蘭極少數「原裝」的古城——你在克拉科夫摸到的石頭大多是真的中世紀石頭。Kazimierz 原是 1335 年卡齊米日大帝敕建的獨立城市，數百年來是歐洲猶太文化重鎮，戰前 6.5 萬猶太居民戰後僅存數千。',
    stories:[
      {title:'瓦維爾龍', text:'傳說 Wawel 山丘下的洞穴住著噴火龍，吃遍牲口少女。屠龍的不是騎士，而是鞋匠學徒 Skuba——他把硫磺塞進羊皮縫成假羊，龍吞下後渴到狂飲維斯瓦河水，最後爆掉。今日城堡下河畔有一座每隔幾分鐘真的噴火的龍雕像。'},
      {title:'斷在半空的號角', text:'聖瑪利亞教堂塔頂每小時整點吹奏 Hejnał 號角，旋律永遠在同一個音戛然而止——紀念 1241 年蒙古來襲時，吹號示警的哨兵喉嚨中箭、樂聲中斷的傳說。這是全世界少數「以未完成為完成」的城市儀式，Day 2 16:00 廣場行程剛好對到整點。'},
      {title:'廣場底下還有一個廣場', text:'Rynek 地面下 4 公尺是 13 世紀的街面。2005–2010 年考古挖掘後原地做成 Rynek Underground 博物館（Day 2 雨備）——你腳下踩的其實是中世紀商路的天花板。'},
      {title:'兩顆星的城市', text:'2026 米其林把全波蘭唯一二星留給了這裡的 Bottiglieria 1881（連四年），發布典禮也選在克拉科夫 ICE 會議中心舉行——波蘭美食之都的地位官方蓋章。'},
    ],
    onSite:[
      '整點在廣場任一角落停下來等 Hejnał，注意最後一個音的戛然而止',
      '紡織會館二樓迴廊看廣場全景（免費），一樓攤位留到 10/27 採買',
      'Kazimierz Szeroka 街：《辛德勒的名單》多場戲的實景地',
    ],
  },
  {
    city:'樂斯拉夫', en:'Wrocław',
    geo:'奧得河（Odra）在此裂成多條支流，把城市切成 12 座島、以 100 多座橋相連——「波蘭威尼斯」。最老的核心 Ostrów Tumski（座堂島）是千年前的起點，至今保留全歐少數仍由點燈人每晚手工點燃的瓦斯街燈。',
    history:'這座城市 1945 年前叫 Breslau，是德國第六大城。戰後國界西移，德裔居民被遷出，取而代之的是被蘇聯劃走的東部城市利沃夫（Lwów）的波蘭移民——整座城市的人口被「換血」。拉茨瓦維採全景畫正是從利沃夫一起搬來的鎮城之寶，Karczma Lwowska 餐廳的名字也是這段記憶。',
    stories:[
      {title:'小矮人是反抗軍', text:'城裡 600+ 尊銅製小矮人（krasnale）不是行銷噱頭：1980 年代反共團體「橙色替代」（Pomarańczowa Alternatywa）以塗鴉小矮人與荒誕街頭劇嘲諷政權——警察逮捕一個扮小矮人的人有多可笑，體制就有多可笑。2005 年起城市以銅像致敬這段歷史，每一尊都有名字與職業。'},
      {title:'每晚的點燈儀式', text:'日落時分，披斗篷、持長桿的點燈人會逐一點亮 Ostrów Tumski 的約 100 盞瓦斯燈——歐洲僅存的日常點燈儀式之一。10/28 日落約 16:34、點燈人約 16:45 起開工，Day 5 已把座堂島排到 16:15–17:15，看完點燈再去搭 19:00 的車。'},
      {title:'混凝土的世界遺產', text:'百年廳（Hala Stulecia，1913）落成時擁有世界最大跨距的鋼筋混凝土圓頂，直接影響了現代主義建築的走向，2006 年列入 UNESCO——在古蹟之城看一座「未來古蹟」。'},
    ],
    onSite:[
      '廣場周邊開始數小矮人：郵差、消防員、睡在門邊的、推保險箱的——App「Krasnale Wrocław」有地圖',
      '座堂島橋上的情人鎖與瓦斯燈：日落前 15 分鐘卡位',
      '注意市政廳南面的天文鐘與哥德山牆——二戰倖存的原件',
    ],
  },
  {
    city:'波茲南', en:'Poznań',
    geo:'瓦爾塔河（Warta）畔，位居柏林—華沙軸線正中，千年來吃盡東西貿易紅利，至今仍是波蘭的會展之都。城市原點在河中沙洲 Ostrów Tumski（與樂斯拉夫的座堂島同名不同地）。',
    history:'波蘭國家的搖籃：966 年梅什科一世（Mieszko I）在此受洗，波蘭以此為建國元年；最早的君主就葬在波茲南座堂。近代史上同樣硬氣——1956 年 6 月的工人起義是共產波蘭第一場大規模反抗，比華沙、格但斯克都早。',
    stories:[
      {title:'兩隻山羊的贖罪', text:'1551 年市政廳新鐘落成宴上，學徒烤焦了鹿肉，情急偷了兩隻山羊代替；山羊逃上鐘塔，在全城面前頂起角來，逗笑了市長與賓客，因而獲赦。從此市政廳每天 12:00 由機械山羊互撞 12 下——Day 6 正午行程就是為它排的。'},
      {title:'有身分證的麵包', text:'聖馬丁牛角麵包（rogal świętomarciński）受歐盟 PGI 保護：白罌粟籽餡、81 層酥皮、只有波茲南地區持證烘焙坊能做。傳統上 11/11 聖馬丁節當天全城吃掉數百噸——你早到兩週，平日仍買得到，認明店內 PGI 證書（Kandulski 是百年老字號）。'},
      {title:'蕭邦睡過的飯店', text:'Stary Rynek 旁的 Hotel Bazar（1841）是波蘭民族運動的據點，蕭邦 1843 年在此下榻並演奏；1918 年鋼琴家帕德瑞夫斯基在此陽台演說，點燃了大波蘭起義。'},
    ],
    onSite:[
      '11:45 前到 Stary Rynek 卡位看山羊（只演一次，錯過等明天）',
      '市政廳文藝復興立面：波蘭最美的市政廳之一，1550s 義大利建築師 di Quadro 之作',
      '牛角麵包博物館的示範秀會請觀眾上台擀麵——坐前排',
    ],
  },
];

export const photoSpots = [
  {id:'waw-oldtown', cityKey:'WAW', name:'老城市集廣場', day:1, bestTime:'16:00–16:40', light:'日落前側光打在彩色立面，廣場人少'},
  {id:'waw-castle', cityKey:'WAW', name:'皇家城堡與美人魚', day:1, bestTime:'16:30–17:15', light:'順光；城堡紅牆在低角度陽光下最飽和（已對齊 Day1 實際行程 16:45–17:45）'},
  {id:'waw-culture', cityKey:'WAW', name:'科學文化宮 30F 城景', day:7, bestTime:'16:10–17:00', light:'日落後藍調 20 分鐘，城市燈與天空同亮度'},
  {id:'krk-rynek', cityKey:'KRK', name:'中央市集廣場與聖瑪利亞聖殿', day:2, bestTime:'16:00–16:45', light:'塔樓逆光，改拍東側迴廊反射光'},
  {id:'krk-wawel', cityKey:'KRK', name:'Wawel 城堡河岸', day:2, bestTime:'15:40–16:30', light:'從 Dębnicki 橋往東拍，維斯瓦河面反光'},
  {id:'krk-kazimierz', cityKey:'KRK', name:'Kazimierz 猶太區街景', day:4, bestTime:'14:30–16:00', light:'午後柔和側光，適合窄巷與塗鴉（已對齊 Day4 實際行程 14:30–16:00）'},
  {id:'wro-rynek', cityKey:'WRO', name:'市政廳與彩色老屋', day:5, bestTime:'15:50–16:35', light:'西曬正打彩色立面，是全趟最上色的一刻'},
  {id:'wro-dwarfs', cityKey:'WRO', name:'小矮人與座堂島煤氣燈', day:5, bestTime:'16:45–17:15', light:'日落約 16:29（行程期間約 16:05–16:30 區間），點燈人約 16:45 起逐盞點燈，需高感光度'},
  {id:'poz-rynek', cityKey:'POZ', name:'舊市集廣場彩色立面', day:6, bestTime:'09:00–10:30', light:'上午柔和散射光，卡位等 12:00 山羊報時（已對齊 Day6 實際行程 09:00–10:30）'},
  {id:'poz-tumski', cityKey:'POZ', name:'教堂島 Ostrów Tumski', day:6, bestTime:'15:40–16:20', light:'雙塔逆光剪影，或轉到橋上拍側光'},
];

// licenseUrl：CC 授權要求提供「授權條款本身」的 URI，不是照片來源頁（url 欄位）。
// 三個值皆為 Creative Commons 官方標準授權頁，逐一對應 license 欄位，不得自行更動。
export const photoCredits = [
  {file:'warszawa-hero.webp', city:'華沙', author:'Rhododendrites', license:'CC BY-SA 4.0', licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/', url:'https://commons.wikimedia.org/wiki/File:Market_Square_Warsaw_(22594p).jpg'},
  {file:'warszawa-thumb.webp', city:'華沙', author:'Rhododendrites', license:'CC BY-SA 4.0', licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/', url:'https://commons.wikimedia.org/wiki/File:Market_Square_Warsaw_(22594p).jpg'},
  {file:'krakow-hero.webp', city:'克拉科夫', author:'Andrzej Otrębski', license:'CC BY-SA 4.0', licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/', url:'https://commons.wikimedia.org/wiki/File:Krakow_Rynek_Glowny_panorama_2.jpg'},
  {file:'krakow-thumb.webp', city:'克拉科夫', author:'Andrzej Otrębski', license:'CC BY-SA 4.0', licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/', url:'https://commons.wikimedia.org/wiki/File:Krakow_Rynek_Glowny_panorama_2.jpg'},
  {file:'wroclaw-hero.webp', city:'樂斯拉夫', author:'Gerd Eichmann', license:'CC BY 4.0', licenseUrl:'https://creativecommons.org/licenses/by/4.0/', url:'https://commons.wikimedia.org/wiki/File:Breslau-Rynek-38-Panorama-2014-gje.jpg'},
  {file:'wroclaw-thumb.webp', city:'樂斯拉夫', author:'Gerd Eichmann', license:'CC BY 4.0', licenseUrl:'https://creativecommons.org/licenses/by/4.0/', url:'https://commons.wikimedia.org/wiki/File:Breslau-Rynek-38-Panorama-2014-gje.jpg'},
  {file:'poznan-hero.webp', city:'波茲南', author:'Mateusz.woźniak', license:'CC BY-SA 3.0', licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/', url:'https://commons.wikimedia.org/wiki/File:Poznan_stary_rynek_panorama.jpg'},
  {file:'poznan-thumb.webp', city:'波茲南', author:'Mateusz.woźniak', license:'CC BY-SA 3.0', licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/', url:'https://commons.wikimedia.org/wiki/File:Poznan_stary_rynek_panorama.jpg'},
];

// mapPins 已套用校正表 3-1（Mirror Bistro、Na Winklu 從 star1 改 food；Svensson Pierogi、Hamsa 從 sight 改 food）
// 與 3-2（克拉科夫圖釘數確認為 19，非 20）的修正，直接來自 poland-travel-guide-final.html:565 的 CITIES 物件。
export const mapPins = {
  warsaw: {
    center: [52.235, 21.01], zoom: 13,
    points: [
      [52.247744, 21.014128, "皇家城堡", "景點", "https://maps.google.com/?cid=2313057209867159998", "sight"],
      [52.249496, 20.993481, "POLIN 猶太史博物館", "景點", "https://maps.google.com/?cid=16292574584610500784", "sight"],
      [52.232394, 20.981018, "華沙起義博物館", "景點", "https://maps.google.com/?cid=12215511195580548645", "sight"],
      [52.231838, 21.005995, "科學文化宮觀景台", "景點", "https://maps.google.com/?cid=14044892037721828802", "sight"],
      [52.188512, 20.991414, "Alon Omakase ★", "米其林一星", "https://maps.google.com/?cid=8029724309073713102", "star1"],
      [52.229002, 21.023323, "NUTA ★", "米其林一星", "https://maps.google.com/?cid=4624148008162643045", "star1"],
      [52.251114, 21.036166, "hub.praga ★", "米其林一星", "https://maps.google.com/?cid=10117754456971759897", "star1"],
      [52.229941, 20.989348, "WANDAL", "必比登", "https://maps.google.com/?cid=15993615675406452524", "bib"],
      [52.236622, 20.967709, "Zagoździński", "pączki 名店", "https://maps.google.com/?cid=5270464504046978357", "food"],
      [52.252402, 21.030581, "Bar Mleczny Rusałka", "牛奶吧", "https://maps.google.com/?cid=14427558643223382901", "food"],
      [52.2333197, 21.0149273, "Pijalnia Czekolady E.Wedel（巧克力）", "伴手禮", "https://www.google.com/maps/place/?q=place_id:ChIJ--12WPTMHkcRgAvh-nOeA94", "shop"],
      [52.24935, 21.008785, "Żabka（舊城區）", "超商", "https://www.google.com/maps/place/?q=place_id:ChIJpTk0Ah_NHkcRNn4P8JcA_64", "store"],
      [52.2310334, 21.0187045, "Vitkac", "精品百貨", "https://maps.google.com/?cid=6893272886103886879", "luxury"],
      [52.2215267, 21.0204772, "Chylak（波蘭設計師包款）", "精品", "https://maps.google.com/?cid=2015234439722332980", "luxury"],
    ],
  },
  krakow: {
    center: [50.058, 19.94], zoom: 13,
    points: [
      [50.054112, 19.935423, "Wawel 皇家城堡", "景點", "https://maps.google.com/?cid=12446225081720350104", "sight"],
      [50.061897, 19.936756, "中央市集廣場", "景點", "https://maps.google.com/?cid=14107513768635600179", "sight"],
      [50.05146, 19.948594, "Kazimierz 猶太區", "景點", "https://maps.google.com/?cid=5623518211080575812", "sight"],
      [50.04743, 19.961574, "辛德勒工廠博物館", "景點", "https://maps.google.com/?cid=3670197855150446585", "sight"],
      [50.048617, 19.946137, "Bottiglieria 1881 ★★", "全波蘭唯一二星", "https://maps.google.com/?cid=8570908113421134699", "star2"],
      [50.051709, 19.949426, "Bufet KRK", "必比登", "https://maps.google.com/?cid=861978380086701482", "bib"],
      [50.051821, 19.945448, "Folga", "必比登", "https://maps.google.com/?cid=7193800786272583343", "bib"],
      [50.064873, 19.927661, "MOLÁM Thai", "必比登", "https://maps.google.com/?cid=14914780693072191645", "bib"],
      [50.051491, 19.944291, "NOAH", "必比登", "https://maps.google.com/?cid=6279990201826816109", "bib"],
      [50.049302, 19.943241, "Nat Bistro", "必比登", "https://maps.google.com/?cid=10025714057570046192", "bib"],
      [50.051871, 19.944621, "Plac Nowy (zapiekanka)", "街食", "https://maps.google.com/?cid=8198083026094069086", "food"],
      [50.053958, 19.944839, "Mirror Bistro", "★4.7 pierogi", "https://www.google.com/maps/place/?q=place_id:ChIJOwi62GpbFkcRoi0KiVCj1dk", "food"],
      [50.07068, 19.936409, "Svensson Pierogi", "餃子", "https://maps.google.com/?cid=10705718930784059170", "food"],
      [50.064037, 19.932167, "Bar Smak", "在地口碑", "https://maps.google.com/?cid=7513589258053856766", "food"],
      [50.053182, 19.947628, "Hamsa", "以色列 hummus", "https://maps.google.com/?cid=1317891001987072687", "food"],
      [50.0527854, 19.9400151, "Ceramika Bolesławiecka（陶器）", "伴手禮", "https://www.google.com/maps/place/?q=place_id:ChIJf581WqhbFkcR1_QG-8hJ4Vc", "shop"],
      [50.058364, 19.9382007, "World of Amber（琥珀）", "伴手禮", "https://www.google.com/maps/place/?q=place_id:ChIJPxlI8hJbFkcR7vI2ebLVIDk", "shop"],
      [50.06171320000001, 19.9373488, "Sukiennice 布廊（伴手禮攤位）", "伴手禮", "https://www.google.com/maps/place/?q=place_id:ChIJ3Q97Bw5bFkcRc3GzJiVsH9A", "shop"],
      [50.062638, 19.937729, "Żabka（Rynek Główny）", "超商", "https://www.google.com/maps/place/?q=place_id:ChIJN54SF4BbFkcRfqYQZ51JTN4", "store"],
    ],
  },
  wroclaw: {
    center: [51.111, 17.045], zoom: 13,
    points: [
      [51.110431, 17.030885, "中央市集廣場", "景點", "https://maps.google.com/?cid=10632303817405446655", "sight"],
      [51.114463, 17.046734, "大教堂島 Ostrów Tumski", "景點", "https://maps.google.com/?cid=3827887123396229836", "sight"],
      [51.104391, 17.07528, "Afrykarium 動物園", "景點", "https://maps.google.com/?cid=6359100319840704536", "sight"],
      [51.106953, 17.077329, "百年廳 Hala Stulecia", "UNESCO", "https://maps.google.com/?cid=10763621538599936407", "sight"],
      [51.11274, 17.031823, "BABA ★", "米其林一星", "https://maps.google.com/?cid=9335659011047272773", "star1"],
      [51.114762, 17.031129, "Most ★", "米其林一星", "https://maps.google.com/?cid=9490447263206449328", "star1"],
      [51.112463, 17.029103, "IDA kuchnia i wino", "必比登", "https://maps.google.com/?cid=10589009865057440004", "bib"],
      [51.112672, 17.034294, "Miś SC", "全城最有名牛奶吧", "https://maps.google.com/?cid=9100083269168988599", "food"],
      [51.1100658, 17.0302956, "Żabka（Rynek）", "超商", "https://www.google.com/maps/place/?q=place_id:ChIJo38OWDjDD0cREV-o0Qsuquo", "store"],
    ],
  },
  poznan: {
    center: [52.408, 16.935], zoom: 13,
    points: [
      [52.40885, 16.933775, "舊市集廣場 Stary Rynek", "景點", "https://maps.google.com/?cid=15713614103977572536", "sight"],
      [52.415606, 16.948656, "大教堂島 Ostrów Tumski", "景點", "https://maps.google.com/?cid=17624504241381771360", "sight"],
      [52.408485, 16.935041, "可頌博物館", "景點", "https://maps.google.com/?cid=402526412385617111", "sight"],
      [52.402018, 16.901852, "Palmiarnia 棕櫚屋", "景點", "https://maps.google.com/?cid=10703456143872687277", "sight"],
      [52.403967, 16.929146, "Muga ★", "波茲南唯一一星", "https://maps.google.com/?cid=2998937238608160974", "star1"],
      [52.411348, 16.952952, "Na Winklu", "★4.8 pierogi", "https://maps.google.com/?cid=17998777227118824033", "food"],
      [52.407303, 16.934127, "Szarlotta", "鴨肉餃子名店", "https://maps.google.com/?cid=8072844045178633315", "food"],
      [52.407335, 16.934281, "Żabka（Stary Rynek）", "超商", "https://www.google.com/maps/place/?q=place_id:ChIJz0qhEFVbBEcRDDtONqAeGV4", "store"],
    ],
  },
};

export const pinCategoryLegend = {
  star2:  {fill:'#B8860B', line:'#3a2a06', label:'米其林二星'},
  star1:  {fill:'#E8A81E', line:'#8a5a00', label:'米其林一星'},
  bib:    {fill:'#2f6b3f', line:'#173a20', label:'必比登推介'},
  food:   {fill:'#CE2E1E', line:'#7a1a10', label:'街食／小吃／牛奶吧'},
  sight:  {fill:'#3b6ea5', line:'#1c3a58', label:'景點'},
  shop:   {fill:'#8b5cf6', line:'#4c2f8f', label:'伴手禮店家'},
  store:  {fill:'#0891b2', line:'#0c4a5e', label:'超商 Żabka'},
  luxury: {fill:'#d6336c', line:'#7a1a3d', label:'精品購物'},
};

// attractions：逐列轉錄自 poland-travel-guide-final.html 各城「景點 · Sights」表格。
// 名稱欄含多個連結時（如「Łazienki 公園 · Wilanów 宮」），name 保留完整可讀文字，
// mapUrl 取該列第一個連結的 href（主要地標）。
export const attractions = {
  warsaw: [
    {name:'MSN 當代美術館', tag:'2024 新開', priceNote:'Plac Defilad · Gallery A 免費 · 18:00 後晚間票 PLN 30', mapUrl:'https://www.google.com/maps/search/?api=1&query=MSN%20%E7%95%B6%E4%BB%A3%E7%BE%8E%E8%A1%93%E9%A4%A8%20Warszawa'},
    {name:'Neon 霓虹博物館', tag:'遷址', priceNote:'PLN 25 / 優待 18 · 已遷入科學文化宮 4 樓（Marszałkowska 入口），可與觀景台一起看', mapUrl:'https://www.google.com/maps/search/?api=1&query=Neon%20%E9%9C%93%E8%99%B9%E5%8D%9A%E7%89%A9%E9%A4%A8%20Warszawa'},
    {name:'Kolejkowo Warszawa', tag:'2025 新開', priceNote:'微縮模型館 · 2025-04 開幕 · 適合親子', mapUrl:'https://www.google.com/maps/search/?api=1&query=Kolejkowo%20Warszawa'},
    {name:'海報博物館 Wilanów', tag:'2026 重啟', priceNote:'2026-03 全新形式 · 常設「Polish Posters. Collection」', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%B5%B7%E5%A0%B1%E5%8D%9A%E7%89%A9%E9%A4%A8%20Wilan%C3%B3w%20Warszawa'},
    {name:'波蘭歷史博物館 · Cytadela', tag:'2026 新館群', priceNote:'城堡區五館聚落（波蘭歷史／軍事／卡廷）· 華沙最大新展區 · 以官網為準', mapUrl:'https://www.google.com/maps/search/?api=1&query=Muzeum%20Historii%20Polski%20Cytadela%20Warszawa'},
    {name:'E.Wedel 巧克力體驗館', tag:'2026 新開', priceNote:'老牌 Wedel 巧克力工廠新體驗展 · 伴手禮一站購足 · 以官網為準', mapUrl:'https://www.google.com/maps/search/?api=1&query=E.Wedel%20Chocolate%20Warszawa'},
    {name:'皇家城堡', tag:'★4.7（59,094） UNESCO', priceNote:'分路線售票：博物館/王室路線 60/45 · 城堡路線 95/75 · 宮殿路線 30/20 · 金票(全區) 110/90 · 週三免費(縮短版)', mapUrl:'https://maps.google.com/?cid=2313057209867159998'},
    {name:'華沙起義博物館', tag:'★4.7（39,247） 歷史', priceNote:'PLN 35 / 優待 30 · 熱門建議預約 · 週二休', mapUrl:'https://maps.google.com/?cid=12215511195580548645'},
    {name:'POLIN 猶太史博物館', tag:'★4.6（21,056） 歷史', priceNote:'PLN 45 / 優待 35 · 週四免費 · 週二休（非週一）', mapUrl:'https://maps.google.com/?cid=16292574584610500784'},
    {name:'科學文化宮觀景台', tag:'★4.6（86,217） 地標', priceNote:'PLN 30 / 優待 25 · 237m 全城最高', mapUrl:'https://maps.google.com/?cid=14044892037721828802'},
    {name:'Łazienki 公園 · Wilanów 宮', tag:'皇家之路', priceNote:'公園免費 · 宮殿另購票', mapUrl:'https://www.google.com/maps/search/?api=1&query=%C5%81azienki%20%E5%85%AC%E5%9C%92%20Warszawa'},
    {name:'蕭邦博物館', tag:'閉館', priceNote:'2026 整年閉館（整修）', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E8%95%AD%E9%82%A6%E5%8D%9A%E7%89%A9%E9%A4%A8%20Warszawa'},
  ],
  krakow: [
    {name:'Wawel 皇家城堡群', tag:'★4.7（166,020） 逐展售票', priceNote:'各展分開售票：王冠寶庫 47 / 優待 35（含皇家花園）· 單展多為 30–47 zł · 全區聯票「Wawel dla pasjonatów」199 / 149 · 週一 10–16 部分展區限量免費 · 11/1、11/11 部分展區閉館', mapUrl:'https://maps.google.com/?cid=12446225081720350104'},
    {name:'中央市集廣場 · 紡織會館', tag:'★4.8（187,948） 地標', priceNote:'歐洲最大中世紀廣場（Rynek Główny）· 廣場免費', mapUrl:'https://maps.google.com/?cid=14107513768635600179'},
    {name:'Kazimierz 猶太區', tag:'★4.4（5,589） 街區', priceNote:'猶太會堂、餐酒館、街食聚集', mapUrl:'https://maps.google.com/?cid=5623518211080575812'},
    {name:'辛德勒工廠博物館', tag:'★4.5（25,993） 需訂', priceNote:'PLN 60 / 優待 45 · ul. Lipowa 4 · 週一 10–15、週二–日 9–20、每月第一個週二休 · 11/1、11/3、11/11 閉館', mapUrl:'https://maps.google.com/?cid=3670197855150446585'},
    {name:'維利奇卡鹽礦', tag:'★4.6（36,491） 需票', priceNote:'UNESCO · Kinga 鹽教堂 · 恆溫 17–18°C · 英語團 143 / 優待 121（含導覽）· 11/1 閉館 · 官網 bilety.kopalnia.pl', mapUrl:'https://maps.google.com/?cid=10891192289792865301'},
    {name:'奧斯威辛-比克瑙', tag:'需訂', priceNote:'日歸 · 入場免費須線上預約（2026/3 起僅線上、現場不售）· 10–11 月上午強制跟導覽 約 130–150（優待 120）· 免費自由參觀僅下午（11 月 14:00 起）· 提前 2–3 週訂', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E5%A5%A7%E6%96%AF%E5%A8%81%E8%BE%9B-%E6%AF%94%E5%85%8B%E7%91%99%20Krak%C3%B3w'},
  ],
  wroclaw: [
    {name:'小矮人 Krasnale 尋寶', tag:'★4.9（91） 免費', priceNote:'全城 1000+ 尊小銅像 · Rynek／Plac Solny／Świdnicka 密度最高', mapUrl:'https://maps.google.com/?cid=10632303817405446655'},
    {name:'中央市集廣場 · 市政廳塔', tag:'地標', priceNote:'彩色山牆屋 · 觀景塔', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E4%B8%AD%E5%A4%AE%E5%B8%82%E9%9B%86%E5%BB%A3%E5%A0%B4%20Wroc%C5%82aw'},
    {name:'大教堂島 Ostrów Tumski', tag:'★4.9（3,270） 古城', priceNote:'全城最古老城區', mapUrl:'https://maps.google.com/?cid=3827887123396229836'},
    {name:'Afrykarium · 動物園', tag:'熱門', priceNote:'PLN 60 / 優待 50 · 波蘭最多人造訪付費景點 · 全球唯一非洲主題水族館 · 線上購票', mapUrl:'https://www.google.com/maps/search/?api=1&query=Afrykarium%20Wroc%C5%82aw'},
    {name:'Panorama Racławicka', tag:'全景畫', priceNote:'PLN 50 / 優待 35 · 圓形巨幅戰役畫 · 週一休', mapUrl:'https://www.google.com/maps/search/?api=1&query=Panorama%20Rac%C5%82awicka%20Wroc%C5%82aw'},
    {name:'百年廳 Hala Stulecia', tag:'★4.7（15,074） UNESCO', priceNote:'PLN 25 / 優待 20（多媒體常設展）· 每日開放 10:00–18:00 · 圓頂偶因活動關閉，行前 3–5 天查 halastulecia.pl 確認 · 近多媒體噴泉 Pergola', mapUrl:'https://maps.google.com/?cid=10763621538599936407'},
    {name:'Hydropolis 水知識中心', tag:'室內', priceNote:'PLN 45（週末 47）/ 優待 36 · 雨備好選擇', mapUrl:'https://www.google.com/maps/search/?api=1&query=Hydropolis%20%E6%B0%B4%E7%9F%A5%E8%AD%98%E4%B8%AD%E5%BF%83%20Wroc%C5%82aw'},
    {name:'Kolejkowo 微縮館', tag:'室內', priceNote:'PLN 55 / 優待 45 · Sky Tower 1 樓', mapUrl:'https://www.google.com/maps/search/?api=1&query=Kolejkowo%20%E5%BE%AE%E7%B8%AE%E9%A4%A8%20Wroc%C5%82aw'},
  ],
  poznan: [
    {name:'舊市集廣場 Stary Rynek', tag:'2024 重修', priceNote:'鋪面與無障礙全面翻新 · 彩色商人屋 · 四座神話噴泉 · 免費', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E8%88%8A%E5%B8%82%E9%9B%86%E5%BB%A3%E5%A0%B4%20Stary%20Rynek%20Pozna%C5%84'},
    {name:'市政廳正午山羊鐘', tag:'免費', priceNote:'每日正午兩隻機械山羊頂角 12 次（部分資料另有 15:00 場，現場再確認）', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E5%B8%82%E6%94%BF%E5%BB%B3%E6%AD%A3%E5%8D%88%E5%B1%B1%E7%BE%8A%E9%90%98%20Pozna%C5%84'},
    {name:'可頌博物館 Rogalowe Muzeum', tag:'★4.8（6,115） 特色', priceNote:'PLN 39 / 優待 35 起（場次制展演）· 市政廳對面 · 週日–五 11:00–15:30、週六 11:00–17:00', mapUrl:'https://maps.google.com/?cid=402526412385617111'},
    {name:'古市政廳博物館', tag:'歷史', priceNote:'2026/7/1–2027/11/30 整修閉館，行程期間無法入內，僅能外觀', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E5%8F%A4%E5%B8%82%E6%94%BF%E5%BB%B3%E5%8D%9A%E7%89%A9%E9%A4%A8%20Pozna%C5%84'},
    {name:'帝王城堡 Zamek Cesarski', tag:'地標', priceNote:'CK Zamek 文化中心，多為免費入場，特展/導覽另計，每日 10:00–21:00', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E5%B8%9D%E7%8E%8B%E5%9F%8E%E5%A0%A1%20Zamek%20Cesarski%20Pozna%C5%84'},
    {name:'大教堂島 Ostrów Tumski', tag:'古城', priceNote:'波蘭建國搖籃', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E5%A4%A7%E6%95%99%E5%A0%82%E5%B3%B6%20Ostr%C3%B3w%20Tumski%20Pozna%C5%84'},
    {name:'Palmiarnia 棕櫚屋', tag:'★4.7（21,152） 室內', priceNote:'PLN 19 / 優待 15 · 歐洲最大棕櫚屋之一 · 內有波蘭首座公共水族館', mapUrl:'https://maps.google.com/?cid=10703456143872687277'},
    {name:'考古博物館', tag:'室內', priceNote:'PLN 10 / 優待 6 · 週二免費（非週六）· 埃及展', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E8%80%83%E5%8F%A4%E5%8D%9A%E7%89%A9%E9%A4%A8%20Pozna%C5%84'},
    {name:'Stary Browar · Malta 湖 · Citadel 公園', tag:'戶外／購物', priceNote:'Śródka 有壁畫街拍點', mapUrl:'https://www.google.com/maps/search/?api=1&query=Stary%20Browar%20Pozna%C5%84'},
  ],
};
