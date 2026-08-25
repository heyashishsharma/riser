"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Settings, Save, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [niche, setNiche] = useState("");
  const [tone, setTone] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/");
    }
    
    if (status === "authenticated") {
      // Fetch existing profile
      fetch("/api/settings/profile")
        .then(res => res.json())
        .then(data => {
          if (data.profile) {
            setNiche(data.profile.niche || "");
            setTone(data.profile.tone || "");
            setTargetAudience(data.profile.targetAudience || "");
          }
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Failed to load profile", err);
          setIsLoading(false);
        });
    }
  }, [status]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setShowSuccess(false);

    try {
      const res = await fetch("/api/settings/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, tone, targetAudience })
      });

      if (res.ok) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Failed to save profile", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex justify-center">
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
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-5">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2" style={{ fontFamily: 'var(--font-outfit)' }}>
              <Settings className="w-7 h-7 text-[#4a3aff]" />
              Brand Kit Settings
            </h1>
            <p className="text-gray-500 mt-2 text-sm">Define your brand context. The AI will automatically apply this to your generated content.</p>
          </div>
          <Link href="/" className="text-sm font-medium text-[#4a3aff] hover:text-[#3b2de0] transition-colors">
            &larr; Back to Search
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <form onSubmit={handleSave} className="p-8 space-y-6">
            <div>
              <label htmlFor="niche" className="block text-sm font-semibold text-gray-900 mb-2">Your Niche / Industry</label>
              <input
                type="text"
                id="niche"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g. Tech Reviews, Fitness Coach, SaaS Startup..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#4a3aff]/20 focus:border-[#4a3aff] outline-none transition-all text-sm text-gray-900"
              />
              <p className="mt-1.5 text-xs text-gray-500">What specific topic or industry does your content cover?</p>
            </div>

            <div>
              <label htmlFor="tone" className="block text-sm font-semibold text-gray-900 mb-2">Brand Voice / Tone</label>
              <input
                type="text"
                id="tone"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                placeholder="e.g. Energetic and punchy, Professional but friendly..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#4a3aff]/20 focus:border-[#4a3aff] outline-none transition-all text-sm text-gray-900"
              />
              <p className="mt-1.5 text-xs text-gray-500">How do you sound? This helps the AI write scripts that sound like you.</p>
            </div>

            <div>
              <label htmlFor="targetAudience" className="block text-sm font-semibold text-gray-900 mb-2">Target Audience</label>
              <input
                type="text"
                id="targetAudience"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Gen-Z college students, B2B Marketing Managers..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#4a3aff]/20 focus:border-[#4a3aff] outline-none transition-all text-sm text-gray-900"
              />
              <p className="mt-1.5 text-xs text-gray-500">Who is your ideal viewer or customer?</p>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-gray-100">
              <div className="h-6">
                {showSuccess && (
                  <span className="flex items-center text-sm font-medium text-green-600 animate-in fade-in duration-300">
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    Profile saved successfully!
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center px-6 py-2.5 bg-[#4a3aff] text-white font-semibold text-sm rounded-xl hover:bg-[#3b2de0] hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 cursor-pointer"
              >
                {isSaving ? "Saving..." : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Brand Kit
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
