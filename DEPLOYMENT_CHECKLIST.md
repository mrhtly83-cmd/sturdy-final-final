# Deployment Checklist: Stripe Premium Gating

Use this checklist to deploy the Stripe integration to production.

## Pre-Deployment

### 1. Stripe Setup
- [ ] Create Stripe account (or use existing)
- [ ] Switch to Production mode in Stripe Dashboard
- [ ] Create production products:
  - [ ] Monthly subscription product with price
  - [ ] Annual subscription product with price
- [ ] Copy production price IDs (start with `price_`)
- [ ] Copy production API keys:
  - [ ] Secret key (starts with `sk_live_`)
  - [ ] Publishable key (starts with `pk_live_`)

### 2. Webhook Configuration
- [ ] Add webhook endpoint in Stripe Dashboard:
  - URL: `https://your-production-domain.com/api/stripe/webhook`
  - Events: 
    - [ ] `checkout.session.completed`
    - [ ] `customer.subscription.created`
    - [ ] `customer.subscription.updated`
    - [ ] `customer.subscription.deleted`
- [ ] Copy webhook signing secret (starts with `whsec_`)

### 3. Database Setup
- [ ] Run database migration (see `DATABASE_MIGRATION.md`)
- [ ] Verify columns exist in production database
- [ ] Test that webhook can update users table
- [ ] Ensure service role key has proper permissions

### 4. Environment Variables
- [ ] Set production environment variables:
  ```bash
  # Server-side (NEVER expose to client)
  STRIPE_SECRET_KEY=sk_live_...
  STRIPE_WEBHOOK_SECRET=whsec_...
  SUPABASE_SERVICE_ROLE_KEY=eyJ...
  
  # Client-side
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
  NEXT_PUBLIC_STRIPE_PRICE_MONTHLY=price_...
  NEXT_PUBLIC_STRIPE_PRICE_ANNUAL=price_...
  SUPABASE_URL=https://....supabase.co
  SUPABASE_ANON_KEY=eyJ...
  ```
- [ ] Remove or comment out all test keys
- [ ] Verify no test keys are committed to version control

## Deployment Steps

### 1. Deploy Application
- [ ] Deploy updated code to production
- [ ] Verify build completes successfully
- [ ] Check that all new files are deployed:
  - [ ] `app/api/stripe/checkout/route.ts`
  - [ ] `app/api/stripe/webhook/route.ts`
  - [ ] `app/_utils/supabaseAdmin.ts`
  - [ ] `hooks/useStripeCheckout.ts`
  - [ ] Updated `app/_components/PremiumPaywall.tsx`

### 2. Test Webhook Endpoint
- [ ] Verify webhook URL is publicly accessible
- [ ] Test webhook endpoint responds:
  ```bash
  curl -X POST https://your-domain.com/api/stripe/webhook \
    -H "Content-Type: application/json" \
    -d '{"type": "test"}'
  ```
- [ ] Check webhook logs in Stripe Dashboard

### 3. Test Checkout Flow (Production)
- [ ] Create test user account in production
- [ ] Navigate to paywall
- [ ] Click on subscription plan
- [ ] Complete checkout with real payment method
- [ ] Verify redirect to success page
- [ ] Check Stripe Dashboard for successful payment
- [ ] Verify user's `is_premium` is set to `true` in database

### 4. Test Webhook Events
- [ ] Complete a subscription
- [ ] Verify webhook events are received:
  - [ ] Check Stripe Dashboard > Developers > Webhooks > Your endpoint
  - [ ] Verify successful responses (200 status)
- [ ] Confirm database updates:
  - [ ] `stripe_customer_id` populated
  - [ ] `stripe_subscription_id` populated
  - [ ] `is_premium` set to `true`
  - [ ] `plan_interval` set correctly

### 5. Test Usage Gating
- [ ] Test as free user:
  - [ ] Make 10 AI requests
  - [ ] Verify 11th request is blocked
  - [ ] Verify upgrade prompt is shown
- [ ] Test as premium user:
  - [ ] Make multiple AI requests
  - [ ] Verify unlimited access
  - [ ] Verify no upgrade prompts

### 6. Test Subscription Cancellation
- [ ] Cancel test subscription in Stripe Dashboard
- [ ] Verify webhook event received
- [ ] Confirm `is_premium` set to `false` in database
- [ ] Verify user loses premium access

## Post-Deployment

### 1. Monitoring
- [ ] Set up error monitoring for:
  - [ ] Checkout API errors
  - [ ] Webhook failures
  - [ ] Database update failures
- [ ] Monitor Stripe Dashboard regularly:
  - [ ] Payment success rate
  - [ ] Webhook delivery rate
  - [ ] Failed payments

### 2. Documentation
- [ ] Share `STRIPE_QUICKSTART.md` with development team
- [ ] Update team wiki with deployment notes
- [ ] Document any production-specific configurations

### 3. Customer Support
- [ ] Prepare support documentation for:
  - [ ] Subscription management
  - [ ] Cancellation process
  - [ ] Refund policy
- [ ] Set up customer portal (optional):
  ```typescript
  // Add to profile page
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripe_customer_id,
    return_url: 'https://your-domain.com/profile',
  });
  // Redirect to portalSession.url
  ```

### 4. Analytics
- [ ] Set up tracking for:
  - [ ] Checkout initiated
  - [ ] Checkout completed
  - [ ] Checkout abandoned
  - [ ] Subscription cancelled
  - [ ] Usage limits reached

## Rollback Plan

If issues arise, follow this rollback procedure:

### Quick Rollback (Disable New Checkout)
```typescript
// In paywall component
<PremiumPaywall
  useNewCheckout={false} // Revert to legacy payment links
  ...
/>
```

### Full Rollback
1. [ ] Revert to previous deployment
2. [ ] Disable webhook endpoint in Stripe
3. [ ] Notify users of temporary service interruption
4. [ ] Investigate and fix issues
5. [ ] Redeploy with fixes

## Common Issues

### Issue: Webhook signature verification fails
**Solution:**
- Verify `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard
- Check webhook endpoint URL is exact match
- Ensure HTTPS is enabled

### Issue: Database updates fail
**Solution:**
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
- Check database columns exist
- Verify RLS policies allow service role updates

### Issue: Checkout doesn't redirect
**Solution:**
- Check browser console for errors
- Verify price IDs are correct
- Confirm Stripe keys match (test vs. live)
- Check user authentication

### Issue: Premium status not updating
**Solution:**
- Check webhook events in Stripe Dashboard
- Verify webhook is receiving events
- Check application logs for errors
- Confirm user_id is in subscription metadata

## Security Checklist

- [ ] No secrets in version control
- [ ] All server secrets use server-only variables
- [ ] Webhook signature verification enabled
- [ ] HTTPS enabled on production
- [ ] Rate limiting configured (optional)
- [ ] Error messages don't leak sensitive data
- [ ] Database RLS policies are correct

## Support Contacts

- **Stripe Support:** https://support.stripe.com
- **Supabase Support:** https://supabase.com/support
- **Internal Team:** [Add your team contact info]

## Success Metrics

Track these metrics post-deployment:
- Checkout conversion rate
- Webhook success rate (should be >99%)
- Payment success rate
- Customer support tickets related to billing
- Average time to premium activation after payment

## Next Steps

After successful deployment:
1. Monitor for 24 hours
2. Address any issues immediately
3. Gather user feedback
4. Plan for additional features (see `STRIPE_INTEGRATION.md`)

---

**Deployment Date:** _________________  
**Deployed By:** _________________  
**Version:** _________________  
**Notes:** _________________
