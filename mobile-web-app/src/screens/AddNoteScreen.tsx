import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { ErrorMessage } from '../components/ErrorMessage';
import * as notesAPI from '../api/notes';
import * as storage from '../services/storage';
import { AddNoteScreenNavigationProp } from '../navigation/types';
import { useProtectedRoute } from '../hooks/useProtectedRoute';

interface AddNoteScreenProps {
  navigation: AddNoteScreenNavigationProp;
}

/**
 * AddNoteScreen component
 * Allows users to create a new note with title and content
 * Requirements: 12.1, 12.3, 12.4, 12.5, 12.6
 */
export const AddNoteScreen: React.FC<AddNoteScreenProps> = ({ navigation }) => {
  useProtectedRoute(); // Protect this route
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    // Clear previous errors
    setError(null);

    // Validate required fields
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    if (!content.trim()) {
      setError('Please enter some content');
      return;
    }

    try {
      setLoading(true);

      // Get stored token
      const token = await storage.getToken();
      if (!token) {
        // No token, redirect to login
        navigation.replace('Login');
        return;
      }

      // Call create note API
      await notesAPI.createNote(token, title.trim(), content.trim());

      // Navigate back to dashboard on success
      navigation.navigate('Dashboard');
    } catch (err: any) {
      // Handle authentication errors
      if (err.code === 'AUTHENTICATION_ERROR' || err.status === 401) {
        await storage.clearToken();
        navigation.replace('Login');
        return;
      }

      // Display error message
      setError(err.message || 'Failed to create note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Navigate back to dashboard without saving
    navigation.navigate('Dashboard');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      testID="add-note-screen"
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>New Note</Text>
        </View>

        <View style={styles.content}>
          <Input
            label="Title"
            value={title}
            onChangeText={setTitle}
            placeholder="Enter note title"
            editable={!loading}
            testID="add-note-title-input"
          />

          <View style={styles.contentInputContainer}>
            <Text style={styles.label}>Content</Text>
            <TextInput
              style={styles.contentInput}
              value={content}
              onChangeText={setContent}
              placeholder="Enter note content"
              multiline
              numberOfLines={10}
              textAlignVertical="top"
              editable={!loading}
              testID="add-note-content-input"
            />
          </View>

          {error && (
            <ErrorMessage message={error} testID="add-note-error" />
          )}

          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              onPress={handleCancel}
              disabled={loading}
              variant="secondary"
              style={styles.button}
              testID="add-note-cancel-button"
            />
            <Button
              title="Save"
              onPress={handleSave}
              loading={loading}
              variant="primary"
              style={styles.button}
              testID="add-note-save-button"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    width: '100%',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
  },
  content: {
    padding: 24,
    width: '100%',
    maxWidth: 800,
  },
  contentInputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  contentInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#333333',
    minHeight: 300,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 12,
  },
  button: {
    flex: 1,
  },
});
