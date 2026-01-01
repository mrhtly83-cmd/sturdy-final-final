// src/types/index.ts
// Type definitions matching Phase 1 Supabase schema

// Database types matching the Supabase schema
export interface Profile {
  id: string; // UUID references auth.users
  full_name: string | null;
  is_premium: boolean;
  subscription_tier: 'free' | 'core' | 'complete' | 'lifetime';
  updated_at: string; // timestamp with time zone
}

export interface Child {
  id: string; // UUID
  parent_id: string; // UUID references profiles(id)
  name: string | null;
  birth_date: string | null; // date - for age-based logic
  neurotype: string; // 'Neurotypical', 'ADHD', 'Autism', 'PDA', etc.
  created_at: string; // timestamp with time zone
}

export interface Script {
  id: string; // UUID
  parent_id: string; // UUID references profiles(id)
  child_id: string | null; // UUID references children(id), nullable
  situation: string | null; // Description of the rupture/situation
  generated_script: string | null; // AI-generated script text
  psych_insight: string | null; // Psychological explanation
  is_favorite: boolean;
  created_at: string; // timestamp with time zone
}

// Legacy User type for backward compatibility
export interface User {
  id: string;
  email: string;
  created_at?: string;
  // Stripe integration fields
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  is_premium?: boolean;
  plan_interval?: 'month' | 'year';
  // Usage tracking fields
  ai_requests_count?: number;
  ai_requests_reset_at?: string;
}

// Frontend types
export type ScenarioType = 'SOS' | 'ExecutiveFunction' | 'Rupture';

export type ToneLevel = 'gentle' | 'moderate' | 'firm';

export interface ScriptRequest {
  // Child information
  childId?: string;
  childName?: string;
  childAge?: number; // Calculated from birth_date
  childAgeYears?: number;
  birthDate?: string;
  neurotype?: string;
  
  // Situation details
  situation?: string;
  struggle?: string; // Legacy field
  description?: string;
  
  // Tone and context
  tone?: ToneLevel;
  context?: string;
  scenarioType?: ScenarioType;
  
  // Crisis mode
  isCrisis?: boolean;
}

export interface ScriptResponse {
  script: string;
  psych_insight?: string;
  situation: string;
}

// Stripe-specific types
export interface StripeCheckoutRequest {
  priceId: string;
  userId: string;
}

export interface StripeCheckoutResponse {
  sessionId: string;
  url: string;
}

// Usage tracking for free tier (5 scripts limit)
export interface UsageInfo {
  used: number;
  limit: number | null; // null means unlimited (premium)
  resetAt?: string;
}

// Premium modal content
export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  icon?: string;
  requiresTier: 'core' | 'complete' | 'lifetime';
}

// Subscription tiers with pricing
export interface SubscriptionTier {
  id: 'free' | 'core' | 'complete' | 'lifetime';
  name: string;
  price: number;
  interval?: 'week' | 'month' | 'lifetime';
  features: string[];
  scriptLimit: number | null; // null = unlimited
}
