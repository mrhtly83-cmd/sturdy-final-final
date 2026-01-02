/**
 * API Route: Reset user usage (Native/Mobile)
 * This is a placeholder for native platforms
 * Admin operations should be handled server-side via the web route
 */

export async function POST(_request: Request) {
  return Response.json(
    {
      error: "Admin reset-usage API is not available on native platforms. Please use the web version.",
    },
    { status: 501 }
  );
}
