"use client";

import { useState, useRef } from "react";
import { Sparkles, Loader2, Send, Mic, Copy, CheckCircle2, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";

const FILTERS = ["All", "Hooks", "Campaigns", "Analytics", "Sponsors", "Community", "Trends", "Script"];

export default function SearchSection() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ category: string; response: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const recognitionRef = useRef<any>(null);

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.response);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleVoice = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Try Chrome!");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    const initialQuery = query;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = 0; i < event.results.length; ++i) {
        finalTranscript += event.results[i][0].transcript;
      }
      setQuery(initialQuery ? `${initialQuery} ${finalTranscript}` : finalTranscript);
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'aborted') {
        setIsListening(false);
        return;
      }
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

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
      setQuery("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="max-w-3xl mx-auto flex flex-col gap-4 mb-8">
        <motion.form 
          onSubmit={handleSearch} 
          className={`w-full bg-white border rounded-2xl flex items-center px-4 py-2 sm:py-3 shadow-sm transition-all relative ${
            isLoading 
              ? 'border-[#4a3aff]/50 ring-2 ring-[#4a3aff]/20' 
              : 'border-gray-200 focus-within:ring-2 focus-within:ring-[#4a3aff]/20 focus-within:border-[#4a3aff]/50 hover:border-gray-300'
          }`}
          whileTap={{ scale: 0.995 }}
        >
          <Sparkles className={`w-5 h-5 ml-2 flex-shrink-0 transition-colors ${isLoading ? 'text-[#4a3aff] animate-pulse' : 'text-gray-400'}`} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask your AI Agent anything, or paste a link..."
            className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-800 px-3 sm:px-4 placeholder-gray-400 text-sm sm:text-base outline-none w-full font-medium"
            disabled={isLoading}
          />
          
          <AnimatePresence>
            {isLoading && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.8 }}
                 className="flex items-center justify-center pr-2"
               >
                 <Loader2 className="w-5 h-5 text-[#4a3aff] animate-spin" />
               </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center pr-1 sm:pr-2 gap-1.5 border-l border-gray-100 pl-3 ml-1">
            <button 
              type="button" 
              onClick={handleVoice}
              disabled={isLoading}
              className={`transition-all p-2.5 rounded-full flex items-center justify-center ${
                isListening 
                  ? 'text-red-500 bg-red-50 animate-pulse shadow-inner' 
                  : 'text-gray-500 hover:text-[#4a3aff] hover:bg-[#f4f3ff] bg-gray-50'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Voice to Script"
            >
              <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button 
              type="submit" 
              disabled={isLoading || !query.trim()}
              className={`transition-all p-2.5 rounded-full flex items-center justify-center ${
                query.trim() && !isLoading
                  ? 'bg-[#4a3aff] text-white hover:bg-[#3b2de0] shadow-md hover:shadow-lg transform hover:-translate-y-0.5' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" />
            </button>
          </div>
        </motion.form>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 px-1 relative">
          {FILTERS.map(filter => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-300 border ${
                activeFilter === filter 
                  ? "bg-[#111] text-white border-[#111] shadow-md transform scale-105" 
                  : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Results Area */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            key="error"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="max-w-3xl mx-auto bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-sm text-left shadow-sm flex items-start gap-3"
          >
            <div className="bg-red-100 p-1 rounded-full mt-0.5 flex-shrink-0">
              <span className="w-4 h-4 flex items-center justify-center font-bold text-red-600">!</span>
            </div>
            <div>
              <p className="font-semibold mb-1">An error occurred</p>
              <p className="text-red-500">{error}</p>
            </div>
          </motion.div>
        )}

        {result && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} // smooth spring-like curve
            className="max-w-3xl mx-auto bg-white border border-gray-200/80 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.06)] text-left overflow-hidden flex flex-col relative"
          >
            {/* Header Section */}
            <div className="bg-gray-50/80 border-b border-gray-100 px-6 py-4 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4a3aff] to-[#8b5cf6] flex items-center justify-center shadow-md p-0.5">
                  <div className="w-full h-full border border-white/20 rounded-full flex items-center justify-center bg-transparent">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Riser AI Copilot</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#4a3aff] bg-[#4a3aff]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {result.category}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-xs font-semibold ${
                  isCopied 
                    ? 'bg-green-50 text-green-600 border border-green-200' 
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 shadow-sm'
                }`}
                title="Copy response"
              >
                {isCopied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {isCopied ? "Copied!" : "Copy"}
              </button>
            </div>
            
            {/* Content Section */}
            <div className="p-6 md:p-8 bg-white relative z-10">
              <div className="text-gray-800 leading-relaxed text-[15px] sm:text-base font-inter [&_code]:bg-gray-100 [&_code]:text-[#eb4312] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-[14px] [&_code]:font-mono [&_pre_code]:bg-transparent [&_pre_code]:text-inherit [&_pre_code]:p-0">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-2xl font-black mt-8 mb-4 text-gray-900 tracking-tight first:mt-0" style={{ fontFamily: 'var(--font-outfit)' }} {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-7 mb-3 text-gray-900 tracking-tight border-b border-gray-100 pb-2 first:mt-0" style={{ fontFamily: 'var(--font-outfit)' }} {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-6 mb-2 text-gray-900 first:mt-0" style={{ fontFamily: 'var(--font-outfit)' }} {...props} />,
                    p: ({node, ...props}) => <p className="mb-5 leading-relaxed text-gray-700 last:mb-0" {...props} />,
                    a: ({node, ...props}) => <a className="text-[#4a3aff] hover:text-[#3b2de0] underline decoration-[#4a3aff]/30 hover:decoration-[#4a3aff] underline-offset-2 transition-all font-medium" target="_blank" rel="noopener noreferrer" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-5 space-y-2 marker:text-[#4a3aff] last:mb-0" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-5 space-y-2 marker:text-[#4a3aff] font-medium text-gray-900 last:mb-0" {...props} />,
                    li: ({node, ...props}) => <li className="pl-1 text-gray-700 font-normal" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
                    blockquote: ({node, ...props}) => (
                      <blockquote className="border-l-4 border-[#4a3aff] bg-gradient-to-r from-[#4a3aff]/[0.03] to-transparent py-4 px-5 rounded-r-xl italic text-gray-600 my-6 last:mb-0 relative" {...props} />
                    ),
                    table: ({node, ...props}) => (
                      <div className="overflow-x-auto mb-6 border border-gray-200 rounded-xl shadow-sm last:mb-0 bg-white">
                        <table className="min-w-full divide-y divide-gray-200" {...props} />
                      </div>
                    ),
                    th: ({node, ...props}) => <th className="px-4 py-3.5 bg-gray-50 text-left text-xs font-bold text-gray-700 uppercase tracking-wider" {...props} />,
                    td: ({node, ...props}) => <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border-t border-gray-100" {...props} />,
                    pre: ({node, ...props}) => (
                      <div className="bg-[#111] rounded-xl p-5 my-6 overflow-x-auto shadow-lg border border-gray-800 last:mb-0 relative group">
                        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* Could add a dedicated code block copy button here in the future */}
                        </div>
                        <pre className="text-gray-200 text-[13px] font-mono leading-relaxed" {...props} />
                      </div>
                    ),
                  }}
                >
                  {result.response}
                </ReactMarkdown>
              </div>
            </div>
            
            {/* Footer accent line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#4a3aff] via-[#8b5cf6] to-[#ec4899] absolute bottom-0 left-0"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
