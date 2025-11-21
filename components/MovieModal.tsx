'use client';
import { useEffect, useState } from 'react';

export default function MovieModal({ movieId, onClose }: { movieId: number; onClose: () => void }) {
  const [movie, setMovie] = useState<any>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const abort = new AbortController();
    (async () => {
      const res = await fetch(`/api/tmdb/movie/${movieId}`);
      const data = await res.json();
      setMovie(data);
      const trailer = data.videos?.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
      setTrailerKey(trailer?.key ?? null);
      const favs = JSON.parse(localStorage.getItem('favs') || '[]');
      setIsFav(favs.includes(String(movieId)));
      const h = JSON.parse(localStorage.getItem('history') || '[]');
      h.unshift(String(movieId));
      localStorage.setItem('history', JSON.stringify(Array.from(new Set(h)).slice(0,50)));
    })();
    return () => abort.abort();
  }, [movieId]);

  const toggleFav = () => {
    const favs = JSON.parse(localStorage.getItem('favs') || '[]');
    if (favs.includes(String(movieId))) {
      const next = favs.filter((id: string) => id !== String(movieId));
      localStorage.setItem('favs', JSON.stringify(next));
      setIsFav(false);
    } else {
      favs.unshift(String(movieId));
      localStorage.setItem('favs', JSON.stringify(favs));
      setIsFav(true);
    }
  };

  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-start justify-center p-6 overflow-auto">
      <div className="bg-gray-900 rounded-2xl w-full max-w-4xl overflow-hidden">
        <div className="flex justify-between p-3">
          <div>
            <h2 className="text-2xl font-bold text-white">{movie.title}</h2>
            <div className="text-sm text-gray-300">⭐ {movie.vote_average?.toFixed(1)} • {movie.release_date}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleFav} className={`px-3 py-1 rounded ${isFav ? 'bg-red-600' : 'bg-gray-800'} text-white`}>
              {isFav ? 'Улюблене' : 'Додати'}
            </button>
            <button onClick={onClose} className="text-white text-xl">✖</button>
          </div>
        </div>

        <div className="md:flex gap-4 p-3">
          <div className="md:w-1/2">
            {trailerKey ? (
              <iframe className="w-full aspect-video rounded" src={`https://www.youtube.com/embed/${trailerKey}`} allowFullScreen />
            ) : (
              <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.png'} className="w-full rounded" />
            )}
          </div>

          <div className="md:w-1/2 text-gray-200">
            <h3 className="text-lg font-semibold mb-2">Опис</h3>
            <p className="mb-4 leading-relaxed">{movie.overview}</p>

            <div className="mb-4">
              <h4 className="font-semibold">Жанри</h4>
              <div className="flex gap-2 mt-2 flex-wrap">
                {movie.genres?.map((g: any) => (
                  <span key={g.id} className="px-3 py-1 bg-gray-800 rounded text-sm">{g.name}</span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold">Деталі</h4>
              <ul className="text-sm mt-2 text-gray-300">
                <li>Тривалість: {movie.runtime} хв</li>
                <li>Мова: {movie.original_language}</li>
                <li>Рейтинг: {movie.vote_average}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
