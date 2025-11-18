"use client";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import Link from "next/link";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
}

interface MovieSliderProps {
  title: string;
  movies: Movie[];
}

export default function MovieSlider({ title, movies }: MovieSliderProps) {
  return (
    <section className="relative my-8">
      <h2 className="text-xl font-bold mb-3 text-white">{title}</h2>

      {/* Gradient fade на лівому і правому краях */}
      <div className="absolute top-0 left-0 h-full w-16 bg-gradient-to-r from-black/80 to-transparent pointer-events-none z-10"></div>
      <div className="absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-black/80 to-transparent pointer-events-none z-10"></div>

      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        spaceBetween={16}
        slidesPerView={"auto"}
        className="pb-4"
        autoplay={{ delay: 3000, disableOnInteraction: false }}
      >
        {movies.map((movie) => (
          <SwiperSlide
            key={movie.id}
            className="w-[150px] sm:w-[200px] md:w-[220px] lg:w-[240px] 
                       transition-shadow duration-300 hover:shadow-2xl"
          >
            <Link href={`/movie/${movie.id}`} className="relative group">
              {movie.poster_path ? (
                <>
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                    className="rounded-md shadow-lg transform transition duration-300
                               group-hover:scale-105 group-hover:brightness-110
                               active:scale-95 active:brightness-125"
                  />

                  {/* Overlay з blur та ефектами */}
                  <div
                    className="absolute inset-0 rounded-md bg-black bg-opacity-0 
                                  group-hover:bg-opacity-80 transition-all duration-300 flex items-end p-2"
                  >
                    <div
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full flex flex-col 
                                    justify-end md:justify-start transform group-hover:scale-105
                                    backdrop-blur-sm"
                    >
                      <span
                        className="font-semibold text-sm text-white truncate 
                                       transition-transform duration-300 group-hover:-translate-y-1 group-hover:text-yellow-200
                                       drop-shadow-md"
                      >
                        {movie.title}
                      </span>
                      <span
                        className="text-yellow-400 text-xs mt-1 drop-shadow-md
                                       transition duration-300 group-hover:text-yellow-300 group-hover:drop-shadow-lg"
                      >
                        ⭐ {movie.vote_average.toFixed(1)} / 10
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-[300px] bg-gray-700 flex items-center justify-center text-white rounded-md">
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
