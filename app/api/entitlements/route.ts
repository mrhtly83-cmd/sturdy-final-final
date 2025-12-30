/**
 * API Route: Get user entitlements
 * GET /api/entitlements
 */

import { supabaseServer } from "../../_utils/supabaseServer";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    // Get user entitlements
    const { data: profile, error } = await supabaseServer
      .from("profiles")
      .select("subscription_status, subscription_plan")
      .eq("id", userId)
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({
      entitlements: {
        isPro: profile?.subscription_status === "active",
        plan: profile?.subscription_plan || "free",
      },
    });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
