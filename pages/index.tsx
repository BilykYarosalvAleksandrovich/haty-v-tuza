// pages/index.tsx
import { getNowPlaying, getPopular } from "../lib/tmdb";
import MovieSlider from "../components/MovieSlider";
import Header from "../components/Header";

export default async function HomePage() {
  const nowPlaying = await getNowPlaying();
  const popular = await getPopular();

  return (
    <main className="bg-black text-white min-h-screen">
      <Header />
      <section className="px-4">
        <MovieSlider title="Новинки" movies={nowPlaying.results} />
        <MovieSlider title="Популярні" movies={popular.results} />
      </section>
    </main>
  );
}
