# Supabase Edge Function Setup Guide

This guide explains how to deploy and manage the `generate-script` Supabase Edge Function that handles OpenAI API calls server-side.

## Overview

The `generate-script` edge function:
- Securely stores the OpenAI API key on the server
- Handles all AI script generation requests
- Provides proper CORS headers for web/mobile clients
- Sanitizes user input to prevent prompt injection
- Returns structured JSON responses

## Prerequisites

1. **Supabase Account**: You need access to the Supabase project
   - Project URL: `https://vyqlqylpyjlkhgzbiflz.supabase.co`
   - Project Reference: `vyqlqylpyjlkhgzbiflz`

2. **OpenAI API Key**: Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)

3. **Node.js**: v18 or higher

## Installation

### Step 1: Install Supabase CLI

```bash
# Install globally
npm install -g supabase

# Verify installation
supabase --version
```

### Step 2: Login to Supabase

```bash
supabase login
```

This will open your browser to authenticate with Supabase.

### Step 3: Link to Your Project

```bash
# Navigate to your project directory
cd /path/to/sturdy-final-final

# Link to the Supabase project
supabase link --project-ref vyqlqylpyjlkhgzbiflz
```

You'll be prompted to enter your database password.

## Configuration

### Step 4: Set the OpenAI API Key Secret

The OpenAI API key must be stored as a secret in Supabase (not in your codebase):

```bash
supabase secrets set OPENAI_API_KEY=sk-proj-your-actual-openai-key-here
```

⚠️ **Security Note**: Never commit your actual OpenAI API key to version control!

### Step 5: Verify Secrets (Optional)

```bash
supabase secrets list
```

## Deployment

### Deploy to Production

```bash
# Deploy the generate-script function
supabase functions deploy generate-script

# Verify deployment
supabase functions list
```

The function will be available at:
```
https://vyqlqylpyjlkhgzbiflz.supabase.co/functions/v1/generate-script
```

### View Function Logs

```bash
# Stream live logs
supabase functions logs generate-script --follow

# View recent logs
supabase functions logs generate-script
```

## Local Testing

### Setup Local Environment

1. **Create local environment file** (already done):
   ```
   supabase/.env.local
   ```

2. **Add your OpenAI API key** to `supabase/.env.local`:
   ```
   OPENAI_API_KEY=sk-proj-your-actual-openai-key-here
   ```

3. **Start local Supabase**:
   ```bash
   supabase start
   ```

4. **Serve the function locally**:
   ```bash
   supabase functions serve generate-script --env-file ./supabase/.env.local
   ```

   The function will be available at:
   ```
   http://localhost:54321/functions/v1/generate-script
   ```

### Test the Function

Using `curl`:

```bash
curl -X POST \
  http://localhost:54321/functions/v1/generate-script \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -d '{
    "childAge": 5,
    "childName": "Emma",
    "struggle": "refusing to go to bed",
    "tone": "gentle",
    "context": "She is overtired from a busy day"
  }'
```

Expected response:
```json
{
  "script": "...[generated parenting script]..."
}
```

### Test from Client App

1. Make sure your client is configured with the local Supabase URL:
   ```
   EXPO_PUBLIC_SUPABASE_URL=http://localhost:54321
   ```

2. Run your app:
   ```bash
   npm start
   ```

3. Test the script generation feature in your app

## Updating the Function

After making changes to the function code:

1. **Test locally**:
   ```bash
   supabase functions serve generate-script --env-file ./supabase/.env.local
   ```

2. **Deploy updates**:
   ```bash
   supabase functions deploy generate-script
   ```

## Troubleshooting

### Error: "Missing required fields"

**Cause**: The request body is missing `childAge`, `struggle`, or `tone`.

**Solution**: Ensure your client is sending all required fields:
```typescript
const request = {
  childAge: 5,        // Required
  struggle: "...",    // Required
  tone: "gentle",     // Required (gentle | moderate | firm)
  childName: "...",   // Optional
  neurotype: "...",   // Optional
  context: "..."      // Optional
}
```

### Error: "OpenAI API error"

**Cause**: The OpenAI API key is invalid or missing.

**Solutions**:
1. Verify the secret is set:
   ```bash
   supabase secrets list
   ```

2. Update the secret:
   ```bash
   supabase secrets set OPENAI_API_KEY=sk-proj-your-new-key
   ```

3. Redeploy the function:
   ```bash
   supabase functions deploy generate-script
   ```

### Error: "CORS error"

**Cause**: The client domain is blocked by CORS policy.

**Solution**: The function uses `Access-Control-Allow-Origin: *` which allows all domains. If you need to restrict access, modify `supabase/functions/_shared/cors.ts`:

```typescript
export const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://yourdomain.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
```

### Error: "Failed to generate script"

**Cause**: Network error, OpenAI API issue, or rate limiting.

**Solutions**:
1. Check function logs:
   ```bash
   supabase functions logs generate-script
   ```

2. Verify OpenAI API status: https://status.openai.com/

3. Check your OpenAI account for rate limits or billing issues

### Local function not responding

**Cause**: Supabase local environment not running.

**Solution**:
```bash
# Stop local Supabase
supabase stop

# Start fresh
supabase start

# Serve the function
supabase functions serve generate-script --env-file ./supabase/.env.local
```

## Architecture

### Request Flow

```
Client App (React Native/Web)
    ↓
    | HTTP POST with ScriptRequest
    ↓
Supabase Edge Function (generate-script)
    ↓
    | Validate & Sanitize Input
    ↓
OpenAI API (gpt-4o-mini)
    ↓
    | Return Generated Script
    ↓
Client App receives script
```

### Security Features

1. **API Key Protection**: OpenAI key stored server-side as a secret
2. **Input Sanitization**: Removes HTML tags, limits length, prevents injection
3. **CORS Headers**: Configured for cross-origin requests
4. **Error Handling**: Graceful error messages without exposing internals
5. **Validation**: Server-side input validation before processing

### Cost Considerations

- **Supabase Edge Functions**: Free tier includes 500K invocations/month
- **OpenAI API**: Pay per token (gpt-4o-mini is cost-effective)
- Each script generation uses ~800 tokens maximum

### Performance

- **Cold Start**: ~1-2 seconds for first request
- **Warm Requests**: ~500ms-2s (mostly OpenAI API time)
- **Concurrent Requests**: Scales automatically with Supabase

## Production Checklist

Before going live, verify:

- [ ] OpenAI API key is set as a Supabase secret
- [ ] Function is deployed: `supabase functions deploy generate-script`
- [ ] Function logs show no errors: `supabase functions logs generate-script`
- [ ] Client `.env` has correct Supabase URL (production URL)
- [ ] Client `.env` does NOT contain `EXPO_PUBLIC_OPENAI_API_KEY`
- [ ] `openai` package removed from client `package.json`
- [ ] Test end-to-end: Generate a script from your production app

## Additional Resources

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Deno Deploy Docs](https://docs.deno.com/deploy/manual)

## Support

If you encounter issues:
1. Check function logs: `supabase functions logs generate-script`
2. Verify OpenAI API status: https://status.openai.com/
3. Review this guide's troubleshooting section
4. Check Supabase status: https://status.supabase.com/

## Future Enhancements

Potential improvements for the future:
- Add request rate limiting per user
- Implement usage tracking and analytics
- Add caching for similar requests
- Support streaming responses for real-time generation
- Add A/B testing for different prompts
- Implement retry logic with exponential backoff
