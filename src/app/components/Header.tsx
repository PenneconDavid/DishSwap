"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <header className="bg-gradient-to-r from-pink-400 via-red-500 to-yellow-500 p-4 shadow-md transition-colors duration-300">
      <div className="container mx-auto flex justify-between items-center">
        <motion.h1
          className="text-3xl font-bold text-white tracking-wide"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
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
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed right-0 top-0 h-full w-64 bg-gradient-to-b from-pink-400 to-red-500 p-4 shadow-xl z-50 md:hidden"
          >
            <NavLinks
              isLoggedIn={isLoggedIn}
              handleLogout={handleLogout}
              isMobile={true}
            />
          </motion.div>
        </>
      )}
    </header>
  );
};

interface NavLinksProps {
  isLoggedIn: boolean;
  handleLogout: () => void;
  isMobile?: boolean;
}

const NavLinks: React.FC<NavLinksProps> = ({
  isLoggedIn,
  handleLogout,
  isMobile = false,
}) => {
  const pathname = usePathname();

  const linkClass = `relative text-white px-4 py-2 rounded transition-all duration-300 
    ${isMobile ? "block w-full text-center my-2" : "inline-block"}
    hover:bg-white/10 hover:shadow-md hover:scale-105`;

  const isActive = (path: string) => pathname === path;

  const getLinkStyles = (path: string) =>
    `${linkClass} ${isActive(path) ? "bg-white/20 font-semibold" : ""}`;

  return (
    <>
      <Link href="/recipes" className={getLinkStyles("/recipes")}>
        Recipes
      </Link>
      {isLoggedIn ? (
        <>
          <Link href="/submit" className={getLinkStyles("/submit")}>
            Submit
          </Link>
          <Link href="/profile" className={getLinkStyles("/profile")}>
            Profile
          </Link>
          <button onClick={handleLogout} className={getLinkStyles("/logout")}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link href="/login" className={getLinkStyles("/login")}>
            Login
          </Link>
          <Link
            href="/signup"
            className={`${getLinkStyles("/signup")} ${!isMobile && "ml-2"}`}
          >
            Sign Up
          </Link>
        </>
      )}
    </>
  );
};

export default Header;
