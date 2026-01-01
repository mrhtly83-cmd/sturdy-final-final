// app/onboarding/child-setup.tsx
// Step 3 from Phase 6: Build Profile Setup (collect child data)

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Alert,
} from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { createChild } from '../../src/services/databaseService';

const NEUROTYPES = [
  'Neurotypical',
  'ADHD',
  'Autism',
  'PDA',
  'Dyslexia',
  'Anxiety',
  'Other',
];

export default function ChildSetupScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [neurotype, setNeurotype] = useState('Neurotypical');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = name.trim().length > 0 && birthDate.length >= 10;

  const handleContinue = async () => {
    if (!user || !isValid) return;

    setIsSubmitting(true);
    try {
      await createChild(user.id, {
        name: name.trim(),
        birth_date: birthDate,
        neurotype,
      });

      Alert.alert(
        'Success!',
        'Child profile created',
        [
          {
            text: 'Add Another Child',
            onPress: () => {
              setName('');
              setBirthDate('');
              setNeurotype('Neurotypical');
              setIsSubmitting(false);
            },
          },
          {
            text: 'Continue',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create child profile');
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.step}>Step 1 of 1</Text>
        <Text style={styles.title}>Tell us about your child</Text>
        <Text style={styles.subtitle}>
          This helps us provide age-appropriate, personalized support
        </Text>
      </View>

      {/* Name Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Child's Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g., Emma"
          placeholderTextColor="#94A3B8"
          autoCapitalize="words"
        />
      </View>

      {/* Birth Date Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Birth Date</Text>
        <Text style={styles.helper}>Used to provide age-appropriate scripts</Text>
        <TextInput
          style={styles.input}
          value={birthDate}
          onChangeText={setBirthDate}
          placeholder="YYYY-MM-DD (e.g., 2015-03-20)"
          placeholderTextColor="#94A3B8"
          keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'}
        />
      </View>

      {/* Neurotype Selector */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Neurotype (Optional)</Text>
        <Text style={styles.helper}>
          Helps us tailor our approach to your child's needs
        </Text>
        <View style={styles.chipContainer}>
          {NEUROTYPES.map((type) => {
            const isSelected = neurotype === type;
            return (
              <TouchableOpacity
                key={type}
                style={[
                  styles.chip,
                  isSelected && styles.chipSelected,
                ]}
                onPress={() => setNeurotype(type)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.chipText,
                  isSelected && styles.chipTextSelected,
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !isValid && styles.buttonDisabled,
          ]}
          disabled={!isValid || isSubmitting}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>
            {isSubmitting ? 'Creating...' : 'Continue'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
        >
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.note}>
        💡 You can add more children or update this information anytime in your profile
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // clinical-base
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
  },
  step: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 8,
    fontWeight: '500',
    letterSpacing: 0.025,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A', // clinical-text
    marginBottom: 8,
    letterSpacing: 0.025,
  },
  subtitle: {
    fontSize: 15,
    color: '#94A3B8', // clinical-accent
    lineHeight: 1.625 * 15,
    letterSpacing: 0.025,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 6,
    letterSpacing: 0.025,
  },
  helper: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 8,
    lineHeight: 1.625 * 13,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9', // border-slate-100
    borderRadius: 16, // rounded-2xl
    padding: 16,
    fontSize: 16,
    color: '#0F172A',
    lineHeight: 1.625 * 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: '#334155', // clinical-action
    borderColor: '#334155',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
    letterSpacing: 0.025,
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  buttonGroup: {
    marginTop: 32,
    gap: 12,
  },
  continueButton: {
    backgroundColor: '#334155', // clinical-action
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.025,
  },
  skipButton: {
    padding: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#94A3B8',
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.025,
  },
  note: {
    marginTop: 24,
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 1.625 * 13,
    letterSpacing: 0.025,
  },
});
