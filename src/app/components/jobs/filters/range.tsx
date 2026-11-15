"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";

const RangeComponent = () => {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(1);

  const searchParams = useSearchParams();
  const urlSearchParams = new URLSearchParams(searchParams.toString());
  const pathname = usePathname();
  const router = useRouter();

  function handleSubmitSorting() {
    if (max < min) {
      return
    }
    urlSearchParams.set("minSalary", String(min));
    urlSearchParams.set("maxSalary", String(max));
    urlSearchParams.set("page", "1");

    router.push(`${pathname}?${urlSearchParams.toString()}`);
  }

  function reset() {
    setMin(1);
    setMax(1);

    urlSearchParams.delete("minSalary");
    urlSearchParams.delete("maxSalary");
    urlSearchParams.set("page", "1");

    router.push(`${pathname}?${urlSearchParams.toString()}`);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-base font-bold text-slate-900">
          Salary Range
        </h2>

        <button
          type="button"
          onClick={reset}
          className="text-xs font-medium text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
        >
          Reset
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-600">
              Minimum Salary
            </label>

            <span className="text-sm font-semibold text-blue-600 tabular-nums">
              ${min.toLocaleString("en-US")}
            </span>
          </div>

          <input
            type="range"
            value={min}
            onChange={(e) => setMin(Number(e.currentTarget.value))}
            min={1}
            max={30000}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />

          <div className="flex justify-between text-xs text-slate-400">
            <span>$1</span>
            <span>$30,000</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-600">
              Maximum Salary
            </label>

            <span className="text-sm font-semibold text-blue-600 tabular-nums">
              ${max.toLocaleString("en-US")}
            </span>
          </div>

          <input
            type="range"
            value={max}
            onChange={(e) => setMax(Number(e.currentTarget.value))}
            min={1}
            max={30000}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />

          <div className="flex justify-between text-xs text-slate-400">
            <span>$1</span>
            <span>$30,000</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmitSorting}
        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3 rounded-xl transition-colors duration-200 cursor-pointer"
      >
        Apply Salary Range
      </button>
    </div>
  );
};

export default RangeComponent;
