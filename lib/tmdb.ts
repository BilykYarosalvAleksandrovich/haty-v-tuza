const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export async function getNowPlayingMovies() {
  const res = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=uk-UA`);
  if (!res.ok) {
    console.error("Error fetching Now Playing movies:", await res.text());
    throw new Error("Failed to fetch now playing movies");
  }
  return res.json();
}
