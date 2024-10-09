"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function RecipeView() {
  const params = useParams();
  const id = params.id;

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchRecipe = async () => {
        try {
          const apiUrl =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
          const res = await fetch(`${apiUrl}/api/recipes/${id}`);
          const data = await res.json();

          if (data.success) {
            setRecipe(data.data);
          } else {
            throw new Error("Recipe data not retrieved successfully");
          }
        } catch (error) {
          console.error("Failed to fetch recipe", error);
          setError("Failed to load recipe. Please try again later.");
        } finally {
          setLoading(false);
        }
      };

      fetchRecipe();
    }
  }, [id]);

  if (loading) {
    return <div>Loading recipe...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
        {recipe.imageUrl && (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        )}
        <p className="text-gray-700 text-lg mb-6">{recipe.description}</p>
        <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
        <p>{recipe.ingredients}</p>
      </div>
      <Footer />
    </div>
  );
}
