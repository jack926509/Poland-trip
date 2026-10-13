// todo-status.mjs — 訂票／待辦狀態的唯一計算處。
//
// 正本是 data/trip.js 的 todoGroups。所有「已訂幾項、還剩什麼」的數字、清單與一句摘要，
// 一律由這裡從 todoGroups 算出來，不再在各頁手寫副本。
// 本檔不 import 任何資料檔（資料以參數傳入），因此 trip.js 本身也能安全使用，不會循環相依。
import { isOpenTodoStatus } from '../scripts/dashboard.js';

/** 待辦：沒有被標 skip（線上訂不到、不再提醒），且狀態文字屬於未完成。 */
export const isTodoOpen = item => !item.skip && isOpenTodoStatus(item.status);

export function todoStats(groups) {
  const rows = groups.map(group => {
    const open = group.items.filter(isTodoOpen).length;
    const skipped = group.items.filter(item => item.skip).length;
    return {
      id: group.id,
      title: group.title,
      total: group.items.length,
      open,
      skipped,
      done: group.items.length - open - skipped,
    };
  });
  const sum = key => rows.reduce((total, row) => total + row[key], 0);
  return { total: sum('total'), open: sum('open'), skipped: sum('skipped'), done: sum('done'), groups: rows };
}

/** 「城際交通 1／主要景點 3／餐飲訂位 8」；只列還有待辦的分類。 */
export function todoBreakdownText(stats) {
  return stats.groups.filter(row => row.open > 0).map(row => `${row.title} ${row.open}`).join('／');
}

const itemLabel = item => `${item.date} ${item.name}`;

/** 某一類的一句話摘要，給行前提醒、資料庫等處使用。 */
export function groupSummary(groups, groupId) {
  const group = groups.find(item => item.id === groupId);
  if (!group) throw new Error(`todoGroups 找不到分類：${groupId}`);
  const open = group.items.filter(isTodoOpen);
  const skipped = group.items.filter(item => item.skip);
  const done = group.items.filter(item => !item.skip && !isTodoOpen(item));
  return { group, open, skipped, done };
}

/** 一組待辦項目的狀態：全部完成回狀態文字，否則回「狀態（N 項）」或「N 項待處理」。 */
export function statusOfItems(items) {
  if (!items.length) throw new Error('statusOfItems 沒有項目可引用');
  const open = items.filter(isTodoOpen);
  const pool = open.length ? open : items;
  const statuses = [...new Set(pool.map(item => item.status))];
  if (!open.length) return statuses.join('、');
  if (open.length === 1) return open[0].status;
  return statuses.length === 1 ? `${statuses[0]}（${open.length} 項）` : `${open.length} 項待處理`;
}

/**
 * deadlines[].todoRef → 對應的待辦項目。
 * { group, ticketPurchaseIds?, nameIncludes? }：先選分類，再用票券編號或名稱關鍵字縮小；
 * 都沒給就是整類。找不到任何項目直接丟錯，避免引用悄悄失效。
 */
export function resolveTodoRef(groups, ref) {
  const group = groups.find(item => item.id === ref.group);
  if (!group) throw new Error(`todoRef 找不到分類：${ref.group}`);
  let items = group.items;
  if (ref.ticketPurchaseIds) items = items.filter(item => ref.ticketPurchaseIds.includes(item.ticketPurchaseId));
  if (ref.nameIncludes) items = items.filter(item => ref.nameIncludes.some(word => item.name.includes(word)));
  if (!items.length) throw new Error(`todoRef 沒有對到任何待辦：${JSON.stringify(ref)}`);
  return items;
}

/** 讓手動 deadlines 的 status 欄由待辦正本推導；沒有 todoRef 的（複查、證件）維持手寫。 */
export function withDerivedStatus(deadlines, groups) {
  return deadlines.map(deadline => (
    deadline.todoRef ? { ...deadline, status: statusOfItems(resolveTodoRef(groups, deadline.todoRef)) } : deadline
  ));
}

/** 景點票券的一句摘要（資料庫「景點票券」用）。 */
export function attractionTicketSummary(groups) {
  const { group, open, skipped, done } = groupSummary(groups, 'attractions');
  const names = items => items.map(itemLabel).join('、') || '無';
  return {
    title: `景點票券：已訂 ${done.length} 項，其餘 ${group.items.length - done.length} 項（${open.length} 項待訂、${skipped.length} 項線上已售完）`,
    text: `待辦事項頁為正本，這裡自動摘要：已訂 ${names(done)}；尚未購票 ${names(open)}；線上已售完、當天現場再試 ${names(skipped)}。`,
  };
}

/** 行前提醒第 05 條：城際交通。 */
export function railNoteHtml(groups, todoHref) {
  const { group, open, done } = groupSummary(groups, 'rail');
  const pending = open.length ? `待處理 ${open.length} 項（${open.map(itemLabel).join('、')}）` : '全部處理完畢';
  return `城際交通共 ${group.items.length} 項，已購 ${done.length} 項，${pending}。四段 PKP 的抵達時間、艙等、車廂、座位及票價請進票券詳細頁核對，並存離線票券；逐項狀態見<a href="${todoHref}">待辦事項</a>。`;
}

/** 行前提醒第 07 條：整體先訂清單。 */
export function bookingNoteHtml(groups, todoHref) {
  const stats = todoStats(groups);
  const breakdown = todoBreakdownText(stats);
  const skipped = stats.skipped ? `；線上已售完、當天現場再試 ${stats.skipped} 項` : '';
  const head = stats.open ? `待辦共 ${stats.total} 項，已完成 ${stats.done} 項，仍待處理 ${stats.open} 項（${breakdown}）` : `待辦共 ${stats.total} 項，已全部處理`;
  return `先訂清單——${head}${skipped}。奧斯威辛入場須同時出示入場證與證件；逐項狀態見<a href="${todoHref}">待辦事項</a>。`;
}
