import { saveContinue, saveHistory } from "./state.js";

const player = document.getElementById("player");
const params = new URLSearchParams(location.search);

const animeId = params.get("id");
const episode = params.get("ep");

player.src = "https://www.w3schools.com/html/mov_bbb.mp4";

player.onplay = () => {
  saveContinue({ id: animeId, episode });
};

player.onended = () => {
  saveHistory({ id: animeId, episode, date: new Date() });
};
