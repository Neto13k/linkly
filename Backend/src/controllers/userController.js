// Controller de usuários: leitura, atualização de e-mail e exclusão de conta.
// Todas as ações exigem autenticação e só podem ser feitas pelo próprio usuário
// (compara-se o id da rota com req.user.id, retornando 403 em caso de divergência).
import * as userService from '../services/userService.js';

// Retorna os dados públicos do usuário autenticado (GET /api/users/:id).
// Não expõe o hash da senha: o SELECT do service retorna apenas id, username, email e created_at.
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
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar o usuário' });
    }
};


// Atualiza o e-mail do usuário autenticado (PUT /api/users/:id).
// Valida formato e unicidade: rejeita (409) o e-mail já usado por outro usuário; o e-mail atual do próprio é aceito.
export const updateUser = async (req, res) => {
    try {
        const { email } = req.body ?? {};

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

        //validar e-mail (formato válido)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({ message: 'Formato de e-mail inválido' });
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
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar o usuário' });
    }
};

// Exclui a conta do usuário autenticado (DELETE /api/users/:id).
// Em cascata, o banco também remove os links do usuário; o nome de usuário passa a ser bloqueado.
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
        console.error(error);
        res.status(500).json({ message: 'Erro ao excluir o usuário' });
    }
};