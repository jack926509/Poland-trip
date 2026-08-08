# Task 1 完成報告：統一資料模型與官方內容

## 交付內容

- 建立 `src/data/travel-database.js`，匯出 `databaseEntries`、`readinessItems`、`dayOperations`、`statusLabels`、`databaseSections`。
- 18 筆 `databaseEntries` 覆蓋 15 個指定操作分類；每筆都有 `id`、`section`、`category`、`cityKey`、`title`、`summary`、`status`、`sourceUrl`、`verifiedAt`、`recheckAt`、`offlineNote`、`private`。
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

- `src/data/travel-database.js`（新增）
- `src/data/essentials.js`（僅代表處地址）
- `tests/build.test.mjs`（僅統一資料契約與代表處地址測試）
- `.superpowers/sdd/2026-08-08-free-travel-database/task-1-report.md`（本報告）

## 自我審查

- 已逐筆確認 15 個指定 section 皆存在，四種狀態集合完整，8 項準備度與 Day 1–8 索引符合契約。
- 已確認序列化資料不含舊館址 `Al. Jerozolimskie 179`，新館址項目具有外交部來源與 `verifiedAt: '2026-08-08'`。
- 已執行 `git diff --check`，無空白錯誤。
- 未改動既有 `tests/build.test.mjs`、`src/data/essentials.js` 中與本任務無關的未提交校正；提交時以局部暫存保留它們。

## Commit

待完成局部暫存與提交後填入。
