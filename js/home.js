import { getTrendingAnime, getAnimeByGenre, getNewOnHome } from "./api.js";
import { news } from "./newsSeed.js";

const viewport = document.getElementById("carousel");
const prev = document.getElementById("trendPrev");
const next = document.getElementById("trendNext");

const animes = await getTrendingAnime(18);

viewport.innerHTML = "";

const clampText = (txt = "", n = 180) =>
  txt.length > n ? txt.slice(0, n).trim() + "..." : txt;

const fmt = (num) => {
  if (num === null || num === undefined) return "";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return String(num);
};

animes.forEach((anime) => {
  const item = document.createElement("div");
  item.className = "rail-item";

  const poster = anime.images?.jpg?.image_url || "";
  const title = anime.title || "Sin título";
  const score = anime.score ? `${anime.score}` : "—";
  const members = anime.members ? fmt(anime.members) : "";
  const episodes = anime.episodes ?? "—";
  const year = anime.year ?? "";
  const synopsis = clampText(anime.synopsis || "Sin descripción.", 260);

  item.innerHTML = `
    <div class="rail-poster">
      <img src="${poster}" alt="${title}">

      <div class="cr-overlay">
        <div class="cr-overlay-content">
          <h3 class="cr-title">${title}</h3>

          <div class="cr-meta">
            <span>⭐ ${score}</span>
            ${members ? `<span>${members}</span>` : ""}
            ${year ? `<span>${year}</span>` : ""}
            <span>${episodes} eps</span>
          </div>

          <p class="cr-desc">${synopsis}</p>

          <button class="cr-play" data-id="${anime.mal_id}">
            ▶ Reproducir S1 E1
          </button>

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

  item.querySelector(".rail-poster").addEventListener("click", () => {
    location.href = `detail.html?id=${anime.mal_id}`;
  });

  item.querySelector(".cr-play").addEventListener("click", (e) => {
    e.stopPropagation();
    location.href = `detail.html?id=${anime.mal_id}`;
  });

  viewport.appendChild(item);
});

const scrollAmount = () =>
  Math.max(320, Math.floor(viewport.clientWidth * 0.85));

prev?.addEventListener("click", () => {
  viewport.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
});

next?.addEventListener("click", () => {
  viewport.scrollBy({ left: scrollAmount(), behavior: "smooth" });
});

const newsGrid = document.getElementById("newsHomeGrid");

const truncate = (str = "", max = 56) =>
  str.length > max ? str.slice(0, max - 1) + "…" : str;

function featureCardHTML(n) {
  return `
    <div class="news-feature-card" data-id="${n.id}">
      <img src="${n.image}" alt="">
      <div class="news-card-body">
        <h3>${n.title}</h3>
        <div class="news-meta">${n.dateText}<br>${n.author}</div>
      </div>
    </div>
  `;
}

function renderNewsHome() {
  if (!newsGrid) return;
  newsGrid.innerHTML = "";

  const featured = news[0];
  const secondary = news[1];
  const rest = news.slice(2, 12);

  const left = document.createElement("div");
  left.className = "news-feature";
  left.innerHTML = `<h4>Noticias</h4>${featureCardHTML(
    featured
  )}${featureCardHTML(secondary)}`;

  const mid = document.createElement("div");
  mid.className = "news-col";
  mid.innerHTML = `<h4>Más reciente</h4>`;

  const right = document.createElement("div");
  right.className = "news-col";
  right.innerHTML = `<h4>&nbsp;</h4>`;

  rest.forEach((n, i) => {
    const item = document.createElement("div");
    item.className = "news-item";
    item.innerHTML = `
      <img src="${n.image}" alt="">
      <div>
        <div class="news-item-title">${truncate(n.title, 44)}</div>
        <div class="news-item-meta">${n.dateText}<br>${n.author}</div>
      </div>
    `;
    item.addEventListener("click", () => {
      location.href = `news-detail.html?id=${n.id}`;
    });

    (i % 2 === 0 ? mid : right).appendChild(item);
  });

  newsGrid.appendChild(left);
  newsGrid.appendChild(mid);
  newsGrid.appendChild(right);

  left.querySelectorAll(".news-feature-card").forEach((el) => {
    el.addEventListener("click", () => {
      const id = Number(el.dataset.id);
      location.href = `news-detail.html?id=${id}`;
    });
  });
}

renderNewsHome();

function getPreferredGenre() {
  const history = JSON.parse(localStorage.getItem("history")) || [];
  return history.at(-1)?.genreId || 1; // fallback Acción
}

const recommendedTrack = document.getElementById("recommended-track");
const recPrev = document.querySelector(
  '.carousel-btn.prev[data-target="recommended"]'
);
const recNext = document.querySelector(
  '.carousel-btn.next[data-target="recommended"]'
);

async function renderRecommended() {
  if (!recommendedTrack) return;

  const genreId = getPreferredGenre();
  const recommended = await getAnimeByGenre(genreId, 14);

  recommendedTrack.innerHTML = "";

  recommended.forEach((anime) => {
    const card = document.createElement("div");
    card.className = "rail-item";

    card.innerHTML = `
      <div class="rail-poster">
        <img src="${anime.images?.jpg?.image_url}" alt="${anime.title}">
        <div class="cr-overlay">
          <div class="cr-overlay-content">
            <h3 class="cr-title">${anime.title}</h3>
            <button class="cr-play">▶ Ver ahora</button>
          </div>
        </div>
      </div>
      <div class="rail-title">${anime.title}</div>
      <div class="rail-sub">Recomendado</div>
    `;

    card.onclick = () => (location.href = `detail.html?id=${anime.mal_id}`);

    recommendedTrack.appendChild(card);
  });
}

renderRecommended();

const recScrollAmount = () =>
  Math.max(320, Math.floor(recommendedTrack.clientWidth * 0.85));

recPrev?.addEventListener("click", () => {
  recommendedTrack.scrollBy({ left: -recScrollAmount(), behavior: "smooth" });
});

recNext?.addEventListener("click", () => {
  recommendedTrack.scrollBy({ left: recScrollAmount(), behavior: "smooth" });
});

// =========================
// NUEVO (HOME) -> #newRail
// =========================
const newRail = document.getElementById("newRail");
const newPrev = document.getElementById("newPrev");
const newNext = document.getElementById("newNext");

async function renderNewHome() {
  if (!newRail) return;

  try {
    const list = await getNewOnHome(20);

    newRail.innerHTML = "";

    list.forEach((anime) => {
      const item = document.createElement("div");
      item.className = "rail-item";

      const poster = anime.images?.jpg?.image_url || "";
      const title = anime.title || "Sin título";
      const score = anime.score ? `⭐ ${anime.score}` : "";
      const episodes = anime.episodes ?? "—";
      const synopsis = clampText(anime.synopsis || "Sin descripción.", 220);

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
              <button class="cr-play">▶ Ver ahora</button>
            </div>
          </div>
        </div>
        <div class="rail-title">${title}</div>
        <div class="rail-sub">Nuevo</div>
      `;

      item.addEventListener("click", () => {
        location.href = `detail.html?id=${anime.mal_id}`;
      });

      item.querySelector(".cr-play")?.addEventListener("click", (e) => {
        e.stopPropagation();
        location.href = `detail.html?id=${anime.mal_id}`;
      });

      newRail.appendChild(item);
    });

    const amount = () => Math.max(320, Math.floor(newRail.clientWidth * 0.85));

    newPrev?.addEventListener("click", () => {
      newRail.scrollBy({ left: -amount(), behavior: "smooth" });
    });

    newNext?.addEventListener("click", () => {
      newRail.scrollBy({ left: amount(), behavior: "smooth" });
    });
  } catch (err) {
    console.error("Nuevo(Home) falló:", err);
    newRail.innerHTML = `
      <div style="padding:12px; color: rgba(255,255,255,.75);">
        No se pudo cargar “Nuevo” (límite de la API). Intenta recargar en unos segundos.
      </div>
    `;
  }
}

renderNewHome();
