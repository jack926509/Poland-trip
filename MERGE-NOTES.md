# Poland Trip Redesign — 三個版本

把這個 zip 解壓後跟原本 `Poland-trip` repo 的內容合併（保留下列既有檔案不動）：

## 既有檔案（**不要覆蓋**，除了 index.html）
- `main.js`、`styles.css`、`manifest.json`、`og-image.svg`、`apple-touch-icon.png`、`README.md` 等

## 本次新增 / 修改

### 修改
- **`index.html`** — 只動兩處：
  1. `<head>` 開頭加 device-redirect script（手機自動跳 `mobile.html`，加 `?classic=1` 強制留桌機版）
  2. footer 底部加「行動旅伴版 · App 預覽」連結

### 新增
- `desktop.html` — A 桌機雜誌版
- `mobile.html` — B 手機旅伴版（出門帶著看；接真實時間）
- `app-preview.html` — C iOS App 預覽
- `redesign/` — 共用資源（10 個檔，跟 root 的 `main.js` / `styles.css` 不撞名）

## 合併指令範例

```bash
# 在 Poland-trip repo 根目錄
unzip ~/Downloads/_github-export.zip -d /tmp/redesign
cp -r /tmp/redesign/_github-export/* .
git add desktop.html mobile.html app-preview.html redesign/ index.html
git commit -m "Add three redesigned variants (desktop / mobile companion / iOS app preview)"
git push
```

或開新 branch：
```bash
git checkout -b redesign/three-versions
# ...同上 add / commit
git push -u origin redesign/three-versions
```
