import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, requireRole } from "@/utility/auth";
import { redirect, RedirectType } from "next/navigation";
import EmployerJob from "../components/employer_panel/employer_job";
import { preSignedFile } from "@/lib/b2";
import CreateJobComponent from "../components/employer_panel/createJob";

const EmployerPanel = async () => {
  const require_role = await requireRole("EMPLOYER");

  if (require_role.authorized == false) redirect("/", RedirectType.push);

  const employer = await getAuthenticatedUser();

  const jobs = await prisma.job.findMany({
    where: {
      employerId: employer!.id,
    },
    include: {
      application: {
        where: {
          status: {
            not: 'CANCELLED'
          }
        }
      },
    },
  });

  const employerJobs = await Promise.all(
    jobs.map(async (job) => ({
      ...job,
      imageUrl: job.imageKey ? await preSignedFile(job.imageKey) : null,
    })),
  );

  const totalApplications = jobs.reduce(
    (total, job) => total + job.application.length,
    0,
  );

  const openJobs = jobs.filter((job) => job.status === "OPEN").length;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="custom-container px-5">
        <CreateJobComponent employer={employer}/>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Jobs</p>

            <h2 className="text-3xl font-bold text-slate-900 mt-3">
              {jobs.length}
            </h2>

            <p className="text-sm text-slate-400 mt-2">All your job postings</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-500">Open Jobs</p>

            <h2 className="text-3xl font-bold text-emerald-600 mt-3">
              {openJobs}
            </h2>

            <p className="text-sm text-slate-400 mt-2">
              Currently accepting applications
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Applications</p>

            <h2 className="text-3xl font-bold text-blue-600 mt-3">
              {totalApplications}
            </h2>

            <p className="text-sm text-slate-400 mt-2">Applications received</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Your Job Postings
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                View and manage all your published jobs.
              </p>
            </div>

            <span className="text-sm text-slate-500 bg-slate-100 px-4 py-2 rounded-lg">
              {jobs.length} Jobs
            </span>
          </div>

          {employerJobs.length > 0 ? (
            <div className="grid grid-cols-12 gap-6">
              {employerJobs.map((item) => (
                <EmployerJob key={item.id} job={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl">
              <div className="text-4xl mb-4">📋</div>

              <h3 className="text-lg font-semibold text-slate-800">
                No jobs posted yet
              </h3>

              <p className="text-sm text-slate-500 mt-2">
                Create your first job posting to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerPanel;
