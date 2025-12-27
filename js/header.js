/* ===== DESKTOP: Categorías dropdown ===== */
const categoriesBtn = document.getElementById("categoriesBtn");
const categoriesMenu = document.getElementById("categoriesMenu");

if (categoriesBtn && categoriesMenu) {
  categoriesBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    categoriesMenu.classList.toggle("active");
  });

  document.addEventListener("click", () => {
    categoriesMenu.classList.remove("active");
  });

  categoriesMenu.addEventListener("click", (e) => {
    e.stopPropagation();
  });
}

/* ===== MOBILE: Hamburger menu ===== */
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    mobileMenu.classList.toggle("active");
    document.body.classList.toggle(
      "no-scroll",
      mobileMenu.classList.contains("active")
    );
  });

  document.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
    document.body.classList.remove("no-scroll");
  });

  mobileMenu.addEventListener("click", (e) => {
    e.stopPropagation();
  });
}

/* ===== UX EXTRA: cerrar menú al volver a desktop ===== */
window.addEventListener("resize", () => {
  if (window.innerWidth > 768 && mobileMenu) {
    mobileMenu.classList.remove("active");
    document.body.classList.remove("no-scroll");
  }
});