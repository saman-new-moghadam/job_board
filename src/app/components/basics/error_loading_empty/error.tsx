"use client";

import { useState } from "react";

type ErrorProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

const Error = ({
  title = "Something went wrong!",
  message = "We couldn't load the data. Please try again.",
  onRetry,
}: ErrorProps) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (!onRetry || isRetrying) return;

    setIsRetrying(true);

    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="flex min-h-[300px] w-full items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-md flex-col items-center rounded-2xl border border-red-100 bg-white px-6 py-10 text-center shadow-sm">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-500"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
        </div>

        <h2 className="mb-2 text-xl font-bold text-gray-900">
          {title}
        </h2>

        <p className="mb-6 max-w-sm text-sm leading-6 text-gray-500">
          {message}
        </p>

        {onRetry && (
          <button
            type="button"
            onClick={handleRetry}
            disabled={isRetrying}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#d86ad4] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#c456c0] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRetrying && (
              <svg
                className="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}

            {isRetrying ? "Retrying..." : "Try Again"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Error;