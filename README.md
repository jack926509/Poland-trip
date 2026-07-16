# 🇵🇱 2026 波蘭旅行伴隨 PWA

## 網頁與手機 PWA

- 正式入口：根網址 `/`
- 電腦：同一應用自動呈現完整雙欄網頁。
- 手機：同一應用呈現固定「今日／行程／交通／訂票」四分頁；可加入主畫面及離線使用。
- 唯一旅程資料來源：`redesign/data.js`
- 修改後驗收：`./verify.sh`

`mobile.html`、`desktop.html`、`app-preview.html` 僅保留舊書籤相容轉址，不再是獨立版本。

## 經典版原始碼封存

`archive/classic-index.html` 逐字保存整併前 `a0d2553:index.html` 的經典版原始碼，僅供歷史查閱。此檔不公開於 sitemap、manifest、正式 build 或 Service Worker 快取。

## 自動部署

推送到 `main` 後，GitHub Pages 與 Cloudflare Pages workflow 都會先執行 `./verify.sh`，再由 `./prepare-site.sh` 組裝安全 `_site` allowlist。實際發布內容只包含正式 PWA、相容轉址、圖示與 SEO 檔案；`archive/`、測試、文件及封存設計不會對外發布。
