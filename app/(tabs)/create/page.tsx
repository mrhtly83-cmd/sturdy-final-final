"use client";

import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useChild } from "@/hooks/useChild";
import { supabase } from "@/src/lib/supabase";
import * as Clipboard from "expo-clipboard";
import { PremiumGuard } from "@/components/sturdy/PremiumGuard";

const STRUGGLE_OPTIONS = [
  "Aggression",
  "Screen Time",
  "Bedtime Resistance",
  "Homework Battles",
  "Sibling Conflict",
  "Morning Routine",
  "Meltdowns",
  "Defiance",
];

type ScriptResponse = {
  validation: string;
  shift: string;
  script: string;
  rawModelResponse?: string;
};

export default function CreateScriptPage() {
  const { activeChild, loading: childLoading } = useChild();
  const [selectedStruggle, setSelectedStruggle] = useState<string>("");
  const [toneValue, setToneValue] = useState(50);
  const [generating, setGenerating] = useState(false);
  const [scriptResult, setScriptResult] = useState<ScriptResponse | null>(null);
  const [showWhy, setShowWhy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [premiumGuardRefresh, setPremiumGuardRefresh] = useState<(() => Promise<void>) | null>(null);

  const getToneLabel = (value: number): string => {
    if (value <= 33) return "Gentle";
    if (value <= 66) return "Moderate";
    return "Firm";
  };

  const handleGenerateScript = async (checkAndShowModal?: () => boolean) => {
    if (!selectedStruggle || !activeChild) return;
    
    // Check premium status before generating
    if (checkAndShowModal && !checkAndShowModal()) {
      return;
    }

    try {
      setGenerating(true);
      setScriptResult(null);
      
      // Get the Supabase URL from environment
      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
      
      const response = await fetch(
        `${supabaseUrl}/functions/v1/generate-script`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            childName: activeChild.name,
            childAgeYears: activeChild.age,
            neurotype: activeChild.neurotype,
            struggle: selectedStruggle,
            tone: getToneLabel(toneValue).toLowerCase(),
            scenarioType: "Rupture",
          }),
        }
      );

      const data = await response.json();
      
      if (data.error) {
        console.error("Script generation error:", data.error);
        setScriptResult({
          validation: "We encountered an issue generating your script.",
          shift: "Please try again in a moment.",
          script: "I'm here with you, and we'll get through this together.",
        });
      } else {
        setScriptResult(data);
        
        // Save to database
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("scripts").insert({
            parent_id: user.id,
            child_id: activeChild.id,
            situation: selectedStruggle,
            generated_script: data.script,
            psych_insight: data.validation + " " + data.shift,
          });
        }
      }
      
      // Refresh usage count after successful generation
      if (premiumGuardRefresh) {
        await premiumGuardRefresh();
      }
    } catch (error) {
      console.error("Error generating script:", error);
      setScriptResult({
        validation: "We encountered an issue generating your script.",
        shift: "Please try again in a moment.",
        script: "I'm here with you, and we'll get through this together.",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyScript = async () => {
    if (scriptResult?.script) {
      await Clipboard.setStringAsync(scriptResult.script);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (childLoading) {
    return (
      <View className="flex-1 bg-brand-slate items-center justify-center">
        <ActivityIndicator size="large" color="#0F172A" />
      </View>
    );
  }

  return (
    <PremiumGuard>
      {({ canGenerate, scriptsUsed, scriptsLimit, isPremium, loading: premiumLoading, checkAndShowModal, refreshUsage }) => {
        // Store refresh function for later use
        if (!premiumGuardRefresh && refreshUsage) {
          setPremiumGuardRefresh(() => refreshUsage);
        }
        
        return (
          <ScrollView className="flex-1 bg-brand-slate">
            <View className="p-6 pt-16">
              {/* Header */}
              <View className="mb-8">
                <Text className="text-4xl font-bold text-brand-navy mb-2">
                  {activeChild?.name || "No Child Selected"}
                </Text>
                <Text className="text-lg text-brand-sage">
                  Create a script for this moment
                </Text>
                {!isPremium && !premiumLoading && (
                  <View className="mt-2 bg-white rounded-lg p-3">
                    <Text className="text-sm text-brand-sage text-center">
                      {scriptsUsed} of {scriptsLimit} free scripts used this month
                    </Text>
                  </View>
                )}
              </View>

        {/* Struggle Picker */}
        <View className="mb-8">
          <Text className="text-xl font-semibold text-brand-navy mb-4">
            What's the struggle?
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {STRUGGLE_OPTIONS.map((struggle) => (
              <TouchableOpacity
                key={struggle}
                onPress={() => setSelectedStruggle(struggle)}
                className={`px-4 py-3 rounded-lg ${
                  selectedStruggle === struggle
                    ? "bg-brand-navy"
                    : "bg-white border border-brand-sage"
                }`}
              >
                <Text
                  className={`text-base font-medium ${
                    selectedStruggle === struggle
                      ? "text-white"
                      : "text-brand-navy"
                  }`}
                >
                  {struggle}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tone Slider */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-xl font-semibold text-brand-navy">
              Tone
            </Text>
            <Text className="text-base font-medium text-brand-sage">
              {getToneLabel(toneValue)}
            </Text>
          </View>
          <View className="bg-white rounded-lg p-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-brand-sage">Gentle (0)</Text>
              <Text className="text-sm text-brand-sage">Firm (100)</Text>
            </View>
            <View className="h-12 flex-row items-center">
              <View className="flex-1 h-2 bg-gray-200 rounded-full">
                <View
                  className="h-2 bg-brand-navy rounded-full"
                  style={{ width: `${toneValue}%` }}
                />
              </View>
            </View>
            <View className="flex-row justify-between mt-2">
              {[0, 25, 50, 75, 100].map((value) => (
                <TouchableOpacity
                  key={value}
                  onPress={() => setToneValue(value)}
                  className="w-10 h-10 items-center justify-center"
                >
                  <View
                    className={`w-8 h-8 rounded-full border-2 items-center justify-center ${
                      Math.abs(toneValue - value) <= 5
                        ? "border-brand-navy bg-brand-navy"
                        : "border-brand-sage"
                    }`}
                  >
                    <Text
                      className={`text-xs ${
                        Math.abs(toneValue - value) <= 5
                          ? "text-white"
                          : "text-brand-sage"
                      }`}
                    >
                      {value}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

              {/* Generate Button */}
              <TouchableOpacity
                onPress={() => handleGenerateScript(checkAndShowModal)}
                disabled={!selectedStruggle || !activeChild || generating || !canGenerate}
                className={`py-4 rounded-lg mb-8 ${
                  !selectedStruggle || !activeChild || generating || !canGenerate
                    ? "bg-gray-300"
                    : "bg-brand-navy"
                }`}
              >
                {generating ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-lg font-semibold text-center">
                    {!canGenerate ? "Upgrade for More Scripts" : "Generate Script"}
                  </Text>
                )}
              </TouchableOpacity>

        {/* Script Result Card */}
        {scriptResult && (
          <View className="bg-white rounded-2xl p-6 shadow-lg mb-8">
            {/* Validation */}
            <View className="mb-4 pb-4 border-b border-gray-200">
              <Text className="text-sm font-medium text-brand-sage mb-2">
                For You
              </Text>
              <Text className="text-base text-brand-navy leading-relaxed">
                {scriptResult.validation}
              </Text>
            </View>

            {/* Shift */}
            <View className="mb-4 pb-4 border-b border-gray-200">
              <Text className="text-sm font-medium text-brand-sage mb-2">
                The Shift
              </Text>
              <Text className="text-base text-brand-navy leading-relaxed">
                {scriptResult.shift}
              </Text>
            </View>

            {/* Script */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-brand-sage mb-2">
                Your Script
              </Text>
              <Text className="text-lg font-medium text-brand-navy leading-relaxed">
                {scriptResult.script}
              </Text>
            </View>

            {/* Copy Button */}
            <TouchableOpacity
              onPress={handleCopyScript}
              className="bg-brand-gold py-3 rounded-lg mb-4"
            >
              <Text className="text-white text-base font-semibold text-center">
                {copied ? "✓ Copied!" : "Copy Script"}
              </Text>
            </TouchableOpacity>

            {/* Sturdy Why Collapsible */}
            <TouchableOpacity
              onPress={() => setShowWhy(!showWhy)}
              className="py-2"
            >
              <Text className="text-brand-navy font-semibold text-center">
                {showWhy ? "▼" : "▶"} Sturdy Why
              </Text>
            </TouchableOpacity>

            {showWhy && (
              <View className="mt-4 p-4 bg-brand-slate rounded-lg">
                <Text className="text-sm font-semibold text-brand-navy mb-2">
                  The Psychology Behind This Script
                </Text>
                <Text className="text-sm text-brand-navy leading-relaxed mb-3">
                  This script is rooted in <Text className="font-semibold">Attachment Theory</Text>, 
                  which shows that children feel safest when their caregivers remain calm and connected, 
                  even during difficult moments.
                </Text>
                <Text className="text-sm text-brand-navy leading-relaxed mb-3">
                  <Text className="font-semibold">Identity vs. Behavior:</Text> We separate who your 
                  child is (a good kid) from what they're doing (having a hard time). This protects 
                  their sense of self while still addressing the behavior.
                </Text>
                <Text className="text-sm text-brand-navy leading-relaxed mb-3">
                  <Text className="font-semibold">Connection Before Correction:</Text> By validating 
                  emotions first, you build trust. Once your child feels seen and safe, they're more 
                  receptive to boundaries and guidance.
                </Text>
                <Text className="text-sm text-brand-navy leading-relaxed">
                  <Text className="font-semibold">Tone matters:</Text> The firmness level you selected 
                  adjusts the language to match the intensity needed while maintaining connection. 
                  Sturdy parents lead with warmth and clarity.
                </Text>
              </View>
            )}
              </View>
            )}
            </View>
          </ScrollView>
        );
      }}
    </PremiumGuard>
  );
}
