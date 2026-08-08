# Task 3 實作報告：首頁出發準備度

## 交付內容

- 首頁新增「出發準備度」，以 8 張卡片呈現：住宿、城際車票、景點票券、航班行李、旅平險、網路離線、ETIAS、緊急聯絡。
- `pending` 與 `private-required` 項目會排在 `recheck` 前；每張卡片顯示中文狀態並連往自由行資料庫的對應條目。
- 首頁只呈現公開的分類、處理摘要與狀態，不讀取或顯示 `private` 欄位，也不包含訂位、證件、保單或付款值。
- 新增「景點票券與入場時段」資料庫條目，讓首頁的景點票券卡片有可操作的對應說明。

## TDD 紀錄

### RED

先在 `tests/build.test.mjs` 新增首頁公開產出契約，檢查標題、8 類標籤、3 種文字狀態、8 個資料庫連結，以及待處理項目須排在 ETIAS 重查項目前。

執行：

```text
node build.mjs && node --test tests/build.test.mjs
```

結果：27 passed、1 failed；失敗點為首頁尚無「出發準備度」。

### GREEN

實作資料、建置注入與首頁卡片後，再執行相同 focused test。

結果：28 passed、0 failed。

## 完整驗證

```text
npm test
```

結果：build 產生 21 頁；28 passed、0 failed。

```text
git diff --check
```

結果：通過，沒有空白錯誤。

## 自我審查

- 只修改 Task 3 所需的首頁樣板、建置注入、測試與自由行資料庫資料；未碰觸 `.agents/`、`.claude/`、`skills-lock.json` 或 ledger。
- 狀態中文由集中式 `statusLabels` 在 build 邊界補入，首頁樣板沒有重複定義狀態文案。
- 8 個連結均使用 GitHub Pages 相容的相對路徑，並指向資料庫既有或本次新增的條目 ID。
- 沒有加入任何使用者私人值；`private` 僅存在資料層供後續流程辨識，未被首頁渲染。
