import React from 'react';
import { Video } from 'expo-av';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function IntroScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Video
        source={require('../../../assets/videos/hero.mp4')}
        resizeMode="cover"
        shouldPlay
        isLooping
        isMuted
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.overlay}>
        <Text style={styles.headline}>Trusted by 42k+ families</Text>

        <Text style={[styles.headline, { fontSize: 26, marginTop: 12 }]}>Design the words that calm your home</Text>
        <Text style={styles.feature}>Science-backed scripts to help you navigate big feelings and busy days with confidence.</Text>

        <View style={[styles.featureList, { marginTop: 18 }]}> 
          <Text style={styles.feature}>Connection-first words you can trust.</Text>
          <Text style={styles.feature}>Personalized in seconds — Three steps, then you’re ready</Text>
        </View>

        <View style={{ marginTop: 12 }}>
          <Text style={styles.feature}>Step 1 — Answer 3 questions: Kids, tone, what’s happening right now.</Text>
          <Text style={styles.feature}>Step 2 — Get a calm script: AI generates language designed to reduce conflict.</Text>
          <Text style={styles.feature}>Step 3 — Use & save: Copy it, speak it, and save to your journal.</Text>
        </View>

        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('CreateFlow')}
        >
          <Text style={styles.ctaText}>Start your free trial</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    padding: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  headline: {
    fontSize: 22,
    color: 'white',
    fontWeight: '600',
    marginBottom: 16,
  },
  featureList: {
    marginBottom: 24,
  },
  feature: {
    color: 'white',
    fontSize: 16,
    marginBottom: 6,
  },
  ctaButton: {
    backgroundColor: '#FF906E',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  ctaText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  skipButton: {
    alignSelf: 'center',
    marginTop: 16,
  },
  skipText: {
    color: 'white',
    fontSize: 15,
  },
});
            <TouchableOpacity
