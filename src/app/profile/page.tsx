import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-grow container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Profile</h1>
        <p className="text-lg text-gray-700">
          Welcome to your profile page! This section will show your personal
          information and the recipes you’ve contributed.
        </p>
      </main>
      <Footer />
    </div>
  );
}
