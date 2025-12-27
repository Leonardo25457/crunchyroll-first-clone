import { news } from "./newsSeed.js";

const id = Number(new URLSearchParams(location.search).get("id"));
const container = document.getElementById("newsDetail");

const FALLBACK_IMG =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540">
  <defs>
    <linearGradient id="g" x1="0" x2="1">
      <stop offset="0" stop-color="#1a1a1a"/>
      <stop offset="1" stop-color="#0b0b0b"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <text x="50%" y="50%" font-family="Arial" font-size="34" text-anchor="middle" fill="rgba(255,255,255,0.65)">
    Imagen no disponible
  </text>
</svg>
`);

function imgTag(src, alt = "") {
  const safe = src || FALLBACK_IMG;
  return `<img src="${safe}" alt="${alt}" onerror="this.onerror=null;this.src='${FALLBACK_IMG}'">`;
}

function truncate(str, max) {
  return str.length > max ? str.slice(0, max - 1) + "…" : str;
}

const n = news.find((x) => x.id === id);

if (!n) {
  container.innerHTML = `<p style="opacity:.8">Noticia no encontrada.</p>`;
} else {
  const more = news.filter((x) => x.id !== id).slice(0, 6);

  container.innerHTML = `
    <div>
      <div class="news-detail-hero">
        ${imgTag(n.image, n.title)}
        <div class="news-detail-body">
          <h1>${n.title}</h1>
          <div class="meta">${n.dateText} • ${
    n.author
  } • <span style="opacity:.85">${n.category}</span></div>
          ${n.content.map((p) => `<p>${p}</p>`).join("")}
        </div>
      </div>
    </div>

    <aside class="news-detail-side">
      <h3>Más noticias</h3>
      ${more
        .map(
          (m) => `
        <div class="news-side-item" data-id="${m.id}">
          ${imgTag(m.image, m.title)}
          <div>
            <div class="t">${truncate(m.title, 44)}</div>
            <div class="m">${m.dateText}</div>
          </div>
        </div>
      `
        )
        .join("")}
    </aside>
  `;

  container.querySelectorAll(".news-side-item").forEach((el) => {
    el.addEventListener("click", () => {
      const nextId = Number(el.dataset.id);
      location.href = `news-detail.html?id=${nextId}`;
    });
  });
}
