/**
 * API Route: Generate script using AI (Native/Mobile)
 * This is a placeholder for native platforms
 * Actual script generation should be handled server-side via the web route
 */

export async function POST(_request: Request) {
  return Response.json(
    {
      error: "Script generation is not available on native platforms. Please use the web version.",
      webUrl: "/create",
    },
    { status: 501 }
  );
}
