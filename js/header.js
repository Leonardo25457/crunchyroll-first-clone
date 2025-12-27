const btn = document.getElementById("categoriesBtn");
const menu = document.getElementById("categoriesMenu");

if (btn && menu) {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("active");
  });

  document.addEventListener("click", () => {
    menu.classList.remove("active");
  });
}
