"use client";

import { loginZodSchema } from "@/lib/validations/auth";
import Link from "next/link";
import { SubmitEvent, useState } from "react";

const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);

    const result = loginZodSchema.safeParse({ email, password });

    if (!result.success) {
      setErrors(result.error.issues.map((issue) => issue.message));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "post",
        body: JSON.stringify({
          email: result.data.email,
          password: result.data.password,
        }),
        headers: {
          "content-type": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        setErrors([data.error || "Something went wrong"]);
        return;
      }

      window.location.href = "/jobs";
    } catch {
      setErrors(["Unable to connect. Please try again."]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-5">
      <div className="w-full max-w-5xl min-h-[600px] bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/60 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        <section className="flex flex-col justify-center px-7 py-12 sm:px-12 lg:px-14">
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight text-slate-900 mb-12"
          >
            Job<span className="text-blue-600">Board</span>
          </Link>

          <div className="max-w-md w-full mx-auto">
            <div className="mb-8">
              <p className="text-sm font-semibold text-blue-600 mb-3">
                WELCOME BACK
              </p>

              <h1 className="text-3xl font-extrabold text-slate-900">
                Sign in to your account
              </h1>

              <p className="text-sm text-slate-500 mt-3 leading-6">
                Welcome back! Enter your details to access your account and
                continue your career journey.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  className="w-full outline-none border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 p-3.5 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 transition-all"
                  value={email}
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <input
                  id="password"
                  onChange={(e) => setPassword(e.currentTarget.value)}
                  className="w-full outline-none border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 p-3.5 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 transition-all"
                  value={password}
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                />
              </div>

              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                  <ul className="text-sm text-red-600 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold p-3.5 rounded-xl cursor-pointer transition-colors shadow-lg shadow-blue-600/20 mt-2"
                type="submit"
              >
                {isLoading ? "Signing in..." : "Continue"}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
              <p>
                Do not have an account?{" "}
                <Link
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                  href="/register"
                >
                  Sign up
                </Link>
              </p>
            </div>

            <p className="text-xs text-slate-400 text-center mt-8 leading-6">
              By continuing, you agree to our Terms and Privacy Policy.
            </p>
          </div>
        </section>

        <section className="hidden lg:flex relative flex-col justify-between overflow-hidden bg-slate-900 p-12">
          <div className="absolute w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 -top-32 -right-32" />
          <div className="absolute w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-20 -bottom-40 -left-32" />

          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-3xl">
              ✦
            </div>

            <h2 className="text-4xl font-extrabold text-white leading-tight mt-12">
              Your next chapter
              <span className="text-blue-400"> starts here.</span>
            </h2>

            <p className="text-slate-300 leading-8 mt-6 max-w-sm">
              Discover opportunities, connect with employers, and find a role
              where you can make a difference.
            </p>
          </div>

          <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center text-xl">
                ✓
              </div>

              <div>
                <p className="text-white font-semibold text-sm">
                  Start exploring
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  Find opportunities that match your goals
                </p>
              </div>
            </div>

            <Link
              href="/jobs"
              className="flex items-center justify-center gap-2 bg-white text-slate-900 hover:bg-blue-50 font-semibold text-sm p-3 rounded-xl transition-colors"
            >
              Browse available jobs
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <p className="relative text-xs text-slate-500 mt-8">
            © {new Date().getFullYear()} JobBoard. All rights reserved.
          </p>
        </section>
      </div>
    </main>
  );
};

export default LoginComponent;
