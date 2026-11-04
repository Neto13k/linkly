// Service de autenticação: comunicação com as rotas públicas /api/auth.
// Usa o fetch nativo; o caminho /api é resolvido pelo proxy do Vite (dev) ou pelo
// rewrite do vercel.json (produção). Em erro, lança Error com a mensagem do backend.
import type { AuthResponse } from '../types/auth';

// Autentica o usuário (POST /api/auth/login) e retorna token + dados do usuário.
// Lança erro com a mensagem do backend quando a resposta não é bem-sucedida.
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

// Cria uma nova conta (POST /api/auth/register) e retorna token + dados do usuário.
// O backend valida formato de username, política de senha e unicidade de e-mail.
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
