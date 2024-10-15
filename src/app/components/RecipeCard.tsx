// Updated RecipeCard.tsx to handle consistent image URL processing
import Link from "next/link";
import fallbackImage from "../images/logo1.png";
import { useState } from "react";
import axios from "axios";

interface RecipeCardProps {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string; // Make imageUrl optional
  isFavorite?: boolean;
  onFavoriteToggle?: (_id: string) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  _id,
  title,
  description,
  imageUrl,
  isFavorite = false,
  onFavoriteToggle,
}) => {
  const [favorite, setFavorite] = useState(isFavorite);

  const handleFavoriteClick = async () => {
    setFavorite(!favorite);

    try {
      const action = favorite ? "remove" : "add";
      await axios.patch("/api/recipes", { recipeId: _id, action });
      if (onFavoriteToggle) {
        onFavoriteToggle(_id);
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
      // Revert back the favorite state in case of an error
      setFavorite(!favorite);
    }
  };

  const getImageSrc = (url?: string) => {
    return url && typeof url === "string" ? url : fallbackImage.src;
  };

  return (
    <div className="block">
      <Link href={`/recipe/${_id}`}>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer">
          <img
            src={getImageSrc(imageUrl)}
            alt={title}
            className="object-cover w-full h-48 rounded-lg"
          />
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
          </div>
        </div>
      </Link>
      <button
        onClick={handleFavoriteClick}
        className={`mt-2 px-4 py-2 rounded ${
          favorite ? "bg-red-500 text-white" : "bg-gray-300 text-black"
        }`}
      >
        {favorite ? "Remove from Favorites" : "Add to Favorites"}
      </button>
    </div>
  );
};

export default RecipeCard;
