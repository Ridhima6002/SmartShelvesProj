
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getLibraryAdvice = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: `You are Smarty, the friendly AI assistant for SmartShelves, the library management system of Bharatiya Vidya Bhavan's Sardar Patel Institute of Technology (SPIT), Mumbai.
        You help students find books, navigate library racks (there are 20 racks), check queue statuses, and give general academic advice.
        Keep your tone professional, academic, and slightly tech-savvy.
        The current year is 2024.
        Specific Rack Info:
        Rack 7 is for EXTC.
        Rack 4/5 is for CS/IT.
        Rack 14 is for GATE/GRE.
        Mention that the library is open from 9 AM to 6 PM.`,
        temperature: 0.7,
      },
    });
    /* response.text is a property, returning default if undefined */
    return response.text ?? "I'm sorry, I couldn't generate a response at the moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having a bit of trouble connecting to the catalog right now. Please try again or visit the main desk.";
  }
};
