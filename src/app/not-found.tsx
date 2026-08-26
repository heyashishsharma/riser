import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'var(--font-outfit)' }}>
          Page not found
        </h2>
        <p className="text-gray-500 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <Link 
          href="/"
          className="inline-flex bg-[#4a3aff] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#3b2de0] transition-colors cursor-pointer"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
