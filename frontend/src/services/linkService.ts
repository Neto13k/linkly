// Service de links: CRUD contra /api/links (rotas protegidas por token).
// Cada função obtém o token da sessão e o envia no cabeçalho Authorization.
// Lança 'No token found' quando não há sessão e propaga as mensagens de erro do backend.
import type { Link } from '../types/link';
import { getToken } from './sessionService';

// Converte a resposta 401 (token ausente/expirado) em um erro-sentinela 'SESSION_EXPIRED'.
// O hook useSessionError reconhece esse valor para limpar a sessão e redirecionar o usuário
// ao login, centralizando o tratamento de expiração em todas as páginas.
const handleAuthError = (response: Response) => {
    if (response.status === 401) {
        throw new Error('SESSION_EXPIRED');
    }
};

// Busca todos os links do usuário (GET /api/links/user/:userId).
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

// Cria um link (POST /api/links). O backend valida slug e URL e retorna o link criado.
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

// Atualiza slug e URL de um link existente (PUT /api/links/:id) e retorna o link atualizado.
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

// Exclui um link (DELETE /api/links/:id). Não retorna corpo em caso de sucesso.
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

