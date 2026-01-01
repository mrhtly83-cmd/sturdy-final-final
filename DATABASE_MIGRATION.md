# Database Migration: Stripe Integration

This SQL script adds the necessary columns to support the Stripe premium subscription system.

## Migration SQL

Run this SQL in your Supabase SQL editor:

```sql
-- Add Stripe integration columns to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS plan_interval TEXT;

-- Add usage tracking columns to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS ai_requests_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_requests_reset_at TIMESTAMP;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id 
ON public.users(stripe_customer_id);

CREATE INDEX IF NOT EXISTS idx_users_stripe_subscription_id 
ON public.users(stripe_subscription_id);

CREATE INDEX IF NOT EXISTS idx_users_is_premium 
ON public.users(is_premium);

-- Add comment for documentation
COMMENT ON COLUMN public.users.stripe_customer_id IS 'Stripe customer ID for this user';
COMMENT ON COLUMN public.users.stripe_subscription_id IS 'Active Stripe subscription ID';
COMMENT ON COLUMN public.users.is_premium IS 'Whether user has an active premium subscription';
COMMENT ON COLUMN public.users.plan_interval IS 'Subscription interval: month or year';
COMMENT ON COLUMN public.users.ai_requests_count IS 'Number of AI requests made in current period';
COMMENT ON COLUMN public.users.ai_requests_reset_at IS 'When the AI request counter will reset';
```

## Verification

After running the migration, verify the columns exist:

```sql
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
    AND table_schema = 'public'
    AND column_name IN (
        'stripe_customer_id',
        'stripe_subscription_id', 
        'is_premium',
        'plan_interval',
        'ai_requests_count',
        'ai_requests_reset_at'
    );
```

Expected output:
```
column_name              | data_type | is_nullable | column_default
-------------------------+-----------+-------------+---------------
stripe_customer_id       | text      | YES         | 
stripe_subscription_id   | text      | YES         | 
is_premium              | boolean   | YES         | false
plan_interval           | text      | YES         | 
ai_requests_count       | integer   | YES         | 0
ai_requests_reset_at    | timestamp | YES         | 
```

## Testing

Test that you can update these fields:

```sql
-- Test update (replace with your actual user ID)
UPDATE public.users 
SET 
    stripe_customer_id = 'cus_test123',
    stripe_subscription_id = 'sub_test123',
    is_premium = TRUE,
    plan_interval = 'month',
    ai_requests_count = 5,
    ai_requests_reset_at = NOW() + INTERVAL '1 month'
WHERE id = 'your-user-id';

-- Verify the update
SELECT 
    id,
    email,
    stripe_customer_id,
    stripe_subscription_id,
    is_premium,
    plan_interval,
    ai_requests_count,
    ai_requests_reset_at
FROM public.users 
WHERE id = 'your-user-id';
```

## Row Level Security (RLS)

If you have RLS enabled, you may need to add policies for the webhook to update user records:

```sql
-- Policy for service role to update subscription data
-- This allows the webhook handler (using service role key) to update users
-- The service role key already bypasses RLS, but you can add this for documentation
CREATE POLICY "Service role can update subscription data" ON public.users
    FOR UPDATE
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');
```

## Rollback

If you need to remove these columns:

```sql
-- WARNING: This will delete all subscription data
ALTER TABLE public.users 
DROP COLUMN IF EXISTS stripe_customer_id,
DROP COLUMN IF EXISTS stripe_subscription_id,
DROP COLUMN IF EXISTS is_premium,
DROP COLUMN IF EXISTS plan_interval,
DROP COLUMN IF EXISTS ai_requests_count,
DROP COLUMN IF EXISTS ai_requests_reset_at;

-- Drop indexes
DROP INDEX IF EXISTS idx_users_stripe_customer_id;
DROP INDEX IF EXISTS idx_users_stripe_subscription_id;
DROP INDEX IF EXISTS idx_users_is_premium;
```

## Notes

1. **Backward Compatibility**: These columns are added with default values, so existing rows will automatically get:
   - `is_premium = FALSE`
   - `ai_requests_count = 0`
   - Other fields will be `NULL` until populated by webhooks

2. **Existing Users**: Users who signed up before this migration will need to:
   - Start fresh with subscription status
   - Stripe will automatically populate their data when they subscribe

3. **Data Privacy**: Consider adding data retention policies if required by regulations (e.g., GDPR)

4. **Monitoring**: Consider adding a trigger to log subscription changes for audit purposes
