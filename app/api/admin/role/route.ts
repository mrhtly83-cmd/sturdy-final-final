/**
 * API Route: Update user role
 * POST /api/admin/role
 */

import { supabaseServer } from "../../../_utils/supabaseServer";

export async function POST(request: Request) {
  try {
    const { userId, role } = await request.json();

    if (!userId || !role) {
      return Response.json(
        { error: "User ID and role are required" },
        { status: 400 }
      );
    }

    // Update user role
    const { error } = await supabaseServer
      .from("profiles")
      .update({ role })
      .eq("id", userId);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, message: "Role updated successfully" });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
