# Task 1 完成報告：統一資料模型與官方內容

## 交付內容

- 建立 `src/data/travel-database.js`，匯出 `databaseEntries`、`readinessItems`、`dayOperations`、`statusLabels`、`databaseSections`。
- 19 筆 `databaseEntries` 覆蓋 15 個指定操作分類；每筆都有 `id`、`section`、`category`、`cityKey`、`title`、`summary`、`status`、`sourceUrl`、`verifiedAt`、`recheckAt`、`offlineNote`、`private`。
- 私人項目僅保留完成狀態與離線準備提醒，未寫入訂位代碼、護照、保單、付款或卡片資料。
- 修正 `safety.embassy` 為外交部查證地址：`30th Floor, Ul. Emilii Plater 53, 00-113 Warsaw, Poland`。
- 新增資料契約測試與代表處地址測試。

## RED

命令：

```sh
node --test tests/build.test.mjs
```

結果摘要：如預期失敗，Node 回報 `ERR_MODULE_NOT_FOUND`，找不到 `src/data/travel-database.js`；測試尚未執行，表示契約測試先於實作存在。

## GREEN

命令：

```sh
node build.mjs && node --test tests/build.test.mjs
```

結果摘要：`build 完成：20 頁已產生至 dist/`；25 項測試全部通過（pass 25、fail 0）。

## 修改檔案

- Task 1 範圍：`src/data/travel-database.js`（新增）、`src/data/essentials.js`（代表處地址）、`tests/build.test.mjs`（統一資料契約與代表處地址測試）。
- `.superpowers/sdd/2026-08-08-free-travel-database/task-1-report.md`（本報告）

`9326653` 是合併提交，除上述 Task 1 範圍外，也包含先前完成的已審計資料校正：`build.mjs`、兩份研究文件、`cities.js`、`dining.js`、`tickets.js`、`transit.js`、`trip.js`、`city.mjs`、`layout.mjs`、`practical.mjs`，以及 `tests/build.test.mjs` 的其他既有校正測試。這些先前審計資料不是 Task 1 新增內容；本報告不再將整個合併提交誤稱為僅 3 個程式檔案或 `essentials.js` 僅一項修改。

## 自我審查

- 已逐筆確認 15 個指定 section 皆存在，四種狀態集合完整，8 項準備度與 Day 1–8 索引符合契約。
- 已確認序列化資料不含舊館址 `Al. Jerozolimskie 179`，新館址項目具有外交部來源與 `verifiedAt: '2026-08-08'`。
- 已執行 `git diff --check`，無空白錯誤。
- 已區分 Task 1 範圍與 `9326653` 內同時併入的先前審計資料，避免把合併提交的全部差異錯誤歸屬於本任務。

## Commit

`9326653 feat: audit Poland data and add travel database core`（合併提交，範圍說明如上）。

## 審查修正輪次（2026-08-08）

- 將原本同時宣稱克拉科夫與樂斯拉夫供水品質、但僅附克拉科夫來源的項目拆為兩筆；兩城各自保有 `cityKey` 與水務公司官方 `sourceUrl`，並映射到 Day 3／Day 5 操作索引。
- 先新增兩城來源契約測試。RED：`node --test tests/build.test.mjs` 為 25 pass、1 fail，失敗原因為 `daily-basics-krakow-water` 尚不存在。
- 移除 `docs/research/2026-08-08-free-travel-gaps.md` 第 3 行行尾空白，以及 `docs/research/2026-08-08-poland-travel-data-audit.md` EOF 的多餘空白行。
- GREEN：`node build.mjs && node --test tests/build.test.mjs` 完成 20 頁建置，26 項測試全部通過（pass 26、fail 0）。
- 差異檢查：`git diff --check`（本輪工作差異）無輸出、結束碼 0。修正前的 `git diff --check HEAD^..HEAD` 會列出 `9326653` 內兩個歷史問題：`free-travel-gaps.md:3` 行尾空白與 `poland-travel-data-audit.md:88` EOF 空白行；本輪已移除兩者，提交後的 `git diff --check HEAD^..HEAD` 亦無輸出、結束碼 0。
