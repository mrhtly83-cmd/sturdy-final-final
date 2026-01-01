-- Phase 1 base schema for the parenting app backend
-- Run this in the Supabase SQL editor to create the core tables.

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Profiles: Link to Auth
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  is_premium boolean default false,
  subscription_tier text default 'free', -- 'free', 'core', 'complete', 'lifetime'
  updated_at timestamp with time zone
);

-- Children: Age-based logic
create table if not exists children (
  id uuid default uuid_generate_v4() primary key,
  parent_id uuid references profiles(id),
  name text,
  birth_date date,
  neurotype text default 'Neurotypical', -- 'ADHD', 'Autism', 'PDA', etc.
  created_at timestamp with time zone default now()
);

-- Scripts & Journal: The "Ruptures"
create table if not exists scripts (
  id uuid default uuid_generate_v4() primary key,
  parent_id uuid references profiles(id),
  child_id uuid references children(id),
  situation text,
  generated_script text,
  psych_insight text,
  is_favorite boolean default false,
  created_at timestamp with time zone default now()
);
