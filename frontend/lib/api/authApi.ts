import { apiClient, TOKEN_KEY } from '@/lib/axios';
import type { LoginRequest, RegisterRequest, TokenResponse, User } from '@/types/auth';

/**
 * POST /auth/login
 * Returns access token — stores it in localStorage.
 */
export const login = async (data: LoginRequest): Promise<TokenResponse> => {
  const { data: response } = await apiClient.post<TokenResponse>('/auth/login', data);
  localStorage.setItem(TOKEN_KEY, response.access_token);
  return response;
};

/**
 * POST /auth/register
 * Creates a new user account. Does NOT auto-login.
 */
export const register = async (data: RegisterRequest): Promise<User> => {
  const { data: response } = await apiClient.post<User>('/auth/register', data);
  return response;
};

/**
 * GET /auth/me
 * Fetches the currently authenticated user's profile.
 */
export const getCurrentUser = async (): Promise<User> => {
  const { data } = await apiClient.get<User>('/auth/me');
  return data;
};

/**
 * Logout — clears token from localStorage.
 */
export const logout = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};
