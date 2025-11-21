"use client";
import Link from "next/link";
import { useState, useEffect, useRef, KeyboardEvent } from "react";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  media_type?: "movie" | "tv";
}

interface MoviesPageProps {
  movies: Movie[];
}

export default function MoviesPage({ movies: initialMovies }: MoviesPageProps) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [loading, setLoading] = useState(false);

  const fetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Пошук фільмів через API
  useEffect(() => {
    if (!q) {
      setResults([]);
      setOpen(false);
      setHighlightedIndex(-1);
      setLoading(false);
      return;
    }

    if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);

    fetchTimeoutRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/tmdb/search?query=${encodeURIComponent(q)}`
        );
        const data = await res.json();
        setResults(data.results || []);
        setOpen(true);
        setHighlightedIndex(-1);
      } catch (e) {
        console.error(e);
        setResults([]);
        setOpen(true);
        setHighlightedIndex(-1);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
    };
  }, [q]);

  // Автоскрол до виділеного елемента
  useEffect(() => {
    if (highlightedIndex >= 0 && containerRef.current) {
      const container = containerRef.current;
      const item = container.children[highlightedIndex] as HTMLElement;
      if (item) {
        const itemTop = item.offsetTop;
        const itemBottom = itemTop + item.offsetHeight;
        const containerScrollTop = container.scrollTop;
        const containerHeight = container.offsetHeight;

        if (itemTop < containerScrollTop) {
          container.scrollTop = itemTop;
        } else if (itemBottom > containerScrollTop + containerHeight) {
          container.scrollTop = itemBottom - containerHeight;
        }
      }
    }
  }, [highlightedIndex]);

  const handleBlur = () => {
    blurTimeoutRef.current = setTimeout(() => setOpen(false), 150);
  };
  const handleFocus = () => {
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    if (results.length > 0 || q) setOpen(true);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!results.length && e.key !== "Escape") return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && highlightedIndex < results.length) {
        const selected = results[highlightedIndex];
        window.location.href = `/movie/${selected.id}`;
      }
    } else if (e.key === "Escape") {
      setQ("");
      setOpen(false);
      setHighlightedIndex(-1);
    } else if (e.key === "Backspace" && e.ctrlKey) {
      setQ("");
      setHighlightedIndex(-1);
    }
  };

  const highlightMatch = (text: string) => {
    const regex = new RegExp(`(${q})`, "gi");
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <span key={i} className="text-yellow-400 font-semibold">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  const displayMovies = q ? results : initialMovies;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Популярні фільми</h1>

      {/* SearchBar */}
      <div className="relative w-80 mb-4">
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="Пошук фільмів..."
          className="w-full p-2 rounded bg-gray-800 text-white outline-none pr-8"
        />

        {loading && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <svg
              className="w-5 h-5 animate-spin text-yellow-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          </div>
        )}

        {/* Dropdown */}
        <div
          ref={containerRef}
          className={`absolute top-full left-0 right-0 bg-gray-900 rounded mt-2 z-50 overflow-auto transition-all duration-300 ease-in-out
          ${
            open
              ? "max-h-64 opacity-100"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          {open &&
            results.slice(0, 8).map((m, index) => {
              const isHighlighted = index === highlightedIndex;
              return (
                <Link
                  key={m.id}
                  href={`/movie/${m.id}`}
                  className={`flex gap-3 p-2 rounded transition-all duration-200 transform ${
                    isHighlighted
                      ? "bg-gray-700 scale-105"
                      : "hover:bg-gray-800 scale-100"
                  }`}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <img
                    src={
                      m.poster_path
                        ? `https://image.tmdb.org/t/p/w92${m.poster_path}`
                        : "/placeholder.png"
                    }
                    alt={m.title}
                    className="w-12 h-16 object-cover rounded"
                  />
                  <div className="text-white text-sm flex flex-col justify-center">
                    <div className="font-semibold">
                      {highlightMatch(m.title)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {m.release_date?.slice(0, 4)}
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {displayMovies.map((movie) => (
          <Link key={movie.id} href={`/movie/${movie.id}`} className="block">
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                  : "/placeholder.png"
              }
              alt={movie.title}
              className="w-full rounded-lg mb-2 object-cover"
            />
            <div className="text-sm text-white">
              <div className="font-semibold">{movie.title}</div>
              <div className="text-gray-400">
                {movie.release_date?.slice(0, 4)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
