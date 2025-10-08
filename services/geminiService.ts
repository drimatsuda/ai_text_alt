
import { GoogleGenAI, Type } from "@google/genai";
import { fileToBase64 } from "../utils/fileUtils";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("A chave da API do Google Gemini não está configurada.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export interface AltTextResult {
  altText: string;
  keywords: string[];
}

export const generateAltText = async (imageFile: File, maxChars: number): Promise<AltTextResult> => {
  try {
    const base64Data = await fileToBase64(imageFile);

    const imagePart = {
      inlineData: {
        mimeType: imageFile.type,
        data: base64Data,
      },
    };

    const textPart = {
      text: `Analise esta imagem e gere o seguinte em formato JSON:
      1.  Um campo "altText": texto alternativo conciso e descritivo, ideal para acessibilidade web, com no máximo ${maxChars} caracteres. O texto deve ser puramente descritivo, focando nos elementos visuais importantes.
      2.  Um campo "keywords": um array de 3 a 5 palavras-chave que descrevem os principais objetos e temas da imagem.
      O idioma de todo o conteúdo deve ser português do Brasil.`
    };
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            altText: { 
              type: Type.STRING,
              description: 'Texto alternativo descritivo para a imagem.'
            },
            keywords: {
              type: Type.ARRAY,
              description: 'Array de palavras-chave relacionadas à imagem.',
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const jsonStr = response.text.trim();
    const result: AltTextResult = JSON.parse(jsonStr);
    
    return result;

  } catch (error) {
    console.error("Erro ao gerar texto alternativo:", error);
    if (error instanceof Error && error.message.includes('JSON')) {
        throw new Error("A resposta da IA não estava no formato esperado. Tente novamente.");
    }
    throw new Error("Não foi possível se comunicar com a API do Gemini.");
  }
};
