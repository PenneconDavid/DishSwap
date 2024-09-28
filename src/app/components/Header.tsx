"use client";

import Link from "next/link";
import { useState } from "react";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulate login state

  const handleLogout = () => {
    setIsLoggedIn(false);
    // Add logic for logging out the user
  };

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
          {!isLoggedIn ? (
            <Link
              href="/login"
              className="text-white px-4 py-2 rounded hover:bg-pink-500 transition"
            >
              Login
            </Link>
          ) : (
            <>
              <Link
                href="/profile"
                className="text-white px-4 py-2 rounded hover:bg-pink-500 transition"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-white px-4 py-2 rounded hover:bg-pink-500 transition"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
