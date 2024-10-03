import { useState } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          type: "login",
        }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        router.push("/profile");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login failed", error);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Login</h1>
        <form
          onSubmit={handleLogin}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-pink-400 text-white rounded-lg"
          >
            Login
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
