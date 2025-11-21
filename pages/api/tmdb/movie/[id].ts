import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = String(req.query.id);
  const apiKey = process.env.TMDB_API_KEY;
  const r = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=videos`);
  if (!r.ok) return res.status(500).json({ message: 'TMDB error' });
  const data = await r.json();
  res.status(200).json(data);
}
