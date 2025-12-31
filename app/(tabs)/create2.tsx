// app/(tabs)/create2.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { useFormData } from '../../src/contexts/FormDataContext';
import { generateScript } from '../../src/services/aiService';
import { incrementScriptUsage, saveScript } from '../../src/services/databaseService';

export default function Step3ToneScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { formData, resetFormData } = useFormData();
  const [tone, setTone] = useState<string | null>(null);
  const [customTone, setCustomTone] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [neurotype, setNeurotype] = useState<string | null>(null);
  const [momentDetail, setMomentDetail] = useState<string>('');

  const tones = ['Warm', 'Clear', 'Neutral', 'Empowering', 'Funny', 'Custom'];
  const neurotypes = ['Neurotypical', 'Autistic', 'ADHD', 'Sensory Seeking'];
  const momentSuggestions = [
    'They threw the tablet when screen time ended and are pacing the room.',
    'They froze at school drop-off and are clinging to me with watery eyes.',
  ];
  const isCustom = tone === 'Custom';

  const isValid = tone && (tone !== 'Custom' || customTone.trim().length > 0);

  const tonePreview: Record<string, string> = {
    Warm: '“I can see this is really hard right now. I’m here with you.”',
    Clear: '“This is tough. Let’s take one breath, then we’ll clean up together.”',
    Neutral: '“I notice you’re upset. Let’s figure out the next step.”',
    Empowering: '“You’ve handled big feelings before. Want to try your calm trick?”',
    Funny: '“Uh oh, meltdown meteor! Let’s defuse it with our silly breath?”',
    Custom: customTone || 'Your custom tone preview will show here.',
  };

  const handleGenerateScript = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be signed in to generate scripts.');
      router.replace('/(auth)/sign-in');
      return;
    }

    // Validate required form data
    if (!formData.childAge || !formData.struggle) {
      Alert.alert('Error', 'Please complete all previous steps.');
      router.push('/(tabs)/create');
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

      const contextNote = [
        isCustom ? customTone : null,
        neurotype ? `Neurotype: ${neurotype}` : null,
        momentDetail ? `Moment: ${momentDetail}` : null,
      ]
        .filter(Boolean)
        .join(' | ');

      // Generate script with actual form data
      const script = await generateScript({
        childAge: formData.childAge,
        struggle: formData.struggle,
        tone: apiTone,
        context: contextNote || undefined,
      });

      setGeneratedScript(script);

      // Save script to database
      const savedScript = await saveScript(user.id, {
        struggle: formData.struggle,
        tone: apiTone,
        content: script,
      });

      if (!savedScript) {
        console.warn('Failed to save script to database');
      }

      // Increment script usage tracking
      await incrementScriptUsage(user.id);
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

  const handleDone = () => {
    resetFormData();
    setGeneratedScript(null);
    router.push('/(tabs)');
  };

  const handleGenerateAnother = () => {
    setGeneratedScript(null);
    setTone(null);
    setCustomTone('');
    setNeurotype(null);
    setMomentDetail('');
  };

  const handleSuggestMoment = () => {
    const suggestion = momentSuggestions[Math.floor(Math.random() * momentSuggestions.length)];
    setMomentDetail(suggestion);
  };

  const handleHearScript = () => {
    if (!generatedScript) return;
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(generatedScript);
      utterance.rate = 0.95;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } else {
      Alert.alert('Playback unavailable', 'Voice playback is available in the web preview.');
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
          style={styles.audioButton}
          onPress={handleHearScript}
        >
          <Text style={styles.audioText}>🔊 Hear it read aloud</Text>
          <Text style={styles.audioHint}>Helps when you need words without reading.</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleDone}
        >
          <Text style={styles.continueText}>Done</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleGenerateAnother}
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

      {tone && (
        <View style={styles.previewBox}>
          <Text style={styles.previewLabel}>How this tone sounds:</Text>
          <Text style={styles.previewText}>{tonePreview[tone]}</Text>
        </View>
      )}

      <Text style={styles.label}>Neurotype (optional)</Text>
      <View style={styles.optionGroup}>
        {neurotypes.map((nt) => (
          <TouchableOpacity
            key={nt}
            style={[
              styles.pill,
              neurotype === nt && styles.optionSelected,
            ]}
            onPress={() => setNeurotype(nt)}
            disabled={loading}
          >
            <Text style={styles.optionText}>{nt}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Describe the moment</Text>
      <TextInput
        placeholder="He threw the tablet when screen time ended..."
        style={styles.textArea}
        value={momentDetail}
        onChangeText={setMomentDetail}
        multiline
        numberOfLines={4}
        editable={!loading}
      />
      <TouchableOpacity
        style={styles.suggestButton}
        onPress={handleSuggestMoment}
        disabled={loading}
      >
        <Text style={styles.suggestText}>🪄 Suggest a starter</Text>
      </TouchableOpacity>

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
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginTop: 20,
    marginBottom: 8,
  },
  input: {
    marginTop: 16,
    padding: 14,
    backgroundColor: '#eee',
    borderRadius: 12,
    fontSize: 16,
  },
  textArea: {
    marginTop: 8,
    padding: 14,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    fontSize: 15,
    minHeight: 120,
    textAlignVertical: 'top',
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
  previewBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#f0f9f6',
    borderWidth: 1,
    borderColor: '#d7f2ea',
  },
  previewLabel: {
    fontSize: 13,
    color: '#2d7b67',
    fontWeight: '700',
    marginBottom: 6,
  },
  previewText: {
    fontSize: 15,
    color: '#1c4f43',
    lineHeight: 22,
  },
  pill: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  textMuted: {
    color: '#777',
  },
  suggestButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#e8f5e9',
    borderColor: '#c8e6c9',
    borderWidth: 1,
  },
  suggestText: {
    color: '#2e7d32',
    fontWeight: '600',
  },
  audioButton: {
    marginTop: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#4dd0a1',
    backgroundColor: '#f6fffb',
  },
  audioText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#248f72',
  },
  audioHint: {
    marginTop: 4,
    fontSize: 13,
    color: '#2d7b67',
  },
});
