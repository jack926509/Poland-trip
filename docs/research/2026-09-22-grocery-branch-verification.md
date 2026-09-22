# 2026-09-22 超市與便利商店門市逐店查核

## 結論

原本 12 筆候選門市全部標成 `pending`，頁面上寫「尚未取得逐店官方確認」。本輪逐店查核後：

- **12 筆地址全部由品牌官方來源確認**，其中 3 筆的寫法依官方更正。
- **4 筆改為 `verified`**（Biedronka）：官方逐店頁同時給出地址與逐日營業時間。
- **8 筆改為 `partial`**（Lidl、Żabka）：地址由官方來源確認，營業時間本輪無法由官方取得。
- **沒有任何一筆取得核實座標**，地圖按鈕維持 Google 搜尋連結，不升級成圖釘。

另外查到兩個會影響行程判斷的事實：華沙與波茲南的車站型 Biedronka 由官方標記為星期日照常營業；Biedronka 官方日曆確認 2026 年十月沒有任何交易星期日。

## 查核方式與限制

品牌三個官方門市查詢頁（`biedronka.pl/pl/sklepy`、`lidl.pl` 門市搜尋、`zabka.pl/znajdz-sklep`）都是 JavaScript 應用，直接抓只會拿到空殼。本輪改抓**伺服器端算好的逐店頁與官方門市清單 PDF**：

| 品牌 | 可用的官方證據 | 拿不到的部分 |
|---|---|---|
| Biedronka | `biedronka.pl/pl/shop,id,<id>,title,<slug>` 逐店頁，含地址、郵遞區號、逐日營業時間、「sklep czynny w niedzielę」標記 | — |
| Lidl | `lidl.pl/s/pl-PL/sklepy/<城市>/<街道>` 逐店頁（地址與郵遞區號），以及官方門市清單 PDF | 營業時間由 JavaScript 載入，靜態抓不到 |
| Żabka | 官方門市清單 PDF（`cdn.zabka.pl`）、`zabka.pl` 的門市說明與新開幕頁 | Żabka 不逐店公布營業時間（加盟店各自決定） |

此外，本工作階段的網路政策擋掉 `www.biedronka.pl`、`www.lidl.pl`、`www.zabka.pl` 的直接連線，上述內容是透過 Tavily 連接器取回的官方頁面內容。判讀依據仍然只採品牌官方網域的頁面與檔案，第三方彙整站（targeo、mojagazetka、tiendeo、ding 等）一律不採信——它們對同一家店的營業時間互相矛盾，例如有兩個站台分別宣稱克拉科夫 Rynek Główny 34 是「星期二公休」與「星期四公休」，官方頁上兩天都正常營業。

## 逐筆結果

### Biedronka（4 筆，verified）

| 城市／地址 | 官方逐店頁 | 官方營業時間 | 星期日 |
|---|---|---|---|
| 華沙 Al. Jerozolimskie 54, 00-024 | [shop id 2678](https://www.biedronka.pl/pl/shop,id,2678,title,warszawa-al-jerozolimskie-54) | 每日 05:00–01:00 | **sklep czynny w niedzielę**（照常營業） |
| 克拉科夫 Rynek Główny 34, 31-010 | [shop id 2853](https://www.biedronka.pl/pl/shop,id,2853,title,krakow-rynek-glowny-34) | 週一至週六 06:00–23:00 | Zamknięte |
| 樂斯拉夫 Krawiecka 3a, 50-148 | [shop id 940](https://www.biedronka.pl/pl/shop,id,940,title,wroclaw-krawiecka-3a) | 週一至週六 06:00–23:00 | Zamknięte |
| 波茲南 Dworcowa 2, 61-801 | [shop id 2817](https://www.biedronka.pl/pl/shop,id,2817,title,poznan-dworcowa-2) | 週一至週六 06:00–23:00 | 06:00–22:00，**sklep czynny w niedzielę** |

波茲南 Dworcowa 2 的位置另有官方新聞稿佐證：[Biedronka 在 Poznań Główny 車站開店](https://www.biedronka.pl/pl/news,id,1033,title,nowy-sklep-biedronka-na-dworcu-kolejowym-poznan-glowny)，位於車站 +2 層。

**營業時間的效力**：Biedronka 每一頁自己都寫「Godziny otwarcia sklepów podane na stronie internetowej mają charakter orientacyjny」（網頁上的營業時間僅供參考，以門市現場為準）。因此頁面仍保留「以門市當日資訊為準」，不把這些時間寫成保證。

### Lidl（4 筆，partial）

| 城市／地址 | 官方來源 |
|---|---|
| 華沙 ul. Wolska 19/25, 01-207 | [逐店頁](https://www.lidl.pl/s/pl-PL/sklepy/warszawa/ul-wolska-19-25) |
| 克拉科夫 ul. Mogilska 116, 31-445 | [逐店頁](https://www.lidl.pl/s/pl-PL/sklepy/krakow/ul-mogilska-116) |
| 樂斯拉夫 ul. Braniborska 82 | [逐店頁](https://www.lidl.pl/s/pl-PL/sklepy/wroclaw/braniborska-82)、[官方門市清單 PDF](https://www.lidl.pl/static/assets/87e22fa4-878e-46a7-a2fb-9bf28cf39d87.pdf) |
| 波茲南 ul. Św. Marcin 24, 61-805 | [逐店頁](https://www.lidl.pl/s/pl-PL/sklepy/poznan/ul-sw-marcin-24) |

### Żabka（4 筆，partial）

| 城市／地址 | 官方來源 |
|---|---|
| 華沙 Marszałkowska 104/122（Wars Sawa Junior） | [zabka.pl 活動頁](https://www.zabka.pl/konkurs-merch) 直接寫出「Żabki Wars Sawa Junior przy Marszałkowskiej 104/122」；[新開幕清單](https://www.zabka.pl/nowe-otwarcia) 另列「Warszawa ul. Marszałkowska104/122lok.GRLF001」 |
| 克拉科夫 Rynek Główny 6, 31-042 | [官方門市清單 PDF](https://cdn.zabka.pl/wp-content/uploads/2024/02/02092801/Lista-sklepow-Zabka-z-dostepnymi-produktami-Ramen-Szamamm.pdf)（門市代碼 Z5771） |
| 樂斯拉夫 Rynek 8 lok. 1A, 50-106 | 同上（Z7216） |
| 波茲南 ul. Stary Rynek 53/54, 61-840 | 同上（Z6830） |

Żabka 的門市清單 PDF 是 2024/02 版，只能證明當時該址有門市，不能證明 2026/10 仍在營業，也沒有營業時間。四筆都維持 `partial`，頁面上的「依各店公告」提醒不移除。

## 依官方更正的寫法

| 原資料 | 改為 | 依據 |
|---|---|---|
| `Święty Marcin 24, 61-805 Poznań` | `ul. Św. Marcin 24, 61-805 Poznań` | Lidl 逐店頁與官方門市清單皆作 Św. Marcin |
| `Krawiecka 3A, 50-148 Wrocław` | `Krawiecka 3a, 50-148 Wrocław` | Biedronka 逐店頁作小寫 3a |
| `Rynek 8, 50-106 Wrocław` | `Rynek 8 lok. 1A, 50-106 Wrocław` | Żabka 官方清單帶 lok. 1A |

另外把 Lidl 三筆補上官方寫法的 `ul.` 前綴，與品牌頁一致。

## 未解決的衝突

**樂斯拉夫 Lidl Braniborska 82 的郵遞區號**：Lidl 逐店頁寫 `50-001`，Lidl 自己的門市清單 PDF 寫 `53-680`。50-001 看起來是門市搜尋的城市預設值，53-680 與 Braniborska 街實際所在的行政區一致，本檔採用 `53-680` 並保留這筆衝突紀錄——與 2026-09-19 速食查核處理 MAX Kraków（Nowohucka 52 vs 54）的原則相同：兩個官方頁衝突時記下來，出發前以 locator 為準。

## 本輪沒有做的事

- **沒有取得核實座標**，因此不新增地圖圖釘；`audit:map-pins` 的分母不變。
- **沒有查 Lidl 與 Żabka 的營業時間**。Lidl 的逐店頁確實有時間，但由 JavaScript 載入，本輪的抓取方式拿不到；不拿節慶用的「延長營業時間」PDF 充當常態時間。
- **沒有查證庫存與價格**，Top 10 的通路符號仍是原指南的採買參考，不是即時庫存。
- **車站型門市在非交易星期日的例外**：官方標記為 `sklep czynny w niedzielę`，與波蘭星期日交易限制中車站門市的例外一致，但本輪沒有找到 Biedronka 對「非交易星期日」逐店適用的官方聲明，因此頁面寫成「有機會」而不是保證。
