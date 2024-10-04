"use client";

import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import RecipeCard from "./components/RecipeCard";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const response = await fetch(`${apiUrl}/api/recipes?limit=3`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          setRecipes(data.data || []);
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
    fetchRecipes();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <main className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Welcome to DishSwap 🍜
        </h1>
        {loading ? (
          <p>Loading recipes...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
        )}
      </main>
      <Footer />
    </div>
  );
}
