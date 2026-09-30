import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "@/lib/firebase";

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    return NextResponse.json({ error: "Gemini API key is missing or invalid. Please add a valid key to .env" }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const { brandName, productInfo } = await req.json();

    if (!brandName || !productInfo) {
      return NextResponse.json({ error: "Brand name and product info are required" }, { status: 400 });
    }

    let brandContext = "";
    try {
      const session = await getServerSession(authOptions);
      if (session?.user?.email) {
        const profileDoc = await db.collection("user_profiles").doc(session.user.email).get();
        if (profileDoc.exists) {
          const { niche, tone, targetAudience, followers, engagementRate, handle } = profileDoc.data() || {};
          brandContext = `\n\nCREATOR CONTEXT (Use this to customize the pitch):
- Creator Handle: ${handle || "Not set"}
- Niche/Industry: ${niche || "Not set"}
- Brand Voice/Tone: ${tone || "Professional and engaging"}
- Target Audience: ${targetAudience || "Not set"}
- Followers: ${followers || "Not set"}
- Engagement Rate: ${engagementRate || "Not set"}
`;
        }
      }
    } catch (e) {
      console.error("Failed to fetch brand kit context", e);
    }

    const prompt = `
You are an expert PR manager and influencer outreach specialist. Your goal is to write a highly converting, personalized cold pitch email from a creator to a brand, and also evaluate how good of a match this creator is for the brand.

Brand Name: ${brandName}
Product/Campaign Info: ${productInfo}
${brandContext}

Instructions:
1. Evaluate the match between the creator and the brand (0 to 100). Consider the creator's niche, tone, and audience vs what the brand typically looks for.
2. Provide a 1-2 sentence reasoning for why you gave this score.
3. Write a professional, catchy, and concise email pitch. The email should:
   - Have a strong, attention-grabbing subject line.
   - Quickly introduce the creator and their niche.
   - Express genuine interest in the specific product.
   - Highlight the creator's audience stats as a value proposition.
   - End with a clear call to action (e.g., asking for a quick call or to send a media kit).

Return the response STRICTLY as a JSON object matching this schema:
{
  "matchScore": 85,
  "matchReasoning": "Your niche in tech reviews aligns perfectly with their new product, and your engagement rate is strong.",
  "pitch": "Subject: ... \\n\\nHi [Name],\\n\\n..."
}
`;

    const modelsToTry = ["gemini-3.5-flash", "gemini-3.6-flash", "gemini-3.7-flash", "gemini-2.5-flash"];
    let responseText = "";

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        responseText = result.response.text();
        break; 
      } catch (err: any) {
        console.warn(`Model ${modelName} failed. Trying next...`);
      }
    }

    if (!responseText) {
      throw new Error("All AI models failed to generate a response. Please try again later.");
    }

    let parsedResponse;
    try {
      const cleanedText = responseText.replace(/```json/gi, '').replace(/```/gi, '').trim();
      parsedResponse = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse JSON. Raw response:", responseText);
      throw new Error("AI generated an invalid response format.");
    }

    return NextResponse.json(parsedResponse);
  } catch (error: any) {
    console.error("Outreach API Error:", error);
    return NextResponse.json({ error: error?.message || "Failed to generate pitch." }, { status: 500 });
  }
}
