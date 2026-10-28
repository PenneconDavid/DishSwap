"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import axios from "axios";
import Image from "next/image";

interface Favorite {
  _id: string;
  // Add other properties if needed
}

interface Recipe {
  _id: string;
  title: string;
  description: string;
  ingredients: string;
  instructions: string;
  imageUrl?: string;
}

interface Comment {
  _id: string;
  text: string;
  userId: {
    name: string;
    _id: string;
  };
  createdAt: string;
}

export default function RecipeView() {
  const params = useParams();
  const id = params?.id as string | undefined;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [reaction, setReaction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({
    Cant_wait: 0,
    Loved_it: 0,
    Disliked: 0,
  });

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

        // Fetch recipe
        const recipeRes = await axios.get(`${apiUrl}/api/recipes/${id}`);
        if (recipeRes.data.success) {
          setRecipe(recipeRes.data.data);
        }

        // Fetch comments
        const commentsRes = await axios.get(`${apiUrl}/api/comments`, {
          params: { recipeId: id },
        });
        if (commentsRes.data.success) {
          setComments(commentsRes.data.data);
        }

        // Fetch reactions
        const reactionsRes = await axios.get(
          `${apiUrl}/api/recipes/${id}/reactions`
        );
        if (reactionsRes.data.success) {
          setReactionCounts(reactionsRes.data.data);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load recipe data");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to comment");
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const response = await axios.post(
        `${apiUrl}/api/comments`,
        { recipeId: id, text: newComment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        const commentsResponse = await axios.get(`${apiUrl}/api/comments`, {
          params: { recipeId: id },
        });

        if (commentsResponse.data.success) {
          setComments(commentsResponse.data.data);
          setNewComment("");
        }
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
      alert("Failed to add comment. Please try again.");
    }
  };

  const handleReaction = async (reactionType: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to react to recipes");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const response = await axios.post(
        `${apiUrl}/api/recipes/${id}/reactions`,
        { reactionType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setReaction(reactionType);
        // Update the reaction count
        setReactionCounts((prev) => ({
          ...prev,
          [reactionType]: (prev[reactionType] || 0) + 1,
        }));
      }
    } catch (error) {
      console.error("Error setting reaction:", error);
      alert("Failed to save reaction. Please try again.");
    }
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

  const renderIngredients = (ingredients: string | undefined) => {
    if (!ingredients) return null;
    return ingredients.split("\n").map((ingredient, index) => (
      <li key={index} className="flex items-center gap-2">
        <span className="text-coral">•</span>
        {ingredient.trim()}
      </li>
    ));
  };

  const renderInstructions = (instructions: string | undefined) => {
    if (!instructions) return null;
    return instructions.split("\n").map((instruction, index) => (
      <li key={index} className="flex gap-4">
        <span
          className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-custom 
            flex items-center justify-center text-white font-medium"
        >
          {index + 1}
        </span>
        <p>{instruction.trim()}</p>
      </li>
    ));
  };

  const renderComments = (comments: Comment[]) => {
    return (
      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm
              border border-gray-100 dark:border-gray-700"
          >
            <p className="text-gray-800 dark:text-cream/90 mb-3">
              {comment.text}
            </p>
            <div className="flex items-center text-sm text-gray-500 dark:text-cream/60">
              <span className="font-medium">
                {comment.userId?.name || "Anonymous"}
              </span>
              <span className="mx-2">•</span>
              <time>
                {new Date(comment.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-between">
        <Header />
        <main className="flex-grow container mx-auto p-4 sm:p-6">
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-between">
        <Header />
        <main className="flex-grow container mx-auto p-4 sm:p-6">
          <div className="text-center text-red-500 bg-red-100 border border-red-400 rounded p-4">
            {error}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!recipe) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 pt-24 pb-12">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden">
          <div className="relative">
            {recipe.imageUrl && (
              <div className="relative h-[400px]">
                <Image
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                  priority={true}
                  sizes="(max-width: 768px) 100vw, 768px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            )}
            <button
              onClick={handleFavorite}
              className={`absolute top-4 right-4 p-3 rounded-full shadow-lg backdrop-blur-sm
                ${
                  isFavorite
                    ? "bg-pink-500/90 text-white"
                    : "bg-white/90 text-pink-500"
                } hover:scale-110 transition-all duration-300`}
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
          <div className="p-8">
            <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-cream">
              {recipe.title}
            </h1>

            <p className="text-lg text-gray-600 dark:text-cream/80 mb-8 leading-relaxed">
              {recipe.description}
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-cream flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-coral"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Ingredients
                </h2>
                <ul className="space-y-2 text-gray-700 dark:text-cream/90">
                  {renderIngredients(recipe.ingredients)}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-cream flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-coral"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  Instructions
                </h2>
                <ol className="space-y-4 text-gray-700 dark:text-cream/90">
                  {renderInstructions(recipe.instructions)}
                </ol>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-cream">
                What did you think?
              </h2>
              <div className="flex flex-wrap gap-4">
                {[
                  { type: "Cant_wait", icon: "🤤", label: "Can't Wait!" },
                  { type: "Loved_it", icon: "😋", label: "Loved it!" },
                  { type: "Disliked", icon: "😕", label: "Not for me" },
                ].map(({ type, icon, label }) => (
                  <button
                    key={type}
                    onClick={() => handleReaction(type)}
                    className={`px-6 py-3 rounded-full flex items-center gap-2
                      ${
                        reaction === type
                          ? "bg-gradient-custom text-white shadow-lg"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-cream"
                      } hover:scale-105 transition-all duration-300`}
                  >
                    <span className="text-xl">{icon}</span>
                    <span>{label}</span>
                    {reactionCounts[type] > 0 && (
                      <span className="ml-2 px-2 py-1 bg-black/10 dark:bg-white/10 rounded-full text-sm">
                        {reactionCounts[type]}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-cream">
                Comments
              </h2>

              <div className="space-y-6 mb-8">
                {comments.length > 0 ? (
                  renderComments(comments)
                ) : (
                  <p className="text-center py-8 text-gray-500 dark:text-cream/60">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>

              <form onSubmit={handleAddComment} className="mt-8">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-4 border border-gray-200 dark:border-gray-600 
                    rounded-xl focus:ring-2 focus:ring-coral dark:bg-gray-700 
                    dark:text-cream resize-none transition-all duration-300"
                  rows={4}
                  placeholder="Share your thoughts..."
                  required
                />
                <button
                  type="submit"
                  className="mt-4 px-6 py-3 bg-gradient-custom text-white rounded-xl
                    hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  Post Comment
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
