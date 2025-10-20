// To use @google/genai, you'd run `npm install @google/genai` in your project
import { GoogleGenAI } from '@google/genai';

// This is the main function Vercel will run
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { base64Image, customDetails, extraDetails } = req.body;

    if (!base64Image) {
      return res.status(400).json({ error: 'Missing base image' });
    }
    
    // IMPORTANT: Access the API key securely from environment variables
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const systemPrompt = `You are a world-class AI prompt engineer... (Your full system prompt here)`; // Add your full system prompt
    const userQuery = `Analyze this image and combine it with the following custom details: [USER CUSTOM DETAILS]: ${customDetails}.${extraDetails} Create the final prompt by merging the visual analysis of the image with the custom details provided.`;

    const parts = [
        { text: userQuery },
        { inlineData: { mimeType: "image/jpeg", data: base64Image } },
    ];

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts: parts },
        config: { systemInstruction: systemPrompt }
    });

    res.status(200).json({ prompt: response.text });

  } catch (error) {
    console.error("Server-side Gemini Error:", error);
    res.status(500).json({ error: 'Failed to communicate with the Gemini API.' });
  }
}