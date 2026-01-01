/**
 * API Route: Stripe webhook handler
 * POST /api/stripe/webhook
 * Handles Stripe webhook events for subscription lifecycle
 */

import Stripe from "stripe";
import { supabaseAdmin } from "../../../_utils/supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return Response.json(
        { error: "No signature provided" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return Response.json(
        { error: `Webhook signature verification failed: ${err.message}` },
        { status: 400 }
      );
    }

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return Response.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

/**
 * Handle checkout.session.completed event
 * Updates user with customer ID from the session
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!userId) {
    console.error("No user_id in checkout session metadata");
    return;
  }

  // Update user with Stripe customer ID
  const { error } = await supabaseAdmin
    .from("users")
    .update({
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
    })
    .eq("id", userId);

  if (error) {
    console.error("Error updating user after checkout:", error);
    throw error;
  }

  console.log(`Checkout completed for user ${userId}`);
}

/**
 * Handle subscription created/updated events
 * Updates user premium status based on subscription state
 */
async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.user_id;
  const planInterval = subscription.metadata?.plan_interval as "month" | "year" | undefined;

  if (!userId) {
    console.error("No user_id in subscription metadata");
    return;
  }

  // Determine if subscription is active
  const isPremium = ["active", "trialing", "past_due"].includes(
    subscription.status
  );

  // Update user subscription status
  const { error } = await supabaseAdmin
    .from("users")
    .update({
      stripe_customer_id: subscription.customer as string,
      stripe_subscription_id: subscription.id,
      is_premium: isPremium,
      plan_interval: planInterval || "month",
    })
    .eq("id", userId);

  if (error) {
    console.error("Error updating user subscription:", error);
    throw error;
  }

  console.log(
    `Subscription ${subscription.status} for user ${userId}, premium: ${isPremium}`
  );
}

/**
 * Handle subscription deleted event
 * Removes premium status from user
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.user_id;

  if (!userId) {
    console.error("No user_id in subscription metadata");
    return;
  }

  // Remove premium status
  const { error } = await supabaseAdmin
    .from("users")
    .update({
      is_premium: false,
      stripe_subscription_id: null,
    })
    .eq("id", userId);

  if (error) {
    console.error("Error removing premium status:", error);
    throw error;
  }

  console.log(`Subscription deleted for user ${userId}`);
}
