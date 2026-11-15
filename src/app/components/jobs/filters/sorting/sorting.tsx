
"use client";

import { useEffect, useState } from "react";
import SortingRadio from "./sortingRadio";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const SortingComponent = () => {
  const [sorting, setSorting] = useState("");

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const router = useRouter();
  const urlSearchParams = new URLSearchParams(searchParams.toString());

  useEffect(() => {
    urlSearchParams.set("sort", sorting);
    router.push(`${pathname}?${urlSearchParams.toString()}`);
  }, [sorting]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-bold text-slate-900">
          Sorting
        </h2>

        <button
          type="button"
          onClick={() => {
            setSorting("");
            urlSearchParams.delete("sort");
            router.push(`${pathname}?${urlSearchParams.toString()}`);
          }}
          disabled={!sorting}
          className="text-xs font-medium text-slate-400 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Clear
        </button>
      </div>

      <div className="space-y-3">
        <SortingRadio
          sorting={sorting}
          name="newest"
          setSorting={setSorting}
        />

        <SortingRadio
          sorting={sorting}
          name="oldest"
          setSorting={setSorting}
        />

        <SortingRadio
          sorting={sorting}
          name="salary_asc"
          setSorting={setSorting}
        />

        <SortingRadio
          sorting={sorting}
          name="salary_desc"
          setSorting={setSorting}
        />
      </div>
    </div>
  );
};

export default SortingComponent;
