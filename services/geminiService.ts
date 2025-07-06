
import { GoogleGenAI } from "@google/genai";
import { STORY_CATEGORIES } from "../constants";

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateStoryFromPrompt = async (prompt: string): Promise<{ title: string; content: string; category: string; }> => {
  if (!process.env.API_KEY) {
    throw new Error("API key is not configured. Cannot generate story.");
  }
  
  try {
    const categoriesString = STORY_CATEGORIES.join(', ');
    const fullPrompt = `Based on the following idea: "${prompt}", generate a short story in Arabic. Provide the response as a single JSON object with three keys: "title" (in Arabic), "content" (in Arabic), and "category". For the "category", choose the most relevant one from this list: [${categoriesString}]. Do not include any other text or markdown formatting.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsedData = JSON.parse(jsonStr);

    if (parsedData.title && parsedData.content && parsedData.category) {
      // Validate if the category is one of the allowed ones.
      const foundCategory = STORY_CATEGORIES.find(c => c.toLowerCase() === parsedData.category.toLowerCase());
      return {
        title: parsedData.title,
        content: parsedData.content,
        category: foundCategory || STORY_CATEGORIES[0], // Default to the first category if not found
      };
    } else {
      throw new Error("Invalid JSON structure in AI response.");
    }

  } catch (error) {
    console.error("Error generating story with Gemini:", error);
    throw new Error("فشل توليد القصة. الرجاء المحاولة مرة أخرى.");
  }
};