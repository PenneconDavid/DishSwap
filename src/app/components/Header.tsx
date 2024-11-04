"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <motion.header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-gradient-to-r from-pink-500/95 via-red-500/95 to-yellow-500/95 backdrop-blur-sm shadow-lg py-2"
          : "bg-gradient-to-r from-pink-400 via-red-500 to-yellow-500 py-4"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <motion.h1
          className="text-3xl font-bold text-white tracking-wide"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Link href="/">DishSwap 🍜</Link>
        </motion.h1>
        <nav className="hidden md:flex items-center space-x-2">
          <NavLinks isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
          <ThemeToggle />
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
    </motion.header>
  );
};

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-full bg-white/10 text-white"
    >
      {isDark ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </motion.button>
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
          <div className="relative inline-block">
            <Link href="/profile" className={getLinkStyles("/profile")}>
              Profile
              <NotificationBadge />
            </Link>
          </div>
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

const NotificationBadge = () => {
  const [notifications] = useState(2); // For testing, you can later connect this to your actual notification system

  return notifications > 0 ? (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
      {notifications > 9 ? "9+" : notifications}
    </span>
  ) : null;
};

export default Header;
