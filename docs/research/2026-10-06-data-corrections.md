# 2026-10-06 全專案資料修正與驗收

## 授權與範圍

使用者要求依全專案查核發現及建議調整資料，檢查通過後推送。以前一輪 2026-10-06 查核為清單，修正來源資料並重新建置；不將未取得的票面、私人訂單、指定日期庫存或候選店資料標為已確認。

## 計畫與驗收條件

1. 同步 10/23 台灣出發基準、Day 8 早餐、Day 4 拍照截止、Wawel 短路線購票、牛角麵包博物館主行程、百年廳取消殘留。
2. 依官網修正票務、巴士、交通票互認、餐飲與商品資料，保留查核日期及未確認範圍。
3. 補 EES 與 Cathay／Qatar／EVA 行動電源規則、住宿公開入住時間；私人晚到取鑰匙仍待旅客確認。
4. 驗收：全量 build／test、行程及地圖稽核、手機與桌機頁面渲染、獨立複查均通過；舊矛盾不再出現在生成頁，四段已購火車證據保持一致。
5. 通過後提交及推送，分別核對遠端版本、兩條部署流程及正式頁面。

## 證據與保留事項

- 交通與景點：見本目錄 `2026-10-06-transport-venue-corrections.md`。
- 餐飲與購物：見本目錄 `2026-10-06-dining-shopping-corrections.md`。
- 入境：歐盟 [Smart Borders](https://home-affairs.ec.europa.eu/policies/schengen/smart-borders_en) 於 10/06 確認 EES 已於 4/10 全面運作、ETIAS 尚未運作且不收申請；[EES 程序](https://www.consilium.europa.eu/en/policies/entryexit-system/) 說明短期入境登錄及生物辨識。出發前保留一次動態複查，不等於需立即申請 ETIAS。
- 行動電源：[Qatar 公告](https://www.qatarairways.com/en/travel-alerts.html)、[Cathay 公告](https://www.cathaypacific.com/cx/en_TW/latest-news/security-and-operational-changes/restrictions-on-the-carriage-of-lithium-battery-power-banks.html)、[Cathay 電池規則](https://www.cathaypacific.com/cx/en_US/baggage/controlled-and-banned-items/lithium-batteries.html)、[EVA 規則](https://www.evaair.com/zh-tw/fly-prepare/baggage/additional-baggage-information/restrictions/)；10/06 重查。本趟建議每人最多 2 個、各不超過 100 Wh，以符合 Qatar 航段容量上限；各航司機上使用規則分開說明。
- [ibis budget 官方](https://all.accor.com/hotel/7165/index.en.shtml) 公布 15:00 入住／12:00 退房及寄物服務；私人訂房若有不同約定，以確認信為準。
- 未取得 10/26 巴士與待購景點的完整可售結果；9/09 巴士與 9/24 全景畫名額維持歷史快照。四段火車抵達時間、座位及票價仍待票券詳細頁。
- 未安排的餐飲候選保留 pending／partial；Pyzy 週六、Specjały 官網時段矛盾、公寓晚到取鑰匙均維持待確認。

## 驗收記錄

- 日期回推測試先改為 `travelStart` 後實跑，確實抓到原有 10/24 基準差 1 天；資料修正後通過。
- 完整 `env -u NODE_OPTIONS ./verify.sh`：建置成功，292 項測試通過、0 失敗、0 跳過。快取測試使用本機測試伺服器完成，沒有略過。
- `audit:schedule`：8 天、68 個有時刻步驟，結構通過。`audit:map-pins`：50 圖釘、47 記錄已核對、3 範圍代表點、0 無效；未宣稱本輪重新定位全部圖釘。
- 新上下文、未參與修改的獨立審查者實跑全量測試與兩項稽核，並重新讀取 Wawel、SKM、EU、POLIN、Lajkonik、三家承運航司官網：PASS，無阻擋推送問題。4 段已購火車完整記錄與修改前一致。
- 實際瀏覽器：1440 px 桌機檢視訂票、待辦、門票、基本須知、購物、餐飲、Day 3 與 Day 7；320 px 檢視 Day 4、Day 8、待辦、門票、基本須知及購物；390 px 檢視 Day 4／Day 8。檢查標題、主內容、日期／票務文字及水平寬度，均無頁面溢出；截圖確認桌機與手機渲染。
- 開頁另發現模板的舊 ETIAS 提醒及 09/28 火車更新日期，已同步最新來源為 10/06；Day 3 費用欄補「線上快照／付款前重查」。
- 仍有 55 家候選餐廳待查，私人票面、晚到取鑰匙、指定日場次與座位庫存尚未取得；這些保持待確認，沒有因測試通過而標成完成。
