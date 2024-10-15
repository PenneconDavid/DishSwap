"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import axios from "axios";
import RecipeCard from "../components/RecipeCard";
import fallbackImage from "../images/logo1.png";

export default function ProfilePage() {
  const [userRecipes, setUserRecipes] = useState([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const [userRecipesResponse, favoritesResponse] = await Promise.all([
          axios.get("/api/recipes/user", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/favorites", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUserRecipes(userRecipesResponse.data.data);
        setFavoriteRecipes(favoritesResponse.data.favorites);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  const getImageUrl = (recipe) => {
    if (recipe.imageData && recipe.imageType) {
      // Check if imageData is already a base64 string
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
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Your Profile</h1>
        <p className="text-lg text-gray-700 mb-10">
          Welcome to your profile page! This section shows your personal
          information and the recipes you've contributed.
        </p>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Your Recipes
          </h2>
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
            <p className="text-gray-600">
              You haven't uploaded any recipes yet.
            </p>
          )}
          {userRecipes.length > 6 && (
            <div className="mt-6 text-center">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
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
            <p className="text-gray-600">
              You haven't added any favorite recipes yet.
            </p>
          )}
          {favoriteRecipes.length > 6 && (
            <div className="mt-6 text-center">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                View All Favorites
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
