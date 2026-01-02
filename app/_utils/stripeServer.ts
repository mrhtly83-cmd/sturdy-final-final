/**
 * Stripe server-side configuration
 * Used for server-side operations and API routes
 * 
 * Uses lazy initialization to avoid errors when environment variables
 * are not available during module loading (e.g., during Expo web builds)
 */

import Stripe from "stripe";

let _stripeClient: Stripe | null = null;

/**
 * Get the Stripe client instance.
 * Creates the client lazily on first call to avoid initialization errors
 * when STRIPE_SECRET_KEY is not set during module loading.
 * 
 * @throws Error if STRIPE_SECRET_KEY environment variable is not configured
 */
export function getStripe(): Stripe {
  if (_stripeClient) {
    return _stripeClient;
  }

  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing STRIPE_SECRET_KEY environment variable. " +
      "Please add it to your .env file. See .env.example for reference."
    );
  }

  _stripeClient = new Stripe(apiKey, {
    apiVersion: "2025-12-15.clover",
  });

  return _stripeClient;
}
