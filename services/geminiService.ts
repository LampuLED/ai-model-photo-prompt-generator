import { GoogleGenAI, Modality } from "@google/genai";
import { MODEL_NAME, IMAGE_MODEL_NAME } from '../constants';

// Initialize the Google GenAI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a descriptive prompt from an image and text details using the Gemini API.
 * This function now calls the Gemini API directly.
 */
export const generatePromptFromApi = async (
  base64Image: string,
  customDetails: string,
  extraDetails: string
): Promise<string> => {
  try {
    const imagePart = {
      inlineData: {
        // The app's UI component for the main image assumes JPEG for display,
        // so we'll consistently use 'image/jpeg' for the API call.
        mimeType: 'image/jpeg',
        data: base64Image,
      },
    };
    
    const textPrompt = `Analyze this character image and generate a highly detailed, descriptive prompt for an AI image generator. The goal is to recreate a similar character but with artistic freedom. The prompt should be a single, continuous paragraph of text. Do not use markdown, line breaks, or lists. Focus on describing the character's appearance, clothing, expression, and overall mood. Incorporate these specific stylistic details: ${customDetails}. Also, add these extra details from the user: ${extraDetails}. Finally, combine everything into a cohesive, imaginative, and rich prompt that will inspire a creative AI image generation.`;

    const response = await ai.models.generateContent({
        model: MODEL_NAME, // "gemini-2.5-flash"
        contents: { parts: [imagePart, { text: textPrompt }] },
    });

    if (response && response.text) {
      return response.text;
    } else {
      throw new Error("API returned an empty response for prompt generation.");
    }
  } catch (error) {
    console.error("Gemini API call for prompt generation failed:", error);
    throw new Error("Failed to generate prompt with Gemini API. Please check the console for more details.");
  }
};

/**
 * Generates an image from a prompt and base images using the Gemini API.
 * This function now calls the Gemini API directly.
 */
export const generateImageFromPrompt = async (prompt: string, baseImages: string[]): Promise<string> => {
  try {
    if (!baseImages || baseImages.length === 0) {
      throw new Error("At least one base image is required for image generation.");
    }

    const imageParts = baseImages.map(imgData => ({
      inlineData: {
        // Assuming JPEG for consistency, as other parts of the app do.
        mimeType: 'image/jpeg',
        data: imgData,
      },
    }));

    const textPart = { text: prompt };
    const allParts = [...imageParts, textPart];

    const response = await ai.models.generateContent({
        model: IMAGE_MODEL_NAME, // "gemini-2.5-flash-image"
        contents: { parts: allParts },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    // Extract the base64 image data from the response.
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }

    throw new Error("No image data found in the Gemini API response.");
  } catch (error) {
    console.error("Gemini API call for image generation failed:", error);
    throw new Error("Failed to generate image with Gemini API. Please check the console for more details.");
  }
};
