'use client';
import { useState } from 'react';
import MovieModal from './MovieModal';

export default function MovieCard({ movie }: { movie: any }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-2xl rounded overflow-hidden bg-gray-800"
      >
        <img
          src={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : '/placeholder.png'}
          alt={movie.title}
          className="w-full h-auto object-cover"
          draggable={false}
        />
        <div className="p-2 text-white text-sm truncate">{movie.title}</div>
      </div>

      {open && <MovieModal movieId={movie.id} onClose={() => setOpen(false)} />}
    </>
  );
}
