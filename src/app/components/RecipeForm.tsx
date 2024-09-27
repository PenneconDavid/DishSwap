"use client";

import { useState } from "react";

const RecipeForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create FormData object to include the image
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("ingredients", ingredients);
    if (image) {
      formData.append("image", image);
    }

    // Mock API call - Replace with actual API call once backend is ready
    try {
      console.log("Submitting Recipe:", {
        title,
        description,
        ingredients,
        image,
      });

      // Simulate a fetch call to a backend API (you'll replace this with your real API later)
      const response = await fetch("/api/recipes", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Recipe submitted successfully");
        // Clear form after successful submission
        setTitle("");
        setDescription("");
        setIngredients("");
        setImage(null);
      } else {
        console.log("Failed to submit recipe");
      }
    } catch (error) {
      console.error("Error submitting recipe:", error);
    }
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
          placeholder="Remember to be Descriptive 🌠"
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
          placeholder="Describe the steps to make your recipe"
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
          placeholder="List the ingredients and amounts"
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
