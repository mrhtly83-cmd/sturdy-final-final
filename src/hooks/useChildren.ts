import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Child } from "../types";

type UseChildrenResult = {
  children: Child[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useChildren(): UseChildrenResult {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChildren = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setChildren([]);
        return;
      }

      const { data, error: supabaseError } = await supabase
        .from("children")
        .select("*")
        .eq("parent_id", user.id)
        .order("created_at", { ascending: false });

      if (supabaseError) {
        setError(supabaseError.message);
        return;
      }

      setChildren(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChildren();

    // Refetch on auth state changes
    const { data: authSub } = supabase.auth.onAuthStateChange(() => {
      fetchChildren();
    });

    return () => {
      authSub?.subscription?.unsubscribe();
    };
  }, [fetchChildren]);

  return { children, loading, error, refresh: fetchChildren };
}