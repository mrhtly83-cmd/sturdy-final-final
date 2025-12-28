import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function AnimatedIntro() {
  const logoScale = useRef(new Animated.Value(0.86)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineTranslate = useRef(new Animated.Value(12)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const ctaTranslate = useRef(new Animated.Value(20)).current;
  const ctaOpacity = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  const particleAnims = useRef(
    Array.from({ length: 6 }).map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(250),
      Animated.parallel([
        Animated.timing(taglineTranslate, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(ctaTranslate, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(ctaOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.06,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [
    ctaOpacity,
    ctaTranslate,
    logoOpacity,
    logoScale,
    pulse,
    taglineOpacity,
    taglineTranslate,
  ]);

  const handleContinue = () => {
    try {
      router.push("/quiz/child");
    } catch {
      // fallback: no router available in tests
      // console.warn(e);
    }
  };

  // simple decorative particles
  useEffect(() => {
    particleAnims.forEach((anim, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 2200 + i * 200,
            delay: i * 120,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 2200 + i * 200,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, [particleAnims]);

  const particles = particleAnims.map((anim, i) => {
    const left = 12 + i * ((width - 48) / 6);
    const translateY = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -18 - (i % 3) * 6],
    });
    const opacity = anim.interpolate({
      inputRange: [0, 0.6, 1],
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
      <LinearGradient
        colors={["#FFDD8A", "#FFB88C", "#0B0F17"]}
        style={StyleSheet.absoluteFill}
        start={[0, 0]}
        end={[1, 1]}
      />

      <View style={styles.particlesContainer}>{particles}</View>

      <View style={styles.content} pointerEvents="box-none">
        <Animated.View
          style={{
            transform: [{ scale: logoScale }],
            opacity: logoOpacity,
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <View style={styles.logoPill}>
            <Text style={styles.logo}>STURDY</Text>
          </View>
        </Animated.View>

        <Animated.View
          style={{
            transform: [{ translateY: taglineTranslate }],
            opacity: taglineOpacity,
            alignItems: "center",
          }}
        >
          <Text style={styles.stat}>Trusted by 42k+ families</Text>
          <Text style={styles.title}>Design the words that calm your home</Text>
          <Text style={styles.lead}>Science-backed scripts to help you navigate big feelings and busy days with confidence.</Text>

          <Text style={styles.smallHeading}>Connection-first words you can trust.</Text>

          <View style={styles.stepsContainer}>
            <Text style={styles.stepIntroBold}>Personalized in seconds</Text>
            <Text style={styles.stepIntro}>Three steps, then you’re ready</Text>

            <View style={styles.stepRow}>
              <View style={styles.stepCard}>
                <Text style={styles.stepNumber}>Step 1</Text>
                <Text style={styles.stepTitle}>Answer 3 questions</Text>
                <Text style={styles.stepBody}>Kids, tone, and what’s happening right now.</Text>
              </View>

              <View style={styles.stepCard}>
                <Text style={styles.stepNumber}>Step 2</Text>
                <Text style={styles.stepTitle}>Get a calm script</Text>
                <Text style={styles.stepBody}>AI generates language designed to reduce conflict.</Text>
              </View>
            </View>

            <View style={styles.stepRowSingle}>
              <View style={styles.stepCardWide}>
                <Text style={styles.stepNumber}>Step 3</Text>
                <Text style={styles.stepTitle}>Use & save</Text>
                <Text style={styles.stepBody}>Copy it, speak it, and save to your journal.</Text>
              </View>
            </View>

            <Text style={styles.ctaIntro}>Ready to create calmer moments?</Text>
          </View>
        </Animated.View>

        <Animated.View
          style={{
            transform: [
              { translateY: ctaTranslate },
              { scale: pulse },
            ],
            opacity: ctaOpacity,
            marginTop: 18,
          }}
        >
          <Pressable onPress={handleContinue} style={styles.ctaButton}>
            <Text style={styles.ctaText}>Start your free trial</Text>
          </Pressable>

          <Text style={styles.footerText}>Tone + context tuned to your family. Ready when life happens — Built for big feelings and busy days.</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F17",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 28,
    alignItems: "center",
  },
  logoPill: {
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
  },
  logo: {
    color: "white",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 1,
  },
  stat: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 6,
    letterSpacing: 0.6,
  },
  title: {
    color: "white",
    fontSize: 26,
    fontWeight: "800",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 32,
  },
  lead: {
    color: "rgba(255,255,255,0.9)",
    marginTop: 10,
    fontSize: 15,
    textAlign: "center",
    paddingHorizontal: 8,
  },
  smallHeading: {
    color: "rgba(255,255,255,0.85)",
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },

  stepsContainer: {
    marginTop: 16,
    width: "100%",
    alignItems: "center",
  },
  stepIntroBold: {
    color: "white",
    fontWeight: "800",
    fontSize: 16,
  },
  stepIntro: {
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
    fontSize: 13,
    marginBottom: 12,
  },
  stepRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stepRowSingle: {
    width: "100%",
    marginTop: 10,
  },
  stepCard: {
    backgroundColor: "rgba(255,255,255,0.06)",
    padding: 12,
    borderRadius: 10,
    width: (width - 28 * 2 - 12) / 2,
  },
  stepCardWide: {
    backgroundColor: "rgba(255,255,255,0.06)",
    padding: 12,
    borderRadius: 10,
    width: "100%",
  },
  stepNumber: {
    color: "#FF9E7E",
    fontWeight: "800",
    fontSize: 12,
  },
  stepTitle: {
    color: "white",
    fontWeight: "700",
    marginTop: 6,
    fontSize: 14,
  },
  stepBody: {
    color: "rgba(255,255,255,0.85)",
    marginTop: 6,
    fontSize: 12,
  },
  ctaButton: {
    backgroundColor: "#FF9E7E",
    paddingHorizontal: 26,
    paddingVertical: 14,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },
  ctaText: {
    color: "white",
    fontWeight: "800",
    fontSize: 16,
  },
  ctaIntro: {
    color: "white",
    fontWeight: "700",
    marginTop: 12,
    fontSize: 15,
    textAlign: "center",
  },
  footerText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginTop: 12,
    textAlign: "center",
    paddingHorizontal: 24,
  },
  particlesContainer: {
    ...StyleSheet.absoluteFillObject,
    top: 80,
    height: 220,
  },
  particle: {
    position: "absolute",
    top: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
});
