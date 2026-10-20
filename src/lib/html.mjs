// 僅用於 HTML 文字與屬性；不要拿來編碼 JavaScript。
export function escapeAttr(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function escapeHtml(value) {
  return escapeAttr(value).replaceAll("'", '&#39;');
}

export function safeHttpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? escapeHtml(url.href) : null;
  } catch {
    return null;
  }
}

/**
 * 純文字裡的 https 網址換成「網域 ↗」短連結：長網址在手機上不會斷行，會把整頁撐寬。
 * 其他文字照常跳脫；只接受 https，網址尾端的全形標點不算進連結。
 */
export function linkifyText(value) {
  const text = String(value ?? '');
  const pattern = /https:\/\/[^\s）)，、；。]+/g;
  let html = '';
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    html += escapeHtml(text.slice(last, match.index));
    const href = safeHttpsUrl(match[0]);
    const host = href ? new URL(match[0]).hostname.replace(/^www\./, '') : '';
    html += href ? `<a href="${href}" target="_blank" rel="noopener noreferrer">${escapeHtml(host)} ↗</a>` : escapeHtml(match[0]);
    last = match.index + match[0].length;
  }
  return html + escapeHtml(text.slice(last));
}

/**
 * 2026-10-20 UX F6：查核語氣（「官方」「依旅客提供」「未提供」「為準」「截圖未顯示」等）
 * 是資料來源說明，不是旅客要做的事。純文字依句子（。；）與含關鍵字的括號拆開：
 * 旅客動作留在 main，查核句收進 notes，交給 renderDataNote 放進預設收合的「資料說明」。
 * 只搬位置、不刪字。
 */
export const VERIFICATION_PATTERN = /官方|依旅客提供|未提供|不代表已訂妥|截圖未顯示|為準|快照|查得/;

export function splitVerification(value) {
  const notes = [];
  let text = String(value ?? '').replace(/（[^（）]*）/g, part => {
    if (!VERIFICATION_PATTERN.test(part)) return part;
    notes.push(part.slice(1, -1));
    return '';
  });
  const kept = [];
  for (const sentence of text.split(/(?<=[。；])|——/)) {
    if (!sentence.trim()) continue;
    (VERIFICATION_PATTERN.test(sentence) ? notes : kept).push(sentence.trim());
  }
  text = kept.join('').replace(/；$/, '。');
  return { main: text, notes };
}

/** notes 是已跳脫的 HTML 片段陣列；沒有內容就不輸出。 */
export function renderDataNote(notes, { tag = 'details' } = {}) {
  const items = notes.filter(Boolean);
  if (!items.length) return '';
  return `<${tag} class="data-note"><summary>資料說明</summary>${items.map(item => `<p>${item}</p>`).join('')}</${tag}>`;
}
