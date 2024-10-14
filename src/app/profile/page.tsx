"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RecipeCard from "../components/RecipeCard";

export default function ProfilePage() {
  const [uploadedRecipes, setUploadedRecipes] = useState([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const [uploadedResponse, favoritesResponse] = await Promise.all([
          axios.get("/api/recipes/user", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/favorites", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUploadedRecipes(uploadedResponse.data.data);
        setFavoriteRecipes(favoritesResponse.data.favorites);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load recipes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-grow container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Profile</h1>
        <p className="text-lg text-gray-700 mb-8">
          Welcome to your profile page! Here you can see your uploaded recipes
          and favorite recipes.
        </p>

        {loading ? (
          <p>Loading recipes...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Your Recipes
              </h2>
              {uploadedRecipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {uploadedRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe._id}
                      _id={recipe._id}
                      title={recipe.title}
                      description={recipe.description}
                      imageUrl={recipe.imageUrl}
                      imageData={recipe.imageData}
                      imageType={recipe.imageType}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">
                  You haven't uploaded any recipes yet.
                </p>
              )}
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Favorite Recipes
              </h2>
              {favoriteRecipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe._id}
                      _id={recipe._id}
                      title={recipe.title}
                      description={recipe.description}
                      imageUrl={recipe.imageUrl}
                      imageData={recipe.imageData}
                      imageType={recipe.imageType}
                      isFavorite={true}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">
                  You haven't favorited any recipes yet.
                </p>
              )}
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
