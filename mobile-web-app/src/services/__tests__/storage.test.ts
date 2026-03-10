import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { storeToken, getToken, clearToken } from '../storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock localStorage for web tests
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('Storage Service', () => {
  const mockToken = 'test-session-token-12345';
  const TOKEN_KEY = 'session_token';

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  describe('storeToken', () => {
    it('should store token using AsyncStorage on mobile', async () => {
      // Mock mobile platform
      Platform.OS = 'ios';

      await storeToken(mockToken);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(TOKEN_KEY, mockToken);
    });

    it('should store token using localStorage on web', async () => {
      // Mock web platform
      Platform.OS = 'web';

      await storeToken(mockToken);

      expect(localStorageMock.getItem(TOKEN_KEY)).toBe(mockToken);
    });

    it('should throw error if storage fails on mobile', async () => {
      Platform.OS = 'android';
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(
        new Error('Storage error')
      );

      await expect(storeToken(mockToken)).rejects.toThrow(
        'Failed to store authentication token'
      );
    });
  });

  describe('getToken', () => {
    it('should retrieve token using AsyncStorage on mobile', async () => {
      Platform.OS = 'ios';
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(mockToken);

      const result = await getToken();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(TOKEN_KEY);
      expect(result).toBe(mockToken);
    });

    it('should retrieve token using localStorage on web', async () => {
      Platform.OS = 'web';
      localStorageMock.setItem(TOKEN_KEY, mockToken);

      const result = await getToken();

      expect(result).toBe(mockToken);
    });

    it('should return null if no token is stored on mobile', async () => {
      Platform.OS = 'android';
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const result = await getToken();

      expect(result).toBeNull();
    });

    it('should return null if storage retrieval fails', async () => {
      Platform.OS = 'ios';
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(
        new Error('Storage error')
      );

      const result = await getToken();

      expect(result).toBeNull();
    });
  });

  describe('clearToken', () => {
    it('should remove token using AsyncStorage on mobile', async () => {
      Platform.OS = 'android';

      await clearToken();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(TOKEN_KEY);
    });

    it('should remove token using localStorage on web', async () => {
      Platform.OS = 'web';
      localStorageMock.setItem(TOKEN_KEY, mockToken);

      await clearToken();

      expect(localStorageMock.getItem(TOKEN_KEY)).toBeNull();
    });

    it('should throw error if token removal fails on mobile', async () => {
      Platform.OS = 'ios';
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValueOnce(
        new Error('Storage error')
      );

      await expect(clearToken()).rejects.toThrow(
        'Failed to clear authentication token'
      );
    });
  });

  describe('Platform-specific behavior', () => {
    it('should use AsyncStorage for iOS platform', async () => {
      Platform.OS = 'ios';
      (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(undefined);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(mockToken);
      (AsyncStorage.removeItem as jest.Mock).mockResolvedValueOnce(undefined);

      await storeToken(mockToken);
      await getToken();
      await clearToken();

      expect(AsyncStorage.setItem).toHaveBeenCalled();
      expect(AsyncStorage.getItem).toHaveBeenCalled();
      expect(AsyncStorage.removeItem).toHaveBeenCalled();
    });

    it('should use AsyncStorage for Android platform', async () => {
      Platform.OS = 'android';
      (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(undefined);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(mockToken);
      (AsyncStorage.removeItem as jest.Mock).mockResolvedValueOnce(undefined);

      await storeToken(mockToken);
      await getToken();
      await clearToken();

      expect(AsyncStorage.setItem).toHaveBeenCalled();
      expect(AsyncStorage.getItem).toHaveBeenCalled();
      expect(AsyncStorage.removeItem).toHaveBeenCalled();
    });
  });
});
