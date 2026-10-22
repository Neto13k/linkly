import * as userService from '../services/userService.js';

export const getUserById = async (req, res) => {
    try { 
        //validar se o ID do usuário é um número inteiro
        const userId = Number(req.params.id);
        if (isNaN(userId) || userId <= 0 || !Number.isInteger(userId)) {
            return res.status(400).json({ message: 'ID de usuário inválido' });
        }

        //validar autenticação do usuário (exemplo: verificar se o usuário logado é o mesmo que está sendo buscado)
        if (req.user.id !== userId) {
            return res.status(403).json({ message: 'Acesso negado' });
        }

        const user = await userService.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar o usuário' });
    }
};


export const updateUser = async (req, res) => {
    try {
        const { email } = req.body;

        //validar se o ID do usuário é um número inteiro
        const userId = Number(req.params.id);
        if (isNaN(userId) || userId <= 0 || !Number.isInteger(userId)) {
            return res.status(400).json({ message: 'ID de usuário inválido' });
        }

        //validar autenticação do usuário (exemplo: verificar se o usuário logado é o mesmo que está sendo atualizado)
        if (req.user.id !== userId) {
            return res.status(403).json({ message: 'Acesso negado' });
        }

        //validar os campos obrigatórios
        if (typeof email !== 'string' || !email.trim()) {
            return res.status(400).json({ message: 'O campo email é obrigatório' });
        }
        
        //validar se o email já está em uso por outro usuário
        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await userService.getUserByEmail(normalizedEmail);
        if (existingUser && existingUser.id !== userId) {
            return res.status(409).json({ message: 'O email já está em uso por outro usuário' });
        }
        const updatedUser = await userService.updateUser(userId, normalizedEmail);
        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(updatedUser);
    } catch (error) {
        if (error.code === '23505') { // código de erro do PostgreSQL para violação de chave única
            return res.status(409).json({ message: 'O email já está em uso' });
        }
        res.status(500).json({ message: 'Erro ao atualizar o usuário' });
    }
};

export const deleteUser = async (req, res) => {
    try {

        //validar se o ID do usuário é um número inteiro
        const userId = Number(req.params.id);
        if (isNaN(userId) || userId <= 0 || !Number.isInteger(userId)) {
            return res.status(400).json({ message: 'ID de usuário inválido' });
        }
        //validar autenticação do usuário (exemplo: verificar se o usuário logado é o mesmo que está sendo excluído)
        if (req.user.id !== userId) {
            return res.status(403).json({ message: 'Acesso negado' });
        }

        //chamar o serviço para excluir o usuário
        const deletedUser = await userService.deleteUser(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario excluido com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir o usuário' });
    }
};