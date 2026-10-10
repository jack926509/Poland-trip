// 「我的私人資料」：只存在這支手機這個瀏覽器的 localStorage。
//
// 設計原則（使用者明確要求）：
//   - 不上傳、不進建置輸出、不進搜尋索引、不出現在 HTML 原始碼：
//     頁面只有空白欄位，內容一律在瀏覽器端用 .value／textContent 填入。
//   - 所有 localStorage 讀寫都包 try/catch：無痕模式、清除網站資料、
//     被封鎖時要退化成「這次不能存」，不能讓整頁腳本中斷。
//   - 離線可用：完全不碰網路。
//
// ⚠ 本檔函式由 templates 以 fn.toString() 內嵌進頁面（單檔版會丟掉外部 script），
// 內嵌時沒有 import，相依函式必須全部具名匯出並一起列入 PRIVATE_RUNTIME 陣列。

export const PRIVATE_STORAGE_KEY = 'polska-private-v1';

export function privateRead() {
  try {
    const raw = localStorage.getItem('polska-private-v1');
    const data = raw ? JSON.parse(raw) : {};
    return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
  } catch {
    return {};
  }
}

/** 寫入成功回傳 true；被封鎖或空間不足回傳 false。 */
export function privateWrite(data) {
  try {
    localStorage.setItem('polska-private-v1', JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function privateClear() {
  try {
    localStorage.removeItem('polska-private-v1');
    return true;
  } catch {
    return false;
  }
}

/** 只留數字與開頭的 +；數字太少就不當成電話（避免亂填變成無效連結）。 */
export function privateTelHref(value) {
  const cleaned = String(value ?? '').replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '');
  return cleaned.replace(/\D/g, '').length >= 3 ? `tel:${cleaned}` : '';
}

export function initializePrivate(root) {
  const panel = root.querySelector('[data-private-panel]');
  const note = panel ? panel.querySelector('[data-private-status]') : null;
  let editing = false;

  function valueOf(scope, key) {
    const data = privateRead();
    const slotEl = scope.closest ? scope.closest('[data-private-slot]') : null;
    const slotId = slotEl ? slotEl.getAttribute('data-private-slot') : null;
    const source = slotId ? ((data.slots || {})[slotId] || {}) : data;
    const value = source[key];
    return typeof value === 'string' ? value.trim() : '';
  }

  function render() {
    root.querySelectorAll('[data-private-has]').forEach(el => { el.hidden = !valueOf(el, el.getAttribute('data-private-has')); });
    root.querySelectorAll('[data-private-missing]').forEach(el => { el.hidden = !!valueOf(el, el.getAttribute('data-private-missing')); });
    root.querySelectorAll('[data-private-text]').forEach(el => { el.textContent = valueOf(el, el.getAttribute('data-private-text')); });
    root.querySelectorAll('[data-private-tel]').forEach(el => {
      const value = valueOf(el, el.getAttribute('data-private-tel'));
      const href = privateTelHref(value);
      el.textContent = value;
      if (href) el.setAttribute('href', href); else el.removeAttribute('href');
    });
    if (!panel || editing) return;
    const data = privateRead();
    panel.querySelectorAll('[data-private-field]').forEach(input => {
      input.value = typeof data[input.getAttribute('data-private-field')] === 'string' ? data[input.getAttribute('data-private-field')] : '';
    });
    panel.querySelectorAll('[data-private-slot-field]').forEach(input => {
      const parts = input.getAttribute('data-private-slot-field').split(':');
      const slot = (data.slots || {})[parts[0]] || {};
      input.value = typeof slot[parts[1]] === 'string' ? slot[parts[1]] : '';
    });
  }

  function say(text, problem) {
    if (!note) return;
    note.textContent = text;
    note.setAttribute('data-problem', problem ? 'true' : 'false');
  }

  function collect() {
    const data = {};
    panel.querySelectorAll('[data-private-field]').forEach(input => {
      const value = input.value.trim();
      if (value) data[input.getAttribute('data-private-field')] = value;
    });
    const slots = {};
    panel.querySelectorAll('[data-private-slot-field]').forEach(input => {
      const value = input.value.trim();
      if (!value) return;
      const parts = input.getAttribute('data-private-slot-field').split(':');
      slots[parts[0]] = slots[parts[0]] || {};
      slots[parts[0]][parts[1]] = value;
    });
    if (Object.keys(slots).length) data.slots = slots;
    return data;
  }

  function announce() {
    if (typeof window.dispatchEvent === 'function' && typeof Event === 'function') window.dispatchEvent(new Event('polska-private-change'));
  }

  if (panel) {
    panel.addEventListener('input', () => {
      editing = true;
      const data = collect();
      if (privateWrite(data)) {
        const count = Object.keys(data).filter(key => key !== 'slots').length
          + Object.values(data.slots || {}).reduce((sum, slot) => sum + Object.keys(slot).length, 0);
        say(count ? `已存在這支手機（共 ${count} 欄）。換手機或清除瀏覽器資料就會消失。` : '目前沒有任何私人資料。', false);
      } else {
        say('這個瀏覽器不讓網站存資料（可能是無痕模式），這次填的內容不會保留。', true);
      }
      render();
      announce();
      editing = false;
    });
    const clear = panel.querySelector('[data-private-clear]');
    if (clear) clear.addEventListener('click', () => {
      if (typeof confirm === 'function' && !confirm('確定清除這支手機上存的全部私人資料？清除後無法復原。')) return;
      if (!privateClear()) {
        say('無法清除這支手機上的私人資料，原資料仍保留。請檢查瀏覽器的網站資料設定後再試。', true);
        return;
      }
      say('已清除這支手機上的私人資料。', false);
      render();
      announce();
    });
  }

  render();
  window.addEventListener('polska-private-change', render);
  window.addEventListener('storage', render);
  window.addEventListener('pageshow', render);
}
