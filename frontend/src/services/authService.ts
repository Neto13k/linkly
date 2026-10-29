import type { AuthResponse } from '../types/auth';

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to login');
    }

    return response.json();
};

export const register = async  ( username: string, email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to register');
    }

    return response.json();
}
