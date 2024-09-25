import Header from "../../components/Header";
import Footer from "../../components/Footer";
import RecipeCard from "../../components/RecipeCard";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <main className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Welcome to DishSwap 🍜
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example Recipe Cards */}
          <RecipeCard
            title="Spicy Ramen"
            description="A delicious and fiery ramen recipe."
            imageUrl="https://example.com/spicy-ramen.jpg"
          />
          <RecipeCard
            title="Teriyaki Chicken"
            description="Sweet and savory chicken perfect for any meal."
            imageUrl="https://example.com/teriyaki-chicken.jpg"
          />
          <RecipeCard
            title="Sushi Rolls"
            description="Simple and fresh sushi rolls to impress your friends."
            imageUrl="https://example.com/sushi-rolls.jpg"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
