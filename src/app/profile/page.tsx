"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import axios from "axios";
import RecipeCard from "../components/RecipeCard";
import fallbackImage from "../../../public/images/logo1.png";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

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
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [totalLikes, setTotalLikes] = useState(0);

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
        setError("An error occurred while fetching user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const userResponse = await axios.get<{ data: any }>("/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(userResponse.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("An error occurred while fetching user data.");
      }
    };

    fetchUser();
  }, [userRecipes]);

  useEffect(() => {
    const fetchTotalLikes = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const likesResponse = await axios.get<{ totalLikes: number }>(
          "/api/likes",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setTotalLikes(likesResponse.data.totalLikes);
      } catch (error) {
        console.error("Error fetching total likes:", error);
        setError("An error occurred while fetching total likes.");
      }
    };

    fetchTotalLikes();
  }, [userRecipes]);

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

  const handleFavoriteToggle = async (recipeId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.post<{ data: Recipe }>(
        `/api/favorites/${recipeId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUserRecipes((prevRecipes) =>
        prevRecipes.map((recipe) =>
          recipe._id === recipeId ? response.data.data : recipe
        )
      );
      setFavoriteRecipes((prevRecipes) =>
        prevRecipes.map((recipe) =>
          recipe._id === recipeId ? response.data.data : recipe
        )
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setError("An error occurred while toggling favorite.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 pt-24 pb-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <RecipeCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p>{error}</p>
          </div>
        ) : (
          <>
            {/* Profile Header */}
            <div
              className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8 mb-12 
              border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center gap-6 mb-6">
                <div
                  className="relative w-24 h-24 rounded-full overflow-hidden 
                  bg-gradient-to-r from-coral via-lavender to-coral p-[3px]"
                >
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <Image
                      src={user?.profileImage || "/images/default-avatar.png"}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 dark:text-cream mb-2">
                    {user?.name || "Chef"}
                  </h1>
                  <p className="text-gray-600 dark:text-cream/60">
                    Member since{" "}
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-cream/10 rounded-lg p-4">
                  <p className="text-2xl font-bold text-coral">
                    {userRecipes.length}
                  </p>
                  <p className="text-gray-600 dark:text-cream/60">Recipes</p>
                </div>
                <div className="bg-cream/10 rounded-lg p-4">
                  <p className="text-2xl font-bold text-lavender">
                    {favoriteRecipes.length}
                  </p>
                  <p className="text-gray-600 dark:text-cream/60">Favorites</p>
                </div>
                <div className="bg-cream/10 rounded-lg p-4">
                  <p className="text-2xl font-bold text-coral">{totalLikes}</p>
                  <p className="text-gray-600 dark:text-cream/60">Likes</p>
                </div>
              </div>
            </div>

            {/* Your Recipes Section */}
            <section className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-cream">
                  Your Recipes
                </h2>
                <Link
                  href="/recipe/new"
                  className="bg-gradient-custom hover:opacity-90 text-white 
                    font-semibold py-2 px-6 rounded-xl transition-all duration-300 
                    hover:shadow-lg hover:-translate-y-0.5"
                >
                  Create New Recipe
                </Link>
              </div>
              {userRecipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe._id}
                      {...recipe}
                      onFavoriteToggle={() => handleFavoriteToggle(recipe._id)}
                    />
                  ))}
                </div>
              ) : (
                <div
                  className="bg-cream/20 dark:bg-gray-800/50 border border-coral/20 
                  text-gray-700 dark:text-cream/80 p-8 rounded-xl text-center"
                >
                  <p className="text-lg mb-4">
                    Ready to share your culinary creations?
                  </p>
                  <Link
                    href="/recipe/new"
                    className="inline-block bg-gradient-custom text-white font-semibold 
                      py-2 px-6 rounded-xl hover:opacity-90 transition-all duration-300"
                  >
                    Create Your First Recipe
                  </Link>
                </div>
              )}
            </section>

            {/* Favorites Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-cream mb-6">
                Favorite Recipes
              </h2>
              {favoriteRecipes.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteRecipes.slice(0, 6).map((recipe) => (
                      <RecipeCard
                        key={recipe._id}
                        {...recipe}
                        isFavorite={true}
                        onFavoriteToggle={() =>
                          handleFavoriteToggle(recipe._id)
                        }
                      />
                    ))}
                  </div>
                  {favoriteRecipes.length > 6 && (
                    <div className="mt-8 text-center">
                      <Link
                        href="/favorites"
                        className="inline-block bg-gradient-custom text-white 
                          font-semibold py-3 px-8 rounded-xl hover:opacity-90 
                          transition-all duration-300 hover:shadow-lg 
                          hover:-translate-y-0.5"
                      >
                        View All Favorites
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <div
                  className="bg-cream/20 dark:bg-gray-800/50 border 
                  border-lavender/20 text-gray-700 dark:text-cream/80 
                  p-8 rounded-xl text-center"
                >
                  <p className="text-lg">
                    Explore recipes and start building your collection of
                    favorites.
                  </p>
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
