import type { Link } from '../types/link';
import { getToken } from './sessionService';

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
  if (!response.ok) {
    throw new Error('Failed to fetch links');
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
    if (!response.ok) {
        throw new Error('Failed to create link');
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
    if (!response.ok) {
        throw new Error('Failed to update link');
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
    if (!response.ok) {
        throw new Error('Failed to delete link');
    }
    return;
}

