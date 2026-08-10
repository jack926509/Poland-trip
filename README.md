# POLSKA — 2026 波蘭四城旅遊規劃

22 頁靜態旅遊指南：8 天行程、四城地圖、訂票與待辦、實用資訊及自由行資料庫。內容只從 `src/data/*.js` 產生，更新資料不用逐頁修改 HTML。

```bash
npm run build
env -u NODE_OPTIONS ./verify.sh
```

建置結果在 `dist/`；部署前以 `./prepare-site.sh <空目錄>` 組裝正式檔案。舊版頁面與 PWA 僅保留於 `archive/`。
