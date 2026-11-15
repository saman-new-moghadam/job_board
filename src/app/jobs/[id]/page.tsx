import GetInTouch from "@/app/components/jobs/getInTouch/getInTouch";
import { getAuthenticatedUser } from "@/utility/auth";
import { getJobById } from "@/utility/jobs";
import Image from "next/image";
import { notFound } from "next/navigation";

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const job = await getJobById(Number(id));

  if (!job) {
    return {
      title: "Job Not Found",
      description: "The job opportunity you are looking for does not exist.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description = job.description.slice(0, 155);

  return {
    title: job.title,
    description,

    openGraph: {
      type: "article",
      title: `${job.title} | Job Board`,
      description,
      url: `/jobs/${id}`,
      images: job.imageUrl ? [job.imageUrl] : undefined,
    },

    twitter: {
      card: job.imageUrl ? "summary_large_image" : "summary",
      title: job.title,
      description,
      images: job.imageUrl ? [job.imageUrl] : undefined,
    },
  };
}

const JobDetail = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const job = await getJobById(Number(id));

  if (!job) return notFound();

  const user = await getAuthenticatedUser();

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="custom-container-job-detail px-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                JOB OPPORTUNITY
              </span>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                {job.title}
              </h1>

              <p className="text-slate-500 mt-3">{job.location}</p>
            </div>

            <div className="shrink-0">
              <GetInTouch user={user} id={id} job={job} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-100">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-2">Salary Range</p>

              <p className="text-lg font-bold text-slate-900">
                {job.minSalary.toLocaleString()}$ -{" "}
                {job.maxSalary.toLocaleString()}$
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-2">Job Location</p>

              <p className="text-lg font-semibold text-slate-900">
                {job.location}
              </p>
            </div>
          </div>
        </div>

        {job.imageUrl && (
          <div className="mt-8 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <Image
              src={job.imageUrl}
              alt={`${job.title} job image`}
              width={1000}
              height={500}
              className="w-full max-h-[450px] object-cover"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-8">
          <div className="md:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-5">
              About This Position
            </h2>

            <div className="text-slate-600 leading-8 whitespace-pre-wrap break-words">
              {job.description}
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-8">
              <h2 className="text-lg font-bold text-slate-900 mb-5">
                Salary Information
              </h2>

              <div className="space-y-5">
                <div>
                  <p className="text-sm text-slate-500">Minimum Salary</p>

                  <p className="text-xl font-bold text-slate-900 mt-1">
                    {job.minSalary.toLocaleString()}$
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-5">
                  <p className="text-sm text-slate-500">Maximum Salary</p>

                  <p className="text-xl font-bold text-emerald-600 mt-1">
                    {job.maxSalary.toLocaleString()}$
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-blue-700">
                  Interested in this position? Contact the employer to learn
                  more.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
