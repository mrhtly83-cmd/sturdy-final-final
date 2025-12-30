# Vercel Deployment Troubleshooting

This guide helps you resolve common Vercel deployment issues.

## Quick Checklist

Before troubleshooting, ensure:
- [ ] You've set `EXPO_PUBLIC_SUPABASE_URL` in Vercel Environment Variables
- [ ] You've set `EXPO_PUBLIC_SUPABASE_ANON_KEY` in Vercel Environment Variables
- [ ] You've deployed your Supabase Edge Functions
- [ ] You've set `OPENAI_API_KEY` in Supabase secrets (not Vercel)
- [ ] Your repository has the latest changes pushed

## Common Issues

### 1. "supabaseUrl is required" Error

**Symptom**: Build fails with error about missing Supabase URL

**Cause**: Environment variables not set in Vercel

**Solution**:
```bash
# In Vercel Dashboard:
# Project → Settings → Environment Variables
# Add these two variables:

EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

After adding, click "Redeploy" in Vercel.

### 2. Build Succeeds but App Doesn't Work

**Symptom**: Deployment succeeds but app shows errors or doesn't load

**Possible Causes**:
1. Invalid Supabase credentials
2. Edge Functions not deployed
3. Database not set up

**Solutions**:

**Check Supabase credentials:**
```bash
# Test your Supabase URL
curl https://YOUR_PROJECT.supabase.co/rest/v1/

# Should return Supabase info, not 404
```

**Deploy Edge Functions:**
```bash
# From your local repository
supabase functions deploy generate-script
```

**Verify Database:**
- Go to Supabase Dashboard → SQL Editor
- Run the queries from `SUPABASE_SETUP.md`

### 3. "No Output Directory named 'dist'" Error

**Symptom**: Vercel looks for wrong output directory

**Cause**: Old vercel.json configuration

**Solution**:
Ensure `vercel.json` contains:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "web-build",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 4. Build Times Out

**Symptom**: Build exceeds time limit

**Possible Causes**:
1. Large dependencies
2. Slow npm registry
3. Memory issues

**Solutions**:

**Option 1: Upgrade Vercel Plan**
Free tier has build time limits. Consider upgrading.

**Option 2: Optimize Dependencies**
```bash
# Check for duplicate dependencies
npm dedupe

# Clean install
rm -rf node_modules package-lock.json
npm install
```

**Option 3: Use Build Cache**
Vercel caches node_modules by default. Ensure you're not clearing cache unnecessarily.

### 5. Environment Variables Not Updating

**Symptom**: Changed environment variables but app still uses old values

**Cause**: Build cache or stale deployment

**Solution**:
1. Go to Vercel Dashboard → Deployments
2. Find latest deployment
3. Click "..." → Redeploy
4. Check "Clear Build Cache"
5. Click "Redeploy"

### 6. API Routes 404

**Symptom**: Client can't reach Supabase or Edge Functions

**Possible Causes**:
1. CORS issues
2. Wrong Supabase URL
3. Edge Functions not deployed

**Solutions**:

**Check CORS:**
Edge Functions should include CORS headers. See `supabase/functions/generate-script/index.ts`.

**Verify Edge Function:**
```bash
# Test Edge Function directly
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/generate-script \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"childAge":5,"struggle":"bedtime","tone":"gentle"}'
```

### 7. Blank Page After Deployment

**Symptom**: Site loads but shows blank page

**Causes**:
1. JavaScript errors in production build
2. Missing static assets
3. Wrong routing configuration

**Solutions**:

**Check Browser Console:**
1. Open deployed site
2. Press F12 to open DevTools
3. Check Console for errors
4. Check Network tab for failed requests

**Verify Build Output:**
```bash
# Build locally
npm run build

# Check web-build directory
ls web-build/
# Should show: index.html, _expo/, assets/, etc.
```

**Check Vercel Logs:**
1. Go to Vercel Dashboard → Deployments
2. Click on latest deployment
3. Check "Build Logs" and "Runtime Logs"

## Still Having Issues?

### 1. Try Local Build

```bash
# Clone your repo fresh
git clone https://github.com/mrhtly83-cmd/sturdy-final-final.git
cd sturdy-final-final

# Install dependencies
npm install

# Create .env with real credentials
cp .env.example .env
# Edit .env with your Supabase credentials

# Build
npm run build

# If build succeeds locally but fails on Vercel,
# the issue is likely with Vercel environment variables
```

### 2. Check Vercel System Status

Visit [Vercel Status](https://www.vercel-status.com/) to check for outages.

### 3. Enable Vercel Debug Logs

In your next deployment, Vercel will provide more detailed logs. Look for:
- Dependency installation logs
- Build command output
- Warnings or errors

### 4. Compare with Main Branch

```bash
# Check what changed
git diff main..copilot/fix-vercel-deployment-issues

# If main branch deploys successfully,
# check what's different in your branch
```

## Getting Help

If none of these solutions work:

1. **Check Vercel Logs**: Most issues are visible in build/runtime logs
2. **Check GitHub Issues**: See if others had similar problems
3. **Supabase Logs**: Check Supabase Dashboard → Logs for Edge Function errors
4. **Simplify**: Try deploying with minimal features to isolate the issue

## Useful Commands

```bash
# Test build locally
npm run build

# Check Vercel deployment status
vercel --version  # Ensure Vercel CLI is installed
vercel list

# Check Supabase Edge Functions
supabase functions list

# Test Edge Function locally
supabase functions serve

# Deploy Edge Function
supabase functions deploy generate-script

# Set Supabase secret
supabase secrets set OPENAI_API_KEY=sk-xxx
```

## Reference

- [Vercel Documentation](https://vercel.com/docs)
- [Expo Web Guide](https://docs.expo.dev/workflow/web/)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
