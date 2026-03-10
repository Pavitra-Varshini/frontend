import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { ErrorMessage } from '../components/ErrorMessage';
import { Note } from '../types';
import * as notesAPI from '../api/notes';
import * as storage from '../services/storage';
import { EditNoteScreenNavigationProp, EditNoteScreenRouteProp } from '../navigation/types';
import { useProtectedRoute } from '../hooks/useProtectedRoute';

interface EditNoteScreenProps {
  navigation: EditNoteScreenNavigationProp;
  route: EditNoteScreenRouteProp;
}

/**
 * EditNoteScreen component
 * Allows users to edit or delete an existing note
 * Requirements: 12.2, 12.3, 12.4, 12.5, 12.6
 */
export const EditNoteScreen: React.FC<EditNoteScreenProps> = ({ navigation, route }) => {
  useProtectedRoute(); // Protect this route
  
  const { note } = route.params;

  // Pre-populate with existing note data
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
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

      // Call update note API
      await notesAPI.updateNote(token, note.noteId, title.trim(), content.trim());

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
      setError(err.message || 'Failed to update note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);

      // Get stored token
      const token = await storage.getToken();
      if (!token) {
        // No token, redirect to login
        navigation.replace('Login');
        return;
      }

      // Call delete note API
      await notesAPI.deleteNote(token, note.noteId);

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
      setError(err.message || 'Failed to delete note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = () => {
    // Use native browser confirm for web, Alert.alert for native
    if (typeof window !== 'undefined') {
      const confirmed = window.confirm(`Are you sure you want to delete "${note.title}"?`);
      if (confirmed) {
        handleDelete();
      }
    } else {
      Alert.alert(
        'Delete Note',
        `Are you sure you want to delete "${note.title}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: handleDelete,
          },
        ]
      );
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
      testID="edit-note-screen"
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Edit Note</Text>
        </View>

        <View style={styles.content}>
          <Input
            label="Title"
            value={title}
            onChangeText={setTitle}
            placeholder="Enter note title"
            editable={!loading}
            testID="edit-note-title-input"
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
              testID="edit-note-content-input"
            />
          </View>

          {error && (
            <ErrorMessage message={error} testID="edit-note-error" />
          )}

          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              onPress={handleCancel}
              disabled={loading}
              variant="secondary"
              style={styles.button}
              testID="edit-note-cancel-button"
            />
            <Button
              title="Save"
              onPress={handleSave}
              loading={loading}
              variant="primary"
              style={styles.button}
              testID="edit-note-save-button"
            />
          </View>

          <Button
            title="Delete Note"
            onPress={confirmDelete}
            disabled={loading}
            variant="danger"
            style={styles.deleteButton}
            testID="edit-note-delete-button"
          />
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
    marginBottom: 16,
    gap: 12,
  },
  button: {
    flex: 1,
  },
  deleteButton: {
    marginTop: 8,
  },
});
