import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

test('Pages workflow 驗證後只上傳安全組裝的 _site', () => {
  const workflow = fs.readFileSync('.github/workflows/deploy.yml', 'utf8');
  const verifyAt = workflow.indexOf('./verify.sh');
  const prepareAt = workflow.indexOf('./prepare-site.sh _site');
  const uploadAt = workflow.indexOf('actions/upload-pages-artifact@v3');
  assert.ok(verifyAt >= 0 && verifyAt < prepareAt && prepareAt < uploadAt);
  assert.match(workflow, /path:\s*_site/);
  assert.doesNotMatch(workflow, /path:\s*\./);
});

test('prepare-site 從空目錄組出唯一 PWA allowlist', () => {
  const parent = fs.mkdtempSync(path.join(os.tmpdir(), 'polska-site-'));
  const output = path.join(parent, 'site');
  fs.mkdirSync(output);
  try {
    execFileSync('./prepare-site.sh', [output], { stdio: 'pipe' });
    for (const file of [
      'index.html', 'manifest.json', 'sw.js', 'pwa-register.js',
      'mobile.html', 'desktop.html', 'app-preview.html', 'legacy-redirect.js',
      'redesign/B-companion.css', 'redesign/dist/B-companion.js',
      'redesign/data.js', 'redesign/pwa-core.js', 'redesign/tokens.css',
      'vendor/react.production.min.js', 'vendor/react-dom.production.min.js',
      'apple-touch-icon.png', 'icon-192.png', 'icon-512.png',
    ]) assert.equal(fs.existsSync(path.join(output, file)), true, `缺少 ${file}`);

    for (const forbidden of [
      'archive', 'tests', 'docs', '.github', '.superpowers', 'prepare-site.sh',
      'redesign/A-magazine.jsx', 'redesign/C-app.jsx', 'redesign/ios-frame.jsx',
      'redesign/dist/A-magazine.js', 'redesign/dist/C-app.js', 'redesign/dist/ios-frame.js',
    ]) assert.equal(fs.existsSync(path.join(output, forbidden)), false, `不應公開 ${forbidden}`);
  }
  finally {
    fs.rmSync(parent, { recursive: true, force: true });
  }
});
