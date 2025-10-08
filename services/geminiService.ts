import { GoogleGenAI } from "@google/genai";
import { fileToBase64 } from "../utils/fileUtils";

let aiInstance: GoogleGenAI | null = null;

const getAiInstance = (): GoogleGenAI => {
  if (!aiInstance) {
    // This check prevents a crash in a browser environment outside of AI Studio
    // where process.env is not defined.
    const API_KEY = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;

    if (!API_KEY) {
        throw new Error("A chave da API do Google Gemini não está configurada. Para que o aplicativo funcione fora do Google AI Studio, a chave da API precisa ser configurada.");
    }
    aiInstance = new GoogleGenAI({ apiKey: API_KEY });
  }
  return aiInstance;
};

export const generateAltText = async (imageFile: File, maxChars: number): Promise<string> => {
  try {
    const ai = getAiInstance();
    const base64Data = await fileToBase64(imageFile);

    const imagePart = {
      inlineData: {
        mimeType: imageFile.type,
        data: base64Data,
      },
    };

    const textPart = {
      text: `Gere um texto alternativo (alt text) conciso e descritivo para esta imagem, ideal para acessibilidade web. O texto deve ser puramente descritivo, focando nos elementos visuais importantes, e não deve exceder ${maxChars} caracteres. O texto deve estar em português do Brasil.`
    };
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });

    return response.text.trim();
  } catch (error) {
    console.error("Erro ao gerar texto alternativo:", error);
    // Propagate the specific API key error message to the UI.
    if (error instanceof Error && error.message.includes("chave da API")) {
        throw error;
    }
    throw new Error("Não foi possível se comunicar com a API do Gemini.");
  }
};
