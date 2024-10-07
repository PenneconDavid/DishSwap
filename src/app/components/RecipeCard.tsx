import Link from "next/link";

interface RecipeCardProps {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  _id,
  title,
  description,
  imageUrl,
}) => {
  return (
    <Link href={`/recipe/${_id}`} className="block">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <img
          src={imageUrl || "/placeholder.png"}
          alt={title}
          className="object-cover w-full h-48 rounded-lg"
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
