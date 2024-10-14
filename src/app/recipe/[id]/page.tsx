"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import axios from "axios";

export default function RecipeView() {
  const params = useParams();
  const id = params.id;

  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [reaction, setReaction] = useState(null);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
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
    }
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

  if (loading) {
    return <div>Loading recipe...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
        {recipe.imageUrl && (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        )}
        <button
          onClick={handleFavorite}
          className={`px-4 py-2 rounded-lg ${
            isFavorite ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        </button>
        <p className="text-gray-700 text-lg mb-6">{recipe.description}</p>
        <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
        <p>{recipe.ingredients}</p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Comments</h2>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="bg-gray-100 p-4 rounded-lg mb-4">
              <p>{comment.text}</p>
            </div>
          ))
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}

        <form onSubmit={handleAddComment} className="mt-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded-lg"
            rows={3}
            placeholder="Add a comment..."
            required
          ></textarea>
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-pink-400 text-white rounded-lg"
          >
            Add Comment
          </button>
        </form>

        <h2 className="text-2xl font-bold mt-8 mb-4">Reactions</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => handleReaction("cant_wait")}
            className={`px-4 py-2 rounded-lg ${
              reaction === "cant_wait"
                ? "bg-green-400 text-white"
                : "bg-gray-200"
            }`}
          >
            Can’t wait to try it
          </button>
          <button
            onClick={() => handleReaction("cooked_banged")}
            className={`px-4 py-2 rounded-lg ${
              reaction === "cooked_banged"
                ? "bg-green-400 text-white"
                : "bg-gray-200"
            }`}
          >
            Cooked it and will again
          </button>
          <button
            onClick={() => handleReaction("cooked_dislike")}
            className={`px-4 py-2 rounded-lg ${
              reaction === "cooked_dislike"
                ? "bg-green-400 text-white"
                : "bg-gray-200"
            }`}
          >
            Cooked and Wish I Didn’t
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
