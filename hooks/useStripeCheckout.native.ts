/**
 * Hook: useStripeCheckout (Native/Mobile version)
 * Provides functionality to start a Stripe checkout session on mobile
 * Opens checkout in browser on mobile platforms
 */

import { useState } from "react";
import { Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
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
        Alert.alert(
          "Configuration Error",
          "Stripe price IDs not configured. Please contact support."
        );
        throw new Error("Stripe price ID not configured");
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

      // Open checkout in browser on mobile
      if (data.url) {
        await WebBrowser.openBrowserAsync(data.url);
      } else {
        throw new Error("No checkout URL returned from server");
      }

      return data;
    } catch (err: any) {
      const errorMessage = err.message || "An error occurred during checkout";
      setError(errorMessage);
      console.error("Checkout error:", err);
      Alert.alert("Checkout Error", errorMessage);
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
