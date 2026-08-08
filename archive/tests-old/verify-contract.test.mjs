import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

test('verify 在 build 前後比較已提交 bundle 並以 trap 清理', () => {
  const verify = fs.readFileSync('verify.sh', 'utf8');
  assert.match(verify, /mktemp/);
  assert.match(verify, /trap .*EXIT/);
  assert.match(verify, /cmp .*B-companion/);
  assert.match(verify, /build 改變了已提交的 bundle/);
});
