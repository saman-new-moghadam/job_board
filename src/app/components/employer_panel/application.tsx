"use client";

import { setApplicationStatus } from "@/app/serverActions/applicationsStatus";
import { application_status } from "@/generated/prisma/enums";

type ApplicationType = {
  user: {
    id: number;
    createdAt: Date;
    firstName: string;
    lastName: string;
  };
} & {
  resumeUrl: string | null,
  id: number;
  userId: number;
  jobId: number;
  coverLetter: string;
  resumeKey: string;
  status: application_status;
  createdAt: Date;
};

const ApplicationComponent = ({
  application,
  index,
}: {
  application: ApplicationType;
  index: number;
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-600">
            {application.user.firstName.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3 className="font-bold text-slate-900">
              {application.user.firstName} {application.user.lastName}
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Applicant #{index + 1}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-slate-50 p-4">
        <h4 className="mb-2 text-sm font-semibold text-slate-700">
          Cover Letter
        </h4>

        <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
          {application.coverLetter}
        </p>
      </div>

      <div className="mt-6 border-t border-slate-100 pt-5">
        <p className="mb-3 text-sm font-semibold text-slate-700">
          Application Status
        </p>

        <form
          action={setApplicationStatus.bind(null, application.id)}
          className="grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          <button
            name="status"
            value="PENDING"
            className={`
          rounded-xl border
        border-yellow-200 
        bg-yellow-50 px-3 py-3 text-sm font-semibold
        text-yellow-700 transition-colors 
        hover:bg-yellow-100 cursor-pointer ${application.status === "PENDING" && "bg-yellow-300"}`}
          >
            PENDING
          </button>

          <button
            name="status"
            value="REVIEWING"
            className={`
          rounded-xl border
        border-orange-200 
        bg-orange-50 px-3 py-3 text-sm font-semibold
        text-orange-700 transition-colors 
        hover:bg-orange-100 cursor-pointer ${application.status === "REVIEWING" && "bg-orange-300"}`}
          >
            REVIEWING
          </button>

          <button
            name="status"
            value="ACCEPTED"
            className={`
          rounded-xl border
        border-green-200 
        bg-green-50 px-3 py-3 text-sm font-semibold
        text-green-700 transition-colors 
        hover:bg-green-100 cursor-pointer ${application.status === "ACCEPTED" && "bg-green-300"}`}
          >
            ACCEPTED
          </button>

          <button
            name="status"
            value="REJECTED"
            className={`
          rounded-xl border
        border-red-200 
        bg-red-50 px-3 py-3 text-sm font-semibold
        text-red-700 transition-colors 
        hover:bg-red-100 cursor-pointer ${application.status === "REJECTED" && "bg-red-300"}`}
          >
            REJECTED
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3 justify-end mt-5">
                {application.resumeUrl && (
                  <a
                    href={application.resumeUrl}
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

              </div>
      </div>
    </div>
  );
};

export default ApplicationComponent;
