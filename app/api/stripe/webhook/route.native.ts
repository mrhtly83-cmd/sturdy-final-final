/**
 * Native platform webhook handler
 * This file exists for React Native compatibility
 */

export function POST() {
  throw new Error("Stripe webhooks are not supported on native platforms");
}
