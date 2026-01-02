-- Phase 1: Technical Foundation (Backend)
-- Multi-child, premium parenting app schema
-- Run this in the Supabase SQL editor to create the core tables

-- =============================================================================
-- EXTENSIONS
-- =============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- CLEANUP EXISTING OBJECTS (for re-runs)
-- =============================================================================

-- Drop existing triggers first (they depend on functions)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_profile_updated ON profiles;

-- Drop existing policies (they depend on tables)
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own children" ON children;
DROP POLICY IF EXISTS "Users can insert their own children" ON children;
DROP POLICY IF EXISTS "Users can update their own children" ON children;
DROP POLICY IF EXISTS "Users can delete their own children" ON children;
DROP POLICY IF EXISTS "Users can view their own scripts" ON scripts;
DROP POLICY IF EXISTS "Users can insert their own scripts" ON scripts;
DROP POLICY IF EXISTS "Users can update their own scripts" ON scripts;
DROP POLICY IF EXISTS "Users can delete their own scripts" ON scripts;

-- Drop existing indexes
DROP INDEX IF EXISTS idx_children_parent_id;
DROP INDEX IF EXISTS idx_scripts_parent_id;
DROP INDEX IF EXISTS idx_scripts_child_id;
DROP INDEX IF EXISTS idx_scripts_is_favorite;

-- Drop existing tables (in reverse dependency order)
DROP TABLE IF EXISTS scripts;
DROP TABLE IF EXISTS children;
DROP TABLE IF EXISTS profiles;

-- =============================================================================
-- TABLES
-- =============================================================================

-- Profiles: Link to Auth
CREATE TABLE profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  is_premium boolean DEFAULT false,
  subscription_tier text DEFAULT 'free', -- 'free', 'core', 'complete', 'lifetime'
  updated_at timestamp with time zone DEFAULT now()
);

-- Children: Age-based logic
CREATE TABLE children (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  parent_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text,
  birth_date date,
  neurotype text DEFAULT 'Neurotypical', -- 'ADHD', 'Autism', 'PDA', etc.
  created_at timestamp with time zone DEFAULT now()
);

-- Scripts & Journal: The "Ruptures"
CREATE TABLE scripts (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  parent_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  child_id uuid REFERENCES children(id) ON DELETE SET NULL,
  situation text,
  generated_script text,
  psych_insight text,
  is_favorite boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Index for faster lookups of children by parent
CREATE INDEX IF NOT EXISTS idx_children_parent_id ON children(parent_id);

-- Index for faster lookups of scripts by parent
CREATE INDEX IF NOT EXISTS idx_scripts_parent_id ON scripts(parent_id);

-- Index for faster lookups of scripts by child
CREATE INDEX IF NOT EXISTS idx_scripts_child_id ON scripts(child_id);

-- Index for faster lookups of favorite scripts
CREATE INDEX IF NOT EXISTS idx_scripts_is_favorite ON scripts(is_favorite) WHERE is_favorite = true;

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Children policies
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

-- Scripts policies
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

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Function to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, is_premium, subscription_tier, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    false,
    'free',
    now()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Trigger to call the function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Trigger to call the function on profile updates
DROP TRIGGER IF EXISTS on_profile_updated ON profiles;
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- COMMENTS (Documentation)
-- =============================================================================

COMMENT ON TABLE profiles IS 'User profiles linked to authentication, includes premium status and subscription tiers';
COMMENT ON TABLE children IS 'Child profiles with age-based logic via birth_date, supports multiple children per parent';
COMMENT ON TABLE scripts IS 'Generated scripts and journal entries (ruptures) with psychological insights';

COMMENT ON COLUMN profiles.subscription_tier IS 'Subscription level: free, core, complete, or lifetime';
COMMENT ON COLUMN children.birth_date IS 'Used for age-based logic and developmentally appropriate responses';
COMMENT ON COLUMN children.neurotype IS 'Neurotype for personalized support (e.g., ADHD, Autism, PDA, Neurotypical)';
COMMENT ON COLUMN scripts.situation IS 'Description of the parenting situation or rupture';
COMMENT ON COLUMN scripts.generated_script IS 'AI-generated script with suggested language and approach';
COMMENT ON COLUMN scripts.psych_insight IS 'Psychological insights and explanations for the approach';
