import { searchAnime } from "./api.js";

const input = document.getElementById("searchInput");
const topResults = document.getElementById("topResults");
const seriesResults = document.getElementById("seriesResults");
const clearBtn = document.getElementById("clearBtn");

async function triggerSearch(q) {
  clearBtn.style.display = q ? "block" : "none";
  topResults.innerHTML = "";
  seriesResults.innerHTML = "";

  if (q.length < 3) return;

  const data = await searchAnime(q);

  data.slice(0, 3).forEach(a => {
    const card = document.createElement("div");
    card.className = "search-top-card";
    card.onclick = () =>
      location.href = `detail.html?id=${a.mal_id}`;

    card.innerHTML = `
      <img src="${a.images.jpg.large_image_url || a.images.jpg.image_url}">
      <div class="search-top-title">${a.title}</div>
      <div class="search-top-sub">Sub | Dob</div>
    `;
    topResults.appendChild(card);
  });

  data.slice(3).forEach(a => {
    const card = document.createElement("div");
    card.className = "rail-item";
    card.onclick = () =>
      location.href = `detail.html?id=${a.mal_id}`;

    card.innerHTML = `
      <div class="rail-poster">
        <img src="${a.images.jpg.image_url}">
      </div>
      <div class="rail-title">${a.title}</div>
      <div class="rail-sub">Sub | Dob</div>
    `;
    seriesResults.appendChild(card);
  });
}

input.addEventListener("input", e => {
  const q = e.target.value.trim();
  history.replaceState(null, "", `?q=${encodeURIComponent(q)}`);
  triggerSearch(q);
});

clearBtn.addEventListener("click", () => {
  input.value = "";
  topResults.innerHTML = "";
  seriesResults.innerHTML = "";
  clearBtn.style.display = "none";
  history.replaceState(null, "", location.pathname);
  input.focus();
});

const params = new URLSearchParams(location.search);
const initialQuery = params.get("q");

if (initialQuery) {
  input.value = initialQuery;
  triggerSearch(initialQuery);
}
