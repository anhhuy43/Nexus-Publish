"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data } = await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      console.log("Sign up succesfully!", data);

      router.push("/login");
    } catch (err: any) {
      console.error("Register Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-stretch text-white">
      <div
        className="lg:flex w-1/2 hidden bg-gray-500 bg-no-repeat bg-cover relative items-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1577495508048-b635879837f1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80')",
        }}
      >
        <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
        <div className="w-full px-24 z-10">
          <h1 className="text-5xl font-bold text-left tracking-wide">
            Nexus Publish
          </h1>
          <p className="text-3xl my-4">Join Our Content Platform.</p>
        </div>
      </div>

      <div
        className="lg:w-1/2 w-full flex items-center justify-center text-center md:px-16 px-0 z-0"
        style={{ backgroundColor: "#161616" }}
      >
        <div
          className="absolute lg:hidden z-10 inset-0 bg-gray-500 bg-no-repeat bg-cover items-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1577495508048-b635879837f1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80')",
          }}
        >
          <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
        </div>

        <div className="w-full py-6 z-20">
          <h1 className="my-2 text-3xl font-bold">SIGN UP</h1>

          {error && (
            <div className="bg-red-500 text-white p-3 rounded mb-4 mx-4">
              {error}
            </div>
          )}

          <form
            onSubmit={handleRegister}
            className="sm:w-2/3 w-full px-4 lg:px-0 mx-auto"
          >
            <div className="pb-2 pt-4">
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={loading}
                className="block w-full p-4 text-lg rounded-sm bg-black disabled:opacity-50"
                required
              />
            </div>

            <div className="pb-2 pt-4">
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={loading}
                className="block w-full p-4 text-lg rounded-sm bg-black disabled:opacity-50"
                required
              />
            </div>

            <div className="pb-2 pt-4">
              <input
                className="block w-full p-4 text-lg rounded-sm bg-black disabled:opacity-50"
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
            </div>

            <div className="pb-2 pt-4">
              <input
                className="block w-full p-4 text-lg rounded-sm bg-black disabled:opacity-50"
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
            </div>

            <div className="px-4 pb-2 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="uppercase block w-full p-4 text-lg rounded-full bg-green-500 hover:bg-green-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "sign up"}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="pt-4">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-indigo-400 hover:text-indigo-300 underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
