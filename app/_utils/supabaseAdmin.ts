/**
 * Supabase Admin Client - Server-side only
 * Used for privileged operations that bypass Row Level Security
 * NEVER import this in client-side code
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabaseAdmin: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
  if (_supabaseAdmin) {
    return _supabaseAdmin;
  }

  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Validate required environment variables
  if (!supabaseUrl) {
    throw new Error(
      "Missing SUPABASE_URL environment variable. " +
        "Please add it to your .env file. See .env.example for reference."
    );
  }

  if (!supabaseServiceKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY environment variable. " +
        "This is required for admin operations. " +
        "Get this from your Supabase Dashboard > Settings > API > service_role key. " +
        "WARNING: Never expose this key to the client side."
    );
  }

  _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return _supabaseAdmin;
}

// Export a Proxy that lazily initializes the admin client
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseAdmin();
    const value = client[prop as keyof SupabaseClient];
    return typeof value === "function" ? value.bind(client) : value;
  },
  has(_target, prop) {
    const client = getSupabaseAdmin();
    return prop in client;
  },
  set(_target, prop, value) {
    const client = getSupabaseAdmin();
    (client as any)[prop] = value;
    return true;
  },
});
