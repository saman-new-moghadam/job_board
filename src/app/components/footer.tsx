import Link from "next/link";
import { Logout } from "./LogoutButton";
import { getAuthenticatedUser } from "@/utility/auth";

const Footer = async () => {
  const user = await getAuthenticatedUser();
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="custom-container px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-5">
        <Link href="/" className="text-xl font-extrabold text-slate-900">
          Job<span className="text-blue-600">Board</span>
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
          <Link href="/jobs" className="hover:text-blue-600 transition-colors">
            Find Jobs
          </Link>
          {!user && (
            <>
              <Link
                href="/login"
                className="hover:text-blue-600 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="hover:text-blue-600 transition-colors"
              >
                Register
              </Link>
            </>
          )}
          <Link
            href="/employer_panel"
            className="hover:text-blue-600 transition-colors"
          >
            For Employers
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400">
            © {new Date().getFullYear()} JobBoard
          </span>
          {user && <Logout />}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
