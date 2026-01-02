"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { supabase } from "@/src/lib/supabase";

export type Child = {
  id: string;
  name: string;
  age: number;
  neurotype: string;
};

type ChildContextValue = {
  activeChild: Child | null;
  children: Child[];
  switchChild: (child: Child) => void;
  fetchChildren: () => Promise<void>;
  loading: boolean;
};

const ChildContext = createContext<ChildContextValue | undefined>(undefined);

export function ChildProvider({ children }: { children: ReactNode }) {
  const [activeChild, setActiveChild] = useState<Child | null>(null);
  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch children from Supabase
  const fetchChildren = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setChildrenList([]);
        return;
      }

      const { data, error } = await supabase
        .from("children")
        .select("id, name, birth_date, neurotype")
        .eq("parent_id", user.id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching children:", error);
        return;
      }

      // Calculate age from birth_date
      const childrenWithAge = (data || []).map((child) => {
        const birthDate = new Date(child.birth_date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        return {
          id: child.id,
          name: child.name || "Unknown",
          age: age,
          neurotype: child.neurotype || "Neurotypical",
        };
      });

      setChildrenList(childrenWithAge);

      // Set first child as active if no active child and children exist
      if (!activeChild && childrenWithAge.length > 0) {
        setActiveChild(childrenWithAge[0]);
      }
    } catch (error) {
      console.error("Error in fetchChildren:", error);
    } finally {
      setLoading(false);
    }
  };

  // Switch active child
  const switchChild = (child: Child) => {
    setActiveChild(child);
  };

  // Fetch children on mount
  useEffect(() => {
    fetchChildren();
  }, []);

  const value = useMemo(
    () => ({
      activeChild,
      children: childrenList,
      switchChild,
      fetchChildren,
      loading,
    }),
    [activeChild, childrenList, loading]
  );

  return <ChildContext.Provider value={value}>{children}</ChildContext.Provider>;
}

export function useChild() {
  const ctx = useContext(ChildContext);
  if (!ctx) {
    throw new Error("useChild must be used within a ChildProvider");
  }
  return ctx;
}
