# 2026-09-19 每日餐位官方資料補查

> 查核基準日：2026-09-19（台北時間）  
> 對接鍵：`name`＋`cityKey`；同名多分店（E.Wedel）還必須比對 `address`。  
> 輸出：`src/data/dining-fact-updates.js`

## 結論

本檔涵蓋 `day-dining.js` 的 24 個具名城市餐位，另補入既有餐廳資料中的 E.Wedel Krakowskie Przedmieście 45，共 25 筆。未刪除候選、未調整角色或行程順序。

本輪優先補查後，Samarqand、Pyra Bar、NOAH、WYRAJ 與兩間 E.Wedel 可由官方頁確認地址及營業時間。Pyzy Flaki Gorące 的官方頁偏偏漏列本行程需要的週六，MEI 官網的營業時間為無法讀取的動態欄位；Hankki、FOLGA、Arirang、QQ Warsaw 仍缺店家一手完整時段，因此保留 `pending`，沒有拿第三方平台的時間硬補。

## 本輪重新開啟官方頁的重點店家

| 店家 | 官方查得內容 | 狀態 | 官方來源 |
|---|---|---|---|
| Pyzy Flaki Gorące，Podwale 5 | 地址正確；官方只列一至五 12:00–22:00、日 12:00–21:00，未列週六 | pending | [店家聯絡頁](https://www.pyzyflakigorace.pl/kontakt/) |
| Hankki | Michelin 官方指南確認 Zabłocie 19A，但沒有店家一手時段 | pending | [Michelin Guide](https://guide.michelin.com/cz/en/lesser-poland/krakow/restaurant/hankki) |
| FOLGA | 店家官網確認 Estery 12 與訂位電話，未顯示完整週時段 | pending | [店家官網](https://folgakrakow.pl/) |
| Samarqand | Stawowa 23；一至四、日 08:00–23:00，五六至 00:00；廚房提早 1 小時結束 | verified | [店家官方頁](https://samarqand.pl/regulamin/) |
| Arirang Restaurant | 搜尋到的時段均來自第三方，沒有可稽核的一手頁 | pending | 無 |
| MEI | 官網確認 Solec 81B、電話與韓式燒肉，動態營業時間無法讀出 | pending | [店家官網](https://mei.eatbu.com/?lang=pl) |
| QQ Warsaw | 只找到第三方地址與時段，沒有店家一手可讀頁 | pending | 無 |
| E.Wedel Szpitalna 8 | 一至六 09:00–22:00，日 09:00–21:00 | verified | [官方分店頁](https://wedelpijalnie.pl/lokale) |
| E.Wedel Krakowskie Przedmieście 45 | 一至四 10:00–22:00，五六 10:00–23:00，日 10:00–22:00 | verified | [官方分店頁](https://wedelpijalnie.pl/lokale) |

兩間 E.Wedel 的 `name` 與 `cityKey` 相同，整合時必須再用地址區分，否則可能把 Krakowskie Przedmieście 45 的 10:00 開門誤套到 Szpitalna 8 的 09:00 開門。

## 其他本輪可直接補齊的官方結果

- [NOAH 官網](https://noahkrakow.pl/)：Meiselsa 24；一至四 16:00–22:00、五 14:00–23:00、六 13:00–23:00、日 13:00–21:30。
- [Pyra Bar 官方訂位頁](https://pyrabar.eatbu.com/?lang=en)：Strzelecka 13；一至六 11:00–21:00、日 12:00–19:00。這份現行一手資料與站內舊的「五六至 23:00」不同，整合時應採本筆。
- [WYRAJ 官方聯絡頁](https://wyraj.net/kontakt/)：Krochmalna 59/lok U2；一至四 12:00–23:00、五 12:00–00:00、六 10:00–00:00、日 10:00–22:00。
- [Hyćka 官網](https://hycka.pl/)：可再確認 Rynek Śródecki 17，但目前可讀頁沒有完整營業時間，因此資料只保留舊報告已核實的週四 11:00 起，狀態為 `partial`。

## 沿用舊報告的資料

下列項目沒有宣稱本輪重新查核；`checkedAt` 保留既有查核日：Café Bristol、Pod Aniołami、Restauracja Wrocławska、IDA、Konspira、Yache Korea、U Fukiera、NUTA、Bar Mleczny Prasowy。舊報告只證實部分內容者仍標 `partial`；Specjały Regionalne 因店家公司頁時段互相矛盾，改以 `pending` 表示。

Bar Mleczny Pod Temidą、ROGAL Świętomarciński 的具體店面沒有一手頁可核，因此 `address`、`hours`、`sourceUrl` 與 `checkedAt` 均不填。既有 Google Maps 搜尋連結仍保留作為候選導航資料，不代表內容已核實。

## 狀態定義

- `verified`：一手頁足以確認這筆店址與所列時段。
- `partial`：一手頁只支援部分時段或缺少開門時間，但已有可用且明確的官方資訊。
- `pending`：缺本行程所需時段、只有第三方資料、或一手資訊互相衝突；`checkedAt` 一律為 `null`。

營業時間仍可能因包場、節日或臨時公告調整，實際用餐日前 24–48 小時應再看店家公告或致電。
