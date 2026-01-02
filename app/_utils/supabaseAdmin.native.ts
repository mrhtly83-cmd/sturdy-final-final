/**
 * Supabase Admin Client - Native platform stub
 * Server-side admin operations are not supported in React Native
 * All admin operations should be done through the web backend
 */

import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase admin client stub for native platforms.
 * Admin operations should only be called from the web backend.
 */
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get() {
    throw new Error(
      "Supabase admin operations are not supported on native platforms. " +
        "Please use the web API endpoint for admin operations."
    );
  },
});
