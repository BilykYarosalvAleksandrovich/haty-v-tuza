import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const ids = String(req.query.ids || '');
  if (!ids) return res.status(200).json([]);
  const apiKey = process.env.TMDB_API_KEY;
  const arr = ids.split(',');
  const prom = arr.map((id) => fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`).then(r=>r.json()));
  const data = await Promise.all(prom);
  res.status(200).json(data);
}
