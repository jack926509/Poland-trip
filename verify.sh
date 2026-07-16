#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"

node --test tests/*.test.mjs
bundle_before="$(mktemp)"
trap 'rm -f "$bundle_before"' EXIT
cp redesign/dist/B-companion.js "$bundle_before"
./build.sh
if ! cmp -s "$bundle_before" redesign/dist/B-companion.js; then
  echo "❌ build 改變了已提交的 bundle；請先執行 ./build.sh 並一併提交 source 與 dist" >&2
  exit 1
fi
node --check redesign/dist/B-companion.js
node --check redesign/data.js
node --check redesign/pwa-core.js
node --check pwa-register.js
node --check legacy-redirect.js
node --check sw.js
git diff --check
echo "✅ POLSKA 單一 PWA 自動驗收完成"
