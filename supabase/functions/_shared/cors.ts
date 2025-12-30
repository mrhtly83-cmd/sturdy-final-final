// CORS headers for Supabase Edge Functions
// Note: In production, consider restricting Access-Control-Allow-Origin to specific domains
// For example: 'Access-Control-Allow-Origin': 'https://yourdomain.com'
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
