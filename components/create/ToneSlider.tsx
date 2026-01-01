// Phase 3: Tone Slider Component
// Custom range input from "Gentle" to "Firm" (no external dependencies)

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ToneLevel } from '../../src/types';

interface ToneSliderProps {
  value: ToneLevel;
  onChange: (tone: ToneLevel) => void;
}

const TONE_OPTIONS: Array<{ value: ToneLevel; label: string }> = [
  { value: 'gentle', label: 'Gentle' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'firm', label: 'Firm' },
];

export default function ToneSlider({ value, onChange }: ToneSliderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Tone</Text>
        <Text style={styles.currentValue}>
          {TONE_OPTIONS.find(t => t.value === value)?.label || 'Moderate'}
        </Text>
      </View>
      <Text style={styles.subtitle}>
        How firm do you need to be in this moment?
      </Text>

      <View style={styles.segmentedControl}>
        {TONE_OPTIONS.map((option) => {
          const isSelected = value === option.value;
          
          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.segment,
                isSelected && styles.segmentSelected,
              ]}
              onPress={() => onChange(option.value)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.segmentText,
                isSelected && styles.segmentTextSelected,
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.descriptionContainer}>
        {value === 'gentle' && (
          <Text style={styles.description}>
            💙 Soft, warm language for connection-first moments
          </Text>
        )}
        {value === 'moderate' && (
          <Text style={styles.description}>
            🤝 Balanced approach with clear boundaries
          </Text>
        )}
        {value === 'firm' && (
          <Text style={styles.description}>
            🛡️ Direct, confident language for safety boundaries
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A', // clinical-text
    letterSpacing: 0.025, // tracking-calm
  },
  currentValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155', // clinical-action
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8', // clinical-accent
    marginBottom: 16,
    lineHeight: 1.625 * 14, // leading-relaxed-plus
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentSelected: {
    backgroundColor: '#334155', // clinical-action
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
    letterSpacing: 0.025,
  },
  segmentTextSelected: {
    color: '#FFFFFF',
  },
  descriptionContainer: {
    marginTop: 12,
    backgroundColor: '#F8FAFC', // clinical-base
    padding: 12,
    borderRadius: 12,
  },
  description: {
    fontSize: 13,
    color: '#0F172A',
    lineHeight: 1.625 * 13,
    letterSpacing: 0.025,
  },
});
