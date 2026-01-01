// Phase 3: Tone Slider Component
// Custom range input from "Gentle" to "Firm"

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { ToneLevel } from '../../src/types';

interface ToneSliderProps {
  value: ToneLevel;
  onChange: (tone: ToneLevel) => void;
}

const TONE_VALUES: ToneLevel[] = ['gentle', 'moderate', 'firm'];
const TONE_LABELS: Record<ToneLevel, string> = {
  gentle: 'Gentle',
  moderate: 'Moderate',
  firm: 'Firm',
};

export default function ToneSlider({ value, onChange }: ToneSliderProps) {
  const currentIndex = TONE_VALUES.indexOf(value);

  const handleValueChange = (newValue: number) => {
    const index = Math.round(newValue);
    onChange(TONE_VALUES[index]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Tone</Text>
        <Text style={styles.currentValue}>{TONE_LABELS[value]}</Text>
      </View>
      <Text style={styles.subtitle}>
        How firm do you need to be in this moment?
      </Text>

      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={2}
          step={1}
          value={currentIndex}
          onValueChange={handleValueChange}
          minimumTrackTintColor="#334155" // clinical-action
          maximumTrackTintColor="#E2E8F0"
          thumbTintColor="#334155" // clinical-action
        />
        
        <View style={styles.labelsContainer}>
          <Text style={[
            styles.sliderLabel,
            value === 'gentle' && styles.sliderLabelActive,
          ]}>
            Gentle
          </Text>
          <Text style={[
            styles.sliderLabel,
            value === 'moderate' && styles.sliderLabelActive,
          ]}>
            Moderate
          </Text>
          <Text style={[
            styles.sliderLabel,
            value === 'firm' && styles.sliderLabelActive,
          ]}>
            Firm
          </Text>
        </View>
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
    textTransform: 'capitalize',
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8', // clinical-accent
    marginBottom: 16,
    lineHeight: 1.625 * 14, // leading-relaxed-plus
  },
  sliderContainer: {
    paddingHorizontal: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: -8,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  sliderLabelActive: {
    color: '#334155',
    fontWeight: '600',
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
