import { preSignedFile } from "@/lib/b2";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/utility/auth";
import { redirect } from "next/navigation";
import DeleteApplication from "../components/applicant_panel/delete_application";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Applicant Dashboard",
  description:
    "Track your job applications, check application statuses, manage your resumes, and stay updated on your career opportunities.",

  robots: {
    index: false,
    follow: false,
  },

  openGraph: {
    title: "Applicant Dashboard | Job Board",
    description:
      "Manage and track all your job applications from your personal Job Board dashboard.",
    url: "/applicant_panel",
  },
};

const ApplicantPanel = async () => {
  const user = await requireRole("JOB_SEEKER");

  if (!user.authorized || user.user.role !== "JOB_SEEKER") {
    redirect("/login");
  }

  const applications = await prisma.application.findMany({
    where: {
      userId: user.user.id,
    },
    include: {
      job: true,
    },
  });

  const app = await Promise.all(
    applications.map(async (item) => {
      if (item.resumeKey) {
        return {
          ...item,
          resume: await preSignedFile(item.resumeKey),
        };
      }
      return { ...item, resume: null };
    }),
  );

  return (
    <div className="custom-container min-h-screen bg-slate-50 px-5 py-10">
      <div className="mb-10">
        <p className="mb-2 text-sm font-semibold tracking-wide text-blue-600">
          APPLICANT DASHBOARD
        </p>

        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back, {user.user.firstName}!
        </h1>

        <p className="mt-2 text-slate-500">
          Track your job applications and stay updated on their progress.
        </p>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">My Applications</h2>
          <p className="mt-1 text-sm text-slate-500">
            Your submitted job applications
          </p>
        </div>

        <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
          {applications.length} Applications
        </span>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
            <span>📄</span>
          </div>

          <h3 className="text-lg font-bold text-slate-900">
            No applications yet
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            You have not applied for any jobs. Start exploring opportunities!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {app.map((application) => (
            <div
              key={application.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md sm:p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {application.job.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {application.job.location}
                  </p>
                </div>

                <span
                  className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${
                    application.job.status === "OPEN"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  Job {application.job.status}
                </span>
              </div>

              <div className="my-5 border-t border-slate-100" />

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-700">
                  Your Cover Letter
                </p>

                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                  {application.coverLetter}
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm font-medium text-slate-500">
                  Application Status
                </span>

                <span
                  className={`w-fit rounded-full px-4 py-2 text-xs font-bold ${
                    application.status === "ACCEPTED"
                      ? "bg-green-50 text-green-700"
                      : application.status === "REJECTED"
                        ? "bg-red-50 text-red-700"
                        : application.status === "REVIEWING"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {application.status}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 justify-end mt-5">
                {application.resume && (
                  <a
                    href={application.resume}
                    className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.8}
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 16V4m0 0L8 8m4-4 4 4M5 16v3a1 1 0 001 1h12a1 1 0 001-1v-3"
                      />
                    </svg>
                    View Resume
                  </a>
                )}

                <DeleteApplication applicationId={application.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicantPanel;
