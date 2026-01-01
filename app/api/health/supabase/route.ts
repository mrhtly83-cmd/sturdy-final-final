import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export async function GET() {
  const { error } = await supabaseAdmin.from("users").select("id").limit(1);
  if (error) {
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }
  return Response.json({ ok: true });
}
