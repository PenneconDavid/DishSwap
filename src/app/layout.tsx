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
      <body>{children}</body>
    </html>
  );
}
