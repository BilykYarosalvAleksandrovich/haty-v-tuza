// components/MovieCard.tsx (Приклад стилів)
import Image from "next/image";
import Link from "next/link";

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    // Додайте інші поля, які ви використовуєте
    release_date: string;
  };
}

// Функція для генерації бейджа 1080p (умовний, оскільки TMDB не дає точної якості)
const getQualityBadge = () => (
  <span className="text-xs font-bold px-1 py-0.5 rounded bg-blue-600 text-white">
    1080p
  </span>
);

// Функція для генерації бейджа рейтингу
const getRatingBadge = (rating: number) => {
  const ratingClass =
    rating >= 7.5
      ? "bg-green-600"
      : rating >= 6.0
      ? "bg-yellow-600"
      : "bg-red-600";
  return (
    <span
      className={`text-xs font-bold px-1 py-0.5 rounded ${ratingClass} text-white`}
    >
      {rating.toFixed(1)}
    </span>
  );
};

export default function MovieCard({ movie }: MovieCardProps) {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/placeholder-image.png"; // Використовуйте свій плейсхолдер

  return (
    <Link
      href={`/movie/${movie.id}`}
      className="group relative block w-full aspect-[2/3] rounded-lg overflow-hidden shadow-xl transition duration-300 transform hover:scale-[1.03] hover:shadow-2xl"
    >
      <Image
        src={imageUrl}
        alt={movie.title}
        fill
        sizes="(max-width: 600px) 50vw, 33vw"
        className="object-cover transition-opacity duration-300 group-hover:opacity-75"
      />

      {/* БЕЙДЖІ (Розташування у верхніх кутах) */}
      <div className="absolute top-2 left-2 flex flex-col space-y-1 z-10">
        {getQualityBadge()}
        {getRatingBadge(movie.vote_average)}
        {/* Додайте інші бейджі, наприклад, "+243" або "NEW", якщо це нове надходження */}
      </div>

      {/* НАКЛАДЕННЯ ПРИ НАВЕДЕННІ (Hover Overlay) */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition duration-300 flex items-end p-3">
        <div className="translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white text-base font-bold mb-1">{movie.title}</h3>
          <p className="text-yellow-400 text-sm">
            {movie.release_date?.substring(0, 4)}
          </p>
        </div>
      </div>
    </Link>
  );
}
