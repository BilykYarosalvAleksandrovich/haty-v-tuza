import MovieSlider from "../components/MovieSlider";
import { getNowPlayingMovies } from "../lib/tmdb";

export default async function Home() {
  const nowPlaying = await getNowPlayingMovies();
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Now Playing</h1>
      <MovieSlider title="Now Playing" movies={nowPlaying.results || []} />
    </main>
  );
}
