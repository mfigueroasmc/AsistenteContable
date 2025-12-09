import { GoogleGenAI } from "@google/genai";
import { SystemModule, DataSource } from "../types";

// In a real RAG system, we would query a vector DB here. 
// We are simulating the "Context Injection" via the System Instruction for this demo.

const getSystemInstruction = (module: SystemModule, source: DataSource) => `
Rol: Eres un Asistente Experto en el Sistema de Contabilidad Gubernamental de Chile.
Tu objetivo es ayudar a funcionarios municipales y públicos a resolver dudas sobre normativa, operación del sistema y contabilidad pública.

Contexto Actual:
- Módulo del Sistema: ${module}
- Fuente de Información Prioritaria: ${source}

Instrucciones de Comportamiento:
1. Responde SIEMPRE en español formal y técnico, adecuado para contadores y administradores públicos chilenos.
2. Basate en la normativa chilena vigente:
   - NICSP (Normas Internacionales de Contabilidad para el Sector Público - Chile).
   - Instrucciones de la Contraloría General de la República (CGR).
   - Manual de Procedimientos Contables y Clasificador Presupuestario (DIPRES).
   - Ley de Presupuestos del Sector Público.
3. Si la pregunta es sobre "Errores" o "Soporte", asume que estás analizando tickets históricos y sugiere pasos de depuración comunes en sistemas ERP gubernamentales (como SIGFE o sistemas municipales).
4. Estructura tu respuesta:
   - Resumen directo.
   - Explicación detallada o paso a paso.
   - Referencia normativa (ej: "Según oficio N°... o Resolución 16...").
5. Si no sabes la respuesta con certeza, indica que se debe consultar directamente al analista de la CGR o mesa de ayuda, no inventes normativas.

Formato de salida:
Usa Markdown para negritas, listas y enlaces si es necesario.
`;

export const sendMessageToGemini = async (
  prompt: string,
  module: SystemModule,
  source: DataSource,
  history: { role: string; parts: { text: string }[] }[]
): Promise<string> => {
  
  // NOTE: In a production app, this would be a backend call to keep the key secure.
  const apiKey = process.env.API_KEY || "AIzaSyDm_YT-KR9A4c-GwU10QdymYjksQCyRou0"; 
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey });

  try {
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview', // Using the high-reasoning model for complex accounting regulations
      config: {
        systemInstruction: getSystemInstruction(module, source),
        temperature: 0.3, // Low temperature for factual, consistent answers
      },
      history: history
    });

    const response = await chat.sendMessage({ message: prompt });
    return response.text || "No se pudo generar una respuesta.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Hubo un error al consultar el servicio de inteligencia artificial.");
  }
};