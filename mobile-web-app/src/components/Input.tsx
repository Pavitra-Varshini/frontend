import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { useResponsive } from '../hooks/useResponsive';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  testID?: string;
}

/**
 * Reusable Input component with validation display and responsive styling
 * Requirements: 10.6, 17.3, 13.6
 */
export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  testID,
  ...textInputProps
}) => {
  const { isSmallScreen } = useResponsive();
  const hasError = !!error;

  return (
    <View style={[styles.container, containerStyle]} testID={testID}>
      {label && (
        <Text style={[styles.label, isSmallScreen ? styles.labelSmall : styles.labelLarge]}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          isSmallScreen ? styles.inputSmall : styles.inputLarge,
          hasError && styles.inputError,
          style,
        ]}
        placeholderTextColor="#999999"
        testID={`${testID}-input`}
        {...textInputProps}
      />
      {hasError && (
        <Text style={styles.errorText} testID={`${testID}-error`}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  labelSmall: {
    fontSize: 14,
  },
  labelLarge: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  inputSmall: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    minHeight: 48,
  },
  inputLarge: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 18,
    minHeight: 52,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
});
