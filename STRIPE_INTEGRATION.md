# Stripe Premium Gating Implementation

This document describes the Stripe-powered premium subscription system implemented for the Sturdy app.

## Overview

The implementation provides:
- Server-side Stripe checkout session creation
- Webhook handling for subscription lifecycle events
- Frontend hooks for initiating checkout
- Usage gating for free vs. premium features
- Automatic user updates based on subscription status

## Architecture

### Server-Side Components

#### 1. Supabase Admin Client (`app/_utils/supabaseAdmin.ts`)
- Server-only client with elevated privileges
- Uses `SUPABASE_SERVICE_ROLE_KEY` to bypass Row Level Security
- **Never** expose this client to the frontend

#### 2. Stripe Checkout API (`app/api/stripe/checkout/route.ts`)
- **Endpoint:** POST `/api/stripe/checkout`
- Creates subscription checkout sessions
- Supports monthly and annual plans
- Automatically creates/retrieves Stripe customers
- Includes user metadata for webhook processing

**Request Body:**
```json
{
  "priceId": "price_xxx",
  "userId": "user-uuid"
}
```

**Response:**
```json
{
  "sessionId": "cs_test_xxx",
  "url": "https://checkout.stripe.com/..."
}
```

#### 3. Stripe Webhook Handler (`app/api/stripe/webhook/route.ts`)
- **Endpoint:** POST `/api/stripe/webhook`
- Verifies webhook signatures for security
- Handles subscription lifecycle events:
  - `checkout.session.completed` - Updates customer ID after checkout
  - `customer.subscription.created` - Activates premium status
  - `customer.subscription.updated` - Updates premium status
  - `customer.subscription.deleted` - Removes premium status
- Updates `public.users` table with subscription data

**Database Fields Updated:**
- `stripe_customer_id` - Stripe customer identifier
- `stripe_subscription_id` - Active subscription ID
- `is_premium` - Boolean premium status
- `plan_interval` - "month" or "year"

### Frontend Components

#### 1. useStripeCheckout Hook (`hooks/useStripeCheckout.ts`)
React hook for initiating checkout:

```typescript
const { startCheckout, loading, error } = useStripeCheckout();

// Start checkout with annual plan (default)
await startCheckout();

// Start checkout with monthly plan
await startCheckout({ planInterval: "month" });

// Start checkout with specific price ID
await startCheckout({ priceId: "price_xxx" });
```

**Platform Support:**
- Web version: Redirects to Stripe Checkout
- Native version: Opens checkout in browser (`.native.ts`)

#### 2. Updated Paywall Component (`app/_components/PremiumPaywall.tsx`)
- Integrated with `useStripeCheckout` hook
- Falls back to legacy payment links for lifetime plans
- Shows loading state during checkout
- Supports both new and legacy checkout flows

### Usage Gating

#### Example: Generate Script API (`app/api/generate-script/route.ts`)

Demonstrates usage gating pattern:

1. **Check Premium Status:**
   - Queries `users.is_premium` field
   
2. **Enforce Free Tier Limits:**
   - Free users: 10 AI requests per month
   - Premium users: Unlimited requests
   
3. **Track Usage:**
   - Increments `ai_requests_count` after each request
   - Resets counter monthly via `ai_requests_reset_at`

**Response for limit exceeded:**
```json
{
  "error": "Free tier limit reached",
  "message": "You've reached your monthly limit of 10 AI-generated scripts...",
  "upgradeRequired": true,
  "limit": 10,
  "used": 10
}
```

## Environment Variables

### Required Server-Side Variables (Never Expose to Client)

```bash
# Stripe Secret Key - Server-side only
STRIPE_SECRET_KEY=sk_test_xxx

# Stripe Webhook Secret - Server-side only
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Supabase Service Role Key - Server-side only
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

### Required Client-Side Variables

```bash
# Stripe Publishable Key (safe for client)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Stripe Price IDs
NEXT_PUBLIC_STRIPE_PRICE_MONTHLY=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_ANNUAL=price_xxx

# Supabase URL (safe for client)
SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co

# Supabase Anon Key (safe for client)
SUPABASE_ANON_KEY=eyJxxx...
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

### Legacy Variables (Optional - for backward compatibility)
```bash
EXPO_PUBLIC_STRIPE_WEEKLY_LINK=https://buy.stripe.com/xxx
EXPO_PUBLIC_STRIPE_MONTHLY_LINK=https://buy.stripe.com/xxx
EXPO_PUBLIC_STRIPE_LIFETIME_LINK=https://buy.stripe.com/xxx
```

## Database Schema Requirements

The `public.users` table must include these columns:

```sql
-- Stripe integration columns
stripe_customer_id TEXT,
stripe_subscription_id TEXT,
is_premium BOOLEAN DEFAULT FALSE,
plan_interval TEXT, -- 'month' or 'year'

-- Usage tracking columns
ai_requests_count INTEGER DEFAULT 0,
ai_requests_reset_at TIMESTAMP
```

## Setup Instructions

### 1. Stripe Configuration

1. Create a Stripe account at https://stripe.com
2. Create products and prices in Stripe Dashboard:
   - Monthly subscription
   - Annual subscription
3. Copy price IDs (starting with `price_`)
4. Get API keys from Developers > API keys
5. Set up webhook endpoint:
   - URL: `https://your-domain.com/api/stripe/webhook`
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
6. Copy webhook signing secret (starts with `whsec_`)

### 2. Environment Configuration

1. Copy `.env.example` to `.env`
2. Fill in all Stripe environment variables
3. Ensure `SUPABASE_SERVICE_ROLE_KEY` is set

### 3. Database Setup

Ensure your `public.users` table has the required columns listed above.

### 4. Testing

#### Test Checkout Flow:
1. Use Stripe test mode keys (starting with `sk_test_` and `pk_test_`)
2. Navigate to the paywall in your app
3. Click on a subscription plan
4. Use test card: `4242 4242 4242 4242`
5. Complete checkout

#### Test Webhook:
1. Use Stripe CLI for local testing:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
2. Trigger test events:
   ```bash
   stripe trigger checkout.session.completed
   stripe trigger customer.subscription.updated
   ```

## Security Considerations

1. **Never expose server-side keys:**
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `SUPABASE_SERVICE_ROLE_KEY`

2. **Always verify webhook signatures:**
   - The webhook handler verifies all incoming webhooks
   - Rejects requests with invalid signatures

3. **Use HTTPS in production:**
   - Stripe requires HTTPS for webhook endpoints
   - Use SSL certificates in production

4. **Validate user authentication:**
   - Checkout API requires authenticated user ID
   - Never trust client-provided user IDs without verification

## Troubleshooting

### Webhook Not Receiving Events
- Verify webhook URL is correct in Stripe Dashboard
- Check webhook signing secret matches environment variable
- Ensure endpoint is publicly accessible (use ngrok for local testing)
- Check webhook event logs in Stripe Dashboard

### Checkout Not Working
- Verify price IDs are correct
- Check Stripe API keys are in test/live mode consistently
- Ensure user is authenticated
- Check browser console for errors

### Premium Status Not Updating
- Verify webhook is receiving events
- Check webhook handler logs for errors
- Ensure database columns exist and are writable
- Verify `SUPABASE_SERVICE_ROLE_KEY` has proper permissions

## Future Enhancements

Potential improvements:
- Add subscription cancellation flow
- Implement usage-based billing
- Add proration for plan changes
- Support for coupons/discounts
- Add customer portal for self-service management
- Implement free trial periods
- Add subscription pause/resume functionality
