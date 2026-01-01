// Phase 3: Crisis Toggle Component
// Gold button that skips all forms and generates "Help Me Now" script

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CrisisToggleProps {
  onCrisisPress: () => void;
  isLoading?: boolean;
}

export default function CrisisToggle({ onCrisisPress, isLoading }: CrisisToggleProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.crisisButton, isLoading && styles.crisisButtonDisabled]}
        onPress={onCrisisPress}
        activeOpacity={0.8}
        disabled={isLoading}
      >
        <View style={styles.crisisContent}>
          <Text style={styles.crisisIcon}>🆘</Text>
          <View style={styles.crisisTextContainer}>
            <Text style={styles.crisisTitle}>
              {isLoading ? 'Generating...' : 'Help Me Now'}
            </Text>
            <Text style={styles.crisisSubtitle}>
              Quick script for this moment
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      
      <Text style={styles.crisisNote}>
        Skip the form — get immediate support based on your last active child
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
  },
  crisisButton: {
    backgroundColor: '#CA8A04', // clinical-sos (muted gold)
    borderRadius: 16, // rounded-2xl
    padding: 20,
    shadowColor: '#CA8A04',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  crisisButtonDisabled: {
    opacity: 0.6,
  },
  crisisContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  crisisIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  crisisTextContainer: {
    flex: 1,
  },
  crisisTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 0.025, // tracking-calm
  },
  crisisSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 1.625 * 14, // leading-relaxed-plus
  },
  crisisNote: {
    fontSize: 12,
    color: '#94A3B8', // clinical-accent
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 1.625 * 12,
    letterSpacing: 0.025,
  },
});
