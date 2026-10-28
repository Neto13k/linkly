import type { User } from '../types/auth';

export const saveToken = (token: string): void => {
  sessionStorage.setItem('linkly_token', token);
}

export const getToken = (): string | null => {
  return sessionStorage.getItem('linkly_token');
}

export const removeToken = (): void => {
  sessionStorage.removeItem('linkly_token');
}

export const saveUser = (user: User): void => {
  sessionStorage.setItem('linkly_user', JSON.stringify(user));
}

export const getUser = (): User | null => {
  const user = sessionStorage.getItem('linkly_user');
  try {
  return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user from session storage:', error);
    return null;
  }
}

export const removeUser = (): void => {
  sessionStorage.removeItem('linkly_user');
}