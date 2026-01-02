// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Ensure native platform extensions are properly resolved
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Add iOS and Android as platform extensions
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Block server-only modules from being bundled on native platforms
// These modules use Node.js-specific APIs that don't exist in React Native
config.resolver.blockList = [
  // Block the non-native versions of server utilities when native versions exist
  /app\/_utils\/stripeServer\.ts$/,
  /app\/_utils\/supabaseAdmin\.ts$/,
  // Block API route files that have native stubs
  /app\/api\/.*\/route\.ts$/,
];

module.exports = config;
