import { getAuthenticatedUser } from "@/utility/auth";
import RegisterComponent from "../components/register/register";
import { redirect } from "next/navigation";

const RegisterPage = async () => {
  const user = await getAuthenticatedUser();
  if (user) {
    redirect("/");
  }
  return <RegisterComponent />;
};

export default RegisterPage;
