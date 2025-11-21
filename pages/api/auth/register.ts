import type { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';

const DATA_PATH = path.join(process.cwd(), 'data', 'users.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
  const raw = await fs.readFile(DATA_PATH, 'utf8');
  const users = JSON.parse(raw || '[]');
  const exists = users.find((u:any) => u.email === email.toLowerCase());
  if (exists) return res.status(409).json({ message: 'Email already registered' });
  const hashed = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now().toString(), name: name || '', email: email.toLowerCase(), password: hashed, createdAt: new Date().toISOString() };
  users.push(newUser);
  await fs.writeFile(DATA_PATH, JSON.stringify(users, null, 2));
  const { password: _, ...safe } = newUser;
  res.status(201).json({ user: safe });
}
