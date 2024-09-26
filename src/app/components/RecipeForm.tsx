"use client";

import { useState } from "react";

const RecipeForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would handle the form submission logic, e.g., sending data to an API
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-lg space-y-4 max-w-lg mx-auto"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Submit a New Recipe
      </h2>

      <div className="flex flex-col">
        <label htmlFor="title" className="text-gray-700">
          Recipe Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400"
          placeholder="e.g. Spicy Ramen"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="description" className="text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400"
          placeholder="Briefly describe your recipe"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="ingredients" className="text-gray-700">
          Ingredients
        </label>
        <textarea
          id="ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400"
          placeholder="List the ingredients"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="image" className="text-gray-700">
          Recipe Image
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
          className="mt-1"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-gradient-to-r from-pink-400 to-yellow-500 text-white rounded-lg hover:shadow-xl transform hover:scale-105 transition duration-300"
      >
        Submit Recipe
      </button>
    </form>
  );
};

export default RecipeForm;
