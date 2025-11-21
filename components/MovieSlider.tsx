"use client";
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/autoplay';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Keyboard } from "swiper/modules";
import Link from "next/link";

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
}

interface MovieSliderProps {
  title?: string;
  movies: Movie[];
}

export default function MovieSlider({
  title = "Movies",
  movies,
}: MovieSliderProps) {
  return (
    <section className="relative my-8">
      <h2 className="text-xl font-bold mb-3 text-white">{title}</h2>

      <div className="absolute top-0 left-0 h-full w-20 md:w-16 bg-gradient-to-r from-black/90 to-transparent pointer-events-none z-20" />
      <div className="absolute top-0 right-0 h-full w-20 md:w-16 bg-gradient-to-l from-black/90 to-transparent pointer-events-none z-20" />

      <Swiper
        modules={[Navigation, Autoplay, Keyboard]}
        navigation
        keyboard={{ enabled: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        spaceBetween={16}
        slidesPerView={7}
        breakpoints={{
          320: { slidesPerView: 2, spaceBetween: 10 },
          480: { slidesPerView: 3, spaceBetween: 12 },
          640: { slidesPerView: 4, spaceBetween: 12 },
          768: { slidesPerView: 5, spaceBetween: 14 },
          1024: { slidesPerView: 6, spaceBetween: 16 },
          1280: { slidesPerView: 7, spaceBetween: 16 },
          1536: { slidesPerView: 7, spaceBetween: 18 },
        }}
        className="pb-4"
      >
        {movies.map((movie) => (
          <SwiperSlide
            key={movie.id}
            className="transition-shadow duration-300 hover:shadow-2xl"
            aria-label={movie.title}
          >
            <Link
              href={`/movie/${movie.id}`}
              className="relative group block rounded-md overflow-hidden transition-transform duration-300 hover:scale-105 focus-visible:scale-105 active:scale-95 outline-none"
            >
              {movie.poster_path ? (
                <>
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-auto rounded-md shadow-md transform transition duration-300 group-hover:brightness-105 group-active:brightness-125"
                    draggable={false}
                  />

                  <div className="absolute inset-0 rounded-md bg-black bg-opacity-0 group-hover:bg-opacity-80 focus-within:bg-opacity-80 transition-all duration-300 flex items-end p-2">
                    <div className="w-full opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300 flex items-center justify-between gap-2 backdrop-blur-sm transform group-hover:scale-105">
                      <span
                        className="font-semibold text-sm text-white truncate pr-2"
                        title={movie.title}
                      >
                        {movie.title}
                      </span>

                      <div className="flex items-center gap-1 text-yellow-400 text-sm whitespace-nowrap transition duration-200 group-hover:text-yellow-300">
                        <span className="text-base">⭐</span>
                        <span>{movie.vote_average?.toFixed(1) ?? "—"}</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-[220px] sm:h-[260px] md:h-[300px] bg-gray-700 flex items-center justify-center text-white rounded-md">
                  {movie.title}
                </div>
              )}
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
