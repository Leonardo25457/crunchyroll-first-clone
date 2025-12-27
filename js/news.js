import { news } from "./newsSeed.js";

const chipsEl = document.getElementById("newsChips");
const cardsEl = document.getElementById("newsCards");
const searchEl = document.getElementById("newsSearch");
const loadMoreBtn = document.getElementById("newsLoadMore");

if (!chipsEl || !cardsEl || !searchEl || !loadMoreBtn) {
  console.warn("[news.js] Faltan elementos del DOM. Revisa news.html");
} else {
  const FALLBACK_IMG =
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360">
  <defs>
    <linearGradient id="g" x1="0" x2="1">
      <stop offset="0" stop-color="#1a1a1a"/>
      <stop offset="1" stop-color="#0b0b0b"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <circle cx="320" cy="180" r="56" fill="#f47521" opacity="0.95"/>
  <polygon points="310,150 310,210 362,180" fill="#0b0b0b"/>
  <text x="320" y="305" font-family="Arial" font-size="24" text-anchor="middle" fill="rgba(255,255,255,0.65)">
    News Preview
  </text>
</svg>
`);

  function imgTag(src, alt = "") {
    const safe = src || FALLBACK_IMG;
    return `<img src="${safe}" alt="${alt}" onerror="this.onerror=null;this.src='${FALLBACK_IMG}'">`;
  }

  function excerptFromContent(item) {
    const p = item?.content?.[0] || "";
    return p.length > 110 ? p.slice(0, 110).trim() + "…" : p;
  }

  function uniqueCategories(items) {
    const set = new Set(
      items.map((n) => (n.category || "latest").toLowerCase())
    );
    return ["all", ...Array.from(set)];
  }

  function labelFor(cat) {
    const map = {
      all: "Todo",
      latest: "Lo último",
      announcements: "Anuncios",
      guides: "Guías",
      features: "Features",
      "seasonal-lineup": "Temporada",
    };
    return map[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
  }

  let activeCategory = "all";
  let query = "";
  let limit = 12;

  const categories = uniqueCategories(news);

  function renderChips() {
    chipsEl.innerHTML = "";
    categories.forEach((cat) => {
      const chip = document.createElement("div");
      chip.className = "news-chip" + (cat === activeCategory ? " active" : "");
      chip.textContent = labelFor(cat);
      chip.addEventListener("click", () => {
        activeCategory = cat;
        limit = 12;
        renderChips();
        renderCards();
      });
      chipsEl.appendChild(chip);
    });
  }

  function filterItems() {
    const byCat =
      activeCategory === "all"
        ? news
        : news.filter(
            (n) => (n.category || "").toLowerCase() === activeCategory
          );

    const q = query.trim().toLowerCase();
    if (!q) return byCat;

    return byCat.filter(
      (n) =>
        (n.title || "").toLowerCase().includes(q) ||
        (n.author || "").toLowerCase().includes(q) ||
        (n.content || []).join(" ").toLowerCase().includes(q)
    );
  }

  function renderCards() {
    const items = filterItems();
    const visible = items.slice(0, limit);

    cardsEl.innerHTML = "";

    visible.forEach((n) => {
      const card = document.createElement("article");
      card.className = "news-card";
      card.innerHTML = `
        ${imgTag(n.image, n.title)}
        <div class="inner">
          <span class="news-badge">${labelFor(
            (n.category || "latest").toLowerCase()
          )}</span>
          <h3>${n.title}</h3>
          <p class="news-excerpt">${excerptFromContent(n)}</p>
          <div class="news-meta-line">${n.dateText}<br>${n.author}</div>
        </div>
      `;
      card.addEventListener("click", () => {
        location.href = `news-detail.html?id=${n.id}`;
      });
      cardsEl.appendChild(card);
    });

    loadMoreBtn.style.display = limit < items.length ? "inline-flex" : "none";
  }

  searchEl.addEventListener("input", (e) => {
    query = e.target.value;
    limit = 12;
    renderCards();
  });

  loadMoreBtn.addEventListener("click", () => {
    limit += 12;
    renderCards();
  });

  renderChips();
  renderCards();
}
