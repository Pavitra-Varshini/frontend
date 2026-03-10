import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, ViewStyle } from 'react-native';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
  style?: ViewStyle;
  testID?: string;
}

/**
 * Reusable LoadingSpinner component for displaying loading states
 * Requirements: 11.2, 17.5
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message,
  size = 'large',
  color = '#007AFF',
  style,
  testID,
}) => {
  return (
    <View style={[styles.container, style]} testID={testID}>
      <ActivityIndicator size={size} color={color} testID={`${testID}-spinner`} />
      {message && (
        <Text style={styles.message} testID={`${testID}-message`}>
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});
