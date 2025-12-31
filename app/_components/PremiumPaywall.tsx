import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { PLAN_DETAILS, PlanKey } from "../../src/constants/billing";

interface PremiumPaywallProps {
  onSubscribeWeekly: () => void;
  onSubscribeMonthly: () => void;
  onSubscribeLifetime: () => void;
}
const SECONDARY_PLAN_MAP: Record<PlanKey, PlanKey> = {
  weekly: "monthly",
  monthly: "lifetime",
  lifetime: "monthly",
};

interface FeatureProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  text: string;
  lock?: boolean;
}

export default function PremiumPaywall({
  onSubscribeWeekly,
  onSubscribeMonthly,
  onSubscribeLifetime,
}: PremiumPaywallProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>("monthly");

  const priceText = PLAN_DETAILS[selectedPlan].price;
  const planHandlers: Record<PlanKey, () => void> = {
    weekly: onSubscribeWeekly,
    monthly: onSubscribeMonthly,
    lifetime: onSubscribeLifetime,
  };

  const ctaStyle = selectedPlan === "lifetime" ? styles.ctaLifetime : styles.ctaMonthly;
  const ctaHandler = planHandlers[selectedPlan];
  const ctaLabel = PLAN_DETAILS[selectedPlan].cta;
  const ctaIcon = selectedPlan === "lifetime" ? "infinity" : "credit-card-outline";

  const secondaryPlan = SECONDARY_PLAN_MAP[selectedPlan];
  const secondaryHandler = planHandlers[secondaryPlan];

  return (
    <ScrollView contentContainerStyle={styles.bg}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <MaterialIcons name="stars" size={34} color="#fbb900" />
          <Text style={styles.title}>Sturdy Complete</Text>
        </View>

        <Text style={styles.subtitle}>
          Unlock unlimited scripts, audio playback, co-parent sync, and more!
        </Text>

        <View style={styles.planTabs}>
          <Pressable
            style={[styles.planTab, selectedPlan === "weekly" && styles.selectedTab]}
            onPress={() => setSelectedPlan("weekly")}
          >
            <Text style={selectedPlan === "weekly" ? styles.tabTextSelected : styles.tabText}>
              Weekly
            </Text>
          </Pressable>
          <Pressable
            style={[styles.planTab, selectedPlan === "monthly" && styles.selectedTab]}
            onPress={() => setSelectedPlan("monthly")}
          >
            <Text style={selectedPlan === "monthly" ? styles.tabTextSelected : styles.tabText}>Monthly</Text>
          </Pressable>
          <Pressable
            style={[styles.planTab, selectedPlan === "lifetime" && styles.selectedTab]}
            onPress={() => setSelectedPlan("lifetime")}
          >
            <Text style={selectedPlan === "lifetime" ? styles.tabTextSelected : styles.tabText}>Lifetime</Text>
          </Pressable>
        </View>

        <View style={styles.promo}>
          <MaterialIcons name="bolt" size={18} color="#36d4ba" />
          <Text style={styles.promoText}>{priceText}</Text>
        </View>

        <View style={styles.featureList}>
          <Feature icon="check-circle" text={PLAN_DETAILS[selectedPlan].scriptsCopy} />
          <Feature icon="check-circle" text="Audio Script Playback" />
          <Feature icon="check-circle" text="Co-Parent Sync" />
          <Feature icon="check-circle" text="Save & revisit favorites" />
          <Feature icon="check-circle" text="Early access to new features" />
          <Feature icon="check-circle" text="Priority support" lock />
        </View>

        <Pressable style={ctaStyle} onPress={ctaHandler}>
          <MaterialCommunityIcons
            name={ctaIcon}
            size={22}
            color="#fff"
          />
          <Text style={styles.ctaText}>{ctaLabel}</Text>
        </Pressable>

        <Pressable
          style={[ctaStyle, styles.secondaryCta]}
          onPress={secondaryHandler}
        >
          <MaterialCommunityIcons
            name={secondaryPlan === "lifetime" ? "infinity" : "credit-card-outline"}
            size={22}
            color={secondaryPlan === "lifetime" ? "#fbb900" : "#36d4ba"}
          />
          <Text
            style={[
              styles.ctaText,
              secondaryPlan === "lifetime" ? styles.ctaTextAltLifetime : styles.ctaTextAltMonthly,
            ]}
          >
            {PLAN_DETAILS[secondaryPlan].cta}
          </Text>
        </Pressable>

        <Text style={styles.contact}>Questions? We’re here: support@sturdy.help</Text>
      </View>
    </ScrollView>
  );
}

function Feature({ icon, text, lock }: FeatureProps) {
  const showLock = !!lock;
  const IconComponent = showLock ? MaterialCommunityIcons : MaterialIcons;
  const iconName = showLock ? "lock-outline" : icon;

  return (
    <View style={styles.featureRow}>
      <IconComponent
        name={iconName as any}
        size={22}
        color={showLock ? "#c79b2c" : "#36d4ba"}
      />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3ede7",
    paddingVertical: 24,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 30,
    padding: 24,
    width: "94%",
    maxWidth: 410,
    borderWidth: 2,
    borderColor: "#fbb900",
    shadowColor: "#fbb900",
    shadowOpacity: 0.13,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    alignItems: "center",
    marginTop: 32,
    marginBottom: 36,
  },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 11 },
  title: { color: "#27323a", fontSize: 28, fontWeight: "800", marginLeft: 10, letterSpacing: 0.5 },
  subtitle: { color: "#434343", fontSize: 15.5, marginBottom: 22, textAlign: "center" },
  planTabs: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
  },
  planTab: { paddingVertical: 7, paddingHorizontal: 26 },
  selectedTab: { backgroundColor: "#fbb90022" },
  tabText: { fontWeight: "bold", color: "#94631c", fontSize: 16, opacity: 0.73 },
  tabTextSelected: { fontWeight: "bold", color: "#fbb900", fontSize: 16 },
  featureList: { width: "100%", marginVertical: 17, marginLeft: 6 },
  featureRow: { flexDirection: "row", alignItems: "center", marginBottom: 11 },
  featureText: { color: "#27323a", fontSize: 15.5, marginLeft: 10, fontWeight: "600" },
  promo: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 14, marginTop: 2 },
  promoText: { color: "#36d4ba", fontSize: 13.8, letterSpacing: 0.1, textAlign: "center", marginLeft: 6 },
  ctaMonthly: {
    backgroundColor: "#36d4ba",
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    paddingHorizontal: 36,
    marginVertical: 8,
    width: "93%",
  },
  ctaLifetime: {
    backgroundColor: "#fbb900",
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    paddingHorizontal: 36,
    width: "93%",
    marginVertical: 8,
  },
  ctaText: { color: "#fff", fontWeight: "bold", fontSize: 18, marginLeft: 10 },
  ctaTextAltMonthly: { color: "#36d4ba" },
  ctaTextAltLifetime: { color: "#fbb900" },
  secondaryCta: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e8e0d7",
  },
  contact: { marginTop: 17, color: "#8a8a81", fontSize: 13, opacity: 0.7, textAlign: "center" },
});
