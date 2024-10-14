"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import RecipeCard from "../components/RecipeCard";

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
            Your Recipes
          </h2>
          {userRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userRecipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
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
                <RecipeCard key={recipe._id} recipe={recipe} />
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
