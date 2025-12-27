import { getAnimeById, getAnimeVideos, getAnimeEpisodes } from "./api.js";

import { toggleMyList, isInMyList } from "./list.js";

/* ================= HELPERS ================= */
const safeText = (s) =>
  String(s || "")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

/* ================= TRAILER ================= */
function getMainTrailer(videosData) {
  const promos = videosData?.promo ?? [];
  return (
    (promos.find((p) => p.title?.toLowerCase().includes("pv")) || promos[0])
      ?.trailer ?? null
  );
}

/* ================= MODAL ================= */
function openTrailerModal(embedUrl, title) {
  const modal = document.createElement("div");
  modal.className = "trailer-modal";

  modal.innerHTML = `
    <div class="trailer-modal__overlay"></div>
    <div class="trailer-modal__content">
      <span class="trailer-badge">TRAILER OFICIAL</span>
      <iframe
        src="${embedUrl}?autoplay=1&mute=0&playsinline=1"
        allow="autoplay; fullscreen"
        allowfullscreen
        title="${safeText(title)}">
      </iframe>
      <button class="trailer-close">✕</button>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = "hidden";

  const close = () => {
    modal.remove();
    document.body.style.overflow = "";
  };

  modal.querySelector(".trailer-close").onclick = close;
  modal.querySelector(".trailer-modal__overlay").onclick = close;
}

/* ================= MAIN ================= */
const id = new URLSearchParams(location.search).get("id");
const mount = document.getElementById("detail");

const anime = await getAnimeById(id);
const videos = await getAnimeVideos(id);
const episodes = await getAnimeEpisodes(id);

const mainTrailer = getMainTrailer(videos);

const heroImg =
  anime?.images?.jpg?.large_image_url || anime?.images?.jpg?.image_url || "";

const posterImg =
  anime?.images?.jpg?.image_url || anime?.images?.jpg?.large_image_url || "";

mount.innerHTML = `
<section class="detail-hero">
  <div class="detail-hero__bg">
    <img src="${heroImg}" alt="${safeText(anime.title)}">
  </div>
  <div class="detail-hero__overlay"></div>

  <div class="detail-hero__content">
    <div class="detail-poster">
      <img src="${posterImg}" alt="${safeText(anime.title)}">
    </div>

    <div class="detail-info">
      <h1>${safeText(anime.title)}</h1>
      <p class="detail-desc">
        ${safeText(anime.synopsis || "Sinopsis no disponible.")}
      </p>

      <div class="detail-actions">
        <button class="detail-btn primary" id="btnPlay">
          COMENZAR A VER
        </button>

        ${
          mainTrailer
            ? `<button class="detail-btn secondary" id="btnTrailer">
                ▶ Ver Trailer
              </button>`
            : ""
        }

        <button class="detail-btn" id="btnList">
          ${isInMyList(anime.mal_id) ? "✓ EN MI LISTA" : "+ MI LISTA"}
        </button>
        <button class="detail-btn">COMPARTIR</button>
      </div>
    </div>
  </div>
</section>

<section class="detail-body">
  <h3 class="detail-section-title">Episodios</h3>

  <div class="episodes-grid" id="episodesGrid">
    ${
      episodes.length
        ? episodes
            .map(
              (ep) => `
          <article class="ep-card" data-ep="${ep.mal_id}">
            <div class="ep-thumb">
              <img src="${heroImg}" alt="Episodio ${ep.mal_id}">
              <span class="ep-duration">EP ${ep.mal_id}</span>
            </div>
            <div class="ep-body">
              <div class="ep-title">
                ${safeText(ep.title || `Episodio ${ep.mal_id}`)}
              </div>
              <div class="ep-meta">
                ${ep.aired ? "Emitido" : "—"}
              </div>
            </div>
          </article>
        `
            )
            .join("")
        : `<p style="opacity:.6">No hay episodios disponibles.</p>`
    }
  </div>
</section>
`;

/* ================= EVENTS ================= */
document.getElementById("btnTrailer")?.addEventListener("click", () => {
  if (!mainTrailer?.embed_url) return;
  openTrailerModal(mainTrailer.embed_url, anime.title);
});

document.getElementById("btnPlay")?.addEventListener("click", () => {
  if (!episodes.length) return;
  alert(`Reproducir Episodio ${episodes[0].mal_id} (player futuro)`);
});

document.getElementById("episodesGrid")?.addEventListener("click", (e) => {
  const card = e.target.closest(".ep-card");
  if (!card) return;

  const ep = card.dataset.ep;
  alert(`Reproducir Episodio ${ep} (player futuro)`);
});

document.getElementById("btnList")?.addEventListener("click", () => {
  toggleMyList({
    id: anime.mal_id,
    title: anime.title,
    image: posterImg,
  });

  location.reload();
});
