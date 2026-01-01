# Setup Scripts

This directory contains automation scripts to help you set up and verify the Sturdy Parent App environment.

## 🚀 Quick Start

```bash
# 1. Run automated setup (installs dependencies, creates .env)
chmod +x scripts/*.sh
./scripts/setup-environment.sh

# 2. Configure your environment variables
# Edit .env with your actual Supabase and Stripe credentials

# 3. Verify everything is configured correctly
./scripts/verify-setup.sh

# 4. Check environment variables
node scripts/check-env.js

# 5. Deploy Edge Function (requires Supabase CLI)
./scripts/deploy-edge-function.sh
```

## 📜 Available Scripts

### `setup-environment.sh`
**Automates initial project setup**

What it does:
- ✅ Checks prerequisites (Node.js, npm, Supabase CLI)
- ✅ Installs npm dependencies
- ✅ Creates .env from .env.example
- ✅ Verifies SQL schema file exists
- ✅ Provides next steps guidance

Usage:
```bash
chmod +x scripts/setup-environment.sh
./scripts/setup-environment.sh
```

### `verify-setup.sh`
**Verifies project setup is complete**

What it checks:
- ✅ .env file exists and is configured
- ✅ node_modules installed
- ✅ SQL schema file exists with correct tables
- ✅ Edge Function exists
- ✅ All UI components exist
- ✅ Integrated screens exist
- ✅ Backend services exist

Usage:
```bash
chmod +x scripts/verify-setup.sh
./scripts/verify-setup.sh
```

Exit codes:
- `0` - All checks passed
- `1` - One or more checks failed

### `check-env.js`
**Validates environment variable configuration**

What it checks:
- ✅ .env file exists
- ✅ Required Supabase variables configured
- ✅ Optional OpenAI API key configured
- ✅ Optional Stripe configuration

Usage:
```bash
node scripts/check-env.js
```

### `deploy-edge-function.sh`
**Deploys Supabase Edge Function**

Prerequisites:
- Supabase CLI installed (`npm install -g supabase`)
- Logged in to Supabase CLI (`supabase login`)

What it does:
- ✅ Checks Supabase CLI is installed and logged in
- ✅ Verifies Edge Function exists
- ✅ Deploys generate-script function
- ✅ Provides instructions for setting secrets

Usage:
```bash
chmod +x scripts/deploy-edge-function.sh
./scripts/deploy-edge-function.sh
```

After deployment, set secrets:
```bash
supabase secrets set OPENAI_API_KEY=sk-your_key_here
supabase secrets set OPENAI_MODEL=gpt-4o
```

## 🔧 Manual Steps Still Required

These scripts automate everything that CAN be automated from code. However, some steps require access to external services:

### 1. Run SQL Schema in Supabase
**Why manual:** Requires authentication to your Supabase Dashboard

Steps:
1. Go to https://app.supabase.com
2. Select your project
3. Navigate to SQL Editor
4. Copy contents of `supabase/phase1_schema.sql`
5. Paste and run
6. Verify tables in Table Editor

### 2. Configure Stripe
**Why manual:** Requires authentication to your Stripe Dashboard

Steps:
1. Create 3 products in Stripe Dashboard
   - Core: $4.99/week
   - Complete: $9.99/month
   - Lifetime: $49.99 one-time
2. Copy Price IDs or Payment Links to `.env`
3. Set up webhook endpoint
4. See `NEXT_STEPS.md` for detailed instructions

## 📊 Workflow

```
1. Clone repository
   ↓
2. Run setup-environment.sh
   ↓
3. Edit .env with your credentials
   ↓
4. Run verify-setup.sh
   ↓
5. Run check-env.js
   ↓
6. Run SQL schema in Supabase Dashboard (manual)
   ↓
7. Run deploy-edge-function.sh (optional)
   ↓
8. Configure Stripe (manual, optional)
   ↓
9. Start development: npm run dev
```

## 🐛 Troubleshooting

### "Permission denied" when running scripts
```bash
chmod +x scripts/*.sh
```

### "Supabase CLI not found"
```bash
npm install -g supabase
```

### "OPENAI_API_KEY is not configured"
Set it in Supabase Edge Function secrets:
```bash
supabase secrets set OPENAI_API_KEY=sk-your_key_here
```

### ".env file not configured"
Edit `.env` and replace placeholder values with your actual credentials.

## 📚 Additional Resources

- `NEXT_STEPS.md` - Detailed step-by-step guide
- `IMPLEMENTATION_GUIDE.md` - Component usage and API reference
- `PHASE1_COMPLETE.md` - Complete deliverables summary

## 🎯 What Can Be Automated vs Manual

| Task | Automated | Manual | Why |
|------|-----------|--------|-----|
| Install dependencies | ✅ | | Can run npm install |
| Create .env file | ✅ | | Can copy .env.example |
| Verify files exist | ✅ | | Can check file system |
| Run SQL in Supabase | | ✅ | Requires Dashboard auth |
| Deploy Edge Function | ✅* | | *Requires Supabase CLI |
| Configure Stripe | | ✅ | Requires Dashboard auth |
| Set Edge Function secrets | ✅* | | *Requires Supabase CLI |

## 💡 Tips

- Run `verify-setup.sh` before starting development
- Run `check-env.js` after editing `.env`
- Keep `.env` file secure (never commit to git)
- Use `setup-environment.sh` for new team members

---

**Need help?** See the detailed guides in the docs directory or check the commit history for examples.
