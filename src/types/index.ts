// src/types/index.ts

export interface User {
  id: string;
  email: string;
  created_at?: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  subscription_status: 'free' | 'premium' | 'trial';
  subscription_end_date?: string;
  scripts_used_this_week: number;
  created_at: string;
  updated_at: string;
}

export interface Child {
  id: string;
  user_id: string;
  name: string;
  age: number;
  neurotype?: string;
  notes?: string;
  created_at: string;
}

export interface Script {
  id: string;
  user_id: string;
  child_id?: string;
  struggle: string;
  tone: 'gentle' | 'moderate' | 'firm';
  content: string;
  is_favorite: boolean;
  created_at: string;
}

export interface ScriptRequest {
  childAge: number;
  childName?: string;
  neurotype?: string;
  struggle: string;
  tone: 'gentle' | 'moderate' | 'firm';
  context?: string;
}
