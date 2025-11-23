// lib/tmdb.ts
const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const LANG = "uk-UA"; // Використовуємо українську

export async function getNowPlayingMovies() {
  const res = await fetch(
    `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=${LANG}`
  );
  // ... (решта логіки)
  return res.json();
}

// Нова функція для отримання деталей фільму
export async function getMovie(id: string) {
  const res = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=${LANG}&append_to_response=videos,credits` // Запит одразу трейлерів та акторів
  );
  if (!res.ok) throw new Error("Failed to fetch movie details");
  return res.json();
}

export async function getPopularMovies(page: number = 1) {
  if (page < 1) page = 1; // Захист від невірних сторінок
  const res = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=${LANG}&page=${page}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch popular movies");
  }
  return res.json();
}

// Додаткові функції, якщо потрібні (наприклад, getSimilarMovies)
