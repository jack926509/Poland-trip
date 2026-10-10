# 開發與資料維護指南

本頁整理開發、驗證、部署與資料維護方式；旅行概覽見 [波蘭四城旅行誌](../README.md)。

## 開始開發

使用 Node.js 與 npm；建置採原生 JavaScript ES modules，沒有額外 npm 套件依賴。完整驗收另需 Bash 與 Git。

```bash
git clone https://github.com/jack926509/Poland-trip.git
cd Poland-trip
npm run build
```

建置後產生 `dist/` 多頁網站，以及根目錄的 `poland-travel-guide-2026.html` 單檔版。預覽可使用任一靜態 HTTP 伺服器，例如已安裝 Python 3 時：

```bash
python3 -m http.server 8000 --directory dist
```

開啟 <http://localhost:8000>。修改來源後重新執行建置，伺服器不會自動編譯。

## 要修改哪裡？

| 內容 | 檔案位置 |
| --- | --- |
| 行程、住宿、火車與訂票待辦 | `src/data/trip.js` |
| 餐飲門市、每日安排與分類 | `src/data/dining-places.js`、`src/data/day-dining.js`、`src/data/dining.js` |
| 連鎖速食品牌、獨立門市與商場 | `src/data/fast-food.js` |
| 城市、地圖與照片資料 | `src/data/cities.js`、`src/data/day-maps.js`、`src/data/city-gallery.js` |
| 門票、交通、伴手禮與實用資訊 | `src/data/tickets.js`、`transit.js`、`shopping.js`、`essentials.js` |
| 超市品牌、候選地址與採買商品 | `src/data/groceries.js` |
| 自由行資料庫 | `src/data/travel-database.js` |
| 頁面版型與共用元件 | `src/templates/` |
| 樣式與瀏覽器互動 | `src/styles/`、`src/scripts/` |
| 共用城市／頁面對照、日期與文字處理 | `src/lib/` |
| 全站搜尋索引 | `src/search/` |
| 建置、離線快取與驗收 | `build.mjs`、`src/build/`、`sw.js`、`tests/`、`tools/` |

**請修改來源檔，不要直接編輯 `dist/` 或單檔版；下次建置會覆蓋它們。**

## 驗證修改

```bash
npm test                         # 建置並執行測試
npm run audit:schedule           # 檢查行程時間與轉場提醒
npm run audit:map-pins           # 檢查地圖圖釘與資料時效
```

提交前執行完整驗收：

```bash
env -u NODE_OPTIONS ./verify.sh
```

## 部署

**部署＝推送至 `main`，沒有其他手動步驟。** 兩條 GitHub Actions 會同時啟動，各自先跑 `./verify.sh` 驗收、再用 `./prepare-site.sh _site` 組裝發布目錄：

送出指向 `main` 的 Pull Request 時，`.github/workflows/verify-pr.yml` 會先執行 `./verify.sh` 檢查建置、測試與地圖資料；PR 檢查不發布網站。合併後上述兩條部署流程才會啟動。

| 工作流程 | 目的地 | 網址 |
|---|---|---|
| `.github/workflows/cloudflare-pages.yml`（wrangler `pages deploy _site --project-name=poland-trip`） | Cloudflare Pages | https://polandtrip.xiehnet.com （別名 https://poland-trip-7wm.pages.dev） |
| `.github/workflows/deploy.yml` | GitHub Pages | https://jack926509.github.io/Poland-trip/ |

Cloudflare 工作流程使用儲存庫 Secrets 中的 `CLOUDFLARE_API_TOKEN` 與 `CLOUDFLARE_ACCOUNT_ID`。

**Cloudflare 專案不得連接 Git 整合**（Dashboard → Workers & Pages → poland-trip → 設定 → 組建 → Git 存放庫必須是「連線」未連接狀態）。一旦連上，Cloudflare 會依 `wrangler.toml` 的 `pages_build_output_dir = "."` 把未建置的 repo 根目錄整包當成第二個 Production 部署，與 GitHub Actions 上傳的正確版本互相覆蓋，導致 `/day-05` 等乾淨網址 404、`sw.js` 沒有版本指紋。2026-09-21 已斷開；若 `npx wrangler pages deployment list --project-name poland-trip` 出現同一 commit 兩個 Production 部署，就是又被連上了。

推送後確認正式站拿到的是這次的建置（版本字串應與本機 `dist/sw.js` 相同）：

```bash
grep -o "polska-journal-v[0-9a-z-]*" dist/sw.js
curl -sL https://polandtrip.xiehnet.com/sw.js | grep -o "polska-journal-v[0-9a-z-]*"
curl -s -o /dev/null -w "%{http_code}\n" https://polandtrip.xiehnet.com/day-05   # 應為 200
```

不一致時到 GitHub Actions 重跑「Deploy to Cloudflare Pages」該次執行即可（`gh run rerun <run-id>`）。

手動組裝發布檔案時，指定一個新建的空目錄：

```bash
mkdir _site
./prepare-site.sh _site
```

發布目錄為 `_site/`。離線快取版本會在建置時附加資源指紋，請保留建置產生的 `sw.js`。

## 旅遊資料與訂票狀態

- 旅遊資料以 `src/data/` 為準；班次、票價與營業時間須保留查核來源及狀態，規劃中的項目不能當作已訂妥。
- 公開行程與住宿資訊不包含旅客姓名、證件號碼、訂位代碼、票號、付款資料或私人聯絡方式。

- `src/data/trip.js` 的 `todoGroups` 是人工訂票紀錄。查核後更新 `status`、`checkedAt`（實際查核日）、`recheckAt`（下次查核期限）、`action` 與 `url`，不要用建置或部署日期代填查核日。
- 「可查／購」仍是未完成。收到訂票確認後才改為「已訂妥」或「已完成」，並同步核對 `days`、`trains`、`reservations` 與 `bookingTiers`。票號、訂位代碼與付款資料另存私人票券。
- 餐飲門市事實維護於 `dining-places.js`（`id/cityKey/address/map/hours/sourceUrl/checkedAt/verificationStatus`）；`day-dining.js` 只保存 `placeId/role/note/stepId/planStatus`，`trip.js` 的 `eat` 也引用 `placeId`。地址、時段或店名不要回填到每日安排。`resolveDining` 供各頁共用，城市表與餐廳搜尋使用相同合併資料。
- 速食品牌與單店維護於 `fast-food.js`；每個分店一個 ID、一個地址與導航，商場以 `branchIds` 關聯；不同分店不得以品牌名合併。
- `stepId` 只能指向當日既有步驟 ID；未排餐段者保持 null，頁面會明示候選未排時段，不可假設景點間有用餐空檔。
- 查核狀態採 verified／partial／pending；日期與來源必須有實際證據。只查得地址而沒有時間時用 partial。研究快照在 docs/research，屬歷史查核，不作執行時資料來源。
- 刪除城市餐廳時，檢查 `cities.js` 的 `mapPins` 與 `mapPinChecks` 是否需同步更新。座標要有查核依據，Google Maps 搜尋連結不能當作已驗證座標。
- 資料庫 CSV 匯入只更新 `travel-database.js` 的對應條目，不會完成購票或自動更新 `todoGroups`。
- 儀表板依台灣日期重新計算更新量與逾期數，今日行程依華沙日期判斷；離線時計算的是已載入資料，不會自動查票。
- 倒數期限整合火車開賣日、手動期限與資料庫重查日，應修改各來源正本，避免重抄日期。日照可用 `npm run sun:times` 重算，行程時間可用 `npm run audit:schedule` 檢查。

## 程式責任分工

- `build.mjs` 只協調 staging、資源複製、渲染、搜尋注入、打包與發布。
- `src/build/pages.mjs` 將資料傳入頁面模板；`standalone.mjs` 處理單檔連結、ID 與照片內嵌；`output.mjs` 負責快取指紋與發布失敗回復。
- 單檔照片快取與輸出路徑每次建置獨立，避免同一程序重複建置時沿用上一輪資料。
- `src/data/day-maps.js` 保存每日地圖選點與補充座標；`src/lib/day-map.mjs` 組合圖釘及查核資料，保留白天主城市的範圍。
- `src/lib/city-guide.mjs` 統一城市代碼、網址、每日城市對照與地址辨識。`templates/city-dining.mjs` 專注餐廳合併，並保留原有匯出介面相容性。
- `src/lib/html.mjs` 共用 HTML 文字／屬性編碼與 HTTPS 連結處理；內嵌 JavaScript 使用自己的 JSON 序列化，不混用 HTML 編碼。
- `src/lib/journey.mjs` 共用行程日期、入住／退房區間與訂票進度，日期解析沿用 `schedule.mjs`。

## 頁面與離線機制

- 新增頁面時，在 `src/build/pages.mjs` 註冊渲染，並更新 `src/lib/routes.mjs` 的頁面清單；一般導覽、單檔分組、搜尋索引與建置頁數由這份清單推導。每日頁面由 `trip.js` 的 `days` 推導，城市網址與代碼由 `src/lib/city-guide.mjs` 管理。另核對 `sw.js` 預快取、`sitemap.xml` 和 `tests/build.test.mjs` 的頁數斷言。
- `renderLayout` 會為適用頁面建立章節索引，頁面樣板不需另外維護同一份目錄。
- 站台採固定淺色主題；修改介面時保留鍵盤焦點、手機觸控尺寸與減少動態效果設定。
- `sw.js` 頁面採 network-first，靜態資源採 cache-first，OpenStreetMap 圖磚採 stale-while-revalidate，最多保留 400 塊。離線地圖僅能使用已快取圖磚。
- 建置會為離線快取版本加上資源指紋。不要用根目錄的原始 `sw.js` 覆蓋輸出版本。
- Leaflet 由 `vendor/leaflet/` 提供，建置時複製到多頁版並內嵌到單檔版。升級時同步更新此目錄並保持 LF 換行。
- Google Fonts 載入失敗時使用系統字型；地圖載入失敗時提供文字與導航連結備援。

離線驗證：建置後以 localhost 靜態伺服器開啟網站，等待 service worker 啟用並完成快取，再切離線檢查頁面導覽與已快取地圖。

## 照片與查核文件

- 新增照片時，依 [照片來源](../assets/photos/CREDITS.md) 的流程確認可改作授權、裁切、長邊 1200px 與 WebP 輸出，並同步補上來源與授權。
- 具來源依據的旅遊查核資料放在 [research/](research/)，資料校正參考 [資料校正表](資料校正表.md)。歷史文件可能已被後續查核取代，請核對日期及現行資料。
- 功能修改與驗證結果寫入 commit 或 PR；只有仍影響開發的決策與操作方式才更新本指南。

## 維護文件

照片授權見[照片來源](../assets/photos/CREDITS.md)，查核資料保留在 [research/](research/)，舊版網站保留在 [archive/](../archive/)。逐次修改、測試結果與分支整理紀錄留在 [PR](https://github.com/jack926509/Poland-trip/pulls?q=is%3Apr) 與 [Git 歷史](https://github.com/jack926509/Poland-trip/commits/main/)。
