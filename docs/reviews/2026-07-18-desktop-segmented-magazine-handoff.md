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

## 驗收證據

- `./verify.sh`：61 pass、0 fail。
- 實際瀏覽器：桌機章節與 Day 切換、hash、焦點、1280 px 無溢出；手機強制模式與 console 0 error。

## 風險焦點

1. 根網址分流與已安裝 PWA 的既有快取是否仍保持正確。
2. `desktop/chapters.js` 是否未複製任何核心班次、票價或日期。
3. 桌機章節切換是否只保留一個主要內容區，且 keyboard 操作不造成空白頁。
4. `_site` 是否只包含正式桌機與手機資產。

## 尚未授權的動作

未經使用者實際操作確認，不可合併至 `main`、推送遠端或部署。
