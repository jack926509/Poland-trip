// 2026-08 門票速查；動態票價與開放時間仍以各景點官網為準。
export const fares = [
  {name:'華沙 · 皇家城堡', fullPrice:'30–110', discountPrice:'20–90', note:'分路線售票，見上方明細 · 週三免費', officialUrl:'https://www.zamek-krolewski.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E8%8F%AF%E6%B2%99%20%E7%9A%87%E5%AE%B6%E5%9F%8E%E5%A0%A1'},
  {name:'華沙 · 科學文化宮觀景台', fullPrice:'30', discountPrice:'25', note:'已更新（原標 25）', officialUrl:'https://pkin.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E8%8F%AF%E6%B2%99%20%E7%A7%91%E5%AD%B8%E6%96%87%E5%8C%96%E5%AE%AE%E8%A7%80%E6%99%AF%E5%8F%B0'},
  {name:'華沙 · Neon 霓虹博物館', fullPrice:'25', discountPrice:'18', note:'科學文化宮 4 樓', officialUrl:'https://www.neonmuzeum.org/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E8%8F%AF%E6%B2%99%20Neon%20%E9%9C%93%E8%99%B9%E5%8D%9A%E7%89%A9%E9%A4%A8'},
  {name:'華沙 · MSN 當代美術館', fullPrice:'免費', discountPrice:'—', note:'Gallery A 免費 · 晚間票 30', officialUrl:'https://artmuseum.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E8%8F%AF%E6%B2%99%20MSN%20%E7%95%B6%E4%BB%A3%E7%BE%8E%E8%A1%93%E9%A4%A8'},
  {name:'華沙 · 波蘭歷史博物館', fullPrice:'以官網', discountPrice:'—', note:'2026 新館群（城堡區）', officialUrl:'https://muzhp.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E8%8F%AF%E6%B2%99%20%E6%B3%A2%E8%98%AD%E6%AD%B7%E5%8F%B2%E5%8D%9A%E7%89%A9%E9%A4%A8%20Warszawa'},
  {name:'華沙 · E.Wedel 巧克力體驗館', fullPrice:'以官網', discountPrice:'—', note:'2026 新開', officialUrl:'https://fabrykaczekolady.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E8%8F%AF%E6%B2%99%20E.Wedel%20Warszawa'},
  {name:'克拉科夫 · Wawel 王冠寶庫', fullPrice:'47', discountPrice:'35', note:'含皇家花園 · 逐展售票', officialUrl:'https://wawel.krakow.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E5%85%8B%E6%8B%89%E7%A7%91%E5%A4%AB%20Wawel%20%E7%8E%8B%E5%86%A0%E5%AF%B6%E5%BA%AB'},
  {name:'克拉科夫 · Wawel 全區聯票', fullPrice:'199', discountPrice:'149', note:'Wawel dla pasjonatów', officialUrl:'https://wawel.krakow.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E5%85%8B%E6%8B%89%E7%A7%91%E5%A4%AB%20Wawel%20%E5%85%A8%E5%8D%80%E8%81%AF%E7%A5%A8'},
  {name:'克拉科夫 · 辛德勒工廠', fullPrice:'60', discountPrice:'45', note:'ul. Lipowa 4', officialUrl:'https://muzeumkrakowa.pl/oddzialy/fabryka-emalia-oskara-schindlera', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E5%85%8B%E6%8B%89%E7%A7%91%E5%A4%AB%20%E8%BE%9B%E5%BE%B7%E5%8B%92%E5%B7%A5%E5%BB%A0'},
  {name:'克拉科夫 · 維利奇卡鹽礦', fullPrice:'143', discountPrice:'121', note:'英語團含導覽 · 11/1 休', officialUrl:'https://www.kopalnia.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E5%85%8B%E6%8B%89%E7%A7%91%E5%A4%AB%20%E7%B6%AD%E5%88%A9%E5%A5%87%E5%8D%A1%E9%B9%BD%E7%A4%A6%20Wieliczka'},
  {name:'克拉科夫 · 奧斯威辛', fullPrice:'免費*', discountPrice:'—', note:'*須線上預約 · 上午強制導覽 130–150', officialUrl:'https://visit.auschwitz.org/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E5%85%8B%E6%8B%89%E7%A7%91%E5%A4%AB%20%E5%A5%A7%E6%96%AF%E5%A8%81%E8%BE%9B%20O%C5%9Bwi%C4%99cim'},
  {name:'樂斯拉夫 · Afrykarium／動物園', fullPrice:'~60', discountPrice:'50', note:'線上購票 · 動態定價', officialUrl:'https://zoo.wroclaw.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%A8%82%E6%96%AF%E6%8B%89%E5%A4%AB%20Afrykarium%EF%BC%8F%E5%8B%95%E7%89%A9%E5%9C%92'},
  {name:'樂斯拉夫 · Panorama Racławicka', fullPrice:'50', discountPrice:'35', note:'官網優待價已補上', officialUrl:'https://mnwr.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%A8%82%E6%96%AF%E6%8B%89%E5%A4%AB%20Panorama%20Rac%C5%82awicka'},
  {name:'樂斯拉夫 · 百年廳', fullPrice:'25', discountPrice:'20', note:'每日開放 · 10/28（本行程當天）圓頂展廳不開放（已查證，見 Day 5）；行前 3–5 天仍建議上官網再確認', officialUrl:'https://www.halastulecia.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%A8%82%E6%96%AF%E6%8B%89%E5%A4%AB%20%E7%99%BE%E5%B9%B4%E5%BB%B3'},
  {name:'樂斯拉夫 · Hydropolis', fullPrice:'45', discountPrice:'36', note:'週末全票 47', officialUrl:'https://hydropolis.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%A8%82%E6%96%AF%E6%8B%89%E5%A4%AB%20Hydropolis'},
  {name:'樂斯拉夫 · Kolejkowo', fullPrice:'55', discountPrice:'45', note:'Sky Tower 1 樓', officialUrl:'https://kolejkowo.pl/wroclaw', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%A8%82%E6%96%AF%E6%8B%89%E5%A4%AB%20Kolejkowo'},
  {name:'波茲南 · Palmiarnia 棕櫚屋', fullPrice:'19', discountPrice:'15', note:'', officialUrl:'http://www.palmiarnia.poznan.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%B3%A2%E8%8C%B2%E5%8D%97%20Palmiarnia%20%E6%A3%95%E6%AB%9A%E5%B1%8B'},
  {name:'波茲南 · 可頌博物館', fullPrice:'39 起', discountPrice:'35 起', note:'場次制，非自由參觀', officialUrl:'https://rogalowemuzeum.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%B3%A2%E8%8C%B2%E5%8D%97%20%E5%8F%AF%E9%A0%8C%E5%8D%9A%E7%89%A9%E9%A4%A8'},
  {name:'波茲南 · 帝王城堡', fullPrice:'多免費', discountPrice:'—', note:'CK Zamek 文化中心', officialUrl:'https://ckzamek.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%B3%A2%E8%8C%B2%E5%8D%97%20%E5%B8%9D%E7%8E%8B%E5%9F%8E%E5%A0%A1'},
  {name:'波茲南 · 古市政廳博物館', fullPrice:'閉館中', discountPrice:'—', note:'2026/7–2027/11 整修，行程期間不開放', officialUrl:'https://mnp.art.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%B3%A2%E8%8C%B2%E5%8D%97%20%E5%8F%A4%E5%B8%82%E6%94%BF%E5%BB%B3%E5%8D%9A%E7%89%A9%E9%A4%A8'},
  {name:'波茲南 · 考古博物館', fullPrice:'10', discountPrice:'6', note:'週二免費', officialUrl:'https://www.muzarp.poznan.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%B3%A2%E8%8C%B2%E5%8D%97%20%E8%80%83%E5%8F%A4%E5%8D%9A%E7%89%A9%E9%A4%A8'},
];

// 舊版城市分組保留作快速對照，括號內指向上方較新的 fares 資料。
export const ticketsByCity = [
  {city:'華沙', items:[
    ['皇家城堡', 'PLN 50 / 40 / 100 分級 · 週三免費（新版分路線售票見 fares）'],
    ['POLIN 猶太歷史', 'PLN 45 · 週四免費'],
    ['華沙起義博物館', 'PLN 35 · discount 30'],
    ['蕭邦博物館', '2026 整年閉館'],
    ['科學文化宮觀景台', 'PLN 25（新版見 fares：30/優待 25）'],
    ['MSN 現代藝術博物館', 'Gallery A 免費 · 18:00 後晚間票 PLN 30'],
  ]},
  {city:'克拉科夫', items:[
    ['瓦維爾城堡套票', 'PLN 45–65'],
    ['辛德勒工廠', 'PLN 60 · 優待 45（以官網為準）'],
    ['聖瑪麗教堂登塔', 'PLN 20'],
    ['奧斯威辛 Educator 導覽', 'PLN 150（新版見 fares：約 130–150／優待 120）'],
    ['維利奇卡鹽礦', 'PLN 143 · 優待 121'],
    ['地下市集博物館', 'PLN 32'],
  ]},
  {city:'樂斯拉夫', items:[
    ['百年廳 Hala Stulecia', 'PLN 30 · ❗10/28 圓頂展廳不開放（新版票價見 fares：25／優待 20）'],
    ['拉茨瓦維採全景畫', 'PLN 50'],
  ]},
  {city:'波茲南', items:[
    ['牛角麵包博物館', 'PLN 25'],
    ['帝王城堡', 'PLN 16（新版見 fares：多為免費）'],
    ['古市政廳博物館', '❗2026/7–2027/11 整修閉館，行程期間無法入內（見 fares）'],
  ]},
];

export const ticketNotices = [
  {status:'待確認', text:'Auschwitz 訂票開放時間兩份資料差距很大（一說參觀日前 90 天、一說提前 2–3 週）。官方頁面目前已可訂本次日期，仍建議直接以 visit.auschwitz.org 顯示狀態為準。', url:'https://visit.auschwitz.org/'},
];
