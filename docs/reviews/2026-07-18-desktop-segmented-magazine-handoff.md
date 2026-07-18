# 桌機分章雜誌交叉審查交接

## 宣稱完成項目

- 根網址在寬度大於等於 768 px 或 `?view=desktop` 顯示分章雜誌。
- 根網址在窄螢幕或 `?view=mobile` 保留既有 `B_Companion`。
- 七個主章節、Day 1–8、hash、Day 邊界與焦點管理已實作。
- 核心行程、交通、票價與訂票資料保持從 `redesign/data.js` 讀取。
- Pages allowlist 已包含三個桌機正式檔，仍排除 archive、tests、docs 與開發檔。

## 請審查的檔案

- `index.html`
- `desktop/desktop-app.js`
- `desktop/desktop.css`
- `desktop/chapters.js`
- `prepare-site.sh`、`verify.sh`
- `tests/desktop-router.test.mjs`、`tests/desktop-content.test.mjs`、`tests/entrypoints.test.mjs`、`tests/deploy-contract.test.mjs`

## 修正後驗收證據

- `./verify.sh`：66 pass、0 fail。
- 已新增資料渲染回歸測試，會檢查交通路線、住宿、票價、預約期限、官方連結、城市美食及每日完整內容，不再只檢查資料物件是否為同一參照。
- 實際瀏覽器：1440、1024、768、390、320 px 均無水平溢出；桌機與手機 console 0 error、0 warning。
- 已重現並修正交通起訖空白、住宿空白、門票 `[object Object]`、城市美食空白、同 hash 城市不切換及手機 skip link 失效。

## 風險焦點

1. 根網址分流與已安裝 PWA 的既有快取是否仍保持正確。
2. `desktop/chapters.js` 是否未複製任何核心班次、票價或日期。
3. 桌機章節切換是否只保留一個主要內容區，且 keyboard 操作不造成空白頁。
4. `_site` 是否只包含正式桌機與手機資產。

## 尚未授權的動作

未經使用者實際操作確認，不可合併至 `main`、推送遠端或部署。
