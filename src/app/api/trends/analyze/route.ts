import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    return NextResponse.json({ error: "Gemini API key is missing or invalid. Please add a valid key to .env" }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const { competitorTopic } = await req.json();

    if (!competitorTopic) {
      return NextResponse.json({ error: "Competitor topic/link is required" }, { status: 400 });
    }

    const prompt = `
You are an elite TikTok and Instagram Reels Strategist.
The user wants to analyze a competitor's content or a trending topic to extract viral hooks and figure out how to adapt them for their own use.

Competitor Topic / Video Idea: "${competitorTopic}"

Instructions:
Analyze this topic and provide exactly 3 "Viral Hooks" that are crushing it right now in this space. For each hook, provide:
1. The Hook Text (the actual 3-second opening line).
2. The Hook Style (e.g., Negative Hook, Curiosity Gap, Contrarian).
3. Adaptation (How the user can use this hook for their own brand).

Return the response STRICTLY as a JSON object matching this schema:
{
  "hooks": [
    {
      "text": "The Hook Text",
      "style": "The Style",
      "adaptation": "How to adapt it"
    }
  ],
  "overallStrategy": "A 1-2 sentence summary of why these types of hooks work for this topic."
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
    console.error("Trends API Error:", error);
    return NextResponse.json({ error: error?.message || "Failed to analyze competitor." }, { status: 500 });
  }
}
