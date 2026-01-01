// Phase 4: Premium Modal Component
// Subscription gate with "Unlock Unlimited Peace of Mind" messaging

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { SubscriptionTier } from '../../src/types';

interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectTier: (tierId: 'core' | 'complete' | 'lifetime') => void;
}

const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'core',
    name: 'Core',
    price: 4.99,
    interval: 'week',
    features: [
      '10 scripts per week',
      'Journal (view-only after cap)',
      'Basic struggle categories',
      'Age-appropriate scripts',
    ],
    scriptLimit: 10,
  },
  {
    id: 'complete',
    name: 'Complete',
    price: 9.99,
    interval: 'month',
    features: [
      '25 scripts per month',
      'Full journal access',
      'Audio playback',
      'Co-parent sync',
      'Priority support',
    ],
    scriptLimit: 25,
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: 49.99,
    interval: 'lifetime',
    features: [
      'Unlimited scripts',
      'All features forever',
      'Audio playback',
      'Co-parent sync',
      'Unlimited child profiles',
      'Priority support',
      'Early access to new features',
    ],
    scriptLimit: null,
  },
];

export default function PremiumModal({
  visible,
  onClose,
  onSelectTier,
}: PremiumModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Unlock Unlimited</Text>
              <Text style={styles.title}>Peace of Mind</Text>
              <Text style={styles.subtitle}>
                Never run out of calm, confident words when you need them most
              </Text>
            </View>

            {/* Benefits */}
            <View style={styles.benefitsContainer}>
              <BenefitItem 
                icon="🧘‍♀️" 
                text="Stay regulated in any moment" 
              />
              <BenefitItem 
                icon="📚" 
                text="Build your personal parenting library" 
              />
              <BenefitItem 
                icon="👨‍👩‍👧‍👦" 
                text="Support all your children, unlimited" 
              />
              <BenefitItem 
                icon="🔊" 
                text="Hear scripts read aloud for practice" 
              />
            </View>

            {/* Tiers */}
            <View style={styles.tiersContainer}>
              {SUBSCRIPTION_TIERS.map((tier) => {
                const isPopular = tier.id === 'complete';
                const isBestValue = tier.id === 'lifetime';

                return (
                  <TouchableOpacity
                    key={tier.id}
                    style={[
                      styles.tierCard,
                      (isPopular || isBestValue) && styles.tierCardHighlight,
                    ]}
                    onPress={() => onSelectTier(tier.id as 'core' | 'complete' | 'lifetime')}
                    activeOpacity={0.8}
                  >
                    {isPopular && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>Most Popular</Text>
                      </View>
                    )}
                    {isBestValue && (
                      <View style={[styles.badge, styles.badgeGold]}>
                        <Text style={styles.badgeText}>Best Value</Text>
                      </View>
                    )}

                    <Text style={styles.tierName}>{tier.name}</Text>
                    <View style={styles.priceContainer}>
                      <Text style={styles.price}>${tier.price}</Text>
                      <Text style={styles.interval}>
                        /{tier.interval === 'lifetime' ? 'once' : tier.interval}
                      </Text>
                    </View>

                    <View style={styles.featuresContainer}>
                      {tier.features.map((feature, index) => (
                        <View key={index} style={styles.featureRow}>
                          <Text style={styles.featureCheck}>✓</Text>
                          <Text style={styles.featureText}>{feature}</Text>
                        </View>
                      ))}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Footer */}
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.closeButtonText}>Maybe Later</Text>
            </TouchableOpacity>

            <Text style={styles.footerNote}>
              Cancel anytime. Your peace of mind is our priority.
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function BenefitItem({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.benefitRow}>
      <Text style={styles.benefitIcon}>{icon}</Text>
      <Text style={styles.benefitText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)', // clinical-text with opacity
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#F8FAFC', // clinical-base
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0F172A', // clinical-text
    letterSpacing: 0.025,
    lineHeight: 1.2 * 32,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8', // clinical-accent
    marginTop: 8,
    lineHeight: 1.625 * 16,
    letterSpacing: 0.025,
  },
  benefitsContainer: {
    marginBottom: 24,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  benefitText: {
    fontSize: 15,
    color: '#0F172A',
    lineHeight: 1.625 * 15,
    letterSpacing: 0.025,
  },
  tiersContainer: {
    gap: 16,
    marginBottom: 24,
  },
  tierCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 16,
    padding: 20,
    position: 'relative',
  },
  tierCardHighlight: {
    borderColor: '#334155', // clinical-action
    borderWidth: 2,
  },
  badge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#334155', // clinical-action
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeGold: {
    backgroundColor: '#CA8A04', // clinical-sos
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.025,
    textTransform: 'uppercase',
  },
  tierName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    letterSpacing: 0.025,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  price: {
    fontSize: 36,
    fontWeight: '700',
    color: '#0F172A',
  },
  interval: {
    fontSize: 16,
    color: '#94A3B8',
    marginLeft: 4,
  },
  featuresContainer: {
    gap: 10,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureCheck: {
    fontSize: 16,
    color: '#334155', // clinical-action
    marginRight: 8,
    fontWeight: '700',
  },
  featureText: {
    fontSize: 14,
    color: '#0F172A',
    flex: 1,
    lineHeight: 1.625 * 14,
    letterSpacing: 0.025,
  },
  closeButton: {
    alignSelf: 'center',
    padding: 12,
    marginBottom: 12,
  },
  closeButtonText: {
    fontSize: 15,
    color: '#94A3B8',
    fontWeight: '500',
    letterSpacing: 0.025,
  },
  footerNote: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 1.625 * 12,
    letterSpacing: 0.025,
  },
});
