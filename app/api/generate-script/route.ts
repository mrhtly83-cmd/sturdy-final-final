/**
 * API Route: Generate script using AI
 * POST /api/generate-script
 */

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { struggle, childAge, situation } = await request.json();

    if (!struggle) {
      return NextResponse.json(
        { error: "Struggle description is required" },
        { status: 400 }
      );
    }

    // Placeholder for AI script generation
    // This would typically call an AI service like OpenAI
    const script = `
# Calm Parenting Script

**Situation:** ${struggle}
**Child Age:** ${childAge || "Not specified"}
**Context:** ${situation || "General"}

## Opening
Take a deep breath. Remember, this moment is temporary.

## Approach
1. Get down to your child's eye level
2. Use a calm, gentle voice
3. Acknowledge their feelings

## Script
"I can see you're feeling [emotion]. That's okay. Let's talk about this together."

## Resolution
Offer choices and work together to find a solution.
    `.trim();

    return NextResponse.json({
      success: true,
      script,
      generated_at: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
