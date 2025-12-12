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

Instrucciones de Comportamiento (CRÍTICO):
1. BREVEDAD Y PRECISIÓN: Las respuestas deben ser breves, precisas y totalmente claras. Esto es fundamental para optimizar los tiempos de respuesta y la posterior generación de voz (TTS). Ve directo al punto sin preámbulos innecesarios.
2. FUNDAMENTACIÓN OFICIAL EXCLUSIVA: Basa tus respuestas ÚNICAMENTE en documentación oficial del Estado de Chile.
   - Fuentes PERMITIDAS: Contraloría (CGR), DIPRES, SIGFE, SUBDERE, Biblioteca del Congreso Nacional (BCN) y sitios con dominio .gob.cl.
   - Fuentes PROHIBIDAS: ESTÁ ESTRICTAMENTE PROHIBIDO usar, citar o recomendar sitios web comerciales, blogs privados, empresas de software ERP o fuentes no gubernamentales.
     - Ejemplo explícito de exclusión: NUNCA uses información de sitios como 'getquipu.com', 'nubox.com' o similares. Si la búsqueda arroja estos resultados, IGNÓRALOS COMPLETAMENTE.
3. CITAS OBLIGATORIAS: Cuando exista una norma aplicable, DEBES citarla o describirla explícitamente (ej: "Según el Oficio N°...", "Conforme a la NICSP...").
4. Si la pregunta es sobre "Errores del Sistema" o "Soporte Técnico", asume el rol de soporte TI nivel 2 y sugiere pasos de depuración de forma concisa.
5. CITAS Y FUENTES WEB: Si usas información de la búsqueda de Google, la respuesta incluirá automáticamente las fuentes. Intenta integrar esa información de manera fluida y resumida.

Formato de salida:
Usa Markdown para negritas, listas y enlaces. Mantén los párrafos cortos.
`;

const getApiKey = () => {
  const apiKey = process.env.API_KEY; 
  if (!apiKey) throw new Error("API Key configuration missing. Please ensure API_KEY is set in the environment.");
  return apiKey;
};

export const sendMessageToGemini = async (
  prompt: string,
  module: SystemModule,
  source: DataSource,
  history: { role: string; parts: { text: string }[] }[]
): Promise<{ text: string; sources: string[] }> => {
  
  const ai = new GoogleGenAI({ apiKey: getApiKey() });

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