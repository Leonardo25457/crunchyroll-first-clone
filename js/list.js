export function toggleMyList(anime) {
  const list = JSON.parse(localStorage.getItem("myList")) || [];

  const exists = list.find(a => a.id === anime.id);

  const updated = exists
    ? list.filter(a => a.id !== anime.id)
    : [...list, anime];

  localStorage.setItem("myList", JSON.stringify(updated));
}

export function isInMyList(id) {
  const list = JSON.parse(localStorage.getItem("myList")) || [];
  return list.some(a => a.id === id);
}
