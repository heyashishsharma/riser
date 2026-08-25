const fs = require('fs');

async function checkModels() {
  try {
    // Read .env file
    const envContent = fs.readFileSync('.env', 'utf8');
    const match = envContent.match(/GEMINI_API_KEY=["']?([^"'\n]+)["']?/);
    
    if (!match || !match[1]) {
      console.log("No API key found in .env");
      return;
    }
    
    const apiKey = match[1];
    console.log("Checking models for API Key...");
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    if (data.models) {
      console.log("Available models:");
      data.models.forEach(m => {
        if (m.supportedGenerationMethods.includes("generateContent")) {
          console.log(`- ${m.name}`);
        }
      });
    } else {
      console.log("Error or no models:", data);
    }
  } catch (err) {
    console.error("Error checking models:", err);
  }
}

checkModels();
