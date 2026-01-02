/**
 * API Route: Get user entitlements (Native/Mobile)
 * This is a placeholder for native platforms
 * Actual entitlement checks should be handled server-side via the web route
 */

export async function GET(_request: Request) {
  return Response.json(
    {
      error: "Entitlements API is not available on native platforms. Please use the web version.",
    },
    { status: 501 }
  );
}
