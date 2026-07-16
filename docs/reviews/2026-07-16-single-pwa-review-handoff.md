# POLSKA 單一 PWA 交叉審查

## Diff

請審查：

```bash
git diff a0d2553..HEAD
```

`a0d2553`（`chore: 忽略本機隔離工作區`）是本分支實際開始實作前的起點；`git merge-base a0d2553 HEAD` 實測也是 `a0d2553bafe3b642d1654c4a6a58028ac1bf8c31`。設計提交是更早的 `2f26402`，若需要把設計與實作計畫一起納入脈絡，可另看 `git diff 2f26402..HEAD`，但本次程式改動審查以實際起點 `a0d2553..HEAD` 為準。

在 Task 6 驗收文件提交前，`a0d2553..991555c` 的實際差異為 23 個檔案、1,171 行新增、2,775 行刪除。主要範圍：

- 根入口與三個舊入口相容轉址。
- 單一 React 響應式介面與共用資料。
- manifest、Service Worker、安裝／更新狀態。
- build／verify 流程與 34 項 Node 測試。

完整實跑證據請讀：`docs/verification/2026-07-16-single-pwa-results.md`。

## 驗收條件

1. 根網址是唯一正式入口。
2. 手機固定四分頁且 320 px 無水平溢出。
3. 桌機是同一應用的完整雙欄網頁。
4. manifest 從根網址 standalone 啟動。
5. 離線可讀 Day 1–8、交通與訂票。
6. 更新由使用者確認後切換。
7. 三個舊入口安全導回根網址。
8. `./verify.sh` 全綠。
9. 無 secrets、未部署、未刪除舊版原始檔。

## 已完成的實際驗收

- `./verify.sh`：34 pass／0 fail；正式 bundle 31.4 kB；6 個 JavaScript 語法檢查與 `git diff --check` 通過。
- 320 × 844：clientWidth／scrollWidth 320／320，overflow 0；四個手機入口都可見；console error／warning 0。
- 390 × 844：clientWidth／scrollWidth 390／390，overflow 0；現在與下一站資訊正常；PWA `ready` 且收到可安裝事件；console error／warning 0。
- 1440 × 900：clientWidth／scrollWidth 1440／1440，overflow 0；桌機四入口與右欄可見，手機底欄隱藏；console error／warning 0。
- 三舊入口均在固定 390 × 844 實測導回 `/`，各自 query/hash 完整保留；三次 clientWidth／scrollWidth 均為 390／390、overflow 0、console error／warning 0。
- 實際停止 `python3 -m http.server 4173` 後 reload 根網址，Day 1–8、交通詳情與訂票內容仍可讀；console error／warning 0。

## 風險焦點

- Service Worker 是否會留下半套 cache，尤其 install `addAll` 失敗或跨版本更新時。
- iPhone standalone safe-area 與更新重載是否穩定；三種 viewport 的一般版面驗收通過，但本次一般 Chrome viewport 的 safe-area computed value 是 0，非零 safe-area 尚待實機驗證。
- 寬螢幕雙欄是否仍能操作所有手機功能，特別是交通 modal、日次切換、備註與外部連結。
- 舊 GitHub Pages 子路徑部署下，根入口與轉址是否正確；本次 localhost 根路徑與單元測試已過，但尚未部署實測。
- Chrome 已出現「安裝 App」且 PWA 狀態為 `ready`，但本次沒有接受安裝提示；需由使用者實測 standalone 啟動。
- 停止 server 後頁面能從 cache reload，但因電腦網路介面仍在線，狀態列仍顯示「已連線」；請判斷產品文字是否需要區分「網路介面在線」與「本站不可達」。

## 請 Claude 特別檢查

1. `sw.js` 的 install／activate／fetch 是否可能在快取更新時留下新舊資源混用。
2. `pwa-register.js` 與 `redesign/B-companion.jsx` 是否確保只有使用者按「立即更新」後才 `SKIP_WAITING`，且 `controllerchange` 最多 reload 一次。
3. `legacy-redirect.js` 在 GitHub Pages `/Poland-trip/` 子路徑是否保留 query/hash，且不形成轉址迴圈。
4. 320 px、iPhone standalone safe-area、drawer／交通 modal focus trap 是否有瀏覽器差異。
5. 離線時外部地圖／訂票連結是否都被一致攔截，不會讓使用者落入空白頁。

## 審查狀態與部署門檻

Task 6 只建立交接包，尚未取得 Claude 獨立審查結論，也未完成使用者實機 standalone 核心路徑。因此目前停在部署門檻前：不得推送 GitHub 或部署。只有 Claude 明確回覆沒有阻擋問題、必要修正完成並重跑驗收，再由使用者實際操作核心路徑後，才另行詢問是否發布。
