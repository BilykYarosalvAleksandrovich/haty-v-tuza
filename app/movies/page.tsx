// app/movies/page.tsx (Оновлено)
import { getNowPlayingMovies } from "@/lib/tmdb";
import MovieGrid from "@/components/MovieGrid"; // Використовуємо існуючий компонент

// Отримуємо початкові дані на сервері
export default async function MoviesPage() {
  const nowPlaying = await getNowPlayingMovies();
  const movies = nowPlaying.results || [];

  return (
    <div className="p-6 pt-20">
      <h1 className="text-3xl font-bold mb-6 text-white">Каталог Фільмів</h1>
      
      {/* Тут можуть бути клієнтські фільтри, але самі дані (movies) передаються з сервера */}
      
      <MovieGrid movies={movies} />
      
      {/* Секція пагінації */}
      <div className="flex justify-center mt-10">
          <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition duration-200">
              Завантажити ще
          </button>
      </div>
      
    </div>
  );
}