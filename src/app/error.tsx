"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>
          Something went wrong
        </h2>
        <p className="text-gray-500 mb-8 text-sm">
          We encountered an unexpected error. Please try again.
        </p>
        <button
          onClick={() => reset()}
          className="w-full bg-[#4a3aff] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#3b2de0] transition-colors cursor-pointer"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
