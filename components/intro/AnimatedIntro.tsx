import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function AnimatedIntro() {
  const logoScale = useRef(new Animated.Value(0.86)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineTranslate = useRef(new Animated.Value(12)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const ctaTranslate = useRef(new Animated.Value(20)).current;
  const ctaOpacity = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  const fullText = "Calm words, on demand.";
  const [displayText, setDisplayText] = useState("");

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

    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, i + 1));
      i += 1;
      if (i >= fullText.length) clearInterval(interval);
    }, 45);

    return () => clearInterval(interval);
  }, []);

  const handleContinue = () => {
    try {
      router.push("/quiz/child");
    } catch (e) {
      // fallback: no router available in tests
      // console.warn(e);
    }
  };

  // simple decorative particles
  const particles = Array.from({ length: 6 }).map((_, i) => {
    const anim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
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
    }, []);

    const left = 12 + i * ((width - 48) / 6);
    const translateY = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -18 - (i % 3) * 6],
    });
    const opacity = anim.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0, 0.9, 0] });

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
          <Text style={styles.tagline}>{displayText}</Text>
          <Text style={styles.subtext}>Support, exactly when you need it.</Text>
        </Animated.View>

        <Animated.View
          style={{
            transform: [
              { translateY: ctaTranslate },
              { scale: pulse },
            ],
            opacity: ctaOpacity,
            marginTop: 28,
          }}
        >
          <Pressable onPress={handleContinue} style={styles.ctaButton}>
            <Text style={styles.ctaText}>Continue →</Text>
          </Pressable>
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
  tagline: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
  },
  subtext: {
    color: "rgba(255,255,255,0.85)",
    marginTop: 6,
    fontSize: 14,
    textAlign: "center",
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
