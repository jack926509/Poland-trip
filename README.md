# POLSKA｜波蘭四城旅行誌

以臺灣繁體中文整理華沙、克拉科夫、弗羅茨瓦夫與波茲南的自由行資訊，提供手機與桌機瀏覽。

[正式網站](https://polandtrip.xiehnet.com/) · 航空往返 2026/10/23–11/01 · 波蘭境內 2026/10/24–10/31（8 天 7 夜）

## 專案功能

- 每日行程、今日速查、交通步驟、住宿與景點導航。
- 四座城市指南、餐廳候選、順路美食與拍照建議。
- 訂票待辦與倒數、交通及門票資訊、自由行資料庫。
- 全站搜尋、資料更新儀表板、PWA 離線瀏覽與可攜式單檔版。

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
| 每日餐廳、城市餐飲資料 | `src/data/day-dining.js`、`src/data/dining.js` |
| 城市、地圖與照片資料 | `src/data/cities.js`、`src/data/city-gallery.js` |
| 門票、交通、伴手禮與實用資訊 | `src/data/tickets.js`、`transit.js`、`shopping.js`、`essentials.js` |
| 自由行資料庫 | `src/data/travel-database.js` |
| 頁面版型與共用元件 | `src/templates/` |
| 樣式與瀏覽器互動 | `src/styles/`、`src/scripts/` |
| 時間邏輯與搜尋索引 | `src/lib/`、`src/search/` |
| 建置、離線快取與驗收 | `build.mjs`、`sw.js`、`tests/`、`tools/` |

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

推送至 `main` 後，既有 GitHub Actions 會先驗收、組裝 `_site/`，再部署到 Cloudflare Pages 與 GitHub Pages。Cloudflare 工作流程使用儲存庫 Secrets 中的 `CLOUDFLARE_API_TOKEN` 與 `CLOUDFLARE_ACCOUNT_ID`。

手動組裝發布檔案時，指定一個新建的空目錄：

```bash
mkdir _site
./prepare-site.sh _site
```

發布目錄為 `_site/`。離線快取版本會在建置時附加資源指紋，請保留建置產生的 `sw.js`。

## 維護原則與文件

- 旅遊資料以 `src/data/` 為準；班次、票價與營業時間須保留查核來源及狀態，規劃中的項目不能當作已訂妥。
- 公開行程與住宿資訊不包含旅客姓名、證件號碼、訂位代碼、票號、付款資料或私人聯絡方式。
- 詳細操作見[開發與資料維護指南](docs/development.md)，照片授權見[照片來源](assets/photos/CREDITS.md)。
- 查核資料保留在 [docs/research/](docs/research/)，舊版網站保留在 [archive/](archive/)。
- README 只說明目前專案與開發方式；逐次修改、測試結果與分支整理紀錄留在 [PR](https://github.com/jack926509/Poland-trip/pulls?q=is%3Apr) 與 [Git 歷史](https://github.com/jack926509/Poland-trip/commits/main/)，不再追加到本頁。
