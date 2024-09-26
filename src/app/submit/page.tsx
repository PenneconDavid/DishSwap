import RecipeForm from "../components/RecipeForm";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function SubmitRecipePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col justify-center">
        <RecipeForm />
      </main>
      <Footer />
    </div>
  );
}
