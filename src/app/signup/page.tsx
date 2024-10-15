"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("/api/users", {
        name,
        email,
        password,
        type: "register",
      });

      if (response.data.success) {
        // Store the token in localStorage
        localStorage.setItem("token", response.data.token);
        // Redirect to the profile page or home page
        router.push("/profile");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "An error occurred during sign up."
      );
    }
  };

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    setPasswordStrength(strength);
  };

  useEffect(() => {
    checkPasswordStrength(password);
  }, [password]);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Sign Up
        </h1>
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto p-8 rounded-lg shadow-md"
        >
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 font-bold mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6 relative">
            <label
              htmlFor="password"
              className="block text-gray-700 font-bold mb-2"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Password strength:</span>
              <span className="text-sm font-semibold text-gray-700">
                {passwordStrength === 0 && "Weak"}
                {passwordStrength === 1 && "Fair"}
                {passwordStrength === 2 && "Good"}
                {passwordStrength === 3 && "Strong"}
                {passwordStrength === 4 && "Very Strong"}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  passwordStrength === 0
                    ? "bg-red-500"
                    : passwordStrength === 1
                    ? "bg-orange-500"
                    : passwordStrength === 2
                    ? "bg-yellow-500"
                    : passwordStrength === 3
                    ? "bg-green-500"
                    : "bg-blue-500"
                }`}
                style={{ width: `${passwordStrength * 25}%` }}
              ></div>
            </div>
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-pink-400 text-white rounded-lg hover:bg-pink-500 font-bold py-2 px-4 focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-yellow-300 hover:underline text-xl"
          >
            Log in here
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
