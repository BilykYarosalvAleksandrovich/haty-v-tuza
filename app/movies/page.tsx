import MovieGrid from '../../components/MovieGrid';

async function fetchMovies(page = 1) {
  const res = await fetch(`/api/tmdb/popular?page=${page}`);
  return res.json();
}

export default async function MoviesPage({ searchParams }: any) {
  const page = Number(searchParams?.page) || 1;
  const data = await fetchMovies(page);
  return (
    <main className="p-6">
      <h1 className="text-2xl text-white mb-4">Каталог фільмів</h1>
      <MovieGrid movies={data.results || []} />
      <div className="flex justify-center gap-3 mt-6">
        {page > 1 && (
          <a href={`/movies?page=${page - 1}`} className="px-3 py-2 bg-gray-800 rounded">Назад</a>
        )}
        <span className="px-3 py-2 bg-red-600 rounded text-white">{page}</span>
        <a href={`/movies?page=${page + 1}`} className="px-3 py-2 bg-gray-800 rounded">Далі</a>
      </div>
    </main>
  );
}
