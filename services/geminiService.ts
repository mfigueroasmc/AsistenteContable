import { GoogleGenAI } from "@google/genai";
import { SystemModule, DataSource } from "../types";

// System Instruction updated to leverage Google Search grounding when necessary
const getSystemInstruction = (module: SystemModule, source: DataSource) => `
Rol: Eres un Asistente Experto en el Sistema de Contabilidad Gubernamental de Chile.
Tu objetivo es ayudar a funcionarios municipales y públicos a resolver dudas sobre normativa, operación del sistema y contabilidad pública.

Contexto Actual:
- Módulo del Sistema: ${module}
- Fuente de Información Prioritaria: ${source}

Herramientas Disponibles:
- Tienes acceso a Búsqueda en Google (Google Search). Úsala OBLIGATORIAMENTE cuando se te pregunte sobre leyes recientes, valores de indicadores económicos actuales (UTM, UF), o normativa específica (como la nueva normativa de licencias médicas).

Instrucciones de Comportamiento:
1. Responde SIEMPRE en español formal y técnico, adecuado para contadores y administradores públicos chilenos.
2. Basate en la normativa chilena vigente:
   - NICSP (Normas Internacionales de Contabilidad para el Sector Público - Chile).
   - Instrucciones de la Contraloría General de la República (CGR).
   - Manual de Procedimientos Contables y Clasificador Presupuestario (DIPRES).
   - Ley de Presupuestos del Sector Público.
   - Nueva Normativa sobre Licencias Médicas Municipales.
3. Si la pregunta es sobre "Errores del Sistema" o "Soporte Técnico", asume el rol de soporte TI nivel 2 y sugiere pasos de depuración.
4. CITAS Y FUENTES: Si usas información de la búsqueda de Google, la respuesta incluirá automáticamente las fuentes. Intenta integrar esa información de manera fluida.

Formato de salida:
Usa Markdown para negritas, listas y enlaces.
`;

export const sendMessageToGemini = async (
  prompt: string,
  module: SystemModule,
  source: DataSource,
  history: { role: string; parts: { text: string }[] }[]
): Promise<{ text: string; sources: string[] }> => {
  
  // Use strictly the environment variable as per security guidelines
  const apiKey = process.env.API_KEY; 
  if (!apiKey) throw new Error("API Key configuration missing. Please ensure API_KEY is set in the environment.");

  const ai = new GoogleGenAI({ apiKey });

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: getSystemInstruction(module, source),
        temperature: 0.3,
        // Enable Google Search Grounding for real-world data
        tools: [{ googleSearch: {} }],
      },
      history: history
    });

    const response = await chat.sendMessage({ message: prompt });
    
    if (!response.text) {
      console.warn("Gemini response was empty or blocked.");
      return { 
        text: "Lo siento, no pude generar una respuesta para esta consulta. Por favor intenta reformular tu pregunta o verifica tu conexión.", 
        sources: [] 
      };
    }

    // Extract real sources from Grounding Metadata
    const sources: string[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri) {
          // Prefer title, fallback to domain/uri
          const sourceName = chunk.web.title || new URL(chunk.web.uri).hostname;
          sources.push(sourceName);
        }
      });
    }

    // Return unique sources
    const uniqueSources = [...new Set(sources)];

    return { text: response.text, sources: uniqueSources };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};