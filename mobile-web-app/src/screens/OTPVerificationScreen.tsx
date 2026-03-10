import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Button } from '../components/Button';
import { ErrorMessage } from '../components/ErrorMessage';
import * as authAPI from '../api/auth';
import { OTPVerificationScreenNavigationProp, OTPVerificationScreenRouteProp } from '../navigation/types';
import { useAuth } from '../context/AuthContext';

interface OTPVerificationScreenProps {
  navigation: OTPVerificationScreenNavigationProp;
  route: OTPVerificationScreenRouteProp;
}

/**
 * OTPVerificationScreen component
 * Allows users to verify their email with OTP
 * Requirements: 10.3, 10.4, 10.5, 10.6, 2.6
 */
export const OTPVerificationScreen: React.FC<OTPVerificationScreenProps> = ({
  navigation,
  route,
}) => {
  const { email, operation } = route.params;
  const { login } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Create refs for each input
  const inputRefs = useRef<Array<TextInput | null>>([]);

  // Focus first input on mount
  useEffect(() => {
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    // Only allow single digit
    if (value.length > 1) {
      value = value.slice(-1);
    }

    // Only allow digits
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits are entered
    if (value && index === 5 && newOtp.every(digit => digit !== '')) {
      // Small delay to show the last digit before submitting
      setTimeout(() => {
        handleVerify(newOtp.join(''));
      }, 100);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleVerify = async (otpCode?: string) => {
    const code = otpCode || otp.join('');
    
    // Clear previous errors
    setError(null);

    // Validate OTP format
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    try {
      setLoading(true);

      // Call appropriate verify API based on operation
      const response =
        operation === 'signup'
          ? await authAPI.verifySignup(email, code)
          : await authAPI.verifyLogin(email, code);

      // Store token using auth context
      await login(response.token, response.userId);

      // Navigate to Dashboard
      navigation.replace('Dashboard');
    } catch (err: any) {
      // Display error message
      setError(err.message || 'Invalid verification code. Please try again.');
      // Clear OTP inputs on error
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    // Clear previous errors
    setError(null);

    try {
      setResending(true);

      // Call resend OTP API
      await authAPI.resendOTP(email, operation);

      // Show success feedback (you could use a toast/snackbar in a real app)
      setError(null);
    } catch (err: any) {
      // Display error message
      setError(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      testID="otp-verification-screen"
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>
            We sent a 6-digit code to{'\n'}
            <Text style={styles.email}>{email}</Text>
          </Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.otpInput,
                  digit && styles.otpInputFilled,
                ]}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                editable={!loading && !resending}
                selectTextOnFocus
                testID={`otp-input-${index}`}
              />
            ))}
          </View>

          {error && <ErrorMessage message={error} testID="otp-error" />}

          <Button
            title="Verify"
            onPress={() => handleVerify()}
            loading={loading}
            disabled={resending || otp.some(digit => !digit)}
            style={styles.verifyButton}
            testID="verify-button"
          />

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code? </Text>
            <TouchableOpacity
              onPress={handleResendOTP}
              disabled={loading || resending}
              testID="resend-button"
            >
              <Text
                style={[
                  styles.resendLink,
                  (loading || resending) && styles.resendLinkDisabled,
                ]}
              >
                {resending ? 'Sending...' : 'Resend'}
              </Text>
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
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 24,
  },
  email: {
    fontWeight: '600',
    color: '#333333',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  otpInput: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333333',
    backgroundColor: '#FFFFFF',
  },
  otpInputFilled: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  verifyButton: {
    marginTop: 8,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  resendText: {
    fontSize: 14,
    color: '#666666',
  },
  resendLink: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  resendLinkDisabled: {
    opacity: 0.5,
  },
});
