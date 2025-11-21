'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function SearchBar() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!q) {
      setResults([]);
      return;
    }
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/tmdb/search?query=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(data.results || []);
        setOpen(true);
      } catch (e) {
        console.error(e);
      }
    }, 300);
  }, [q]);

  return (
    <div className="relative w-80">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => q && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Пошук фільмів..."
        className="w-full p-2 rounded bg-gray-800 text-white outline-none"
      />
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-gray-900 rounded mt-2 z-50 max-h-64 overflow-auto">
          {results.slice(0, 8).map((m) => (
            <Link key={m.id} href={`/movie/${m.id}`} className="flex gap-3 p-2 hover:bg-gray-800">
              <img src={m.poster_path ? `https://image.tmdb.org/t/p/w92${m.poster_path}` : '/placeholder.png'} alt={m.title || m.name} className="w-12 h-16 object-cover rounded" />
              <div className="text-white text-sm">
                <div className="font-semibold">{m.title || m.name}</div>
                <div className="text-xs text-gray-400">{(m.release_date || m.first_air_date || '').slice(0,4)}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
