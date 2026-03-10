/**
 * Core data models for the Notes application
 */

/**
 * User interface representing an authenticated user
 */
export interface User {
  userId: string;
  email: string;
}

/**
 * Note interface representing a user's note
 */
export interface Note {
  noteId: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * SessionToken interface representing authentication credentials
 */
export interface SessionToken {
  token: string;
  userId: string;
}

/**
 * APIError interface representing error responses from the API
 */
export interface APIError {
  message: string;
  code?: string;
}

/**
 * API Response Types
 */

/**
 * Generic success message response
 */
export interface MessageResponse {
  message: string;
}

/**
 * Authentication response with session token
 */
export interface AuthResponse {
  token: string;
  userId: string;
}

/**
 * Response for signup/login OTP request
 */
export interface OTPResponse {
  message: string;
}

/**
 * Response for note creation
 */
export interface CreateNoteResponse {
  note: Note;
}

/**
 * Response for note update
 */
export interface UpdateNoteResponse {
  note: Note;
}

/**
 * Response for getting all notes
 */
export interface GetNotesResponse {
  notes: Note[];
}

/**
 * Response for note deletion
 */
export interface DeleteNoteResponse {
  message: string;
}

/**
 * Response for logout
 */
export interface LogoutResponse {
  message: string;
}

/**
 * Error response structure
 */
export interface ErrorResponse {
  error: {
    message: string;
    code: string;
    details?: Record<string, any>;
  };
}
