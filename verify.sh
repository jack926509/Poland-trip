#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"

node --test tests/*.test.mjs
./build.sh
node --check redesign/dist/B-companion.js
node --check redesign/data.js
node --check redesign/pwa-core.js
node --check pwa-register.js
node --check legacy-redirect.js
node --check sw.js
git diff --check
echo "✅ POLSKA 單一 PWA 自動驗收完成"
