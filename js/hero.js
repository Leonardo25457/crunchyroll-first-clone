import { getFeaturedAnime } from "./api.js";

const slidesContainer = document.getElementById("heroSlides");
const dotsContainer = document.getElementById("heroDots");
const prevBtn = document.getElementById("heroPrev");
const nextBtn = document.getElementById("heroNext");

if (!slidesContainer || !dotsContainer || !prevBtn || !nextBtn) {
  console.error("Hero DOM elements not found. Check index.html IDs.");
} else {
  const animes = await getFeaturedAnime(6);

  let index = 0;
  let interval;

  slidesContainer.innerHTML = "";
  dotsContainer.innerHTML = "";

  animes.forEach((anime, i) => {
    const slide = document.createElement("div");
    slide.className = "hero-slide";
    slide.style.backgroundImage = `url(${anime.images.jpg.large_image_url})`;

    slide.innerHTML = `
      <div class="hero-content">
        <h1>${anime.title}</h1>
        <p>${(anime.synopsis || "").slice(0, 160)}</p>
        <button onclick="location.href='detail.html?id=${anime.mal_id}'">
          VER DETALLES
        </button>
      </div>
    `;

    slidesContainer.appendChild(slide);

    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll("span");

  function update() {
    slidesContainer.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach(d => d.classList.remove("active"));
    dots[index]?.classList.add("active");
  }

  function goTo(i) {
    index = i;
    update();
    resetAuto();
  }

  nextBtn.onclick = () => {
    index = (index + 1) % animes.length;
    update();
    resetAuto();
  };

  prevBtn.onclick = () => {
    index = (index - 1 + animes.length) % animes.length;
    update();
    resetAuto();
  };

  function startAuto() {
    interval = setInterval(() => {
      index = (index + 1) % animes.length;
      update();
    }, 6000);
  }

  function resetAuto() {
    clearInterval(interval);
    startAuto();
  }

  update();
  startAuto();
}
