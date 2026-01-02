"use client";

import React, { useState, useEffect, type ReactNode } from "react";
import { supabase } from "@/src/lib/supabase";
import { PremiumModal } from "./PremiumModal";

type PremiumGuardProps = {
  children: (props: {
    canGenerate: boolean;
    scriptsUsed: number;
    scriptsLimit: number;
    isPremium: boolean;
    loading: boolean;
    checkAndShowModal: () => boolean;
    refreshUsage: () => Promise<void>;
  }) => ReactNode;
};

export function PremiumGuard({ children }: PremiumGuardProps) {
  const [isPremium, setIsPremium] = useState(false);
  const [scriptsUsed, setScriptsUsed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const SCRIPTS_LIMIT = 5;

  useEffect(() => {
    checkPremiumStatus();
  }, []);

  const checkPremiumStatus = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // Check premium status
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_premium")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        setLoading(false);
        return;
      }

      setIsPremium(profile?.is_premium || false);

      // If not premium, check script usage this month
      if (!profile?.is_premium) {
        await refreshUsage();
      }

      setLoading(false);
    } catch (error) {
      console.error("Error in checkPremiumStatus:", error);
      setLoading(false);
    }
  };

  const refreshUsage = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const { data: scripts, error: scriptsError } = await supabase
        .from("scripts")
        .select("id")
        .eq("parent_id", user.id)
        .gte("created_at", startOfMonth.toISOString());

      if (scriptsError) {
        console.error("Error fetching scripts:", scriptsError);
      } else {
        setScriptsUsed(scripts?.length || 0);
      }
    } catch (error) {
      console.error("Error refreshing usage:", error);
    }
  };

  const canGenerate = isPremium || scriptsUsed < SCRIPTS_LIMIT;

  const checkAndShowModal = (): boolean => {
    if (!canGenerate) {
      setShowPremiumModal(true);
      return false;
    }
    return true;
  };

  return (
    <>
      {children({
        canGenerate,
        scriptsUsed,
        scriptsLimit: SCRIPTS_LIMIT,
        isPremium,
        loading,
        checkAndShowModal,
        refreshUsage,
      })}
      <PremiumModal
        visible={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        scriptsUsed={scriptsUsed}
        scriptsLimit={SCRIPTS_LIMIT}
      />
    </>
  );
}
