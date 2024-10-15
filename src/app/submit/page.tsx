import dynamic from "next/dynamic";

const RecipeForm = dynamic(() => import("../components/RecipeForm"), {
  ssr: false,
});
const Header = dynamic(() => import("../components/Header"), { ssr: false });
const Footer = dynamic(() => import("../components/Footer"), { ssr: false });

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
