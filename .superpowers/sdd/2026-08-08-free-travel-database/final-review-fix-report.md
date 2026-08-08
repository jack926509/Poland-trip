# Final review fix report

## 已修正

- 將所有資料庫記錄限定為六種 `category` 與六種 `cityKey`，驗證器及測試會拒絕其他值。
- 把「航空行李官方規則」與「本次行李／直掛確認」分開；把「鐵路延誤權益」與「本次城際車票」分開。首頁與每日頁指向本次待處理記錄。
- 資料庫新增城市、類別、狀態三組靜態統計索引，每組顯示筆數並可在無 JavaScript 時跳到記錄。SOS 與主資料庫不再重複 HTML ID。
- SOS 最上方完整列出 112、999、駐波蘭代表處、外交部 24 小時聯絡中心與保險救援待填狀態，並新增護照遺失、就醫、行李未到、轉機失接、卡片遺失五種純文字流程。
- 首頁摘要改為從 readiness 與 database entries 計算 P0 未完成、最近期限、下一張要買的票、ETIAS 與離線包狀態；每張待辦卡也顯示對應期限。
- 每個行程 step 均由 `stepLabels` 連到可靠地址，或列入 `unresolvedSteps` 並說明為何待住宿、分店、班次或票券確認。可靠地址具有 `entranceNote` 與 HTTPS `officialUrl`。Day 2 已補 Wawel Castle、Rynek Główny、St. Mary's Basilica、Sukiennice 與 Plac Nowy。
- README 改為 21 頁、新資料庫／每日現場功能與實際驗收指令。
- 清除 task 4、5、6 brief 的 EOF 空白。

## 測試紀錄

- 第一次 `npm test` 在資料契約改變後出現 3 個失敗：城市代碼舊預期、SOS 舊卡片界線、首頁連結數量舊預期。
- 更新契約測試後，37 項全部通過；後續又新增公開規則／本次狀態分離測試。
- 本報告不宣稱瀏覽器視覺驗收已通過；瀏覽器 BLOCKED 紀錄保持原狀，由主工作階段另行處理。
