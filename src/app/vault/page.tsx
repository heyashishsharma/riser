import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { db } from "@/lib/firebase";
import { redirect } from "next/navigation";
import Link from "next/link";
import VaultView from "./VaultView";

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
      createdAt: data.createdAt ? new Date(data.createdAt._seconds * 1000).toISOString() : new Date().toISOString(),
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

        <VaultView initialItems={historyItems} />
      </div>
    </div>
  );
}
