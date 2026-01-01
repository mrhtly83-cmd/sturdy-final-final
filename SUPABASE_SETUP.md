# Supabase Database Setup

This document contains all the SQL commands needed to set up the database for the Sturdy Parent app.

For the Phase 1 backend foundation (profiles, children, scripts):
- Run the SQL in [`supabase/phase1_schema.sql`](supabase/phase1_schema.sql) inside the Supabase SQL editor.
- The script enables the `uuid-ossp` extension needed for `uuid_generate_v4()` before applying any additional migrations.
- Apply any other migrations in this document afterward as needed (for example, the billing/entitlements steps).

Enable the UUID extension once before running the table statements:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

## Tables

### 1. Profiles Table

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free','core','complete','lifetime')),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

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
CREATE TABLE IF NOT EXISTS children (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  neurotype TEXT DEFAULT 'neurotypical', -- Free-text to allow any neurotype (e.g., 'ADHD', 'Autism', 'PDA', etc.)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on parent_id
CREATE INDEX IF NOT EXISTS idx_children_parent_id ON children(parent_id);

-- Enable Row Level Security
ALTER TABLE children ENABLE ROW LEVEL SECURITY;

-- Create policies for children
CREATE POLICY "Users can view their own children"
  ON children FOR SELECT
  USING (auth.uid() = parent_id);

CREATE POLICY "Users can insert their own children"
  ON children FOR INSERT
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Users can update their own children"
  ON children FOR UPDATE
  USING (auth.uid() = parent_id);

CREATE POLICY "Users can delete their own children"
  ON children FOR DELETE
  USING (auth.uid() = parent_id);
```

### 3. Scripts Table

```sql
-- Create scripts table
CREATE TABLE IF NOT EXISTS scripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  child_id UUID REFERENCES children(id) ON DELETE SET NULL,
  situation TEXT NOT NULL,
  generated_script TEXT NOT NULL,
  psych_insight TEXT,
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_scripts_parent_id ON scripts(parent_id);
CREATE INDEX IF NOT EXISTS idx_scripts_child_id ON scripts(child_id);

-- Enable Row Level Security
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;

-- Create policies for scripts
CREATE POLICY "Users can view their own scripts"
  ON scripts FOR SELECT
  USING (auth.uid() = parent_id);

CREATE POLICY "Users can insert their own scripts"
  ON scripts FOR INSERT
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Users can update their own scripts"
  ON scripts FOR UPDATE
  USING (auth.uid() = parent_id);

CREATE POLICY "Users can delete their own scripts"
  ON scripts FOR DELETE
  USING (auth.uid() = parent_id);
```

## Database Functions

### 1. Auto-create Profile on User Signup

```sql
-- Function to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, is_premium, subscription_tier, updated_at)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    FALSE,
    'free',
    NOW()
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
