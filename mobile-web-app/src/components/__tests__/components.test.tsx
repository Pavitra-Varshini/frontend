import React from 'react';
import { render } from '@testing-library/react-native';
import { Button, Input, ErrorMessage, LoadingSpinner, EmptyState } from '../index';

describe('Shared Components', () => {
  describe('Button', () => {
    it('should render button with title', () => {
      const { getByText } = render(
        <Button title="Test Button" onPress={() => {}} />
      );
      expect(getByText('Test Button')).toBeTruthy();
    });

    it('should show loading spinner when loading prop is true', () => {
      const { getByTestId } = render(
        <Button title="Test Button" onPress={() => {}} loading testID="test-button" />
      );
      expect(getByTestId('test-button-spinner')).toBeTruthy();
    });

    it('should be disabled when disabled prop is true', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(
        <Button title="Test Button" onPress={onPress} disabled testID="test-button" />
      );
      const button = getByTestId('test-button');
      expect(button.props.accessibilityState.disabled).toBe(true);
    });
  });

  describe('Input', () => {
    it('should render input with label', () => {
      const { getByText } = render(
        <Input label="Email" placeholder="Enter email" />
      );
      expect(getByText('Email')).toBeTruthy();
    });

    it('should display error message when error prop is provided', () => {
      const { getByTestId } = render(
        <Input error="Invalid email" testID="test-input" />
      );
      expect(getByTestId('test-input-error')).toBeTruthy();
    });
  });

  describe('ErrorMessage', () => {
    it('should render error message', () => {
      const { getByText } = render(
        <ErrorMessage message="Something went wrong" />
      );
      expect(getByText('Something went wrong')).toBeTruthy();
    });

    it('should not render when message is empty', () => {
      const { queryByTestId } = render(
        <ErrorMessage message="" testID="error" />
      );
      expect(queryByTestId('error')).toBeNull();
    });
  });

  describe('LoadingSpinner', () => {
    it('should render loading spinner', () => {
      const { getByTestId } = render(
        <LoadingSpinner testID="spinner" />
      );
      expect(getByTestId('spinner-spinner')).toBeTruthy();
    });

    it('should render with message', () => {
      const { getByText } = render(
        <LoadingSpinner message="Loading..." />
      );
      expect(getByText('Loading...')).toBeTruthy();
    });
  });

  describe('EmptyState', () => {
    it('should render empty state with message', () => {
      const { getByText } = render(
        <EmptyState message="No notes yet" />
      );
      expect(getByText('No notes yet')).toBeTruthy();
    });

    it('should render with custom icon', () => {
      const { getByText } = render(
        <EmptyState icon="🎉" message="All done!" />
      );
      expect(getByText('🎉')).toBeTruthy();
    });

    it('should render with description', () => {
      const { getByText } = render(
        <EmptyState message="No notes" description="Create your first note" />
      );
      expect(getByText('Create your first note')).toBeTruthy();
    });
  });
});
