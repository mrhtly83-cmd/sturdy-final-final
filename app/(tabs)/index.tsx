import React, { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Video, ResizeMode } from "expo-av";
import { router } from "expo-router";
import { theme } from "../../src/styles/theme";

const { height: H } = Dimensions.get("window");

function useStaggerIn(count: number) {
  const vals = useRef(
    Array.from({ length: count }).map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const anims = vals.map((v) =>
      Animated.spring(v, {
        toValue: 1,
        speed: 14,
        bounciness: 8,
        useNativeDriver: true,
      })
    );

    Animated.stagger(110, anims).start();
  }, [vals]);

  return vals;
}

function StaggerItem({
  v,
  children,
}: {
  v: Animated.Value;
  children: React.ReactNode;
}) {
  return (
    <Animated.View
      style={{
        opacity: v,
        transform: [
          {
            translateY: v.interpolate({
              inputRange: [0, 1],
              outputRange: [18, 0],
            }),
          },
          {
            scale: v.interpolate({
              inputRange: [0, 1],
              outputRange: [0.98, 1],
            }),
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
}

export default function HomeIntro() {
  // 0: welcome, 1: trust badge, 2: headline, 3: sub, 4: features card, 5: CTA row
  const items = useStaggerIn(6);

  const goToFirstScript = () => {
    // typed-routes sometimes complains; this avoids TS blocking builds
    router.push("/(tabs)/create" as any);
  };

  return (
    <View style={styles.container}>
      {/* Background video */}
      <Video
        source={require("../../assets/videos/hero.mp4")}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
      />

      {/* Overlay gradient for readability */}
      <LinearGradient
        colors={[
          "rgba(11,15,23,0.20)",
          "rgba(11,15,23,0.70)",
          "rgba(11,15,23,0.95)",
          "rgba(11,15,23,1)",
        ]}
        locations={[0, 0.45, 0.78, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Content */}
      <View style={styles.content}>
        <StaggerItem v={items[0]}>
          <Text style={styles.welcome}>Welcome</Text>
        </StaggerItem>

        <StaggerItem v={items[1]}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Trusted by 42k+ families</Text>
          </View>
        </StaggerItem>

        <StaggerItem v={items[2]}>
          <Text style={styles.title}>Design the words that calm your home</Text>
        </StaggerItem>

        <StaggerItem v={items[3]}>
          <Text style={styles.sub}>
            Science-backed scripts to help you navigate big feelings and busy
            days with confidence.
          </Text>
        </StaggerItem>

        <StaggerItem v={items[4]}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Calm words, on demand</Text>
            <Text style={styles.cardSub}>
              Everything is designed to feel steady, supportive, and fast.
            </Text>

            <View style={styles.featureRow}>
              <View style={styles.dot} />
              <View style={styles.featureTextWrap}>
                <Text style={styles.featureTitle}>Science-backed scripts</Text>
                <Text style={styles.featureSub}>
                  Connection-first words you can trust.
                </Text>
              </View>
            </View>

            <View style={styles.featureRow}>
              <View style={styles.dot} />
              <View style={styles.featureTextWrap}>
                <Text style={styles.featureTitle}>Personalized in seconds</Text>
                <Text style={styles.featureSub}>
                  Tone + context tuned to your family.
                </Text>
              </View>
            </View>

            <View style={styles.featureRow}>
              <View style={styles.dot} />
              <View style={styles.featureTextWrap}>
                <Text style={styles.featureTitle}>Ready when life happens</Text>
                <Text style={styles.featureSub}>
                  Built for big feelings and busy days.
                </Text>
              </View>
            </View>
          </View>
        </StaggerItem>

        <StaggerItem v={items[5]}>
          <View style={styles.ctaRow}>
            <Pressable style={styles.primaryBtn} onPress={goToFirstScript}>
              <Text style={styles.primaryBtnText}>Get my first script</Text>
            </Pressable>

            <Pressable
              style={styles.secondaryBtn}
              onPress={() => router.push("/(tabs)/explore" as any)}
            >
              <Text style={styles.secondaryBtnText}>How it works</Text>
            </Pressable>
          </View>
        </StaggerItem>

        <View style={styles.bottomFade} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0F17" },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.select({ ios: 64, android: 56, default: 56 }),
    paddingBottom: 18,
    justifyContent: "flex-end",
  },

  welcome: {
    color: "rgba(255,255,255,0.90)",
    fontSize: 14,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 10,
  },

  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    marginBottom: 12,
  },
  badgeText: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 13,
  },

  title: {
    color: theme.colors.text,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "700",
    marginBottom: 10,
    maxWidth: 520,
  },

  sub: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
    maxWidth: 560,
  },

  card: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    marginBottom: 14,
  },
  cardTitle: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  cardSub: {
    color: "rgba(255,255,255,0.74)",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },

  featureRow: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.10)",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 99,
    backgroundColor: "rgba(255,255,255,0.60)",
    marginTop: 6,
  },
  featureTextWrap: { flex: 1 },
  featureTitle: {
    color: "rgba(255,255,255,0.90)",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  featureSub: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 13,
    lineHeight: 18,
  },

  ctaRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    paddingBottom: Math.max(10, H * 0.02),
  },

  primaryBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.92)",
  },
  primaryBtnText: {
    color: "rgba(0,0,0,0.92)",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.2,
  },

  secondaryBtn: {
    height: 52,
    paddingHorizontal: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  secondaryBtnText: {
    color: "rgba(255,255,255,0.86)",
    fontSize: 14,
    fontWeight: "700",
  },

  bottomFade: {
    height: 10,
  },
});
