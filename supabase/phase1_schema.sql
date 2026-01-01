-- Phase 1 base schema for the parenting app backend
-- Run this in the Supabase SQL editor to create the core tables.

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles: Link to Auth
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  is_premium boolean DEFAULT FALSE,
  subscription_tier text NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free','core','complete','lifetime')),
  updated_at timestamp with time zone DEFAULT now()
);

-- Children: Age-based logic
CREATE TABLE IF NOT EXISTS children (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  parent_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  birth_date date NOT NULL,
  neurotype text DEFAULT 'neurotypical', -- Free-text to allow any neurotype (e.g., 'ADHD', 'Autism', 'PDA', etc.)
  created_at timestamp with time zone DEFAULT now()
);

-- Scripts & Journal: The "Ruptures"
CREATE TABLE IF NOT EXISTS scripts (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  parent_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  child_id uuid REFERENCES children(id) ON DELETE SET NULL,
  situation text NOT NULL,
  generated_script text NOT NULL,
  psych_insight text,
  is_favorite boolean NOT NULL DEFAULT FALSE,
  created_at timestamp with time zone DEFAULT now()
);
