import { BlurView } from "expo-blur";
import { Video, ResizeMode } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const featureItems = [
  {
    title: "Personalized Scripts",
    body: "Child age, neurotype, and context shape every calming message.",
    icon: "person-outline",
    gradient: ["#4DD0A5", "#45D7C2"] as const,
  },
  {
    title: "Tone Slider",
    body: "Shift from gentle to firm so the message lands in your voice.",
    icon: "swap-horizontal-outline",
    gradient: ["#7BC6FF", "#7FE6B0"] as const,
  },
  {
    title: "Save + Co-Parent",
    body: "Journal, favorite, or sync scripts with care partners.",
    icon: "heart-outline",
    gradient: ["#AF93FF", "#C3A5FF"] as const,
  },
];

const quickSteps = [
  {
    title: "1. Choose the child",
    caption: "Pick the profile that anchors the script in familiarity.",
  },
  {
    title: "2. Tune tone & neurotype",
    caption: "Match your energy so you feel ready to speak.",
  },
  {
    title: "3. Describe the moment",
    caption: "Capture details, then grab the words and send them out.",
  },
];

export default function AnimatedIntro() {
  const brandAnim = useRef(new Animated.Value(0)).current;
  const headlineAnim = useRef(new Animated.Value(0)).current;
  const ctaAnim = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const videoRef = useRef<Video | null>(null);
  const particleAnims = useRef(
    Array.from({ length: 6 }).map(() => new Animated.Value(0))
  ).current;
  const featureAnims = useRef(
    featureItems.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    Animated.timing(brandAnim, {
      toValue: 1,
      duration: 650,
      delay: 80,
      useNativeDriver: true,
    }).start();

    Animated.timing(headlineAnim, {
      toValue: 1,
      duration: 750,
      delay: 260,
      useNativeDriver: true,
    }).start();

    featureAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 700,
        delay: 620 + index * 160,
        useNativeDriver: true,
      }).start();
    });

    Animated.timing(ctaAnim, {
      toValue: 1,
      duration: 750,
      delay: 1220,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.05,
          duration: 950,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 950,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [brandAnim, ctaAnim, featureAnims, headlineAnim, pulse]);

  useEffect(() => {
    const startVideo = async () => {
      try {
        await videoRef.current?.playAsync();
      } catch {
        // ignore autoplay issues
      }
    };
    startVideo();
  }, []);

  useEffect(() => {
    particleAnims.forEach((anim, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 2400 + i * 220,
            delay: i * 160,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 2400 + i * 220,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, [particleAnims]);

  const handleContinue = () => {
    try {
      router.push("/quiz/child");
    } catch {
      // fallback: no router available in tests
    }
  };

  const fadeUpStyle = (anim: Animated.Value, distance = 16) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [distance, 0],
        }),
      },
    ],
  });

  const particles = particleAnims.map((anim, i) => {
    const left = 28 + i * ((width - 64) / 6);
    const translateY = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -18 - (i % 3) * 8],
    });
    const opacity = anim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.9, 0],
    });

    return (
      <Animated.View
        key={i}
        style={[
          styles.particle,
          { left, transform: [{ translateY }], opacity },
        ]}
      />
    );
  });

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={require("../../assets/videos/hero.mp4")}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        isLooping
        isMuted
        shouldPlay
      />

      <LinearGradient
        colors={[
          "rgba(20, 14, 8, 0.35)",
          "rgba(15, 10, 8, 0.62)",
          "rgba(8, 6, 8, 0.92)",
        ]}
        style={StyleSheet.absoluteFill}
        start={[0, 0]}
        end={[0, 1]}
      />

      <LinearGradient
        colors={["rgba(255, 193, 112, 0.32)", "rgba(24, 16, 10, 0.4)", "rgba(8, 6, 6, 0.82)"]}
        style={StyleSheet.absoluteFill}
        start={[0, 0]}
        end={[0, 1]}
      />

      <View style={styles.sunGlow} pointerEvents="none" />

      <View style={styles.particlesContainer}>{particles}</View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.brandRow, fadeUpStyle(brandAnim, 12)]}>
          <LinearGradient
            colors={["#8E6BFF", "#A084FF", "#C3A5FF"]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.logoPill}
          >
            <Ionicons name="shield-checkmark" size={16} color="#E8EFFF" />
          </LinearGradient>
          <Text style={styles.logo}>STURDY</Text>
        </Animated.View>

        <Animated.View style={[styles.centerBlock, fadeUpStyle(headlineAnim)]}>
          <Text style={styles.title}>Design the words that calm your home.</Text>
          <Text style={styles.subtitle}>
            Just-in-time, science-backed scripts tuned to your child, situation, and tone so you can respond—not react.
          </Text>
        </Animated.View>

        <View style={styles.cards}>
          {featureItems.map((item, index) => {
            const anim = featureAnims[index];
            return (
              <Animated.View
                key={item.title}
                style={[styles.cardWrapper, fadeUpStyle(anim, 18)]}
              >
                <BlurView intensity={45} tint="dark" style={styles.card}>
                  <LinearGradient
                    colors={["rgba(255,255,255,0.06)", "rgba(255,255,255,0.02)"]}
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={styles.cardIconWrap}>
                    <LinearGradient
                      colors={item.gradient}
                      start={[0, 0]}
                      end={[1, 1]}
                      style={styles.iconBg}
                    >
                      <Ionicons name={item.icon as any} size={20} color="#F7FBFF" />
                    </LinearGradient>
                  </View>
                  <View style={styles.cardText}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardBody}>{item.body}</Text>
                  </View>
                </BlurView>
              </Animated.View>
            );
          })}
        </View>

        <View style={styles.stepsContainer}>
          {quickSteps.map((step, index) => (
            <View key={step.title} style={styles.stepCard}>
              <LinearGradient
                colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"]}
                style={StyleSheet.absoluteFill}
              />
              <Text style={styles.stepIndex}>{step.title}</Text>
              <Text style={styles.stepCaption}>{step.caption}</Text>
            </View>
          ))}
        </View>

        <Animated.View style={[styles.footerBlock, fadeUpStyle(ctaAnim, 20)]}>
          <Text style={styles.footerText}>Science-backed support for every tough moment.</Text>

          <Pressable onPress={handleContinue} style={styles.ctaButton}>
            <LinearGradient
              colors={["#4AE0A2", "#45D7C2", "#3FB5E0"]}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.ctaGradient}
            >
              <Animated.View style={{ transform: [{ scale: pulse }] }}>
                <Text style={styles.ctaText}>Design my words</Text>
              </Animated.View>
              <Ionicons name="arrow-forward" size={18} color="#F7FBFF" />
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0A0F",
  },
  content: {
    paddingHorizontal: 22,
    paddingVertical: 72,
    alignItems: "center",
    gap: 22,
    flexGrow: 1,
    justifyContent: "center",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 6,
  },
  logoPill: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    shadowColor: "#1A0C28",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  logo: {
    color: "#F3ECFF",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 1.3,
  },
  centerBlock: {
    alignItems: "center",
    gap: 14,
  },
  title: {
    color: "#F9F3E9",
    fontSize: 34,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 42,
    letterSpacing: 0.35,
  },
  subtitle: {
    color: "rgba(249,243,233,0.88)",
    fontSize: 17,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 14,
  },
  cards: {
    width: "100%",
    gap: 14,
    marginTop: 10,
  },
  stepsContainer: {
    width: "100%",
    gap: 10,
    marginTop: 4,
  },
  cardWrapper: {
    width: "100%",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,200,160,0.26)",
    backgroundColor: "rgba(36, 26, 18, 0.58)",
    shadowColor: "#0B0602",
    shadowOpacity: 0.45,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 12 },
  },
  cardIconWrap: {
    marginRight: 14,
  },
  iconBg: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.28,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
  },
  cardText: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    color: "#F8F1E1",
    fontSize: 18,
    fontWeight: "800",
  },
  cardBody: {
    color: "rgba(248,241,225,0.78)",
    fontSize: 15,
  },
  stepCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    padding: 16,
    backgroundColor: "rgba(14, 11, 17, 0.6)",
    overflow: "hidden",
    shadowColor: "#0B0A0F",
    shadowOpacity: 0.6,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
  },
  stepIndex: {
    color: "#F3ECFF",
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 6,
  },
  stepCaption: {
    color: "rgba(243,236,255,0.72)",
    fontSize: 14,
    lineHeight: 18,
  },
  footerBlock: {
    alignItems: "center",
    gap: 14,
    marginTop: 10,
  },
  footerText: {
    color: "rgba(249,243,233,0.86)",
    fontSize: 15,
    textAlign: "center",
    letterSpacing: 0.2,
  },
  ctaButton: {
    width: "100%",
  },
  ctaGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 12 },
  },
  ctaText: {
    color: "#F7FBFF",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.35,
  },
  particlesContainer: {
    ...StyleSheet.absoluteFillObject,
    top: 80,
    height: 260,
  },
  particle: {
    position: "absolute",
    top: 32,
    width: 7,
    height: 7,
    borderRadius: 7,
    backgroundColor: "rgba(255, 214, 148, 0.9)",
    shadowColor: "#FFD694",
    shadowOpacity: 0.72,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  sunGlow: {
    position: "absolute",
    bottom: "32%",
    left: "18%",
    width: "64%",
    height: 260,
    borderRadius: 200,
    backgroundColor: "rgba(255, 181, 102, 0.18)",
    shadowColor: "rgba(255, 181, 102, 0.28)",
    shadowOpacity: 1,
    shadowRadius: 120,
    shadowOffset: { width: 0, height: 0 },
  },
});
