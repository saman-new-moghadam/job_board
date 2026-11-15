import ApplicationComponent from "@/app/components/employer_panel/application";
import { preSignedFile } from "@/lib/b2";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/utility/auth";
import { notFound, redirect } from "next/navigation";

const JobApplication = async ({
  params,
}: {
  params: Promise<{ id: number }>;
}) => {
  const user = await requireRole("EMPLOYER");

  if (!user.authorized) {
    redirect("/");
  }

  const { id } = await params;

  const job = await prisma.job.findFirst({
    where: { id: Number(id), employerId: user.user.id },
    include: {
      application: {
        where: {
          status: {
            not: "CANCELLED",
          },
        },
        include: {
          user: true,
        },
      },
    },
  });

  if (!job) {
    return notFound();
  }

  const applications = await Promise.all(job.application.map(async (application) => {
    if (application.resumeKey) {
      return {
        ...application,
        resumeUrl: await preSignedFile(application.resumeKey),
      };
    }
    return { ...application, resumeUrl: null };
  }))

  if (job.application.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 py-10">
        <div className="custom-container px-5">
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
              📭
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              No Applications Yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              There are currently no applications for this job.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="custom-container px-5">
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">
            Employer Dashboard
          </p>

          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            Job Applications
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Review and manage applications submitted for this position.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
            <span className="text-sm text-slate-500">Total Applications</span>
            <span className="font-bold text-slate-900">
              {job.application.length}
            </span>
          </div>
        </div>

        <div className="space-y-5">
          {applications.map((application, index) => (
            <ApplicationComponent
              key={index}
              application={application}
              index={index}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default JobApplication;
