"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RecipeCard from "../components/RecipeCard";
import { useRouter } from "next/navigation";

export default function BrowseRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    cuisine: "",
    difficulty: "",
    time: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 9;
  const router = useRouter();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setIsLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/recipes`);

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
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredRecipes = recipes.filter((recipe) => {
    return (
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.cuisine === "" || recipe.cuisine === filters.cuisine) &&
      (filters.difficulty === "" || recipe.difficulty === filters.difficulty) &&
      (filters.time === "" || recipe.cookingTime === filters.time)
    );
  });

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(
    indexOfFirstRecipe,
    indexOfLastRecipe
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Browse Recipes
        </h1>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters Column */}
          <div className="md:col-span-1 bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Filter Recipes
            </h3>
            <div className="space-y-4">
              {["cuisine", "difficulty", "time"].map((filterType) => (
                <div key={filterType}>
                  <label className="block text-gray-700 mb-1 capitalize">
                    {filterType}
                  </label>
                  <select
                    name={filterType}
                    value={filters[filterType]}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400"
                  >
                    <option value="">All</option>
                    {/* Add options based on your data */}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Recipes Column */}
          <div className="md:col-span-3">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-pink-500"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 bg-red-100 border border-red-400 rounded p-4">
                {error}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe._id}
                      _id={recipe._id}
                      title={recipe.title}
                      description={recipe.description}
                      imageUrl={recipe.imageUrl}
                      onClick={() => router.push(`/recipe/${recipe._id}`)}
                    />
                  ))}
                </div>
                {filteredRecipes.length > recipesPerPage && (
                  <div className="flex justify-center mt-8">
                    {Array.from({
                      length: Math.ceil(
                        filteredRecipes.length / recipesPerPage
                      ),
                    }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`mx-1 px-4 py-2 border rounded ${
                          currentPage === index + 1
                            ? "bg-pink-500 text-white"
                            : "bg-white text-pink-500"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
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
