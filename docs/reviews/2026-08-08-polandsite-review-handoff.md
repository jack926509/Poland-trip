# POLSKA 新版靜態網站：獨立交叉審查交接包

## 審查角色與範圍

- 實作者：Codex
- 指定獨立審查者：Claude Code（不得由本次實作者自行代替）
- 比較範圍：`main...redesign-2026-08`
- 目前完成提交：`592f510`
- 規格來源：`docs/superpowers/specs/2026-08-06-poland-trip-redesign-design.md`
- 實作計畫：`docs/superpowers/plans/2026-08-07-poland-trip-redesign-implementation.md`
- 資料裁決：`docs/資料校正表.md`

## 這批改動宣稱做到什麼

1. 將舊行程資料與 `poland-travel-guide-final.html` 的新版爬蟲內容整合到 `src/data/*.js`。
2. 以純 Node.js 產生 20 個 HTML：1 首頁、8 每日頁、4 城市頁、7 實用資訊頁。
3. 四個城市頁使用 Leaflet 與 OpenStreetMap，圖釘數為 14／19／9／8，合計 50。
4. 將舊桌機版、手機 PWA、設計稿與原始爬蟲資料移入 `archive/`，不刪除原文。
5. 改寫 `prepare-site.sh` 與 `verify.sh`；新版不註冊 PWA，`sw.js` 只清除 `polska-*` 舊快取並解除註冊。

## 必跑驗收

```bash
./verify.sh
```

預期：建置 20 頁，Node 測試 18/18 通過，最後顯示「POLSKA 新版靜態網站自動驗收完成」。

另外請建立全新空目錄驗證部署產物：

```bash
output="$(mktemp -d /tmp/poland-review.XXXXXX)"
./prepare-site.sh "$output"
find "$output" -type f -name '*.html' | wc -l
```

預期為 20；公開目錄不得含 `mobile.html`、`manifest.json`、`pwa-register.js`、`redesign/` 或 `desktop/`。

## 必查資料裁決

請不要只相信現有測試，逐項對照 `docs/資料校正表.md` 與生成的 `dist/*.html`，至少確認：

- 霓虹博物館位於科學文化宮，不再寫 Praga。
- 波茲南古市政廳寫明整修閉館，不顯示可購買 PLN 10。
- Day 5 與樂斯拉夫城市頁皆寫明 10/28 百年廳圓頂不開放。
- 皇家城堡與辛德勒工廠的不確定資訊保留「待確認」。
- 全站沒有把 15:35–15:50 寫成日落時間。
- Day 8 退稅與機場報到已合併，不再有獨立 11:30 時段。
- 門票頁有 21 筆、克拉科夫地圖有 19 點、四城合計 50 點。

## 瀏覽器路徑

啟動 `dist/` 的本機 HTTP server 後，依序操作：

1. 首頁 → Day 3。
2. Day 3 → 克拉科夫城市指南。
3. 縮放地圖並點 Wawel 圓形圖釘，確認彈窗與 Google Maps 連結。
4. 進入「實用資訊 → 門票速查」。

檢查 HTTP／console／page error、橫向溢位、Playfair Display 標題字體、Noto Sans TC 內文字體與地圖圖磚。

## 風險提示

- Leaflet、OpenStreetMap 圖磚與 Google Fonts 依賴外部網路；離線時地圖底圖與網路字體不會完整載入。
- 本次依既有 2026-08 爬蟲資料合併與衝突裁決，沒有重新查遍所有官方票價與開放時間。
- `archive/` 保存爬蟲原文，原文含行尾空白；`verify.sh` 的 `git diff --check` 刻意排除該目錄，但仍檢查正式程式與文件。
- 不得自行推送或部署；推送 `main` 可能觸發正式站更新，需先取得使用者確認。

## 回報格式

每個 finding 請提供嚴重度、`檔案:行號`、影響與具體修法。若沒有 finding，也要明列實際跑過的命令、瀏覽器路徑與「未發現問題」的檢查範圍。
