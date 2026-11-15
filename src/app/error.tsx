
"use client";


const Error = ({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {


  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl font-bold text-red-600">
        Something went wrong!
      </h2>

      <p className="text-gray-500">
        An unexpected error occurred. Please try again.
      </p>

      <button
        onClick={() => reset()}
        className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  );
};

export default Error;
