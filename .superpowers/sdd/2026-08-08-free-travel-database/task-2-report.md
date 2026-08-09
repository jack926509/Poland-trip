# Task 2：自由行資料庫頁交接報告

## 需求與範圍

- 產物：`dist/practical/database.html`
- 資料介面：`renderDatabase({ entries, sections, statusLabels })`
- 本次只修改 brief 指定的 renderer、建置、共用導覽、樣式與測試檔；未修改 `.agents/`、`.claude/` 或 `skills-lock.json`。

## TDD 證據

### RED

先在 `tests/build.test.mjs` 將預期頁數改為 21，並加入資料庫頁契約測試：SOS、五個指定主題標題與 `tel:+48668027574`。

執行 `npm test`：建置輸出為「build 完成：20 頁已產生至 dist/」，共 27 項測試中 20 項通過、7 項失敗。直接失敗原因為缺少 `practical/database.html`，符合預期 RED。

### GREEN

實作 renderer 並把它接入建置流程後，執行 `npm test`：

```text
build 完成：21 頁已產生至 dist/
tests 27
pass 27
fail 0
```

另執行 `git diff --check`，無空白字元錯誤；已直接檢查建置結果，確認 SOS 電話連結、四種文字狀態、查證／重查日期與官方來源均存在。

## 修改內容

- 新增 `src/templates/database.mjs`：先產生 SOS 離線急救卡，再產生主題索引和各資料卡；每張資料卡都顯示文字狀態、摘要、離線備註、查證日期、重查日期及官方來源。
- 修改 `build.mjs`：匯入 `travel-database.js` 與 renderer，輸出 `practical/database.html`，將總頁數驗證調整為 21。
- 修改 `src/templates/layout.mjs`：於實用資訊導覽加入自由行資料庫。
- 修改 `src/styles/main.css`：新增四種狀態、資料庫索引、卡片、SOS 網格、來源資訊及窄螢幕樣式。
- 修改 `tests/build.test.mjs`：新增第 21 頁與頁面契約測試。

## 自審

- 資料只由 `databaseEntries`、`databaseSections`、`statusLabels` 傳入，未另行捏造私人訂位、證件或付款資料。
- 所有內部連結通過既有 GitHub Pages 子路徑解析測試。
- `private-required` 狀態在產物上顯示為「需填私人資料」，以文字而非顏色傳達。
- brief 同時要求首頁 toolkit 入口，但首頁模板不在 brief 的可修改檔案清單，故本 task 僅完成共用實用資訊導覽入口；首頁入口需由可修改 `src/templates/home.mjs` 的後續工作補上。

## 瀏覽器驗收限制

已嘗試依 Browser 控制技能連線本機頁面，但目前沒有可用瀏覽器執行個體，無法完成實際渲染截圖／手機視窗驗收。自動建置與頁面契約測試均已通過；瀏覽器視覺驗收仍待主代理或具可用瀏覽器的交叉審查者完成。

## Commit

未建立。嘗試僅 stage `build.mjs`、`src/templates/database.mjs`、`src/templates/layout.mjs`、`src/styles/main.css`、`tests/build.test.mjs` 時，Git 無法建立 `.git/index.lock`，回報 `Operation not permitted`。工作檔案均未 stage；請主代理在可寫入 Git metadata 的環境建立 commit。

## Review fix round：首頁 toolkit 入口

### RED

審查發現首頁雖然因共用導覽已含資料庫連結，但「規劃工具」格線沒有資料庫卡片。先擴充首頁測試的頁面清單加入 `database`；這個初版測試意外通過，暴露出它只驗證整頁連結、沒有鎖定 toolkit。隨即加上首頁卡片的精確契約：

```text
首頁規劃工具缺少自由行資料庫卡片
```

以 `node build.mjs && node --test --test-name-pattern='首頁包含 8 天、4 城與全部實用頁入口' tests/build.test.mjs` 確認為 RED。

### GREEN

- 修改 `src/templates/home.mjs`，於規劃工具格線加入「自由行資料庫」卡片，連至 `practical/database.html`。
- 修改 `tests/build.test.mjs`，驗證首頁有實際 toolkit 卡片，而非僅因導覽列而出現連結。

聚焦測試通過（1/1）；再跑 `npm test`，27/27 通過並產生 21 頁；`git diff --check` 通過。

### 自審

- 卡片使用與既有 toolkit 相同的 `card card-link` 結構，沒有引入額外樣式或行為。
- 原本「首頁入口待後續工作」的說明已失效，本 round 已完整補正。

### Commit

未建立。嘗試僅 stage `src/templates/home.mjs`、`tests/build.test.mjs` 時，Git 同樣無法建立 `.git/index.lock`，回報 `Operation not permitted`。請主代理建立 commit；交接報告不納入 commit。
