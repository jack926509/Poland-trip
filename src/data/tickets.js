// 2026-08-08 逐項以景點官網查證；價格單位均為 PLN。
export const fares = [
  {name:'華沙 · 皇家城堡', fullPrice:'30–110', discountPrice:'20–90', note:'二–日 10:00–18:00，最後入場 17:00；路線票 30–110，週三限量免費路線', officialUrl:'https://www.zamek-krolewski.pl/en/strona/opening-hours-and-ticket-prices/2801-opening-hours-and-ticket-prices-may-2-2026', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E8%8F%AF%E6%B2%99%20%E7%9A%87%E5%AE%B6%E5%9F%8E%E5%A0%A1'},
  {name:'華沙 · 科學文化宮觀景台', fullPrice:'30', discountPrice:'25', note:'已更新（原標 25）', officialUrl:'https://pkin.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E8%8F%AF%E6%B2%99%20%E7%A7%91%E5%AD%B8%E6%96%87%E5%8C%96%E5%AE%AE%E8%A7%80%E6%99%AF%E5%8F%B0'},
  {name:'華沙 · Neon 霓虹博物館', fullPrice:'25', discountPrice:'18', note:'科學文化宮 4 樓；一–四 11:00–18:00、五–六至 19:00、日 11:00–18:00', officialUrl:'https://www.neonmuzeum.org/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E8%8F%AF%E6%B2%99%20Neon%20%E9%9C%93%E8%99%B9%E5%8D%9A%E7%89%A9%E9%A4%A8'},
  {name:'華沙 · MSN 當代美術館', fullPrice:'40', discountPrice:'30', note:'二–四／六 11:00–19:00、五至 20:00、日至 18:00；18:00 後 25／15，Gallery A 免費', officialUrl:'https://artmuseum.pl/en/visit', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E8%8F%AF%E6%B2%99%20MSN%20%E7%95%B6%E4%BB%A3%E7%BE%8E%E8%A1%93%E9%A4%A8'},
  {name:'華沙 · 波蘭歷史博物館', fullPrice:'以官網', discountPrice:'—', note:'華沙城堡區新館已於 2023 開館；常設展仍在建置，先查當期臨展', officialUrl:'https://muzhp.pl/en/about-museum', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E8%8F%AF%E6%B2%99%20%E6%B3%A2%E8%98%AD%E6%AD%B7%E5%8F%B2%E5%8D%9A%E7%89%A9%E9%A4%A8%20Warszawa'},
  {name:'華沙 · E.Wedel 巧克力工廠博物館', fullPrice:'依場次', discountPrice:'依場次', note:'2024 開館；每日 10:00–20:00，最後一團 18:15，導覽約 90 分', officialUrl:'https://fabrykaczekolady.pl/en/contact-us', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E8%8F%AF%E6%B2%99%20E.Wedel%20Warszawa'},
  {name:'克拉科夫 · Wawel 王冠寶庫', fullPrice:'47', discountPrice:'35', note:'含皇家花園 · 逐展售票', officialUrl:'https://wawel.krakow.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E5%85%8B%E6%8B%89%E7%A7%91%E5%A4%AB%20Wawel%20%E7%8E%8B%E5%86%A0%E5%AF%B6%E5%BA%AB'},
  {name:'克拉科夫 · Wawel 城堡一、二樓', fullPrice:'95', discountPrice:'71', note:'二–日 09:00–17:00；完整路線最後入場 15:00，約需 2 小時', officialUrl:'https://wawel.krakow.pl/en/what-to-see', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E5%85%8B%E6%8B%89%E7%A7%91%E5%A4%AB%20Wawel%20%E5%9F%8E%E5%A0%A1'},
  {name:'克拉科夫 · 辛德勒工廠', fullPrice:'60', discountPrice:'45', note:'ul. Lipowa 4', officialUrl:'https://muzeumkrakowa.pl/oddzialy/fabryka-emalia-oskara-schindlera', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E5%85%8B%E6%8B%89%E7%A7%91%E5%A4%AB%20%E8%BE%9B%E5%BE%B7%E5%8B%92%E5%B7%A5%E5%BB%A0'},
  {name:'克拉科夫 · 維利奇卡鹽礦', fullPrice:'日期選擇器', discountPrice:'日期選擇器', note:'英語導覽的 10/27 實際票價、場次與庫存以官網日期選擇器為準；通用頁僅列 from 131 PLN', officialUrl:'https://www.wieliczka-saltmine.com/individual-tourist/useful-information/ticket-prices-and-visiting-hours', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E5%85%8B%E6%8B%89%E7%A7%91%E5%A4%AB%20%E7%B6%AD%E5%88%A9%E5%A5%87%E5%8D%A1%E9%B9%BD%E7%A4%A6%20Wieliczka'},
  {name:'克拉科夫 · 奧斯威辛', fullPrice:'依訂票頁', discountPrice:'依資格', note:'所有入場證僅能線上取得；10 月 07:30–16:00 只能跟官方導覽，16:00 後才有免費自導時段', officialUrl:'https://www.auschwitz.org/en/visiting/guided-tours-for-individual-visitors/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E5%85%8B%E6%8B%89%E7%A7%91%E5%A4%AB%20%E5%A5%A7%E6%96%AF%E5%A8%81%E8%BE%9B%20O%C5%9Bwi%C4%99cim'},
  {name:'樂斯拉夫 · Afrykarium／動物園', fullPrice:'~60', discountPrice:'50', note:'線上購票 · 動態定價', officialUrl:'https://zoo.wroclaw.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%A8%82%E6%96%AF%E6%8B%89%E5%A4%AB%20Afrykarium%EF%BC%8F%E5%8B%95%E7%89%A9%E5%9C%92'},
  {name:'樂斯拉夫 · Panorama Racławicka', fullPrice:'50', discountPrice:'35', note:'官網優待價已補上', officialUrl:'https://mnwr.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%A8%82%E6%96%AF%E6%8B%89%E5%A4%AB%20Panorama%20Rac%C5%82awicka'},
  {name:'樂斯拉夫 · 百年廳 Visitor Centre', fullPrice:'25', discountPrice:'20', note:'四–十月二–日 10:00–18:00；加看百年廳內部為 30／25，內部仍依活動日曆開放', officialUrl:'https://halastulecia.pl/zwiedzanie/visitor-centre/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%A8%82%E6%96%AF%E6%8B%89%E5%A4%AB%20%E7%99%BE%E5%B9%B4%E5%BB%B3'},
  {name:'樂斯拉夫 · Hydropolis', fullPrice:'45', discountPrice:'36', note:'週末全票 47', officialUrl:'https://hydropolis.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%A8%82%E6%96%AF%E6%8B%89%E5%A4%AB%20Hydropolis'},
  {name:'樂斯拉夫 · Kolejkowo', fullPrice:'50', discountPrice:'40', note:'Sky Tower 1 樓；每日 10:00 起，結束時間依官方日期日曆', officialUrl:'https://kolejkowo.pl/wroclaw/godziny-otwarcia', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%A8%82%E6%96%AF%E6%8B%89%E5%A4%AB%20Kolejkowo'},
  {name:'波茲南 · Palmiarnia 棕櫚屋', fullPrice:'19', discountPrice:'15', note:'', officialUrl:'http://www.palmiarnia.poznan.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%B3%A2%E8%8C%B2%E5%8D%97%20Palmiarnia%20%E6%A3%95%E6%AB%9A%E5%B1%8B'},
  {name:'波茲南 · 可頌博物館', fullPrice:'官方售票頁', discountPrice:'官方售票頁', note:'週四英語場、價格與庫存依 10/29 官方售票頁確認；不要以週末固定英文場或舊價格預設', officialUrl:'https://rogalowemuzeum.pl/en/buy-ticket/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%B3%A2%E8%8C%B2%E5%8D%97%20%E5%8F%AF%E9%A0%8C%E5%8D%9A%E7%89%A9%E9%A4%A8'},
  {name:'波茲南 · 帝王城堡', fullPrice:'依展覽／導覽', discountPrice:'依展覽', note:'現為 CK ZAMEK 文化中心，不是固定票價的宮殿博物館；依當日活動與可參觀空間為準', officialUrl:'https://ckzamek.pl/podstrony/6071-zwiedzanie-zamku/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%B3%A2%E8%8C%B2%E5%8D%97%20%E5%B8%9D%E7%8E%8B%E5%9F%8E%E5%A0%A1'},
  {name:'波茲南 · 古市政廳博物館', fullPrice:'閉館中', discountPrice:'—', note:'整修中；官方預計 2027 年底至 2028 年初才全面重開', officialUrl:'https://www.msu.mnp.art.pl/profile/wizyta-ratusz-muzeum-poznania', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%B3%A2%E8%8C%B2%E5%8D%97%20%E5%8F%A4%E5%B8%82%E6%94%BF%E5%BB%B3%E5%8D%9A%E7%89%A9%E9%A4%A8'},
  {name:'波茲南 · 考古博物館', fullPrice:'10', discountPrice:'6', note:'週二免費', officialUrl:'https://www.muzarp.poznan.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%B3%A2%E8%8C%B2%E5%8D%97%20%E8%80%83%E5%8F%A4%E5%8D%9A%E7%89%A9%E9%A4%A8'},
];

// 舊版城市分組保留作快速對照，括號內指向上方較新的 fares 資料。
export const ticketsByCity = [
  {city:'華沙', items:[
    ['皇家城堡', 'PLN 50 / 40 / 100 分級 · 週三免費（新版分路線售票見 fares）'],
    ['POLIN 猶太歷史', '週五 10:00–18:00；票價與指定日庫存看官方售票頁'],
    ['華沙起義博物館', 'PLN 35 · discount 30'],
    ['蕭邦博物館', '2026 整年閉館'],
    ['科學文化宮觀景台', 'PLN 25（新版見 fares：30/優待 25）'],
    ['MSN 現代藝術博物館', '展覽 40／30 · 18:00 後 25／15 · Gallery A 免費'],
  ]},
  {city:'克拉科夫', items:[
    ['瓦維爾城堡完整路線', 'PLN 95／71 · 最後入場 15:00'],
    ['辛德勒工廠', 'PLN 60 · 優待 45（以官網為準）'],
    ['聖瑪麗教堂登塔', 'PLN 20'],
    ['奧斯威辛 Educator 導覽', '依官方訂票頁當日場次；10 月上午必須跟團'],
    ['維利奇卡鹽礦', '10/27 英文場、實際票價與庫存看官方日期選擇器'],
    ['地下市集博物館', 'PLN 45／35'],
  ]},
  {city:'樂斯拉夫', items:[
    ['百年廳 Hala Stulecia', 'Visitor Centre 25／20；含廳內 30／25，內部依活動日曆'],
    ['拉茨瓦維採全景畫', 'PLN 50'],
  ]},
  {city:'波茲南', items:[
    ['牛角麵包博物館', '10/29 週四英語場、價格與庫存看官方售票頁'],
    ['帝王城堡', '展覽依當日公告；語音導覽 10 PLN（12:00–20:00，19:00 前借用）'],
    ['古市政廳博物館', '整修閉館；預計 2027 年底至 2028 年初全面重開'],
  ]},
];

export const ticketNotices = [
  {status:'已查證', text:'資料查證日為 2026-08-08。奧斯威辛自 2026-03-01 起所有入場證只在線上提供；本行程 10:00 入場必須購買官方導覽場次。', url:'https://www.auschwitz.org/en/visiting/'},
  {status:'開賣再確認', text:'博物館活動、臨時閉館與可售場次仍可能調整；本站不把「查證過」誤寫成「已訂到」，購票時請以官方日曆為準。', url:'https://visit.auschwitz.org/'},
];
