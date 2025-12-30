// src/services/aiService.ts
import OpenAI from "openai";
import { ScriptRequest } from "../types";

const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

export async function generateScript(request: ScriptRequest): Promise<string> {
  try {
    const { childAge, childName, neurotype, struggle, tone, context } = request;

    // Build the prompt based on the request
    const nameText = childName ? ` named ${childName}` : "";
    const neurotypeText = neurotype ? ` with ${neurotype}` : "";
    const contextText = context ? `\n\nAdditional context: ${context}` : "";

    const toneDescriptions = {
      gentle: "very warm, empathetic, and comforting",
      moderate: "balanced, supportive yet clear",
      firm: "direct, confident, and authoritative while still caring",
    };

    const prompt = `You are a parenting coach helping a parent talk to their ${childAge}-year-old child${nameText}${neurotypeText}.

The child is struggling with: ${struggle}${contextText}

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
