import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface ErrorMessageProps {
  message: string;
  style?: ViewStyle;
  testID?: string;
}

/**
 * Reusable ErrorMessage component for displaying error messages
 * Requirements: 10.6, 17.3
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  style,
  testID,
}) => {
  if (!message) {
    return null;
  }

  return (
    <View style={[styles.container, style]} testID={testID}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  message: {
    flex: 1,
    fontSize: 14,
    color: '#C62828',
    lineHeight: 20,
  },
});
