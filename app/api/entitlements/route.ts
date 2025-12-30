/**
 * API Route: Get user entitlements
 * GET /api/entitlements
 */

import { NextResponse } from "next/server";
import { supabaseServer } from "../../_utils/supabaseServer";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Get user entitlements
    const { data: profile, error } = await supabaseServer
      .from("profiles")
      .select("subscription_status, subscription_plan")
      .eq("id", userId)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      entitlements: {
        isPro: profile?.subscription_status === "active",
        plan: profile?.subscription_plan || "free",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
