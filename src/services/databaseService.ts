// src/services/databaseService.ts
import { supabase } from "../lib/supabase";
import { Profile, Script, Child } from "../types";

/**
 * Create a user profile on signup
 * User ID comes from auth.users, profile is auto-created by trigger
 * This function is for manual profile creation if needed
 */
export async function createUserProfile(
  userId: string,
  fullName?: string
): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        full_name: fullName || null,
        is_premium: false,
        subscription_tier: "free",
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
 * Get all children for a user
 */
export async function getUserChildren(userId: string): Promise<Child[]> {
  try {
    const { data, error } = await supabase
      .from("children")
      .select("*")
      .eq("parent_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching children:", error);
    return [];
  }
}

/**
 * Create a new child profile
 */
export async function createChild(
  userId: string,
  childData: {
    name: string;
    birth_date: string;
    neurotype?: string;
  }
): Promise<Child | null> {
  try {
    const { data, error } = await supabase
      .from("children")
      .insert({
        parent_id: userId,
        name: childData.name,
        birth_date: childData.birth_date,
        neurotype: childData.neurotype || "Neurotypical",
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating child:", error);
    return null;
  }
}

/**
 * Update a child profile
 */
export async function updateChild(
  childId: string,
  updates: Partial<Pick<Child, "name" | "birth_date" | "neurotype">>
): Promise<Child | null> {
  try {
    const { data, error } = await supabase
      .from("children")
      .update(updates)
      .eq("id", childId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating child:", error);
    return null;
  }
}

/**
 * Save a generated script
 */
export async function saveScript(
  userId: string,
  scriptData: {
    child_id?: string | null;
    situation: string;
    generated_script: string;
    psych_insight?: string | null;
  }
): Promise<Script | null> {
  try {
    const { data, error } = await supabase
      .from("scripts")
      .insert({
        parent_id: userId,
        child_id: scriptData.child_id || null,
        situation: scriptData.situation,
        generated_script: scriptData.generated_script,
        psych_insight: scriptData.psych_insight || null,
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
      .eq("parent_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching user scripts:", error);
    return [];
  }
}

/**
 * Update script (e.g., toggle favorite)
 */
export async function updateScript(
  scriptId: string,
  updates: Partial<Pick<Script, "is_favorite">>
): Promise<Script | null> {
  try {
    const { data, error } = await supabase
      .from("scripts")
      .update(updates)
      .eq("id", scriptId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating script:", error);
    return null;
  }
}

/**
 * Delete a script
 */
export async function deleteScript(scriptId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("scripts")
      .delete()
      .eq("id", scriptId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting script:", error);
    return false;
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
