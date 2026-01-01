const webpack = require('webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Polyfill __dirname on the client to satisfy ua-parser-js when bundled for the browser.
      config.plugins.push(
        new webpack.DefinePlugin({
          __dirname: JSON.stringify('.'),
        }),
      );
    }
    return config;
  },
};

module.exports = nextConfig;
