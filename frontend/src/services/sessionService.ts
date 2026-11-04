// Persistência da sessão no navegador usando sessionStorage.
// A sessão é por aba e some ao fechá-la, o que reduz a exposição do token JWT.
// As chaves usadas são 'linkly_token' (string) e 'linkly_user' (JSON serializado).
import type { User } from '../types/auth';

// Salva o token JWT da sessão no sessionStorage.
export const saveToken = (token: string): void => {
  sessionStorage.setItem('linkly_token', token);
}

// Recupera o token JWT salvo (ou null se não houver). Base para a proteção de rotas.
export const getToken = (): string | null => {
  return sessionStorage.getItem('linkly_token');
}

// Remove o token da sessão (usado no logout, na exclusão de conta e na expiração de sessão).
export const removeToken = (): void => {
  sessionStorage.removeItem('linkly_token');
}

// Salva os dados do usuário autenticado, serializados em JSON.
export const saveUser = (user: User): void => {
  sessionStorage.setItem('linkly_user', JSON.stringify(user));
}

// Recupera os dados do usuário salvos ou null.
// O JSON.parse é envolvido em try/catch: se o conteúdo estiver corrompido, retorna null
// em vez de quebrar a aplicação.
export const getUser = (): User | null => {
  const user = sessionStorage.getItem('linkly_user');
  try {
  return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user from session storage:', error);
    return null;
  }
}

// Remove os dados do usuário da sessão.
export const removeUser = (): void => {
  sessionStorage.removeItem('linkly_user');
}