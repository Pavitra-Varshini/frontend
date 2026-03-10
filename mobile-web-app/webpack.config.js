const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const webpack = require('webpack');
const dotenv = require('dotenv');
const path = require('path');

module.exports = async function (env, argv) {
  // Load environment variables from .env file
  const envFile = dotenv.config({ path: path.resolve(__dirname, '.env') });
  const envVars = envFile.parsed || {};

  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ['@react-native-async-storage/async-storage'],
      },
    },
    argv
  );

  // Customize the config before returning it
  // Add platform-specific file resolution
  config.resolve.extensions = [
    '.web.tsx',
    '.web.ts',
    '.web.jsx',
    '.web.js',
    '.tsx',
    '.ts',
    '.jsx',
    '.js',
  ];

  // Add crypto polyfill for web
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer'),
  };

  // Add environment variables to webpack DefinePlugin
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        ...envVars,
        NODE_ENV: process.env.NODE_ENV || 'development',
      }),
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    })
  );

  return config;
};
