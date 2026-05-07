#!/bin/bash
# 重新編譯 redesign/*.jsx → redesign/dist/*.js
# 使用情境：你修改了 redesign/ 底下任何 .jsx 檔之後執行一次

set -e
cd "$(dirname "$0")"

echo "🔨 編譯 redesign JSX → dist JS..."
for f in redesign/A-magazine.jsx redesign/B-companion.jsx redesign/C-app.jsx redesign/ios-frame.jsx redesign/tweaks-panel.jsx; do
  out="redesign/dist/$(basename "$f" .jsx).js"
  npx --yes esbuild@latest "$f" \
    --jsx=transform \
    --jsx-factory=React.createElement \
    --jsx-fragment=React.Fragment \
    --minify \
    --target=es2018 \
    --outfile="$out" 2>&1 | tail -1
done

echo ""
echo "✅ 完成。下一步：git add redesign/dist/ && git commit && git push"
