# POLSKA 單一 PWA 驗收結果

- 驗收時間：2026-07-16 22:45–22:50（Asia/Taipei）
- 驗收 commit：`991555c059224f970e8d93641481cc94efd0a236`
- 本機網址：`http://localhost:4173/`
- 瀏覽器：Chrome（全新 agent 分頁；此 port／origin 本次首次使用）
- HTTP server：`python3 -m http.server 4173`

## 1. 自動驗收

執行：

```bash
./verify.sh
```

第一次在受限網路環境執行時，34 項 Node 測試已通過，但 `npx esbuild` 因無法解析 `registry.npmjs.org` 而中止。允許 npm registry 網路後，完整重跑同一指令，exit code 為 `0`，結果如下：

| 項目 | 實際結果 |
| --- | --- |
| Node 測試 | 34 tests；34 pass；0 fail；0 cancelled；0 skipped；0 todo |
| 測試時間 | 完成前 fresh 重跑 100.472542 ms（首次完整通過 268.952084 ms） |
| 正式 bundle | `redesign/dist/B-companion.js`，31.4 kB |
| bundle 時間 | 完成前 fresh 重跑 9 ms（首次完整通過 39 ms） |
| JavaScript 語法檢查 | 6/6 通過：`redesign/dist/B-companion.js`、`redesign/data.js`、`redesign/pwa-core.js`、`pwa-register.js`、`legacy-redirect.js`、`sw.js` |
| whitespace／diff 檢查 | `git diff --check` 無輸出、通過 |
| 最終訊息 | `✅ POLSKA 單一 PWA 自動驗收完成` |

## 2. 真實瀏覽器版面驗收

每個 viewport 都以本機 HTTP 實際載入根網址，讀取 DOM 尺寸並檢查 Chrome console。`overflow` 定義為 `document.documentElement.scrollWidth - document.documentElement.clientWidth`。

| Viewport | Final URL | 可見主標題 | clientWidth | scrollWidth | overflow | Console error | Console warning | 實際畫面狀態 |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| 320 × 844 | `http://localhost:4173/` | 抵達華沙 · 老城傍晚漫步 | 320 | 320 | 0 px | 0 | 0 | 手機底欄為 `position: fixed`、`bottom: 0px`；今日／行程／交通／訂票四按鈕全部可見，各寬 80 px；桌機導覽隱藏 |
| 390 × 844 | `http://localhost:4173/` | 抵達華沙 · 老城傍晚漫步 | 390 | 390 | 0 px | 0 | 0 | 固定底欄四按鈕全部可見，各約 98 px；「現在」為抵蕭邦機場；「下一站」為 14:45 SKM S2/S3；桌機導覽隱藏 |
| 1440 × 900 | `http://localhost:4173/` | 抵達華沙 · 老城傍晚漫步 | 1440 | 1440 | 0 px | 0 | 0 | 桌機今日／行程／交通／訂票四入口全部可見；右側補充資訊欄可見；手機底欄隱藏 |

390 px 的固定底欄 CSS 使用 `var(--safe-left)`、`var(--safe-right)`、`var(--safe-bottom)`。本次一般 Chrome viewport 沒有瀏海環境值，因此實際 computed bottom padding 為 `0px`；底欄仍完整貼齊畫面且未遮住四個入口。實機 iPhone standalone 的非零 safe-area 仍應由使用者再走一次。

頁面標題三個 viewport 都是：`POLSKA — 波蘭旅遊指南 2025–2026 | Eastern Europe Magazine`。

## 3. PWA ready 與安裝狀態

在線上根網址重新整理後的實際 DOM 狀態：

- `.B-pwa-state[data-pwa-status]` = `ready`。
- 可見文字為「已連線／可安裝／離線資料已準備」。
- Chrome 的 `beforeinstallprompt` 已讓「安裝 App」按鈕可見。
- `manifest.json` 的 `id`、`start_url`、`scope` 都是 `./`，`display` 是 `standalone`。

本次沒有按下瀏覽器安裝確認，避免改動使用者的 Chrome 安裝狀態；已驗證到可安裝事件、可見安裝入口及 Service Worker ready。實際安裝後 standalone 啟動列為使用者驗收項目。

## 4. 三個舊入口轉址

以下均在真實瀏覽器載入；三次 console error／warning 都是 0：

| 舊入口 | Final URL | Query | Hash | 可見主標題 |
| --- | --- | --- | --- | --- |
| `mobile.html?day=3&from=legacy#B-tickets` | `http://localhost:4173/?day=3&from=legacy#B-tickets` | 完整保留 | 完整保留 | 抵達華沙 · 老城傍晚漫步 |
| `desktop.html?day=4&from=legacy#B-guide` | `http://localhost:4173/?day=4&from=legacy#B-guide` | 完整保留 | 完整保留 | 抵達華沙 · 老城傍晚漫步 |
| `app-preview.html?day=5&from=legacy#B-day-5` | `http://localhost:4173/?day=5&from=legacy#B-day-5` | 完整保留 | 完整保留 | 抵達華沙 · 老城傍晚漫步 |

三者最後都載入同一正式頁面標題，沒有再呈現舊版獨立 UI。

## 5. 停止 server 後離線重載

驗收方式不是只切換 UI 標記：先在線上根網址載入並重新整理到 `data-pwa-status="ready"`，確認 Day 1–8 全部存在後，對本機 `python3 -m http.server 4173` 送出 `Ctrl-C`，server 顯示 `Keyboard interrupt received, exiting.`；接著直接對同一個 `http://localhost:4173/` 執行 browser reload。

停止 server 後的實際結果：

- 根網址仍成功渲染，final URL 未改變。
- 頁面標題仍為 `POLSKA — 波蘭旅遊指南 2025–2026 | Eastern Europe Magazine`。
- 可見主標題仍為「抵達華沙 · 老城傍晚漫步」。
- Day 1、2、3、4、5、6、7、8 共 8 個日次 tab 全部存在。
- 今日／行程／交通／訂票四個手機入口全部存在，`#B-tickets` 訂票卡與 `#B-guide` 行前指南都存在。
- 390 px 的 clientWidth／scrollWidth 為 390／390，overflow 0 px。
- reload 與後續操作的 console error／warning 均為 0。
- 離線切換到 Day 3 成功，主標題變成「Auschwitz-Birkenau · 一日往返」。
- 離線按下「交通」成功開啟詳情，實際內容包含 `Bus transfer`、`KRK → Oświęcim`、07:30–09:00、票價 `PLN 15 ×2` 與 Lajkonik 訂票資料。
- Day 3 訂票卡仍可讀，包含「Auschwitz 官方英文導覽」。

因電腦仍連著網路，`navigator.onLine` 保持 `true`，所以狀態列文字仍顯示「已連線」；但 HTTP server 已實際停止，根網址 reload 與 Day／交通／訂票內容均只能由 Service Worker cache 供應。

## 6. 驗收結論與仍待人工確認

自動驗收、三種 viewport、舊入口轉址及停止 server 後離線重載均通過。尚未直接證明的兩項是：

1. 實機 iPhone standalone 模式下的非零 safe-area。
2. 使用者實際接受安裝提示後，由主畫面 standalone 啟動。

這兩項需要改動真實裝置／瀏覽器安裝狀態，留在部署前的使用者核心路徑驗收。
