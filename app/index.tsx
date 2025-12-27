// app/index.tsx
import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type PopAnim = {
  opacity: Animated.Value;
  translateY: Animated.Value;
  scale: Animated.Value;
};

function usePopIn(delayMs: number) {
  const anim = useRef<PopAnim>({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(16),
    scale: new Animated.Value(0.98),
  }).current;

  useEffect(() => {
    const ease = Easing.out(Easing.cubic);

    Animated.sequence([
      Animated.delay(delayMs),
      Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 520,
          easing: ease,
          useNativeDriver: true,
        }),
        Animated.timing(anim.translateY, {
          toValue: 0,
          duration: 520,
          easing: ease,
          useNativeDriver: true,
        }),
        Animated.timing(anim.scale, {
          toValue: 1,
          duration: 520,
          easing: ease,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [anim, delayMs]);

  const style = useMemo(
    () => ({
      opacity: anim.opacity,
      transform: [{ translateY: anim.translateY }, { scale: anim.scale }],
    }),
    [anim.opacity, anim.scale, anim.translateY]
  );

  return style;
}

function GlassRow({
  icon,
  title,
  sub,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  sub: string;
}) {
  return (
    <BlurView intensity={22} tint="dark" style={styles.featureCard}>
      <LinearGradient
        colors={[
          "rgba(255,255,255,0.12)",
          "rgba(255,255,255,0.04)",
          "rgba(0,0,0,0.12)",
        ]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.featureBorder} />
      <View style={styles.featureRow}>
        <View style={styles.featureIconWrap}>
          <LinearGradient
            colors={["rgba(77,208,161,0.60)", "rgba(124,92,255,0.40)"]}
            style={StyleSheet.absoluteFill}
          />
          <Ionicons name={icon} size={18} color="rgba(255,255,255,0.92)" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.featureTitle}>{title}</Text>
          <Text style={styles.featureSub}>{sub}</Text>
        </View>
      </View>
    </BlurView>
  );
}

export default function IntroScreen() {
  // Pop-in animations (staggered)
  const aBrand = usePopIn(140);
  const aPill = usePopIn(240);
  const aHero = usePopIn(340);
  const aSub = usePopIn(440);
  const aFeatures = usePopIn(560);
  const aHow = usePopIn(680);
  const aCta = usePopIn(820);

  return (
    <View style={styles.container}>
      {/* Background Video */}
      <Video
        source={require("../assets/videos/hero.mp4")}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
      />

      {/* Readability overlay */}
      <LinearGradient
        colors={[
          "rgba(0,0,0,0.10)",
          "rgba(0,0,0,0.35)",
          "rgba(0,0,0,0.72)",
          "rgba(0,0,0,0.92)",
        ]}
        locations={[0, 0.45, 0.78, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        <Animated.View style={[styles.brandRow, aBrand]}>
          <View style={styles.brandBadge}>
            <LinearGradient
              colors={["rgba(124,92,255,0.95)", "rgba(77,208,161,0.78)"]}
              style={StyleSheet.absoluteFill}
            />
          </View>
          <Text style={styles.brandText}>STURDY</Text>
        </Animated.View>

        <Animated.View style={[styles.pillWrap, aPill]}>
          <BlurView intensity={18} tint="dark" style={styles.pill}>
            <Text style={styles.pillText}>Trusted by 42k+ families</Text>
          </BlurView>
        </Animated.View>

        <Animated.View style={aHero}>
          <Text style={styles.headline}>Welcome.</Text>
          <Text style={styles.headline2}>Design the words that calm your home.</Text>
        </Animated.View>

        <Animated.View style={aSub}>
          <Text style={styles.subhead}>
            Science-backed scripts to help you navigate big feelings and busy days
            with confidence.
          </Text>
        </Animated.View>

        <Animated.View style={aFeatures}>
          <Text style={styles.sectionTitle}>What Sturdy offers</Text>

          <GlassRow
            icon="sparkles"
            title="Calm words, on demand"
            sub="Everything is designed to feel steady, supportive, and fast."
          />
          <GlassRow
            icon="shield-checkmark"
            title="Science-backed scripts"
            sub="Connection-first words you can trust."
          />
          <GlassRow
            icon="flash"
            title="Personalized in seconds"
            sub="Tone + context tuned to your family."
          />
          <GlassRow
            icon="time"
            title="Ready when life happens"
            sub="Built for big feelings and busy days."
          />
        </Animated.View>

        <Animated.View style={aHow}>
          <Text style={styles.sectionTitle}>How it works</Text>

          <View style={styles.stepsRow}>
            <View style={styles.step}>
              <Text style={styles.stepKicker}>Step 1</Text>
              <Text style={styles.stepTitle}>Answer 3 questions</Text>
              <Text style={styles.stepSub}>Kids, tone, and what’s happening now.</Text>
            </View>

            <View style={styles.step}>
              <Text style={styles.stepKicker}>Step 2</Text>
              <Text style={styles.stepTitle}>Get a calm script</Text>
              <Text style={styles.stepSub}>
                AI generates language designed to reduce conflict.
              </Text>
            </View>

            <View style={styles.step}>
              <Text style={styles.stepKicker}>Step 3</Text>
              <Text style={styles.stepTitle}>Use & save</Text>
              <Text style={styles.stepSub}>
                Copy it, speak it, and save to your journal.
              </Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.ctaBlock, aCta]}>
          <Pressable onPress={() => router.push("/quiz/child")} style={styles.ctaWrap}>
            <BlurView intensity={22} tint="dark" style={styles.ctaGlass}>
              <LinearGradient
                colors={["rgba(77,208,161,0.65)", "rgba(124,92,255,0.35)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <Text style={styles.ctaText}>Get my first script</Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color="rgba(255,255,255,0.9)"
              />
            </BlurView>
          </Pressable>

          <Text style={styles.footer}>No judgment. Just support.</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 28,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  brandBadge: {
    width: 22,
    height: 22,
    borderRadius: 7,
    overflow: "hidden",
    opacity: 0.95,
  },
  brandText: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 3,
  },

  pillWrap: { marginBottom: 14 },
  pill: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    overflow: "hidden",
  },
  pillText: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 12.5,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  headline: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "900",
  },
  headline2: {
    marginTop: 6,
    color: "rgba(255,255,255,0.92)",
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800",
  },

  subhead: {
    marginTop: 12,
    color: "rgba(255,255,255,0.72)",
    fontSize: 15.5,
    lineHeight: 22,
    fontWeight: "600",
  },

  sectionTitle: {
    marginTop: 18,
    marginBottom: 10,
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },

  featureCard: {
    borderRadius: 20,
    overflow: "hidden",
    padding: 14,
    marginBottom: 10,
  },
  featureBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  featureIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  featureTitle: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 15.5,
    fontWeight: "800",
  },
  featureSub: {
    marginTop: 3,
    color: "rgba(255,255,255,0.62)",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },

  stepsRow: {
    gap: 10,
  },
  step: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    backgroundColor: "rgba(0,0,0,0.20)",
    padding: 12,
  },
  stepKicker: {
    color: "rgba(255,255,255,0.60)",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  stepTitle: {
    marginTop: 4,
    color: "rgba(255,255,255,0.90)",
    fontSize: 15,
    fontWeight: "800",
  },
  stepSub: {
    marginTop: 4,
    color: "rgba(255,255,255,0.62)",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },

  ctaBlock: { marginTop: 16 },
  ctaWrap: { marginTop: 2 },
  ctaGlass: {
    height: 56,
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  ctaText: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.2,
  },

  footer: {
    marginTop: 12,
    textAlign: "center",
    color: "rgba(255,255,255,0.55)",
    fontSize: 13,
    fontWeight: "700",
  },
});
