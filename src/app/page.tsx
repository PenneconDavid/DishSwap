"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Header from "./components/Header";
import Footer from "./components/Footer";
import RecipeCard from "./components/RecipeCard";
import Link from "next/link";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasMore) {
      fetchRecipes();
    }
  }, [inView]);

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
        setRecipes((prevRecipes) => [...prevRecipes, ...(data.data || [])]);
        setPage((prevPage) => prevPage + 1);
        setHasMore(data.data.length === 6);
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

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <main className="container mx-auto p-6 flex-grow">
        <section className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-gray-800">
            Welcome to DishSwap 🍜
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover, share, and swap your favorite recipes with food
            enthusiasts around the world!
          </p>
          <Link
            href="/recipes"
            className="bg-pink-500 text-white font-bold py-3 px-6 rounded-full hover:bg-pink-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            Explore Recipes
          </Link>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Featured Recipes
          </h2>
          {error ? (
            <div className="text-center text-red-500 bg-red-100 border border-red-400 rounded p-4">
              {error}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
              {hasMore && (
                <div ref={ref} className="flex justify-center mt-8">
                  {loading && (
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-pink-500"></div>
                  )}
                </div>
              )}
            </>
          )}
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Ready to share your culinary masterpiece?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join our community and let your recipes shine!
          </p>
          <Link
            href="/submit"
            className="bg-yellow-500 text-white font-bold py-3 px-6 rounded-full hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            Submit a Recipe
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
