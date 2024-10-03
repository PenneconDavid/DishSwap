"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function RecipePage() {
  const router = useRouter();
  const { id } = router.query;
  const [recipe, setRecipe] = useState({
    title: "",
    description: "",
    ingredients: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (id) {
      const fetchRecipe = async () => {
        const response = await fetch(`/api/recipes/${id}`);
        const data = await response.json();
        if (data.success) {
          setRecipe(data.data);
        }
      };
      fetchRecipe();
    }
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-grow container mx-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {recipe.title}
          </h1>
          <p className="text-gray-700 text-lg mb-6">{recipe.description}</p>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ingredients</h2>
          <p className="text-gray-700 text-lg">{recipe.ingredients}</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
