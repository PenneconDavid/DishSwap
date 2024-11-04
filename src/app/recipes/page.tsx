"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RecipeCard from "../components/RecipeCard";
import { useRouter } from "next/navigation";

interface Recipe {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  cuisine?: string;
  difficulty?: string;
  cookingTime?: string;
}

export default function BrowseRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    cuisine: "",
    difficulty: "",
    time: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    fetchRecipes();
  }, [currentPage, filters, searchTerm]);

  const fetchRecipes = async () => {
    try {
      setIsLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "6",
        ...filters,
        search: searchTerm,
      });
      const response = await fetch(`${apiUrl}/api/recipes?${queryParams}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setRecipes(data.data || []);
        setTotalPages(data.totalPages);
      } else {
        throw new Error("API returned success: false");
      }
    } catch (e) {
      console.error("Failed to fetch recipes:", e);
      setError("Failed to load recipes. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 pt-24 pb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-cream mb-12 text-center">
          Browse Recipes
        </h1>

        {/* Enhanced Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full p-4 pl-12 border border-gray-200 dark:border-gray-700 
              rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-cream
              focus:ring-2 focus:ring-coral shadow-sm transition-all duration-300
              placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Enhanced Filters Column */}
          <div className="md:col-span-1">
            <div
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg 
              border border-gray-100 dark:border-gray-700"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-cream mb-6">
                Filter Recipes
              </h3>
              <div className="space-y-6">
                {["cuisine", "difficulty", "time"].map((filterType) => (
                  <div key={filterType}>
                    <label className="block text-gray-700 dark:text-cream/80 mb-2 capitalize font-medium">
                      {filterType}
                    </label>
                    <select
                      name={filterType}
                      value={filters[filterType as keyof typeof filters]}
                      onChange={handleFilterChange}
                      className="w-full p-3 border border-gray-200 dark:border-gray-700 
                      rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-cream
                      focus:ring-2 focus:ring-coral transition-all duration-300"
                    >
                      <option value="">All {filterType}s</option>
                      {/* Add your filter options here */}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recipes Column */}
          <div className="md:col-span-3">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full border-t-2 border-b-2 border-coral animate-spin"></div>
                  <div className="h-16 w-16 rounded-full border-t-2 border-b-2 border-lavender animate-spin absolute top-4 left-4"></div>
                </div>
              </div>
            ) : error ? (
              <div className="text-center p-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <svg
                  className="w-12 h-12 text-red-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
            ) : (
              <>
                {recipes.length === 0 && !isLoading && !error ? (
                  <div className="text-center p-12">
                    <svg
                      className="w-16 h-16 text-gray-400 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-cream mb-2">
                      No recipes found
                    </h3>
                    <p className="text-gray-600 dark:text-cream/60">
                      Try adjusting your search or filters
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {recipes.map((recipe) => (
                        <RecipeCard
                          key={recipe._id}
                          _id={recipe._id}
                          title={recipe.title}
                          description={recipe.description}
                          imageUrl={recipe.imageUrl}
                          cookingTime={recipe.cookingTime}
                          difficulty={recipe.difficulty}
                          onClick={() => router.push(`/recipe/${recipe._id}`)}
                        />
                      ))}
                    </div>
                    {totalPages > 1 && (
                      <div className="flex justify-center mt-12 mb-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700
                            disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50
                            dark:hover:bg-gray-700 transition-colors duration-300"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                              />
                            </svg>
                          </button>

                          {Array.from({ length: totalPages }).map(
                            (_, index) => (
                              <button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300
                                ${
                                  currentPage === index + 1
                                    ? "bg-gradient-custom text-white shadow-lg"
                                    : "hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                                }`}
                              >
                                {index + 1}
                              </button>
                            )
                          )}

                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700
                            disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50
                            dark:hover:bg-gray-700 transition-colors duration-300"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
