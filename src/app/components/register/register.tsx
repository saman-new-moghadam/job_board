"use client";

import { registerZodSchema } from "@/lib/validations/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitEvent, useState } from "react";

const RegisterComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("JOB_SEEKER");
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);

    const result = registerZodSchema.safeParse({
      email,
      password,
      firstName,
      lastName,
      role,
    });

    if (!result.success) {
      setErrors(result.error.issues.map((issue) => issue.message));
      return;
    }

    if (password !== passwordAgain) {
      setErrors(["Passwords do not match."]);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(result.data),
        headers: {
          "content-type": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        setErrors([data.error || "Something went wrong"]);
        return;
      }

      router.push("/login");
    } catch {
      setErrors(["Unable to connect. Please try again."]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-5">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/60 overflow-hidden grid grid-cols-1 lg:grid-cols-2">

        <section className="flex flex-col justify-center px-7 py-10 sm:px-12 lg:px-14">
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight text-slate-900 mb-9"
          >
            Job<span className="text-blue-600">Board</span>
          </Link>

          <div className="max-w-md w-full mx-auto">
            <div className="mb-7">
              <p className="text-sm font-semibold text-blue-600 mb-3">
                GET STARTED
              </p>

              <h1 className="text-3xl font-extrabold text-slate-900">
                Create your account
              </h1>

              <p className="text-sm text-slate-500 mt-3 leading-6">
                Join JobBoard and take the next step in your professional
                journey.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="firstName"
                    className="text-sm font-semibold text-slate-700"
                  >
                    First name
                  </label>

                  <input
                    id="firstName"
                    className="w-full outline-none border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 p-3 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 transition-all"
                    onChange={(e) => setFirstName(e.currentTarget.value)}
                    value={firstName}
                    name="firstName"
                    type="text"
                    placeholder="John"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="lastName"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Last name
                  </label>

                  <input
                    id="lastName"
                    className="w-full outline-none border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 p-3 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 transition-all"
                    onChange={(e) => setLastName(e.currentTarget.value)}
                    value={lastName}
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  className="w-full outline-none border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 p-3 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 transition-all"
                  onChange={(e) => setEmail(e.currentTarget.value)}
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
                  className="w-full outline-none border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 p-3 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 transition-all"
                  onChange={(e) => setPassword(e.currentTarget.value)}
                  value={password}
                  name="password"
                  type="password"
                  placeholder="Create a password"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-semibold text-slate-700"
                >
                  Confirm password
                </label>

                <input
                  id="confirmPassword"
                  className="w-full outline-none border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 p-3 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 transition-all"
                  onChange={(e) => setPasswordAgain(e.currentTarget.value)}
                  value={passwordAgain}
                  name="confirmPassword"
                  type="password"
                  placeholder="Repeat your password"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="role"
                  className="text-sm font-semibold text-slate-700"
                >
                  I want to join as
                </label>

                <select
                  id="role"
                  className="w-full outline-none border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 p-3 rounded-xl text-sm text-slate-700 transition-all cursor-pointer"
                  value={role}
                  onChange={(e) => setRole(e.currentTarget.value)}
                  name="role"
                >
                  <option value="JOB_SEEKER">Job Seeker</option>
                  <option value="EMPLOYER">Employer</option>
                </select>
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
                {isLoading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-7 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                href="/login"
              >
                Sign in
              </Link>
            </div>

            <p className="text-xs text-slate-400 text-center mt-6 leading-6">
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
              Build your future.
              <span className="text-blue-400"> Find your place.</span>
            </h2>

            <p className="text-slate-300 leading-8 mt-6 max-w-sm">
              Whether you are looking for your next opportunity or searching
              for great talent, JobBoard helps you make the right connection.
            </p>
          </div>

          <div className="relative space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center text-xl">
                  ↗
                </div>

                <div>
                  <p className="text-white font-semibold text-sm">
                    For Job Seekers
                  </p>
                  <p className="text-slate-400 text-xs mt-1">
                    Discover jobs and grow your career.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xl">
                  ◎
                </div>

                <div>
                  <p className="text-white font-semibold text-sm">
                    For Employers
                  </p>
                  <p className="text-slate-400 text-xs mt-1">
                    Find talented people for your team.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="relative text-xs text-slate-500 mt-8">
            © {new Date().getFullYear()} JobBoard. All rights reserved.
          </p>
        </section>
      </div>
    </main>
  );
};

export default RegisterComponent;
