#!/usr/bin/env node
/**
 * check-env.js
 * Validate environment configuration
 * Usage: node scripts/check-env.js
 */

const fs = require('fs');
const path = require('path');

// Colors for terminal output
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
};

function printStatus(message) {
  console.log(`${colors.green}✓${colors.reset} ${message}`);
}

function printWarning(message) {
  console.log(`${colors.yellow}⚠${colors.reset} ${message}`);
}

function printError(message) {
  console.log(`${colors.red}✗${colors.reset} ${message}`);
}

function checkEnvFile() {
  console.log('🔍 Checking environment configuration...\n');

  const envPath = path.join(process.cwd(), '.env');
  const envExamplePath = path.join(process.cwd(), '.env.example');

  // Check if .env exists
  if (!fs.existsSync(envPath)) {
    printError('.env file not found');
    if (fs.existsSync(envExamplePath)) {
      console.log('  Create it with: cp .env.example .env');
    }
    return false;
  }

  printStatus('.env file exists');

  // Read .env file
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const envLines = envContent.split('\n');

  const requiredVars = {
    EXPO_PUBLIC_SUPABASE_URL: {
      required: true,
      placeholder: 'your_supabase_url_here',
    },
    EXPO_PUBLIC_SUPABASE_ANON_KEY: {
      required: true,
      placeholder: 'your_supabase_anon_key_here',
    },
    SUPABASE_SERVICE_ROLE_KEY: {
      required: false,
      placeholder: 'your_supabase_service_role_key_here',
    },
    OPENAI_API_KEY: {
      required: false,
      placeholder: 'your_openai_api_key_here',
    },
  };

  let allValid = true;
  const configuredVars = {};

  // Parse .env file
  for (const line of envLines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=').trim();
      configuredVars[key] = value;
    }
  }

  // Check required variables
  console.log('\n📋 Checking required variables:\n');

  for (const [key, config] of Object.entries(requiredVars)) {
    const value = configuredVars[key];

    if (!value || value === config.placeholder) {
      if (config.required) {
        printError(`${key} not configured`);
        allValid = false;
      } else {
        printWarning(`${key} not configured (optional)`);
      }
    } else {
      printStatus(`${key} configured`);
    }
  }

  // Check Stripe variables
  console.log('\n💳 Checking Stripe configuration (optional):\n');

  const stripeVars = [
    'STRIPE_SECRET_KEY',
    'EXPO_PUBLIC_STRIPE_WEEKLY_LINK',
    'EXPO_PUBLIC_STRIPE_MONTHLY_LINK',
    'EXPO_PUBLIC_STRIPE_LIFETIME_LINK',
  ];

  let stripeConfigured = 0;
  for (const key of stripeVars) {
    const value = configuredVars[key];
    if (value && !value.includes('your_') && !value.includes('_here')) {
      printStatus(`${key} configured`);
      stripeConfigured++;
    } else {
      printWarning(`${key} not configured`);
    }
  }

  if (stripeConfigured === 0) {
    console.log('\n  Stripe is not configured. Payment features will not work.');
  } else if (stripeConfigured < stripeVars.length) {
    printWarning('Partial Stripe configuration detected');
  }

  console.log('\n' + '='.repeat(50));

  if (allValid) {
    printStatus('Environment configuration looks good!');
    console.log('\nNext steps:');
    console.log('1. Run SQL schema in Supabase Dashboard');
    console.log('2. Deploy Edge Function (see scripts/deploy-edge-function.sh)');
    console.log('3. Start dev server: npm run dev');
    return true;
  } else {
    printError('Please fix the errors above');
    console.log('\nSee NEXT_STEPS.md for detailed instructions.');
    return false;
  }
}

// Run the check
const isValid = checkEnvFile();
process.exit(isValid ? 0 : 1);
