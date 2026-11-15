"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SubmitEvent, useState } from "react";
import { BiSearch } from "react-icons/bi";

const SearchComponent = () => {
  const [value, setValue] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 w-full bg-slate-50 border border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 rounded-xl p-2 transition-all duration-200"
    >
      <div className="flex items-center justify-center w-11 h-11 bg-blue-50 text-blue-600 rounded-lg shrink-0">
        <BiSearch size={23} />
      </div>

      <input
        onChange={(e) => setValue(e.currentTarget.value)}
        value={value}
        className="flex-1 min-w-0 bg-transparent outline-none text-slate-800 placeholder:text-slate-400 text-sm sm:text-base px-2 "
        placeholder="Search job titles, skills, or keywords..."
        type="text"
      />

      <button
        type="submit"
        className="bg-slate-900 hover:bg-blue-600 text-white px-5 sm:px-7 py-3 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer shrink-0"
      >
        Search
      </button>
    </form>
  );

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const urlSearchParams = new URLSearchParams(searchParams.toString());

    if (!value.trim()) {
      urlSearchParams.delete("search");
      urlSearchParams.set("page", "1");
      router.push(`${pathname}?${urlSearchParams.toString()}`);
      return;
    }

    urlSearchParams.set("search", value.trim());
    urlSearchParams.set("page", "1");

    router.push(`${pathname}?${urlSearchParams.toString()}`);
  }
};

export default SearchComponent;
