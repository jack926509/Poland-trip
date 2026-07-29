import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const coreCtx = { globalThis: {}, Intl, Date };
vm.runInNewContext(fs.readFileSync('redesign/pwa-core.js', 'utf8'), coreCtx);
const core = coreCtx.globalThis.PolskaPwaCore;

const dataCtx = { window: {} };
vm.runInNewContext(fs.readFileSync('redesign/data.js', 'utf8'), dataCtx);
const TRIP = dataCtx.window.TRIP;

test('四座城市都有 hero 與 thumb 照片路徑', () => {
  assert.equal(TRIP.cities.length, 4);
  for (const c of TRIP.cities) {
    assert.match(c.photo.hero, /^assets\/photos\/[a-z]+-hero\.webp$/);
    assert.match(c.photo.thumb, /^assets\/photos\/[a-z]+-thumb\.webp$/);
  }
});

test('每張照片都有可顯示的授權出處', () => {
  assert.equal(TRIP.photoCredits.length, 8);
  for (const c of TRIP.photoCredits) {
    assert.ok(c.author && c.author.length > 0);
    assert.match(c.license, /^CC BY(-SA)? \d\.\d$/);
    assert.match(c.url, /^https:\/\/commons\.wikimedia\.org\//);
  }
});

// 釘死授權資料的來源：assets/photos/CREDITS.md（唯一權威來源）。
// hero 與 thumb 是同一張原圖裁切縮放而成，所以同城市兩筆的 author／license／url
// 必須逐字相同——換圖卻忘了同步授權，這條要能立刻炸掉。
test('photoCredits 逐檔對應實際素材，且同城市 hero／thumb 授權三欄完全相同', () => {
  const expectedFiles = [
    'warszawa-hero.webp', 'warszawa-thumb.webp',
    'krakow-hero.webp', 'krakow-thumb.webp',
    'wroclaw-hero.webp', 'wroclaw-thumb.webp',
    'poznan-hero.webp', 'poznan-thumb.webp',
  ];
  assert.deepEqual(JSON.parse(JSON.stringify(TRIP.photoCredits.map((c) => c.file))), expectedFiles);

  const byCity = {};
  for (const c of TRIP.photoCredits) {
    const city = c.file.split('-')[0];
    if (!byCity[city]) { byCity[city] = c; continue; }
    assert.equal(c.author, byCity[city].author, `${city} hero／thumb 作者不一致`);
    assert.equal(c.license, byCity[city].license, `${city} hero／thumb 授權不一致`);
    assert.equal(c.url, byCity[city].url, `${city} hero／thumb 來源網址不一致`);
  }

  // 對照 CREDITS.md 的確切值，防止未來任何一筆被悄悄改錯。
  const known = {
    warszawa: { author: 'Rhododendrites', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Market_Square_Warsaw_(22594p).jpg' },
    krakow: { author: 'Andrzej Otrębski', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Krakow_Rynek_Glowny_panorama_2.jpg' },
    wroclaw: { author: 'Gerd Eichmann', license: 'CC BY 4.0', url: 'https://commons.wikimedia.org/wiki/File:Breslau-Rynek-38-Panorama-2014-gje.jpg' },
    poznan: { author: 'Mateusz.woźniak', license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Poznan_stary_rynek_panorama.jpg' },
  };
  for (const [city, expected] of Object.entries(known)) {
    assert.deepEqual(
      { author: byCity[city].author, license: byCity[city].license, url: byCity[city].url },
      expected,
      `${city} 授權資料須逐字對照 CREDITS.md`,
    );
  }
});

// Task 13：CC BY／BY-SA 要求提供授權條款本身的 URI，不能只有照片來源頁（url 欄位）。
// licenseUrl 只能是三個 Creative Commons 官方標準授權頁之一，且必須對應 license 欄位。
test('每筆 photoCredits 都有對應授權條款的 licenseUrl（CC 官方標準頁）', () => {
  const knownLicenseUrls = {
    'CC BY-SA 4.0': 'https://creativecommons.org/licenses/by-sa/4.0/',
    'CC BY 4.0': 'https://creativecommons.org/licenses/by/4.0/',
    'CC BY-SA 3.0': 'https://creativecommons.org/licenses/by-sa/3.0/',
  };
  for (const c of TRIP.photoCredits) {
    assert.ok(c.licenseUrl, `${c.file} 缺少 licenseUrl`);
    assert.equal(
      c.licenseUrl,
      knownLicenseUrls[c.license],
      `${c.file} 的 licenseUrl 須對應 license「${c.license}」的官方標準頁`,
    );
  }
});

test('拍照清單是景點層級且每個景點都有光線建議', () => {
  assert.ok(TRIP.photoSpots.length >= 8);
  const cityKeys = new Set(TRIP.cities.map((c) => c.key));
  for (const s of TRIP.photoSpots) {
    assert.ok(cityKeys.has(s.cityKey), `未知城市 ${s.cityKey}`);
    assert.ok(s.id && s.name && s.bestTime && s.light);
    assert.ok(s.day >= 1 && s.day <= 8);
  }
  assert.equal(new Set(TRIP.photoSpots.map((s) => s.id)).size, TRIP.photoSpots.length);
});

test('舊的城市級打卡遷移到該城第一個景點，且不丟資料', () => {
  const spots = [
    { id: 'waw-oldtown', cityKey: 'WAW' },
    { id: 'waw-castle', cityKey: 'WAW' },
    { id: 'krk-rynek', cityKey: 'KRK' },
  ];
  const r = core.migratePhotoCheckins({ 華沙: true, 克拉科夫: false }, spots);
  assert.equal(r.migrated, true);
  assert.equal(r.next['waw-oldtown'], true);
  assert.equal(r.next['krk-rynek'], undefined);
  assert.equal(core.PHOTOMAP_BACKUP_KEY, 'polska.photomap.v0.backup');
});

test('已是新格式的資料不會被重複遷移', () => {
  const spots = [{ id: 'waw-oldtown', cityKey: 'WAW' }];
  const r = core.migratePhotoCheckins({ 'waw-oldtown': true }, spots);
  assert.equal(r.migrated, false);
  assert.equal(r.next['waw-oldtown'], true);
});

// 以下兩條是本 task 補的測試：brief 只驗了純函式 migratePhotoCheckins 的計算結果，
// 沒有驗到「真的把舊值寫進 localStorage 的備份 key」這條紅線本身。
// migratePhotoCheckins 不碰 storage，所以用會實際落地的 migratePhotoMapStorage 來驗。

function makeFakeStorage() {
  const bag = {};
  return {
    getItem: (k) => (Object.prototype.hasOwnProperty.call(bag, k) ? bag[k] : null),
    setItem: (k, v) => { bag[k] = v; },
    _bag: bag,
  };
}

test('遷移時把舊值原封不動備份到 polska.photomap.v0.backup，新格式寫進 v1', () => {
  const spots = [
    { id: 'waw-oldtown', cityKey: 'WAW' },
    { id: 'waw-castle', cityKey: 'WAW' },
    { id: 'krk-rynek', cityKey: 'KRK' },
  ];
  const storage = makeFakeStorage();
  storage.setItem('polska.photomap.v1', JSON.stringify({ 華沙: true, 克拉科夫: false }));

  const r = core.migratePhotoMapStorage(storage, spots);
  assert.equal(r.migrated, true);

  // 備份 key 裡的值必須跟遷移前一模一樣（原封不動），不是新格式。
  const backedUp = JSON.parse(storage.getItem(core.PHOTOMAP_BACKUP_KEY));
  assert.deepEqual(backedUp, { 華沙: true, 克拉科夫: false });

  // 主 key 已經是新格式。
  const migrated = JSON.parse(storage.getItem('polska.photomap.v1'));
  assert.equal(migrated['waw-oldtown'], true);
  assert.equal(migrated['krk-rynek'], undefined);
});

test('重複遷移（使用者開好幾次 App）不會把備份覆蓋成新值', () => {
  const spots = [
    { id: 'waw-oldtown', cityKey: 'WAW' },
    { id: 'waw-castle', cityKey: 'WAW' },
  ];
  const storage = makeFakeStorage();
  storage.setItem('polska.photomap.v1', JSON.stringify({ 華沙: true }));

  // 第一次開 App：觸發遷移。
  const first = core.migratePhotoMapStorage(storage, spots);
  assert.equal(first.migrated, true);
  const backupAfterFirst = JSON.parse(storage.getItem(core.PHOTOMAP_BACKUP_KEY));
  assert.deepEqual(backupAfterFirst, { 華沙: true });

  // 第二次、第三次開 App：資料已是新格式，不該再變動備份。
  const second = core.migratePhotoMapStorage(storage, spots);
  assert.equal(second.migrated, false);
  const third = core.migratePhotoMapStorage(storage, spots);
  assert.equal(third.migrated, false);

  const backupAfterRepeat = JSON.parse(storage.getItem(core.PHOTOMAP_BACKUP_KEY));
  assert.deepEqual(backupAfterRepeat, { 華沙: true }, '備份不可被之後的新格式資料覆蓋');
});

// 額外防線：就算未來程式改動讓 migratePhotoCheckins 在已有備份時又回報 migrated:true，
// migratePhotoMapStorage 本身也不該覆寫既有備份。
test('即使備份已存在，migratePhotoMapStorage 也不會覆寫備份內容', () => {
  const spots = [{ id: 'waw-oldtown', cityKey: 'WAW' }];
  const storage = makeFakeStorage();
  storage.setItem(core.PHOTOMAP_BACKUP_KEY, JSON.stringify({ 華沙: true }));
  // 主 key 混雜舊格式 key，模擬 looksOld 仍為 true 的情況。
  storage.setItem('polska.photomap.v1', JSON.stringify({ 華沙: true, 'waw-oldtown': false }));

  core.migratePhotoMapStorage(storage, spots);

  const backup = JSON.parse(storage.getItem(core.PHOTOMAP_BACKUP_KEY));
  assert.deepEqual(backup, { 華沙: true }, '備份已存在時不可被覆寫');
});
