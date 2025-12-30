# Setting Up Your New OpenAI API Key

Since you have a new OpenAI API key ready, follow these steps to set it up securely:

## Step 1: Mark Old Secret as Revoked on GitHub

1. Visit the URL from your push error message:
   ```
   https://github.com/mrhtly83-cmd/sturdy-final-final/security/secret-scanning/unblock-secret/37YIR3NLDs73MfBrRKekw1VRXUa
   ```

2. Select "I revoked the secret" to confirm the old key is no longer active

3. This will unblock pushes to the `main` branch

## Step 2: Configure the New API Key in Supabase

The OpenAI API key is stored **server-side in Supabase**, not in your application code.

### Install Supabase CLI (if not already installed)

```bash
npm install -g supabase
```

### Login and Link to Your Project

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref vyqlqylpyjlkhgzbiflz
```

### Set the New OpenAI API Key as a Secret

```bash
supabase secrets set OPENAI_API_KEY=sk-proj-YOUR-NEW-KEY-HERE
```

Replace `sk-proj-YOUR-NEW-KEY-HERE` with your actual new OpenAI API key.

### Verify the Secret Was Set

```bash
supabase secrets list
```

You should see `OPENAI_API_KEY` in the list.

## Step 3: Deploy or Restart Edge Function

After updating the secret, redeploy the edge function to use the new key:

```bash
supabase functions deploy generate-script
```

## Step 4: Test the Setup

### Option A: Test Locally

1. Create `supabase/.env.local` (this file is in `.gitignore`):
   ```
   OPENAI_API_KEY=sk-proj-YOUR-NEW-KEY-HERE
   ```

2. Start local Supabase and serve the function:
   ```bash
   supabase start
   supabase functions serve generate-script --env-file ./supabase/.env.local
   ```

3. Test with curl:
   ```bash
   curl -X POST http://localhost:54321/functions/v1/generate-script \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
     -d '{
       "childAge": 5,
       "childName": "Emma",
       "struggle": "refusing to go to bed",
       "tone": "gentle"
     }'
   ```

### Option B: Test in Production

After deploying, test from your app by generating a script through the UI.

## Important Security Notes

✅ **DO**: Store the key in Supabase secrets (server-side)
✅ **DO**: Use `supabase/.env.local` for local testing (it's in `.gitignore`)
✅ **DO**: Keep your `.env` file private (it's in `.gitignore`)

❌ **DON'T**: Commit API keys to `.env`, `.env.example`, or any other file
❌ **DON'T**: Share your API key in code, issues, or pull requests
❌ **DON'T**: Store the key in environment variables in the client app

## Summary

Your OpenAI API key should **only** exist in:
1. **Production**: Supabase secrets (set with `supabase secrets set`)
2. **Local development**: `supabase/.env.local` (ignored by git)
3. **Your password manager**: For safekeeping

It should **never** be in:
- Git commits
- `.env.example` file
- Client-side code or environment variables
- GitHub issues or pull requests

## Next Steps

After completing the setup:

1. ✅ Mark old secret as revoked on GitHub
2. ✅ Set new key in Supabase secrets
3. ✅ Deploy the edge function
4. ✅ Test that script generation works
5. ✅ You'll be able to push to `main` again

For more details, see:
- [SUPABASE_EDGE_FUNCTION_SETUP.md](./SUPABASE_EDGE_FUNCTION_SETUP.md) - Full Supabase setup guide
- [PUSH_PROTECTION_RESOLUTION.md](./PUSH_PROTECTION_RESOLUTION.md) - Resolving push protection issues
