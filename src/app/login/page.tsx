// src/app/login/page.tsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { loginSchema } from "~/schemas/auth";
import type { LoginSchema } from "~/schemas/auth";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginSchema) {
    try {
      setLoading(true);
      const signInResult = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (!signInResult?.error) {
        router.push("/");
      } else {
        setError(
          signInResult.error === "CredentialsSignin"
            ? "Invalid email or password"
            : "Something went wrong"
        );
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#0f0c29] via-[#302b63] to-[#24243e] flex flex-col">
      <nav className="flex h-16 items-center justify-between px-10 text-white">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-black font-bold">
            SA
          </div>
          <span className="text-lg font-semibold tracking-wide">
            Sentiment AI
          </span>
        </div>
      </nav>

      <main className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md rounded-2xl bg-white/10 p-8 backdrop-blur-md shadow-lg border border-white/20">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-300">
              Sign in to your Sentiment AI account
            </p>
          </div>

          <form
            className="mt-8 space-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {error && (
              <div className="rounded-md bg-red-500/10 p-4 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white">
                  Email address
                </label>
                <input
                  {...form.register("email")}
                  type="email"
                  placeholder="you@example.com"
                  className="mt-1 block w-full rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder-gray-400 backdrop-blur focus:border-white focus:ring-2 focus:ring-white focus:outline-none"
                />
                {form.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-400">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-white">
                  Password
                </label>
                <input
                  {...form.register("password")}
                  type="password"
                  placeholder="********"
                  className="mt-1 block w-full rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder-gray-400 backdrop-blur focus:border-white focus:ring-2 focus:ring-white focus:outline-none"
                />
                {form.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-400">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>

            <p className="text-center text-sm text-gray-300">
              Don’t have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-white hover:underline"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
