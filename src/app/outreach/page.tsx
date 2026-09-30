"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Send, Bot, Copy, Check, Sparkles, Building2, Package } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function OutreachPage() {
  const { data: session, status } = useSession();
  const [brandName, setBrandName] = useState("");
  const [productInfo, setProductInfo] = useState("");
  const [pitch, setPitch] = useState("");
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [matchReasoning, setMatchReasoning] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  if (status === "unauthenticated") {
    redirect("/");
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName || !productInfo) return;

    setIsGenerating(true);
    setError("");
    setPitch("");
    setMatchScore(null);
    setMatchReasoning("");

    try {
      const res = await fetch("/api/outreach/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandName, productInfo })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate pitch");
      }

      setPitch(data.pitch);
      setMatchScore(data.matchScore);
      setMatchReasoning(data.matchReasoning);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(pitch);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex justify-center items-center">
        <div className="animate-pulse flex space-x-4">
          <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-[200px]"></div>
            <div className="h-4 bg-gray-200 rounded w-[150px]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-5">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2" style={{ fontFamily: 'var(--font-outfit)' }}>
              <Send className="w-7 h-7 text-[#ec4899]" />
              AI Pitch Generator
            </h1>
            <p className="text-gray-500 mt-2 text-sm">Generate highly-converting, personalized cold pitch emails for brands.</p>
          </div>
          <Link href="/" className="text-sm font-medium text-[#4a3aff] hover:text-[#3b2de0] transition-colors">
            &larr; Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#f59e0b]" /> 
                Campaign Details
              </h2>
              
              <form onSubmit={handleGenerate} className="space-y-5">
                <div>
                  <label htmlFor="brandName" className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-gray-400" /> Brand Name
                  </label>
                  <input
                    type="text"
                    id="brandName"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g. Nike, Notion, Gymshark"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#4a3aff]/20 focus:border-[#4a3aff] outline-none transition-all text-sm text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="productInfo" className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-gray-400" /> Product or Campaign
                  </label>
                  <textarea
                    id="productInfo"
                    value={productInfo}
                    onChange={(e) => setProductInfo(e.target.value)}
                    placeholder="e.g. Their new running shoes, or a specific feature you love..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#4a3aff]/20 focus:border-[#4a3aff] outline-none transition-all text-sm text-gray-900 resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isGenerating || !brandName || !productInfo}
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-[#4a3aff] text-white font-semibold text-sm rounded-xl hover:bg-[#3b2de0] hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 cursor-pointer"
                >
                  {isGenerating ? (
                    <span className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Generating...
                    </span>
                  ) : (
                    <>
                      <Bot className="w-4 h-4 mr-2" />
                      Generate Pitch
                    </>
                  )}
                </button>
              </form>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
               <h3 className="text-sm font-bold text-blue-800 mb-2">Pro Tip</h3>
               <p className="text-xs text-blue-600 leading-relaxed">
                 The AI uses your <strong>Brand Kit</strong> (from Settings) to customize this email with your niche, target audience, and follower stats automatically!
               </p>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full min-h-[400px] flex flex-col relative overflow-hidden">
              
              {/* Toolbar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                 <h3 className="font-semibold text-gray-700 text-sm">Generated Email</h3>
                 {pitch && (
                   <button
                     onClick={handleCopy}
                     className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                   >
                     {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                     {copied ? 'Copied!' : 'Copy to Clipboard'}
                   </button>
                 )}
              </div>

              {/* Content */}
              <div className="p-6 flex-1 overflow-y-auto">
                {error ? (
                  <div className="text-red-500 text-sm p-4 bg-red-50 rounded-xl border border-red-100">
                    <strong className="block mb-1">Error Generating Pitch:</strong>
                    {error}
                  </div>
                ) : pitch ? (
                  <div className="space-y-6">
                    {/* Brand Match Score Card */}
                    {matchScore !== null && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative flex items-center justify-center w-20 h-20">
                          <svg className="w-20 h-20 transform -rotate-90">
                            <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-blue-100" />
                            <circle 
                              cx="40" cy="40" r="36" 
                              stroke="currentColor" strokeWidth="8" fill="transparent" 
                              strokeDasharray="226.19" /* 2 * PI * 36 */
                              strokeDashoffset={226.19 - (226.19 * matchScore) / 100}
                              strokeLinecap="round"
                              className={matchScore > 80 ? "text-green-500" : matchScore > 50 ? "text-yellow-500" : "text-red-500"} 
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center justify-center">
                            <span className="text-xl font-bold text-gray-900 leading-none">{matchScore}</span>
                            <span className="text-[10px] font-semibold text-gray-500">/100</span>
                          </div>
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                          <h4 className="font-bold text-gray-900 mb-1 flex items-center justify-center sm:justify-start gap-1.5">
                            <Sparkles className="w-4 h-4 text-[#f59e0b]" /> Brand Match Score
                          </h4>
                          <p className="text-sm text-gray-700 leading-relaxed">{matchReasoning}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="text-gray-800 space-y-4 text-sm sm:text-base leading-relaxed border-t border-gray-100 pt-6">
                    <ReactMarkdown
                      components={{
                        h1: ({node, ...props}) => <h1 className="text-xl font-bold text-gray-900 mt-6 mb-4" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-lg font-bold text-gray-900 mt-5 mb-3" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-base font-bold text-gray-900 mt-4 mb-2" {...props} />,
                        p: ({node, ...props}) => <p className="mb-4" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />,
                        a: ({node, ...props}) => <a className="text-blue-600 hover:underline" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />
                      }}
                    >
                      {pitch}
                    </ReactMarkdown>
                  </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-4 py-12">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                      <Send className="w-8 h-8 text-gray-300" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-500">No pitch generated yet.</p>
                      <p className="text-sm mt-1">Fill out the campaign details and let AI do the heavy lifting.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
