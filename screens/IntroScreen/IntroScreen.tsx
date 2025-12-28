import { Video } from 'expo-av';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function IntroScreen({ navigation }: any) {
  const [expanded, setExpanded] = useState(false);
  const logoY = useRef(new Animated.Value(-18)).current;
  const headingOpacity = useRef(new Animated.Value(0)).current;
  const cardsOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((value) => setReduceMotion(!!value));

    if (Platform.OS === 'web') {
      try {
        const mq = (window as any).matchMedia && (window as any).matchMedia('(prefers-reduced-motion: reduce)');
        if (mq && mq.matches) setReduceMotion(true);
      } catch {}
    }

    if (reduceMotion) {
      logoY.setValue(0);
      headingOpacity.setValue(1);
      cardsOpacity.setValue(1);
      buttonScale.setValue(1);
      return;
    }

    Animated.sequence([
      Animated.timing(logoY, { toValue: 0, duration: 600, useNativeDriver: true }),
      Animated.timing(headingOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(cardsOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
    ]).start();
  }, [logoY, headingOpacity, cardsOpacity, buttonScale, reduceMotion]);

  const features = [
    { key: 'calm', title: 'Calm words, on demand', subtitle: 'Ready when life happens.' },
    { key: 'science', title: 'Science-backed', subtitle: 'Connection-first words you can trust.' },
    { key: 'personal', title: 'Personalized in seconds', subtitle: 'Tone + context tuned to your family.' },
  ];

  const Content = (
    <View style={styles.contentWrapper} pointerEvents="box-none">
      <Animated.View style={[styles.logoWrap, { transform: [{ translateY: logoY }] }] }>
        <Image source={require('../../assets/sturdy_logo.png')} style={styles.logo} />
      </Animated.View>

      <View style={styles.centerContent}>
        <Animated.Text style={[styles.title, { opacity: headingOpacity }]}>Calm words, on demand.</Animated.Text>
        <Animated.Text style={[styles.subtitle, { opacity: headingOpacity, marginTop: 12 }]}>Science-backed scripts that help you stay connected and confident when parenting gets tough.</Animated.Text>

        <Animated.View style={[styles.features, { opacity: cardsOpacity }]}>
          {features.map((f) => (
            <BlurView key={f.key} intensity={40} tint="dark" style={styles.card}>
              <Text style={styles.cardTitle}>{f.title}</Text>
              <Text style={styles.cardSubtitle}>{f.subtitle}</Text>
            </BlurView>
          ))}
        </Animated.View>
      </View>

      <View style={styles.bottomArea}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.buttonWrap}
          onPress={() => router.push('/quiz/child')}
        >
          <LinearGradient colors={["#40D98A", "#2ABF9E"]} style={styles.buttonGradient}>
            <Animated.Text style={[styles.buttonText, { transform: [{ scale: buttonScale }] }]}>Continue ➜</Animated.Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Video
        source={require('../../assets/videos/hero.mp4')}
        resizeMode={'cover' as any}
        shouldPlay
        isLooping
        isMuted
        style={styles.background}
      />

      <View style={styles.videoOverlay} pointerEvents="box-none">
        {Content}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  background: { position: 'absolute', width: '100%', height: '100%' },
  backgroundImage: { position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  contentWrapper: { flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 28 },
  logoWrap: { alignItems: 'center', marginTop: 10 },
  logo: { width: 92, height: 92, resizeMode: 'contain' },
  centerContent: { alignItems: 'center', paddingHorizontal: 20 },
  title: { fontSize: 30, color: '#fff', fontWeight: '800', textAlign: 'center', textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 6 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.88)', marginTop: 8, lineHeight: 22, textAlign: 'center', paddingHorizontal: 24 },
  button: {
    backgroundColor: '#70e000',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 2,
  },
  buttonWrap: { width: '80%', alignItems: 'center' },
  buttonGradient: { width: '100%', paddingVertical: 14, borderRadius: 999, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '800', fontSize: 17 },
  videoOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  learnMore: { marginTop: 12, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.35)' },
  learnMoreText: { color: 'white', fontSize: 15, fontWeight: '600' },
  features: { marginTop: 18, width: '100%', alignItems: 'center' },
  card: { width: '86%', padding: 12, borderRadius: 14, marginVertical: 8, backgroundColor: 'rgba(255,255,255,0.06)' },
  cardTitle: { color: 'white', fontSize: 16, fontWeight: '700' },
  cardSubtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 4 },
  bottomArea: { width: '100%', alignItems: 'center', marginBottom: 8 },
});
