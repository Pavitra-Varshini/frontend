import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

/**
 * Hook to protect routes that require authentication
 * Redirects to Login if user is not authenticated
 * Requirements: 4.2, 4.3, 10.5
 */
export const useProtectedRoute = () => {
  const { isAuthenticated, checkAuth } = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const verifyAuth = async () => {
      const authenticated = await checkAuth();
      
      if (!authenticated) {
        navigation.replace('Login');
      }
    };

    verifyAuth();
  }, []);

  return { isAuthenticated };
};
