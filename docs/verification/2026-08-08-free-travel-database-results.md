# 自由行資料庫驗收結果（2026-08-08）

## 結論

- 自動建置、測試、連結與資料契約驗證通過：共產生 21 個 HTML，34 項測試全數通過。
- `verify.sh` 通過，`git diff --check` 無輸出。
- 6 個指定頁面由本機靜態伺服器回傳 HTTP 200。
- 真實瀏覽器視覺驗收：**BLOCKED**。指定的 browser-client 找不到任何可控制的瀏覽器，因此本次不能宣稱桌面、390×844、console 或水平溢位檢查通過，也沒有產生新的瀏覽器截圖。

## 執行命令與結果

### 建置與測試

```sh
npm test
```

結果：成功；`build 完成：21 頁已產生至 dist/`，共 34 項測試，34 pass、0 fail。

```sh
env -u NODE_OPTIONS ./verify.sh
```

結果：成功；重新產生 21 頁，34 項測試全數通過，結尾為 `✅ POLSKA 新版靜態網站自動驗收完成`。

```sh
git diff --check
```

結果：成功，無輸出。

### 本機預覽

```sh
python3 -m http.server 8913 --directory dist
```

指定頁面的完整重現命令：

```sh
for path in index.html practical/database.html day-02.html day-07.html practical/essentials.html practical/booking.html; do
  curl -fsS -o /dev/null -w "${path} %{http_code} %{size_download}\n" "http://127.0.0.1:8913/${path}"
done
```

實際輸出：

```text
index.html 200 15027
practical/database.html 200 30235
day-02.html 200 15092
day-07.html 200 13924
practical/essentials.html 200 8786
practical/booking.html 200 13469
```

整理如下：

| 頁面 | HTTP | bytes |
| --- | ---: | ---: |
| `index.html` | 200 | 15027 |
| `practical/database.html` | 200 | 30235 |
| `day-02.html` | 200 | 15092 |
| `day-07.html` | 200 | 13924 |
| `practical/essentials.html` | 200 | 8786 |
| `practical/booking.html` | 200 | 13469 |

這只能證明預覽伺服器與檔案可讀，不能取代視覺、console 或 viewport 驗收。

## 靜態產出確認

產出內容與測試確認下列項目存在：

- 首頁：`出發準備度`、8 類準備項目、`自由行資料庫` 入口。
- 資料庫：`自由行資料庫` 標題、文字狀態、官方來源、`tel:112`、`tel:999`、代表處急難救助 `tel:+48668027574`。
- Day 2：`今天怎麼走`、`晚間準備`、`非營業週日`。
- Day 7：`今天怎麼走`、`晚間準備`。
- 21 個 HTML 的本機相對連結可解析，且不含破壞 GitHub Pages 的根路徑連結。

## 真實瀏覽器驗收：BLOCKED

依 `control-in-app-browser` 技能，使用其絕對路徑 `scripts/browser-client.mjs` 初始化，並以目標 URL 選取瀏覽器：

```js
await agent.browsers.getForUrl("http://localhost:8913/index.html")
```

實際錯誤：

```text
No browser is available
```

接著依技能讀取 `bootstrap-troubleshooting`，重用既有 runtime、不重設 session，並只執行一次瀏覽器探索：

```js
await agent.browsers.list()
```

結果為空陣列 `[]`。技能明確禁止改用 standalone Playwright 或其他無關瀏覽器工具，因此停止視覺驗收，未以靜態 HTML 冒充通過。

尚未完成的瀏覽器項目：

- 桌面：`index.html`、`practical/database.html`、`day-02.html`、`day-07.html`、`practical/essentials.html`、`practical/booking.html` 的標題、狀態、官方來源、電話連結、每日操作區、page-level horizontal overflow 與 console error。
- 390×844：首頁、資料庫及至少一個 day 頁的 SOS、卡片可讀性、page-level horizontal overflow。
- 截圖：database desktop、database mobile、day mobile。

解除方式：讓目前 Codex 工作階段有一個可控制的 Browser 實例（開啟／連接 Browser 分頁），再重新執行上述桌面與 390×844 檢查；完成前不能把真實瀏覽器驗收標為通過。

## 仍待旅客處理的動態／私人項目

`pending`（4 項）：

- 城際車票與延誤處理：PKP 開賣後確認車次、車廂、座位與轉乘保障。
- 波蘭預付 SIM 登記：選定 SIM／eSIM 方案並完成離線包。
- 餐廳訂位與當日營業：逐分店重查日期、營業與訂位。
- 景點票券與入場時段：完成逐項購票並保存私人離線票券。

`private-required`（5 項）：

- 聯運行李額度與轉機：由電子機票／航空公司確認實際額度及直掛。
- 旅平險與緊急就醫：填入保險公司、保單號與海外救援方式。
- 轉場日行李寄放：依實際住宿確認寄放與備案。
- 入境文件包與旅外登錄：完成旅外登錄並離線保存私人文件。
- 7 晚住宿確認：填入住宿、完整地址、入住退房與聯絡方式；公開網站不保存訂房代碼等敏感資料。

另有 `recheck` 動態項目（ETIAS、車站設施、非營業週日／諸聖節前夕、無障礙協助）必須依頁面列出的日期於出發前重查。

## 工作樹範圍

驗收文件與 Task 6 報告提交於 `d19ffcb` 後，執行：

```sh
git status --short
```

實際輸出：

```text
?? .agents/
?? .claude/
?? skills-lock.json
```

執行：

```sh
git diff --stat
```

結果無輸出，代表當時沒有未提交的 tracked file 差異；工作樹只剩上述 3 個既有 untracked 項目。`.agents/`、`.claude/`、`skills-lock.json` 未被加入暫存區。
