# 🇵🇱 2026 波蘭旅行伴隨 PWA

## 桌機網頁與手機 PWA

- 正式入口：根網址 `/`
- 電腦：寬度大於等於 768 px 時顯示「POLSKA — Travel Atlas」分章雜誌；可用 `?view=desktop` 強制預覽。
- 手機：寬度小於 768 px 時維持固定「今日／行程／交通／訂票」四分頁；可用 `?view=mobile` 強制預覽，並可加入主畫面及離線使用。
- 唯一旅程資料來源：`redesign/data.js`
- 桌機的 Day 1–8、交通與訂票同樣引用 `redesign/data.js`；`desktop/chapters.js` 只存城市、文化與實用文章。
- 修改後驗收：`./verify.sh`

`mobile.html`、`desktop.html`、`app-preview.html` 僅保留舊書籤相容轉址，不再是獨立版本。

## 經典版原始碼封存

`archive/classic-index.html` 逐字保存整併前 `a0d2553:index.html` 的經典版原始碼，僅供歷史查閱。此檔不公開於 sitemap、manifest、正式 build 或 Service Worker 快取。

## 自動部署

推送到 `main` 後，GitHub Pages 與 Cloudflare Pages workflow 都會先執行 `./verify.sh`，再由 `./prepare-site.sh` 組裝安全 `_site` allowlist。實際發布內容只包含正式桌機資產、手機 PWA、相容轉址、圖示與 SEO 檔案；`archive/`、測試、文件及封存設計不會對外發布。
