import { generateSturdyScript, ScenarioType, SturdyRequest } from "@/src/lib/sturdyBrain";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function computeAgeYears(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return Math.max(age, 0);
}

export async function POST(req: Request) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return NextResponse.json(
      { error: "Supabase env vars not set" },
      { status: 500 }
    );
  }

  let body: { childId?: string; scenarioType?: ScenarioType; description?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { childId = null, scenarioType, description } = body;

  if (!scenarioType || !description) {
    return NextResponse.json(
      { error: "scenarioType and description are required" },
      { status: 400 }
    );
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
  });

  // Auth: ensure we have the user
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = userData.user.id;

  // Optional child lookup to derive age
  let childAgeYears: number | null = null;
  if (childId) {
    const { data: childRow, error: childError } = await supabase
      .from("children")
      .select("id, birth_date")
      .eq("id", childId)
      .eq("user_id", userId)
      .maybeSingle();

    if (childError) {
      return NextResponse.json(
        { error: "Failed to fetch child" },
        { status: 500 }
      );
    }
    if (!childRow) {
      return NextResponse.json({ error: "Child not found" }, { status: 404 });
    }
    childAgeYears = computeAgeYears(childRow.birth_date as string);
  }

  // Build request for the brain
  const brainRequest: SturdyRequest = {
    parentId: userId,
    childId,
    childAgeYears,
    scenarioType,
    description,
  };

  const sturdyResponse = await generateSturdyScript(brainRequest);

  // Persist to ruptures journal
  const { error: insertError } = await supabase.from("ruptures").insert({
    user_id: userId,
    child_id: childId,
    trigger_event: description,
    ai_response: sturdyResponse.script,
  });

  if (insertError) {
    // We still return the AI response but surface the persistence issue
    return NextResponse.json(
      {
        ...sturdyResponse,
        warning: "Script generated but failed to save rupture",
        persistenceError: insertError.message,
      },
      { status: 200 }
    );
  }

  return NextResponse.json(sturdyResponse, { status: 200 });
}