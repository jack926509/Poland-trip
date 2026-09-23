# 波蘭超市採買推薦：收錄依據

查閱日期：2026-09-22。清單沒有排名；年份指原文日期，與查閱日期分開。

## 2026 年文章

[Becca Daily：波蘭伴手禮](https://beccadaily.com/poland-souvenirs/)，頁面標示 2026-07-02。
收錄其提及的 Ptasie Mleczko、Delicje、Śliwka Nałęczowska、Paluszki、Princessa。商品口味及照片只是辨識範例，不表示作者推薦該精確 SKU。

## 經典補充

[Reddit r/poland：Quintessential Polish Snacks](https://www.reddit.com/r/poland/comments/1mbyjhu/quintessential_polish_snacks/)，2025-07-29。網友個人口味，不是銷售統計。據此補充 Krówki、Prince Polo、Michałki、Kabanosy、Tymbark。

[English Wizards：Polish Snacks and Souvenirs](https://englishwizards.org/student-stories/polish-snacks-souvenirs/)，頁面未明示日期，只用作補充交叉參考，不能用搜尋引擎抓取日期宣稱是 2026 新文。

[Colian：Śliwka Nałęczowska](https://colian.com/nasze-marki/sliwka-naleczowska-2/)，品牌商品描述及包裝系列核對；沒有發文日期。

## 取捨與照片

移除原清單的 Przysnacki、Żurek、Pierogi，改收李子巧克力、鹹餅乾棒、Princessa。這是本次依來源與旅行用途的編輯選擇，不表示被移除商品不值得買。
刪除沒有逐品項店家證據的 ◎／○／△ 通路供貨符號。
保留既有商品錨點識別碼，新品用 11–13，不顯示成排名。舊 #top10 連結保留相容性，新入口使用 #recommendations。

全部商品使用本機 Open Food Facts 代表包裝照片，點擊可放大；來源、原圖與 CC BY-SA 3.0 授權見 assets/photos/GROCERY-CREDITS.md。三張新圖已核對商品名並轉成 WebP，加入離線快取。原照片不是 2026 新包裝保證。

## 2026-09-23 補記：移除三張已無商品的照片

上面移除 Przysnacki、Żurek、Pierogi 時，對應的 `grocery-04.webp`、`grocery-09.webp`、`grocery-10.webp` 沒有跟著清掉：資料檔仍定義、`sw.js` 仍手動列著，每個 PWA 安裝都照樣下載並永久快取這 81KB，還算進快取指紋。2026-09-23 的補充（#91）重新整理商品時也沒有把這三項加回來，因此確認為孤兒並刪除檔案、`grocery-photos.js` 條目與 `GROCERY-CREDITS.md` 署名列。檔案可從 git 歷史取回；日後若重新收錄，連同來源與推薦理由一起加回即可。

同時把 `sw.js` 的商品照片預快取清單改由建置依 `groceryProducts` 推導，並以測試要求資料、檔案、預快取清單與署名四者一致，之後換商品不需要再手動同步。
