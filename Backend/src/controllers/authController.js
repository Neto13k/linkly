import * as userService from '../services/userService.js';
import jwt from 'jsonwebtoken';

export const loginUser = async (req, res) => {
    try {
    //validar se o email e a senha foram fornecidos
    const { email, password } = req.body;
    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password.trim()) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }
    const user = await userService.authenticateUser(email, password);
    if (!user) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    const token = jwt.sign({ id: user.id,}, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string' || !username.trim() || !email.trim() || !password.trim()) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
        }

        // Validar username (3 a 30 caracteres, letras minúsculas, números e hífens)
        const usernameRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
        if (!usernameRegex.test(username) || username.length < 3 || username.length > 30) {
            return res.status(400).json({ message: 'O nome de usuário deve ter entre 3 e 30 caracteres e conter apenas letras minúsculas, números e hífens' });
        }
        
        // validar senha (mínimo 8 caracteres, pelo menos uma letra maiúscula, uma letra minúscula e um número)
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: 'A senha deve ter no mínimo 8 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula um número e um caractere especial' });
        }

        //validar se e-mail não está em uso
        const existingEmail = await userService.getUserByEmail(email.trim().toLowerCase());
        if (existingEmail) {
            return res.status(409).json({ message: 'E-mail já está em uso' });
        }
        
        // Criar o usuário
        const user = await userService.createUser(username, email, password);
        if (!user) {
            return res.status(400).json({ message: 'Erro ao criar usuário' });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(201).json({ message: 'Usuário registrado com sucesso', token });
    } catch (error) {
        if (error.code === '23505') { // código de erro do PostgreSQL para violação de chave única
            return res.status(409).json({ message: 'E-mail ou nome de usuário já cadastrado' });
        }
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};