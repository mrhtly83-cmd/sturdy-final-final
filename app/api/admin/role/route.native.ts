/**
 * API Route: Update user role (Native/Mobile)
 * This is a placeholder for native platforms
 * Admin operations should be handled server-side via the web route
 */

export async function POST(_request: Request) {
  return Response.json(
    {
      error: "Admin role API is not available on native platforms. Please use the web version.",
    },
    { status: 501 }
  );
}
