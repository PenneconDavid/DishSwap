"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Suspense } from "react";

// Import components with dynamic loading
const RecipeForm = dynamic(() => import("../components/RecipeForm"), {
  ssr: false,
  loading: () => (
    <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
      <div className="animate-pulse space-y-8">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mx-auto"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
});

const Header = dynamic(() => import("../components/Header"), {
  ssr: false,
  loading: () => (
    <div className="h-16 bg-white dark:bg-gray-800 shadow-md animate-pulse"></div>
  ),
});

const Footer = dynamic(() => import("../components/Footer"), {
  ssr: false,
  loading: () => (
    <div className="h-16 bg-white dark:bg-gray-800 shadow-md animate-pulse mt-auto"></div>
  ),
});

export default function SubmitRecipePage() {
  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-gray-900">
      <Suspense
        fallback={
          <div className="h-16 bg-white dark:bg-gray-800 shadow-md animate-pulse"></div>
        }
      >
        <Header />
      </Suspense>

      <main className="flex-grow container mx-auto px-4 py-8 sm:py-12 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Suspense
            fallback={
              <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl animate-pulse">
                <div className="space-y-8">
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mx-auto"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
                  <div className="space-y-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            }
          >
            <RecipeForm />
          </Suspense>
        </motion.div>
      </main>

      <Suspense
        fallback={
          <div className="h-16 bg-white dark:bg-gray-800 shadow-md animate-pulse mt-auto"></div>
        }
      >
        <Footer />
      </Suspense>
    </div>
  );
}
