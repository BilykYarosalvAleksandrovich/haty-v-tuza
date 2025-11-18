// pages/movie/[id].tsx
import { getMovieDetails } from "../../lib/tmdb";

export default async function MoviePage({ params }) {
  const movie = await getMovieDetails(params.id);

  return (
    <div className="text-white px-4 py-8">
      <h1 className="text-3xl font-bold">{movie.title}</h1>
      <p className="mt-4">{movie.overview}</p>
      {/* Трейлер, актори, рейтинг */}
    </div>
  );
}
