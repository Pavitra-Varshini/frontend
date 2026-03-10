import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const TOKEN_KEY = 'session_token';

/**
 * Store session token using AsyncStorage (mobile) or localStorage (web)
 */
export async function storeToken(token: string): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      // Use localStorage for web
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      // Use AsyncStorage for mobile (iOS/Android)
      await AsyncStorage.setItem(TOKEN_KEY, token);
    }
  } catch (error) {
    console.error('Error storing token:', error);
    throw new Error('Failed to store authentication token');
  }
}

/**
 * Retrieve stored session token
 * Returns null if no token is stored
 */
export async function getToken(): Promise<string | null> {
  try {
    if (Platform.OS === 'web') {
      // Use localStorage for web
      return localStorage.getItem(TOKEN_KEY);
    } else {
      // Use AsyncStorage for mobile (iOS/Android)
      return await AsyncStorage.getItem(TOKEN_KEY);
    }
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
}

/**
 * Remove stored session token
 */
export async function clearToken(): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      // Use localStorage for web
      localStorage.removeItem(TOKEN_KEY);
    } else {
      // Use AsyncStorage for mobile (iOS/Android)
      await AsyncStorage.removeItem(TOKEN_KEY);
    }
  } catch (error) {
    console.error('Error clearing token:', error);
    throw new Error('Failed to clear authentication token');
  }
}
