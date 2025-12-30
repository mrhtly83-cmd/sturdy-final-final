/**
 * API Route: Reset user usage
 * POST /api/admin/reset-usage
 */

import { NextResponse } from "next/server";
import { supabaseServer } from "../../../_utils/supabaseServer";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Reset user usage
    const { error } = await supabaseServer
      .from("profiles")
      .update({ scripts_used_this_week: 0 })
      .eq("id", userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Usage reset successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
