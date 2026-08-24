#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

function parseArgs(argv) {
  const args = argv.slice(2);
  const opts = {
    source: 'dashboard-export.csv',
    output: path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'travel-database.sync.json'),
    dryRun: false,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if ((arg === '--source' || arg === '-s') && args[i + 1]) {
      opts.source = args[++i];
      continue;
    }
    if ((arg === '--output' || arg === '-o') && args[i + 1]) {
      opts.output = args[++i];
      continue;
    }
    if (arg === '--dry-run') {
      opts.dryRun = true;
      continue;
    }
    if (arg === '--help' || arg === '-h') {
      opts.help = true;
    }
  }

  return opts;
}

function showHelp() {
  console.log(`Usage:
  node tools/sync-dashboard-overrides.mjs --source <csvPath>
Options:
  --source, -s   Dashboard CSV 檔 (必填)
  --output, -o   覆寫輸出檔，預設 src/data/travel-database.sync.json
  --dry-run      僅驗證不寫檔
  --help         顯示本說明`);
}

function normalizeHeader(text) {
  return String(text || '')
    .trim()
    .toLowerCase()
    .replace(/[\u3000\s/_-]+/g, '');
}

function mapHeader(header) {
  const key = normalizeHeader(header);
  const map = {
    id: 'id',
    項目id: 'id',
    entryid: 'id',
    sid: 'id',
    status: 'status',
    狀態: 'status',
    狀態描述: 'status',
    sourceurl: 'sourceUrl',
    官方來源: 'sourceUrl',
    verifiedat: 'verifiedAt',
    verified: 'verifiedAt',
    查證日期: 'verifiedAt',
    recheckat: 'recheckAt',
    recheck: 'recheckAt',
    重查日期: 'recheckAt',
    checkedat: 'checkedAt',
    盤查日期: 'checkedAt',
    private: 'private',
    privateflag: 'private',
    是否私有: 'private',
    私人: 'private',
    private_required: 'private',
    summary: 'summary',
    簡述: 'summary',
    描述: 'summary',
    offlinenote: 'offlineNote',
    離線備註: 'offlineNote',
    備註: 'offlineNote',
  };
  return map[key] || null;
}

export function normalizeStatus(value) {
  if (!value) return null;
  const raw = String(value).trim().toLowerCase();
  const map = {
    verified: 'verified',
    已查證: 'verified',
    verifieddone: 'verified',
    recheck: 'recheck',
    待確認: 'pending',
    pending: 'pending',
    待更新: 'pending',
    待複查: 'recheck',
    出發前重查: 'recheck',
    privaterequired: 'private-required',
    private: 'private-required',
    需填私人資料: 'private-required',
  };
  return map[raw] || null;
}

function parseBool(value) {
  if (typeof value === 'boolean') return value;
  const raw = String(value || '').trim().toLowerCase();
  if (!raw) return undefined;
  if (['true', '1', 'y', 'yes', '是', '需要', '要'].includes(raw)) return true;
  if (['false', '0', 'n', 'no', '否', '不需要', '不要'].includes(raw)) return false;
  throw new Error(`無法辨識 private 值：${value}`);
}

function trimOrNull(value) {
  const v = String(value || '').trim();
  return v === '' ? null : v;
}

function parseCSV(raw) {
  const rows = [];
  let row = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < raw.length; i += 1) {
    const ch = raw[i];
    const next = raw[i + 1];
    if (ch === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === ',' && !inQuotes) {
      row.push(current);
      current = '';
      continue;
    }
    if ((ch === '\r' || ch === '\n') && !inQuotes) {
      if (ch === '\r' && next === '\n') i += 1;
      row.push(current);
      if (row.length > 1 || row[0] !== '') rows.push(row);
      row = [];
      current = '';
      continue;
    }
    current += ch;
  }
  if (inQuotes) throw new Error('CSV 欄位含未關閉引號，請檢查匯出檔格式');
  if (current.length || row.length) {
    row.push(current);
    if (row.length > 1 || row[0] !== '') rows.push(row);
  }
  return rows;
}

export function normalizeRows(rows, knownIds) {
  if (!rows.length) return { out: [], warnings: [] };
  const headerMap = rows[0].reduce((acc, field, idx) => {
    const mapped = mapHeader(field);
    if (mapped) acc[idx] = mapped;
    return acc;
  }, {});

  const out = [];
  const warnings = [];
  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i];
    const obj = {};
    row.forEach((value, idx) => {
      const key = headerMap[idx];
      if (!key) return;
      obj[key] = value;
    });

    if (!obj.id || !obj.id.trim()) {
      warnings.push(`第 ${i + 1} 列缺少 id，已略過`);
      continue;
    }
    const id = String(obj.id).trim();
    if (!knownIds.has(id)) {
      warnings.push(`第 ${i + 1} 列 id=${id} 不在現有資料庫，已略過`);
      continue;
    }

    const normalized = {
      id,
      status: normalizeStatus(obj.status),
      sourceUrl: obj.sourceUrl ? trimOrNull(obj.sourceUrl) : null,
      verifiedAt: obj.verifiedAt ? trimOrNull(obj.verifiedAt) : null,
      recheckAt: obj.recheckAt ? trimOrNull(obj.recheckAt) : null,
      checkedAt: obj.checkedAt ? trimOrNull(obj.checkedAt) : null,
      summary: obj.summary ? trimOrNull(obj.summary) : null,
      offlineNote: obj.offlineNote ? trimOrNull(obj.offlineNote) : null,
      private: parseBool(obj.private),
    };

    out.push(normalized);
  }

  return { out, warnings };
}

async function main() {
  const opts = parseArgs(process.argv);
  if (opts.help) {
    showHelp();
    return;
  }

  if (!opts.source) {
    console.error('missing --source');
    process.exitCode = 2;
    return;
  }

  const importPath = path.resolve(process.cwd(), opts.output.replace(/\\/g, '/'));
  let travelData;
  try {
    travelData = await import(path.resolve(process.cwd(), 'src', 'data', 'travel-database.js'));
  } catch (error) {
    console.error('無法載入 src/data/travel-database.js，請先確認專案可正常執行。');
    console.error(error.message);
    process.exitCode = 1;
    return;
  }
  const knownIds = new Set((travelData.databaseEntries || []).map((item) => item.id));

  const sourcePath = path.resolve(process.cwd(), opts.source);
  const raw = fs.readFileSync(sourcePath, 'utf8');
  const rows = parseCSV(raw);
  const { out, warnings } = normalizeRows(rows, knownIds);

  if (!out.length) {
    console.warn('已解析 0 筆可套用列，未產生覆寫。');
  }

  for (const w of warnings) console.warn(w);
  console.log(`已套用 ${out.length} 筆（共 ${rows.length - 1} 列原始資料）`);

  if (opts.dryRun) {
    console.log('dry-run 模式，不寫入檔案。');
    return;
  }

  fs.mkdirSync(path.dirname(importPath), { recursive: true });
  fs.writeFileSync(importPath, `${JSON.stringify(out, null, 2)}\n`, 'utf8');
  console.log(`同步覆寫完成 -> ${importPath}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message || error);
    process.exitCode = 1;
  });
}
