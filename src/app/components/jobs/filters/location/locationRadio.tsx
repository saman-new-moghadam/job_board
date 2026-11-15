import { useSearchParams } from "next/navigation";

const LocationRadio = ({
  name,
  setLocation,
}: {
  name: string;
  setLocation: (value: string) => void;
}) => {
  const searchParams = useSearchParams();

  const location = searchParams.get("location");
  const isSelected = location === name;

  return (
    <label
      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border ${
        isSelected
          ? "bg-blue-50 border-blue-200 text-blue-700"
          : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200 text-slate-600"
      }`}
    >
      <input
        checked={isSelected}
        type="radio"
        name="location"
        onChange={() => setLocation(name)}
        className="w-4 h-4 accent-blue-600 cursor-pointer"
      />

      <span className={`text-sm ${isSelected ? "font-semibold" : "font-medium"}`}>
        {name}
      </span>
    </label>
  );
};

export default LocationRadio;