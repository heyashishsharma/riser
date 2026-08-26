import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="w-12 h-12 text-[#4a3aff] animate-spin mb-4" />
      <p className="text-gray-500 font-medium animate-pulse" style={{ fontFamily: 'var(--font-outfit)' }}>
        Loading...
      </p>
    </div>
  );
}
