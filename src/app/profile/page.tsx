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
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6">
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <motion.div
              className="w-16 h-16 border-4 border-t-4 border-pink-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
          </div>
        ) : (
          <>
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Your Profile
              </h1>
              <p className="text-lg text-gray-700">
                Welcome to your personal recipe hub! Here you can manage your
                creations and favorites.
              </p>
            </div>

            <section className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">
                  Your Recipes
                </h2>
                <Link
                  href="/submit"
                  className="bg-pink-500 text-white font-bold py-2 px-4 rounded-full hover:bg-pink-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                >
                  Add New Recipe
                </Link>
              </div>
              {userRecipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userRecipes.slice(0, 6).map((recipe) => (
                    <RecipeCard
                      key={recipe._id}
                      _id={recipe._id}
                      title={recipe.title}
                      description={recipe.description}
                      imageUrl={getImageUrl(recipe)}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
                  <p className="font-bold">No recipes yet!</p>
                  <p>Start sharing your culinary creations with the world.</p>
                </div>
              )}
              {userRecipes.length > 6 && (
                <div className="mt-6 text-center">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
                    View All Recipes
                  </button>
                </div>
              )}
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Favorite Recipes
              </h2>
              {favoriteRecipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteRecipes.slice(0, 6).map((recipe) => (
                    <RecipeCard
                      key={recipe._id}
                      _id={recipe._id}
                      title={recipe.title}
                      description={recipe.description}
                      imageUrl={getImageUrl(recipe)}
                      isFavorite={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded">
                  <p className="font-bold">No favorites yet!</p>
                  <p>
                    Explore recipes and start building your collection of
                    favorites.
                  </p>
                </div>
              )}
              {favoriteRecipes.length > 6 && (
                <div className="mt-6 text-center">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
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
