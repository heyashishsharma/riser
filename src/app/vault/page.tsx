import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { db } from "@/lib/firebase";
import { redirect } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles, Clock } from "lucide-react";
import Link from "next/link";

export default async function VaultPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/"); // Redirect to home if not logged in
  }

  // Fetch history from Firestore
  const historyRef = db.collection("user_history");
  const snapshot = await historyRef
    .where("email", "==", session.user.email)
    .orderBy("createdAt", "desc")
    .limit(50)
    .get();

  const historyItems = snapshot.docs.map((doc: any) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt ? new Date(data.createdAt._seconds * 1000) : new Date(),
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-5">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>My Vault</h1>
            <p className="text-gray-500 mt-2 text-sm">Your saved AI ideas, scripts, and campaigns.</p>
          </div>
          <Link href="/" className="text-sm font-medium text-[#4a3aff] hover:text-[#3b2de0] transition-colors">
            &larr; Back to Search
          </Link>
        </div>

        {historyItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Your Vault is empty</h3>
            <p className="text-gray-500 mt-2">Generate some ideas using the AI Copilot, and they will automatically appear here!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {historyItems.map((item: any) => (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-[400px]">
                {/* Header */}
                <div className="p-5 border-b border-gray-50 bg-gray-50/50 flex-shrink-0">
                  <div className="flex justify-between items-start mb-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f4f3ff] text-[#4a3aff] text-xs font-bold uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span className="flex items-center text-xs text-gray-400 gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {item.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2" title={item.query}>
                    "{item.query}"
                  </h3>
                </div>
                
                {/* Body (Markdown Content) */}
                <div className="p-5 overflow-y-auto flex-1 relative custom-scrollbar">
                  <div className="text-gray-700 text-sm [&_code]:bg-gray-100 [&_code]:text-gray-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_pre_code]:bg-transparent [&_pre_code]:text-inherit [&_pre_code]:p-0 [&_p]:mb-3 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mb-2 [&_h3]:text-md [&_h3]:font-bold [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {item.response}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
