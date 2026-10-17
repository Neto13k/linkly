import * as userService from '../services/userService.js';

export const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserByEmail = async (req, res) => {
    try {
        const user = await userService.getUserByEmail(req.params.email);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        //validar os campos obrigatórios
        if (typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string' || !username.trim() || !email.trim() || !password.trim()) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
        }
        //validar o tamanho da senha
        if (password.length < 8 || password.trim().length < 8) {
            return res.status(400).json({ message: 'A senha deve ter pelo menos 8 caracteres' });
        }
        //validar se o email já está em uso
        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await userService.getUserByEmail(normalizedEmail);
        if (existingUser) {
            return res.status(409).json({ message: 'O email já está em uso' });
        }
        const newUser = await userService.createUser(username.trim(), normalizedEmail, password);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { username, email } = req.body;

        //validar se o ID do usuário é um número inteiro
        const userId = Number(req.params.id);
        if (isNaN(userId) || userId <= 0 || !Number.isInteger(userId)) {
            return res.status(400).json({ message: 'ID de usuário inválido' });
        }
        //validar os campos obrigatórios
        if (typeof username !== 'string' || typeof email !== 'string' || !username.trim() || !email.trim()) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
        }
        //validar se o email já está em uso por outro usuário
        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await userService.getUserByEmail(normalizedEmail);
        if (existingUser && existingUser.id !== userId) {
            return res.status(409).json({ message: 'O email já está em uso por outro usuário' });
        }
        const updatedUser = await userService.updateUser(userId, username.trim(), normalizedEmail);
        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar o usuário' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await userService.deleteUser(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario excluido com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};