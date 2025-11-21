'use client';
import Link from 'next/link';
import UserMenu from "./UserMenu"
import SearchBar from './SearchBar';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur p-4 flex justify-between items-center">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-2xl font-bold text-red-500">🎬 MovieHub</Link>
        <nav className="hidden md:flex gap-4 text-gray-300">
          <Link href="/movies">Каталог</Link>
          <Link href="/movies">Топ</Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <SearchBar />
        <UserMenu />
      </div>
    </header>
  );
}
