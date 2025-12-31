/**
 * Supabase server-side configuration for native platforms
 * Note: Server-side operations are not typically used in React Native
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabaseServer: SupabaseClient | null = null;

function getSupabaseServer(): SupabaseClient {
  if (_supabaseServer) {
    return _supabaseServer;
  }

  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Validate required environment variables
  if (!supabaseUrl) {
    throw new Error(
      "Missing EXPO_PUBLIC_SUPABASE_URL environment variable. " +
      "Please add it to your .env file. See .env.example for reference."
    );
  }

  if (!supabaseServiceKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY environment variable. " +
      "This is required for server-side API routes. " +
      "Get this from your Supabase Dashboard > Settings > API > service_role key. " +
      "WARNING: Never expose this key to the client side."
    );
  }

  _supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return _supabaseServer;
}

// Export a Proxy that lazily initializes the client
export const supabaseServer = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseServer();
    const value = client[prop as keyof SupabaseClient];
    return typeof value === 'function' ? value.bind(client) : value;
  },
});
