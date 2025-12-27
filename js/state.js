export const state = {
  user: {
    name: "Minato Namikaze",
    avatar: "assets/minato-icon.jpg",
  },
};

export function getContinueWatching() {
  return JSON.parse(localStorage.getItem("continue")) || [];
}

export function saveContinue(anime) {
  let list = getContinueWatching();
  list = list.filter((a) => a.id !== anime.id);
  list.unshift(anime);
  localStorage.setItem("continue", JSON.stringify(list.slice(0, 10)));
}

export function saveHistory(entry) {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  history.unshift(entry);
  localStorage.setItem("history", JSON.stringify(history.slice(0, 20)));
}
