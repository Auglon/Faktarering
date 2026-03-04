'use server';

import { GoogleGenAI, Type } from '@google/genai';

export async function extractCompanyInfo(url: string) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("API key not found");
    
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-preview',
      contents: `Extract the company name, organization number (if available), address, and zip/city from this website: ${url}. If you can't find them, return empty strings.`,
      config: {
        tools: [{ urlContext: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            orgNr: { type: Type.STRING },
            address: { type: Type.STRING },
            zipCity: { type: Type.STRING },
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return null;
  } catch (error) {
    console.error("Error extracting company info:", error);
    return null;
  }
}
