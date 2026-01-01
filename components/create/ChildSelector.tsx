// Phase 3: Child Selector Component
// Pulls from children table to select which child this script is for

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Child } from '../../src/types';

interface ChildSelectorProps {
  children: Child[];
  selectedChildId: string | null;
  onSelectChild: (childId: string) => void;
  onAddChild: () => void;
}

export default function ChildSelector({
  children,
  selectedChildId,
  onSelectChild,
  onAddChild,
}: ChildSelectorProps) {
  const calculateAge = (birthDate: string | null): number | null => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    // Validate date
    if (isNaN(birth.getTime())) return null;
    
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Child</Text>
      <Text style={styles.subtitle}>Who are we helping today?</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {children.map((child) => {
          const age = calculateAge(child.birth_date);
          const isSelected = selectedChildId === child.id;
          
          return (
            <TouchableOpacity
              key={child.id}
              style={[
                styles.childCard,
                isSelected && styles.childCardSelected,
              ]}
              onPress={() => onSelectChild(child.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.childName, isSelected && styles.textSelected]}>
                {child.name || 'Child'}
              </Text>
              {age !== null && (
                <Text style={[styles.childAge, isSelected && styles.textSelected]}>
                  Age {age}
                </Text>
              )}
              {child.neurotype && child.neurotype !== 'Neurotypical' && (
                <Text style={[styles.childNeurotype, isSelected && styles.textSelected]}>
                  {child.neurotype}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
        
        <TouchableOpacity
          style={styles.addChildCard}
          onPress={onAddChild}
          activeOpacity={0.7}
        >
          <Text style={styles.addChildIcon}>+</Text>
          <Text style={styles.addChildText}>Add Child</Text>
        </TouchableOpacity>
      </ScrollView>
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
  childCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9', // border-slate-100
    borderRadius: 16, // rounded-2xl
    padding: 16,
    marginRight: 12,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  childCardSelected: {
    backgroundColor: '#334155', // clinical-action
    borderColor: '#334155',
  },
  childName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  childAge: {
    fontSize: 13,
    color: '#94A3B8',
  },
  childNeurotype: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  textSelected: {
    color: '#FFFFFF',
  },
  addChildCard: {
    backgroundColor: '#F8FAFC', // clinical-base
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
  },
  addChildIcon: {
    fontSize: 24,
    color: '#94A3B8',
    marginBottom: 4,
  },
  addChildText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
});
