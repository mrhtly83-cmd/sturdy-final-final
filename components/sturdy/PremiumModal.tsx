"use client";

import React from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";

type PremiumModalProps = {
  visible: boolean;
  onClose: () => void;
  scriptsUsed: number;
  scriptsLimit: number;
};

export function PremiumModal({
  visible,
  onClose,
  scriptsUsed,
  scriptsLimit,
}: PremiumModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center p-6">
        <View className="bg-white rounded-3xl w-full max-w-md overflow-hidden">
          {/* Header */}
          <View className="bg-brand-navy p-8 items-center">
            <Text className="text-4xl mb-2">✨</Text>
            <Text className="text-2xl font-bold text-white mb-2">
              Sturdy Complete
            </Text>
            <Text className="text-base text-brand-slate text-center">
              Unlimited scripts, premium features, peace of mind
            </Text>
          </View>

          <ScrollView className="p-6">
            {/* Usage Info */}
            <View className="bg-brand-slate rounded-xl p-4 mb-6">
              <Text className="text-center text-brand-navy text-base">
                You've used <Text className="font-bold">{scriptsUsed}</Text> of your{" "}
                <Text className="font-bold">{scriptsLimit}</Text> free scripts this month
              </Text>
            </View>

            {/* Features */}
            <View className="mb-6">
              <Text className="text-xl font-bold text-brand-navy mb-4">
                With Sturdy Complete:
              </Text>
              
              <View className="space-y-3">
                <View className="flex-row items-start">
                  <Text className="text-brand-gold text-xl mr-3">✓</Text>
                  <Text className="flex-1 text-brand-navy text-base leading-relaxed">
                    <Text className="font-semibold">Unlimited Scripts</Text> - Generate as many scripts as you need, whenever you need them
                  </Text>
                </View>

                <View className="flex-row items-start">
                  <Text className="text-brand-gold text-xl mr-3">✓</Text>
                  <Text className="flex-1 text-brand-navy text-base leading-relaxed">
                    <Text className="font-semibold">Priority SOS Support</Text> - Instant high-urgency scripts when moments get tough
                  </Text>
                </View>

                <View className="flex-row items-start">
                  <Text className="text-brand-gold text-xl mr-3">✓</Text>
                  <Text className="flex-1 text-brand-navy text-base leading-relaxed">
                    <Text className="font-semibold">Script History</Text> - Save and revisit your favorite scripts
                  </Text>
                </View>

                <View className="flex-row items-start">
                  <Text className="text-brand-gold text-xl mr-3">✓</Text>
                  <Text className="flex-1 text-brand-navy text-base leading-relaxed">
                    <Text className="font-semibold">Advanced Customization</Text> - Fine-tune scripts for your family's unique needs
                  </Text>
                </View>

                <View className="flex-row items-start">
                  <Text className="text-brand-gold text-xl mr-3">✓</Text>
                  <Text className="flex-1 text-brand-navy text-base leading-relaxed">
                    <Text className="font-semibold">Clinical Insights</Text> - Deep dives into attachment theory and child development
                  </Text>
                </View>
              </View>
            </View>

            {/* Pricing */}
            <View className="bg-brand-gold/10 rounded-xl p-4 mb-6">
              <Text className="text-center text-brand-navy text-sm mb-1">
                Premium Access
              </Text>
              <Text className="text-center text-3xl font-bold text-brand-navy mb-1">
                $9.99<Text className="text-base font-normal">/month</Text>
              </Text>
              <Text className="text-center text-brand-sage text-sm">
                or $79.99/year (save 33%)
              </Text>
            </View>

            {/* CTA Button */}
            <TouchableOpacity className="bg-brand-gold py-4 rounded-xl mb-3">
              <Text className="text-white text-lg font-bold text-center">
                Upgrade to Complete
              </Text>
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity onPress={onClose} className="py-3">
              <Text className="text-brand-sage text-center text-base">
                Maybe Later
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
