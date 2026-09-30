import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "@/lib/firebase";

export async function GET(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    return NextResponse.json({ error: "Gemini API key is missing or invalid. Please add a valid key to .env" }, { status: 500 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userDoc = await db.collection("user_profiles").doc(session.user.email).get();
    let niche = "General Creator";
    let audience = "General Audience";

    if (userDoc.exists) {
      const data = userDoc.data();
      niche = data?.niche || niche;
      audience = data?.audience || audience;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const prompt = `
You are an advanced AI Trend Forecaster for TikTok, Instagram Reels, and YouTube Shorts.
The user is a creator in the following niche: "${niche}"
Their target audience is: "${audience}"

Instructions:
Generate 3 emerging, highly predictive content trends that are just starting to take off in this exact niche. For each trend, provide:
1. "title": A catchy, concise name for the trend.
2. "description": A 2-sentence explanation of what the trend is and why it's gaining traction right now.
3. "audioSuggestion": A specific type of trending audio, soundbite, or music genre that pairs perfectly with this trend.
4. "actionableAdvice": Exactly how the creator should film/edit this to maximize engagement.

Return the response STRICTLY as a JSON object matching this schema:
{
  "trends": [
    {
      "title": "Trend Title",
      "description": "What it is and why it works.",
      "audioSuggestion": "Audio idea",
      "actionableAdvice": "How to film it"
    }
  ]
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
    console.error("Trend Alerts API Error:", error);
    return NextResponse.json({ error: error?.message || "Failed to fetch trend alerts." }, { status: 500 });
  }
}
