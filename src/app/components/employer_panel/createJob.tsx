"use client";

import { jobSchema } from "@/lib/validations/job";
import { User } from "@/utility/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";

const CreateJobComponent = ({ employer }: { employer: User | null }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [errors, setErrors] = useState("");
  const [image, setImage] = useState<File | undefined | null>(null);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  function resetStates() {
    setOpen(false);
    setLoading(false);
    setTitle("");
    setDescription("");
    setLocation("");
    setMinSalary("");
    setMaxSalary("");
    setErrors("");
    setImage(null);
  }

  async function createJob(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors("");
    setLoading(true);

    const formData = new FormData();

    formData.set("title", title);
    formData.set("description", description);
    formData.set("location", location);
    formData.set("minSalary", minSalary);
    formData.set("maxSalary", maxSalary);

    if (image) {
      formData.set("image", image);
    }

    const schemaResult = jobSchema.safeParse({
      title,
      description,
      location,
      minSalary,
      maxSalary,
    });

    if (!schemaResult.success) {
      console.log(schemaResult.error);
      setErrors(
        schemaResult.error.issues.map((issue) => issue.message).join(" | "),
      );
      setTimeout(() => {
        setErrors("");
      }, 5000);
      setLoading(false);

      return;
    }

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        body: formData,
      });
      const responseMessage = await response.json();

      if (!response.ok) {
        setErrors(responseMessage.error);
        setTimeout(() => {
          setErrors("");
        }, 5000);

        return;
      }

      resetStates();
      router.refresh();
      setSuccess(true);
    } catch {
      setErrors("Something went Wrong");
      setTimeout(() => {
        setErrors("");
      }, 5000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {success && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-4 text-sm leading-6 text-green-700 shadow-sm">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-600">
            +
          </span>
          <p>Job created successfully!</p>
        </div>
      )}
      {errors && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm leading-6 text-red-700 shadow-sm">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold text-red-600">
            !
          </span>
          <p>{errors}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 mb-10">
        <div>
          <p className="text-sm font-medium text-blue-600 mb-2">
            EMPLOYER DASHBOARD
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, {employer!.firstName}!
          </h1>

          <p className="text-slate-500 mt-2">
            Manage your job postings and track applications.
          </p>
        </div>

        <button
          onClick={() => {
            setOpen(!open);
            setSuccess(false);
          }}
          className={`
          bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-xl font-medium 
          shadow-sm cursor-pointer ${open && "bg-white! text-black!"}`}
        >
          {!open ? "+ Create a New Job" : "- Close"}
        </button>
      </div>

      {open && (
        <form
          onSubmit={createJob}
          className="my-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm"
        >
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Create a New Job
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Fill in the details below to publish a new job opportunity.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Job Title"
              onChange={(e) => setTitle(e.currentTarget.value)}
              value={title}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />

            <input
              type="text"
              placeholder="Location"
              onChange={(e) => setLocation(e.currentTarget.value)}
              value={location}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />

            <input
              type="number"
              placeholder="Minimum Salary"
              onChange={(e) => setMinSalary(e.currentTarget.value)}
              value={minSalary}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />

            <input
              type="number"
              placeholder="Maximum Salary"
              onChange={(e) => setMaxSalary(e.currentTarget.value)}
              value={maxSalary}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Job Image
              </label>
              <input
                type="file"
                onChange={(e) => setImage(e.currentTarget.files?.[0])}
                className="
                w-full cursor-pointer rounded-xl border border-slate-300
                bg-slate-50 text-sm text-slate-600 file:mr-4 
                file:cursor-pointer file:border-0 file:bg-blue-50 file:px-5 file:py-3 file:font-medium 
                file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Job Description
              </label>
              <textarea
                onChange={(e) => setDescription(e.currentTarget.value)}
                value={description}
                placeholder="Describe the job responsibilities, requirements, and benefits..."
                rows={5}
                className="w-full resize-y rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              disabled={loading}
              type="submit"
              className={`
              cursor-pointer rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold 
              text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]
              ${loading && "bg-white! text-black! cursor-not-allowed!"}
              `}
            >
              {!loading ? "+ Create Job" : "wait ..."}
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default CreateJobComponent;
