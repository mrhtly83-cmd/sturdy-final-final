import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export type Child = {
  id: string;
  user_id: string;
  name: string;
  birth_date: string; // ISO date string
  created_at: string;
};

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
      const { data, error: supabaseError } = await supabase
        .from("children")
        .select("*")
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

    // Optional: refetch on auth state changes
    const { data: authSub } = supabase.auth.onAuthStateChange(() => {
      fetchChildren();
    });

    return () => {
      authSub?.subscription?.unsubscribe();
    };
  }, [fetchChildren]);

  return { children, loading, error, refresh: fetchChildren };
}