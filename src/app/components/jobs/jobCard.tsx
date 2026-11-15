import { Job } from "@/types/jobs";
import Image from "next/image";
import Link from "next/link";

const JobCard = ({ job }: { job: Job }) => {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="group block min-w-0 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >

      <div className="relative w-full h-52 bg-slate-100 overflow-hidden">

        {job.imageUrl ? (
          <Image
            src={job.imageUrl}
            alt={job.title}
            fill
            sizes="(max-width: 1280px) 100vw, 50vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">
            <span className="text-5xl">💼</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        <div className="absolute bottom-4 left-4 right-4">
          <h2 className="text-white text-xl font-bold line-clamp-2">
            {job.title}
          </h2>
        </div>

      </div>

      <div className="p-5">

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold shrink-0">
            {job.user.firstName.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="text-xs text-slate-400 mb-1">
              Posted by
            </p>

            <p className="text-sm font-semibold text-slate-800 truncate">
              {job.user.firstName} {job.user.lastName}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>📍</span>
            <span className="truncate">{job.location}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-700">
            <span>💰</span>
            <span className="font-semibold">
              {job.minSalary.toLocaleString()}$ - {job.maxSalary.toLocaleString()}$
            </span>
          </div>

        </div>

        <div className="flex items-center justify-between border-t border-slate-100 mt-5 pt-4">
          <span className="text-xs text-slate-400">
            View job details
          </span>

          <span className="text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
            →
          </span>
        </div>

      </div>
    </Link>
  );
};

export default JobCard;