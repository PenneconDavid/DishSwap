"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import axios from "axios";
import RecipeCard from "../components/RecipeCard";
import fallbackImage from "../../../public/images/logo1.png";
import { motion } from "framer-motion";
import Link from "next/link";

interface Recipe {
  _id: string;
  title: string;
  description: string;
  imageData?: string | Buffer;
  imageType?: string;
  imageUrl?: string;
}

export default function ProfilePage() {
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const [userRecipesResponse, favoritesResponse] = await Promise.all([
          axios.get<{ data: Recipe[] }>("/api/recipes/user", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get<{ favorites: Recipe[] }>("/api/favorites", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUserRecipes(userRecipesResponse.data.data);
        setFavoriteRecipes(favoritesResponse.data.favorites);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getImageUrl = (recipe: Recipe): string => {
    if (recipe.imageData && recipe.imageType) {
      const base64Data =
        typeof recipe.imageData === "string"
          ? recipe.imageData
          : Buffer.from(recipe.imageData).toString("base64");
      return `data:${recipe.imageType};base64,${base64Data}`;
    }
    if (recipe.imageUrl) {
      return recipe.imageUrl;
    }
    return fallbackImage.src;
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-cream dark:bg-gray-900">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 max-w-7xl">
        {loading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <motion.div
              className="w-16 h-16 border-4 border-t-4 border-coral rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 mb-10 transform hover:scale-[1.02] transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-custom text-transparent bg-clip-text mb-4">
                    Your Profile
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    Welcome to your personal recipe hub! Here you can manage
                    your creations and favorites.
                  </p>
                </div>
                <Link
                  href="/submit"
                  className="bg-gradient-custom text-white font-bold py-3 px-6 rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                >
                  Add New Recipe
                </Link>
              </div>
            </div>

            <section className="mb-12 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-cream">
                  Your Recipes
                </h2>
              </div>

              {userRecipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {userRecipes.slice(0, 6).map((recipe) => (
                    <motion.div
                      key={recipe._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="h-full transform hover:scale-[1.03] transition-all duration-300"
                    >
                      <RecipeCard
                        _id={recipe._id}
                        title={recipe.title}
                        description={recipe.description}
                        imageUrl={getImageUrl(recipe)}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-cream dark:bg-gray-800 border-l-4 border-coral p-6 rounded-lg shadow-md"
                >
                  <p className="font-bold text-lg mb-2">No recipes yet!</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Start sharing your culinary creations with the world.
                  </p>
                </motion.div>
              )}

              {userRecipes.length > 6 && (
                <div className="mt-8 text-center">
                  <button className="bg-gradient-custom text-white font-bold py-3 px-8 rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                    View All Recipes
                  </button>
                </div>
              )}
            </section>

            <section className="mb-12 space-y-6">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-cream">
                Favorite Recipes
              </h2>

              {favoriteRecipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {favoriteRecipes.slice(0, 6).map((recipe) => (
                    <motion.div
                      key={recipe._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="h-full transform hover:scale-[1.03] transition-all duration-300"
                    >
                      <RecipeCard
                        _id={recipe._id}
                        title={recipe.title}
                        description={recipe.description}
                        imageUrl={getImageUrl(recipe)}
                        isFavorite={true}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-cream dark:bg-gray-800 border-l-4 border-lavender p-6 rounded-lg shadow-md"
                >
                  <p className="font-bold text-lg mb-2">No favorites yet!</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Explore recipes and start building your collection of
                    favorites.
                  </p>
                </motion.div>
              )}

              {favoriteRecipes.length > 6 && (
                <div className="mt-8 text-center">
                  <button className="bg-gradient-custom text-white font-bold py-3 px-8 rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                    View All Favorites
                  </button>
                </div>
              )}
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
