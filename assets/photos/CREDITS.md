# 波蘭旅行 PWA 城市照片授權紀錄

處理方式：從 Wikimedia Commons 原始檔裁切（去除下方三分之一雜物／人物），縮放為長邊 1200px（hero）與長邊 200px（thumb），轉存 WebP。裁切與縮放屬於「改作」，因此僅使用授權允許改作的檔案（CC0 / PD / CC-BY / CC-BY-SA），未使用任何 ND（禁止改作）授權的圖片。

| 檔名 | 城市 | 作者 | 授權 | Commons 頁面 URL |
|---|---|---|---|---|
| warszawa-hero.webp | 華沙 Warszawa（舊城市集廣場 Rynek Starego Miasta） | Rhododendrites | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Market_Square_Warsaw_(22594p).jpg |
| warszawa-thumb.webp | 華沙 Warszawa（舊城市集廣場 Rynek Starego Miasta） | Rhododendrites | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Market_Square_Warsaw_(22594p).jpg |
| krakow-hero.webp | 克拉科夫 Kraków（中央市集廣場 Rynek Główny／聖瑪利亞聖殿 St. Mary's Basilica） | Andrzej Otrębski | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Krakow_Rynek_Glowny_panorama_2.jpg |
| krakow-thumb.webp | 克拉科夫 Kraków（中央市集廣場 Rynek Główny／聖瑪利亞聖殿 St. Mary's Basilica） | Andrzej Otrębski | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Krakow_Rynek_Glowny_panorama_2.jpg |
| wroclaw-hero.webp | 樂斯拉夫 Wrocław（市政廳與彩色老屋 Rynek／Ratusz） | Gerd Eichmann | CC BY 4.0 | https://commons.wikimedia.org/wiki/File:Breslau-Rynek-38-Panorama-2014-gje.jpg |
| wroclaw-thumb.webp | 樂斯拉夫 Wrocław（市政廳與彩色老屋 Rynek／Ratusz） | Gerd Eichmann | CC BY 4.0 | https://commons.wikimedia.org/wiki/File:Breslau-Rynek-38-Panorama-2014-gje.jpg |
| poznan-hero.webp | 波茲南 Poznań（舊市集廣場彩色立面與舊市政廳 Stary Rynek／Ratusz） | Mateusz.woźniak | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Poznan_stary_rynek_panorama.jpg |
| poznan-thumb.webp | 波茲南 Poznań（舊市集廣場彩色立面與舊市政廳 Stary Rynek／Ratusz） | Mateusz.woźniak | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Poznan_stary_rynek_panorama.jpg |

## 授權分類

- **CC BY-SA**：warszawa（4.0）、krakow（4.0）、poznan（3.0）— 必須標示出處（作者＋授權），且改作後之衍生檔須以相同或相容授權釋出（ShareAlike）。網站上需顯示此表格或等效出處資訊。
- **CC BY**：wroclaw（4.0，原作者頁標示 Gerd Eichmann，來源檔名前綴 Breslau 為華沙以外之樂斯拉夫舊稱）— 必須標示出處，無 ShareAlike 限制。
- 本次未使用任何 PD/CC0 檔案（四座城市挑選的最佳構圖均落在 CC-BY 系列），但四張皆確認非 NC、非 ND，允許裁切改作。

## 原始檔案（未裁切）技術資訊

| 城市 | 原始檔名 | 原始尺寸 | 原始檔 URL |
|---|---|---|---|
| 華沙 | Market Square Warsaw (22594p).jpg | 7214×3448 | https://upload.wikimedia.org/wikipedia/commons/3/3c/Market_Square_Warsaw_%2822594p%29.jpg |
| 克拉科夫 | Krakow Rynek Glowny panorama 2.jpg | 7505×3690 | https://upload.wikimedia.org/wikipedia/commons/a/a3/Krakow_Rynek_Glowny_panorama_2.jpg |
| 樂斯拉夫 | Breslau-Rynek-38-Panorama-2014-gje.jpg | 8087×2893 | https://upload.wikimedia.org/wikipedia/commons/7/7a/Breslau-Rynek-38-Panorama-2014-gje.jpg |
| 波茲南 | Poznan stary rynek panorama.jpg | 13855×3352 | https://upload.wikimedia.org/wikipedia/commons/2/26/Poznan_stary_rynek_panorama.jpg |

## 裁切與壓縮處理紀錄

- 每張先依構圖裁切掉下方雜物／人群（保留建築物立面／地標在畫面上 2/3，下 1/3 留白供深色漸層壓字）。
- 再用 Pillow（Python）等比縮放：hero 長邊 1200px，thumb 長邊 200px（同一裁切範圍，非重新取景）。
- 輸出格式 WebP，quality 76–82（依實測位元組數自動遞減至達標），method=6。
- 工具環境：本機無 cwebp／ImageMagick，改用 Python3 + Pillow 11.3.0（內建 libwebp）完成 WebP 編碼，畫質與體積皆達標，非降級妥協。
