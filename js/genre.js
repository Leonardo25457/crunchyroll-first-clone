import { getPopularByGenre, getNewByGenre } from "./api.js";

const params = new URLSearchParams(location.search);
const genreId = params.get("id");
const name = params.get("name");

document.getElementById("genreTitle").textContent = name || "Género";

const GENRE_DESC = {
  1: "Acción intensa llena de batallas, poder y adrenalina.",
  2: "Aventuras épicas y viajes inolvidables.",
  4: "Ríe a carcajadas con comedias memorables.",
  8: "Historias profundas cargadas de emoción.",
  10: "Mundos mágicos y realidades extraordinarias.",
  19: "Música, ritmo y grandes presentaciones.",
  22: "Romance y emociones que conectan corazones.",
  24: "Ciencia, tecnología y futuros alternativos.",
  27: "Shounen lleno de crecimiento y superación.",
  42: "Narrativas maduras y complejas."
};

document.getElementById("genreDesc").textContent =
  GENRE_DESC[genreId] || "Explora lo mejor de este género.";

const popularRail = document.getElementById("popularRail");
const newRail = document.getElementById("newRail");

/* ===== RENDER ===== */
renderRail(popularRail, await getPopularByGenre(genreId, 20));
renderRail(newRail, await getNewByGenre(genreId, 20));

function renderRail(container, list) {
  container.innerHTML = "";

  list.forEach(anime => {
    const item = document.createElement("div");
    item.className = "rail-item";

    const poster = anime.images?.jpg?.image_url || "";
    const title = anime.title || "Sin título";
    const score = anime.score ? `⭐ ${anime.score}` : "";
    const episodes = anime.episodes ?? "?";
    const synopsis =
      anime.synopsis?.slice(0, 220) || "Sin descripción disponible.";

    item.innerHTML = `
      <div class="rail-poster">
        <img src="${poster}" alt="${title}">
        <div class="cr-overlay">
          <div class="cr-overlay-content">
            <h3 class="cr-title">${title}</h3>
            <div class="cr-meta">
              ${score ? `<span>${score}</span>` : ""}
              <span>${episodes} eps</span>
            </div>
            <p class="cr-desc">${synopsis}</p>
            <button class="cr-play">▶ Reproducir</button>
            <div class="cr-actions">
              <button title="Mi lista">＋</button>
              <button title="Guardar">🔖</button>
            </div>
          </div>
        </div>
      </div>

      <div class="rail-title">${title}</div>
      <div class="rail-sub">Sub | Dob</div>
    `;

    item.onclick = () =>
      (location.href = `detail.html?id=${anime.mal_id}`);

    item.querySelector(".cr-play").onclick = e => {
      e.stopPropagation();
      location.href = `detail.html?id=${anime.mal_id}`;
    };

    container.appendChild(item);
  });
}

setupScroll("popularPrev", "popularNext", popularRail);
setupScroll("newPrev", "newNext", newRail);

function setupScroll(prevId, nextId, rail) {
  const prev = document.getElementById(prevId);
  const next = document.getElementById(nextId);

  const amount = () =>
    Math.max(320, Math.floor(rail.clientWidth * 0.85));

  prev.onclick = () =>
    rail.scrollBy({ left: -amount(), behavior: "smooth" });

  next.onclick = () =>
    rail.scrollBy({ left: amount(), behavior: "smooth" });
}
