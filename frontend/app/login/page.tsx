"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import api from "@/lib/axios";

// Zod schema from lecture reference
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");

    // Validate with Zod
    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      // Axios POST request
      const response = await api.post("/patient/auth/login", result.data);
      const data = response.data;

      if (data?.accessToken) {
        localStorage.setItem("token", data.accessToken);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        router.push("/dashboard");
      } else {
        setError("Login failed. No access token returned.");
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        "Invalid email or password. Please try again.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded border border-gray-300">
        <div className="text-center mb-6">
          <div className="w-10 h-10 mx-auto rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xl mb-2">
            +
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Sign in to Patient Portal</h2>
          <p className="text-xs text-gray-500 mt-1">Access your doctor visits, appointments & records</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. rahim@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium text-sm transition-colors mt-2"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          New to CarePoint Hospital?{" "}
          <Link href="/register" className="text-blue-600 font-medium hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
