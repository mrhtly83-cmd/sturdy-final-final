export type PlanKey = "weekly" | "monthly" | "lifetime";
export type EntitlementPlan = PlanKey | "free";

export const PLAN_LIMITS: Record<EntitlementPlan, number> = {
  free: 0,
  weekly: 10,
  monthly: 25,
  lifetime: Number.POSITIVE_INFINITY,
};

export const PLAN_DETAILS: Record<PlanKey, { label: string; price: string; cta: string; scriptsCopy: string }> = {
  weekly: {
    label: "Weekly",
    price: "$4.99 / week",
    cta: "Start Weekly",
    scriptsCopy: `${PLAN_LIMITS.weekly} scripts each week + journal (view-only after cap)`,
  },
  monthly: {
    label: "Monthly",
    price: "$9.99 / month",
    cta: "Subscribe Monthly",
    scriptsCopy: `${PLAN_LIMITS.monthly} scripts each month + journal`,
  },
  lifetime: {
    label: "Lifetime",
    price: "$49.99 lifetime",
    cta: "Unlock Lifetime",
    scriptsCopy: "Unlimited scripts + journal access",
  },
};

export function isEntitlementPlan(plan: string): plan is EntitlementPlan {
  return plan === "free" || plan === "weekly" || plan === "monthly" || plan === "lifetime";
}
