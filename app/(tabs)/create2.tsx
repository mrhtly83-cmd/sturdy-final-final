// app/(tabs)/create2.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';

export default function Step3ToneScreen() {
  const router = useRouter();
  const [tone, setTone] = useState<string | null>(null);
  const [customTone, setCustomTone] = useState<string>('');

  const tones = ['Warm', 'Clear', 'Neutral', 'Empowering', 'Funny', 'Custom'];
  const isCustom = tone === 'Custom';

  const isValid = tone && (tone !== 'Custom' || customTone.trim().length > 0);

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
        />
      )}

      <TouchableOpacity
        style={[
          styles.continueButton,
          !isValid && styles.buttonDisabled,
        ]}
        disabled={!isValid}
        onPress={() => {
          router.push({ pathname: '/(tabs)/create' }); // Next step!
        }}
      >
        <Text style={styles.continueText}>Continue</Text>
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
});
