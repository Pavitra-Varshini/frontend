import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { ErrorMessage } from '../components/ErrorMessage';
import { useResponsive } from '../hooks/useResponsive';
import * as authAPI from '../api/auth';
import { LoginScreenNavigationProp } from '../navigation/types';

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

/**
 * LoginScreen component with responsive styling
 * Allows users to log in with their email address
 * Requirements: 10.2, 10.3, 10.6, 13.6
 */
export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isSmallScreen, width } = useResponsive();

  const handleLogin = async () => {
    // Clear previous errors
    setError(null);

    // Basic validation
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    // Simple email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      
      // Call login API
      await authAPI.login(email);

      // Navigate to OTP verification screen
      navigation.navigate('OTPVerification', {
        email,
        operation: 'login',
      });
    } catch (err: any) {
      // Display error message
      setError(err.message || 'Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignup = () => {
    navigation.navigate('Signup');
  };

  const contentWidth = isSmallScreen ? width - 48 : Math.min(500, width - 48);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      testID="login-screen"
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.content, { maxWidth: contentWidth, alignSelf: 'center' }]}>
          <Text style={[styles.title, isSmallScreen ? styles.titleSmall : styles.titleLarge]}>
            Welcome Back
          </Text>
          <Text style={[styles.subtitle, isSmallScreen ? styles.subtitleSmall : styles.subtitleLarge]}>
            Enter your email to log in
          </Text>

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="your.email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
            testID="login-email-input"
          />

          {error && (
            <ErrorMessage message={error} testID="login-error" />
          )}

          <Button
            title="Log In"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
            testID="login-button"
          />

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={navigateToSignup} disabled={loading}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  titleSmall: {
    fontSize: 28,
  },
  titleLarge: {
    fontSize: 32,
  },
  subtitle: {
    color: '#666666',
    marginBottom: 32,
    textAlign: 'center',
  },
  subtitleSmall: {
    fontSize: 16,
  },
  subtitleLarge: {
    fontSize: 18,
  },
  loginButton: {
    marginTop: 8,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signupText: {
    fontSize: 14,
    color: '#666666',
  },
  signupLink: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
});
