"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import fallbackImage from "../../../public/images/logo1.png";

interface RecipeCardProps {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string; // Make imageUrl optional
  isFavorite?: boolean;
  onFavoriteToggle?: (_id: string) => void;
  cookingTime?: string;
  difficulty?: string;
  onClick?: () => void; // Add this line
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  _id,
  title,
  description,
  imageUrl,
  isFavorite = false,
  onFavoriteToggle,
  cookingTime,
  difficulty,
  onClick, // Add this line
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(_id);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick} // Add this line
    >
      <Link href={`/recipe/${_id}`}>
        <div className="relative">
          <Image
            src={imageUrl || fallbackImage}
            alt={title}
            width={400}
            height={300}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="w-full h-48 object-cover"
            priority={false}
          />
          <div
            className={`absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <p className="text-white text-center p-4 h-full flex items-center justify-center">
              {description}
            </p>
          </div>
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md transition-transform duration-300 hover:scale-110"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 ${
                isFavorite ? "text-red-500" : "text-gray-400"
              }`}
              fill={isFavorite ? "currentColor" : "none"}
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
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
          <div className="flex justify-between text-sm text-gray-600">
            {cookingTime && (
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                {cookingTime}
              </span>
            )}
            {difficulty && (
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {difficulty}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default RecipeCard;
