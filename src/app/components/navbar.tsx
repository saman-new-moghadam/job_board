import { getAuthenticatedUser } from "@/utility/auth";
import Link from "next/link";

const Navbar = async () => {
  const user = await getAuthenticatedUser();
  const role = user?.role;

  function renderRole() {
    if (role) {
      return role === "EMPLOYER" ? (
        <Link
          href="/employer_panel"
          className="hover:text-blue-600 transition-colors"
        >
          Employer Panel
        </Link>
      ) : (
        <Link
          href="/applicant_panel"
          className="hover:text-blue-600 transition-colors"
        >
          Applicant Panel
        </Link>
      );
    }
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="custom-container px-5 flex items-center justify-between h-20">
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight text-slate-900"
        >
          Job<span className="text-blue-600">Board</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="/jobs" className="hover:text-blue-600 transition-colors">
            Find Jobs
          </Link>
          {renderRole()}
        </nav>

        <div className="flex items-center gap-3">
          {!user && (
            <>
              <Link
                href="/login"
                className="hidden sm:block text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
              >
                Log in
              </Link>

              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
