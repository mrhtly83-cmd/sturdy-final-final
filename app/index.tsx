// app/index.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  ZoomIn,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ResizeMode, Video } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_W } = Dimensions.get("window");

type Slide = {
  key: string;
  kind: "feature" | "step";
  pill: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  body: string;
};

function Dot({ active }: { active: boolean }) {
  const w = useSharedValue(active ? 18 : 8);
  useEffect(() => {
    w.value = withTiming(active ? 18 : 8, { duration: 220 });
  }, [active, w]);

  const rStyle = useAnimatedStyle(() => ({ width: w.value }));
  return <Animated.View style={[styles.dot, rStyle, active && styles.dotActive]} />;
}

function SlideCard({ slide }: { slide: Slide }) {
  return (
    <BlurView intensity={26} tint="dark" style={styles.slideCard}>
      <LinearGradient
        colors={["rgba(255,255,255,0.11)", "rgba(255,255,255,0.02)", "rgba(0,0,0,0.12)"]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.slideBorder} />

      <View style={styles.slideTopRow}>
        <View style={styles.iconWrap}>
          <LinearGradient
            colors={["rgba(124,92,255,0.85)", "rgba(77,208,161,0.55)"]}
            style={styles.iconBg}
          />
          <Ionicons name={slide.icon} size={18} color="white" />
        </View>

        <View style={styles.pill}>
          <Text style={styles.pillText}>{slide.pill}</Text>
        </View>
      </View>

      <Text style={styles.slideTitle}>{slide.title}</Text>
      <Text style={styles.slideBody}>{slide.body}</Text>
    </BlurView>
  );
}

export default function Intro() {
  const insets = useSafeAreaInsets();

  const slides: Slide[] = useMemo(
    () => [
      {
        key: "f1",
        kind: "feature",
        pill: "Features",
        icon: "chatbubbles-outline",
        title: "Calm words, on demand",
        body: "Everything is designed to feel steady, supportive, and fast.",
      },
      {
        key: "f2",
        kind: "feature",
        pill: "Features",
        icon: "sparkles-outline",
        title: "Science-backed scripts",
        body: "Connection-first words you can trust.",
      },
      {
        key: "f3",
        kind: "feature",
        pill: "Features",
        icon: "flash-outline",
        title: "Personalized in seconds",
        body: "Tone + context tuned to your family.",
      },
      {
        key: "f4",
        kind: "feature",
        pill: "Features",
        icon: "time-outline",
        title: "Ready when life happens",
        body: "Built for big feelings and busy days.",
      },
      {
        key: "s1",
        kind: "step",
        pill: "How it works",
        icon: "list-outline",
        title: "Step 1 · Answer 3 questions",
        body: "Kids, tone, and what’s happening right now.",
      },
      {
        key: "s2",
        kind: "step",
        pill: "How it works",
        icon: "bulb-outline",
        title: "Step 2 · Get a calm script",
        body: "AI generates language designed to reduce conflict.",
      },
      {
        key: "s3",
        kind: "step",
        pill: "How it works",
        icon: "bookmark-outline",
        title: "Step 3 · Use & save",
        body: "Copy it, speak it, and save to your journal.",
      },
    ],
    []
  );

  const listRef = useRef<FlatList<Slide>>(null);
  const [active, setActive] = useState(0);

  const progressX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      progressX.value = e.contentOffset.x;
    },
  });

  // Auto-scroll (mini onboarding)
  useEffect(() => {
    const id = setInterval(() => {
      const next = (active + 1) % slides.length;
      listRef.current?.scrollToIndex({ index: next, animated: true });
      setActive(next);
    }, 4200);

    return () => clearInterval(id);
  }, [active, slides.length]);

  const onMomentumEnd = (e: any) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
    setActive(Math.max(0, Math.min(slides.length - 1, idx)));
  };

  const heroScale = useAnimatedStyle(() => {
    const page = progressX.value / SCREEN_W;
    const s = interpolate(page, [0, 1], [1, 0.985]);
    return { transform: [{ scale: s }] };
  });

  return (
    <View style={styles.container}>
      <Video
        source={require("../assets/videos/hero.mp4")}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
      />

      <LinearGradient
        colors={[
          "rgba(11,15,23,0.15)",
          "rgba(11,15,23,0.55)",
          "rgba(11,15,23,0.92)",
          "rgba(11,15,23,1)",
        ]}
        locations={[0, 0.42, 0.78, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Top actions */}
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <Pressable
          onPress={() => router.replace("/(tabs)")}
          style={({ pressed }) => [styles.skipBtn, pressed && { opacity: 0.75 }]}
          hitSlop={10}
        >
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      <View style={[styles.content, { paddingBottom: insets.bottom + 18 }]}>
        {/* Hero copy */}
        <Animated.View style={[styles.hero, heroScale]}>
          <Animated.Text entering={FadeInDown.duration(520)} style={styles.kicker}>
            Trusted by 42k+ families
          </Animated.Text>

          <Animated.Text entering={FadeInUp.delay(80).duration(560)} style={styles.h1}>
            Design the words that calm your home
          </Animated.Text>

          <Animated.Text entering={FadeInUp.delay(160).duration(560)} style={styles.sub}>
            Science-backed scripts to help you navigate big feelings and busy days with confidence.
          </Animated.Text>

          <Animated.View entering={ZoomIn.delay(240).duration(420)} style={styles.ctaRow}>
            <Pressable
              onPress={() => router.push("/(tabs)/create")}
              style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.85 }]}
            >
              <Text style={styles.primaryBtnText}>Get my first script</Text>
              <Ionicons name="arrow-forward" size={16} color="white" style={{ marginLeft: 8 }} />
            </Pressable>

            <Pressable
              onPress={() => router.replace("/(tabs)")}
              style={({ pressed }) => [styles.secondaryBtn, pressed && { opacity: 0.85 }]}
            >
              <Text style={styles.secondaryBtnText}>Open the app</Text>
            </Pressable>
          </Animated.View>
        </Animated.View>

        {/* Mini onboarding */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>
            {slides[active]?.kind === "step" ? "How it works" : "Features"}
          </Text>
          <Text style={styles.sectionHint}>Swipe · auto-advances</Text>
        </View>

        <Animated.FlatList
          ref={listRef}
          data={slides}
          keyExtractor={(i) => i.key}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          onMomentumScrollEnd={onMomentumEnd}
          renderItem={({ item }) => (
            <View style={{ width: SCREEN_W, paddingHorizontal: 18 }}>
              <Animated.View entering={FadeInUp.duration(380)}>
                <SlideCard slide={item} />
              </Animated.View>
            </View>
          )}
          getItemLayout={(_, index) => ({ length: SCREEN_W, offset: SCREEN_W * index, index })}
        />

        <View style={styles.dotsRow}>
          {slides.map((_, i) => (
            <Dot key={i} active={i === active} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0F17" },

  topBar: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
    alignItems: "flex-end",
  },
  skipBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  skipText: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: -0.1,
  },

  content: {
    flex: 1,
    paddingTop: 88,
    justifyContent: "flex-end",
  },

  hero: { paddingHorizontal: 18, paddingBottom: 14 },
  kicker: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: -0.1,
    marginBottom: 10,
  },
  h1: {
    color: "white",
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "800",
    letterSpacing: -0.6,
    marginBottom: 10,
  },
  sub: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: -0.15,
    marginBottom: 14,
  },

  ctaRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  primaryBtnText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.2,
    textTransform: "none",
  },
  secondaryBtn: {
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  secondaryBtnText: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: -0.15,
  },

  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    alignItems: "flex-end",
    marginTop: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  sectionHint: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: -0.1,
  },

  slideCard: {
    borderRadius: 18,
    padding: 16,
    overflow: "hidden",
    minHeight: 156,
  },
  slideBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  slideTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBg: { ...StyleSheet.absoluteFillObject },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  pillText: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: -0.1,
  },

  slideTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.25,
    marginBottom: 6,
  },
  slideBody: {
    color: "rgba(255,255,255,0.74)",
    fontSize: 13.5,
    lineHeight: 20,
    letterSpacing: -0.12,
  },

  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
  },
  dot: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.20)",
  },
  dotActive: {
    backgroundColor: "rgba(255,255,255,0.55)",
  },
});
