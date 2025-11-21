"use client";
import { useState, useEffect, useRef, KeyboardEvent } from "react";
import Link from "next/link";

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  release_date?: string;
  first_air_date?: string;
  media_type?: "movie" | "tv";
}

export default function SearchBar() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const fetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced fetch
  useEffect(() => {
    if (!q) {
      setResults([]);
      setOpen(false);
      setHighlightedIndex(-1);
      return;
    }

    if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);

    fetchTimeoutRef.current = setTimeout(async () => {
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
      }
    }, 300);

    return () => {
      if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
    };
  }, [q]);

  const handleBlur = () => {
    blurTimeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  const handleFocus = () => {
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    if (results.length > 0 || q) setOpen(true);
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

  const getMediaType = (item: SearchResult) => {
    return item.media_type || (item.title ? "movie" : "tv");
  };

  const MediaIcon = ({ type }: { type: "movie" | "tv" }) => {
    return type === "movie" ? (
      <svg
        className="w-4 h-4 inline-block mr-1 text-yellow-400"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M4 6h16v12H4z"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    ) : (
      <svg
        className="w-4 h-4 inline-block mr-1 text-blue-400"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M4 4h16v16H4z"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path d="M4 10h16" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
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

  return (
    <div className="relative w-80">
      <input
        ref={inputRef}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="Пошук фільмів..."
        className="w-full p-2 rounded bg-gray-800 text-white outline-none"
      />
      {open && (
        <div className="absolute top-full left-0 right-0 bg-gray-900 rounded mt-2 z-50 max-h-64 overflow-auto transition-all duration-200">
          {results.length > 0 ? (
            results.slice(0, 8).map((m, index) => {
              const name = m.title || m.name || "";
              const type = getMediaType(m);
              const isHighlighted = index === highlightedIndex;
              return (
                <Link
                  key={m.id}
                  href={`/movie/${m.id}`}
                  className={`flex gap-3 p-2 rounded transition-colors duration-200 ${
                    isHighlighted ? "bg-gray-700" : "hover:bg-gray-800"
                  }`}
                >
                  <img
                    src={
                      m.poster_path
                        ? `https://image.tmdb.org/t/p/w92${m.poster_path}`
                        : "/placeholder.png"
                    }
                    alt={name}
                    className="w-12 h-16 object-cover rounded"
                  />
                  <div className="text-white text-sm flex flex-col justify-center">
                    <div className="font-semibold">{highlightMatch(name)}</div>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>
                        {(m.release_date || m.first_air_date || "").slice(0, 4)}
                      </span>
                      <span className="flex items-center">
                        <MediaIcon type={type} />
                        {type === "movie" ? "Фільм" : "Серіал"}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="p-4 text-gray-300 text-center italic">
              Нічого не знайдено
            </div>
          )}
        </div>
      )}
    </div>
  );
}
