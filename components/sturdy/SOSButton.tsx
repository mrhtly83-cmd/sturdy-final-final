"use client";

import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Modal } from "react-native";
import { useChild } from "@/hooks/useChild";
import { supabase } from "@/src/lib/supabase";
import * as Clipboard from "expo-clipboard";

type SOSButtonProps = {
  canGenerateSOS?: boolean;
};

export function SOSButton({ canGenerateSOS = true }: SOSButtonProps) {
  const { activeChild } = useChild();
  const [generating, setGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [scriptResult, setScriptResult] = useState<{
    validation: string;
    shift: string;
    script: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSOSPress = async () => {
    if (!activeChild) {
      alert("Please select a child first");
      return;
    }

    try {
      setGenerating(true);
      
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
            struggle: "Immediate crisis or meltdown",
            tone: "gentle",
            scenarioType: "SOS",
            description: "I need help right now with an urgent situation",
          }),
        }
      );

      const data = await response.json();
      
      if (data.error) {
        console.error("SOS script generation error:", data.error);
        setScriptResult({
          validation: "You're handling a tough moment.",
          shift: "Your child needs you to be their steady anchor right now.",
          script: "I'm here. We're safe. Let's breathe together.",
        });
      } else {
        setScriptResult(data);
        
        // Save to database
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("scripts").insert({
            parent_id: user.id,
            child_id: activeChild.id,
            situation: "SOS - Urgent",
            generated_script: data.script,
            psych_insight: data.validation + " " + data.shift,
          });
        }
      }
      
      setShowResult(true);
    } catch (error) {
      console.error("Error generating SOS script:", error);
      setScriptResult({
        validation: "You're handling a tough moment.",
        shift: "Your child needs you to be their steady anchor right now.",
        script: "I'm here. We're safe. Let's breathe together.",
      });
      setShowResult(true);
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

  const handleClose = () => {
    setShowResult(false);
    setCopied(false);
  };

  return (
    <>
      {/* Floating SOS Button */}
      <View className="absolute bottom-8 right-6 z-50">
        <TouchableOpacity
          onPress={handleSOSPress}
          disabled={generating || !canGenerateSOS}
          className={`w-16 h-16 rounded-full items-center justify-center shadow-lg ${
            generating || !canGenerateSOS ? "bg-gray-400" : "bg-brand-gold"
          }`}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          {generating ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text className="text-white text-2xl font-bold">SOS</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* SOS Result Modal */}
      <Modal
        visible={showResult}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 pb-8">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-brand-gold rounded-full items-center justify-center mr-3">
                  <Text className="text-white font-bold text-lg">SOS</Text>
                </View>
                <View>
                  <Text className="text-xl font-bold text-brand-navy">
                    Urgent Support
                  </Text>
                  <Text className="text-sm text-brand-sage">
                    for {activeChild?.name}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={handleClose}>
                <Text className="text-2xl text-brand-sage">×</Text>
              </TouchableOpacity>
            </View>

            {scriptResult && (
              <View>
                {/* Validation */}
                <View className="mb-4">
                  <Text className="text-sm font-medium text-brand-gold mb-2">
                    For You Right Now
                  </Text>
                  <Text className="text-base text-brand-navy leading-relaxed">
                    {scriptResult.validation}
                  </Text>
                </View>

                {/* Shift */}
                <View className="mb-4">
                  <Text className="text-sm font-medium text-brand-gold mb-2">
                    Remember
                  </Text>
                  <Text className="text-base text-brand-navy leading-relaxed">
                    {scriptResult.shift}
                  </Text>
                </View>

                {/* Script */}
                <View className="bg-brand-slate rounded-xl p-4 mb-4">
                  <Text className="text-sm font-medium text-brand-sage mb-2">
                    Say This Now
                  </Text>
                  <Text className="text-lg font-semibold text-brand-navy leading-relaxed">
                    {scriptResult.script}
                  </Text>
                </View>

                {/* Copy Button */}
                <TouchableOpacity
                  onPress={handleCopyScript}
                  className="bg-brand-gold py-4 rounded-xl"
                >
                  <Text className="text-white text-base font-semibold text-center">
                    {copied ? "✓ Copied!" : "Copy Script"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}
