import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const RecipeForm = dynamic(() => import("../components/RecipeForm"), {
  ssr: false,
});
const Header = dynamic(() => import("../components/Header"), { ssr: false });
const Footer = dynamic(() => import("../components/Footer"), { ssr: false });

export default function SubmitRecipePage() {
  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-gray-900">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 sm:py-12 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <RecipeForm />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
