function escape(value) {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function externalLink(url, label) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return escape(label);
    return `<a href="${escape(parsed.href)}" target="_blank" rel="noopener noreferrer">${escape(label)}</a>`;
  } catch { return escape(label); }
}

export function renderPhotoGallery(photos = [], title = '城市風景') {
  if (!photos.length) return '';
  return `<section class="section photo-gallery" aria-label="${escape(title)}">
    <div class="section-heading"><span class="section-num">Scenes</span><h2>${escape(title)}</h2></div>
    <div class="photo-gallery-grid">${photos.map(photo => `<figure class="photo-gallery-card${photo.height > photo.width ? ' photo-gallery-portrait' : ''}">
      <img src="${escape(photo.src)}" alt="${escape(photo.alt)}" width="${Number(photo.width)}" height="${Number(photo.height)}" loading="lazy" decoding="async">
      <figcaption><h3>${escape(photo.caption)}</h3>${photo.note ? `<p>${escape(photo.note)}</p>` : ''}
        ${photo.mapUrl ? `<p>${externalLink(photo.mapUrl, '在 Google Maps 查看地點 ↗')}</p>` : ''}
        <small>${escape(photo.author)} · ${externalLink(photo.sourceUrl, '照片來源')} · ${externalLink(photo.licenseUrl, photo.license)}</small>
      </figcaption>
    </figure>`).join('')}</div>
  </section>`;
}
