import { GoogleGenAI, Modality } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { prompt, baseImages } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const parts = [];
    if (baseImages && baseImages.length > 0) {
      baseImages.forEach(image => parts.push({ inlineData: { mimeType: 'image/jpeg', data: image } }));
    }
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: { parts },
        config: { responseModalities: [Modality.IMAGE] },
    });

    const imageData = response.candidates[0].content.parts[0].inlineData.data;
    res.status(200).json({ imageData });

  } catch (error) {
    console.error("Server-side Gemini Image Gen Error:", error);
    res.status(500).json({ error: 'Failed to generate image with Gemini API.' });
  }
}