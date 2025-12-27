import { Video } from 'expo-av';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function IntroScreen({ navigation }: any) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, []);

  const Content = (
    <Animated.View style={{ ...styles.content, opacity: fadeAnim }}>
      <Image source={require('../../assets/sturdy_logo.png')} style={styles.logo} />
      <Text style={[styles.title, { fontSize: 13, fontWeight: '700' }]}>Trusted by 42k+ families</Text>

      <Text style={[styles.title, { fontSize: 26, fontWeight: '800', marginTop: 12 }]}>Design the words that calm your home</Text>
      <Text style={styles.subtitle}>Science-backed scripts to help you navigate big feelings and busy days with confidence.</Text>

      {!expanded && (
        <TouchableOpacity onPress={() => setExpanded(true)} style={styles.learnMore}>
          <Text style={styles.learnMoreText}>How it works</Text>
        </TouchableOpacity>
      )}

      {expanded && (
        <View style={{ marginTop: 12, alignItems: 'center' }}>
          <Text style={styles.subtitle}>Connection-first words you can trust.</Text>
          <Text style={styles.subtitle}>Personalized in seconds — Three steps, then you’re ready</Text>

          <Text style={styles.subtitle}>Step 1 — Answer 3 quick questions.</Text>
          <Text style={styles.subtitle}>Step 2 — Get a calm script generated for your moment.</Text>
          <Text style={styles.subtitle}>Step 3 — Use, save, and revisit anytime.</Text>

          <TouchableOpacity onPress={() => setExpanded(false)} style={{ marginTop: 8 }}>
            <Text style={[styles.learnMoreText, { opacity: 0.9 }]}>Show less</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={() => router.push('/quiz/child')}>
        <Text style={styles.buttonText}>Start your free trial</Text>
      </TouchableOpacity>
    </Animated.View>
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
  content: { alignItems: 'center', paddingHorizontal: 20 },
  logo: { width: 120, height: 120, marginBottom: 20, resizeMode: 'contain' },
  title: { fontSize: 28, color: '#fff', fontWeight: '600', textAlign: 'center' },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.85)', marginTop: 8, marginBottom: 32, textAlign: 'center', paddingHorizontal: 24 },
  button: {
    backgroundColor: '#70e000',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 2,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  videoOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  learnMore: { marginTop: 12, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.35)' },
  learnMoreText: { color: 'white', fontSize: 15, fontWeight: '600' },
});
