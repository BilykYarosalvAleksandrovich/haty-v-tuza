'use client';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function UserMenu() {
  const { data: session } = useSession();

  if (!session)
    return (
      <div className="flex gap-4">
        <Link className="text-white hover:text-red-500" href="/auth/login">Увійти</Link>
        <Link className="text-white hover:text-red-500" href="/auth/register">Реєстрація</Link>
      </div>
    );

  return (
    <div className="flex items-center gap-4 text-white">
      <span className="hidden md:block">{session.user?.name || session.user?.email}</span>
      <button onClick={() => signOut({ callbackUrl: '/' })} className="px-3 py-1 rounded bg-red-600 hover:bg-red-700">Вийти</button>
    </div>
  );
}
