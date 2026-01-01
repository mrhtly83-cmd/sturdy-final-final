# Sturdy Parent App - Implementation Guide

## Overview

This is a multi-child, premium parenting app built with:
- **Backend**: Supabase (PostgreSQL with RLS)
- **Frontend**: React Native with Expo
- **AI**: OpenAI GPT-4o with Attachment Theory prompts
- **Design**: Clinical Luxury system (calming, cortisol-lowering UI)
- **Monetization**: Stripe with 3-tier subscription model

## Phase 1: Database Schema (✅ Complete)

### Tables

1. **profiles** - User profiles linked to auth
   - `id` (UUID, references auth.users)
   - `full_name` (text)
   - `is_premium` (boolean)
   - `subscription_tier` ('free', 'core', 'complete', 'lifetime')
   - `updated_at` (timestamp)

2. **children** - Child profiles with age-based logic
   - `id` (UUID)
   - `parent_id` (UUID, references profiles)
   - `name` (text)
   - `birth_date` (date) - for calculating age
   - `neurotype` (text) - 'Neurotypical', 'ADHD', 'Autism', 'PDA', etc.
   - `created_at` (timestamp)

3. **scripts** - Generated scripts and journal entries
   - `id` (UUID)
   - `parent_id` (UUID, references profiles)
   - `child_id` (UUID, references children, nullable)
   - `situation` (text)
   - `generated_script` (text)
   - `psych_insight` (text)
   - `is_favorite` (boolean)
   - `created_at` (timestamp)

### Deployment

Run the SQL in `supabase/phase1_schema.sql` in your Supabase SQL Editor to create:
- All tables with proper constraints
- Row Level Security (RLS) policies
- Indexes for performance
- Triggers for auto-profile creation
- Database functions

## Phase 2: Design System (✅ Complete)

### Clinical Luxury Colors

- **Base**: `#F8FAFC` (Off-white/Slate 50) - Calming background
- **Text**: `#0F172A` (Deep Navy) - Clear, readable
- **Action**: `#334155` (Slate 700) - Trustworthy actions
- **Accent**: `#94A3B8` (Muted Sage) - Subtle highlights
- **SOS**: `#CA8A04` (Muted Gold) - Crisis/alert state

### Typography

- Font: **Inter** with generous letter spacing (0.025em)
- Line height: 1.625 (leading-relaxed-plus)
- Goal: Lower cortisol through calming, readable design

### Components

- Cards: Subtle borders (`#F1F5F9`), no heavy shadows
- Inputs: Large, soft-rounded corners (`rounded-2xl` = 16px)
- Buttons: Smooth interactions, calming feedback

## Phase 3: UI Components (✅ Complete)

### Create Tab Components

Located in `components/create/`:

1. **ChildSelector.tsx**
   - Pulls children from database
   - Displays name, age (calculated from birth_date), neurotype
   - Horizontal scroll with "Add Child" option

2. **StruggleChips.tsx**
   - Pre-set struggle categories (Aggression, Screen Time, Bedtime, etc.)
   - Quick-select chips for common situations
   - Supports custom struggles

3. **ToneSlider.tsx**
   - Segmented control: Gentle → Moderate → Firm
   - Visual descriptions for each tone
   - No external dependencies

4. **CrisisToggle.tsx**
   - Gold SOS button
   - Skips form, generates immediate "Help Me Now" script
   - Uses last active child

5. **ScriptView.tsx**
   - "Use These Words" header
   - Large, clear script text
   - Collapsible "Psychology Insight" section
   - Action buttons: Save, Share, Read Aloud (premium)

### Usage Example

```tsx
import ChildSelector from '@/components/create/ChildSelector';
import StruggleChips from '@/components/create/StruggleChips';
import ToneSlider from '@/components/create/ToneSlider';
import CrisisToggle from '@/components/create/CrisisToggle';
import ScriptView from '@/components/create/ScriptView';

// In your Create screen:
<ChildSelector
  children={children}
  selectedChildId={selectedChildId}
  onSelectChild={setSelectedChildId}
  onAddChild={() => router.push('/profile/add-child')}
/>

<StruggleChips
  selectedStruggle={struggle}
  onSelectStruggle={setStruggle}
/>

<ToneSlider
  value={tone}
  onChange={setTone}
/>

<CrisisToggle
  onCrisisPress={handleCrisis}
  isLoading={isGenerating}
/>

// After generation:
<ScriptView
  script={generatedScript}
  onSave={handleSave}
  onShare={handleShare}
  onReadAloud={handleReadAloud}
  isPremium={user.is_premium}
  onUpgrade={() => setShowPremiumModal(true)}
/>
```

## Phase 4: Premium Features (✅ Complete)

### Components

Located in `components/premium/`:

1. **UsageBar.tsx**
   - Shows script usage (e.g., "3 / 5 scripts used")
   - Progress bar with color-coded states
   - Triggers upgrade prompt when near/at limit
   - Hidden for premium users

2. **PremiumModal.tsx**
   - Modal with "Unlock Unlimited Peace of Mind" messaging
   - Three-tier pricing display:
     - **Core**: $4.99/week - 10 scripts + journal
     - **Complete**: $9.99/month - 25 scripts + full features
     - **Lifetime**: $49.99 once - unlimited everything
   - Feature comparisons
   - No "Buy Now" language (uses calming copy)

### Feature Gates

Premium-only features:
- ✓ Audio Playback (Read Aloud)
- ✓ Co-Parent Sync
- ✓ Unlimited Child Profiles
- ✓ Unlimited Scripts (free tier limited to 5)

### Usage Example

```tsx
import UsageBar from '@/components/premium/UsageBar';
import PremiumModal from '@/components/premium/PremiumModal';

<UsageBar
  usage={{ used: 3, limit: 5, resetAt: '2026-01-08' }}
  onUpgrade={() => setShowPremiumModal(true)}
/>

<PremiumModal
  visible={showPremiumModal}
  onClose={() => setShowPremiumModal(false)}
  onSelectTier={(tier) => handleSubscribe(tier)}
/>
```

## Phase 5: AI Integration (✅ Complete)

### Edge Function

Located at `supabase/functions/generate-script/index.ts`

- **Model**: GPT-4o (configurable via `OPENAI_MODEL` env var)
- **System Prompt**: 3-part Attachment Theory format
  1. Validate the Parent
  2. Reframe the Child's Identity ("good kid having a hard time")
  3. Provide a verbatim script

### Age-Appropriate Responses

- **Ages 0-9**: Co-regulation, tactile connection, simple words
- **Ages 10-13**: "Side-door" approach, validate feelings, executive function support
- **Ages 14-18**: Consultant role, respect autonomy, safety boundaries

### API Call Example

```typescript
const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-script`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  },
  body: JSON.stringify({
    childAge: 8,
    childName: 'Emma',
    neurotype: 'ADHD',
    situation: 'Refusing bedtime, getting aggressive',
    tone: 'moderate',
    scenarioType: 'Rupture',
  }),
});

const data = await response.json();
// Returns: { validation, shift, script, rawModelResponse }
```

## Phase 6: Implementation Steps

### Step 1: Database Setup ✅

```bash
# In Supabase SQL Editor:
# Run: supabase/phase1_schema.sql
```

### Step 2: Environment Variables

Create `.env` file:

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI (set in Supabase Edge Function secrets)
OPENAI_API_KEY=your_openai_api_key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
EXPO_PUBLIC_STRIPE_WEEKLY_LINK=https://buy.stripe.com/...
EXPO_PUBLIC_STRIPE_MONTHLY_LINK=https://buy.stripe.com/...
EXPO_PUBLIC_STRIPE_LIFETIME_LINK=https://buy.stripe.com/...
```

### Step 3: Onboarding Flow

Create screens:
1. `app/index.tsx` - Animated intro (exists)
2. `app/hook.tsx` - Value proposition (exists)
3. `app/onboarding/profile-setup.tsx` - Collect first child data

### Step 4: Create Tab Integration

Integrate all components into `app/(tabs)/create.tsx`:
- Child selector
- Struggle chips
- Tone slider
- Crisis toggle
- Form submission → Edge Function
- Display ScriptView

### Step 5: Journal/Scripts Tab

Update `app/(tabs)/scripts.tsx`:
- Fetch from `scripts` table with RLS
- Display in cards
- Filter by favorite
- Search functionality

### Step 6: Stripe Integration

- Create Stripe products and prices
- Set up webhook handler (`app/api/stripe/webhook/route.ts`)
- Update `profiles.subscription_tier` on successful payment
- Handle subscription lifecycle

## TypeScript Types

Located in `src/types/index.ts`:

```typescript
interface Profile {
  id: string;
  full_name: string | null;
  is_premium: boolean;
  subscription_tier: 'free' | 'core' | 'complete' | 'lifetime';
  updated_at: string;
}

interface Child {
  id: string;
  parent_id: string;
  name: string | null;
  birth_date: string | null;
  neurotype: string;
  created_at: string;
}

interface Script {
  id: string;
  parent_id: string;
  child_id: string | null;
  situation: string | null;
  generated_script: string | null;
  psych_insight: string | null;
  is_favorite: boolean;
  created_at: string;
}
```

## Testing

### Build and Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for web
npm run build
```

### Test Checklist

- [ ] User signup creates profile automatically
- [ ] Can add multiple children
- [ ] Script generation works with different ages/neurotypes
- [ ] Usage bar shows correct count
- [ ] Premium modal appears at limit
- [ ] Scripts save to database
- [ ] RLS policies prevent unauthorized access
- [ ] Stripe webhooks update subscription_tier

## Design Principles

1. **Calm First**: Every design choice reduces stress
2. **Clear Communication**: No jargon, compassionate language
3. **Trust Building**: Professional but warm
4. **Accessible**: High contrast, readable sizes
5. **Mobile-First**: Touch-friendly, thumb-reachable

## Security

- ✅ Row Level Security (RLS) on all tables
- ✅ Service role key never exposed to client
- ✅ Input sanitization in Edge Function
- ✅ CORS headers configured
- ✅ Type validation on all API endpoints

## Support

For issues or questions:
1. Check the implementation guide above
2. Review component source code
3. Test with Supabase SQL Editor
4. Verify environment variables

---

**Built with ❤️ for parents who need support in the hardest moments.**
