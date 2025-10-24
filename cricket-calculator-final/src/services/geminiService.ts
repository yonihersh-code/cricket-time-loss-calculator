import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

const getAI = () => {
  if (!ai) {
    // In a Vite project, environment variables MUST start with VITE_
    const apiKey = import.meta.env.VITE_API_KEY;
    if (!apiKey) {
      throw new Error("VITE_API_KEY environment variable not set. Please set it in your Vercel project settings.");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

export const getSituationAnalysis = async (situation: string): Promise<string> => {
  const genAI = getAI();
  
  const systemInstruction = `You are an expert assistant for cricket umpires, coaches, and managers. Your purpose is to provide clear, actionable instructions for time-loss scenarios in cricket matches due to adverse weather, based on a fixed set of rules.

The user will provide a single text input that contains the official "ISEC Adverse Weather Rules" followed by the specific details of a live match situation.

Your task is to:
1.  Use the provided ISEC rules as the sole source of truth for calculations.
2.  Extract the specific parameters of the match situation (e.g., match type, overs, time lost, innings).
3.  Apply the ISEC rules to the match parameters to perform a precise time-loss calculation.
4.  Provide a clear, step-by-step breakdown of how the calculation was made, referencing the specific rules (e.g., "First Innings Time Loss," "rounding up/down").
5.  Conclude with a direct and unambiguous final statement of what the officials/coaches must do next (e.g., "The match is now reduced to 17 overs per team. The first innings will continue for 6 more overs.").
6.  Present the entire response in clean, easy-to-read markdown format.
7.  If the user's match details are ambiguous or missing critical information, clearly state what information is missing and why it's needed for the calculation. Do not invent parameters.`;

  try {
    const response = await genAI.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: situation,
        config: {
            systemInstruction: systemInstruction,
        }
    });
    return response.text;
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    return "Sorry, I encountered an error while trying to analyze the situation. Please check your Vercel project's Environment Variable (it should be named VITE_API_KEY) and ensure the key is correct.";
  }
};
