/**
 * Environment configuration
 * Loads environment variables with fallback defaults
 * 
 * For Expo apps:
 * - Native (iOS/Android): Uses expo-constants to read from app.json extra field
 * - Web: Uses process.env from webpack
 * 
 * Configuration priority:
 * 1. Environment variable (process.env.API_BASE_URL)
 * 2. Expo constants (from app.json extra field)
 * 3. Default value (localhost)
 */

/**
 * Get the API base URL from environment variables
 * Falls back to localhost for development if not set
 */
export const getApiBaseUrl = (): string => {
  // For web builds, check process.env first (webpack provides this)
  if (typeof process !== 'undefined' && process.env && process.env.API_BASE_URL) {
    return process.env.API_BASE_URL;
  }
  
  // For native builds, use expo-constants
  // Note: expo-constants is imported dynamically to avoid issues in web builds
  try {
    // Try to import Constants from expo-constants
    // This will work in native builds and Expo web builds
    const Constants = require('expo-constants').default;
    if (Constants.expoConfig?.extra?.apiBaseUrl) {
      return Constants.expoConfig.extra.apiBaseUrl;
    }
  } catch (error) {
    // expo-constants not available or error reading config
    // Fall through to default
  }
  
  // Default to localhost for development
  return 'http://localhost:3000';
};

/**
 * Environment configuration object
 */
export const config = {
  apiBaseUrl: getApiBaseUrl(),
};

export default config;
