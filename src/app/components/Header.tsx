"use client";

import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-pink-400 via-red-500 to-yellow-500 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white tracking-wide">
          <Link href="/">DishSwap 🍜</Link>
        </h1>
        <nav>
          <Link
            href="/recipes"
            className="text-white px-4 py-2 rounded hover:bg-pink-500 transition"
          >
            Recipes
          </Link>
          <Link
            href="/profile"
            className="text-white px-4 py-2 rounded hover:bg-pink-500 transition"
          >
            Profile
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
