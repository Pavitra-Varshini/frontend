/**
 * Web-specific platform configuration
 * This file will be used automatically on web platform
 * Requirements: 13.2, 13.3
 */
export const platformConfig = {
  isWeb: true,
  isIOS: false,
  isAndroid: false,
  
  // Web-specific features
  supportsHaptics: false,
  supportsPushNotifications: false,
  
  // Storage type
  storageType: 'localStorage' as const,
  
  // Web-specific capabilities
  supportsServiceWorker: 'serviceWorker' in navigator,
  supportsWebShare: 'share' in navigator,
};

export default platformConfig;
