# POLSKA — 2026 波蘭四城紙上旅行誌

23 頁資料驅動靜態旅行誌：8 天行程、四城攝影章節與地圖、訂票待辦、實用附錄、資料更新儀表板及自由行資料庫。內容只從 `src/data/*.js` 產生，請勿直接修改 `dist/` 或根目錄單檔版。

正式驗收：

```bash
env -u NODE_OPTIONS ./verify.sh
```

建置結果在 `dist/`；部署前以 `./prepare-site.sh <空目錄>` 組裝正式檔案。舊版頁面與 PWA 僅保留於 `archive/`。
