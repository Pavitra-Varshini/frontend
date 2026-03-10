/**
 * Notes API functions
 * Handles CRUD operations for user notes
 * IMPORTANT: userId is NEVER included in request payloads - it's extracted from the session token on the backend
 */

import { makeRequest } from './client';
import {
  Note,
  GetNotesResponse,
  CreateNoteResponse,
  UpdateNoteResponse,
  DeleteNoteResponse,
} from '../types';

/**
 * Get all notes for the authenticated user
 * Notes are returned sorted by updatedAt in descending order
 * 
 * @param token - Session token for authentication
 * @returns Promise with array of notes
 */
export async function getNotes(token: string): Promise<Note[]> {
  const response = await makeRequest<GetNotesResponse>({
    method: 'GET',
    endpoint: '/notes',
    token,
  });
  return response.notes;
}

/**
 * Create a new note
 * The userId is extracted from the session token on the backend
 * 
 * @param token - Session token for authentication
 * @param title - Note title
 * @param content - Note content
 * @returns Promise with the created note
 */
export async function createNote(
  token: string,
  title: string,
  content: string
): Promise<Note> {
  const response = await makeRequest<CreateNoteResponse>({
    method: 'POST',
    endpoint: '/notes',
    body: { title, content }, // userId is NOT included - extracted from token on backend
    token,
  });
  return response.note;
}

/**
 * Update an existing note
 * The userId is extracted from the session token on the backend
 * Ownership is verified on the backend
 * 
 * @param token - Session token for authentication
 * @param noteId - ID of the note to update
 * @param title - Updated note title
 * @param content - Updated note content
 * @returns Promise with the updated note
 */
export async function updateNote(
  token: string,
  noteId: string,
  title: string,
  content: string
): Promise<Note> {
  const response = await makeRequest<UpdateNoteResponse>({
    method: 'PUT',
    endpoint: `/notes/${noteId}`,
    body: { title, content }, // userId is NOT included - extracted from token on backend
    token,
  });
  return response.note;
}

/**
 * Delete a note
 * The userId is extracted from the session token on the backend
 * Ownership is verified on the backend
 * 
 * @param token - Session token for authentication
 * @param noteId - ID of the note to delete
 * @returns Promise with success message
 */
export async function deleteNote(token: string, noteId: string): Promise<void> {
  await makeRequest<DeleteNoteResponse>({
    method: 'DELETE',
    endpoint: `/notes/${noteId}`,
    token,
  });
}
