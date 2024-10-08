"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function RecipeForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("ingredients", ingredients);
    if (image) {
      formData.append("image", image);
    }

    try {
      const token = localStorage.getItem("token"); // Retrieve token from local storage

      // Send the form data with Axios, including the Authorization header
      const response = await axios.post("/api/recipes", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token
        },
      });

      if (response.status === 201) {
        router.push("/recipes"); // Redirect on successful submission
      } else {
        throw new Error(response.data.error || "Failed to submit recipe");
      }
    } catch (err) {
      console.error("Error submitting recipe:", err);
      setError(
        err.response?.data?.message ||
          "An unexpected error occurred while submitting the recipe. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-gray-700 font-bold mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          rows={3}
          required
        ></textarea>
      </div>
      <div className="mb-4">
        <label
          htmlFor="ingredients"
          className="block text-gray-700 font-bold mb-2"
        >
          Ingredients
        </label>
        <textarea
          id="ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          rows={5}
          required
        ></textarea>
      </div>
      <div className="mb-4">
        <label htmlFor="image" className="block text-gray-700 font-bold mb-2">
          Image
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>
      {loading && <p className="text-blue-500 mb-4">Submitting...</p>}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Recipe"}
      </button>
    </form>
  );
}
