import "./globals.css";

export const metadata = {
  title: "DishSwap",
  description: "Share your favorite recipes with friends",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="animate-gradient bg-gradient-to-r from-yellow-500 via-purple-500 to-red-500">
        <main className="pt-20">{children}</main>
      </body>
    </html>
  );
}
