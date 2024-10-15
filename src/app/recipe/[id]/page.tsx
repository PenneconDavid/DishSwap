"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import axios from "axios";
import Image from "next/image";

export default function RecipeView() {
  const params = useParams();
  const id = params?.id as string | undefined;

  const [recipe, setRecipe] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [reaction, setReaction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("Recipe ID not found");
      setLoading(false);
      return;
    }

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

    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comments?recipeId=${id}`);
        const data = await res.json();
        if (data.success) {
          setComments(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch comments", error);
      }
    };

    const checkFavoriteStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("/api/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const favorites = response.data.favorites || [];
        setIsFavorite(favorites.some((fav) => fav._id === id));
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    fetchRecipe();
    fetchComments();
    checkFavoriteStatus();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to add a comment");
      return;
    }

    try {
      const response = await axios.post(
        "/api/comments",
        { recipeId: id, text: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setComments((prev) => [...prev, response.data.data]);
        setNewComment("");
      }
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  const handleReaction = async (reactionType) => {
    setReaction(reactionType);
    // Implement backend logic if needed to save the reaction
  };

  const handleFavorite = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to favorite a recipe");
        return;
      }

      const method = isFavorite ? "delete" : "post";
      const url = isFavorite ? `/api/favorites?id=${id}` : "/api/favorites";

      const response = await axios({
        method,
        url,
        data: { recipeId: id },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setIsFavorite(!isFavorite);
        alert(response.data.message);
      } else {
        throw new Error("Failed to update favorite status");
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
      alert("Failed to update favorite status. Please try again.");
    }
  };

  const renderInstructions = (instructions: string | undefined) => {
    if (!instructions) return null;
    return instructions.split("\n").map((step, index) => (
      <li key={index} className="mb-2">
        {step.trim()}
      </li>
    ));
  };

  const renderIngredients = (ingredients: string | undefined) => {
    if (!ingredients) return null;
    return ingredients
      .split("\n")
      .map((ingredient, index) => <li key={index}>{ingredient.trim()}</li>);
  };

  const renderComments = (comments) => {
    return comments.map((comment) => (
      <div key={comment._id} className="bg-gray-100 p-4 rounded-lg mb-4">
        <p className="text-gray-800">{comment.text}</p>
        <p className="text-sm text-gray-600 mt-2">
          Posted by {comment.userId?.name || "Anonymous"} on{" "}
          {new Date(comment.createdAt).toLocaleDateString()}
        </p>
      </div>
    ));
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6">
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 bg-red-100 border border-red-400 rounded p-4">
            {error}
          </div>
        ) : recipe ? (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="relative">
              {recipe.imageUrl && (
                <Image
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  width={1200}
                  height={800}
                  className="w-full h-64 sm:h-96 object-cover"
                />
              )}
              <div className="absolute top-0 right-0 m-4">
                <button
                  onClick={handleFavorite}
                  className={`p-2 rounded-full ${
                    isFavorite
                      ? "bg-pink-500 text-white"
                      : "bg-white text-pink-500"
                  } hover:bg-pink-600 hover:text-white transition duration-300`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-4 text-gray-800">
                {recipe.title}
              </h1>
              <p className="text-gray-600 mb-6">{recipe.description}</p>

              <h2 className="text-2xl font-bold mb-2 text-gray-800">
                Ingredients
              </h2>
              <ul className="list-disc list-inside mb-6 text-gray-700">
                {renderIngredients(recipe.ingredients)}
              </ul>

              <h2 className="text-2xl font-bold mb-2 text-gray-800">
                Instructions
              </h2>
              <ol className="list-decimal list-inside mb-6 text-gray-700">
                {renderInstructions(recipe.instructions)}
              </ol>

              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  Reactions
                </h2>
                <div className="flex space-x-4">
                  {["cant_wait", "cooked_banged", "cooked_dislike"].map(
                    (reactionType) => (
                      <button
                        key={reactionType}
                        onClick={() => handleReaction(reactionType)}
                        className={`px-4 py-2 rounded-lg ${
                          reaction === reactionType
                            ? "bg-pink-500 text-white"
                            : "bg-gray-200 text-gray-800"
                        } hover:bg-pink-600 hover:text-white transition duration-300`}
                      >
                        {reactionType.replace("_", " ")}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  Comments
                </h2>
                {comments.length > 0 ? (
                  renderComments(comments)
                ) : (
                  <p className="text-gray-600">
                    No comments yet. Be the first to comment!
                  </p>
                )}

                <form onSubmit={handleAddComment} className="mt-6">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                    rows={3}
                    placeholder="Add a comment..."
                    required
                  ></textarea>
                  <button
                    type="submit"
                    className="mt-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition duration-300"
                  >
                    Add Comment
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
