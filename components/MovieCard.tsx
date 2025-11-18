import Link from "next/link";

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
}

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movie/${movie.id}`}>
      <div className="rounded-md overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-auto"
          />
        ) : (
          <div className="w-full h-[300px] bg-gray-700 flex items-center justify-center text-white">
            {movie.title}
          </div>
        )}
        <div className="p-2">
          <h3 className="text-white font-semibold text-sm truncate">
            {movie.title}
          </h3>
          <p className="text-yellow-400 text-xs">
            ⭐ {movie.vote_average.toFixed(1)}
          </p>
        </div>
      </div>
    </Link>
  );
}
