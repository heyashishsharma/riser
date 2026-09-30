"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { 
  Bot, 
  TrendingUp, 
  Megaphone, 
  BarChart, 
  Briefcase, 
  FileText, 
  HeartHandshake,
  Search,
  Menu,
  Sparkles,
  Users,
  Star,
  Lightbulb
} from "lucide-react";
import SearchSection from "@/components/SearchSection";

function NavItem({ icon, label, href }: { icon: React.ReactNode, label: string, href?: string }) {
  const content = (
    <div className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 rounded-xl px-4 py-2 transition-colors min-w-[80px]">
      <div className="mb-1">{icon}</div>
      <span className="text-[13px] text-gray-600 font-medium whitespace-nowrap">{label}</span>
    </div>
  );

  if (href) {
    return <a href={href} className="no-underline">{content}</a>;
  }
  return content;
}

export default function Home() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHoveringDropdown, setIsHoveringDropdown] = useState(false);

  // Auto-close dropdown after 4 seconds
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isMenuOpen && !isHoveringDropdown) {
      timeoutId = setTimeout(() => {
        setIsMenuOpen(false);
      }, 4000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isMenuOpen, isHoveringDropdown]);

  return (
    <main className="min-h-screen bg-white">

      {/* Navigation Bar */}
      <nav className="bg-white sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-2 border-b border-gray-100 shadow-sm">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            {/* Left: Logo */}
            <div className="flex items-center gap-2 cursor-pointer">
              <span className="font-black text-3xl md:text-4xl tracking-tight text-gray-900" style={{ fontFamily: 'var(--font-outfit)' }}>
                RISER.
              </span>
            </div>

            {/* Center: Nav Pills */}
            <div className="hidden md:flex items-center gap-1 overflow-x-auto">
              <NavItem icon={<Megaphone className="w-6 h-6 text-[#ec4899]" strokeWidth={1.5} />} label="Campaigns" />
              <NavItem icon={<BarChart className="w-6 h-6 text-gray-400" strokeWidth={1.5} />} label="Analytics" />
              <NavItem icon={<Bot className="w-6 h-6 text-[#60a5fa]" strokeWidth={1.5} />} label="AI Copilot" />
              <NavItem icon={<Briefcase className="w-6 h-6 text-[#ef4444]" strokeWidth={1.5} />} label="Sponsorships" />
              <NavItem icon={<Sparkles className="w-6 h-6 text-[#d97706]" strokeWidth={1.5} />} label="Pitch Generator" href="/outreach" />
              <NavItem icon={<Search className="w-6 h-6 text-[#8b5cf6]" strokeWidth={1.5} />} label="Competitor Intel" href="/trends" />
              <NavItem icon={<FileText className="w-6 h-6 text-[#f97316]" strokeWidth={1.5} />} label="Invoicing" href="/invoice" />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              {session ? (
                <div 
                  className="relative"
                  onMouseEnter={() => setIsHoveringDropdown(true)}
                  onMouseLeave={() => setIsHoveringDropdown(false)}
                >
                  <button 
                    type="button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle user menu"
                    aria-expanded={isMenuOpen}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer border border-transparent hover:border-gray-200"
                  >
                    <Menu className="w-5 h-5 text-gray-600 ml-1" />
                    {session.user?.image ? (
                      <img src={session.user.image} alt="Profile" className="w-8 h-8 rounded-full border border-gray-200" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#4a3aff] text-white flex items-center justify-center font-bold text-xs">
                        {session.user?.name?.[0] || 'U'}
                      </div>
                    )}
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-50 mb-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">{session.user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                      </div>
                      <a href="/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#4a3aff] transition-colors">
                        Dashboard
                      </a>
                      <a href="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#4a3aff] transition-colors">
                        Brand Kit
                      </a>
                      <a href="/vault" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#4a3aff] transition-colors">
                        My Vault
                      </a>
                      <div className="border-t border-gray-50 mt-1 pt-1">
                        <button 
                          type="button" 
                          onClick={() => signOut()} 
                          aria-label="Sign out"
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button type="button" onClick={() => signIn("google")} aria-label="Sign in with Google" className="bg-[#4a3aff] text-white px-7 py-2.5 rounded-md text-sm font-semibold hover:bg-[#3b2de0] transition-colors shadow-md cursor-pointer">
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section (Light split layout) */}
      <section className="bg-[#fdfcf8] relative pt-16 lg:pt-28 pb-16 lg:pb-28 overflow-hidden border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
          
          {/* Left Text */}
          <div className="w-full lg:w-1/2 flex flex-col items-start z-10 pt-4 lg:pt-0">
            <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-black mb-6 text-[#111] leading-[0.95] tracking-tight" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              Unforgettable<br />campaigns start<br />with insight.
            </h1>
            <p className="text-lg sm:text-xl text-gray-800 mb-10 max-w-xl font-medium leading-relaxed" style={{ fontFamily: 'var(--font-inter)' }}>
              Influencer marketing built for creators, trusted by brands, and designed for results.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              {/* Button 1: Solid Orange */}
              <button 
                className="bg-[#eb4312] hover:bg-[#d63b0e] text-white font-bold text-sm sm:text-base py-3.5 px-8 transition-colors flex items-center gap-2 cursor-pointer"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)', fontFamily: 'var(--font-outfit)' }}
              >
                Start your campaign <span className="text-lg leading-none">&rarr;</span>
              </button>
              
              {/* Button 2: Outlined */}
              <div 
                className="bg-[#111] p-[1.5px] inline-block"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)' }}
              >
                <button 
                  className="bg-[#fdfcf8] hover:bg-gray-50 text-[#111] font-bold text-sm sm:text-base py-[12.5px] px-[30px] transition-colors flex items-center gap-2 cursor-pointer"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 13px), calc(100% - 13px) 100%, 0 100%)', fontFamily: 'var(--font-outfit)' }}
                >
                  Earn as a creator <span className="text-lg leading-none">&rarr;</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative">
            <div 
              className="w-full max-w-[650px] aspect-[4/3] bg-gray-100 relative overflow-hidden shadow-sm"
              style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)' }}
            >
              <img src="/card1.jpg" alt="Influencer Insight" className="w-full h-full object-cover object-top" />
            </div>
          </div>

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
