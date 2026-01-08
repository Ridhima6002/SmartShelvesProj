import { GoogleGenAI } from "@google/genai";
import { supabase } from "./supabase";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define simple keyword lists for intent detection
const greetings = ["hi", "hello", "hey"];
const farewells = ["bye", "goodbye", "see you"];

/**
 * Main function: fetches book info if needed and generates AI response
 */
export const getLibraryAdvice = async (userQuery: string) => {
  try {
    const normalizedQuery = userQuery.trim().toLowerCase();
    let context = "";

    // 1️⃣ Handle Greetings
    if (greetings.includes(normalizedQuery)) {
      context = `
        The user greeted Smarty. Respond with a friendly greeting,
        mention your name (Smarty), and ask how you can assist.
      `;
    }
    // 2️⃣ Handle Farewells
    else if (farewells.includes(normalizedQuery)) {
      context = `
        The user is saying goodbye. Respond politely with a farewell message.
      `;
    }
    // 3️⃣ Attempt Book Search
    else {

      // 🔹 Use Gemini to extract title/author/course keywords from the sentence
      const keywordResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userQuery,
        config: {
          systemInstruction: `
            You are Smarty, the AI assistant for SmartShelves at SPIT Mumbai.
            Extract only meaningful keywords from the user's query related to:
            - Book title
            - Author
            - Course code

            Return the result as a comma-separated list of keywords, nothing else.
          `,
          temperature: 0.0
        }
      });

      const keywordsText = keywordResponse.text ?? "";
      // Split by comma and clean whitespace
      const keywords = keywordsText.split(",").map(k => k.trim()).filter(k => k);

      if (keywords.length === 0) {
        return "Please enter a valid book title, author, or course code.";
      }

      // 🔹 Build Supabase OR query for all keywords
      const orQuery = keywords
        .map(k => `title.ilike.%${k}%,author.ilike.%${k}%,course_code.ilike.%${k}%`)
        .join(",");

      const { data: books, error } = await supabase
        .from("books")
        .select("*")
        .or(orQuery);

      console.log("Keywords extracted by Gemini:", keywords);
      console.log("Books found:", books);

      const book = books?.[0];

      if (book) {
        context = books.slice(0, 3).map(book => `
Title: ${book.title}
Author: ${book.author}
Location: ${book.rack ? `Rack ${book.rack}` : 'Not specified'}
Availability: ${book.available ? 'Available' : 'Currently unavailable'}
Copies available: ${book.copies}
`).join("\n\n");
      } else {
        context = `
No book match found for '${userQuery}'.
If this is an academic question, answer it professionally as a subject expert.
If this is not library-related or academic, politely say:
"I can help you with library-related queries and academic doubts."
`;
      }
    }

    // 4️⃣ Call Gemini AI to generate the final response
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userQuery,
      config: {
        systemInstruction: `
          You are Smarty, the AI assistant for SmartShelves at SPIT Mumbai.
          Use the following context to answer user queries:

          ${context}

          Keep responses simple, structured, professional, and friendly.
          Greet politely if the user says hi/hello.
          Say goodbye politely if the user says bye/goodbye.
          Mention library hours if asked: 8:30 AM to 7 PM, Monday to Friday.
          Do not guess availability; always use the given context.

          IMPORTANT: 
  - Do NOT use asterisks (*) anywhere.
        `,
        temperature: 0.7
      }
    });

    return response.text ?? "I'm sorry, I couldn't generate a response at the moment.";
  } catch (err) {
    console.error("Error in getLibraryAdvice:", err);
    return "I'm having trouble accessing the library data right now. Please try again later.";
  }
};
