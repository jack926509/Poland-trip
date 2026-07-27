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
