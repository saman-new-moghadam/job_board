"use client";

import { deleteApplication } from "@/app/serverActions/deleteApplication";

function DeleteApplication({applicationId}: {applicationId: number}) {
  
  return (
    <form action={deleteApplication.bind(null, applicationId)}>
      <button
        type="submit"
        className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-100"
      >
        Cancel Application
      </button>
    </form>
  );
}

export default DeleteApplication;
