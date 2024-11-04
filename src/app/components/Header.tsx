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
    <header className="bg-white dark:bg-gray-900 p-4 shadow-lg border-b border-gray-100 dark:border-gray-800">
      <div className="container mx-auto flex justify-between items-center">
        <motion.div
          className="relative group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="absolute -inset-[2px] rounded-lg bg-gradient-to-r from-pink-400 via-red-500 to-yellow-500 opacity-70 group-hover:opacity-100 transition-opacity blur-sm" />
          <Link
            href="/"
            className="relative block px-4 py-2 rounded-lg bg-white dark:bg-gray-900 text-3xl font-bold"
          >
            DishSwap 🍜
          </Link>
        </motion.div>

        <nav className="hidden md:block space-x-2">
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
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
            className="fixed right-0 top-0 h-full w-64 bg-white dark:bg-gray-900 p-4 shadow-xl z-50 md:hidden"
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

  const NavButton = ({
    href,
    onClick,
    children,
  }: {
    href?: string;
    onClick?: () => void;
    children: React.ReactNode;
  }) => {
    const Component = href ? Link : "button";
    const isActive = href && pathname === href;

    return (
      <div className="relative group">
        <div
          className={`absolute -inset-[2px] rounded-lg bg-gradient-to-r from-pink-400 via-red-500 to-yellow-500 
          opacity-${
            isActive ? "100" : "0"
          } group-hover:opacity-100 transition-opacity`}
        />
        <Component
          href={href as string}
          onClick={onClick}
          className={`
            relative block px-4 py-2 rounded-lg
            ${isMobile ? "w-full text-center my-2" : "inline-block"}
            bg-white dark:bg-gray-900 
            text-gray-800 dark:text-white
            transition-all duration-300
            hover:shadow-md
            ${isActive ? "font-semibold" : "font-medium"}
          `}
        >
          {children}
        </Component>
      </div>
    );
  };

  return (
    <div className={`${isMobile ? "space-y-2" : "space-x-2"}`}>
      <NavButton href="/recipes">Recipes</NavButton>
      {isLoggedIn ? (
        <>
          <NavButton href="/submit">Submit</NavButton>
          <NavButton href="/profile">Profile</NavButton>
          <NavButton onClick={handleLogout}>Logout</NavButton>
        </>
      ) : (
        <>
          <NavButton href="/login">Login</NavButton>
          <NavButton href="/signup">Sign Up</NavButton>
        </>
      )}
    </div>
  );
};

export default Header;
