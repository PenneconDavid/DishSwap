import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function RecipeView() {
  const router = useRouter();
  const { id } = router.query;

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchRecipe = async () => {
        try {
          const res = await fetch(`/api/recipes?id=${id}`);
          const data = await res.json();
          if (data.success) {
            setRecipe(data.data);
          }
        } catch (error) {
          console.error("Failed to fetch recipe", error);
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

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <p className="text-gray-700 text-lg mb-6">{recipe.description}</p>
        <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
        <p>{recipe.ingredients}</p>
      </div>
      <Footer />
    </div>
  );
}
