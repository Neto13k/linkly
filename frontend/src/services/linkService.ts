import type { Link } from '../types/link';
import { getToken } from './sessionService';

const handleAuthError = (response: Response) => {
    if (response.status === 401) {
        throw new Error('SESSION_EXPIRED');
    }
};

export const getLinksByUserId = async (userId: number): Promise<Link[]> => {
    const token = getToken();
    if (!token) {
        throw new Error('No token found');
    }
  const response = await fetch(`/api/links/user/${userId}`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    },
  });
  handleAuthError(response);
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erro ao buscar os links do usuário');
    }
    return response.json();
};

export const createLink = async (slug: string, destinationUrl: string): Promise<Link> => {
    const token = getToken();
    if (!token) {
        throw new Error('No token found');
    }
    const response = await fetch(`/api/links`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ slug, destinationUrl }),
    });
    handleAuthError(response);
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erro ao criar o link');
    }
    return response.json();
}

export const updateLink = async (linkId: number, slug: string, destinationUrl: string): Promise<Link> => {
    const token = getToken();
    if (!token) {
        throw new Error('No token found');
    }
    const response = await fetch(`/api/links/${linkId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ slug, destinationUrl }),
    });
    handleAuthError(response);
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erro ao atualizar o link');
    }
    return response.json();
}

export const deleteLink = async (linkId: number): Promise<void> => {
    const token = getToken();
    if (!token) {
        throw new Error('No token found');
    }
    const response = await fetch(`/api/links/${linkId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    handleAuthError(response);
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erro ao deletar o link');
    }
    return;
}

