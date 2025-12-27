import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, ImageBackground } from 'react-native';
let LottieView;
try {
  LottieView = require('lottie-react-native');
} catch (e) {
  LottieView = null;
}

export default function IntroScreen({ navigation }) {
  const [fadeAnim] = useState(new Animated.Value(0));

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
      <Text style={styles.title}>Calm words, on demand.</Text>
      <Text style={styles.subtitle}>Support, exactly when you need it.</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Onboarding')}>
        <Text style={styles.buttonText}>Continue →</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {LottieView ? (
        <LottieView
          source={require('../../assets/sunset.json')}
          autoPlay
          loop
          style={styles.background}
        />
      ) : (
        <ImageBackground source={require('../../assets/sunset.png')} style={styles.backgroundImage}>
          {Content}
        </ImageBackground>
      )}

      {LottieView && Content}
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
});
