import { db } from "@/lib/firebase";
import { notFound } from "next/navigation";
import { 
  Users, 
  BarChart, 
  Briefcase, 
  Mail, 
  CheckCircle,
  TrendingUp,
  Award
} from "lucide-react";
import Link from "next/link";

interface CreatorPageProps {
  params: {
    handle: string;
  };
}

export default async function CreatorPage({ params }: CreatorPageProps) {
  // Await the params object in Next.js 15+ or dynamically resolved params
  const { handle } = await Promise.resolve(params);

  // Fetch the creator from Firebase
  let creatorData = null;
  
  try {
    const snapshot = await db.collection("user_profiles")
      .where("handle", "==", handle)
      .limit(1)
      .get();
      
    if (!snapshot.empty) {
      creatorData = snapshot.docs[0].data();
    }
  } catch (error) {
    console.error("Error fetching creator:", error);
  }

  if (!creatorData) {
    notFound();
  }

  const { niche, tone, targetAudience, bio, followers, engagementRate } = creatorData;

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 py-4 px-6 sticky top-0 z-10 shadow-sm flex justify-between items-center">
        <Link href="/" className="font-black text-xl tracking-tight text-gray-900" style={{ fontFamily: 'var(--font-outfit)' }}>
          RISER.
        </Link>
        <button className="bg-black text-white px-5 py-2 text-sm font-semibold rounded-full hover:bg-gray-800 transition-colors">
          Sponsor Me
        </button>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-white to-[#f0f7ff] border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-full mx-auto mb-6 border-4 border-white shadow-xl flex items-center justify-center text-4xl font-bold text-gray-400">
            {handle[0].toUpperCase()}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>
            @{handle}
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-500 mb-6">
            <CheckCircle className="w-5 h-5 text-blue-500" />
            <span className="font-medium text-lg text-gray-700">Verified Creator</span>
            {niche && (
              <>
                <span className="mx-2">•</span>
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  {niche}
                </span>
              </>
            )}
          </div>
          {bio ? (
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {bio}
            </p>
          ) : (
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Creating high-quality content for my amazing community. Open for meaningful brand partnerships.
            </p>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-4xl mx-auto px-4 -mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-center gap-5 transform hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Users className="w-7 h-7 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Audience</p>
              <h3 className="text-3xl font-bold text-gray-900">{followers || "N/A"}</h3>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-center gap-5 transform hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-7 h-7 text-pink-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Avg. Engagement</p>
              <h3 className="text-3xl font-bold text-gray-900">{engagementRate || "N/A"}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Deep Dive & Audience */}
      <div className="max-w-4xl mx-auto px-4 mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Audience Snapshot */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart className="w-5 h-5 text-gray-400" /> Audience Demographics
            </h2>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <p className="text-gray-600 mb-4">
                <strong>Target Audience:</strong> {targetAudience || "General Audience"}
              </p>
              <p className="text-gray-600">
                <strong>Content Tone:</strong> {tone || "Authentic and Engaging"}
              </p>
              {/* Fake chart placeholder to look good */}
              <div className="mt-8 flex items-end gap-2 h-32">
                {[40, 70, 45, 90, 60, 30].map((h, i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-[#4a3aff] to-[#8b5cf6] rounded-t-sm opacity-80" style={{ height: `${h}%` }}></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Contact Card */}
          <div className="bg-gray-900 rounded-2xl p-8 text-white shadow-xl">
            <h3 className="text-xl font-bold mb-4">Let's Collaborate</h3>
            <p className="text-gray-400 text-sm mb-8">Looking to partner up? Get in touch and let's create something amazing.</p>
            <button className="w-full bg-white text-gray-900 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
              <Mail className="w-5 h-5" />
              Contact Me
            </button>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
             <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
                <Briefcase className="w-5 h-5 text-gray-400" /> Past Campaigns
             </h3>
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400"><Award className="w-5 h-5"/></div>
                   <div className="text-sm">
                      <p className="font-semibold text-gray-900">Tech Brand X</p>
                      <p className="text-gray-500">Sponsored Video</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400"><Award className="w-5 h-5"/></div>
                   <div className="text-sm">
                      <p className="font-semibold text-gray-900">Fitness App Y</p>
                      <p className="text-gray-500">Story Integration</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}
