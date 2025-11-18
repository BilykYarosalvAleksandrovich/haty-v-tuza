// components/MovieSlider.tsx
import MovieCard from "./MovieCard";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

export default function MovieSlider({ title, movies }) {
  return (
    <div className="my-8">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <Swiper spaceBetween={10} slidesPerView={5}>
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <MovieCard movie={movie} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
