const API = "https://api.jikan.moe/v4";

// ==========================
// Helpers anti-429 + cache
// ==========================
async function fetchJsonWithRetry(url, { retries = 2, backoffMs = 900 } = {}) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(url);

    if (res.ok) return res.json();

    if (res.status === 429) {
      const wait = backoffMs * Math.pow(2, attempt);
      await new Promise((r) => setTimeout(r, wait));
      continue;
    }

    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} - ${text}`);
  }

  throw new Error("HTTP 429 - Rate limit (retries exceeded)");
}

function getCache(key, maxAgeMs) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (!ts || !data) return null;
    if (Date.now() - ts > maxAgeMs) return null;
    return data;
  } catch {
    return null;
  }
}

function setCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
  } catch {}
}

// ==========================
// Lllamamos a nuestras APIs
// ==========================
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
  const res = await fetch(`${API}/top/anime?filter=bypopularity&limit=${limit}`);
  const json = await res.json();
  return json.data ?? [];
}

export async function getMostViewedAnime(limit = 12) {
  const res = await fetch(`${API}/top/anime?filter=favorite&limit=${limit}`);
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

// ==========================
// NUEVO (HOME) con cache+retry
// ==========================
export async function getNewOnHome(limit = 20, page = 1) {
  const cacheKey = `jikan:newOnHome:p${page}:l${limit}`;

  const cached = getCache(cacheKey, 10 * 60 * 1000);
  if (cached) return cached;

  const url = `${API}/seasons/now?page=${page}`;
  const json = await fetchJsonWithRetry(url, { retries: 2, backoffMs: 900 });
  const data = json.data ?? [];

  const sorted = data
    .slice()
    .sort((a, b) => {
      const da = a?.aired?.from ? new Date(a.aired.from).getTime() : 0;
      const db = b?.aired?.from ? new Date(b.aired.from).getTime() : 0;
      return db - da;
    })
    .slice(0, limit);

  setCache(cacheKey, sorted);
  return sorted;
}
