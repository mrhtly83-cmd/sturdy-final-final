/**
 * Hook: useStripeCheckout
 * Provides functionality to start a Stripe checkout session
 */

import { useState } from "react";
import { useAuth } from "../src/contexts/AuthContext";

interface CheckoutOptions {
  priceId?: string;
  planInterval?: "month" | "year";
}

interface CheckoutResponse {
  sessionId: string;
  url: string;
}

export function useStripeCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const startCheckout = async (options: CheckoutOptions = {}) => {
    setLoading(true);
    setError(null);

    try {
      if (!user?.id) {
        throw new Error("User must be logged in to start checkout");
      }

      // Determine price ID based on plan interval
      let priceId = options.priceId;
      if (!priceId) {
        const planInterval = options.planInterval || "year"; // Default to annual
        priceId =
          planInterval === "year"
            ? process.env.NEXT_PUBLIC_STRIPE_PRICE_ANNUAL
            : process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY;
      }

      if (!priceId) {
        throw new Error(
          "Stripe price ID not configured. Please add NEXT_PUBLIC_STRIPE_PRICE_MONTHLY and NEXT_PUBLIC_STRIPE_PRICE_ANNUAL to your .env file."
        );
      }

      // Call checkout API
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const data: CheckoutResponse = await response.json();

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned from server");
      }

      return data;
    } catch (err: any) {
      const errorMessage = err.message || "An error occurred during checkout";
      setError(errorMessage);
      console.error("Checkout error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    startCheckout,
    loading,
    error,
  };
}
