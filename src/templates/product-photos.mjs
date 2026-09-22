import { escapeHtml as e } from '../lib/html.mjs';

export function renderProductPhoto(product) {
  const photo = product.photo;
  if (!photo) return '<span class="source-meta">照片待補；請依商品名稱辨識</span>';
  return `<figure class="grocery-photo">
    <a href="../${e(photo.src)}" data-product-photo aria-label="放大 ${e(photo.label)} 包裝照片">
      <img src="../${e(photo.src)}" alt="${e(photo.label)} 包裝正面" width="${photo.width}" height="${photo.height}" loading="lazy" decoding="async">
      <span>點擊放大</span>
    </a>
    <figcaption><b>${e(photo.label)}</b><br>代表包裝，現場版本可能不同。
      <span class="grocery-photo-credit"><a href="${e(photo.sourceUrl)}" target="_blank" rel="noopener noreferrer">Open Food Facts 貢獻者</a> · <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 3.0</a> · 縮放及 WebP 轉檔</span>
    </figcaption>
  </figure>`;
}

// 從已渲染的 img 複製來源；單檔版會先將 src 內嵌成 data URL。
// 不支援 dialog 或停用 JS 時，原始連結仍可直接開啟照片。
export function initializeProductPhotos(root) {
  const dialog = root.querySelector('[data-product-photo-dialog]');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const image = dialog.querySelector('img');
  const title = dialog.querySelector('[data-photo-title]');
  const credit = dialog.querySelector('[data-photo-credit]');
  root.addEventListener('click', event => {
    const link = event.target.closest('[data-product-photo]');
    if (!link || !root.contains(link)) return;
    event.preventDefault();
    const thumbnail = link.querySelector('img');
    image.src = thumbnail.src;
    image.alt = thumbnail.alt;
    title.textContent = thumbnail.alt;
    credit.replaceChildren(link.closest('figure').querySelector('.grocery-photo-credit').cloneNode(true));
    dialog.showModal();
  });
  dialog.querySelector('[data-photo-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
}

export function renderProductPhotoViewer() {
  return `<dialog class="grocery-photo-dialog" data-product-photo-dialog aria-label="商品包裝放大照片">
    <button type="button" data-photo-close autofocus>關閉照片 ×</button>
    <p class="grocery-photo-title" data-photo-title>商品包裝</p>
    <img alt="商品包裝放大照片">
    <p>代表包裝；品牌、口味與容量請以現場標示為準。</p>
    <p data-photo-credit></p>
  </dialog><script>(${initializeProductPhotos.toString()})(document.currentScript.closest('.standalone-page') || document);</script>`;
}
