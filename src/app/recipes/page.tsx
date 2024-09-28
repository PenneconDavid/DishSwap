"use client";

import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RecipeCard from "../components/RecipeCard";

export default function BrowseRecipesPage() {
  const [filters, setFilters] = useState({
    cuisine: "",
    difficulty: "",
    time: "",
  });

  const [recipes] = useState([
    {
      title: "Spicy Ramen",
      description: "A fiery ramen dish.",
      imageUrl: "/ramen.jpg",
    },
    {
      title: "Sushi Rolls",
      description: "Fresh and simple sushi rolls.",
      imageUrl: "/sushi.jpg",
    },
    {
      title: "Teriyaki Chicken",
      description: "Sweet and savory teriyaki chicken.",
      imageUrl: "/teriyaki.jpg",
    },
  ]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-grow container mx-auto p-6">
        <div className="grid grid-cols-4 gap-6">
          {/* Filters Column */}
          <div className="col-span-1 bg-white p-4 rounded-lg shadow-lg h-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Filter Recipes
            </h3>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Cuisine</label>
              <select
                name="cuisine"
                value={filters.cuisine}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400"
              >
                <option value="">All</option>
                <option value="Japanese">Japanese</option>
                <option value="Italian">Italian</option>
                <option value="Mexican">Mexican</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Difficulty</label>
              <select
                name="difficulty"
                value={filters.difficulty}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400"
              >
                <option value="">All</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Cooking Time</label>
              <select
                name="time"
                value={filters.time}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400"
              >
                <option value="">All</option>
                <option value="Less than 30 minutes">
                  Less than 30 minutes
                </option>
                <option value="30-60 minutes">30-60 minutes</option>
                <option value="More than 60 minutes">
                  More than 60 minutes
                </option>
              </select>
            </div>
          </div>

          {/* Recipes Column */}
          <div className="col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe, index) => (
                <RecipeCard
                  key={index}
                  title={recipe.title}
                  description={recipe.description}
                  imageUrl={recipe.imageUrl}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <button className="py-2 px-4 mx-1 bg-pink-400 text-white rounded-lg hover:bg-pink-500 transition">
                Previous
              </button>
              <button className="py-2 px-4 mx-1 bg-pink-400 text-white rounded-lg hover:bg-pink-500 transition">
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
