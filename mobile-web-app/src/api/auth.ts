/**
 * Authentication API functions
 * Handles user signup, login, OTP verification, and logout
 */

import { makeRequest } from './client';
import {
  OTPResponse,
  AuthResponse,
  LogoutResponse,
} from '../types';

/**
 * Request signup with email
 * Sends OTP to the provided email address
 * 
 * @param email - User's email address
 * @returns Promise with success message
 */
export async function signup(email: string): Promise<OTPResponse> {
  return makeRequest<OTPResponse>({
    method: 'POST',
    endpoint: '/auth/signup',
    body: { email },
  });
}

/**
 * Verify signup with OTP
 * Creates user account and returns session token
 * 
 * @param email - User's email address
 * @param otp - One-time password received via email
 * @returns Promise with session token and userId
 */
export async function verifySignup(email: string, otp: string): Promise<AuthResponse> {
  return makeRequest<AuthResponse>({
    method: 'POST',
    endpoint: '/auth/verify-signup',
    body: { email, otp },
  });
}

/**
 * Request login with email
 * Sends OTP to the provided email address
 * 
 * @param email - User's email address
 * @returns Promise with success message
 */
export async function login(email: string): Promise<OTPResponse> {
  return makeRequest<OTPResponse>({
    method: 'POST',
    endpoint: '/auth/login',
    body: { email },
  });
}

/**
 * Verify login with OTP
 * Authenticates user and returns session token
 * 
 * @param email - User's email address
 * @param otp - One-time password received via email
 * @returns Promise with session token and userId
 */
export async function verifyLogin(email: string, otp: string): Promise<AuthResponse> {
  return makeRequest<AuthResponse>({
    method: 'POST',
    endpoint: '/auth/verify-login',
    body: { email, otp },
  });
}

/**
 * Resend OTP for signup or login
 * Invalidates previous OTP and sends a new one
 * 
 * @param email - User's email address
 * @param operation - Operation type: 'signup' or 'login'
 * @returns Promise with success message
 */
export async function resendOTP(email: string, operation: 'signup' | 'login'): Promise<OTPResponse> {
  return makeRequest<OTPResponse>({
    method: 'POST',
    endpoint: '/auth/resend-otp',
    body: { email, operation },
  });
}

/**
 * Logout user
 * Invalidates the session token
 * 
 * @param token - Session token to invalidate
 * @returns Promise with success message
 */
export async function logout(token: string): Promise<LogoutResponse> {
  return makeRequest<LogoutResponse>({
    method: 'POST',
    endpoint: '/auth/logout',
    token,
  });
}
