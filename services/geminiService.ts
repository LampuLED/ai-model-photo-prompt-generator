import { Part } from "@google/genai";

// This function now calls YOUR backend server, not Google's API directly.
export const generatePromptFromApi = async (
  base64Image: string,
  customDetails: string,
  extraDetails: string
): Promise<string> => {
  try {
    const response = await fetch('/api/generate-prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ base64Image, customDetails, extraDetails }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate prompt from the backend.');
    }

    const data = await response.json();
    return data.prompt;
  } catch (error) {
    console.error("Backend API call failed:", error);
    throw error;
  }
};

// This function also calls YOUR backend server.
export const generateImageFromPrompt = async (prompt: string, baseImages: string[]): Promise<string> => {
  try {
    const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, baseImages }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image from the backend.');
    }

    const data = await response.json();
    return data.imageData;
  } catch (error) {
    console.error("Backend Image Generation API call failed:", error);
    throw error;
  }
};
