"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
        <motion.h1
          className="text-3xl font-bold text-white tracking-wide"
          whileHover={{ scale: 1.05 }}
        >
          <Link href="/">DishSwap 🍜</Link>
        </motion.h1>
        <nav className="hidden md:block">
          <NavLinks isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        </nav>
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden mt-4"
        >
          <NavLinks
            isLoggedIn={isLoggedIn}
            handleLogout={handleLogout}
            isMobile={true}
          />
        </motion.div>
      )}
    </header>
  );
};

const NavLinks = ({ isLoggedIn, handleLogout, isMobile = false }) => {
  const linkClass = `text-white px-4 py-2 rounded hover:bg-pink-500 transition ${
    isMobile ? "block w-full text-center my-2" : "inline-block"
  }`;

  return (
    <>
      <Link href="/recipes" className={linkClass}>
        Recipes
      </Link>
      {isLoggedIn ? (
        <>
          <Link href="/submit" className={linkClass}>
            Submit
          </Link>
          <Link href="/profile" className={linkClass}>
            Profile
          </Link>
          <button onClick={handleLogout} className={linkClass}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link href="/login" className={linkClass}>
            Login
          </Link>
          <Link
            href="/signup"
            className={`${linkClass} ${!isMobile && "ml-2"}`}
          >
            Sign Up
          </Link>
        </>
      )}
    </>
  );
};

export default Header;
