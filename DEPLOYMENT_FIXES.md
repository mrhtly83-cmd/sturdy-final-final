# Deployment Fixes Summary

This document summarizes all the deployment issues that were identified and fixed.

## Issues Fixed

### 1. Build Configuration Error ✅

**Problem**: Build was failing with error:
```
CommandError: No platforms are configured to use the Metro bundler in the project Expo config.
```

**Root Cause**: The `app.json` file was missing the `bundler` configuration for each platform.

**Fix**: Added `"bundler": "metro"` to the iOS, Android, and web platform configurations in `app.json`.

```json
{
  "expo": {
    "ios": {
      "bundler": "metro"
    },
    "android": {
      "bundler": "metro"
    },
    "web": {
      "bundler": "metro"
    }
  }
}
```

### 2. React Hook Error in Static Export ✅

**Problem**: Build was failing with error:
```
TypeError: (0 , t.use) is not a function
```

**Root Cause**: The web platform was configured with `"output": "static"` which tries to pre-render all pages. This caused issues with React hooks in expo-router that are not compatible with static rendering.

**Fix**: Changed web output mode from `"static"` to `"single"` in `app.json`:

```json
{
  "expo": {
    "web": {
      "output": "single"
    }
  }
}
```

### 3. React Compiler Dependency Error ✅

**Problem**: Build was failing with error:
```
Error: Unable to resolve module react/compiler-runtime
```

**Root Cause**: The experimental React Compiler was enabled but the required runtime was not installed.

**Fix**: Disabled the experimental React Compiler feature in `app.json`:

```json
{
  "expo": {
    "experiments": {
      "typedRoutes": true
      // Removed: "reactCompiler": true
    }
  }
}
```

### 4. Security Vulnerability - Exposed API Key ✅ 🔒

**Problem**: The `.env` file contained an OpenAI API key with the `EXPO_PUBLIC_` prefix:
```
EXPO_PUBLIC_OPENAI_API_KEY=sk-proj-...
```

**Root Cause**: Any environment variable with `EXPO_PUBLIC_` or `NEXT_PUBLIC_` prefix is exposed to client-side code, which is a major security vulnerability for API keys.

**Fix**: 
1. Removed the `EXPO_PUBLIC_OPENAI_API_KEY` line from `.env`
2. OpenAI API key should ONLY be set in Supabase Edge Function secrets:
```bash
supabase secrets set OPENAI_API_KEY=sk-proj-your-key-here
```

**Security Note**: Never use `EXPO_PUBLIC_` or `NEXT_PUBLIC_` prefix for API keys, secrets, or private keys.

### 5. Incomplete CORS Headers ✅

**Problem**: Edge Function CORS configuration was missing required headers for proper preflight handling.

**Fix**: Added complete CORS headers in `supabase/functions/_shared/cors.ts`:

```typescript
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
  'Access-Control-Max-Age': '86400',
}
```

## Build Verification

After all fixes, the build now succeeds:

```bash
npm run build
# ✅ Builds successfully
# ✅ Outputs to web-build/ directory
# ✅ Creates bundled JavaScript files
# ✅ Includes all assets and fonts
```

## Deployment Checklist

Before deploying to Vercel or other hosting platforms:

- [x] Build configuration fixed (`bundler: metro` added)
- [x] Web output mode set to `single`
- [x] React Compiler disabled
- [x] API keys removed from client-side environment variables
- [x] CORS headers properly configured
- [x] Build process verified locally

### Still Required (Manual Steps):

1. **Set Environment Variables in Vercel**:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

2. **Set Stripe Environment Variables in Vercel** (if using Stripe):
   ```
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   NEXT_PUBLIC_STRIPE_PRICE_MONTHLY=price_...
   NEXT_PUBLIC_STRIPE_PRICE_ANNUAL=price_...
   ```

3. **Set OpenAI API Key in Supabase** (NOT Vercel):
   ```bash
   supabase secrets set OPENAI_API_KEY=sk-proj-your-key-here
   ```

4. **Deploy Supabase Edge Functions**:
   ```bash
   supabase functions deploy generate-script
   ```

5. **Redeploy on Vercel** after setting environment variables

## Files Modified

1. `app.json` - Build configuration fixes
2. `.env` - Removed exposed API key (security fix)
3. `supabase/functions/_shared/cors.ts` - Complete CORS headers
4. `DEPLOYMENT_FIXES.md` - This documentation (new)

## References

- [Expo Web Deployment](https://docs.expo.dev/distribution/publishing-websites/)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)

## Support

If you encounter any deployment issues:

1. Check [VERCEL_TROUBLESHOOTING.md](./VERCEL_TROUBLESHOOTING.md)
2. Check [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for the complete deployment checklist
3. Verify environment variables are set correctly
4. Check Vercel deployment logs
5. Check Supabase Edge Function logs
6. Ensure all prerequisites are met
