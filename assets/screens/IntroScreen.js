import { Video } from 'expo-av';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function IntroScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Video
        source={require('./assets/background.mp4')}
        resizeMode="cover"
        shouldPlay
        isLooping
        isMuted
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.overlay}>
        <Text style={styles.headline}>
          They’re crying. You’re tired. Let us help you say the right thing.
        </Text>

        <View style={styles.featureList}>
          <Text style={styles.feature}>💬 Personalized emotional scripts</Text>
          <Text style={styles.feature}>🧠 Psychology-backed calm coaching</Text>
          <Text style={styles.feature}>👥 Sync with your co-parent</Text>
        </View>

        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('CreateFlow')}
        >
          <Text style={styles.ctaText}>Start Creating Scripts</Text>
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
    opacity: 0.7,
  },
});
