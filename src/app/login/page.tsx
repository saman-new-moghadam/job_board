import { getAuthenticatedUser } from "@/utility/auth";
import LoginComponent from "../components/login/login";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Log in to your Job Board account to explore job opportunities, manage applications, and connect with employers.",

  robots: {
    index: false,
    follow: false,
  },

  openGraph: {
    title: "Login | Job Board",
    description: "Log in to your Job Board account.",
    url: "/login",
  },
};

const LoginPage = async () => {
  const user = await getAuthenticatedUser();
  if (user) {
    redirect("/");
  }
  return <LoginComponent />;
};

export default LoginPage;
