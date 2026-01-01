/**
 * API Route: Stripe Checkout Session (Native/Mobile)
 * This is a placeholder for native platforms
 * Actual checkout should be handled server-side via the web route
 */

export async function POST(_request: Request) {
  return Response.json(
    {
      error: "Stripe checkout is not available on native platforms. Please use the web version.",
      webUrl: "/paywall",
    },
    { status: 501 }
  );
}
