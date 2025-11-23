// pages/api/user/list.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]"; // Припустимо, що authOptions експортовано

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (req.method !== "GET") return res.status(405).end();

  if (!session || !session.user?.id) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const userId = session.user.id;
  const { type } = req.query; // type = 'favorites' або 'history'

  if (type === "favorites") {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      select: { movieId: true }, // Нам потрібні лише ID
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(favorites);
  } else if (type === "history") {
    // Отримання історії з DB (якщо ви вирішите її перенести з Local Storage)
    const history = await prisma.history.findMany({
      where: { userId },
      select: { movieId: true },
      orderBy: { viewedAt: "desc" },
      take: 50,
    });
    return res.status(200).json(history);
  } else {
    return res.status(400).json({ message: "Invalid list type" });
  }
}
