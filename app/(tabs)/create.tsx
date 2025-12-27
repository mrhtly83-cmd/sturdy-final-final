
// app/(tabs)/create.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function CreateStep1() {
  const router = useRouter();

  const [gender, setGender] = useState<string | null>(null);
  const [age, setAge] = useState<string | null>(null);

  const genderOptions = ['Boy', 'Girl', 'Non-binary'];
  const ageOptions = ['Toddler (1-3)', 'School Age (5-10)', 'Tween (11-13)', 'Teen (14-18)'];

  const isValid = gender && age;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.step}>Step 1 of 4</Text>
      <Text style={styles.title}>Tell us about your child</Text>
      <Text style={styles.subtitle}>This helps us match the words to their age and needs.</Text>

      {/* Gender Picker */}
      <Text style={styles.label}>How does your child identify?</Text>
      <View style={styles.optionGroup}>
        {genderOptions.map((g) => (
          <TouchableOpacity
            key={g}
            style={[
              styles.option,
              gender === g && styles.optionSelected,
            ]}
            onPress={() => setGender(g)}
          >
            <Text style={styles.optionText}>{g}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Age Picker */}
      <Text style={styles.label}>About how old are they?</Text>
      <View style={styles.optionGroup}>
        {ageOptions.map((a) => (
          <TouchableOpacity
            key={a}
            style={[
              styles.option,
              age === a && styles.optionSelected,
            ]}
            onPress={() => setAge(a)}
          >
            <Text style={styles.optionText}>{a}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Continue */}
      <TouchableOpacity
        style={[
          styles.continueButton,
          !isValid && styles.buttonDisabled,
        ]}
        disabled={!isValid}
        onPress={() => {
          router.push('/(tabs)/struggle');
        }}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
      <Text style={styles.helper}>You can change this later.</Text>
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
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginTop: 16,
    marginBottom: 8,
  },
  optionGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  option: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 44,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  optionSelected: {
    backgroundColor: '#4dd0a1',
  },
  optionText: {
    color: '#333',
    fontSize: 14,
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
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 18,
  },
  helper: {
    marginTop: 12,
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
  },
});
