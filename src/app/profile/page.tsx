"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function ProfilePage() {
  const [uploadedRecipes, setUploadedRecipes] = useState([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const [uploadedResponse, favoritesResponse] = await Promise.all([
          axios.get("/api/recipes/user", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/favorites", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUploadedRecipes(uploadedResponse.data);
        setFavoriteRecipes(favoritesResponse.data.favorites);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (recipeId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(`/api/recipes/${recipeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUploadedRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe._id !== recipeId)
      );
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-grow container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Profile</h1>
        <p className="text-lg text-gray-700 mb-8">
          Welcome to your profile page! This section will show your personal
          information and the recipes you’ve contributed.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Uploaded Recipes
          </h2>
          {uploadedRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uploadedRecipes.map((recipe) => (
                <div
                  key={recipe._id}
                  className="bg-white p-4 rounded-lg shadow-lg"
                >
                  <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
                  <p className="text-gray-600 mb-4">{recipe.description}</p>
                  <button
                    onClick={() => handleDelete(recipe._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteRecipes.map((recipe) => (
                <Link
                  key={recipe._id}
                  href={`/recipe/${recipe._id}`}
                  className="block"
                >
                  <div className="bg-white p-4 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold mb-2">
                      {recipe.title}
                    </h3>
                    <p className="text-gray-600">{recipe.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">
              You haven't added any favorite recipes yet.
            </p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
