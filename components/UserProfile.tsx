'use client';
import { useEffect, useState } from 'react';
import MovieCard from './MovieCard';
import { useSession } from 'next-auth/react';

export default function UserProfile() {
  const { data: session } = useSession();
  const [favs, setFavs] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [movies, setMovies] = useState<any[]>([]);

  useEffect(() => {
    setFavs(JSON.parse(localStorage.getItem('favs') || '[]'));
    setHistory(JSON.parse(localStorage.getItem('history') || '[]'));
  }, []);

  useEffect(() => {
    (async () => {
      const uniq = Array.from(new Set([...favs, ...history]));
      if (!uniq.length) return;
      const res = await fetch(`/api/tmdb/bulk?ids=${uniq.join(',')}`);
      const data = await res.json();
      setMovies(data);
    })();
  }, [favs, history]);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl mb-4">Профіль</h1>
      <div className="mb-6">Привіт, {session?.user?.name || session?.user?.email}</div>

      <section className="mb-8">
        <h2 className="text-xl mb-3">Улюблені</h2>
        {favs.length ? <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">{movies.filter(m=>favs.includes(String(m.id))).map(m=><MovieCard key={m.id} movie={m}/>)}</div> : <div>Немає улюблених</div>}
      </section>

      <section>
        <h2 className="text-xl mb-3">Історія</h2>
        {history.length ? <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">{movies.filter(m=>history.includes(String(m.id))).map(m=><MovieCard key={m.id} movie={m}/>)}</div> : <div>Немає переглядів</div>}
      </section>
    </div>
  );
}
