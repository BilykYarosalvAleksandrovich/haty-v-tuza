import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const q = String(req.query.query || '');
  if (!q) return res.status(400).json({ results: [] });
  const apiKey = process.env.TMDB_API_KEY;
  const r = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(q)}&page=1`);
  const data = await r.json();
  res.status(200).json(data);
}
