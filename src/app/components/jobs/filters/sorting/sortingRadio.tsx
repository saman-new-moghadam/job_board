import { Dispatch, SetStateAction } from "react";

const SortingRadio = ({
  name,
  sorting,
  setSorting,
}: {
  name: string;
  sorting: string;
  setSorting: Dispatch<SetStateAction<string>>;
}) => {
  const isSelected = sorting === name;

  const labels: Record<string, string> = {
    newest: "Newest",
    oldest: "Oldest",
    salary_asc: "Lowest salary",
    salary_desc: "Highest salary",
  };

  return (
    <label
      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border ${
        isSelected
          ? "bg-blue-50 border-blue-200 text-blue-700"
          : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200 text-slate-600"
      }`}
    >
      <input
        onChange={() => setSorting(name)}
        checked={isSelected}
        type="radio"
        name="sorting"
        className="w-4 h-4 accent-blue-600 cursor-pointer"
      />

      <span className={`text-sm ${isSelected ? "font-semibold" : "font-medium"}`}>
        {labels[name] ?? name}
      </span>
    </label>
  );
};

export default SortingRadio;
