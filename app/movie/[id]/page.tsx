import PlayerModal from "../../../components/PlayerModal";
import MovieModal from "../../../components/MovieModal";

async function getMovie(id: string) {
  const res = await fetch(`/api/tmdb/movie/${id}`);
  return res.json();
}

export default async function MoviePage({
  params,
}: {
  params: { id: string };
}) {
  const movie = await getMovie(params.id);
  // Server-side page: render minimal info and a placeholder player link
  return (
    <main className="p-6 text-white max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-3">{movie.title}</h1>
      <p className="text-lg mb-4 text-yellow-400">
        ⭐ {movie.vote_average?.toFixed(1)}
      </p>
      <p className="mt-6 text-gray-300 leading-relaxed">{movie.overview}</p>
    </main>
  );
}
