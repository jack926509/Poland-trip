import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { days } from '../src/data/trip.js';
import { daySupplementaryPins, dayPinStepRows, pinCoordinateCheckedAt } from '../src/data/day-maps.js';
import { makeDayMap } from '../src/lib/day-map.mjs';
import { auditDay5SupplementaryPins } from '../tools/audit-map-pins.mjs';
const day = days.find(d => d.n === 5);
const points = makeDayMap(day).points;
const pin = name => points.find(p => p[2] === name);

test('Day 5 六顆修正點採查證座標，新增點有 OSM 來源與日期', () => {
  for (const [name, lat, lon] of [
    ['Papa Krasnal 小矮人', 51.1075437, 17.0325128],
    ['糖果屋雙屋 Jaś i Małgosia', 51.111148, 17.030584],
    ['國家博物館 Słodki Chłopak', 51.1107113, 17.0475408],
    ['InfoCentrum', 51.1139403, 17.0458114],
    ['Piast', 51.10013, 17.03569],
    ['樂斯拉夫主教座堂', 51.114616, 17.046989],
  ]) assert.deepEqual(pin(name).slice(0, 2), [lat, lon]);
  for (const [name, source] of [
    ['Papa Krasnal 小矮人', 'node/309596819'], ['糖果屋雙屋 Jaś i Małgosia', 'way/101206992'],
    ['國家博物館 Słodki Chłopak', 'node/1452237509'], ['InfoCentrum', 'node/5246108121'],
  ]) {
    assert.equal(pin(name)[6], `https://www.openstreetmap.org/${source}`);
    assert.equal(pinCoordinateCheckedAt[5][name], '2026-10-27');
  }
  const meters = (a, b) => Math.hypot((a[0]-b[0])*111320, (a[1]-b[1])*111320*Math.cos(a[0]*Math.PI/180));
  assert.ok(meters(pin('Papa Krasnal 小矮人'), [51.108896,17.026714]) > 100);
  assert.ok(meters(pin('糖果屋雙屋 Jaś i Małgosia'), [51.11169,17.029114]) > 100);
  assert.match(pin('InfoCentrum')[3], /辦公室.*未驗證.*出發前再確認/);
  assert.doesNotMatch(pin('Papa Krasnal 小矮人')[3], /地下道旁/);
  assert.ok(!pin('Dessert Boutique'));
  for (const [name, queryName] of [['InfoCentrum', 'InfoCentrum'], ['國家博物館 Słodki Chłopak', 'Słodki Chłopak']]) {
    assert.match(pin(name)[4], /search\/\?api=1&query=.*%/);
    assert.ok(new URL(pin(name)[4]).searchParams.get('query').includes(queryName));
  }
  assert.equal(new URL(pin('國家博物館 Słodki Chłopak')[4]).searchParams.get('query'), 'Słodki Chłopak, pl. Powstańców Warszawy 5, Wrocław');
});

const order = [
  ['Piast','1a·20',[1,20]], ['Papa Krasnal 小矮人','1b',[1]], ['Central Cafe','2',[2]],
  ['白鸛猶太會堂','3',[3]], ['鹽廣場 Plac Solny','4',[4]], ['中央市集廣場','5',[5]],
  ['糖果屋雙屋 Jaś i Małgosia','6a',[6]], ['聖伊莉莎白教堂','6b',[6]], ['屠夫巷 Jatki','6c',[6]],
  ['El Gato Specialty Coffee','7',[7]], ['大學主樓 Uniwersytet Wrocławski','8',[8]],
  ['Restauracja Wrocławska','10',[10]], ['拉茨瓦維採全景畫（外觀）','11',[11]],
  ['國家博物館 Słodki Chłopak','12',[12]], ['Hala Targowa 市場大廳','14',[14]], ['Słodowa 島','15',[15]],
  ['沙上聖母堂','16',[16]], ['座堂橋 Most Tumski','17a',[17]], ['大教堂島 Ostrów Tumski','17b',[17]],
  ['樂斯拉夫主教座堂','17c',[17]], ['InfoCentrum','18',[18]], ['Wroclavia 購物中心','21',[21]], ['Wrocław Główny','22',[22]],
];
test('Day 5 每顆標籤對回時間表列序，走法依列號與 a/b/c 單調', () => {
  assert.equal(points.length, order.length);
  const pinNames = new Set(points.map(p => p[2]));
  for (const name of Object.keys(dayPinStepRows[5])) {
    assert.ok(pinNames.has(name), `Day 5 列號對照的圖釘名稱不存在：${name}`);
  }
  for (const [row, text] of [[1, /Papa Krasnal/], [3, /白鸛/], [11, /Panorama/], [17, /座堂/], [20, /Piast/]]) {
    const step = day.steps[row - 1];
    assert.match(`${step.label} ${step.sub}`, text);
  }
  for (const [name,label,rows] of order) {
    assert.equal(pin(name)[9], label);
    assert.deepEqual(pin(name)[10], rows);
    for (const row of rows) assert.ok(day.steps[row-1]);
    assert.deepEqual(label.split('·').map(s => Number.parseInt(s)), rows);
  }
  const actual = order.map(([name]) => pin(name)[9].split('·')[0]);
  assert.deepEqual(actual, [...actual].sort((a,b)=>Number.parseInt(a)-Number.parseInt(b) || a.localeCompare(b)));
  assert.ok(!points.some(p=>p[10].includes(19)));
  assert.match(day.steps[10].label, /前往 Panorama/);
  assert.match(day.steps[11].label, /國家博物館.*Słodki Chłopak/);
  assert.match(day.steps[17].label, /InfoCentrum/);
});

test('Day 5 補充點稽核涵蓋有限座標、範圍、HTTPS、來源、日期與重名', () => {
  assert.deepEqual(auditDay5SupplementaryPins().issues, []);
  for (const [index,value] of [[0,NaN],[0,52],[1,18],[4,'http://example.com'],[6,null],[5,'invalid']]) {
    const bad = daySupplementaryPins[5].map(p=>[...p]); bad[0][index]=value;
    assert.ok(auditDay5SupplementaryPins(bad).issues.length);
  }
  assert.ok(auditDay5SupplementaryPins([...daySupplementaryPins[5],daySupplementaryPins[5][0]]).issues.length);
  assert.ok(auditDay5SupplementaryPins(daySupplementaryPins[5], {}).issues.length);
});

const otherDays = [[1,[]],[2,[["ibis budget Krakow Stare Miasto",11,"11"],["Kraków Główny",10,"10"]]],[3,[["Auschwitz I 訪客服務中心／入口",4,"4"],["Auschwitz II–Birkenau 主入口",null,null]]],[4,[["ibis budget Krakow Stare Miasto",9,"9"],["維利奇卡鹽礦 Daniłowicz Shaft",4,"4"],["Sztolnia Wieliczka",5,"5"],["Obwarzanek Krakowski - Tunel",8,"8"],["Wieliczka Rynek-Kopalnia 車站",6,"6"],["Kraków Główny",10,"10"]]],[7,[["皇家城堡",11,"11a"],["科學文化宮觀景台",3,"3b"],["Pijalnia Czekolady E.Wedel（巧克力）",24,"24"],["Złote Tarasy",20,"20"],["Tamka 街蕭邦長椅",15,"15b"],["Hotel Metropol",1,"1·21"],["哥白尼紀念碑 Pomnik Kopernika",15,"15a"],["聖十字教堂 Kościół św. Krzyża",14,"14"],["總統府（外觀）",13,"13a"],["Café Bristol",13,"13b"],["訪親會教堂 Kościół Wizytek",13,"13c"],["普魯斯紀念碑",13,"13d"],["Ostrogski 宮（外觀）",15,"15c"],["河岸美人魚像 Syrena",15,"15d"],["華沙老城市場廣場",8,"8"],["POLIN 波蘭猶太人歷史博物館（外觀）",4,"4"],["BUW 華沙大學圖書館屋頂花園",16,"16"],["瓦津基公園 · 蕭邦紀念碑",18,"18a"],["Soul Kitchen",23,"23"],["Bułkę przez Bibułkę",2,"2"],["MSN 現代美術館",3,"3a"],["克拉辛斯基廣場・起義紀念碑",5,"5"],["新城廣場 Rynek Nowego Miasta",6,"6a"],["聖母訪親教堂",6,"6b"],["Freta 16 居禮夫人出生地",6,"6c"],["甕城 Barbakan",7,"7"],["聖若望大教堂",10,"10a"],["聖馬丁教堂",10,"10b"],["聖安妮教堂（外觀）",11,"11b"],["Gospoda pod Zygmuntem",12,"12"],["水上宮殿 Pałac na Wyspie",18,"18b"]]],[8,[["Hotel Metropol",1,"1·6"],["BAKEN piekarnia",2,"2"],["三十字廣場 Plac Trzech Krzyży",3,"3"],["瓦津基公園 · 蕭邦紀念碑",4,"4"],["Pl. Unii Lubelskiej",5,"5"],["Warszawa Centralna",8,"8b"],["Warszawa Śródmieście",8,"8a"],["Warszawa Lotnisko Chopina 機場鐵路站",null,null]]]];
test('其他天的圖釘編號保持原樣', () => {
  assert.deepEqual(days.filter(d=>d.n!==5 && d.n!==6).map(d=>[d.n,makeDayMap(d).points.map(p=>[p[2],p[8],p[9]])]), otherDays);
});

test('Day 5 補充點無效時 CLI exit 非零', () => {
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', `
    import { daySupplementaryPins } from './src/data/day-maps.js';
    daySupplementaryPins[5][0][0] = NaN;
    process.argv[1] = new URL('./tools/audit-map-pins.mjs', import.meta.url).pathname;
    await import('./tools/audit-map-pins.mjs');
  `], { cwd: new URL('../', import.meta.url), encoding: 'utf8' });
  assert.equal(result.status, 1, result.stderr);
  assert.match(result.stdout, /Day 5 補充圖釘：19，錯誤 1/);
  assert.match(result.stderr, /座標不在樂斯拉夫範圍/);
});
