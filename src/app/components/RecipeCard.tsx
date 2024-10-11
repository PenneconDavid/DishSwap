import Link from "next/link";
import fallbackImage from "../images/logo1.png";
import { useState } from "react";

interface RecipeCardProps {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
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

  const handleFavoriteClick = () => {
    setFavorite(!favorite);
    if (onFavoriteToggle) {
      onFavoriteToggle(_id);
    }
  };

  return (
    <div className="block">
      <Link href={`/recipe/${_id}`}>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer">
          <img
            src={typeof imageUrl === "string" ? imageUrl : fallbackImage.src}
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
