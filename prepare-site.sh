#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"

if [ "$#" -ne 1 ] || [ ! -d "$1" ]; then
  echo "用法：./prepare-site.sh <全新空輸出目錄>" >&2
  exit 1
fi

output="$1"
if find "$output" -mindepth 1 -print -quit | grep -q .; then
  echo "❌ 輸出目錄必須是空的：$output" >&2
  exit 1
fi

npm run build

cp -R dist/. "$output/"
cp \
  sw.js apple-touch-icon.png icon-192.png icon-512.png \
  og-image.svg robots.txt sitemap.xml \
  "$output/"

echo "✅ Pages 公開輸出已組裝：$output"
