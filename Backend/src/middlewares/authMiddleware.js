// Middleware de autenticação: valida o token JWT enviado no cabeçalho Authorization.
// Em sucesso, injeta o usuário decodificado em req.user, tornando o id disponível
// para os controllers. É o único ponto que autoriza o acesso às rotas protegidas.
import jwt from 'jsonwebtoken';
// Lido uma vez na carga do módulo para verificar os tokens
const secretKey = process.env.JWT_SECRET;

// Extrai o token do cabeçalho "Authorization: Bearer <token>", valida a assinatura e
// verifica se o payload contém um id inteiro e positivo antes de liberar a requisição.
export const authenticateToken = (req, res, next) => {
    // Só aceita o cabeçalho no formato Bearer; caso contrário, trata como ausente
    const authHeader = req.headers['authorization']?.startsWith('Bearer ') ? req.headers['authorization'] : null;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(401).json({ message: 'Token Inválido' });
        }
        
        //validar se o ID é inteiro e positivo
        if (!Number.isInteger(user?.id) || user.id <= 0) {
            return res.status(401).json({ message: 'Token Inválido' });
        }
        
        //Armazenar os dados do usuário autenticado
        req.user = user;

        next();
    });
}