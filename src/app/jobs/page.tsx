import { Job } from "@/types/jobs";
import SomethingWentWrong from "../components/basics/error_loading_empty/something-went-wrong";
import JobCard from "../components/jobs/jobCard";
import RangeComponent from "../components/jobs/filters/range";
import LocationComponent from "../components/jobs/filters/location/location";
import SortingComponent from "../components/jobs/filters/sorting/sorting";
import SearchComponent from "../components/jobs/filters/search";
import CantFindNothing from "../components/cant_find_nothing/cantFindNothing";
import Link from "next/link";
import AllJobs from "../components/jobs/allJobsButton";

type Props = {
  searchParams: Promise<{
    search?: string;
    page?: string;
    location?: string;
    sort?: string;
    minSalary?: string;
    maxSalary?: string;
  }>;
};

const JobsPage = async ({ searchParams }: Props) => {
  const { search, page, location, sort, minSalary, maxSalary } =
    await searchParams;

  const baseUrl = new URL("http://localhost:3000/api/jobs");

  if (search) baseUrl.searchParams.set("search", search);
  if (page) baseUrl.searchParams.set("page", page);
  if (sort) baseUrl.searchParams.set("sort", sort);
  if (location) baseUrl.searchParams.set("location", location);
  if (minSalary) baseUrl.searchParams.set("minSalary", minSalary);
  if (maxSalary) baseUrl.searchParams.set("maxSalary", maxSalary);

  const response = await fetch(baseUrl.toString());

  if (!response.ok) {
    return <SomethingWentWrong />;
  }

  const result = await response.json();
  const jobs = result.data;

  function renderPagesNumber() {
    const arr = [];

    for (let i = 1; i <= result.totalPages; i++) {
      arr.push(
        <Link
          className={`flex items-center justify-center min-w-10 h-10 rounded-lg text-sm font-medium transition ${
            Number(page || 1) === i
              ? "bg-slate-900 text-white"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
          }`}
          key={i}
          href={`?${new URLSearchParams({
            ...(search && { search }),
            ...(location && { location }),
            ...(sort && { sort }),
            ...(minSalary && { minSalary }),
            ...(maxSalary && { maxSalary }),
            page: String(i),
          }).toString()}`}
        >
          {i}
        </Link>,
      );
    }

    return arr;
  }

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="custom-container px-5">

        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600 mb-2">
            FIND YOUR NEXT OPPORTUNITY
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Explore Jobs
          </h1>

          <p className="text-slate-500 mt-2">
            Discover opportunities that match your skills and ambitions.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm mb-8">
          <SearchComponent />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <aside className="lg:col-span-3">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

              <div className="mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">
                  Filters
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Narrow down your search.
                </p>
              </div>

              <div className="space-y-7">

                <section>
                  <LocationComponent />
                </section>

                <div className="border-t border-slate-100" />

                <section>
                  <SortingComponent />
                </section>

                <div className="border-t border-slate-100" />

                <section>
                  <RangeComponent />
                </section>

              </div>
            </div>

          </aside>

          <section className="lg:col-span-9 min-w-0">

            {jobs.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm min-h-[400px] flex flex-col justify-center items-center gap-8">
                <CantFindNothing />
                <AllJobs />
              </div>
            ) : (
              <>
                {search && (
                  <div className="mb-5">
                    <AllJobs />
                  </div>
                )}

                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Available Jobs
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                      Find the right opportunity for you.
                    </p>
                  </div>

                  <span className="bg-white border border-slate-200 text-slate-600 text-sm px-4 py-2 rounded-lg">
                    Page {page || 1} of {result.totalPages}
                  </span>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {jobs.map((job: Job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>

                {result.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
                    {renderPagesNumber()}
                  </div>
                )}
              </>
            )}

          </section>
        </div>
      </div>
    </main>
  );
};

export default JobsPage;