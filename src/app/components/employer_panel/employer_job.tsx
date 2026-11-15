"use client";

import { application_status, job_status } from "@/generated/prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitEvent, useState } from "react";

type Job = {
  imageUrl: string | null;
  application: {
    id: number;
    status: application_status;
    createdAt: Date;
    userId: number;
    jobId: number;
    coverLetter: string;
    resumeKey: string;
  }[];
  id: number;
  title: string;
  description: string;
  location: string;
  minSalary: number;
  maxSalary: number;
  status: job_status;
  employerId: number;
  createdAt: Date;
  imageKey: string | null;
};

const EmployerJob = ({ job }: { job: Job }) => {
  const [title, setTitle] = useState(job.title);
  const [description, setDescription] = useState(job.description);
  const [status, setStatus] = useState<job_status>(job.status);
  const [minSalary, setMinSalary] = useState(job.minSalary);
  const [maxSalary, setMaxSalary] = useState(job.maxSalary);

  const [message, setMessage] = useState({
    error: false,
    message: "",
  });

  const [isUpdating, setIsUpdating] = useState(false);

  const router = useRouter();

  async function handleUpdate(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsUpdating(true);
    setMessage({ error: false, message: "" });

    try {
      const response = await fetch(`/api/jobs/${job.id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify({
          title,
          description,
          status,
          minSalary,
          maxSalary,
        }),
      });

      const messageJson = await response.json();

      if (response.ok) {
        router.refresh();

        setMessage({
          error: false,
          message: "Job updated successfully!",
        });

        setTimeout(() => {
          setMessage({ error: false, message: "" });
        }, 5000);
      } else {
        setMessage({
          error: true,
          message: messageJson.error,
        });

        setTimeout(() => {
          setMessage({ error: false, message: "" });
        }, 5000);
      }
    } catch {
      setMessage({
        error: true,
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="col-span-12 md:col-span-6 xl:col-span-4">
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="relative h-48 bg-slate-100">
          {job.imageUrl ? (
            <Link href={`employer_panel/${job.id}/applications`}>
              <Image
                src={job.imageUrl}
                alt={job.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                className="object-cover"
              />
            </Link>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              <span className="text-5xl">💼</span>
            </div>
          )}

          <div className="absolute top-4 right-4">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                status === "OPEN"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {status === "OPEN" ? "● OPEN" : "● CLOSED"}
            </span>
          </div>
        </div>

        <div className="p-5">
          <div className="flex justify-between items-start gap-3 mb-4">
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-slate-900 break-words">
                {job.title}
              </h2>

              <p className="text-sm text-slate-500 mt-1">{job.location}</p>
            </div>

            <Link href={`employer_panel/${job.id}/applications`} className="shrink-0 bg-blue-50 text-blue-700 rounded-xl px-3 py-2 text-center">
              <p className="text-lg font-bold">{job.application.length}</p>
              <p className="text-xs">Applicants</p>
            </Link>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 mb-5">
            <p className="text-xs text-slate-500 mb-1">Salary Range</p>

            <p className="text-sm font-semibold text-slate-800">
              {job.minSalary.toLocaleString()} -{" "}
              {job.maxSalary.toLocaleString()}
            </p>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <h3 className="text-sm font-bold text-slate-800 mb-4">
              Edit Job Details
            </h3>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Job Title
                </label>

                <input
                  className="w-full border border-slate-200 rounded-lg p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  type="text"
                  placeholder="Job title"
                  value={title}
                  onChange={(e) => setTitle(e.currentTarget.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Description
                </label>

                <textarea
                  className="w-full border border-slate-200 rounded-lg p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-y"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.currentTarget.value)}
                  placeholder="Job description"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Minimum Salary
                  </label>

                  <input
                    className="w-full min-w-0 border border-slate-200 rounded-lg p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                    type="number"
                    value={minSalary}
                    onChange={(e) =>
                      setMinSalary(Number(e.currentTarget.value))
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Maximum Salary
                  </label>

                  <input
                    className="w-full min-w-0 border border-slate-200 rounded-lg p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                    type="number"
                    value={maxSalary}
                    onChange={(e) =>
                      setMaxSalary(Number(e.currentTarget.value))
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Job Status
                </label>

                <select
                  className="w-full border border-slate-200 rounded-lg p-3 text-sm bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition cursor-pointer"
                  value={status}
                  onChange={(e) =>
                    setStatus(e.currentTarget.value as job_status)
                  }
                >
                  <option value="OPEN">OPEN</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              {message.message !== "" && (
                <div
                  className={`p-3 rounded-lg text-sm ${
                    message.error
                      ? "bg-red-50 text-red-600 border border-red-100"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  }`}
                >
                  {message.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full bg-slate-900 hover:bg-blue-600 disabled:bg-slate-400 text-white font-medium py-3 rounded-lg text-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {isUpdating ? "Updating..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerJob;
