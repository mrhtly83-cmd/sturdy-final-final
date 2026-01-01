/**
 * API Route: Generate script using AI
 * POST /api/generate-script
 * Includes usage gating and tracking
 */

import { supabaseServer } from "../../_utils/supabaseServer";

// Free tier limit: 10 AI requests per month
const FREE_TIER_MONTHLY_LIMIT = 10;

export async function POST(request: Request) {
  try {
    const { struggle, childAge, situation, userId } = await request.json();

    if (!struggle) {
      return Response.json(
        { error: "Struggle description is required" },
        { status: 400 }
      );
    }

    if (!userId) {
      return Response.json(
        { error: "User ID is required" },
        { status: 401 }
      );
    }

    // Check user's premium status and usage
    const { data: user, error: userError } = await supabaseServer
      .from("users")
      .select("is_premium, ai_requests_count, ai_requests_reset_at")
      .eq("id", userId)
      .maybeSingle();

    if (userError) {
      console.error("Error fetching user:", userError);
      return Response.json(
        { error: "Failed to fetch user information" },
        { status: 500 }
      );
    }

    if (!user) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user needs quota reset (monthly reset)
    const now = new Date();
    const resetAt = user.ai_requests_reset_at
      ? new Date(user.ai_requests_reset_at)
      : null;
    const needsReset =
      !resetAt || now.getTime() > resetAt.getTime();

    let currentCount = needsReset ? 0 : (user.ai_requests_count || 0);

    // For non-premium users, enforce the free tier limit
    if (!user.is_premium) {
      if (currentCount >= FREE_TIER_MONTHLY_LIMIT) {
        return Response.json(
          {
            error: "Free tier limit reached",
            message: `You've reached your monthly limit of ${FREE_TIER_MONTHLY_LIMIT} AI-generated scripts. Upgrade to premium for unlimited access.`,
            upgradeRequired: true,
            limit: FREE_TIER_MONTHLY_LIMIT,
            used: currentCount,
          },
          { status: 403 }
        );
      }
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

    // Log usage: increment AI request count
    const nextResetAt = needsReset
      ? new Date(now.getFullYear(), now.getMonth() + 1, 1) // First day of next month
      : resetAt;

    const { error: updateError } = await supabaseServer
      .from("users")
      .update({
        ai_requests_count: currentCount + 1,
        ai_requests_reset_at: nextResetAt?.toISOString(),
      })
      .eq("id", userId);

    if (updateError) {
      console.error("Error updating usage count:", updateError);
      // Don't fail the request if usage tracking fails
    }

    return Response.json({
      success: true,
      script,
      generated_at: new Date().toISOString(),
      usage: {
        used: currentCount + 1,
        limit: user.is_premium ? null : FREE_TIER_MONTHLY_LIMIT,
        resetAt: nextResetAt?.toISOString(),
      },
    });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
