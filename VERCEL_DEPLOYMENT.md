# Vercel Deployment Guide

This guide explains how to deploy the Sturdy Final app to Vercel.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- A Supabase project with your database and edge functions set up
- Your environment variables ready

## Deployment Steps

### 1. Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository `mrhtly83-cmd/sturdy-final-final`
4. Vercel will auto-detect the Expo project

### 2. Configure Build Settings

Vercel should automatically detect the build settings from `vercel.json`:
- **Build Command**: `npm run build`
- **Output Directory**: `web-build`
- **Install Command**: `npm install`

If not auto-detected, set them manually in the project settings.

### 3. Set Environment Variables

In your Vercel project settings, go to "Environment Variables" and add:

#### Required Variables:

```
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Important**: The OpenAI API key should **NOT** be set in Vercel or client-side code. It must only be set as a secret in your Supabase Edge Functions. See `SUPABASE_EDGE_FUNCTION_SETUP.md` for details on setting up Edge Functions with the OpenAI API key.

### 4. Deploy

1. Click "Deploy" in Vercel
2. Vercel will:
   - Install dependencies
   - Run `npm run build`
   - Deploy the `web-build` directory
3. Your app will be available at `https://your-project.vercel.app`

## Build Configuration

The `vercel.json` file configures the deployment:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "web-build",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## Troubleshooting

### Build Fails with "supabaseUrl is required"

**Problem**: Environment variables are not set in Vercel.

**Solution**: 
1. Go to Vercel Project Settings → Environment Variables
2. Add `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`
3. Redeploy the project

### Build Fails with "expo module not found"

**Problem**: Dependencies not installed correctly.

**Solution**:
1. Ensure `package.json` is valid
2. Try clearing Vercel's build cache:
   - Go to Project Settings → General
   - Scroll to "Build & Development Settings"
   - Clear build cache and redeploy

### Routes Don't Work (404 errors)

**Problem**: SPA routing not configured.

**Solution**: The `vercel.json` includes rewrite rules to handle client-side routing:
```json
"rewrites": [
  { "source": "/(.*)", "destination": "/index.html" }
]
```

This should be automatically applied. If not, check that `vercel.json` is in the repository root.

## Local Testing

To test the build locally before deploying:

```bash
# Install dependencies
npm install

# Create .env file with your credentials
cp .env.example .env
# Edit .env with your actual values

# Run the build
npm run build

# Serve the build locally (optional - requires a static server)
npx serve web-build
```

## Environment Variables Best Practices

1. **Never commit secrets** to `.env` file
2. **Use `.env.example`** with placeholders only
3. **Set production values** in Vercel dashboard
4. **Use different Supabase projects** for development and production

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Expo Web Deployment](https://docs.expo.dev/distribution/publishing-websites/)
- [Supabase Documentation](https://supabase.com/docs)
