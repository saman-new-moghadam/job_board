import { getAuthenticatedUser } from "@/utility/auth";
import RegisterComponent from "../components/register/register";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Create your Job Board account to discover career opportunities, apply for jobs, and connect with employers.",

  robots: {
    index: false,
    follow: false,
  },

  openGraph: {
    title: "Create Account | Job Board",
    description:
      "Join Job Board and take the next step in your career.",
    url: "/register",
  },
};

const RegisterPage = async () => {
  const user = await getAuthenticatedUser();
  if (user) {
    redirect("/");
  }
  return <RegisterComponent />;
};

export default RegisterPage;
