/**
 * API module exports
 * Provides a centralized export for all API functions
 */

// Export authentication functions
export {
  signup,
  verifySignup,
  login,
  verifyLogin,
  resendOTP,
  logout,
} from './auth';

// Export notes functions
export {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from './notes';

// Export API client utilities
export { makeRequest, APIClientError } from './client';
