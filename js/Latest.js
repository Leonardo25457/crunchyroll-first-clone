import { getNewOnHome } from "./api.js";

const grid = document.getElementById("novGrid");
const btn = document.getElementById("loadMoreBtn");

let page = 1;
let loading = false;

const clampText = (txt = "", n = 60) =>
  txt.length > n ? txt.slice(0, n).trim() + "…" : txt;

function renderCards(list) {
  const frag = document.createDocumentFragment();

  list.forEach((anime) => {
    const card = document.createElement("article");
    card.className = "nov-card";

    const poster = anime.images?.jpg?.image_url || "";
    const title = anime.title || "Sin título";
    const score = anime.score ? `⭐ ${anime.score}` : "⭐ —";
    const eps = anime.episodes ?? "—";

    card.innerHTML = `
      <div class="nov-poster">
        <img src="${poster}" alt="${title}">
      </div>
      <div class="nov-title">${clampText(title, 52)}</div>
      <div class="nov-meta">${score} · ${eps} eps</div>
    `;

    card.addEventListener("click", () => {
      location.href = `detail.html?id=${anime.mal_id}`;
    });

    frag.appendChild(card);
  });

  grid.appendChild(frag);
}

async function load() {
  if (loading) return;
  loading = true;

  btn.disabled = true;
  btn.textContent = "Cargando...";

  try {
    const list = await getNewOnHome(24, page); // 24 por página
    renderCards(list);

    page += 1;
    btn.textContent = "Cargar más";
    btn.disabled = false;
  } catch (err) {
    console.error("Novedades falló:", err);
    btn.textContent = "Reintentar";
    btn.disabled = false;
  } finally {
    loading = false;
  }
}

btn?.addEventListener("click", load);

// carga inicial
load();
