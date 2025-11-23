// components/UserProfile.tsx (Оновлено)
"use client";
import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import { useSession } from "next-auth/react";

// ... (решта імпортів)

export default function UserProfile() {
  const { data: session, status } = useSession();
  const [favMovieIds, setFavMovieIds] = useState<number[]>([]); // Зберігаємо тільки ID
  const [historyMovieIds, setHistoryMovieIds] = useState<string[]>([]); // Локальна історія
  const [movies, setMovies] = useState<any[]>([]);
  const userId = session?.user?.id;

  useEffect(() => {
    const fetchUserData = async () => {
      if (status === "unauthenticated") {
        // Логіка для неавторизованих (Local Storage)
        setHistoryMovieIds(JSON.parse(localStorage.getItem("history") || "[]"));
        setFavMovieIds(
          JSON.parse(localStorage.getItem("favs") || "[]").map(Number)
        );
      } else if (status === "authenticated" && userId) {
        // Логіка для авторизованих (API -> DB)
        try {
          // 1. Отримати улюблене з DB
          const favRes = await fetch(`/api/user/list?type=favorites`);
          const favData = await favRes.json();
          setFavMovieIds(favData.map((f: any) => f.movieId));

          // 2. Отримати історію з Local Storage (або іншого API)
          setHistoryMovieIds(
            JSON.parse(localStorage.getItem("history") || "[]")
          ); // Або змініть на DB API
        } catch (e) {
          console.error("Failed to fetch user lists", e);
        }
      }
    };
    fetchUserData();
  }, [status, userId]);

  // Отримання деталей фільмів для відображення
  useEffect(() => {
    const uniqueIds = Array.from(
      new Set([...favMovieIds, ...historyMovieIds.map(Number)])
    ).filter(Boolean);
    if (!uniqueIds.length) {
      setMovies([]);
      return;
    }
    (async () => {
      // Ми використовуємо bulk API для отримання деталей
      const res = await fetch(`/api/tmdb/bulk?ids=${uniqueIds.join(",")}`);
      const data = await res.json();
      setMovies(data);
    })();
  }, [favMovieIds, historyMovieIds]);

  const favMovies = movies.filter((m) => favMovieIds.includes(m.id));
  const historyMovies = movies.filter((m) =>
    historyMovieIds.includes(String(m.id))
  );

  return (
    <div className="p-6 text-white pt-20">
      <h1 className="text-3xl mb-4">Профіль</h1>
      <div className="mb-6">
        Привіт, {session?.user?.name || session?.user?.email || "Гість"}
      </div>

      {status === "unauthenticated" && (
        <p className="mb-6 text-red-400">
          Увійдіть, щоб зберігати дані у хмарі.
        </p>
      )}

      <section className="mb-8">
        <h2 className="text-xl mb-3">Улюблені</h2>
        {favMovies.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {favMovies.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        ) : (
          <div>Немає улюблених</div>
        )}
      </section>

      <section>
        <h2 className="text-xl mb-3">Історія</h2>
        {historyMovies.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {historyMovies.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        ) : (
          <div>Немає переглядів</div>
        )}
      </section>
    </div>
  );
}
