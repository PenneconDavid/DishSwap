"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import { motion } from "framer-motion";

export default function RecipeForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
      const token = localStorage.getItem("token");

      const response = await axios.post("/api/recipes", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        router.push("/recipes");
      } else {
        throw new Error(response.data.error || "Failed to submit recipe");
      }
    } catch (err) {
      console.error("Error submitting recipe:", err);
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "An unexpected error occurred while submitting the recipe. Please try again."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <h2 className="text-4xl font-bold bg-gradient-custom text-transparent bg-clip-text mb-6 text-center">
            Share Your Recipe
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
            Share your culinary masterpiece with the DishSwap community
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-300 text-sm"
                role="alert"
              >
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </motion.div>
            )}

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                >
                  Recipe Title
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path
                        fillRule="evenodd"
                        d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-coral dark:focus:ring-lavender focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors duration-200"
                    required
                    placeholder="What's your recipe called?"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-coral dark:focus:ring-lavender focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  rows={3}
                  required
                  placeholder="Tell us about your recipe..."
                ></textarea>
              </div>

              <div>
                <label
                  htmlFor="ingredients"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                >
                  Ingredients
                </label>
                <textarea
                  id="ingredients"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-coral dark:focus:ring-lavender focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  rows={5}
                  required
                  placeholder="List your ingredients here, one per line..."
                ></textarea>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Tip: Include quantities for each ingredient
                </p>
              </div>

              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                >
                  Recipe Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-coral dark:hover:border-lavender transition-colors duration-200">
                  <div className="space-y-1 text-center">
                    {!imagePreview ? (
                      <>
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                          <label
                            htmlFor="image"
                            className="relative cursor-pointer rounded-md font-medium text-coral dark:text-lavender hover:text-coral-dark dark:hover:text-lavender-light focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-coral dark:focus-within:ring-lavender"
                          >
                            <span>Upload a photo</span>
                            <input
                              id="image"
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </>
                    ) : (
                      <div className="relative">
                        <Image
                          src={imagePreview}
                          alt="Recipe preview"
                          width={300}
                          height={200}
                          className="rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImage(null);
                            setImagePreview(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-custom text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating your recipe...
                </span>
              ) : (
                "Share Recipe"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
