/**
 * Stripe server-side configuration for native platforms
 * Note: Stripe server-side operations are not supported in React Native
 * All payment processing should be done through the web backend
 */

/**
 * Get the Stripe client instance.
 * This is a stub for native platforms - Stripe server operations
 * should only be called from the web backend.
 *
 * @throws Error always throws on native platforms
 */
export function getStripe(): never {
  throw new Error(
    "Stripe server operations are not supported on native platforms. " +
      "Please use the web API endpoint for payment processing."
  );
}
