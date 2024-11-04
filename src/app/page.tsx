"use client";

import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import RecipeCard from "./components/RecipeCard";
import Link from "next/link";
import { motion } from "framer-motion";

// Define the Recipe type
interface Recipe {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  // Add other properties as needed
}

// Add new interface for statistics
interface Statistics {
  totalRecipes: number;
  totalUsers: number;
  totalLikes: number;
}

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [stats, setStats] = useState<Statistics>({
    totalRecipes: 0,
    totalUsers: 0,
    totalLikes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchRecipes();
    fetchStatistics();
  }, [page]);

  async function fetchRecipes() {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const response = await fetch(
        `${apiUrl}/api/recipes?limit=6&page=${page}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setRecipes(data.data as Recipe[]);
        setTotalPages(Math.ceil(data.total / 6)); // Assuming the API returns the total number of recipes
      } else {
        throw new Error("API returned success: false");
      }
    } catch (e) {
      console.error("Failed to fetch recipes:", e);
      setError("Failed to load recipes. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchStatistics() {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/statistics`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
    }
  }

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative py-20 bg-[#F4ECDF] dark:bg-gray-900 transition-colors duration-300">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-[#F4ECDF] tracking-tight">
                  Welcome to DishSwap{" "}
                  <span className="inline-block animate-bounce">🍜</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-700 dark:text-[#F4ECDF]/80 mb-10 leading-relaxed">
                  Discover, share, and swap your favorite recipes with food
                  enthusiasts around the world!
                </p>
                <Link
                  href="/recipes"
                  className="inline-block bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold py-4 px-8 rounded-full 
                  hover:from-pink-600 hover:to-yellow-600 transition duration-300 ease-in-out transform 
                  hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Explore Recipes
                </Link>
                <div className="grid grid-cols-3 gap-8 mt-16 mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center"
                  >
                    <div className="text-4xl font-bold text-pink-500">
                      {stats.totalRecipes}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Total Recipes
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center"
                  >
                    <div className="text-4xl font-bold text-yellow-500">
                      {stats.totalUsers}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Community Members
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-center"
                  >
                    <div className="text-4xl font-bold text-red-500">
                      {stats.totalLikes}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Recipe Likes
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Divider 1 */}
        <div className="section-divider section-divider-light" />

        {/* Featured Recipes Section */}
        <section className="relative py-20 bg-gray-900 dark:bg-[#F4ECDF] transition-colors duration-300">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-[#F4ECDF] dark:text-gray-900">
              Featured Recipes
            </h2>
            {error ? (
              <div className="max-w-2xl mx-auto text-center text-red-500 bg-red-100 border border-red-400 rounded-lg p-4">
                {error}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {recipes.map((recipe) => (
                    <RecipeCard
                      key={recipe._id}
                      _id={recipe._id}
                      title={recipe.title}
                      description={recipe.description}
                      imageUrl={recipe.imageUrl}
                    />
                  ))}
                </div>
                {loading && (
                  <div className="flex justify-center my-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#F4ECDF] dark:border-gray-900"></div>
                  </div>
                )}
                <div className="flex justify-center gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={page === 1}
                    className="bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold py-3 px-6 
                    rounded-l-full disabled:opacity-50 disabled:cursor-not-allowed transition duration-300
                    hover:from-pink-600 hover:to-red-600"
                  >
                    Previous
                  </button>
                  <span className="bg-[#F4ECDF]/10 dark:bg-gray-900/10 py-3 px-6 font-medium text-[#F4ECDF] dark:text-gray-900">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                    className="bg-gradient-to-r from-red-500 to-yellow-500 text-white font-bold py-3 px-6 
                    rounded-r-full disabled:opacity-50 disabled:cursor-not-allowed transition duration-300
                    hover:from-red-600 hover:to-yellow-600"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Divider 2 */}
        <div className="section-divider section-divider-dark" />

        {/* CTA Section with Newsletter */}
        <section className="relative py-20 bg-[#F4ECDF] dark:bg-gray-900 transition-colors duration-300">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-[#F4ECDF]">
                  Ready to share your culinary masterpiece?
                </h2>
                <p className="text-xl text-gray-700 dark:text-[#F4ECDF]/80 mb-10">
                  Join our community and let your recipes shine!
                </p>
                <div className="flex flex-col items-center gap-8">
                  <Link
                    href="/submit"
                    className="bg-gradient-to-r from-yellow-500 to-pink-500 text-white font-bold py-4 px-8 
                    rounded-full hover:from-yellow-600 hover:to-pink-600 transition duration-300 ease-in-out 
                    transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Submit a Recipe
                  </Link>

                  <div className="w-full max-w-md mt-8">
                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-[#F4ECDF]">
                      Stay Updated with New Recipes
                    </h3>
                    <form
                      className="flex gap-2"
                      onSubmit={(e) => e.preventDefault()}
                    >
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-grow px-4 py-3 rounded-l-full bg-white dark:bg-gray-800 
                        border border-gray-300 dark:border-gray-700 focus:outline-none 
                        focus:ring-2 focus:ring-pink-500 dark:text-[#F4ECDF]"
                      />
                      <button
                        type="submit"
                        className="px-6 py-3 rounded-r-full bg-gradient-to-r from-pink-500 to-yellow-500 
                        text-white font-semibold hover:from-pink-600 hover:to-yellow-600 
                        transition duration-300 transform hover:-translate-y-1"
                      >
                        Subscribe
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
