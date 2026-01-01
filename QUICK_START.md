# 🚀 Quick Start Guide

This guide helps you get the Sturdy Parent App running as quickly as possible.

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- Supabase account (free tier works)
- OpenAI API key (for script generation)
- (Optional) Stripe account for payments

## 5-Minute Setup

### 1. Run Automated Setup (2 minutes)

```bash
# Install dependencies and create .env
npm run setup
```

This will:
- ✅ Check prerequisites
- ✅ Install dependencies
- ✅ Create .env from template
- ✅ Verify files

### 2. Configure Environment (2 minutes)

Edit `.env` and add your credentials:

```bash
# Required
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# Get these from: https://app.supabase.com → Your Project → Settings → API
```

### 3. Verify Setup (1 minute)

```bash
# Check everything is configured
npm run verify
npm run check-env
```

### 4. Deploy Database Schema (Manual - 5 minutes)

⚠️ **This step requires Supabase Dashboard access**

1. Go to https://app.supabase.com
2. Select your project → SQL Editor
3. Copy contents of `supabase/phase1_schema.sql`
4. Paste and run
5. Verify tables appear in Table Editor

Tables created:
- ✅ `profiles` (user accounts with subscription tiers)
- ✅ `children` (child profiles with age/neurotype)
- ✅ `scripts` (generated scripts with insights)

### 5. Deploy Edge Function (Optional - 2 minutes)

If you have Supabase CLI installed:

```bash
# Deploy the AI script generator
npm run deploy-function

# Set OpenAI API key
supabase secrets set OPENAI_API_KEY=sk-your_key_here
supabase secrets set OPENAI_MODEL=gpt-4o
```

Without CLI: Deploy manually through Supabase Dashboard

### 6. Start Development Server

```bash
npm run dev
```

Visit http://localhost:8081 (or scan QR code for mobile)

## 🎯 What You Get

After setup, you have:

✅ **Database**: Multi-child profiles with RLS security
✅ **UI Components**: 7 production-ready components
✅ **Create Flow**: Complete script generation interface
✅ **Onboarding**: Child profile setup screen
✅ **Premium Logic**: Usage tracking and paywall
✅ **AI Integration**: GPT-4o with Attachment Theory prompts

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run web             # Start web only
npm run ios             # Start iOS simulator
npm run android         # Start Android emulator

# Setup & Verification
npm run setup           # Run automated setup
npm run verify          # Verify project setup
npm run check-env       # Check environment variables

# Deployment
npm run deploy-function # Deploy Edge Function
npm run build          # Build for production
```

## 📁 Key Files

- `supabase/phase1_schema.sql` - Database schema (run this in Supabase)
- `.env` - Your configuration (never commit this!)
- `app/(tabs)/create-new.tsx` - Main Create screen
- `app/onboarding/child-setup.tsx` - Onboarding flow
- `components/create/*` - UI components for script creation
- `components/premium/*` - Premium features (paywall, usage)

## 🎨 Testing the UI

### Test Create Flow:
1. Start app: `npm run dev`
2. Navigate to Create tab
3. Select a child (or add one)
4. Choose a struggle
5. Adjust tone
6. Generate script

### Test Crisis Mode:
1. Click "Help Me Now" gold button
2. Skips form, generates immediate script
3. Uses last active child

### Test Premium Modal:
1. Generate 6 scripts (exceeds free limit)
2. Premium modal appears
3. Shows 3 tiers: Core, Complete, Lifetime

## ⚠️ Manual Steps Required

These cannot be automated and must be done manually:

### 1. Run SQL Schema ✋
- Requires: Supabase Dashboard access
- Time: 5 minutes
- File: `supabase/phase1_schema.sql`
- Location: Supabase Dashboard → SQL Editor

### 2. Configure Stripe (Optional) ✋
- Requires: Stripe Dashboard access
- Time: 15 minutes
- What: Create 3 products, set up webhooks
- Guide: See `NEXT_STEPS.md` lines 195-255

## 🐛 Troubleshooting

### "Cannot find .env file"
```bash
npm run setup
# Then edit .env with your credentials
```

### "EXPO_PUBLIC_SUPABASE_URL is not configured"
```bash
# Edit .env and add your Supabase URL
npm run check-env  # Verify
```

### "Supabase CLI not found"
```bash
npm install -g supabase
supabase login
```

### "Tables not found in Supabase"
Run the SQL schema in Supabase Dashboard (step 4 above)

### "Script generation fails"
1. Check Edge Function is deployed
2. Verify OPENAI_API_KEY is set in Supabase secrets
3. Check Supabase logs in Dashboard

## 📚 Next Steps

Once everything is running:

1. **Customize**: Update colors in `tailwind.config.js`
2. **Add Features**: See `IMPLEMENTATION_GUIDE.md` for component usage
3. **Deploy**: Build for production with `npm run build`
4. **Monitor**: Check Supabase Dashboard for usage and logs

## 🆘 Need Help?

- **Setup Issues**: Run `npm run verify` to diagnose
- **Environment**: Run `npm run check-env` to check config
- **Detailed Guide**: See `NEXT_STEPS.md`
- **API Reference**: See `IMPLEMENTATION_GUIDE.md`
- **Deliverables**: See `PHASE1_COMPLETE.md`

## ✅ Checklist

- [ ] Ran `npm run setup`
- [ ] Configured `.env` with Supabase credentials
- [ ] Ran `npm run verify` (all checks pass)
- [ ] Ran SQL schema in Supabase Dashboard
- [ ] Deployed Edge Function (optional)
- [ ] Started dev server with `npm run dev`
- [ ] Tested Create flow
- [ ] Tested Crisis mode
- [ ] (Optional) Configured Stripe

---

**Estimated total time: 15 minutes** (excluding optional Stripe setup)

🎉 You're ready to build!
