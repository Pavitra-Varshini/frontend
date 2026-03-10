/**
 * Base API client with error handling
 * Provides core HTTP request functionality with authentication and error mapping
 */

import { APIError, ErrorResponse } from '../types';
import { config } from '../config/environment';

/**
 * Custom error class for API errors
 */
export class APIClientError extends Error implements APIError {
  code?: string;
  status?: number;

  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = 'APIClientError';
    this.code = code;
    this.status = status;
  }
}

/**
 * Configuration for API requests
 */
interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  body?: any;
  token?: string;
}

/**
 * Get the API base URL from environment configuration
 */
const getBaseURL = (): string => {
  return config.apiBaseUrl;
};

/**
 * Make an HTTP request to the API
 * Handles authentication, JSON parsing, and error mapping
 * 
 * @param config - Request configuration
 * @returns Parsed JSON response
 * @throws APIClientError for network errors or HTTP errors
 */
export async function makeRequest<T>(config: RequestConfig): Promise<T> {
  const { method, endpoint, body, token } = config;
  const url = `${getBaseURL()}${endpoint}`;

  // Build headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add Authorization header for authenticated requests
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    // Make the fetch request
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    // Parse JSON response
    let data: any;
    try {
      data = await response.json();
    } catch (parseError) {
      // If JSON parsing fails, throw a network error
      throw new APIClientError(
        'Failed to parse server response',
        'PARSE_ERROR',
        response.status
      );
    }

    // Handle HTTP error status codes
    if (!response.ok) {
      // Map HTTP status codes to error types
      const errorResponse = data as ErrorResponse;
      const errorMessage = errorResponse.error?.message || 'An error occurred';
      const errorCode = errorResponse.error?.code || mapStatusToErrorCode(response.status);

      throw new APIClientError(errorMessage, errorCode, response.status);
    }

    return data as T;
  } catch (error) {
    // Handle network errors
    if (error instanceof APIClientError) {
      throw error;
    }

    // Network connectivity issues
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new APIClientError(
        'Unable to connect. Please check your internet connection.',
        'NETWORK_ERROR'
      );
    }

    // Unknown errors
    throw new APIClientError(
      'An unexpected error occurred',
      'UNKNOWN_ERROR'
    );
  }
}

/**
 * Map HTTP status codes to error codes
 * 
 * @param status - HTTP status code
 * @returns Error code string
 */
function mapStatusToErrorCode(status: number): string {
  switch (status) {
    case 400:
      return 'VALIDATION_ERROR';
    case 401:
      return 'AUTHENTICATION_ERROR';
    case 403:
      return 'AUTHORIZATION_ERROR';
    case 404:
      return 'NOT_FOUND';
    case 429:
      return 'RATE_LIMIT_EXCEEDED';
    case 500:
      return 'INTERNAL_ERROR';
    default:
      return 'UNKNOWN_ERROR';
  }
}
