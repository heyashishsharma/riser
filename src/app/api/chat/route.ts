import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    return NextResponse.json({ error: "Gemini API key is missing or invalid. Please add a valid key to .env" }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const { query, filter } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    let filterContext = filter && filter !== 'All'
      ? `The user has explicitly selected the filter: "${filter}". Focus your response heavily on ${filter}. `
      : `If the query does not contain a link, classify this query into one of the following categories: Trending, Ideas, Campaigns, Community, Analytics, Sponsorships, or General. `;

    let linkInstructions = (filter === 'Campaigns' || filter === 'Sponsors')
      ? `\n\nCRITICAL FOR CAMPAIGNS & SPONSORS: You MUST provide reference links for campaigns and sponsors. Use Markdown link syntax (e.g., [Example Brand](https://example.com)). If the website is unable to showcase specific real ones, provide highly realistic simulated reference links or well-known platform links (like [Instagram Creator Marketplace](https://creators.instagram.com) or [YouTube BrandConnect](https://brandconnect.youtube.com)).`
      : '';

    if (filter === 'Script') {
      filterContext = `The user has explicitly selected the filter: "Script". You must act as an elite, professional scriptwriter and content strategist. Your goal is to write a highly engaging, well-structured script based on the user's prompt. Pay close attention to pacing, tone, and audience retention hooks. Write the script in the specific language requested by the user, if mentioned in their query. `;
      linkInstructions = `\n\nCRITICAL FOR SCRIPT WRITING: Present the script in a highly professional, uncluttered Markdown format. Use clear headings for sections (e.g., **Hook (0-3s)**, **Body**, **Call to Action**). DO NOT use tables, as they cause horizontal scrolling. Instead, use a strict vertical layout for each segment. For example, use bold labels like **🎥 Visual:** followed by **🎙️ Audio/Voiceover:** on the next line. Format the dialogue clearly so a creator can read it effortlessly during filming. The script must be detailed, logically paced, and impeccably organized.`;
    }

    const prompt = `
You are an expert AI assistant for a social media growth and influencer platform called "RISER".
The user has asked the following question/query: "${query}"

${filterContext}

First, check if the query contains a link or URL to a social media profile or post (e.g. Instagram, TikTok, YouTube). 
If it DOES contain a link:
1. Classify the category strictly as "Analytics".
2. Act as an advanced Analytics Engine. Extract the platform and handle/content from the URL.
3. Generate a highly realistic, SIMULATED analytics report for that specific link. Include estimated numbers for Followers, Average Views, Engagement Rate, and Viral Potential. Format the stats cleanly.

If it DOES NOT contain a link:
1. Categorize it appropriately (use the selected filter if applicable).
2. Provide a helpful, comprehensive, and highly actionable response. Use rich Markdown formatting (headings, bullet points, bold text, etc.) to make it look like a high-quality Google Gemini or ChatGPT response.${linkInstructions}

Respond strictly in JSON format matching this schema:
{
  "category": "The matched category",
  "response": "Your helpful response or simulated analytics report formatted in Markdown"
}
`;

    const modelsToTry = ["gemini-3.5-flash", "gemini-1.5-pro", "gemini-1.5-flash"];
    let responseText = "";
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        responseText = result.response.text();
        break; // Success, exit the loop
      } catch (err: any) {
        console.warn(`Model ${modelName} failed. Trying next... Error: ${err.message}`);
        lastError = err;
      }
    }

    if (!responseText) {
      throw lastError || new Error("All fallback models failed.");
    }

    // Parse the JSON block safely. Sometimes the model wraps it in \`\`\`json ... \`\`\`
    const cleanedText = responseText.replace(/```json/gi, '').replace(/```/gi, '').trim();

    let data;
    try {
      data = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse JSON. Raw response:", responseText);
      // Fallback if AI didn't return valid JSON
      data = {
        category: filter && filter !== 'All' ? filter : "General",
        response: responseText
      };
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Send back the actual error message from the Google API to help debugging
    return NextResponse.json({ error: error?.message || "Failed to generate AI response. Make sure your API key is valid." }, { status: 500 });
  }
}
