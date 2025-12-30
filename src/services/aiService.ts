// src/services/aiService.ts
import OpenAI from "openai";
import { ScriptRequest } from "../types";

// SECURITY NOTE: In production, this API key should NOT be exposed to the client.
// The OpenAI API should be called from a secure backend service instead.
// Using EXPO_PUBLIC_ prefix makes this key visible in the client bundle.
const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

// Sanitize user input to prevent prompt injection
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "") // Remove HTML-like tags
    .replace(/\n{3,}/g, "\n\n") // Limit excessive newlines
    .trim()
    .slice(0, 500); // Limit length
}

export async function generateScript(request: ScriptRequest): Promise<string> {
  try {
    const { childAge, childName, neurotype, struggle, tone, context } = request;

    // Sanitize all user inputs
    const sanitizedStruggle = sanitizeInput(struggle);
    const sanitizedName = childName ? sanitizeInput(childName) : "";
    const sanitizedNeurotype = neurotype ? sanitizeInput(neurotype) : "";
    const sanitizedContext = context ? sanitizeInput(context) : "";

    // Build the prompt based on the request
    const nameText = sanitizedName ? ` named ${sanitizedName}` : "";
    const neurotypeText = sanitizedNeurotype ? ` with ${sanitizedNeurotype}` : "";
    const contextText = sanitizedContext ? `\n\nAdditional context: ${sanitizedContext}` : "";

    const toneDescriptions = {
      gentle: "very warm, empathetic, and comforting",
      moderate: "balanced, supportive yet clear",
      firm: "direct, confident, and authoritative while still caring",
    };

    const prompt = `You are a parenting coach helping a parent talk to their ${childAge}-year-old child${nameText}${neurotypeText}.

The child is struggling with: ${sanitizedStruggle}${contextText}

Generate a calming parenting script with a ${toneDescriptions[tone]} tone. The script should:

1. Start with a calming opening (2-3 sentences) that acknowledges the situation
2. Validate the child's feelings with empathy
3. Provide clear, age-appropriate guidance in 3-5 concrete steps
4. End with a supportive closing that reinforces love and confidence

Make sure the language is appropriate for a ${childAge}-year-old child. Keep the script practical and actionable for the parent to use immediately.

Format the response as a natural script the parent can read or adapt.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert parenting coach specializing in child development and positive parenting strategies. You create personalized scripts that help parents communicate effectively with their children during challenging moments.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const script = completion.choices[0]?.message?.content;

    if (!script) {
      throw new Error("No script generated from AI");
    }

    return script.trim();
  } catch (error) {
    console.error("Error generating script:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate script: ${error.message}`);
    }
    throw new Error("Failed to generate script: Unknown error");
  }
}
