/**
 * Subscription plans configuration for mobile
 */

export interface Plan {
  id: string;
  name: string;
  price: string;
  interval: "month" | "year";
  features: string[];
  popular?: boolean;
}

export const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    interval: "month",
    features: [
      "5 scripts per week",
      "Basic templates",
      "Community support",
    ],
  },
  {
    id: "complete",
    name: "Sturdy Complete",
    price: "$9.99",
    interval: "month",
    features: [
      "Unlimited scripts",
      "All templates",
      "Save & playback",
      "Priority support",
    ],
    popular: true,
  },
  {
    id: "annual",
    name: "Annual Plan",
    price: "$99",
    interval: "year",
    features: [
      "Unlimited scripts",
      "All templates",
      "Save & playback",
      "Priority support",
      "2 months free",
    ],
  },
];

export function getPlanById(id: string): Plan | undefined {
  return plans.find(plan => plan.id === id);
}
