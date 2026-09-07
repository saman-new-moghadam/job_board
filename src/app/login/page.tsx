"use client";

import "./login.css";
import { loginZodSchema } from "@/lib/validations/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitEvent, useState } from "react";
import { FaBasketballBall } from "react-icons/fa";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const router = useRouter();

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);
    const result = loginZodSchema.safeParse({ email, password });
    if (!result.success) {
      setErrors(result.error.issues.map((issue) => issue.message));
      return;
    }

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

    router.push("/jobs");
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <div className="flex justify-center">
        <FaBasketballBall
          className="basketball-icon-login-register"
          size={45}
          color="#d86ad4"
        />
      </div>
      <div className=" flex flex-col justify-center items-center">
        <h1 className="text-xl font-bold mt-5">Welcome Back</h1>
        <form
          className="mt-10 flex flex-col gap-8 w-100"
          onSubmit={handleSubmit}
        >
          <input
            onChange={(e) => {
              setEmail(e.currentTarget.value);
            }}
            className="outline-0 border border-gray-200 p-3 rounded-lg"
            value={email}
            name="email"
            type="email"
            placeholder="Enter email address"
          />
          <input
            onChange={(e) => {
              setPassword(e.currentTarget.value);
            }}
            className="outline-0 border border-gray-200 p-3 rounded-lg"
            value={password}
            name="password"
            type="password"
            placeholder="Enter your password"
          />
          <button
            className="bg-black text-white p-2 rounded-xl cursor-pointer"
            type="submit"
          >
            Continue
          </button>
        </form>
        <div className="text-sm opacity-40 mt-5">
          <p>By continuing, you agree to our Terms and Privacy Policy.</p>
          <p>
            Do not have an account?{" "}
            <Link className="underline underline-offset-2" href={"/register"}>
              Sign up
            </Link>{" "}
          </p>
        </div>

        <ul className="text-red-500">
          {errors.map((error, index) => {
            return <li key={index}>{error}</li>;
          })}
        </ul>
      </div>
    </div>
  );
};

export default LoginPage;
