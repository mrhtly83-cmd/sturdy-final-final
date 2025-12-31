/**
 * Supabase server-side configuration for mobile
 */

import { createClient } from "@supabase/supabase-js";

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

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
