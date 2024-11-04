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
        bg-[#F4ECDF]
        antialiased
        relative
        overflow-x-hidden
        selection:bg-pink-500
        selection:text-white
      `}
      >
        <main className="relative pt-10">{children}</main>
      </body>
    </html>
  );
}
