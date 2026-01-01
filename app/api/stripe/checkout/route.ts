/**
 * API Route: Stripe Checkout Session
 * POST /api/stripe/checkout
 * Creates a subscription checkout session for monthly or annual plans
 */

import Stripe from "stripe";
import { supabaseServer } from "../../../_utils/supabaseServer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover",
});

export async function POST(request: Request) {
  try {
    const { priceId, userId } = await request.json();

    // Validate inputs
    if (!priceId) {
      return Response.json(
        { error: "Price ID is required" },
        { status: 400 }
      );
    }

    if (!userId) {
      return Response.json(
        { error: "User ID is required" },
        { status: 401 }
      );
    }

    // Get user from Supabase to fetch email
    const { data: user, error: userError } = await supabaseServer
      .from("users")
      .select("email, stripe_customer_id")
      .eq("id", userId)
      .maybeSingle();

    if (userError) {
      console.error("Error fetching user:", userError);
      return Response.json(
        { error: "Failed to fetch user information" },
        { status: 500 }
      );
    }

    if (!user) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Determine the plan interval based on price ID
    const annualPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ANNUAL;
    
    let planInterval: "month" | "year" = "month";
    if (priceId === annualPriceId) {
      planInterval = "year";
    }

    // Create or retrieve customer
    let customerId = user.stripe_customer_id;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: userId,
        },
      });
      customerId = customer.id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${request.headers.get("origin")}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get("origin")}/paywall`,
      metadata: {
        user_id: userId,
        plan_interval: planInterval,
      },
      subscription_data: {
        metadata: {
          user_id: userId,
          plan_interval: planInterval,
        },
      },
    });

    return Response.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return Response.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
