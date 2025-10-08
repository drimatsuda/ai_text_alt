
import { GoogleGenAI } from "@google/genai";
import { fileToBase64 } from "../utils/fileUtils";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("A chave da API do Google Gemini não está configurada.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateAltText = async (imageFile: File, maxChars: number): Promise<string> => {
  try {
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
    throw new Error("Não foi possível se comunicar com a API do Gemini.");
  }
};
