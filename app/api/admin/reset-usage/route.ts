/**
 * API Route: Reset user usage
 * POST /api/admin/reset-usage
 */

import { supabaseServer } from "../../../_utils/supabaseServer";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    // Reset user usage
    const { error } = await supabaseServer
      .from("profiles")
      .update({ scripts_used_this_week: 0 })
      .eq("id", userId);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, message: "Usage reset successfully" });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
