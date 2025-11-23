import Link from "next/link";
import MovieCard from "@/components/MovieCard";
import Pagination from "@/components/Pagination";
import { getPopularMovies, getNowPlayingMovies } from "@/lib/tmdb"; // Припускаємо, що ці функції імпортуються

// Вказуємо тип для searchParams (Next.js 13/14 App Router)
interface PageProps {
  searchParams: { page?: string };
}

// Функція для отримання всіх необхідних даних на сервері
async function fetchPageData(page: number) {
  // 1. Основний список (з пагінацією)
  const mainListData = await getPopularMovies(page);

  // 2. Дані для сайдбару та слайдера (без пагінації)
  // Використовуємо Promise.all для паралельного завантаження
  const [nowPlayingData, trendingData] = await Promise.all([
    getNowPlayingMovies(), // Для слайдера/банера
    getPopularMovies(1), // Для бічного блоку (можна взяти з 1-ї сторінки)
  ]);

  return {
    mainList: mainListData.results,
    totalPages: mainListData.total_pages > 500 ? 500 : mainListData.total_pages,
    nowPlaying: nowPlayingData.results,
    selectionMovies: trendingData.results.slice(10, 16), // Фільми для бічного блоку
  };
}

export default async function HomePage({ searchParams }: PageProps) {
  // 1. Отримуємо номер сторінки (за замовчуванням 1)
  const page = parseInt(searchParams.page || "1");
  const pageData = await fetchPageData(page);

  const { mainList, totalPages, nowPlaying, selectionMovies } = pageData;

  return (
    <main className="p-6 pt-20 bg-gray-900 min-h-screen">
      {/* Слайдер-банер (Використовуйте MovieSlider тут, якщо він є) */}
      <h1 className="text-2xl font-bold mb-4 text-white">
        Зараз у прокаті (Слайдер)
      </h1>
      {/* <MovieSlider movies={nowPlaying || []} />
       */}
      <div className="bg-gray-800 p-4 rounded-lg h-48 flex items-center justify-center text-gray-400">
        Місце для компонента MovieSlider
      </div>

      {/* Основний Контент (Популярне + Підбірки) */}
      <div className="md:flex gap-8 mt-10">
        {/* Останні надходження (Лівий, більший блок) */}
        <div className="w-full md:w-3/4">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Популярне (З пагінацією)
          </h2>

          {/* Сітка фільмів */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {mainList.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {/* Компонент пагінації */}
          <Pagination currentPage={page} totalPages={totalPages} />
        </div>

        {/* Підбірки (Правий, менший блок) */}
        <div className="w-full md:w-1/4 mt-8 md:mt-0">
          <h2 className="text-2xl font-bold mb-4 text-white">Підбірки</h2>
          <div className="space-y-4">
            {selectionMovies.map((movie) => (
              // Спрощена картка для бічного блоку
              <Link
                href={`/movie/${movie.id}`}
                key={movie.id}
                className="flex gap-3 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition duration-200"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                  alt={movie.title}
                  className="w-12 h-16 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/92x138/1f2937/ffffff?text=NO+IMG";
                  }}
                />
                <div className="text-white text-sm flex flex-col justify-center">
                  <div className="font-semibold">{movie.title}</div>
                  <div className="text-xs text-gray-400">
                    {movie.release_date?.substring(0, 4)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
// ----------------------------------------------------------------------
// Заглушки TMDB для компіляції: Ви маєте замінити їх на свої реальні функції
// ----------------------------------------------------------------------

// Створення заглушок для TMDB функцій, якщо ви не надали lib/tmdb.ts
// У реальному проєкті ці функції повинні бути в lib/tmdb.ts

const mockMovie = {
  id: 1,
  title: "Фільм-заглушка",
  poster_path: "/kqjL17yufvn9pf4aD2oT6y9GFkM.jpg",
  vote_average: 7.5,
  release_date: "2025-01-01",
};
const mockResults = Array(20)
  .fill(mockMovie)
  .map((m, i) => ({ ...m, id: i + 1, title: `Фільм ${i + 1}` }));
const mockResponse = { results: mockResults, total_pages: 50, page: 1 };

export async function getPopularMovies(page: number = 1): Promise<any> {
  console.log(`Fetching popular movies page: ${page}`);
  return Promise.resolve(mockResponse);
}

export async function getNowPlayingMovies(): Promise<any> {
  console.log("Fetching now playing movies");
  return Promise.resolve(mockResponse);
}
