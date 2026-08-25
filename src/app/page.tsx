"use client";

import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  Sparkles,
  Heart,
  Users,
  Star,
  Lightbulb,
  Megaphone,
  BarChart,
  Bot,
  Briefcase,
  TrendingUp,
  HeartHandshake,
  FileText
} from "lucide-react";
import SearchSection from "@/components/SearchSection";

function NavItem({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 rounded-xl px-4 py-2 transition-colors min-w-[80px]">
      <div className="mb-1">{icon}</div>
      <span className="text-[13px] text-gray-600 font-medium">{label}</span>
    </div>
  );
}

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen bg-white">

      {/* Navigation Bar */}
      <nav className="bg-white sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-2 border-b border-gray-100 shadow-sm">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            {/* Left: Logo */}
            <div className="flex items-center gap-2 cursor-pointer">
              <Image src="/riser.png" alt="RISER Logo" width={400} height={120} className="w-auto h-16 md:h-20 object-contain" priority />
            </div>

            {/* Center: Nav Pills */}
            <div className="hidden md:flex items-center gap-2">
              <NavItem icon={<Megaphone className="w-6 h-6 text-[#ec4899]" strokeWidth={1.5} />} label="Campaigns" />
              <NavItem icon={<BarChart className="w-6 h-6 text-gray-400" strokeWidth={1.5} />} label="Analytics" />
              <NavItem icon={<Bot className="w-6 h-6 text-[#60a5fa]" strokeWidth={1.5} />} label="AI Copilot" />
              <NavItem icon={<Briefcase className="w-6 h-6 text-[#ef4444]" strokeWidth={1.5} />} label="Sponsorships" />
              <NavItem icon={<TrendingUp className="w-6 h-6 text-[#d97706]" strokeWidth={1.5} />} label="Trends" />
              <NavItem icon={<FileText className="w-6 h-6 text-[#8b5cf6]" strokeWidth={1.5} />} label="Script" />
              <NavItem icon={<HeartHandshake className="w-6 h-6 text-[#f97316]" strokeWidth={1.5} />} label="Community" />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <button type="button" className="p-2.5 rounded-md bg-[#f4f3ff] text-[#4a3aff] hover:bg-[#e0e7ff] transition-colors cursor-pointer">
                <Heart className="w-5 h-5 fill-current" />
              </button>
              {session ? (
                <div className="flex items-center gap-3">
                  {session.user?.image && (
                    <img src={session.user.image} alt="Profile" className="w-9 h-9 rounded-full border border-gray-200" />
                  )}
                  <button type="button" onClick={() => signOut()} className="bg-white text-gray-700 border border-gray-200 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
                    Sign Out
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => signIn("google")} className="bg-[#4a3aff] text-white px-7 py-2.5 rounded-md text-sm font-semibold hover:bg-[#3b2de0] transition-colors shadow-md cursor-pointer">
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section (Yellow) */}
      <section className="bg-[#ffe400] relative pt-12 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative flex justify-center items-center z-10 py-16">
          {/* Fortune Cookie Style Banner */}
          <div className="bg-white px-10 py-5 sm:px-16 sm:py-8 transform rotate-[-2deg] shadow-xl relative">
            <h2 className="text-[2.5rem] sm:text-[4rem] md:text-[5rem] font-black text-black leading-[0.9] text-center" style={{ fontFamily: 'var(--font-outfit)' }}>
              LET'S GROW<br />FASTER TODAY
            </h2>
            {/* Confetti / Paper shards */}
            <div className="absolute top-[-15px] left-[15%] w-3 h-8 bg-white transform rotate-45"></div>
            <div className="absolute top-[-25px] left-[35%] w-4 h-6 bg-white transform -rotate-12"></div>
            <div className="absolute top-[40%] right-[-15px] w-8 h-4 bg-[#f0d8a8] transform rotate-[-30deg]"></div>
            <div className="absolute top-[60%] left-[-15px] w-6 h-4 bg-[#f0d8a8] transform rotate-[10deg]"></div>
            <div className="absolute bottom-[-15px] left-[30%] w-6 h-5 bg-[#f0d8a8] transform rotate-[15deg]"></div>
            <div className="absolute bottom-[-20px] right-[25%] w-4 h-8 bg-white transform -rotate-[25deg]"></div>
          </div>
        </div>
        {/* Wavy bottom border SVG */}
        <div className="absolute bottom-[-2px] left-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-full h-[40px] sm:h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,114.1,189.92,97.4,233.15,85.16,277.58,64.55,321.39,56.44Z" fill="#ffffff"></path>
          </svg>
        </div>
      </section>

      {/* Search & Content Section */}
      <section className="bg-white text-center py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-[10px] sm:text-xs font-bold text-gray-400 tracking-widest mb-3 uppercase">AI-POWERED INFLUENCER GROWTH</p>
          <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold text-[#4a3aff] mb-3 leading-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
            Let your AI Agent analyze your audience & secure sponsorships
          </h1>
          <p className="text-xl sm:text-2xl text-gray-800 mb-10 font-normal">
            Generate viral ideas, track trends, and grow faster!
          </p>

          {/* Search Bar */}
          <SearchSection />

          {/* Stats */}
          <div className="max-w-3xl mx-auto mt-12 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 md:gap-8 text-sm font-semibold text-[#10b981]">
            <div className="flex items-center gap-2">
              <div className="bg-green-100 p-1.5 rounded-full"><Users className="w-4 h-4 text-[#10b981]" strokeWidth={3} /></div>
              <span>50K+ <span className="text-gray-500 font-medium">Creators</span></span>
            </div>
            <div className="hidden sm:block text-gray-300 border-l border-dashed border-gray-300 h-5"></div>
            <div className="flex items-center gap-2">
              <div className="bg-green-100 p-1.5 rounded-full"><Sparkles className="w-4 h-4 text-[#10b981]" strokeWidth={3} /></div>
              <span>1M+ <span className="text-gray-500 font-medium">AI Ideas Generated</span></span>
            </div>
            <div className="hidden sm:block text-gray-300 border-l border-dashed border-gray-300 h-5"></div>
            <div className="flex items-center gap-2">
              <div className="bg-green-100 p-1.5 rounded-full"><Star className="w-4 h-4 text-[#10b981]" strokeWidth={3} /></div>
              <span>4.9/5 <span className="text-gray-500 font-medium">Brand Satisfaction</span></span>
            </div>
          </div>

          {/* Tip Pill */}
          <div className="mt-8 inline-flex items-center gap-2.5 bg-[#f0f7ff] border border-[#e0efff] rounded-full px-5 py-2.5 text-xs sm:text-sm text-gray-700 shadow-sm">
            <div className="bg-[#fbbf24] p-1 rounded-full flex-shrink-0">
              <Lightbulb className="w-4 h-4 text-white" />
            </div>
            <span className="text-left">
              <strong>Find Best Sponsors</strong> by asking your AI agent • Works with <span className="text-[#4a3aff] font-semibold">Instagram</span> & <span className="text-[#4a3aff] font-semibold">TikTok</span>
            </span>
          </div>
        </div>
      </section>

    </main>
  );
}
