// src/services/databaseService.ts
import { supabase } from "../lib/supabase";
import { Profile, Script } from "../types";

/**
 * Create a user profile on signup
 */
export async function createUserProfile(
  userId: string,
  email: string
): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        email,
        subscription_status: "free",
        scripts_used_this_week: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating user profile:", error);
    return null;
  }
}

/**
 * Get user profile
 */
export async function getUserProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

/**
 * Save a generated script
 */
export async function saveScript(
  userId: string,
  scriptData: {
    child_id?: string;
    struggle: string;
    tone: "gentle" | "moderate" | "firm";
    content: string;
  }
): Promise<Script | null> {
  try {
    const { data, error } = await supabase
      .from("scripts")
      .insert({
        user_id: userId,
        child_id: scriptData.child_id,
        struggle: scriptData.struggle,
        tone: scriptData.tone,
        content: scriptData.content,
        is_favorite: false,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving script:", error);
    return null;
  }
}

/**
 * Get all scripts for a user
 */
export async function getUserScripts(userId: string): Promise<Script[]> {
  try {
    const { data, error } = await supabase
      .from("scripts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching user scripts:", error);
    return [];
  }
}

/**
 * Toggle favorite status of a script
 */
export async function toggleScriptFavorite(
  scriptId: string
): Promise<Script | null> {
  try {
    // First get the current script
    const { data: script, error: fetchError } = await supabase
      .from("scripts")
      .select("is_favorite")
      .eq("id", scriptId)
      .single();

    if (fetchError) throw fetchError;

    // Toggle the favorite status
    const { data, error } = await supabase
      .from("scripts")
      .update({ is_favorite: !script.is_favorite })
      .eq("id", scriptId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error toggling script favorite:", error);
    return null;
  }
}

/**
 * Increment script usage counter for weekly tracking
 */
export async function incrementScriptUsage(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase.rpc("increment_script_usage", {
      user_id: userId,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error incrementing script usage:", error);
    return false;
  }
}
