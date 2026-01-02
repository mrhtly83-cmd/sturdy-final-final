/**
 * Supabase Admin Client - Native platform stub
 * Server-side admin operations are not supported in React Native
 * All admin operations should be done through the web backend
 */

/**
 * Helper function that throws an error indicating admin operations
 * are not supported on native platforms.
 */
function throwNotSupportedError(): never {
  throw new Error(
    "Supabase admin operations are not supported on native platforms. " +
      "Please use the web API endpoint for admin operations."
  );
}

/**
 * Supabase admin client stub for native platforms.
 * Any method call will throw an error directing users to use the web API.
 */
export const supabaseAdmin = {
  from: throwNotSupportedError,
  rpc: throwNotSupportedError,
  auth: { admin: { createUser: throwNotSupportedError } },
};
