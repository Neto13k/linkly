//service para lidar com as requisições relacionadas ao usuário
// Acessa /api/users/:id (rotas protegidas): leitura, atualização de e-mail e exclusão de conta.
// Envia o token da sessão no cabeçalho Authorization em todas as chamadas.

import type { User } from '../types/auth';
import { getToken } from './sessionService';

// Converte a resposta 401 em erro-sentinela 'SESSION_EXPIRED', tratado por useSessionError.
const handleAuthError = (response: Response) => {
    if (response.status === 401) {
        throw new Error('SESSION_EXPIRED');
    }
};

// Busca os dados do usuário autenticado (GET /api/users/:id).
export const getUserById = async (userId: number): Promise<User> => {
    const token = getToken()
    if (!token) {
        throw new Error('No token found')
    }

    const response = await fetch(`/api/users/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    handleAuthError(response)
    if (!response.ok) {
        throw new Error('Failed to fetch user')
    }
    const userData = await response.json()
    return userData
}

// Atualiza o e-mail do usuário (PUT /api/users/:id) e retorna os dados atualizados.
export const updateUser = async (userId: number, email: string): Promise<User> => {
    const token = getToken()
    if (!token) {
        throw new Error('No token found')
    }
    const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email })
    })
    handleAuthError(response)
    if (!response.ok) {
        throw new Error('Falha ao atualizar usuário')
    }

    const updatedUserData = await response.json()
    return updatedUserData
}

// Exclui a conta do usuário (DELETE /api/users/:id). No backend, isso também bloqueia
// o username e remove, em cascata, os links do usuário.
export const deleteUser = async (userId: number): Promise<void> => {
    const token = getToken()
    if (!token) {
        throw new Error('No token found')
    }
    const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    handleAuthError(response)
    if (!response.ok) {
        throw new Error('Falha ao deletar usuário')
    }
    return 
}