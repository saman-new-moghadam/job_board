"use client";

import "@/app/login/login.css";
import { registerZodSchema } from "@/lib/validations/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitEvent, useState } from "react";
import { FaBasketballBall } from "react-icons/fa";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("JOB_SEEKER");
  const [errors, setErrors] = useState<string[]>([]);

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
      setErrors((prev) => [...prev, "passwords are not same."]);
      return;
    }

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
  };

  return (
    <div className="flex min-h-screen justify-center items-center flex-col">
      <div className="flex justify-center ">
        <FaBasketballBall
          className="basketball-icon-login-register"
          size={45}
          color="#d86ad4"
        />
      </div>
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-xl font-bold mt-5">Welcome to Dribbble</h1>

        <form
          className="mt-10 flex flex-col gap-8 w-100"
          onSubmit={handleSubmit}
        >
          <input
            className="outline-0 border border-gray-200 p-3 rounded-lg"
            onChange={(e) => setEmail(e.currentTarget.value)}
            value={email}
            name="email"
            type="email"
            placeholder="Enter email address"
          />

          <input
            className="outline-0 border border-gray-200 p-3 rounded-lg"
            onChange={(e) => setPassword(e.currentTarget.value)}
            value={password}
            name="password"
            type="password"
            placeholder="Enter your password"
          />
          <input
            className="outline-0 border border-gray-200 p-3 rounded-lg"
            onChange={(e) => setPasswordAgain(e.currentTarget.value)}
            value={passwordAgain}
            name="confirmPassword"
            type="password"
            placeholder="Enter your password"
          />

          <input
            className="outline-0 border border-gray-200 p-3 rounded-lg"
            onChange={(e) => setFirstName(e.currentTarget.value)}
            value={firstName}
            name="firstName"
            type="text"
            placeholder="Enter your first name"
          />

          <input
            className="outline-0 border border-gray-200 p-3 rounded-lg"
            onChange={(e) => setLastName(e.currentTarget.value)}
            value={lastName}
            name="lastName"
            type="text"
            placeholder="Enter your last name"
          />

          <select
            className="outline-0 border border-gray-200 p-3 rounded-lg"
            value={role}
            onChange={(e) => setRole(e.currentTarget.value)}
            name="role"
          >
            <option value="JOB_SEEKER">JOB_SEEKER</option>
            <option value="EMPLOYER">EMPLOYER</option>
          </select>

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
            Already have an account?{" "}
            <Link className="underline underline-offset-2" href="/login">
              Login
            </Link>
          </p>
        </div>

        <ul className="text-red-500">
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RegisterPage;
