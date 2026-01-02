/**
 * API Route: Supabase health check (Native/Mobile)
 * This is a placeholder for native platforms
 * Health checks should be handled server-side via the web route
 */

export async function GET(_request: Request) {
  return Response.json(
    {
      error: "Health check API is not available on native platforms. Please use the web version.",
    },
    { status: 501 }
  );
}
