import { getAuthenticatedUser } from "@/utility/auth";
import LoginComponent from "../components/login/login";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const user = await getAuthenticatedUser();
  if (user) {
    redirect("/");
  }
  return <LoginComponent />;
};

export default LoginPage;
