"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { TrendingUp, Target, Sparkles, Video, Search, Activity, Music, Play, AlertCircle } from "lucide-react";

interface Hook {
  text: string;
  style: string;
  adaptation: string;
}

interface AnalysisResult {
  hooks: Hook[];
  overallStrategy: string;
}

interface TrendAlert {
  title: string;
  description: string;
  audioSuggestion: string;
  actionableAdvice: string;
}

export default function TrendsPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<"alerts" | "intel">("alerts");
  
  // Competitor Intel State
  const [competitorTopic, setCompetitorTopic] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  // Trend Alerts State
  const [trends, setTrends] = useState<TrendAlert[]>([]);
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);
  const [trendsError, setTrendsError] = useState("");

  if (status === "unauthenticated") {
    redirect("/");
  }

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!competitorTopic) return;

    setIsAnalyzing(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/trends/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ competitorTopic })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fetchTrends = async () => {
    if (trends.length > 0) return; // Already fetched
    setIsLoadingTrends(true);
    setTrendsError("");
    try {
      const res = await fetch("/api/trends/alerts");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch trends");
      setTrends(data.trends || []);
    } catch (err: any) {
      setTrendsError(err.message);
    } finally {
      setIsLoadingTrends(false);
    }
  };

  // Fetch trends when tab switches to 'alerts'
  if (status === "authenticated" && activeTab === "alerts" && trends.length === 0 && !isLoadingTrends && !trendsError) {
    fetchTrends();
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-pulse w-8 h-8 rounded-full bg-orange-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Navbar Minimal */}
      <nav className="bg-white border-b border-gray-100 py-4 px-6 sticky top-0 z-10 flex justify-between items-center">
        <Link href="/" className="font-black text-xl tracking-tight text-gray-900" style={{ fontFamily: 'var(--font-outfit)' }}>
          RISER.
        </Link>
        <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
           <TrendingUp className="w-4 h-4 text-orange-500" />
           <span className="text-xs font-bold text-orange-700 uppercase tracking-wide">Trends & Intel</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-gray-100/50 p-1.5 rounded-2xl border border-gray-200 backdrop-blur-sm shadow-inner">
            <button
              onClick={() => setActiveTab("alerts")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === "alerts"
                  ? "bg-white text-orange-600 shadow-md ring-1 ring-black/5"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
              }`}
            >
              <Activity className="w-4 h-4" /> Predictive Alerts
            </button>
            <button
              onClick={() => setActiveTab("intel")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === "intel"
                  ? "bg-white text-orange-600 shadow-md ring-1 ring-black/5"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
              }`}
            >
              <Target className="w-4 h-4" /> Competitor Intel
            </button>
          </div>
        </div>

        {activeTab === "intel" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>
                Steal Their Strategy.
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Input a competitor's video topic or link. Our AI will break down their viral hooks and tell you exactly how to adapt them for your own content.
              </p>
            </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-16">
          <form onSubmit={handleAnalyze} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Video className="w-6 h-6 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
            </div>
            <input
              type="text"
              value={competitorTopic}
              onChange={(e) => setCompetitorTopic(e.target.value)}
              placeholder="e.g. Ali Abdaal's video on Productivity, or paste a TikTok link..."
              className="w-full bg-white border-2 border-gray-200 focus:border-orange-500 rounded-2xl py-4 pl-14 pr-36 text-gray-900 font-medium placeholder-gray-400 outline-none shadow-sm transition-all text-lg"
              required
            />
            <div className="absolute inset-y-2 right-2">
              <button
                type="submit"
                disabled={isAnalyzing || !competitorTopic}
                className="h-full px-6 bg-gray-900 hover:bg-black text-white font-bold rounded-xl flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Extracting
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Analyze
                  </>
                )}
              </button>
            </div>
          </form>
          {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
        </div>

        {/* Results Area */}
        {result && (
          <div className="animate-in slide-in-from-bottom-10 fade-in duration-500">
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-6 mb-8 text-center max-w-3xl mx-auto">
              <h3 className="font-bold text-gray-900 flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                The Core Strategy
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {result.overallStrategy}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {result.hooks.map((hook, index) => (
                <div key={index} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-amber-400"></div>
                  
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider mb-4">
                    <Target className="w-3.5 h-3.5" /> Hook #{index + 1}
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-900 mb-6 leading-snug group-hover:text-orange-600 transition-colors">
                    "{hook.text}"
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Psychology Used</span>
                      <p className="text-sm font-medium text-gray-800 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                        {hook.style}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">How to Adapt It</span>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {hook.adaptation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
        )}

        {activeTab === "alerts" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>
                Predictive Trend Radar
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                AI curates highly-predictive trends tailored precisely to your Brand Kit niche, helping you catch the wave before everyone else.
              </p>
            </div>

            {isLoadingTrends ? (
              <div className="flex flex-col items-center justify-center py-20 text-orange-500">
                 <Activity className="w-10 h-10 animate-bounce mb-4" />
                 <p className="font-bold">Scanning the algorithm for emerging trends...</p>
              </div>
            ) : trendsError ? (
              <div className="max-w-xl mx-auto bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 flex items-start gap-4">
                 <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
                 <div>
                   <h4 className="font-bold mb-1">Failed to analyze trends</h4>
                   <p className="text-sm">{trendsError}</p>
                 </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {trends.map((trend, i) => (
                  <div key={i} className="bg-white rounded-3xl p-6 shadow-xl shadow-orange-500/5 border border-orange-50 hover:-translate-y-1 transition-transform duration-300 flex flex-col h-full relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                      <TrendingUp className="w-32 h-32 text-orange-500 transform rotate-12" />
                    </div>
                    
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-4 w-fit">
                      <Activity className="w-3.5 h-3.5" /> Emerging Trend
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-orange-600 transition-colors">
                      {trend.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                      {trend.description}
                    </p>
                    
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-50 p-2 rounded-lg text-blue-500 mt-0.5">
                          <Music className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Audio Suggestion</p>
                          <p className="text-sm font-medium text-gray-800 leading-snug">{trend.audioSuggestion}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-green-50 p-2 rounded-lg text-green-500 mt-0.5">
                          <Play className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">How to execute</p>
                          <p className="text-sm font-medium text-gray-800 leading-snug">{trend.actionableAdvice}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
