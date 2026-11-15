import { getAuthenticatedUser } from "@/utility/auth";
import Link from "next/link";

export default async function Home() {
  const user = await getAuthenticatedUser();
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50" />

        <div className="custom-container px-5 relative py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 rounded-full px-4 py-2 text-sm font-medium mb-7">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                Your next opportunity starts here
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
                Find a job that
                <span className="text-blue-600"> moves you forward.</span>
              </h1>

              <p className="mt-6 text-base sm:text-lg text-slate-500 leading-8 max-w-xl">
                Discover opportunities that match your skills and ambitions.
                Connect with employers and take the next step in your career.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mt-9">
                <Link
                  href="/jobs"
                  className="inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5"
                >
                  Explore Jobs
                  <span aria-hidden="true">→</span>
                </Link>

                {!user && (
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center bg-white hover:bg-slate-100 text-slate-700 font-semibold px-7 py-4 rounded-xl border border-slate-200 transition-colors"
                  >
                    Create an Account
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-4 mt-10 text-sm text-slate-500">
                <div className="flex -space-x-2">
                  <div className="w-9 h-9 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-blue-700 font-bold">
                    J
                  </div>
                  <div className="w-9 h-9 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-indigo-700 font-bold">
                    C
                  </div>
                  <div className="w-9 h-9 rounded-full bg-sky-100 border-2 border-white flex items-center justify-center text-sky-700 font-bold">
                    W
                  </div>
                </div>
                <span>Find your next career opportunity</span>
              </div>
            </div>

            <div className="relative max-w-lg w-full mx-auto">
              <div className="absolute inset-0 bg-blue-200 rounded-[2rem] rotate-3 opacity-40" />

              <div className="relative bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 shadow-2xl shadow-slate-200/70">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-sm text-slate-400 font-medium">
                      Discover opportunities
                    </p>
                    <h2 className="text-xl font-bold text-slate-900 mt-1">
                      Featured Jobs
                    </h2>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
                    ✦
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border border-slate-200 rounded-2xl p-4 hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                        D
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900">
                          Frontend Developer
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          Digital Studio · Remote
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full">
                        Full-time
                      </span>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-2xl p-4 hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                        T
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900">
                          UI/UX Designer
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          Tech Company · Hybrid
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full">
                        Part-time
                      </span>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-2xl p-4 hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700 font-bold text-lg">
                        S
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900">
                          Backend Developer
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          Startup · On-site
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-3 py-1.5 rounded-full">
                        Full-time
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/jobs"
                  className="flex items-center justify-center gap-2 w-full mt-6 py-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-sm font-semibold transition-colors"
                >
                  Browse All Jobs
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-xl">
                <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-xl">
                  ✓
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Your career journey
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Starts with one opportunity
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white border-y border-slate-200">
        <div className="custom-container px-5">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-sm font-bold text-blue-600 mb-3">
              WHY JOBBOARD?
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              A simpler way to find your next job
            </h2>
            <p className="text-slate-500 mt-4 leading-7">
              Everything you need to move forward in your professional journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-7 rounded-2xl border border-slate-200 bg-slate-50 hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl mb-5">
                ⌕
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Discover Opportunities
              </h3>
              <p className="text-sm text-slate-500 leading-7 mt-3">
                Explore job listings and find opportunities that fit your skills
                and interests.
              </p>
            </div>

            <div className="p-7 rounded-2xl border border-slate-200 bg-slate-50 hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl mb-5">
                ↗
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Apply with Confidence
              </h3>
              <p className="text-sm text-slate-500 leading-7 mt-3">
                Find a role that matches your goals and send your application
                directly.
              </p>
            </div>

            <div className="p-7 rounded-2xl border border-slate-200 bg-slate-50 hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center text-2xl mb-5">
                ◎
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Hire Great Talent
              </h3>
              <p className="text-sm text-slate-500 leading-7 mt-3">
                Help your company connect with candidates and discover new
                talent.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="custom-container px-5">
          <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-8 sm:p-14 text-center">
            <div className="absolute w-72 h-72 bg-blue-600 rounded-full blur-3xl opacity-20 -top-32 -right-20" />
            <div className="absolute w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-20 -bottom-40 -left-20" />

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Ready for your next opportunity?
              </h2>
              <p className="text-slate-300 mt-5 max-w-xl mx-auto leading-7">
                Take the first step toward your next career move. Explore
                available jobs today.
              </p>

              <Link
                href="/jobs"
                className="inline-flex items-center gap-3 mt-8 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-7 py-4 rounded-xl transition-colors"
              >
                Explore Jobs
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
