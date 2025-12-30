// app/(tabs)/create2.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { generateScript } from '../../src/services/aiService';
import { saveScript } from '../../src/services/databaseService';

export default function Step3ToneScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [tone, setTone] = useState<string | null>(null);
  const [customTone, setCustomTone] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);

  const tones = ['Warm', 'Clear', 'Neutral', 'Empowering', 'Funny', 'Custom'];
  const isCustom = tone === 'Custom';

  const isValid = tone && (tone !== 'Custom' || customTone.trim().length > 0);

  const handleGenerateScript = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be signed in to generate scripts.');
      router.replace('/(auth)/sign-in');
      return;
    }

    try {
      setLoading(true);

      // Map UI tone to API tone
      const toneMap: { [key: string]: 'gentle' | 'moderate' | 'firm' } = {
        'Warm': 'gentle',
        'Clear': 'moderate',
        'Neutral': 'moderate',
        'Empowering': 'firm',
        'Funny': 'gentle',
        'Custom': 'moderate',
      };

      const apiTone = toneMap[tone || 'Neutral'];

      // For now, use placeholder data. In a full implementation,
      // these would be passed through navigation params or global state
      const script = await generateScript({
        childAge: 7, // Placeholder - would come from Step 1
        struggle: 'Big Emotions', // Placeholder - would come from Step 2
        tone: apiTone,
        context: isCustom ? customTone : undefined,
      });

      setGeneratedScript(script);

      // Save script to database
      const savedScript = await saveScript(user.id, {
        struggle: 'Big Emotions', // Placeholder
        tone: apiTone,
        content: script,
      });

      if (!savedScript) {
        console.warn('Failed to save script to database');
      }
    } catch (error) {
      console.error('Error generating script:', error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to generate script. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (generatedScript) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.step}>Your Script</Text>
        <Text style={styles.title}>Here&apos;s your personalized script</Text>

        <View style={styles.scriptContainer}>
          <Text style={styles.scriptText}>{generatedScript}</Text>
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => {
            setGeneratedScript(null);
            router.push('/(tabs)');
          }}
        >
          <Text style={styles.continueText}>Done</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setGeneratedScript(null)}
        >
          <Text style={styles.secondaryText}>Generate Another</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.step}>Step 3 of 4</Text>
      <Text style={styles.title}>Choose the tone of advice</Text>

      <View style={styles.optionGroup}>
        {tones.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.option,
              tone === item && styles.optionSelected,
            ]}
            onPress={() => setTone(item)}
            disabled={loading}
          >
            <Text style={styles.optionText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {isCustom && (
        <TextInput
          placeholder="Type your preferred tone..."
          style={styles.input}
          value={customTone}
          onChangeText={setCustomTone}
          editable={!loading}
        />
      )}

      <TouchableOpacity
        style={[
          styles.continueButton,
          (!isValid || loading) && styles.buttonDisabled,
        ]}
        disabled={!isValid || loading}
        onPress={handleGenerateScript}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.continueText}>Generate Script</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 80,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  step: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 24,
  },
  optionGroup: {
    flexDirection: 'column',
    gap: 12,
  },
  option: {
    backgroundColor: '#f0f0f0',
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
  },
  optionSelected: {
    backgroundColor: '#4dd0a1',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    marginTop: 16,
    padding: 14,
    backgroundColor: '#eee',
    borderRadius: 12,
    fontSize: 16,
  },
  continueButton: {
    marginTop: 40,
    backgroundColor: '#4dd0a1',
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: 'center',
  },
  continueText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  scriptContainer: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  scriptText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  secondaryButton: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4dd0a1',
  },
  secondaryText: {
    color: '#4dd0a1',
    fontWeight: '600',
    fontSize: 16,
  },
});
