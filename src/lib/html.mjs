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
