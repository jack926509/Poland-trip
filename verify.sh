#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"

npm test
npm run audit:map-pins
node --check build.mjs
node --check sw.js
bash -n prepare-site.sh
git diff --check -- . ':(exclude)archive/**'
echo "✅ POLSKA 新版靜態網站自動驗收完成"
