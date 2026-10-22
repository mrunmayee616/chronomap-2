// Neutral stand-in used while a place's real photo hasn't been found yet
// (or can't be). The dataset originally pointed at picsum.photos, which
// serves an unrelated random photo for any seed -- so those URLs are never
// shown; they're replaced with this plain, clearly-a-placeholder card.

export function isRandomPlaceholder(url) {
  return typeof url === 'string' && /(^|\/\/)picsum\.photos\//i.test(url)
}

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

function clip(text, max) {
  const t = String(text ?? '')
  return t.length > max ? `${t.slice(0, max - 1)}…` : t
}

export function placeholderImage({ name, location, category } = {}) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="#1b1740"/><stop offset="1" stop-color="#0d0b24"/></linearGradient></defs>` +
    `<rect width="900" height="600" fill="url(#g)"/>` +
    `<g fill="none" stroke="#f7c740" stroke-opacity="0.22" stroke-width="2">` +
    `<circle cx="450" cy="250" r="120"/><ellipse cx="450" cy="250" rx="52" ry="120"/>` +
    `<path d="M330 250h240M450 130v240"/></g>` +
    `<text x="450" y="450" text-anchor="middle" font-family="Georgia, serif" font-size="46" font-weight="700" fill="#ffffff">${esc(clip(name, 30))}</text>` +
    `<text x="450" y="496" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#b9b4d6">${esc(clip(location, 44))}</text>` +
    (category
      ? `<text x="450" y="540" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" letter-spacing="3" fill="#f7c740" fill-opacity="0.8">${esc(String(category).toUpperCase())}</text>`
      : '') +
    `</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
