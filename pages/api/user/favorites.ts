// pages/api/user/favorites.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]"; // Припустимо, що authOptions експортовано

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Отримуємо сесію (перевірка авторизації)
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.id) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const userId = session.user.id;
  const movieId = req.query.movieId
    ? parseInt(req.query.movieId as string)
    : req.body.movieId;

  // GET: Перевірка статусу (викликається компонентом FavoriteButton при завантаженні)
  if (req.method === "GET") {
    if (!movieId) return res.status(400).json({ message: "Missing movieId" });

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_movieId: { userId, movieId },
      },
    });
    return res.status(200).json({ isFavorite: !!favorite });
  }

  // POST: Додати в улюблене
  if (req.method === "POST") {
    if (!movieId) return res.status(400).json({ message: "Missing movieId" });
    try {
      await prisma.favorite.create({
        data: { userId, movieId },
      });
      return res.status(200).json({ message: "Added to favorites" });
    } catch (error) {
      // Ігноруємо помилку, якщо фільм вже є (Unique constraint)
      return res
        .status(200)
        .json({ message: "Already a favorite or successfully added" });
    }
  }

  // DELETE: Видалити з улюбленого
  if (req.method === "DELETE") {
    if (!movieId) return res.status(400).json({ message: "Missing movieId" });
    try {
      await prisma.favorite.delete({
        where: {
          userId_movieId: { userId, movieId },
        },
      });
      return res.status(200).json({ message: "Removed from favorites" });
    } catch (error) {
      // Ігноруємо, якщо фільму немає
      return res.status(200).json({ message: "Successfully removed" });
    }
  }

  return res.status(405).end();
}
