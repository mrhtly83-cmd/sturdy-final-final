# Supabase Database Setup

This document contains all the SQL commands needed to set up the database for the Sturdy Parent app.

## Tables

### 1. Profiles Table

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  subscription_status TEXT NOT NULL DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium', 'trial')),
  subscription_end_date TIMESTAMPTZ,
  scripts_used_this_week INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on email
CREATE INDEX idx_profiles_email ON profiles(email);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### 2. Children Table

```sql
-- Create children table
CREATE TABLE children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age > 0 AND age <= 18),
  neurotype TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on user_id
CREATE INDEX idx_children_user_id ON children(user_id);

-- Enable Row Level Security
ALTER TABLE children ENABLE ROW LEVEL SECURITY;

-- Create policies for children
CREATE POLICY "Users can view their own children"
  ON children FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own children"
  ON children FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own children"
  ON children FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own children"
  ON children FOR DELETE
  USING (auth.uid() = user_id);
```

### 3. Scripts Table

```sql
-- Create scripts table
CREATE TABLE scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id UUID REFERENCES children(id) ON DELETE SET NULL,
  struggle TEXT NOT NULL,
  tone TEXT NOT NULL CHECK (tone IN ('gentle', 'moderate', 'firm')),
  content TEXT NOT NULL,
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_scripts_user_id ON scripts(user_id);
CREATE INDEX idx_scripts_child_id ON scripts(child_id);
CREATE INDEX idx_scripts_created_at ON scripts(created_at DESC);
CREATE INDEX idx_scripts_is_favorite ON scripts(is_favorite) WHERE is_favorite = TRUE;

-- Enable Row Level Security
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;

-- Create policies for scripts
CREATE POLICY "Users can view their own scripts"
  ON scripts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scripts"
  ON scripts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scripts"
  ON scripts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scripts"
  ON scripts FOR DELETE
  USING (auth.uid() = user_id);
```

## Database Functions

### 1. Auto-create Profile on User Signup

```sql
-- Function to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, subscription_status, scripts_used_this_week)
  VALUES (
    NEW.id,
    NEW.email,
    'free',
    0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### 2. Update Timestamp Function

```sql
-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function on profile updates
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
```

### 3. Increment Script Usage Function

```sql
-- Function to increment script usage counter
CREATE OR REPLACE FUNCTION public.increment_script_usage(user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET scripts_used_this_week = scripts_used_this_week + 1,
      updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 4. Reset Weekly Usage (Optional - for scheduled job)

```sql
-- Function to reset weekly script usage counters
-- This should be run weekly via a cron job or scheduled function
CREATE OR REPLACE FUNCTION public.reset_weekly_script_usage()
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET scripts_used_this_week = 0,
      updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Setup Instructions

1. **Log into your Supabase Dashboard**
   - Go to https://supabase.com
   - Select your project (vyqlqylpyjlkhgzbiflz)

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Execute the SQL Commands**
   - Copy and paste each section above (in order)
   - Run each section to create tables, indexes, and functions
   - Make sure to run them in the order they appear

4. **Verify the Setup**
   - Go to "Table Editor" in the left sidebar
   - Verify that the following tables exist:
     - profiles
     - children
     - scripts
   - Check that Row Level Security is enabled for all tables

5. **Test the Setup**
   - Create a test user through your app's sign-in flow
   - Verify that a profile is automatically created in the profiles table
   - Try creating a script and verify it's saved correctly

## Billing Setup (Supabase + Stripe Payment Links)

Before running the billing SQL, double-check your environment variables in `/workspaces/sturdy-final-final/.env` (or your deployment secrets) so `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are present.

**Plans**
- Weekly: `$4.99 / week` — 10 scripts + journal (view-only after cap)
- Monthly: `$9.99 / month` — 25 scripts + journal
- Lifetime: `$49.99 lifetime` — unlimited + all features
These numbers mirror the shared plan constants in `src/constants/billing.ts`; update both together.

Run this in Supabase → SQL Editor to create the entitlements table and RLS policy:

```sql
create table if not exists public.entitlements (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan text not null check (plan in ('weekly', 'monthly', 'lifetime')),
  journal boolean not null default false,
  period_start timestamptz,
  period_end timestamptz,
  scripts_used integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.entitlements enable row level security;

create policy "entitlements_select_own"
on public.entitlements
for select
using (auth.uid() = user_id);
```

Notes:
- The app updates `scripts_used` server-side using the service role key.
- `period_end` is `NULL` for lifetime plans.

## Environment Variables

Make sure to set the following environment variables in your `.env` file:

1. **Client-side variables** (safe to expose):
   - `EXPO_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous/public key

2. **Server-side variables** (NEVER expose to client):
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (required for server-side API routes)
     - Get this from: Supabase Dashboard > Settings > API > service_role key
     - **WARNING**: This key bypasses Row Level Security and has admin privileges

See `.env.example` for the complete list of required environment variables.

## Notes

- All tables have Row Level Security (RLS) enabled for data protection
- Users can only access their own data
- The `handle_new_user()` function automatically creates a profile when a user signs up
- The weekly script usage counter can be reset manually or via a scheduled job
- Make sure your Supabase URL and anon key are properly set in your `.env` file
- The service role key is required for server-side API routes but should NEVER be exposed to the client
