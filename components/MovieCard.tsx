// components/MovieCard.tsx
import Link from "next/link";

export default function MovieCard({ movie }) {
  return (
    <Link
      href={`/movie/${movie.id}`}
      className="block hover:scale-105 transition"
    >
      <img
        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
        alt={movie.title}
        className="rounded-lg"
      />
    </Link>
  );
}
