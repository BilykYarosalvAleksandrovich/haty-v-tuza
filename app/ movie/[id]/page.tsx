import { getMovieDetails } from "@/lib/tmdb";

interface MoviePageProps {
  params: { id: string };
}

export default async function MoviePage({ params }: MoviePageProps) {
  // отримуємо дані про фільм за id
  const movie = await getMovieDetails(params.id);

  return (
    <main className="p-4 text-white">
      <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
      <p className="mb-2"><strong>Release Date:</strong> {movie.release_date}</p>
      <p className="mb-2"><strong>Rating:</strong> {movie.vote_average} / 10</p>
      <p className="mb-4">{movie.overview}</p>
      {movie.poster_path && (
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="rounded shadow-lg"
        />
      )}
    </main>
  );
}