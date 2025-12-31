/**
 * Subscription plans configuration for web platforms
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
      "Limited scripts (5/week)",
      "No audio playback",
      "No co-parent sync",
      "No favorites or journal",
    ],
  },
  {
    id: "complete",
    name: "Sturdy Complete",
    price: "$9.99",
    interval: "month",
    features: [
      "Unlimited scripts",
      "Audio playback",
      "Co-parent sync",
      "Favorites + journal",
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
      "Audio playback",
      "Co-parent sync",
      "Favorites + journal",
      "Priority support",
      "2 months free",
    ],
  },
];

export function getPlanById(id: string): Plan | undefined {
  return plans.find(plan => plan.id === id);
}
