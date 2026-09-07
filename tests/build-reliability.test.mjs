import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

import {
  replacePublishedOutputs,
  rewriteStandaloneIdReferences,
} from '../build.mjs';

function createPublicationFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'poland-build-reliability-'));
  const stagingRoot = path.join(root, 'staging');
  const stagedDistDir = path.join(stagingRoot, 'dist');
  const stagedStandalonePath = path.join(stagingRoot, 'poland-travel-guide-2026.html');
  const targetDistDir = path.join(root, 'dist');
  const targetStandalonePath = path.join(root, 'poland-travel-guide-2026.html');

  fs.mkdirSync(stagedDistDir, { recursive: true });
  fs.mkdirSync(targetDistDir, { recursive: true });
  fs.writeFileSync(path.join(stagedDistDir, 'version.txt'), '新版');
  fs.writeFileSync(stagedStandalonePath, '新版單檔');
  fs.writeFileSync(path.join(targetDistDir, 'version.txt'), '舊版');
  fs.writeFileSync(targetStandalonePath, '舊版單檔');

  return {
    root,
    paths: {
      stagingRoot,
      stagedDistDir,
      stagedStandalonePath,
      targetDistDir,
      targetStandalonePath,
    },
  };
}

test('單檔 ID 與所有明確 IDREF 會同步加上頁面前綴', () => {
  const source = `<section id="panel" data-controls="panel">
    <label for="field">查詢</label>
    <input id="field" list="choices" aria-controls="panel results" aria-describedby="help">
    <datalist id="choices"></datalist>
    <p id="help"></p><ol id="results"></ol>
  </section>`;

  const rewritten = rewriteStandaloneIdReferences(source, 'page-practical-database');

  for (const id of ['panel', 'field', 'choices', 'help', 'results']) {
    assert.match(rewritten, new RegExp(`id="page-practical-database--${id}"`));
    assert.doesNotMatch(rewritten, new RegExp(`id="${id}"`));
  }
  assert.match(rewritten, /for="page-practical-database--field"/);
  assert.match(rewritten, /list="page-practical-database--choices"/);
  assert.match(rewritten, /aria-describedby="page-practical-database--help"/);
  assert.match(rewritten, /aria-controls="page-practical-database--panel page-practical-database--results"/);
  assert.match(rewritten, /data-controls="panel"/);
});

test('完整 staging 會一起取代既有 dist 與單檔版', (t) => {
  const fixture = createPublicationFixture();
  t.after(() => fs.rmSync(fixture.root, { recursive: true, force: true }));

  replacePublishedOutputs(fixture.paths);

  assert.equal(fs.readFileSync(path.join(fixture.paths.targetDistDir, 'version.txt'), 'utf8'), '新版');
  assert.equal(fs.readFileSync(fixture.paths.targetStandalonePath, 'utf8'), '新版單檔');
  assert.ok(!fs.existsSync(fixture.paths.stagedDistDir));
  assert.ok(!fs.existsSync(fixture.paths.stagedStandalonePath));
});

test('替換單檔版中途失敗會回復完整舊版', (t) => {
  const fixture = createPublicationFixture();
  t.after(() => fs.rmSync(fixture.root, { recursive: true, force: true }));
  const injectedFailure = new Error('模擬單檔版替換失敗');

  assert.throws(() => replacePublishedOutputs(fixture.paths, {
    renameSync(from, to) {
      if (from === fixture.paths.stagedStandalonePath) throw injectedFailure;
      fs.renameSync(from, to);
    },
  }), injectedFailure);

  assert.equal(fs.readFileSync(path.join(fixture.paths.targetDistDir, 'version.txt'), 'utf8'), '舊版');
  assert.equal(fs.readFileSync(fixture.paths.targetStandalonePath, 'utf8'), '舊版單檔');
  assert.ok(!fs.existsSync(path.join(fixture.paths.stagingRoot, 'previous-dist')));
  assert.ok(!fs.existsSync(path.join(fixture.paths.stagingRoot, 'previous-standalone.html')));
});
