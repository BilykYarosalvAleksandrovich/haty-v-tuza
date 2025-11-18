import MovieSlider from "@/components/MovieSlider";
import { getNowPlayingMovies } from "@/lib/tmdb";
import { Movie } from "@/components/MovieCard";

export default async function Home() {
  const nowPlaying = await getNowPlayingMovies();

  return (
    <main className="p-4 bg-black min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-6">Now Playing</h1>
      <MovieSlider title="Now Playing" movies={nowPlaying.results as Movie[]} />
    </main>
  );
}
