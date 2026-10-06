import { escapeAttr, escapeHtml } from '../lib/html.mjs';
import { stay } from '../data/trip.js';
import { privateSlots, stayPrivateSlotId } from '../data/private-slots.js';
import { privateRead, privateWrite, privateClear, privateTelHref, initializePrivate } from '../scripts/private-data.js';

/** 內嵌進頁面的執行階段；順序要讓相依函式先於使用者。 */
export const PRIVATE_RUNTIME = [privateRead, privateWrite, privateClear, privateTelHref, initializePrivate]
  .map(fn => fn.toString()).join('\n');

/** 放在頁面最後的內嵌腳本。單檔版會替 id 加前綴，所以一律只用 data-* 選取。 */
export function renderPrivateRuntime() {
  return `<script>
      (function() {
        ${PRIVATE_RUNTIME}
        const root = document.currentScript.closest('.standalone-page') || document;
        initializePrivate(root);
      }());
    </script>`;
}

function slotRows() {
  const rows = privateSlots.map(slot => ({ id: slot.id, title: slot.label, detail: slot.detail, group: '機票、車票與入場證', where: true }));
  const seen = new Set();
  for (const item of stay) {
    const key = `${item.name}|${item.checkIn}`;
    if (seen.has(key)) continue;
    seen.add(key);
    rows.push({
      id: stayPrivateSlotId(item.id), title: `${item.name}（${item.city}）`,
      detail: `${item.checkIn.slice(5).replace('-', '/')}–${item.checkOut.slice(5).replace('-', '/')} 住宿`,
      group: '住宿訂房', where: false,
    });
  }
  return rows;
}

/**
 * 「我的私人資料」編輯區。
 *
 * 這裡只輸出空白欄位：沒有任何 value 屬性，內容在瀏覽器端由
 * initializePrivate 從 localStorage 填入。因此 HTML 原始碼、搜尋索引、
 * 單檔版都不可能含有使用者填的內容。
 */
export function renderPrivatePanel() {
  const rows = slotRows();
  const groups = [...new Set(rows.map(row => row.group))];
  const groupHtml = groups.map(group => `
      <h4>${escapeHtml(group)}</h4>
      <div class="private-slots">${rows.filter(row => row.group === group).map(row => `
        <fieldset class="private-slot">
          <legend>${escapeHtml(row.title)}</legend>
          <p class="source-meta">${escapeHtml(row.detail)}</p>
          <label>訂位代號<input type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" data-private-slot-field="${escapeAttr(row.id)}:code"></label>
          ${row.where ? `<label>票券／入場證存放位置<input type="text" autocomplete="off" placeholder="例：Gmail 搜尋 visit.auschwitz.org" data-private-slot-field="${escapeAttr(row.id)}:where"></label>` : ''}
        </fieldset>`).join('')}</div>`).join('');
  return `
    <section class="section private-panel" id="my-private" data-private-panel aria-labelledby="my-private-heading">
      <div class="section-heading"><span class="section-num">Private</span><h2 id="my-private-heading">我的私人資料</h2></div>
      <p class="callout-note private-warning"><b>只存在這支手機的這個瀏覽器。</b>不會上傳、不會出現在網站內容或搜尋裡；換手機、換瀏覽器或清除網站資料，這些內容就會消失，請另外備份重要的保單與訂位代號。離線也能使用。</p>
      <p class="private-status" role="status" data-private-status data-problem="false">填寫後會自動存在這支手機。</p>
      <fieldset class="private-slot private-insurance">
        <legend>旅遊保險與海外救援</legend>
        <label>保險公司<input type="text" autocomplete="off" data-private-field="insurer"></label>
        <label>海外救援電話（填了會變成可直接撥打的連結）<input type="tel" inputmode="tel" autocomplete="off" placeholder="例：+886 2 1234 5678" data-private-field="insurerPhone"></label>
        <label>保單號碼<input type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" data-private-field="policy"></label>
        <p class="private-readout" data-private-has="insurerPhone" hidden>救援電話：<a data-private-tel="insurerPhone" class="private-tel"></a></p>
      </fieldset>${groupHtml}
      <p><button type="button" class="private-clear" data-private-clear>清除這支手機上的全部私人資料</button></p>
    </section>`;
}
