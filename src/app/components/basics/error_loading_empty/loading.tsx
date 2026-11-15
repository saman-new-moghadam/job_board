type LoadingProps = {
  message?: string;
};

const Loading = ({
  message = "Loading jobs...",
}: LoadingProps) => {
  return (
    <div
      className="flex min-h-[300px] w-full items-center justify-center px-4 py-12"
      role="status"
      aria-live="polite"
    >
      <div className="flex w-full max-w-md flex-col items-center rounded-2xl border border-gray-100 bg-white px-6 py-10 text-center shadow-sm">
        <div className="relative mb-6 flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-gray-100" />

          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#d86ad4]" />

          <div className="h-3 w-3 animate-pulse rounded-full bg-[#d86ad4]" />
        </div>

        <h2 className="mb-2 text-lg font-bold text-gray-900">
          Please wait
        </h2>

        <p className="text-sm leading-6 text-gray-500">
          {message}
        </p>

        <div className="mt-6 h-1.5 w-40 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-[#d86ad4]" />
        </div>
      </div>

      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loading;