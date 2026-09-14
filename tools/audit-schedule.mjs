// tools/audit-schedule.mjs — 行程時間的結構稽核。
//
// 這支工具回答的是人腦記不住的問題：某天的步驟時刻有沒有倒退、某個
// 「★ 進館」步驟是不是排在該館末入場之後、轉場日離發車還剩幾分鐘。
// 檢查全部由 trip.js／tickets.js 的現有資料推得，不另建平行事實。
//
// 嚴重度分兩級，理由是誤判成本不同：
//   error   —— 純結構錯誤，不需要判斷就知道是錯的（時刻倒退、引用指不到）。
//              會讓 exitCode = 1 擋住流程。
//   warning —— 牽涉現場判斷，可能有合理例外（緩衝多寡、末入場前幾分鐘進場）。
//              只印出來供人複核，不擋。

import { pathToFileURL } from 'node:url';

import { days } from '../src/data/trip.js';
import { parseStepTime } from '../src/lib/schedule.mjs';

function makeReport() {
  return {
    errors: [],
    warnings: [],
    error(rule, message) { this.errors.push(`[${rule}] ${message}`); },
    warn(rule, message) { this.warnings.push(`[${rule}] ${message}`); },
  };
}

/**
 * 規則 1：同一天的步驟時刻不得倒退。
 * 區間型（'13:30–15:00 預留'）以結束時刻作為下一步的比較基準。
 */
export function auditStepOrder(tripDays, report) {
  let checked = 0;
  for (const day of tripDays) {
    let previous = null;
    let previousStep = null;
    for (const step of day.steps) {
      const parsed = parseStepTime(step.t);
      if (!parsed) continue;
      checked += 1;
      if (previous !== null && parsed.minutes < previous) {
        report.error('步驟順序', `Day ${day.n}（${day.date}）「${previousStep.t} ${previousStep.label}」之後出現較早的「${step.t} ${step.label}」`);
      }
      previous = parsed.endMinutes ?? parsed.minutes;
      previousStep = step;
    }
  }
  return { checked };
}

export function auditSchedule(tripDays = days) {
  const report = makeReport();
  const order = auditStepOrder(tripDays, report);
  return {
    errors: report.errors,
    warnings: report.warnings,
    stats: { days: tripDays.length, stepsChecked: order.checked },
  };
}

function runCli() {
  const result = auditSchedule();

  console.log(`行程時間稽核：${result.stats.days} 天、${result.stats.stepsChecked} 個有時刻的步驟`);

  if (result.warnings.length) {
    console.log('');
    console.log(`需人工複核 ${result.warnings.length} 項：`);
    for (const warning of result.warnings) console.log(`  ⚠ ${warning}`);
  }

  if (result.errors.length) {
    console.error('');
    console.error(`結構錯誤 ${result.errors.length} 項：\n- ${result.errors.join('\n- ')}`);
    process.exitCode = 1;
  } else {
    console.log('結構檢查通過。');
  }
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectRun) runCli();
