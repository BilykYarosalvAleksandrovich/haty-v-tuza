// app/movie/[id]/FavoriteButton.tsx (Оновлено)
"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

// ВАЖЛИВО: Оскільки це Client Component, ми викликаємо API роут,
// а не Prisma Client напряму.

export default function FavoriteButton({ movieId }: { movieId: number }) {
  const { data: session, status } = useSession();
  const [isFav, setIsFav] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const idStr = String(movieId);

  const checkFavStatus = useCallback(
    async (isLocal: boolean) => {
      if (isLocal) {
        // 1. Логіка для неавторизованих (Local Storage)
        const favs = JSON.parse(localStorage.getItem("favs") || "[]");
        setIsFav(favs.includes(idStr));
      } else if (session?.user?.id) {
        // 2. Логіка для авторизованих (API -> DB)
        const res = await fetch(`/api/user/favorites?movieId=${movieId}`);
        const data = await res.json();
        setIsFav(data.isFavorite);
      }
    },
    [idStr, movieId, session?.user?.id]
  );

  useEffect(() => {
    checkFavStatus(status !== "authenticated");
    // Логіка історії (поки що залишаємо локальну, але краще перенести на API)
    const h = JSON.parse(localStorage.getItem("history") || "[]");
    h.unshift(idStr);
    localStorage.setItem(
      "history",
      JSON.stringify(Array.from(new Set(h)).slice(0, 50))
    );
  }, [idStr, status, checkFavStatus]);

  const toggleFav = async () => {
    setIsLoading(true);
    if (status !== "authenticated") {
      // Тільки Local Storage для неавторизованих
      const favs = JSON.parse(localStorage.getItem("favs") || "[]");
      let nextFavs;
      if (favs.includes(idStr)) {
        nextFavs = favs.filter((id: string) => id !== idStr);
        setIsFav(false);
      } else {
        nextFavs = [idStr, ...favs];
        setIsFav(true);
      }
      localStorage.setItem("favs", JSON.stringify(nextFavs));
      setIsLoading(false);
      return;
    }

    // Логіка для авторизованих (API -> DB)
    try {
      const res = await fetch(`/api/user/favorites`, {
        method: isFav ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId: movieId }),
      });
      if (res.ok) {
        setIsFav(!isFav);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFav}
      disabled={isLoading}
      className={`w-full py-2 rounded-lg text-lg font-bold transition duration-200 ${
        isFav
          ? "bg-yellow-500 hover:bg-yellow-600 text-black"
          : "bg-gray-700 hover:bg-gray-600 text-white"
      } disabled:opacity-50`}
    >
      {isLoading
        ? "Завантаження..."
        : isFav
        ? "❤️ В улюблених"
        : "🤍 Додати в улюблене"}
    </button>
  );
}
