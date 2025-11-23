// app/movie/[id]/page.tsx (Оновлено)
import { getMovie } from "@/lib/tmdb";
import FavoriteButton from "./FavoriteButton"; // Створимо пізніше Client Component
import Image from "next/image"; // Рекомендується використовувати Next/Image

export default async function MoviePage({
  params,
}: {
  params: { id: string };
}) {
  const movie = await getMovie(params.id);

  const trailer = movie.videos?.results?.find(
    (v: any) => v.type === "Trailer" && v.site === "YouTube"
  );
  const director = movie.credits?.crew?.find(
    (c: any) => c.job === "Director"
  )?.name;

  return (
    <main className="p-6 text-white pt-20">
      {/* Hero Section з фоновим зображенням */}
      <div
        className="relative h-[400px] md:h-[500px] bg-cover bg-center rounded-xl overflow-hidden shadow-2xl"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(17,24,39,1) 0%, rgba(17,24,39,0.5) 50%, rgba(17,24,39,1) 100%), url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 flex items-end p-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-2 drop-shadow-lg">
              {movie.title}
            </h1>
            <div className="flex items-center gap-4 text-xl mb-4">
              <span className="text-yellow-400 font-bold">
                ⭐ {movie.vote_average?.toFixed(1)}
              </span>
              <span className="text-gray-300">
                {movie.release_date?.slice(0, 4)}
              </span>
              <span className="text-gray-300">{movie.runtime} хв</span>
            </div>
          </div>
        </div>
      </div>

      {/* Основний Контент */}
      <div className="max-w-5xl mx-auto -mt-24 md:-mt-32 relative z-10 p-4">
        <div className="md:flex gap-8">
          {/* Постер та Кнопки */}
          <div className="w-full md:w-1/3 flex flex-col items-center">
            {movie.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={300}
                height={450}
                className="rounded-lg shadow-xl mb-6 transform hover:scale-105 transition duration-300"
              />
            ) : (
              <div className="w-full h-96 bg-gray-700 rounded-lg flex items-center justify-center text-lg">
                Постер відсутній
              </div>
            )}
            {/* Клієнтський компонент для улюбленого/перегляду */}
            <FavoriteButton movieId={movie.id} />

            {/* Тут можна додати кнопку "Дивитися Фільм" */}
            <button className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg text-lg font-bold mt-4 transition duration-200">
              ▶️ Дивитися Фільм
            </button>
          </div>

          {/* Деталі та Опис */}
          <div className="w-full md:w-2/3 mt-6 md:mt-0 bg-gray-800/70 p-6 rounded-xl backdrop-blur-sm">
            <h2 className="text-3xl font-bold mb-4">Опис</h2>
            <p className="mb-6 leading-relaxed text-gray-300">
              {movie.overview}
            </p>

            <div className="mb-6">
              <h3 className="font-semibold text-xl mb-2">Жанри</h3>
              <div className="flex gap-2 flex-wrap">
                {movie.genres?.map((g: any) => (
                  <span
                    key={g.id}
                    className="px-3 py-1 bg-red-600 rounded-full text-sm font-medium"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-gray-300">
              <div>
                <h4 className="font-semibold text-white">Режисер</h4>
                <p>{director || "Н/Д"}</p>
              </div>
              <div>
                <h4 className="font-semibold text-white">Актори (головні)</h4>
                <p>
                  {movie.credits?.cast
                    ?.slice(0, 3)
                    .map((c: any) => c.name)
                    .join(", ")}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white">Дата виходу</h4>
                <p>{movie.release_date}</p>
              </div>
              <div>
                <h4 className="font-semibold text-white">Мова</h4>
                <p>{movie.original_language}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Секція Трейлера */}
        {trailer && (
          <div className="mt-8">
            <h2 className="text-3xl font-bold mb-4">Трейлер</h2>
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
