const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const webpack = require('webpack');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Ensure plugins array exists
  config.plugins = config.plugins || [];

  // Polyfill __dirname for browser builds (fixes expo-router web bundle)
  config.plugins.push(
    new webpack.DefinePlugin({
      __dirname: JSON.stringify('.'),
    })
  );

  return config;
};
