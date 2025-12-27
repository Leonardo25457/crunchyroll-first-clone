import { state, getContinueWatching } from "./state.js";

const continueDiv = document.getElementById("continue");
const historyDiv = document.getElementById("history");

const avatarEl = document.getElementById("profileAvatar");
const nameEl = document.getElementById("profileName");

avatarEl.src = state.user.avatar;
nameEl.textContent = state.user.name;

const cont = getContinueWatching();

if (!cont.length) {
  continueDiv.innerHTML =
    '<div class="profile-empty">No tienes episodios pendientes.</div>';
} else {
  continueDiv.innerHTML = cont
    .map(
      (a) => `
      <div class="profile-item">
        <strong>Anime ${a.id}</strong>
        <span>Episodio ${a.episode}</span>
      </div>
    `
    )
    .join("");
}

const history = JSON.parse(localStorage.getItem("history")) || [];

if (!history.length) {
  historyDiv.innerHTML =
    '<div class="profile-empty">Aún no has visto ningún episodio.</div>';
} else {
  historyDiv.innerHTML = history
    .map(
      (h) => `
      <div class="profile-item">
        <strong>Anime ${h.id}</strong>
        <span>Episodio ${h.episode}</span>
      </div>
    `
    )
    .join("");
}

const myListDiv = document.getElementById("myList");
const myList = JSON.parse(localStorage.getItem("myList")) || [];

if (!myList.length) {
  myListDiv.innerHTML =
    `<div class="profile-empty">No tienes animes en tu lista.</div>`;
} else {
  myListDiv.innerHTML = myList.map(a => `
    <div class="profile-card-item" onclick="location.href='detail.html?id=${a.id}'">
      <img src="${a.image}" alt="${a.title}">
      <div class="profile-card-title">${a.title}</div>
    </div>
  `).join("");
}