// Test AI medicine info service
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = 'AIzaSyBzIuvcqo4Hy0nXKK89v-LXXbkBB49eFa4';
const genAI = new GoogleGenerativeAI(API_KEY);

async function testAI() {
  try {
    console.log('Testing Gemini AI for medicine information...\n');
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `Provide information about the medicine: Ciprofloxacin

Respond in JSON format:
{
  "name": "Medicine name",
  "description": "What it's used for",
  "warnings": ["warning1", "warning2"]
}`;

    console.log('Sending request to Gemini AI...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('\n✅ AI Response:');
    console.log(text);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

testAI();
