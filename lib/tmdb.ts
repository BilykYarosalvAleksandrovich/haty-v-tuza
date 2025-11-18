// lib/tmdb.ts

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;

export const getNowPlaying = async () => {
  const res = await fetch(
    `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=uk-UA`
  );
  return res.json();
};

export const getPopular = async () => {
  const res = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=uk-UA`
  );
  return res.json();
};
