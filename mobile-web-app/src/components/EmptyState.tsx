import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface EmptyStateProps {
  icon?: string;
  message: string;
  description?: string;
  style?: ViewStyle;
  testID?: string;
}

/**
 * Reusable EmptyState component for displaying empty states
 * Requirements: 11.3, 11.4
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📝',
  message,
  description,
  style,
  testID,
}) => {
  return (
    <View style={[styles.container, style]} testID={testID}>
      <Text style={styles.icon} testID={`${testID}-icon`}>
        {icon}
      </Text>
      <Text style={styles.message} testID={`${testID}-message`}>
        {message}
      </Text>
      {description && (
        <Text style={styles.description} testID={`${testID}-description`}>
          {description}
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
    padding: 40,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
});
