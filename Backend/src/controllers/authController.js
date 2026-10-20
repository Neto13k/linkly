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