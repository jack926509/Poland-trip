# 🇵🇱 2026 波蘭旅行伴隨 PWA

## 桌機網頁與手機 PWA

- 正式入口：根網址 `/`
- 電腦：寬度大於等於 768 px 時顯示「POLSKA — Travel Atlas」分章雜誌；可用 `?view=desktop` 強制預覽。
- 手機：寬度小於 768 px 時顯示固定「首頁／行程／交通／記帳」四分頁；首頁右上「⋯」選單內有拍照清單、匯率換算、打包清單、SOS 緊急卡、實用資訊、行前指南六個工具子頁；可用 `?view=mobile` 強制預覽，並可加入主畫面及離線使用。
- 手機直接入口：`/mobile.html`，不受螢幕寬度影響；PWA 安裝後也固定由此入口啟動。
- 唯一旅程資料來源：`redesign/data.js`
- 桌機的 Day 1–8、交通與訂票同樣引用 `redesign/data.js`；`desktop/chapters.js` 只存城市、文化與實用文章。
- 修改後驗收：`./verify.sh`

`desktop.html` 與 `app-preview.html` 僅保留舊書籤相容轉址；`mobile.html` 是正式手機 PWA 應用殼。

Service Worker 使用 `polska-v21`，同時預快取桌機根殼與手機殼。離線開啟 `/mobile.html` 會回手機旅伴，開啟根網址則回桌機／響應式共用入口；更新仍需由使用者確認後才切換。

## 經典版原始碼封存

`archive/classic-index.html` 逐字保存整併前 `a0d2553:index.html` 的經典版原始碼，僅供歷史查閱。此檔不公開於 sitemap、manifest、正式 build 或 Service Worker 快取。

## 自動部署

推送到 `main` 後，GitHub Pages 與 Cloudflare Pages workflow 都會先執行 `./verify.sh`，再由 `./prepare-site.sh` 組裝安全 `_site` allowlist。實際發布內容只包含正式桌機資產、手機 PWA、相容轉址、圖示與 SEO 檔案；`archive/`、測試、文件及封存設計不會對外發布。
