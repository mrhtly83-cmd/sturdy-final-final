// Phase 3: Script View Component
// Display the AI result in "Prompt Card" style with collapsible Psychology Insight

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ScriptResponse } from '../../src/types';

interface ScriptViewProps {
  script: ScriptResponse;
  onSave: () => void;
  onShare: () => void;
  onReadAloud?: () => void; // Premium feature
  isPremium: boolean;
  onUpgrade?: () => void;
}

export default function ScriptView({
  script,
  onSave,
  onShare,
  onReadAloud,
  isPremium,
  onUpgrade,
}: ScriptViewProps) {
  const [insightExpanded, setInsightExpanded] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Use These Words</Text>
        <Text style={styles.headerSubtitle}>Your script is ready</Text>
      </View>

      {/* Script Body */}
      <View style={styles.scriptCard}>
        <Text style={styles.scriptText}>{script.script}</Text>
      </View>

      {/* Psychology Insight (Collapsible) */}
      {script.psych_insight && (
        <View style={styles.insightContainer}>
          <TouchableOpacity
            style={styles.insightHeader}
            onPress={() => setInsightExpanded(!insightExpanded)}
            activeOpacity={0.7}
          >
            <Text style={styles.insightTitle}>💡 Psychology Insight</Text>
            <Text style={styles.insightToggle}>
              {insightExpanded ? '−' : '+'}
            </Text>
          </TouchableOpacity>
          
          {insightExpanded && (
            <View style={styles.insightBody}>
              <Text style={styles.insightText}>{script.psych_insight}</Text>
              <Text style={styles.insightFooter}>
                Why it works: This approach builds connection before correction
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={onSave}
          activeOpacity={0.7}
        >
          <Text style={styles.actionIcon}>💾</Text>
          <Text style={styles.actionText}>Save to Journal</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={onShare}
          activeOpacity={0.7}
        >
          <Text style={styles.actionIcon}>📤</Text>
          <Text style={styles.actionText}>Share to Co-Parent</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.actionButton,
            !isPremium && styles.actionButtonPremium,
          ]}
          onPress={isPremium ? onReadAloud : onUpgrade}
          activeOpacity={0.7}
        >
          <Text style={styles.actionIcon}>🔊</Text>
          <Text style={styles.actionText}>
            Read Aloud {!isPremium && '(Premium)'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // clinical-base
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A', // clinical-text
    marginBottom: 4,
    letterSpacing: 0.025, // tracking-calm
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#94A3B8', // clinical-accent
    lineHeight: 1.625 * 15,
  },
  scriptCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9', // border-slate-100
    borderRadius: 16, // rounded-2xl
    padding: 24,
    marginBottom: 20,
  },
  scriptText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#0F172A',
    lineHeight: 1.625 * 20, // leading-relaxed-plus
    letterSpacing: 0.025,
  },
  insightContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155', // clinical-action
    letterSpacing: 0.025,
  },
  insightToggle: {
    fontSize: 24,
    fontWeight: '300',
    color: '#94A3B8',
  },
  insightBody: {
    padding: 16,
    paddingTop: 0,
  },
  insightText: {
    fontSize: 15,
    color: '#0F172A',
    lineHeight: 1.625 * 15,
    letterSpacing: 0.025,
    marginBottom: 12,
  },
  insightFooter: {
    fontSize: 13,
    color: '#94A3B8',
    fontStyle: 'italic',
    lineHeight: 1.625 * 13,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 16,
    padding: 16,
  },
  actionButtonPremium: {
    borderColor: '#CA8A04', // clinical-sos
    borderWidth: 1.5,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155', // clinical-action
    letterSpacing: 0.025,
  },
});
