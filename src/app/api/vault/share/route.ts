import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "@/lib/firebase";
import { randomBytes } from "crypto";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Document ID required" }, { status: 400 });
    }

    const docRef = db.collection("user_history").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const data = doc.data();
    if (data?.email !== session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    let shareId = data?.shareId;

    // If it doesn't have a shareId yet, generate a random short alphanumeric string
    if (!shareId) {
      shareId = randomBytes(4).toString('hex'); // e.g. "a1b2c3d4"
      await docRef.update({ shareId });
    }

    return NextResponse.json({ success: true, shareId });
  } catch (error) {
    console.error("Error generating share link:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
