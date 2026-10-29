//service para lidar com as requisições relacionadas ao usuário

import type { User } from '../types/auth';
import { getToken } from './sessionService';

const handleAuthError = (response: Response) => {
    if (response.status === 401) {
        throw new Error('SESSION_EXPIRED');
    }
};

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
        throw new Error('Failed to update user')
    }

    const updatedUserData = await response.json()
    return updatedUserData
}

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
        throw new Error('Failed to delete user')
    }
    return 
}