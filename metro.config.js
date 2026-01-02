// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Ensure native platform extensions are properly resolved
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Add iOS and Android as platform extensions
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Block server-only modules from being bundled on native platforms.
// These modules use Node.js-specific APIs (crypto, events, etc.) that don't exist in React Native.
// Only block specific files that have corresponding .native.ts stubs.
config.resolver.blockList = [
  // Server utilities that import Node.js-only packages (stripe, etc.)
  /app\/_utils\/stripeServer\.ts$/,
  /app\/_utils\/supabaseAdmin\.ts$/,
  // API route files that have native stubs - be specific to avoid blocking routes that might work on native
  /app\/api\/stripe\/checkout\/route\.ts$/,
  /app\/api\/stripe\/webhook\/route\.ts$/,
  /app\/api\/sturdy\/script\/route\.ts$/,
  /app\/api\/generate-script\/route\.ts$/,
  /app\/api\/entitlements\/route\.ts$/,
  /app\/api\/health\/supabase\/route\.ts$/,
  /app\/api\/admin\/role\/route\.ts$/,
  /app\/api\/admin\/reset-usage\/route\.ts$/,
];

module.exports = config;
