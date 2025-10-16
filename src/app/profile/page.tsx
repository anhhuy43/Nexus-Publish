"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { api } from "@/lib/api";
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
  googleId?: string;
  createdAt: string;
  updatedAt: string;
}

type ProfileResp = { user: User };

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, [router]);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get<ProfileResp>("/user/profile");
      console.log("🚀 ~ fetchProfile ~ data:", data);
      setUser(data.user);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          router.push("/login");
          return;
        }
        setError(
          (err.response?.data as any)?.message ?? err.message ?? "Unknown error"
        );
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <p className="mt-1 text-lg text-gray-900">{user?.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="mt-1 text-lg text-gray-900">{user?.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Account Type
                </label>
                <div className="mt-1">
                  {user?.googleId ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Google Account
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Email Account
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Member Since
                </label>
                <p className="mt-1 text-lg text-gray-900">
                  {new Date(user?.createdAt || "").toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
