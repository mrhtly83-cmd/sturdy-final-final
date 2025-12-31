
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
import { useFormData } from '../../src/contexts/FormDataContext';

export default function CreateStep1() {
  const router = useRouter();
  const { updateFormData } = useFormData();

  const [gender, setGender] = useState<string | null>(null);
  const [age, setAge] = useState<string | null>(null);

  const genderOptions = [
    { label: 'Boy', icon: '👦' },
    { label: 'Girl', icon: '👧' },
    { label: 'Non-binary', icon: '🧒' },
  ];
  const ageOptions = [
    { label: 'Toddler (1-3)', icon: '🍼' },
    { label: 'School Age (5-10)', icon: '📚' },
    { label: 'Tween (11-13)', icon: '🎧' },
    { label: 'Teen (14-18)', icon: '🎒' },
  ];

  const isValid = gender && age;

  const handleContinue = () => {
    if (!age) return;

    // Extract numeric age from selection
    const ageMap: { [key: string]: number } = {
      'Toddler (1-3)': 2,
      'School Age (5-10)': 7,
      'Tween (11-13)': 12,
      'Teen (14-18)': 16,
    };

    updateFormData({
      childAge: ageMap[age],
      childGender: gender || undefined,
    });

    router.push('/(tabs)/struggle');
  };

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
            key={g.label}
            style={[
              styles.option,
              gender === g.label && styles.optionSelected,
            ]}
            onPress={() => setGender(g.label)}
          >
            <Text style={styles.optionText}>
              <Text style={styles.icon}>{g.icon} </Text>
              {g.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Age Picker */}
      <Text style={styles.label}>About how old are they?</Text>
      <View style={styles.optionGroup}>
        {ageOptions.map((a) => (
          <TouchableOpacity
            key={a.label}
            style={[
              styles.option,
              age === a.label && styles.optionSelected,
            ]}
            onPress={() => setAge(a.label)}
          >
            <Text style={styles.optionText}>
              <Text style={styles.icon}>{a.icon} </Text>
              {a.label}
            </Text>
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
        onPress={handleContinue}
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
  icon: {
    fontSize: 16,
  },
});
