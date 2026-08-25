"use client";

import { useState } from "react";
import { Sparkles, Loader2, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const FILTERS = ["All", "Analytics", "Sponsors", "Community", "Trends", "Script", "Campaigns"];

export default function SearchSection() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ category: string; response: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, filter: activeFilter }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch response");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="max-w-3xl mx-auto flex flex-col gap-3">
        <form onSubmit={handleSearch} className="w-full bg-white border border-gray-200 rounded-2xl flex items-center px-4 py-2 sm:py-3 shadow-[0_4px_20px_rgb(0,0,0,0.05)] focus-within:ring-1 focus-within:ring-[#4a3aff]/30 focus-within:border-[#4a3aff]/30 transition-all relative z-20">
          <Sparkles className="text-gray-400 w-5 h-5 ml-2 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask your AI Agent anything, or paste a link..."
            className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 px-3 sm:px-4 placeholder-gray-400 text-sm sm:text-base outline-none w-full"
          />
          
          {isLoading && (
             <div className="flex items-center justify-center pr-2 sm:pr-4">
               <Loader2 className="w-5 h-5 text-[#4a3aff] animate-spin" />
             </div>
          )}

          <div className="flex items-center pr-1 sm:pr-2">
            <button type="submit" className="text-[#4a3aff] hover:text-[#3b2de0] transition-colors ml-1 sm:ml-2 bg-[#f4f3ff] p-2 rounded-full">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 px-1 relative z-10">
          {FILTERS.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border ${
                activeFilter === filter 
                  ? "bg-[#4a3aff] text-white border-[#4a3aff] shadow-md transform scale-105" 
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Results Area */}
      {error && (
        <div className="max-w-3xl mx-auto mt-6 bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-sm text-left shadow-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="max-w-3xl mx-auto mt-6 bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-xl text-left transform transition-all duration-500 relative overflow-hidden">
          {/* Subtle gradient background effect */}
          <div className="absolute -inset-0 bg-gradient-to-br from-[#4a3aff]/5 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4f3ff] border border-[#e0e7ff] text-[#4a3aff] text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              {result.category}
            </div>
            
            <div className="text-gray-800 leading-relaxed text-sm sm:text-base font-inter [&_code]:bg-gray-100 [&_code]:text-gray-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_pre_code]:bg-transparent [&_pre_code]:text-inherit [&_pre_code]:p-0">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-6 mb-4 text-gray-900" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-5 mb-3 text-gray-900" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-4 mb-2 text-gray-900" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4 leading-7" {...props} />,
                  a: ({node, ...props}) => <a className="text-[#4a3aff] hover:text-[#3b2de0] underline decoration-[#4a3aff]/30 hover:decoration-[#4a3aff] transition-all font-medium" target="_blank" rel="noopener noreferrer" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2 marker:text-[#4a3aff]" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-2 marker:text-[#4a3aff] font-medium" {...props} />,
                  li: ({node, ...props}) => <li className="text-gray-700" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-semibold text-gray-900" {...props} />,
                  blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-[#4a3aff]/50 bg-[#4a3aff]/5 py-2 px-4 rounded-r-lg italic text-gray-700 my-4" {...props} />,
                  table: ({node, ...props}) => <div className="overflow-x-auto mb-4"><table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden" {...props} /></div>,
                  th: ({node, ...props}) => <th className="px-4 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider" {...props} />,
                  td: ({node, ...props}) => <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border-t border-gray-100" {...props} />,
                  pre: ({node, ...props}) => <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto shadow-inner"><pre className="text-gray-100 text-sm font-mono" {...props} /></div>,
                }}
              >
                {result.response}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

