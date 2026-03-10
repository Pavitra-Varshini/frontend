import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Note } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { Button } from '../components/Button';
import { useResponsive } from '../hooks/useResponsive';
import * as notesAPI from '../api/notes';
import * as authAPI from '../api/auth';
import * as storage from '../services/storage';
import { DashboardScreenNavigationProp } from '../navigation/types';
import { useProtectedRoute } from '../hooks/useProtectedRoute';

interface DashboardScreenProps {
  navigation: DashboardScreenNavigationProp;
}

/**
 * DashboardScreen component with responsive styling
 * Displays all user notes sorted by most recently updated
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 13.6
 */
export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  useProtectedRoute(); // Protect this route
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const { isSmallScreen, width } = useResponsive();

  // Fetch notes on mount
  useEffect(() => {
    loadNotes();
  }, []);

  // Reload notes when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadNotes();
    });

    return unsubscribe;
  }, [navigation]);

  const loadNotes = async () => {
    try {
      setError(null);
      
      // Get stored token
      const storedToken = await storage.getToken();
      if (!storedToken) {
        // No token, redirect to login
        navigation.replace('Login');
        return;
      }
      
      setToken(storedToken);
      
      // Fetch notes from API
      const fetchedNotes = await notesAPI.getNotes(storedToken);
      
      // Notes are already sorted by updatedAt desc from backend
      setNotes(fetchedNotes);
    } catch (err: any) {
      // Handle authentication errors
      if (err.code === 'AUTHENTICATION_ERROR' || err.status === 401) {
        await storage.clearToken();
        navigation.replace('Login');
        return;
      }
      
      // Display error message
      setError(err.message || 'Failed to load notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      setError(null);
      
      if (!token) {
        navigation.replace('Login');
        return;
      }
      
      const fetchedNotes = await notesAPI.getNotes(token);
      setNotes(fetchedNotes);
    } catch (err: any) {
      if (err.code === 'AUTHENTICATION_ERROR' || err.status === 401) {
        await storage.clearToken();
        navigation.replace('Login');
        return;
      }
      
      setError(err.message || 'Failed to refresh notes. Please try again.');
    } finally {
      setRefreshing(false);
    }
  }, [token, navigation]);

  // Handle note selection - navigate to edit screen
  const handleNotePress = (note: Note) => {
    navigation.navigate('EditNote', { note });
  };

  // Handle note deletion
  const handleDeleteNote = async (noteId: string) => {
    if (!token) {
      navigation.replace('Login');
      return;
    }

    try {
      // Call delete API
      await notesAPI.deleteNote(token, noteId);
      
      // Reload notes from server to ensure consistency
      await loadNotes();
    } catch (err: any) {
      if (err.code === 'AUTHENTICATION_ERROR' || err.status === 401) {
        await storage.clearToken();
        navigation.replace('Login');
        return;
      }
      
      // Show error alert
      if (typeof window !== 'undefined') {
        window.alert(err.message || 'Failed to delete note. Please try again.');
      } else {
        Alert.alert('Error', err.message || 'Failed to delete note. Please try again.');
      }
    }
  };

  // Confirm deletion with user
  const confirmDelete = (note: Note) => {
    // Use native browser confirm for web, Alert.alert for native
    if (typeof window !== 'undefined') {
      const confirmed = window.confirm(`Are you sure you want to delete "${note.title}"?`);
      if (confirmed) {
        handleDeleteNote(note.noteId);
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
            onPress: () => handleDeleteNote(note.noteId),
          },
        ]
      );
    }
  };

  // Navigate to add note screen
  const handleAddNote = () => {
    navigation.navigate('AddNote');
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      if (token) {
        // Call logout API to invalidate session on server
        await authAPI.logout(token);
      }
    } catch (err) {
      // Ignore logout API errors, still clear local token
      console.log('Logout API error:', err);
    } finally {
      // Clear local token and navigate to login
      await storage.clearToken();
      navigation.replace('Login');
    }
  };

  // Confirm logout with user
  const confirmLogout = () => {
    if (typeof window !== 'undefined') {
      const confirmed = window.confirm('Are you sure you want to logout?');
      if (confirmed) {
        handleLogout();
      }
    } else {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: handleLogout,
          },
        ]
      );
    }
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  // Render individual note item
  const renderNoteItem = ({ item }: { item: Note }) => (
    <TouchableOpacity
      style={[
        styles.noteItem,
        !isSmallScreen && styles.noteItemLarge,
      ]}
      onPress={() => handleNotePress(item)}
      testID={`note-item-${item.noteId}`}
    >
      <View style={styles.noteContent}>
        <Text style={[styles.noteTitle, !isSmallScreen && styles.noteTitleLarge]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.notePreview, !isSmallScreen && styles.notePreviewLarge]} numberOfLines={2}>
          {item.content}
        </Text>
        <Text style={styles.noteDate}>
          {formatDate(item.updatedAt)}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => confirmDelete(item)}
        testID={`delete-button-${item.noteId}`}
      >
        <Text style={styles.deleteButtonText}>🗑️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const contentWidth = isSmallScreen ? width : Math.min(800, width);

  // Show loading spinner on initial load
  if (loading) {
    return (
      <View style={styles.container} testID="dashboard-screen">
        <LoadingSpinner message="Loading notes..." testID="dashboard-loading" />
      </View>
    );
  }

  return (
    <View style={styles.container} testID="dashboard-screen">
      <View style={[styles.header, !isSmallScreen && styles.headerLarge]}>
        <Text style={[styles.headerTitle, !isSmallScreen && styles.headerTitleLarge]}>My Notes</Text>
        <View style={styles.headerButtons}>
          <Button
            title="+ Add Note"
            onPress={handleAddNote}
            style={styles.addButton}
            testID="add-note-button"
          />
          <Button
            title="Logout"
            onPress={confirmLogout}
            variant="secondary"
            style={styles.logoutButton}
            testID="logout-button"
          />
        </View>
      </View>

      <View style={{ width: contentWidth, alignSelf: 'center', flex: 1 }}>
        {error && (
          <ErrorMessage message={error} testID="dashboard-error" />
        )}

        {notes.length === 0 && !error ? (
          <EmptyState
            icon="📝"
            message="No notes yet"
            description="Tap 'Add Note' to create your first note"
            testID="dashboard-empty"
          />
        ) : (
          <FlatList
            data={notes}
            renderItem={renderNoteItem}
            keyExtractor={(item) => item.noteId}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                testID="dashboard-refresh"
              />
            }
            testID="notes-list"
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerLarge: {
    paddingHorizontal: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  headerTitleLarge: {
    fontSize: 28,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 120,
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 80,
  },
  listContent: {
    padding: 16,
  },
  noteItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  noteItemLarge: {
    padding: 20,
  },
  noteContent: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  noteTitleLarge: {
    fontSize: 20,
  },
  notePreview: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 8,
  },
  notePreviewLarge: {
    fontSize: 16,
    lineHeight: 22,
  },
  noteDate: {
    fontSize: 12,
    color: '#999999',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  deleteButtonText: {
    fontSize: 20,
  },
});
