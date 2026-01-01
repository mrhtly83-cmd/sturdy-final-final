// app/(tabs)/create-new.tsx
// Integrated Create Tab using Phase 3 & 4 components

import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { getUserChildren, getUserProfile, saveScript } from '../../src/services/databaseService';
import { Child, Profile, ToneLevel, ScriptResponse } from '../../src/types';

// Import Phase 3 components
import ChildSelector from '../../components/create/ChildSelector';
import StruggleChips from '../../components/create/StruggleChips';
import ToneSlider from '../../components/create/ToneSlider';
import CrisisToggle from '../../components/create/CrisisToggle';
import ScriptView from '../../components/create/ScriptView';

// Import Phase 4 components
import UsageBar from '../../components/premium/UsageBar';
import PremiumModal from '../../components/premium/PremiumModal';

const FREE_SCRIPT_LIMIT = 5;

export default function CreateNewScreen() {
  const router = useRouter();
  const { user } = useAuth();

  // State
  const [children, setChildren] = useState<Child[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [selectedStruggle, setSelectedStruggle] = useState<string | null>(null);
  const [customSituation, setCustomSituation] = useState('');
  const [tone, setTone] = useState<ToneLevel>('moderate');

  // Script generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<ScriptResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Premium state
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Load user data
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      setLoading(true);
      const [childrenData, profileData] = await Promise.all([
        getUserChildren(user.id),
        getUserProfile(user.id),
      ]);
      setChildren(childrenData);
      setProfile(profileData);
      setLoading(false);
    };

    loadData();
  }, [user]);

  // Calculate usage for free tier
  const scriptsUsed = 0; // TODO: Implement actual usage tracking
  const usage = {
    used: scriptsUsed,
    limit: profile?.is_premium ? null : FREE_SCRIPT_LIMIT,
  };

  // Check if user can generate
  const canGenerate = profile?.is_premium || scriptsUsed < FREE_SCRIPT_LIMIT;

  // Handlers
  const handleAddChild = () => {
    router.push('/profile/add-child');
  };

  const handleCrisis = async () => {
    if (!canGenerate) {
      setShowPremiumModal(true);
      return;
    }

    // Use last selected child or first child
    const childId = selectedChildId || (children.length > 0 ? children[0].id : null);
    
    await generateScript({
      isCrisis: true,
      childId,
      situation: 'Crisis situation - need immediate help',
    });
  };

  const handleGenerate = async () => {
    if (!canGenerate) {
      setShowPremiumModal(true);
      return;
    }

    if (!selectedStruggle && !customSituation.trim()) {
      setError('Please select a struggle or describe the situation');
      return;
    }

    const situation = customSituation.trim() || selectedStruggle || '';

    await generateScript({
      childId: selectedChildId,
      situation,
      tone,
    });
  };

  const generateScript = async (params: {
    childId?: string | null;
    situation: string;
    tone?: ToneLevel;
    isCrisis?: boolean;
  }) => {
    if (!user) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedScript(null);

    try {
      // Get child data if available
      const child = params.childId 
        ? children.find(c => c.id === params.childId) 
        : null;

      const childAge = child?.birth_date 
        ? calculateAge(child.birth_date) 
        : null;

      // Call Edge Function
      const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/generate-script`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          childAge,
          childName: child?.name,
          neurotype: child?.neurotype,
          description: params.situation,
          tone: params.tone || 'moderate',
          scenarioType: params.isCrisis ? 'SOS' : 'Rupture',
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to generate script');
      }

      // Format response
      const scriptResponse: ScriptResponse = {
        script: data.script || data.rawModelResponse,
        psych_insight: `${data.validation} ${data.shift}`,
        situation: params.situation,
      };

      setGeneratedScript(scriptResponse);

      // TODO: Increment usage counter

    } catch (err) {
      console.error('Script generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate script');
    } finally {
      setIsGenerating(false);
    }
  };

  const calculateAge = (birthDate: string): number | null => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    if (isNaN(birth.getTime())) return null;
    
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleSave = async () => {
    if (!user || !generatedScript) return;

    try {
      await saveScript(user.id, {
        child_id: selectedChildId,
        situation: generatedScript.situation,
        generated_script: generatedScript.script,
        psych_insight: generatedScript.psych_insight,
      });

      Alert.alert('Saved!', 'Script saved to your journal');
    } catch (err) {
      Alert.alert('Error', 'Failed to save script');
    }
  };

  const handleShare = () => {
    // TODO: Implement sharing
    Alert.alert('Coming Soon', 'Co-parent sharing will be available soon!');
  };

  const handleReadAloud = () => {
    if (!profile?.is_premium) {
      setShowPremiumModal(true);
      return;
    }
    // TODO: Implement text-to-speech
    Alert.alert('Coming Soon', 'Audio playback will be available soon!');
  };

  const handleUpgradeTier = (tierId: 'core' | 'complete' | 'lifetime') => {
    setShowPremiumModal(false);
    // TODO: Redirect to Stripe checkout
    Alert.alert('Coming Soon', `${tierId} tier checkout will be available soon!`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#334155" />
      </View>
    );
  }

  // If script has been generated, show script view
  if (generatedScript) {
    return (
      <ScriptView
        script={generatedScript}
        onSave={handleSave}
        onShare={handleShare}
        onReadAloud={handleReadAloud}
        isPremium={profile?.is_premium || false}
        onUpgrade={() => setShowPremiumModal(true)}
      />
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Create Script</Text>
        <Text style={styles.subtitle}>
          Get words that work for this moment
        </Text>
      </View>

      {/* Usage Bar (Free tier only) */}
      {!profile?.is_premium && (
        <UsageBar
          usage={usage}
          onUpgrade={() => setShowPremiumModal(true)}
        />
      )}

      {/* Crisis Toggle */}
      <CrisisToggle
        onCrisisPress={handleCrisis}
        isLoading={isGenerating}
      />

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or build a custom script</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Child Selector */}
      <ChildSelector
        children={children}
        selectedChildId={selectedChildId}
        onSelectChild={setSelectedChildId}
        onAddChild={handleAddChild}
      />

      {/* Struggle Chips */}
      <StruggleChips
        selectedStruggle={selectedStruggle}
        onSelectStruggle={setSelectedStruggle}
      />

      {/* Custom Situation */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Or describe your situation</Text>
        <TextInput
          style={styles.textInput}
          value={customSituation}
          onChangeText={setCustomSituation}
          placeholder="Tell us what's happening..."
          placeholderTextColor="#94A3B8"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* Tone Slider */}
      <ToneSlider
        value={tone}
        onChange={setTone}
      />

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Generate Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.generateButton}
          onPress={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.generateButtonText}>Generate Script</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Premium Modal */}
      <PremiumModal
        visible={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onSelectTier={handleUpgradeTier}
      />
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
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0F172A', // clinical-text
    marginBottom: 4,
    letterSpacing: 0.025,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8', // clinical-accent
    lineHeight: 1.625 * 16,
    letterSpacing: 0.025,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
    letterSpacing: 0.025,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    color: '#0F172A',
    minHeight: 100,
    lineHeight: 1.625 * 15,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 40,
  },
  generateButton: {
    backgroundColor: '#334155', // clinical-action
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.025,
  },
});
