// Controller de autenticação: login e registro de usuários.
// Valida a entrada, delega a regra de negócio ao userService e emite o token JWT.
import * as userService from '../services/userService.js';
import jwt from 'jsonwebtoken';

// Autentica um usuário existente (POST /api/auth/login).
// Entrada: { email, password } no corpo da requisição.
// Saída: { token, user } em caso de sucesso; 400 se faltarem campos; 401 para credenciais inválidas.
export const loginUser = async (req, res) => {
    try {
    //validar se o email e a senha foram fornecidos
    const { email, password } = req.body ?? {};
    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password.trim()) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }
    const user = await userService.authenticateUser(email, password);
    if (!user) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    // Emite o token JWT carregando o id do usuário; expira em 1 hora e é exigido nas rotas protegidas
    const token = jwt.sign({ id: user.id,}, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token, user: { id: user.id, username: user.username, email: user.email, created_at: user.created_at} }); // Retorna o token e os dados do usuário
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// Registra um novo usuário (POST /api/auth/register).
// Aplica, na ordem: campos obrigatórios, formato do username, lista de nomes bloqueados,
// política de senha, formato do e-mail e unicidade do e-mail. Em sucesso, cria o usuário
// e já retorna o token, deixando o usuário autenticado.
export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body ?? {};
        if (typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string' || !username.trim() || !email.trim() || !password.trim()) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
        }

        // Validar username (3 a 30 caracteres, letras minúsculas, números e hífens)
        const usernameRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
        if (!usernameRegex.test(username) || username.length < 3 || username.length > 30) {
            return res.status(400).json({ message: 'O nome de usuário deve ter entre 3 e 30 caracteres e conter apenas letras minúsculas, números e hífens' });
        }

        // Verificar se o nome de usuário está bloqueado
        const isBlocked = await userService.isUsernameBlocked(username);
        if (isBlocked) {
            return res.status(409).json({ message: 'O nome de usuário selecionado está bloqueado' });
        }

        // validar senha (mínimo 8 caracteres, pelo menos uma letra maiúscula, uma letra minúscula e um número)
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: 'A senha deve ter no mínimo 8 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula um número e um caractere especial' });
        }

        // validar e-mail (formato válido)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({ message: 'Formato de e-mail inválido' });
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
        // Emite o token logo após o cadastro para que o usuário já saia autenticado
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(201).json({ token, user: { id: user.id, username: user.username, email: user.email, created_at: user.created_at }, message: 'Usuário registrado com sucesso' }); // Retorna o token e os dados do usuário
    } catch (error) {
        if (error.code === '23505') { // código de erro do PostgreSQL para violação de chave única
            // Rede de segurança para corrida entre a checagem prévia de e-mail e o INSERT
            return res.status(409).json({ message: 'E-mail ou nome de usuário já cadastrado' });
        }
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};