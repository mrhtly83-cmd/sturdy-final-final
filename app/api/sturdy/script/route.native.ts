/**
 * API Route: Sturdy script generation (Native/Mobile)
 * This is a placeholder for native platforms
 * Actual script generation should be handled server-side via the web route
 */

export async function POST(_request: Request) {
  return Response.json(
    {
      error: "Sturdy script generation is not available on native platforms. Please use the web version.",
      webUrl: "/create",
    },
    { status: 501 }
  );
}
