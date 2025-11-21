import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const page = String(req.query.page || '1');
  const apiKey = process.env.TMDB_API_KEY;
  const r = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`);
  const data = await r.json();
  res.status(200).json(data);
}
