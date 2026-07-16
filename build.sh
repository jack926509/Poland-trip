#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"
ESBUILD_VERSION="${ESBUILD_VERSION:-0.24.0}"
npx --yes "esbuild@${ESBUILD_VERSION}" redesign/B-companion.jsx \
  --jsx=transform \
  --jsx-factory=React.createElement \
  --jsx-fragment=React.Fragment \
  --minify \
  --target=es2018 \
  --outfile=redesign/dist/B-companion.js
echo "✅ 正式網頁與手機 PWA bundle 已完成"
