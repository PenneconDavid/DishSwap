import Header from "./components/Header";
import Footer from "./components/Footer";
import RecipeCard from "./components/RecipeCard";

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
            imageUrl="https://a.storyblok.com/f/178900/638x358/623d44a3df/226e72a951ed89da81d3964faad79d891519874548_full.jpg/m/638x358"
          />
          <RecipeCard
            title="Teriyaki Chicken"
            description="Sweet and savory chicken perfect for any meal."
            imageUrl="https://130333835.cdn6.editmysite.com/uploads/1/3/0/3/130333835/s421215818104494102_p140_i1_w400.png?width=2400&optimize=medium"
          />
          <RecipeCard
            title="Sushi Rolls"
            description="Simple and fresh sushi rolls to impress your friends."
            imageUrl="https://img.freepik.com/premium-photo/delicious-japanese-sushi-roll-asian-food-anime-style-digital-painting-illustration_768540-724.jpg?w=1380"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
