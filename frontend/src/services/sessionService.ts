export const saveToken = (token: string): void => {
  sessionStorage.setItem('linkly_token', token);
}

export const getToken = (): string | null => {
  return sessionStorage.getItem('linkly_token');
}

export const removeToken = (): void => {
  sessionStorage.removeItem('linkly_token');
}