// List available Gemini models
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = 'AIzaSyBzIuvcqo4Hy0nXKK89v-LXXbkBB49eFa4';
const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
  try {
    console.log('Listing available Gemini models...\n');
    
    // Try to list models
    const models = await genAI.listModels();
    
    console.log('Available models:');
    for (const model of models) {
      console.log(`- ${model.name}`);
    }
    
  } catch (error) {
    console.error('Error listing models:', error.message);
    
    // Try simple generation with different model names
    console.log('\n Testing different model names...\n');
    
    const modelsToTry = [
      'gemini-pro',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'models/gemini-pro',
      'models/gemini-1.5-flash'
    ];
    
    for (const modelName of modelsToTry) {
      try {
        console.log(`Testing: ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Say hi');
        const response = await result.response;
        console.log(`✅ ${modelName} WORKS!`);
        console.log(`   Response: ${response.text().substring(0, 50)}...\n`);
        break; // Found working model
      } catch (err) {
        console.log(`❌ ${modelName} failed: ${err.message.substring(0, 80)}...\n`);
      }
    }
  }
}

listModels();
