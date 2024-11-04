"use client";

import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import RecipeCard from "./components/RecipeCard";
import Link from "next/link";

// Define the Recipe type
interface Recipe {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  // Add other properties as needed
}

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchRecipes();
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
        <section className="bg-gradient-to-b from-[#F4ECDF] to-white py-16">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-800 tracking-tight">
                Welcome to DishSwap{" "}
                <span className="inline-block animate-bounce">🍜</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed">
                Discover, share, and swap your favorite recipes with food
                enthusiasts around the world!
              </p>
              <Link
                href="/recipes"
                className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold py-4 px-8 rounded-full 
                hover:from-pink-600 hover:to-yellow-600 transition duration-300 ease-in-out transform 
                hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Explore Recipes
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800">
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
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500"></div>
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
                  <span className="bg-gray-100 py-3 px-6 font-medium text-gray-700">
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

        <section className="py-16 bg-gradient-to-b from-white to-[#F4ECDF]">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                Ready to share your culinary masterpiece?
              </h2>
              <p className="text-xl text-gray-600 mb-10">
                Join our community and let your recipes shine!
              </p>
              <Link
                href="/submit"
                className="bg-gradient-to-r from-yellow-500 to-pink-500 text-white font-bold py-4 px-8 
                rounded-full hover:from-yellow-600 hover:to-pink-600 transition duration-300 ease-in-out 
                transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Submit a Recipe
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
