import "./globals.css";
import { Inter } from "next/font/google";

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
        bg-gradient-to-r from-yellow-500 via-purple-500 to-red-500
        bg-[length:400%_400%]
        animate-gradient
        antialiased
        relative
        overflow-x-hidden
        selection:bg-pink-500
        selection:text-white
      `}
      >
        <div className="fixed inset-0 bg-gradient-to-r from-yellow-500/30 via-purple-500/30 to-red-500/30 pointer-events-none" />
        <main className="relative pt-10">{children}</main>
      </body>
    </html>
  );
}
