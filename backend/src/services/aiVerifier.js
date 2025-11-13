// backend/src/services/aiVerifier.js
// Real AI analysis using Google Gemini API

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { API_KEY } = require('../config');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(API_KEY);

// Pharmaceutical verification prompt
const VERIFICATION_PROMPT = `You are a pharmaceutical verification expert. Analyze this image of a medicine package for any signs of being counterfeit or genuine.

Please carefully examine:
1. Logo quality and clarity
2. Font clarity and printing quality
3. Batch number text quality and format (CRITICAL: Extract the exact batch number)
4. Physical appearance of packaging
5. Color consistency and quality
6. Holographic or security features (if visible)
7. Text alignment and spacing
8. Overall packaging integrity

Provide your analysis in this exact format:

AUTHENTICITY_SCORE: [0-100]
STATUS: [authentic/suspect/counterfeit]
BATCH_NUMBER: [exact batch number visible on package, or "NOT_FOUND"]
FINDINGS:
- [Finding 1]
- [Finding 2]
- [Finding 3]
- [Finding 4]
- [Finding 5]

Be thorough and professional in your assessment. IMPORTANT: Extract the batch number exactly as it appears on the package.`;

/**
 * Convert file buffer to base64 for Gemini API
 */
function fileToGenerativePart(file) {
  return {
    inlineData: {
      data: file.buffer.toString('base64'),
      mimeType: file.mimetype,
    },
  };
}

/**
 * Parse Gemini response to extract score, status, batch number, and findings
 */
function parseGeminiResponse(text) {
  try {
    // Extract authenticity score
    const scoreMatch = text.match(/AUTHENTICITY_SCORE:\s*(\d+)/i);
    const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 75;

    // Extract status
    const statusMatch = text.match(/STATUS:\s*(authentic|suspect|counterfeit)/i);
    let status = statusMatch ? statusMatch[1].toLowerCase() : 'suspect';

    // Extract batch number
    const batchMatch = text.match(/BATCH_NUMBER:\s*([^\n]+)/i);
    let batchNumber = batchMatch ? batchMatch[1].trim() : null;
    if (batchNumber === 'NOT_FOUND' || batchNumber === 'N/A' || batchNumber === 'None') {
      batchNumber = null;
    }

    // Extract findings
    const findingsMatch = text.match(/FINDINGS:([\s\S]*?)(?=\n\n|\*\*|$)/i);
    let hints = [];
    
    if (findingsMatch) {
      const findingsText = findingsMatch[1];
      hints = findingsText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('-') || line.startsWith('*'))
        .map(line => line.replace(/^[-*]\s*/, '').trim())
        .filter(Boolean);
    }

    // If no findings extracted, try to extract bullet points from entire response
    if (hints.length === 0) {
      hints = text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('-') || line.startsWith('*'))
        .map(line => line.replace(/^[-*]\s*/, '').trim())
        .filter(Boolean)
        .slice(0, 5); // Limit to 5 findings
    }

    // Ensure we have at least some hints
    if (hints.length === 0) {
      hints = ['Analysis completed - See detailed report above'];
    }

    return { score, status, batchNumber, hints };
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    return {
      score: 70,
      status: 'suspect',
      batchNumber: null,
      hints: ['Unable to parse detailed analysis', 'Manual verification recommended'],
    };
  }
}

/**
 * Analyze images using Gemini API
 */
exports.analyze = async (files) => {
  try {
    if (!API_KEY) {
      throw new Error('API_KEY not configured. Please add your Google API key to .env file.');
    }

    // Use Gemini Pro Vision model for image analysis
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Convert first image to format required by Gemini
    const imageParts = files.slice(0, 3).map(fileToGenerativePart); // Analyze up to 3 images

    // Generate content with image and prompt
    const result = await model.generateContent([
      VERIFICATION_PROMPT,
      ...imageParts,
    ]);

    const response = await result.response;
    const text = response.text();

    console.log('Gemini API Response:', text);

    // Parse the response to extract structured data
    const analysis = parseGeminiResponse(text);

    return {
      score: analysis.score,
      status: analysis.status,
      batchNumber: analysis.batchNumber,
      hints: analysis.hints,
      fullAnalysis: text, // Include full text for debugging
    };

  } catch (error) {
    console.error('Gemini API Error:', error.message);
    
    // Fallback to simulated analysis if API fails
    return {
      score: 75,
      status: 'suspect',
      hints: [
        'AI analysis temporarily unavailable',
        'Manual verification recommended',
        `Error: ${error.message}`,
      ],
      error: error.message,
    };
  }
};
