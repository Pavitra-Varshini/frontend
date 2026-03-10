import { Platform } from 'react-native';

/**
 * Platform-specific configuration
 * Requirements: 13.2, 13.3
 */
export const platformConfig = {
  isWeb: Platform.OS === 'web',
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
  
  // Platform-specific features
  supportsHaptics: Platform.OS !== 'web',
  supportsPushNotifications: Platform.OS !== 'web',
  
  // Storage type
  storageType: Platform.OS === 'web' ? 'localStorage' : 'AsyncStorage',
};

export default platformConfig;
