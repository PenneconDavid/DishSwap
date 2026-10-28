import "./globals.css";
import { Inter } from "next/font/google";
import BackToTop from "./components/BackToTop";

// Initialize the Inter font
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DishSwap",
  description: "Share your favorite recipes with friends",
  keywords: "recipes, cooking, food sharing, community cooking",
  openGraph: {
    title: "DishSwap",
    description: "Share your favorite recipes with friends",
    images: ["/images/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body
        className={`
        min-h-screen
        bg-[#F4ECDF] dark:bg-gray-900
        text-gray-900 dark:text-[#F4ECDF]
        antialiased
        relative
        overflow-x-hidden
        selection:bg-pink-500
        selection:text-white
        transition-colors duration-300
        grain-texture
      `}
      >
        <main className="relative pt-10">{children}</main>
        <BackToTop />
      </body>
    </html>
  );
}
