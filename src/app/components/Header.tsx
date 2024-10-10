"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Check if user is logged in by verifying if token exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/"); // Redirect to home page after logout
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
          {isLoggedIn ? (
            <>
              <Link
                href="/submit"
                className="text-white px-4 py-2 rounded hover:bg-pink-500 transition"
              >
                Submit
              </Link>
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
          ) : (
            <Link
              href="/login"
              className="text-white px-4 py-2 rounded hover:bg-pink-500 transition"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
