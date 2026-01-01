// Phase 4: Usage Bar Component
// Shows usage for free tier (5 scripts limit)

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { UsageInfo } from '../../src/types';

interface UsageBarProps {
  usage: UsageInfo;
  onUpgrade: () => void;
}

export default function UsageBar({ usage, onUpgrade }: UsageBarProps) {
  const { used, limit } = usage;
  
  // Premium users have no limit
  if (limit === null) {
    return null;
  }

  const remaining = limit - used;
  const percentage = (used / limit) * 100;
  const isNearLimit = remaining <= 1;
  const isAtLimit = remaining <= 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Scripts Used</Text>
        <Text style={[
          styles.count,
          isNearLimit && styles.countWarning,
          isAtLimit && styles.countDanger,
        ]}>
          {used} / {limit}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar,
            isNearLimit && styles.progressBarWarning,
            isAtLimit && styles.progressBarDanger,
            { width: `${Math.min(percentage, 100)}%` },
          ]} 
        />
      </View>

      {/* Status Message */}
      <View style={styles.messageContainer}>
        {isAtLimit ? (
          <>
            <Text style={styles.messageText}>
              You've reached your free limit for this week 🎯
            </Text>
            <TouchableOpacity 
              style={styles.upgradeButton}
              onPress={onUpgrade}
              activeOpacity={0.8}
            >
              <Text style={styles.upgradeButtonText}>
                Unlock Unlimited Peace of Mind
              </Text>
            </TouchableOpacity>
          </>
        ) : isNearLimit ? (
          <>
            <Text style={styles.messageText}>
              ⚠️ {remaining} script{remaining !== 1 ? 's' : ''} remaining this week
            </Text>
            <TouchableOpacity 
              style={styles.upgradeLink}
              onPress={onUpgrade}
              activeOpacity={0.7}
            >
              <Text style={styles.upgradeLinkText}>
                Upgrade for unlimited →
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.messageText}>
            {remaining} scripts remaining this week
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9', // border-slate-100
    borderRadius: 16, // rounded-2xl
    padding: 16,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A', // clinical-text
    letterSpacing: 0.025,
  },
  count: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155', // clinical-action
  },
  countWarning: {
    color: '#CA8A04', // clinical-sos
  },
  countDanger: {
    color: '#DC2626', // red
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#334155', // clinical-action
    borderRadius: 4,
  },
  progressBarWarning: {
    backgroundColor: '#CA8A04', // clinical-sos
  },
  progressBarDanger: {
    backgroundColor: '#DC2626', // red
  },
  messageContainer: {
    gap: 8,
  },
  messageText: {
    fontSize: 13,
    color: '#94A3B8', // clinical-accent
    lineHeight: 1.625 * 13,
    letterSpacing: 0.025,
  },
  upgradeButton: {
    backgroundColor: '#CA8A04', // clinical-sos
    borderRadius: 12,
    padding: 14,
    marginTop: 4,
  },
  upgradeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.025,
  },
  upgradeLink: {
    alignSelf: 'flex-start',
  },
  upgradeLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155', // clinical-action
    letterSpacing: 0.025,
  },
});
