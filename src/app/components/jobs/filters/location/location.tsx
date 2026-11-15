"use client";

import { useEffect, useState } from "react";
import LocationRadio from "./locationRadio";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

const LocationComponent = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [jobLocation, setJobLocation] = useState(
    searchParams.get("location") || ""
  );

  useEffect(() => {
    const currentLocation = searchParams.get("location") || "";

    if (currentLocation !== jobLocation) {
      const urlSearchParams = new URLSearchParams(searchParams.toString());

      if (jobLocation) {
        urlSearchParams.set("location", jobLocation);
      } else {
        urlSearchParams.delete("location");
      }

      urlSearchParams.set("page", "1");

      router.push(`${pathname}?${urlSearchParams.toString()}`);
    }
  }, [jobLocation, pathname, router, searchParams]);

  function handleClear() {
    setJobLocation("");

    const urlSearchParams = new URLSearchParams(searchParams.toString());
    urlSearchParams.delete("location");
    urlSearchParams.set("page", "1");

    router.push(`${pathname}?${urlSearchParams.toString()}`);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-bold text-slate-900">
          Location
        </h2>

        <button
          type="button"
          onClick={handleClear}
          disabled={!jobLocation}
          className="text-xs font-medium text-slate-400 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Clear
        </button>
      </div>

      <div className="space-y-3">
        <LocationRadio name="Tehran" setLocation={setJobLocation} />
        <LocationRadio name="Mashhad" setLocation={setJobLocation} />
        <LocationRadio name="Isfahan" setLocation={setJobLocation} />
        <LocationRadio name="Remote" setLocation={setJobLocation} />
      </div>
    </div>
  );
};

export default LocationComponent;