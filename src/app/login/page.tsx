"use client";

import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic (we'll add API logic later)
    console.log("Logging in with:", { email, password });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-grow container mx-auto p-6 flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-lg space-y-4 max-w-lg w-full"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Login to Your Account
          </h2>

          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400"
              placeholder="Enter your email"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-pink-400 to-yellow-500 text-white rounded-lg hover:shadow-xl transform hover:scale-105 transition duration-300"
          >
            Login
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
