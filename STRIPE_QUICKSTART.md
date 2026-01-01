# Quick Start: Using the Stripe Integration

This guide helps you quickly get started with the Stripe premium subscription system.

## For Frontend Developers

### Using the Checkout Hook

```typescript
import { useStripeCheckout } from '../hooks/useStripeCheckout';

function MyComponent() {
  const { startCheckout, loading, error } = useStripeCheckout();

  const handleSubscribe = async () => {
    try {
      // Default: Annual plan
      await startCheckout();
      
      // Or specify monthly
      // await startCheckout({ planInterval: "month" });
    } catch (err) {
      console.error("Checkout failed:", err);
    }
  };

  return (
    <button onClick={handleSubscribe} disabled={loading}>
      {loading ? "Loading..." : "Subscribe"}
    </button>
  );
}
```

### Updating the Paywall

The `PremiumPaywall` component has been updated to support both new Stripe checkout and legacy payment links:

```typescript
<PremiumPaywall
  onSubscribeWeekly={handleWeekly}
  onSubscribeMonthly={handleMonthly}
  onSubscribeLifetime={handleLifetime}
  useNewCheckout={true} // Enable new Stripe checkout (default)
/>
```

## For Backend Developers

### Adding Usage Gating to Your API

```typescript
// 1. Import supabaseServer
import { supabaseServer } from "../../_utils/supabaseServer";

// 2. Check user's premium status
const { data: user } = await supabaseServer
  .from("users")
  .select("is_premium, ai_requests_count, ai_requests_reset_at")
  .eq("id", userId)
  .maybeSingle();

// 3. Enforce limits for free users
const FREE_LIMIT = 10;
if (!user.is_premium && user.ai_requests_count >= FREE_LIMIT) {
  return Response.json({
    error: "Free tier limit reached",
    upgradeRequired: true,
    limit: FREE_LIMIT,
  }, { status: 403 });
}

// 4. Track usage after successful request
await supabaseServer
  .from("users")
  .update({ ai_requests_count: user.ai_requests_count + 1 })
  .eq("id", userId);
```

### Checking Premium Status

```typescript
// Simple premium check
const { data: user } = await supabaseServer
  .from("users")
  .select("is_premium")
  .eq("id", userId)
  .single();

if (!user.is_premium) {
  return Response.json({
    error: "Premium subscription required",
    upgradeRequired: true
  }, { status: 403 });
}
```

## Testing Locally

### 1. Set up environment variables

```bash
# Copy example file
cp .env.example .env

# Add your Stripe test keys
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PRICE_MONTHLY=price_...
NEXT_PUBLIC_STRIPE_PRICE_ANNUAL=price_...
```

### 2. Install Stripe CLI (for webhook testing)

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:8081/api/stripe/webhook
```

### 3. Test with Stripe test cards

- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **Requires Auth:** 4000 0025 0000 3155

Use any future expiry date and any 3-digit CVC.

## Common Patterns

### Pattern 1: Feature Flag Based on Premium Status

```typescript
const isPremium = user?.is_premium || false;

return (
  <View>
    {isPremium ? (
      <PremiumFeature />
    ) : (
      <UpgradePrompt />
    )}
  </View>
);
```

### Pattern 2: Soft Limit with Upgrade Prompt

```typescript
// Allow viewing but not creating for free users at limit
if (!user.is_premium && user.ai_requests_count >= FREE_LIMIT) {
  return {
    canView: true,
    canCreate: false,
    showUpgradePrompt: true,
    message: "Upgrade to create more scripts"
  };
}
```

### Pattern 3: Usage Meter Display

```typescript
const usagePercent = user.is_premium 
  ? null // Unlimited
  : (user.ai_requests_count / FREE_LIMIT) * 100;

return (
  <View>
    {!user.is_premium && (
      <Text>
        {user.ai_requests_count} / {FREE_LIMIT} scripts used this month
      </Text>
    )}
  </View>
);
```

## Environment Variables Reference

### Production Checklist

- [ ] Replace all `sk_test_` keys with `sk_live_` keys
- [ ] Replace all `pk_test_` keys with `pk_live_` keys
- [ ] Update webhook endpoint in Stripe Dashboard to production URL
- [ ] Get production webhook secret and update `STRIPE_WEBHOOK_SECRET`
- [ ] Update price IDs to production prices
- [ ] Verify HTTPS is enabled on webhook endpoint
- [ ] Test a real subscription in production

### Required Variables

```bash
# Server-only (NEVER expose to client)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Client-safe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
NEXT_PUBLIC_STRIPE_PRICE_MONTHLY=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_ANNUAL=price_xxx
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJxxx...
```

## Troubleshooting

### "Price ID not configured" error
- Check that `NEXT_PUBLIC_STRIPE_PRICE_MONTHLY` and `NEXT_PUBLIC_STRIPE_PRICE_ANNUAL` are set
- Verify the price IDs exist in your Stripe Dashboard

### Webhook not updating subscription status
- Run `stripe listen` locally to test webhooks
- Check Stripe Dashboard > Developers > Webhooks for error logs
- Verify `STRIPE_WEBHOOK_SECRET` matches your webhook endpoint

### User not authenticated error
- Ensure user is logged in before calling checkout
- Check that `userId` is being passed correctly
- Verify Supabase auth is working

## Need Help?

- See `STRIPE_INTEGRATION.md` for detailed documentation
- Check Stripe Dashboard > Logs for payment errors
- Review webhook event logs in Stripe Dashboard
- Check browser console for frontend errors
