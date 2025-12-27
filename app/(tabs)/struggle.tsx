// app/(tabs)/struggle.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function StruggleScreen() {
  const router = useRouter();

  const [selected, setSelected] = useState<string | null>(null);

  const struggles = [
    'Big Emotions',
    'Aggression',
    'Resistance / Defiance',
    'Siblings',
    'Screen Time',
    'School & Anxiety',
  ];

  const isValid = selected !== null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.step}>Step 2 of 4</Text>
      <Text style={styles.title}>Pick a struggle</Text>

      <View style={styles.optionGroup}>
        {struggles.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.option,
              selected === item && styles.optionSelected,
            ]}
            onPress={() => setSelected(item)}
          >
            <Text style={styles.optionText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.continueButton,
          !isValid && styles.buttonDisabled,
        ]}
        disabled={!isValid}
        onPress={() => {
          router.push({ pathname: '/(tabs)/create' });
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
