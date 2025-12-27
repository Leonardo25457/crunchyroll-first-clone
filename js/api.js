const API = "https://api.jikan.moe/v4";

export async function getTrendingAnime(limit = 10) {
  const res = await fetch(`${API}/top/anime?limit=${limit}`);
  const json = await res.json();
  return json.data ?? [];
}

export async function getFeaturedAnime(limit = 6) {
  const res = await fetch(`${API}/top/anime?limit=${limit}`);
  const json = await res.json();
  return json.data ?? [];
}

export async function getAnimeById(id) {
  const res = await fetch(`${API}/anime/${id}/full`);
  const json = await res.json();
  return json.data;
}

export async function getAnimeVideos(id) {
  const res = await fetch(`${API}/anime/${id}/videos`);
  const json = await res.json();
  return json.data ?? null;
}

export async function getAnimeEpisodes(id, page = 1) {
  const res = await fetch(`${API}/anime/${id}/episodes?page=${page}`);
  const json = await res.json();
  return json.data ?? [];
}

export async function getRecommendedAnime(limit = 12) {
  const res = await fetch(
    `${API}/top/anime?filter=bypopularity&limit=${limit}`
  );
  const json = await res.json();
  return json.data ?? [];
}

export async function getMostViewedAnime(limit = 12) {
  const res = await fetch(
    `${API}/top/anime?filter=favorite&limit=${limit}`
  );
  const json = await res.json();
  return json.data ?? [];
}


export async function getAnimeByGenre(genreId, limit = 12) {
  const res = await fetch(
    `${API}/anime?genres=${genreId}&order_by=popularity&limit=${limit}`
  );
  const json = await res.json();
  return json.data ?? [];
}

export async function searchAnime(query) {
  const res = await fetch(
    `${API}/anime?q=${encodeURIComponent(query)}&limit=12`
  );
  const json = await res.json();
  return json.data ?? [];
}


export async function getPopularByGenre(genreId, limit = 20) {
  const res = await fetch(
    `${API}/anime?genres=${genreId}&order_by=popularity&limit=${limit}`
  );
  const json = await res.json();
  return json.data ?? [];
}

export async function getNewByGenre(genreId, limit = 20) {
  const res = await fetch(
    `${API}/anime?genres=${genreId}&order_by=start_date&sort=desc&limit=${limit}`
  );
  const json = await res.json();
  return json.data ?? [];
}