// ===== DESKTOP: Categorías =====
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

// ===== MOBILE MENU =====
const menuBtn = document.getElementById("menuBtn");
const menuClose = document.getElementById("menuClose");
const mobileMenu = document.getElementById("mobileMenu");

const openMenu = () => {
  mobileMenu.classList.add("active");
  document.body.classList.add("no-scroll");
};

const closeMenu = () => {
  mobileMenu.classList.remove("active");
  document.body.classList.remove("no-scroll");
};

menuBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  openMenu();
});

menuClose?.addEventListener("click", closeMenu);

document.addEventListener("click", () => {
  closeMenu();
});

mobileMenu?.addEventListener("click", (e) => {
  e.stopPropagation();
});

// ===== RESET AL RESIZE =====
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    closeMenu();
  }
});
