const fs = require('fs');

let apiKey = '';
try {
  const envContent = fs.readFileSync('.env', 'utf-8');
  const match = envContent.match(/GEMINI_API_KEY=([^\s]+)/);
  if (match) apiKey = match[1];
} catch (e) {}

if (!apiKey) {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf-8');
    const match = envContent.match(/GEMINI_API_KEY=([^\s]+)/);
    if (match) apiKey = match[1];
  } catch (e) {}
}

async function run() {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await res.json();
    if (data.models) {
      console.log(JSON.stringify(data.models.map(m => m.name), null, 2));
    } else {
      console.log(data);
    }
  } catch (e) {
    console.error(e);
  }
}

run();
