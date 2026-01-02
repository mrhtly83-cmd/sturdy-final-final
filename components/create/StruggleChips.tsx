// Phase 3: Struggle Chips Component
// Pre-set struggle categories for quick selection

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface StruggleChipsProps {
  selectedStruggle: string | null;
  onSelectStruggle: (struggle: string) => void;
  customStruggle?: string;
}

const STRUGGLE_OPTIONS = [
  { label: 'Aggression', icon: '😠' },
  { label: 'Screen Time', icon: '📱' },
  { label: 'Bedtime', icon: '🌙' },
  { label: 'Homework', icon: '📚' },
  { label: 'Sibling Fight', icon: '👫' },
  { label: 'Meltdown', icon: '😭' },
  { label: 'Disrespect', icon: '🗣️' },
  { label: 'Transitions', icon: '🚪' },
  { label: 'Morning Routine', icon: '☀️' },
  { label: 'Lying', icon: '🤥' },
  { label: 'Chores', icon: '🧹' },
  { label: 'Eating', icon: '🍽️' },
];

export default function StruggleChips({
  selectedStruggle,
  onSelectStruggle,
  customStruggle,
}: StruggleChipsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Choose Struggle</Text>
      <Text style={styles.subtitle}>What&apos;s happening right now?</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {STRUGGLE_OPTIONS.map((struggle) => {
          const isSelected = selectedStruggle === struggle.label;
          
          return (
            <TouchableOpacity
              key={struggle.label}
              style={[
                styles.chip,
                isSelected && styles.chipSelected,
              ]}
              onPress={() => onSelectStruggle(struggle.label)}
              activeOpacity={0.7}
            >
              <Text style={styles.chipIcon}>{struggle.icon}</Text>
              <Text style={[
                styles.chipText,
                isSelected && styles.chipTextSelected,
              ]}>
                {struggle.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      
      {customStruggle && !STRUGGLE_OPTIONS.find(s => s.label === selectedStruggle) && (
        <View style={styles.customStruggleContainer}>
          <Text style={styles.customStruggleLabel}>Custom: </Text>
          <Text style={styles.customStruggleText}>{customStruggle}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A', // clinical-text
    marginBottom: 4,
    letterSpacing: 0.025, // tracking-calm
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8', // clinical-accent
    marginBottom: 12,
    lineHeight: 1.625 * 14, // leading-relaxed-plus
  },
  scrollContent: {
    paddingRight: 16,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9', // border-slate-100
    borderRadius: 24, // Fully rounded chips
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: '#334155', // clinical-action
    borderColor: '#334155',
  },
  chipIcon: {
    fontSize: 16,
    marginRight: 6,
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
  customStruggleContainer: {
    flexDirection: 'row',
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  customStruggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  customStruggleText: {
    fontSize: 14,
    color: '#0F172A',
    flex: 1,
  },
});
