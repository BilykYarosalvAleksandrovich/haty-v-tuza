import MovieSlider from "@/components/MovieSlider";
import { getNowPlayingMovies } from "@/lib/tmdb";

export default async function Home() {
  // Завантажуємо фільми, що зараз у прокаті
  const nowPlaying = await getNowPlayingMovies();

  return (
    <main className="p-4 bg-black min-h-screen">
      {/* Заголовок сторінки */}
      <h1 className="text-3xl font-bold text-white mb-6">Now Playing</h1>

      {/* Слайдер з фільмами */}
      <MovieSlider title="Now Playing" movies={nowPlaying.results} />
    </main>
  );
}
