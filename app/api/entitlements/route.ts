/**
 * API Route: Get user entitlements
 * GET /api/entitlements
 */

import { supabaseServer } from "../../_utils/supabaseServer";
import {
  PLAN_LIMITS,
  isEntitlementPlan,
  EntitlementPlan,
} from "../../../src/constants/billing";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from("entitlements")
      .select("plan, journal, period_start, period_end, scripts_used")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    const entitlements = data ?? {
      plan: "free",
      journal: false,
      period_start: null,
      period_end: null,
      scripts_used: 0,
    };

    const planKey: EntitlementPlan = isEntitlementPlan(entitlements.plan) ? entitlements.plan : "free";

    const limitValue = PLAN_LIMITS[planKey];
    const scriptLimit = Number.isFinite(limitValue) ? limitValue : null;
    const remainingScripts =
      scriptLimit === null ? null : Math.max(scriptLimit - entitlements.scripts_used, 0);
    const isActive =
      planKey === "lifetime" ||
      (entitlements.period_end
        ? new Date(entitlements.period_end).getTime() > Date.now()
        : planKey !== "free");

    return Response.json({
      entitlements: {
        plan: planKey,
        journal: entitlements.journal,
        periodStart: entitlements.period_start,
        periodEnd: entitlements.period_end,
        scriptsUsed: entitlements.scripts_used,
        scriptLimit,
        remainingScripts,
        isActive,
      },
    });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
